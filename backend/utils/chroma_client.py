import os

import chromadb
# From:
# https://api.python.langchain.com/en/latest/vectorstores/langchain_community.vectorstores.chroma.Chroma.html
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_core.documents.base import Document


BASE_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_PATH, "chromadb")
client = chromadb.PersistentClient(path=DB_PATH)
# The embeddings take a few seconds to load
embeddings = HuggingFaceEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')

def get_collection(course: str) -> Chroma:
    return Chroma(
        persist_directory=DB_PATH,
        embedding_function=embeddings,
        collection_name=course,
        collection_metadata={"hnsw:space": "cosine"},
        client=client,
    )

def add_to_collection(course: str, documents: list[Document]) -> None:
    """
    Adds Documents to a collection in the Chroma DB
    """
    vectorstore = get_collection(course=course)
    vectorstore.add_documents(documents=documents)

def clear_collection(course: str) -> None:
    """
    Clears a collection if it exists
    Throws error if collection does not exist
    """
    collection = client.get_collection(course)
    ids = collection.get(include=[])['ids']
    collection.delete(ids=ids)

def delete_collection(course: str) -> None:
    """
    Deletes a collection if it exists
    Throws error if collection does not exist
    ** The local file may not be deleted
    """
    client.delete_collection(course)

def collection_count(course: str) -> int:
    """
    Returns number of Documents in the collection
    """
    vectorstore = get_collection(course=course)
    return vectorstore._collection.count()

def list_collections() -> list[str]:
    """
    Returns list of collections in db
    """
    return [col.name for col in client.list_collections()]