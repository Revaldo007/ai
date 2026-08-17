# pyrefly: ignore [missing-import]
from django.apps import AppConfig
from django.db.models.signals import post_migrate

def seed_demo_data(sender, **kwargs):
    from django.contrib.auth.models import User
    from analyzer.models import UserHistory
    from rest_framework.authtoken.models import Token

    # Clean up obsolete demo accounts if present
    User.objects.filter(username__in=["reception@hospital.com", "admin"]).delete()

    # Default demo users to ensure immediate out-of-the-box functionality
    demo_accounts = [
        ("student", "student@2026"),
        ("reo", "reo123"),
    ]

    for uname, pwd in demo_accounts:
        user, created = User.objects.get_or_create(username=uname)
        if created or not user.has_usable_password():
            user.set_password(pwd)
            user.save()
        Token.objects.get_or_create(user=user)

        # Seed initial history if none exists for this user
        if not UserHistory.objects.filter(user=user).exists():
            UserHistory.objects.create(
                user=user,
                job_title="Full Stack Engineer (React / Node.js / TypeScript)",
                file_name="ANS_REVALDO_ATS_Resume.pdf",
                match_score=85
            )


class AnalyzerConfig(AppConfig):
    name = 'analyzer'

    def ready(self):
        post_migrate.connect(seed_demo_data, sender=self)

