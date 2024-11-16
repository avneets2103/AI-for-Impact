import google.generativeai as genai
from dotenv import load_dotenv
import os
from flask import request
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, AutoModel
from pinecone import Pinecone

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

tokenizer2 = AutoTokenizer.from_pretrained("dmis-lab/biobert-base-cased-v1.1")
model2 = AutoModel.from_pretrained("dmis-lab/biobert-base-cased-v1.1")
index_name = os.getenv("PINECONE_INDEX_NAME")
api_key = os.getenv("PINECONE_API_KEY")
pc = Pinecone(api_key=api_key)
index = pc.Index(index_name)

def get_embeddings(text, tokenizer, model):
    # Tokenize the text
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
    return outputs.last_hidden_state.mean(dim=1)

def getRelevant(data):
    patientId = data.get('patientId')
    queryText = data.get('prompt')

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

    return searchText

def chatController():
    chat_session = model.start_chat(
        history=[
            {
            "role": "user",
            "parts": [
                #   Make Change
                "This is an expert medical practiotioner you are talking to. You are expected to use medical jargon for better understanding and accurate results. The patient is Male and their age is 21 years. The\n",
            ],
            },
        ]
    )
    data = request.get_json() # get user data (Post request )
    prompt = data.get('prompt') #change namespace
    relevant = getRelevant(data) # get embeddings 
    context = data.get('context') # get context

    # Send the prompt to the chat session
    response = chat_session.send_message("Act like a Differential Medical Diagnosis tool. The existing context of the patient is: "+context + "I want your expert opinion on: " +prompt + "Use proper medical terms, as if you're talking to expert medical practiotioner. The existing data that is relevant to my promt for the patient is as follows:" + relevant )

    newContext = chat_session.send_message("Make a new context from the sum of new response that conserves all the major data: "+response.text+" and the current context: "+context+" . Only reply with plain text only.")
    
    return {
        "message": "Chat executed successfully",
        "response": response.text,
        "newContext": newContext.text,
    }, 201