# pyrefly: ignore [missing-import]
from django.urls import path
from .views import analyze_resume, register_user, login_user, get_user_history

urlpatterns = [
    path('analyze/', analyze_resume, name='analyze_resume'),
    path('register/', register_user, name='register_user'),
    path('login/', login_user, name='login_user'),
    path('history/', get_user_history, name='get_user_history'),
]

# This file is a Django URL routing configuration (urls.py) that maps the /analyze/ endpoint directly to your analyze_resume view function,
# making it accessible as a web API route for your frontend.