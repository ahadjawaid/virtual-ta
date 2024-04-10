import os
import zipfile
import json
import re
import copy
import sys

from pathlib import Path
from adobe.pdfservices.operation.auth.credentials import Credentials
from adobe.pdfservices.operation.exception.exceptions \
    import ServiceApiException, ServiceUsageException, SdkException
from adobe.pdfservices.operation.pdfops.options.extractpdf.extract_pdf_options \
    import ExtractPDFOptions
from adobe.pdfservices.operation.pdfops.options.extractpdf.extract_element_type \
    import ExtractElementType
from adobe.pdfservices.operation.execution_context import ExecutionContext
from adobe.pdfservices.operation.io.file_ref import FileRef
from adobe.pdfservices.operation.pdfops.extract_pdf_operation import ExtractPDFOperation
from dotenv import load_dotenv
from tabulate import tabulate


base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# loading variables from .env file
load_dotenv() 
CLIENT_ID = os.environ['PDF_SERVICES_CLIENT_ID']
CLIENT_SECRET = os.environ['PDF_SERVICES_CLIENT_SECRET']

class Table:
    def __init__(self) -> None:
        self.header = []
        self.rows = []

def read_pdf(path: str) -> str:
    filename = Path(path).stem
    path = os.path.join(base_path, "output", f"{filename}_output.zip")
    
    if os.path.exists(path=path):
        return path

    try:
        # Initial setup, create credentials instance.
        credentials = Credentials.service_principal_credentials_builder(). \
            with_client_id(CLIENT_ID). \
            with_client_secret(CLIENT_SECRET). \
            build()

        execution_context = ExecutionContext.create(credentials)
        extract_pdf_operation = ExtractPDFOperation.create_new()

        source = FileRef.create_from_local_file(path)
        extract_pdf_operation.set_input(source)

        # Build ExtractPDF options and set them into the operation
        extract_pdf_options: ExtractPDFOptions = ExtractPDFOptions.builder() \
            .with_elements_to_extract([ExtractElementType.TEXT,ExtractElementType.TABLES]) \
            .build()
        extract_pdf_operation.set_options(extract_pdf_options)

        # Execute the operation.
        result: FileRef = extract_pdf_operation.execute(execution_context)

        filename = Path(path).stem
        path = os.path.join(base_path, "output", f"{filename}_output.zip")
        result.save_as(path)
        return path

    except (ServiceApiException, ServiceUsageException, SdkException) as e:
        print("Exception occurred:", e)

def read_tables_from_json(data: dict) -> list:
    table_data = [obj for obj in data["elements"] if "Text" in obj and "Table" in obj["Path"]]

    tables = []
    current_table = Table()
    row = []
    current_cell = ""
    current_cell_num = ""
    current_row = ""
    current_table_num = ""
    was_header = False

    for element in table_data:
        is_header = "TH" in element["Path"]
        if is_header:
            cell_num = re.search(pattern=r"(?<=\/TH)([\[](\d*)[\]])?(?=\/)", string=element["Path"]).group()
        else:
            cell_num = re.search(pattern=r"(?<=\/TD)([\[](\d*)[\]])?(?=\/)", string=element["Path"]).group()

        if cell_num != current_cell_num:
            current_cell_num = cell_num
            row.append(current_cell)
            current_cell = ""

        current_cell += element["Text"]

        row_num = re.search(pattern=r"(?<=\/TR)([\[](\d*)[\]])?(?=\/)", string=element["Path"]).group()
        if current_row != row_num:
            current_row = row_num
            if is_header ^ was_header and was_header:
                current_table.header = row[:]
            else:
                current_table.rows.append(row[:])

            row = []

        table_num = re.search(pattern=r"(?<=\/Table)([\[](\d*)[\]])?(?=\/)", string=element["Path"]).group()
        if table_num != current_table_num:
            current_table_num = table_num
            tables.append(copy.deepcopy(current_table))
            current_table = Table()
        
        was_header = is_header

    tables.append(current_table)

    return tables


def read_elements_from_zip(path) -> str:
    with zipfile.ZipFile(path) as z:
        raw = z.read('structuredData.json').decode()
        data = json.loads(raw)

    text = ''
    current_table_num = ''
    for element in data["elements"]:
        if "Text" in element:
            if "Table" in element["Path"]:
                # do some regex and place a marker for the table
                table_num = re.search(pattern=r"(?<=\/Table)([\[](\d*)[\]])?(?=\/)", string=element["Path"]).group(2)
                table_num = "1" if not table_num else table_num
                if current_table_num != table_num:
                    current_table_num = table_num
                    text += f"[Table:{table_num}]" + "\n"
                continue
            if "/H" in element["Path"]:
                text += "\n" \
                    + "#"*int(re.search(pattern=r"(?<=\/H)(\d+)(?=.*)", string=element["Path"]).group()) \
                    + " " + element["Text"] +"\n"
            elif "Lbl" in element["Path"]:
                text += element["Text"]
            else:
                text += element["Text"] + "\n"

    tables = read_tables_from_json(data=data)
    for index, table in enumerate(tables):
        # insert tables into the marked space
        table_text = "\nThe following is a set of row and column data:\n"
        # Add comment headers so tables render properly
        if not table.header:
            table.header = ['<!-- -->']*len(table.rows[0])
        # convert the table object to markdown format and remove extra whitespace
        table_text += tabulate(table.rows, headers=table.header, tablefmt="pipe").replace("   ", "") + "\n"
        text = text.replace(f"[Table:{index+1}]", table_text)

    return text


if __name__ == '__main__':
    if len(sys.argv) == 2:    
        filepath = sys.argv[1]

        try:
            print("Loading...")
            output_path = read_pdf(filepath)
            result_text = read_elements_from_zip(output_path)
            with open(os.path.join(base_path, "output", Path(filepath).stem + "_output.md"), \
                    "w", encoding="utf-8") as f:
                f.write(result_text)
                print("Output saved at",f.name)
        except Exception as err:
            print("Error:", err)
            exit(1)
    elif len(sys.argv) == 3: 
        if ("-d" != sys.argv[1] or not os.path.isdir(sys.argv[2])):
            print("Use command: \nextract_pdf.py [filename]\nextract_pdf.py -d [dirname]")   
        
        dirname = sys.argv[2]
        print(f"Beginning walk through dir {dirname}. Stop at any time with Ctrl+C.")

        for root, _, filenames in os.walk(dirname):
            for filepath in [f for f in filenames if f.endswith(".pdf")]:
                try:
                    print("Parsing:", filepath)
                    output_path = read_pdf(os.path.join(root,filepath))
                    result_text = read_elements_from_zip(output_path)
                    with open(os.path.join(base_path, "output", Path(filepath).stem + "_output.md"), \
                            "w", encoding="utf-8") as f:
                        f.write(result_text)
                        print("Output saved at:", f.name)
                except Exception as err:
                    print("Error:", err)
    else:
        print("Use command: \nextract_pdf.py [filename]\nextract_pdf.py -d [dirname]")
        exit(1)