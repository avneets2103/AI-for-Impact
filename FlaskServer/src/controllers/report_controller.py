from flask import request, jsonify
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, AutoModel
import re
from dotenv import load_dotenv
import os
from pinecone import Pinecone
import google.generativeai as genai
import json

load_dotenv()

genai.configure(api_key=os.getenv("GENAI_API_KEY"))
generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 40,
  "max_output_tokens": 2000,
  "response_mime_type": "text/plain",
}
model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=generation_config,
)
chat_session = model.start_chat(
  history=[
  ]
)

# Update knowledge base endpoint
def update_kb():
    data = request.get_json()
    report_text = data.get('reportText')
    absolute_text = data.get('absoluteText')

    # Summarize individual report
    ind_report_summary = chat_session.send_message("Summarize this report for a doctor keeping only the medically relevant parts. Make it super crisp and only the parts doctor needs to worry about. "+report_text)
    print(ind_report_summary.text)

    # Summarize combined report and absolute text
    new_absolute_raw_text = f"{report_text} {absolute_text}"
    new_absolute_text = chat_session.send_message("Summarize this report for a doctor keeping only the medically relevant parts. Make it super crisp and only the parts doctor needs to worry about. "+new_absolute_raw_text)
    print(new_absolute_text.text)

    response_data = {
        "message": "Report updated successfully",
        "reportText": report_text,
        "absoluteText": absolute_text,
        "indReportSummary": ind_report_summary.text,
        "newAbsoluteText": new_absolute_text.text,
    }
    return jsonify(response_data), 201

def sentence_based_chunking(text, max_tokens=20, delimiter="[.!?]", chunk_overlap=2):
    # Step 1: Split the text into sentences based on punctuation
    sentences = re.split(f"(?<={delimiter})\s*", text.strip())

    # Step 2: Group sentences into chunks
    chunks = []
    current_chunk = []
    current_chunk_token_count = 0

    for sentence in sentences:
        sentence_tokens = sentence.split()
        sentence_token_count = len(sentence_tokens)

        if current_chunk_token_count + sentence_token_count > max_tokens:
            chunks.append(" ".join(current_chunk))
            current_chunk = sentence_tokens
            current_chunk_token_count = sentence_token_count
        else:
            current_chunk.extend(sentence_tokens)
            current_chunk_token_count += sentence_token_count

    # Add the last chunk if there's any content
    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks

def get_embeddings(text, tokenizer, model):
    # print(text)
    # Tokenize the text
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
    # print(outputs)
    return outputs.last_hidden_state.mean(dim=1)

def get_full_report_embedding(report_text, tokenizer, model, max_tokens=20, date=""):
    # Step 1: Chunk the report into sentence-based chunks
    chunks = sentence_based_chunking(report_text, max_tokens=max_tokens)

    # Step 2: Get embeddings for each chunk and store along with text and index
    embeddings = []
    for idx, chunk in enumerate(chunks):
        chunk = date + ": "+chunk
        chunk_embedding = get_embeddings(chunk, tokenizer, model)  # Get embedding for this chunk
        embeddings.append((idx, chunk, chunk_embedding))  # Store tuple: (index, chunk text, embedding)
    
    return embeddings

tokenizer2 = AutoTokenizer.from_pretrained("dmis-lab/biobert-base-cased-v1.1")
model2 = AutoModel.from_pretrained("dmis-lab/biobert-base-cased-v1.1")
index_name = os.getenv("PINECONE_INDEX_NAME")
api_key = os.getenv("PINECONE_API_KEY")
pc = Pinecone(api_key=api_key)
index = pc.Index(index_name)

# Embed report endpoint
def embed_report():
    data = request.get_json()
    reportText = data.get('reportText')
    reportId = data.get('reportId')
    patientId = data.get('patientId')
    reportLink = data.get('url')
    reportDate = data.get('date')

    # Embed reportText to chunks and get embeddings of size 768 dimensions
    reportEmbeddings = get_full_report_embedding(reportText, tokenizer2, model2, max_tokens=20, date=reportDate)
    pinecone_data = []
    for idx, chunk, embedding in reportEmbeddings:
        # Flatten the tensor to a list for Pinecone
        chunk_embedding = embedding.squeeze().tolist()  # Ensure it's a list

        # Generate unique ID for each chunk using reportId and chunk index
        vector_id = f"{reportId}_chunk_{idx}"

        # Append the data for upserting into Pinecone
        pinecone_data.append({
            "id": vector_id,
            "values": chunk_embedding,
            "metadata": {
                "reportId": reportId,
                "patientId": patientId,
                "reportText": chunk,
                "reportLink": reportLink   
            }
        })
    index.upsert(vectors=pinecone_data)
    return jsonify({"message": "Report embedded and stored successfully"}), 201

