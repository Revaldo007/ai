import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from analyzer.ai_service import generate_deep_resume_analysis

resume = """
Skills: Python, JavaScript, TypeScript, Java, React.js, Next.js, Vite, Tailwind CSS,
Node.js, Express.js, FastAPI, PostgreSQL, MongoDB, Redis, Git, Docker
"""

test_cases = [
    ("Software Developer",         "80-95%"),
    ("Full Stack Developer",        "80-95%"),
    ("Frontend Developer",         "80-95%"),
    ("Backend Engineer",           "70-90%"),
    ("Blockchain Developer",       "40-65%"),
    ("MLOps Engineer",             "40-65%"),
    ("Ethical Hacker",             "35-55%"),
    ("Unity Game Developer",       "35-55%"),
    ("DevOps Engineer",            "50-75%"),
    ("Docter",                     "15-25%"),
    ("Commercial Airline Pilot",   "15-25%"),
    ("Corporate Lawyer",           "15-25%"),
    ("Investment Banker",          "15-25%"),
    ("Civil Engineer",             "15-25%"),
    ("Management Consultant",      "15-25%"),
    ("Psychiatrist",               "15-25%"),
]

print("{:<35} {:>6}  {:<15}  {}".format("Role", "Score", "Expected", "Result"))
print("-" * 80)
for role, expected in test_cases:
    res = generate_deep_resume_analysis(resume, role)
    score = res["overall_match"]
    rec = res["recommended_skills"][:2]
    is_mismatch = score < 45
    tag = "MISMATCH" if is_mismatch else "Tech Match"
    print("{:<35} {:>5}%  {:<15}  {}  | Recs: {}".format(
        role, score, expected, tag, ", ".join(rec)
    ))
