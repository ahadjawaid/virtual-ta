# Backend

## Run Flask Server
`python __init__.py`


## Upsert Data to Vectorstore
We use Chroma db to store our RAG files.
Check `/chromadb/` to see the state of our database.

The following commands upsert PDF files into our database:

`python upsert_data.py [filename]`

`python upsert_data.py [dirname]`


## Preprocess a syllabus
This project uses Adobe Extract PDF Services to perform high-quality PDF file parsing.
Use `template.env` as a reference to get the required credentials and set the environment variables.
The file is output as a .md file.

The following commands convert a PDF into a markdown file:

`python utils/extract_pdf.py [filename]`

`python utils/extract_pdf.py -d [dirname]`