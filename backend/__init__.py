import time

import torch
from langchain_community.llms import VLLM
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA
from transformers import BitsAndBytesConfig
from flask import Flask, jsonify

from utils import chroma_client


app = Flask(__name__)

def get_data(course: str):

   # Chroma collection instance
   db = chroma_client.get_collection(course=course)

   return db

def model():
   # Make model smaller
   bnb_config = BitsAndBytesConfig(
      load_in_4bit=True,
      bnb_4bit_use_double_quant=True,
      bnb_4bit_quant_type="nf4",
      bnb_4bit_compute_dtype=torch.bfloat16
   )

   # Tried 3 different LLMs
   llm = VLLM(
      model="Open-Orca/Mistral-7B-OpenOrca",
      #model="google/gemma-7b"
      #model="meta-llama/Llama-2-7b"
      quantization_config=bnb_config,
      trust_remote_code=True,
      max_new_tokens=512,
      top_k=10,
      top_p=0.5,
      temperature=0.1
   )

   return llm

def agent(db, llm):
   # Best prompt I could do
   prompt_template = """
   Given the following text by user, extract the part that is unbiased and not their opinion, so that using
   text alone would be good context for providing an unbiased answer to question portion of the text.

   Please include the actual question or query that the user is asking. Separate this into two categories
   labeled with \"Unbiased text context (includes all content except user's bias):\" and \"Question/Query
   (does not include user bias/preference):\".

   Context: {context}
   Question: {question}
   """

   PROMPT = PromptTemplate(
      template = prompt_template,
      input_variables = ["context", "question"]
   )

   chain_type_kwargs = {"prompt": PROMPT}

   retriever = db.as_retriever(
      search_kwargs = {'k': 3}, # Top 3 similar to question
      chain_type_kwargs = chain_type_kwargs,
      return_source_documents = True
   )

   qa = RetrievalQA.from_chain_type(
      llm=llm,
      chain_type="stuff",
      retriever=retriever
   )

   return qa

@app.route("/inference/<course>")
def inference(course, question):
   # Record the start time
   start_time = time.time()
   db = get_data(course)
   llm = model()

   qa = agent(db, llm)
   ans = qa({'query':question})
   #print(ans['result'])

   # Record the end time
   end_time = time.time()

   # Calculate the elapsed time
   #elapsed_time = end_time - start_time
   #print(f"Start Time: {start_time}")
   #print(f"End Time: {end_time}")
   #print(f"Elapsed Time: {elapsed_time} seconds")

   return jsonify({"message": ans["result"]})

if __name__ == "__main__":
   app.run(host="0.0.0.0", port=8000, debug=True)