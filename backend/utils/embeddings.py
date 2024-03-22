import re

from langchain.text_splitter import MarkdownHeaderTextSplitter
from langchain_core.documents.base import Document

def get_course(text: str) -> str:
    course = re.search(r'([A-Z][A-Z][A-Z]?[A-Z]?\d\d\d\d\.[A-Z0-9][A-Z0-9]\d)', text)
    return course.group() if course else ""

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

def generate_embeddings(text_chunks: list[Document]) -> list:
    pass