import os
import pypdf
import docx  # From python-docx
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import UserHistory

from .ai_service import analyze_resume_with_gemini, ValidationError

def extract_text_from_docx(file_obj):
    try:
        file_obj.seek(0)
        doc = docx.Document(file_obj)
        full_text = [para.text for para in doc.paragraphs if para.text]
        return '\n'.join(full_text)
    except Exception as e:
        print(f"DOCX extraction error: {e}")
        return None

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if not username or not password:
        return Response({'error': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
    user = User.objects.create_user(username=username, password=password)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key, 'username': user.username}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'username': user.username}, status=status.HTTP_200_OK)
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_history(request):
    history = UserHistory.objects.filter(user=request.user)
    data = [
        {
            'id': h.id,
            'job_title': h.job_title,
            'file_name': h.file_name,
            'match_score': h.match_score,
            'created_at': h.created_at
        } for h in history
    ]
    return Response(data, status=status.HTTP_200_OK)

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
        file_name = file_obj.name
        _, file_extension = os.path.splitext(file_name.lower())
        job_title = request.data.get('job_title', 'Software Developer')

        extracted_text = ""

        # 2. Strategy-based text extraction based on file extension
        try:
            if file_extension == '.pdf':
                # --- Primary Strategy: Try pdfplumber ---
                try:
                    import pdfplumber
                    file_obj.seek(0)
                    with pdfplumber.open(file_obj) as pdf:
                        for page in pdf.pages:
                            text = page.extract_text(layout=True) or page.extract_text() or ""
                            extracted_text += text + "\n"
                except Exception as pdf_p_err:
                    print(f"pdfplumber extraction failed: {pdf_p_err}")
                    extracted_text = ""  # Reset buffer before attempting fallback

                # --- Fallback Strategy: pypdf ---
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

            elif file_extension == '.docx':
                text = extract_text_from_docx(file_obj)
                if text is not None:
                    extracted_text = text
                else:
                    raise Exception("python-docx failed to read file.")

            elif file_extension == '.txt':
                file_obj.seek(0)
                extracted_text = file_obj.read().decode('utf-8', errors='ignore')

            else:
                return Response(
                    {"error": f"Unsupported file type ({file_extension}). Please upload PDF, DOCX, or TXT."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        except Exception as extract_err:
            return Response(
                {"error": f"Failed to extract text from {file_extension} file: {str(extract_err)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 3. Check for empty or unreadable text
        if not extracted_text.strip():
            return Response(
                {"error": "The uploaded file appears to be empty or image-only."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 4. Call Gemini AI via ai_service module
        try:
            ai_response_data = analyze_resume_with_gemini(extracted_text, job_title)
        except ValidationError as val_err:
            return Response(
                {"error": str(val_err)},
                status=status.HTTP_400_BAD_REQUEST
            )

        if "error" in ai_response_data:
            return Response(
                ai_response_data,
                status=status.HTTP_400_BAD_REQUEST
            )

        # Save to history if authenticated
        if request.user and request.user.is_authenticated:
            overall_match = ai_response_data.get('overall_match', 0)
            UserHistory.objects.create(
                user=request.user,
                job_title=job_title,
                file_name=file_name,
                match_score=overall_match
            )

        return Response(ai_response_data, status=status.HTTP_200_OK)

    except Exception as e:
        print("Backend General Error:", str(e))
        return Response(
            {"error": f"Server processing error: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    


    # This file is a Django REST Framework backend controller that receives uploaded resume files (PDF, DOCX, or TXT) and a target job title,
    # extracts the text using multi-strategy libraries like pdfplumber, pypdf, or python-docx, and sends the content to
    # Google Gemini AI for evaluation before returning the results to the frontend.
    #     It bridges your user interface and the AI engine to handle file validation and secure processing, 
    # though you could alternatively implement this logic entirely on the frontend using browser libraries, 
    # through alternative backend frameworks like FastAPI or Node.js, or by using cloud-native parsing services.