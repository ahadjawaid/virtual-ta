import os

# From:
# https://api.python.langchain.com/en/latest/vectorstores/langchain_pinecone.vectorstores.PineconeVectorStore.html
from langchain_pinecone.vectorstores import PineconeVectorStore
from langchain_core.documents.base import Document
from pinecone import PodSpec, Pinecone as PineconeClient
from dotenv import load_dotenv

from indexer import embeddings

load_dotenv()
pc = PineconeClient(
 api_key=os.environ["PINECONE_API_KEY"]
)

index_name = ""

if index_name not in pc.list_indexes().names():
    pc.create_index(
      name=index_name,
      metric="cosine",
      dimension=1536,
      spec=PodSpec(environment="us-west1-gcp", pod_type="s1.x1")
)

index = pc.Index(index_name)

def add_to_collection(course: str, documents: list[Document]):
    vectorstore = PineconeVectorStore.from_existing_index(
        index_name=index_name,
        embedding=embeddings,
        namespace=course,
    )

    vectorstore.add_documents(documents=documents)


def clear_collection(course: str):
    try:
        vectorstore = PineconeVectorStore.from_existing_index(
            index_name=index_name,
            embedding=embeddings,
            namespace=course,
        )
        vectorstore.delete(delete_all=True, namespace=course)
    except Exception as e:
        print(f"Could not find collection {course} : {e}")