def generalReportQuery(request):
    data = request.get_json()
    patientId = data.get('patientId')
    queryText = data.get('queryText')

    # convert query text to embeddings
    queryEmbeddings = get_embeddings(queryText, tokenizer2, model2).squeeze().tolist()

    # query the index
    results = index.query(
        vector = queryEmbeddings, 
        top_k=10, 
        include_metadata=True,
        filter={
            "patientId": {"$eq": patientId}
        },
    )

    searchText = ""
    sourcesList = []
    for result in results.matches:
        searchText += result.metadata['reportText']
        sourcesList.append(result.metadata['reportLink'])
        print(result)

    response = chat_session.send_message(queryText + " .Anwer this question above, based upon the information mentioned below. "+searchText)
    print(response.text)
    
    return {
        "message": "Query executed successfully",
        "response": response.text,
        "sources": sourcesList,
    }, 201

def dateValQuery():
    data = request.get_json()
    queryText = data.get("queryText")
    patientId = data.get("patientId")

    queryTextStandardized = chat_session.send_message(queryText + " .This is the user's query, just pick the important part required to search in the medical database of reports of the patient. Eg: 'What was the blood pressure of the patient in the last 5 years?' to 'Blood Pressure in past 5 years'")
    queryText = queryTextStandardized.text

    # convert query text to embeddings
    queryEmbeddings = get_embeddings(queryText, tokenizer2, model2).squeeze().tolist()

    # query the index
    results = index.query(
        vector = queryEmbeddings, 
        top_k=50, 
        include_metadata=True,
        filter={
            "patientId": {"$eq": patientId}
        },
    )

    searchText = ""
    sourcesList = []
    for result in results.matches:
        searchText += result.metadata['reportText']
        sourcesList.append(result.metadata['reportLink'])

    response = chat_session.send_message(searchText + 'From the above text, find key value pairs for the query in type date=>value. Keep the format fixed like this example: {"date=>value": ["2023-11-12=>142", "2024-11-03=>156"], "unit": "mg/dL", "description": "Haeomoglobin concentration level in the blood measured in mg/dL", "title":"Haemoglobin concentration"}. Make sure the order of value is chronoloical in order' + queryText)
    try:
        # Ensure response is a valid JSON string
        response_data = json.loads(response.text.strip("```json")) 
    except json.JSONDecodeError as e:
        print("Error decoding JSON:", e)
        return {
            "message": "Failed to parse response",
            "error": str(e),
        }, 400

    # Extract date-value pairs
    date_value_pairs = response_data.get("date=>value", [])
    formatted_list = []
    for pair in date_value_pairs:
        date, value = pair.split("=>")
        formatted_list.append({"date": date.strip(), "value": value.strip()})

    return {
        "message": "Query executed successfully",
        "list": formatted_list,
        "unit": response_data.get("unit"),
        "sources": sourcesList,
        "description": response_data.get("description"),
        "title": response_data.get("title"),
    }, 201

# # # Load tokenizer and model
# tokenizer = AutoTokenizer.from_pretrained("whaleloops/longt5-tglobal-large-16384-pubmed-10k_steps")
# model = AutoModelForSeq2SeqLM.from_pretrained("whaleloops/longt5-tglobal-large-16384-pubmed-10k_steps")

# Function to summarize a single chunk
# def chunkSummary(chunk):
#     summary_ids = model.generate(
#         chunk,
#         max_length=1024,
#         min_length=100,
#         length_penalty=1,
#         num_beams=4,
#         early_stopping=True
#     )
#     return tokenizer.decode(summary_ids[0], skip_special_tokens=True)

# Recursive summarization for long text
# def summarize_text(text):
#     # Tokenize text
#     tokens = tokenizer.encode(text, return_tensors="pt", truncation=False)
    
#     # Split tokens into chunks of max 16384 tokens
#     token_chunks = tokens.split(16384, dim=1)
    
#     # Summarize each chunk and concatenate summaries
#     summary_text = ""
#     for chunk in token_chunks:
#         summary_text += chunkSummary(chunk)
    
#     # If there's more than one chunk, recursively summarize again
#     if len(token_chunks) > 1:
#         return summarize_text(summary_text)  # Recursive call for a concise summary
    
#     return summary_text