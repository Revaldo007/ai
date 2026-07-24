import pypdf
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status

from .ai_service import analyze_resume_with_gemini

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def analyze_resume(request):
    try:
        # 1. Validate file payload
        if 'resume' not in request.FILES:
            return Response(
                {"error": "No resume file uploaded under key 'resume'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        file_obj = request.FILES['resume']
        job_title = request.data.get('job_title', 'Software Developer')

        # 2. Extract text from PDF using pdfplumber with fallback to pypdf
        extracted_text = ""
        try:
            import pdfplumber
            file_obj.seek(0)
            with pdfplumber.open(file_obj) as pdf:
                for page in pdf.pages:
                    text = page.extract_text(layout=True) or page.extract_text() or ""
                    extracted_text += text + "\n"
        except Exception:
            extracted_text = ""

        if not extracted_text.strip():
            try:
                file_obj.seek(0)
                reader = pypdf.PdfReader(file_obj)
                for page in reader.pages:
                    extracted_text += (page.extract_text() or "") + "\n"
            except Exception as pdf_err:
                return Response(
                    {"error": f"Failed to extract text from PDF: {str(pdf_err)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        if not extracted_text.strip():
            return Response(
                {"error": "The uploaded PDF appears to be empty or image-only."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 3. Call AI Resume Analyzer via ai_service module
        ai_response_data = analyze_resume_with_gemini(extracted_text, job_title)

        if "error" in ai_response_data:
            return Response(
                ai_response_data,
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(ai_response_data, status=status.HTTP_200_OK)

    except Exception as e:
        print("Backend Error:", str(e))
        return Response(
            {"error": f"Server processing error: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )