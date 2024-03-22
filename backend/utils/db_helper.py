import os

import chromadb
from data import Data

base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
db_path = os.path.join(base_path, "chromadb")

client = chromadb.PersistentClient(path=db_path)

def add_to_collection(course: str, data: Data):

    c = client.get_or_create_collection(course)

    documents = [doc.page_content for doc in data.documents]
    embeddings = data.embeddings
    metadatas = [doc.metadata for doc in data.documents]
    ids = [f"{course}_{i}" for i in range(data.documents)]

    c.add(documents=documents,
            metadatas=metadatas,
            embeddings=embeddings,
            ids=ids)
    
    client.heartbeat()


def remove_from_collection(course: str, data: Data):
    try:
        c = client.get_collection(course)
    except Exception as e:
        print(f"Could not find collection {course} : {e}")    

    c.delete(ids=[f"{course}_{i}" for i in range(data.documents)])
    client.heartbeat()
