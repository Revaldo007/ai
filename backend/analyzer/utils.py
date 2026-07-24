import pdfplumber
import docx

def extract_text_from_file(uploaded_file):
    filename = uploaded_file.name.lower()
    extracted_text = ""

    try:
        if filename.endswith('.pdf'):
            with pdfplumber.open(uploaded_file) as pdf:
                for page in pdf.pages:
                    text = page.extract_text()
                    if text:
                        extracted_text += text + "\n"

        elif filename.endswith('.docx') or filename.endswith('.doc'):
            doc = docx.Document(uploaded_file)
            for para in doc.paragraphs:
                extracted_text += para.text + "\n"

    except Exception as e:
        print(f"Error parsing file: {e}")
        return ""

    return extracted_text.strip()