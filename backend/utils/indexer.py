import re

from langchain.text_splitter import MarkdownHeaderTextSplitter
from langchain_core.documents.base import Document

def get_course(text: str) -> str:
    #Course Prefix, Number, Section
    #Course Number/Section 
    #Course
    #Title
    course = re.search(r'([a-zA-Z][a-zA-Z][\/\\]?[a-zA-Z]?[a-zA-Z]?[\s\-]?\d[A-Z0-9]\d\d\.[a-zA-Z0-9][a-zA-Z0-9][A-Z0-9])', text)
    if course:
        return course.group().replace(" ", "").replace("-", "").replace("/", "-").upper()
    course = re.search(r'(Course|Section|Title|Number):?[\|\s]*?([a-zA-Z][a-zA-Z][\/\\]?[a-zA-Z]?[a-zA-Z]?[\s\-]?\d[A-Z0-9]\d\d)', text)
    section = re.search(r'(Section):?[\|\s]+([A-Z0-9][A-Z0-9][A-Z0-9])', text)
    
    course = course.group(2).replace(" ", "").replace("-", "").replace("/", "-").upper() if course else ""
    section = section.group(2).replace(" ", "").upper() if course and section else ""
    if not course.startswith(section):
        course += "."+ section
    return course

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
