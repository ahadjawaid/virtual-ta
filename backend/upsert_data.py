import sys
import os
from utils import chroma_client, extract_pdf, indexer


def process_pdf(pdf_path):
    # Read the PDF and extract the elements
    print("Extracting data:")
    extracted_data_path = extract_pdf.read_pdf(pdf_path)
    extracted_data = extract_pdf.read_elements_from_zip(extracted_data_path)
    print("Data extracted successfully.")

    # Get the course data
    print("Preprocessing:")
    course_id = indexer.get_course(extracted_data)
    print("Course:", course_id)

    # Chunk text
    docs = indexer.chunk_text(extracted_data)
    print("Number of chunks:", len(docs))

    # Add the extracted data to the Chroma database
    try:
        if chroma_client.collection_count(course_id) != 0:
            print("Collection not empty; resetting data")
            chroma_client.clear_collection(course_id)
    except:
        print("Collection does not exist. Creating new collection.")
    
    print("Adding to collection:")
    chroma_client.add_to_collection(course=course_id, documents=docs)
    print(f"{chroma_client.collection_count(course_id)} documents added to {course_id} collection")


def main():
    if len(sys.argv) != 2:
        print("Usage: python script.py [pdf_path]")
        sys.exit(1)

    pdf_path = sys.argv[1]
    if not os.path.exists(pdf_path):
        print("Error: PDF file not found.")
        sys.exit(1)

    if os.path.isdir(pdf_path):
        for f in [file for file in os.listdir(pdf_path) if file.endswith(".pdf")]:
            process_pdf(f)
    elif pdf_path.endswith(".pdf"):
        process_pdf(pdf_path)
    else:
        print("Error: Unsupported file type.")
        sys.exit(1)

    sys.exit(0)

if __name__ == '__main__':
    main()
