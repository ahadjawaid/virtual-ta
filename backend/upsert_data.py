import sys
import os
from utils import extract_pdf, indexer, pinecone_client

def process_pdf(pdf_path):
    # Initialize the pinecone client
    client = pinecone_client.get_client()
    index_name = pinecone_client.get_index_name(client)

    # Check if the index exists, if not create it
    if not pinecone_client.index_exists(client, index_name):
        pinecone_client.create_index(client, index_name)

    # Get the course data
    course_data = indexer.get_course_data(pdf_path)

    # Add the course data to the pinecone database
    pinecone_client.add_to_collection(index_name, course_data)

    # Read the PDF and extract the elements
    extracted_data_path = extract_pdf.read_pdf(pdf_path)
    extracted_data = extract_pdf.read_elements_from_zip(extracted_data_path)

    # Add the extracted data to the pinecone database
    pinecone_client.add_to_collection(index_name, extracted_data)

    # Close the pinecone client
    pinecone_client.close_client(client)

def main():
    if len(sys.argv) != 2:
        print("Usage: python script.py [pdf_path]")
        sys.exit(1)

    pdf_path = sys.argv[1]
    if not os.path.exists(pdf_path):
        print("Error: PDF file not found.")
        sys.exit(1)

    process_pdf(pdf_path)

    sys.exit(0)

if __name__ == '__main__':
    main()
