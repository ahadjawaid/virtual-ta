import re

from langchain.text_splitter import MarkdownHeaderTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings
from langchain_core.documents.base import Document

embeddings = HuggingFaceEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')

def get_course(text: str) -> str:
    course = re.search(r'([A-Z][A-Z][A-Z]?[A-Z]?\s?\d[A-Z0-9]\d\d\.[a-zA-Z0-9][a-zA-Z0-9]\d)', text)
    return course.group().replace(" ", "") if course else ""

def chunk_text(text: str) -> list[Document]:
    """
    While the official return type is a list of Documents,
    each document represents a chunk of the text.
    """
    splitter = MarkdownHeaderTextSplitter(
        headers_to_split_on=[
            ("#", "Header 1"),
            ("##", "Header 2"),
        ]
    )
    return splitter.split_text(text)
