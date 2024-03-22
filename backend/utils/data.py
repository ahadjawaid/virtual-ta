from langchain_core.documents.base import Document

class Data:
    def __init__(self, course: str, documents: list[Document], embeddings: list) -> None:
        self.course = course
        self.documents = documents
        self.embeddings = embeddings