# Backend

## Preprocess a syllabus
This project uses Adobe Extract PDF Services to perform high-quality PDF file parsing.
Use `template.env` as a reference to get the required credentials and set the environment variables.
The file is output as a .md file.

The following commands convert a PDF into a markdown file:
`python utils/extract_pdf.py [filename]`
`python utils/extract_pdf.py -d [dirname]`