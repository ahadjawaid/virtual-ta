from flask import current_app

def query_collection(course: str, query_embeddings: list):
    try:
        c = current_app.chroma.get_collection(course)
    except Exception as e:
        print(f"Could not find collection {course} : {e}")

    results = c.query(query_embeddings=[query_embeddings], n_results=1)
    document = results['documents'][0]
    metadata = results['metadatas'][0]
    scores = [float(i) for i in results['distances'][0]] 
    return document, metadata, scores