import os
import binascii
from django.db import migrations

def seed_users_and_history(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    UserHistory = apps.get_model('analyzer', 'UserHistory')
    Token = apps.get_model('authtoken', 'Token')
    from django.contrib.auth.hashers import make_password

    # Clean up obsolete demo accounts if present
    User.objects.filter(username__in=["reception@hospital.com", "admin"]).delete()

    demo_accounts = [
        ("student", "student@2026"),
        ("reo", "reo123"),
    ]

    for uname, pwd in demo_accounts:
        user, created = User.objects.get_or_create(
            username=uname,
            defaults={'password': make_password(pwd)}
        )
        if not created:
            user.password = make_password(pwd)
            user.save()
        
        if not Token.objects.filter(user=user).exists():
            key = binascii.hexlify(os.urandom(20)).decode()
            Token.objects.create(user=user, key=key)

        if not UserHistory.objects.filter(user=user).exists():
            UserHistory.objects.create(
                user=user,
                job_title="Full Stack Engineer (React / Node.js / TypeScript)",
                file_name="ANS_REVALDO_ATS_Resume.pdf",
                match_score=85
            )


class Migration(migrations.Migration):

    dependencies = [
        ('analyzer', '0001_initial'),
        ('authtoken', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_users_and_history, reverse_code=migrations.RunPython.noop),
    ]

