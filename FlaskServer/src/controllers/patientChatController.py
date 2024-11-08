import google.generativeai as genai
from dotenv import load_dotenv
import os
from flask import request

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
    {
      "role": "user",
      "parts": [
        "This is a patient you are talking to, answer all upcoming prompts accordingly\n",
      ],
    },
  ]
)

def chatController():
    data = request.get_json()
    prompt = data.get('prompt')
    context = data.get('context')

    # Send the prompt to the chat session
    response = chat_session.send_message(context + " " +prompt)
    print(response.text)

    newContext = chat_session.send_message("Make a new context from the sum of new response: "+response.text+" and the current context: "+context+" . Only reply with plain text only. No bold, no /n etc.")
    print(newContext.text)
    
    return {
        "message": "Chat executed successfully",
        "response": response.text,
        "newContext": newContext.text,
    }, 201