import os
import json
import re
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

class ValidationError(ValueError):
    """Custom exception raised when uploaded resume content is invalid or too short."""
    pass


# ─────────────────────────────────────────────────────────────────────────────
# COMMON TECH SKILLS VOCABULARY
# ─────────────────────────────────────────────────────────────────────────────
COMMON_TECH_SKILLS = [
    # Languages
    "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go", "Golang",
    "Rust", "PHP", "Ruby", "Swift", "Kotlin", "SQL", "HTML5", "CSS3", "R",
    "Scala", "Perl", "MATLAB", "Bash", "Shell", "Solidity", "Dart",
    # Frontend
    "React.js", "Next.js", "Vite", "Vue.js", "Angular", "Redux", "Tailwind CSS",
    "Bootstrap", "Svelte", "Nuxt.js", "Gatsby", "Webpack", "Storybook",
    # Backend
    "Node.js", "Express.js", "Django", "Flask", "FastAPI", "Spring Boot",
    "ASP.NET", "Laravel", "NestJS", "Hapi.js",
    # APIs & Integration
    "REST API", "GraphQL", "gRPC", "WebSockets", "OpenAPI", "OAuth", "JWT",
    # Databases
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Firebase",
    "Cassandra", "DynamoDB", "Elasticsearch", "Neo4j", "Snowflake", "BigQuery",
    # Cloud & DevOps
    "Docker", "Kubernetes", "AWS", "GCP", "Azure", "CI/CD", "Git", "GitHub",
    "Linux", "Terraform", "Ansible", "Jenkins", "GitHub Actions", "ArgoCD",
    "Helm", "Prometheus", "Grafana", "Pulumi", "Vagrant",
    # AI / ML / Data
    "Machine Learning", "TensorFlow", "PyTorch", "Scikit-learn", "OpenCV",
    "Pandas", "NumPy", "Keras", "Hugging Face", "LangChain", "BERT",
    "Apache Spark", "Airflow", "dbt", "Kafka", "MLflow", "Kubeflow",
    "LLM", "RAG", "Vector Database", "Pinecone", "Weaviate",
    "Data Structures", "Algorithms", "OOP", "DBMS",
    # Mobile
    "React Native", "Flutter", "Android", "iOS", "Kotlin", "Swift",
    "Expo", "Xcode",
    # Game Dev
    "Unity", "Unreal Engine", "C#", "Blueprints", "HLSL", "GLSL",
    # Cybersecurity
    "Kali Linux", "Metasploit", "Burp Suite", "Wireshark", "SIEM",
    "Penetration Testing", "Nmap", "OWASP",
    # Design
    "Figma", "Adobe XD", "Sketch", "Photoshop", "Illustrator", "InVision",
    # Testing
    "Selenium", "Cypress", "Playwright", "JUnit", "Pytest", "Postman",
    "Jest", "Mocha", "Appium", "JMeter",
    # Embedded / Systems
    "RTOS", "Embedded Linux", "Firmware", "ARM",
]

SKILL_ALIASES = {
    "react": "React.js",
    "react.js": "React.js",
    "reactjs": "React.js",
    "tailwind": "Tailwind CSS",
    "tailwind css": "Tailwind CSS",
    "express": "Express.js",
    "express.js": "Express.js",
    "html": "HTML5",
    "html5": "HTML5",
    "css": "CSS3",
    "css3": "CSS3",
    "vue": "Vue.js",
    "vue.js": "Vue.js",
    "node": "Node.js",
    "node.js": "Node.js",
    "next": "Next.js",
    "next.js": "Next.js",
    "golang": "Go",
    "pytorch": "PyTorch",
    "tensorflow": "TensorFlow",
    "scikit": "Scikit-learn",
    "sklearn": "Scikit-learn",
    "langchain": "LangChain",
    "huggingface": "Hugging Face",
    "flutter": "Flutter",
}

# ─────────────────────────────────────────────────────────────────────────────
# TECH ROLE REQUIREMENTS  (50 roles)
# ─────────────────────────────────────────────────────────────────────────────
JOB_ROLE_REQUIREMENTS = {
    # ── Software Engineering ──────────────────────────────────────────────────
    "fullstack": [
        "React.js", "JavaScript", "Node.js", "Express.js", "Python", "FastAPI",
        "PostgreSQL", "MongoDB", "Git", "HTML5", "CSS3", "Docker", "REST API"
    ],
    "frontend": [
        "React.js", "JavaScript", "TypeScript", "HTML5", "CSS3", "Tailwind CSS",
        "Redux", "Vite", "Next.js"
    ],
    "backend": [
        "Python", "Node.js", "Express.js", "FastAPI", "Django", "PostgreSQL",
        "MongoDB", "MySQL", "REST API", "Redis", "Docker"
    ],
    "software_engineer": [
        "Python", "JavaScript", "Git", "SQL", "REST API", "OOP",
        "PostgreSQL", "Node.js", "Data Structures"
    ],
    "mobile": [
        "React Native", "Flutter", "Kotlin", "Swift", "Android", "iOS",
        "Firebase", "REST API", "Git"
    ],
    "api_integration": [
        "REST API", "GraphQL", "gRPC", "OAuth", "JWT", "Python", "Node.js",
        "Postman", "OpenAPI", "PostgreSQL"
    ],
    "systems_engineer": [
        "C++", "C#", "Linux", "Bash", "POSIX", "Memory Management",
        "Data Structures", "Algorithms", "Git", "Python"
    ],
    "microservices_architect": [
        "Docker", "Kubernetes", "Microservices", "Node.js", "Python",
        "REST API", "gRPC", "Kafka", "PostgreSQL", "Redis", "CI/CD"
    ],
    "embedded_developer": [
        "C++", "RTOS", "Embedded Linux", "Firmware", "ARM",
        "Python", "MATLAB", "Git", "Bash"
    ],
    "blockchain_developer": [
        "Solidity", "Ethereum", "JavaScript", "Python", "Web3.js",
        "Smart Contracts", "Rust", "Git", "REST API"
    ],
    # ── AI / ML / Data ────────────────────────────────────────────────────────
    "ml_engineer": [
        "Python", "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy",
        "MLflow", "SQL", "Git", "Docker", "Machine Learning"
    ],
    "gen_ai_engineer": [
        "Python", "LangChain", "LLM", "RAG", "Vector Database",
        "OpenAI API", "Hugging Face", "FastAPI", "Docker", "Git"
    ],
    "prompt_engineer": [
        "LLM", "Python", "OpenAI API", "LangChain", "Prompt Design",
        "RAG", "Hugging Face", "REST API", "JSON"
    ],
    "data_scientist": [
        "Python", "R", "Pandas", "NumPy", "Scikit-learn", "TensorFlow",
        "SQL", "Jupyter", "Machine Learning", "Statistics", "Git"
    ],
    "data_engineer": [
        "Python", "Apache Spark", "Airflow", "Kafka", "dbt",
        "SQL", "BigQuery", "Snowflake", "PostgreSQL", "Git", "Docker"
    ],
    "data": [
        "Python", "SQL", "Pandas", "NumPy", "Machine Learning", "PostgreSQL",
        "Apache Spark", "Scikit-learn", "Jupyter"
    ],
    "mlops_engineer": [
        "Python", "MLflow", "Kubeflow", "Docker", "Kubernetes",
        "CI/CD", "Airflow", "TensorFlow", "PyTorch", "Git"
    ],
    "computer_vision": [
        "Python", "OpenCV", "TensorFlow", "PyTorch", "Keras",
        "NumPy", "Machine Learning", "YOLO", "Git"
    ],
    "nlp_engineer": [
        "Python", "BERT", "Hugging Face", "LangChain", "TensorFlow",
        "spaCy", "NLP", "Transformers", "Git"
    ],
    "analytics_engineer": [
        "SQL", "dbt", "BigQuery", "Snowflake", "Python", "Airflow",
        "Looker", "Data Modeling", "Git"
    ],
    "bi_developer": [
        "SQL", "Power BI", "Tableau", "DAX", "Python", "ETL",
        "PostgreSQL", "Excel", "BigQuery"
    ],
    # ── Cloud / DevOps / Infrastructure ──────────────────────────────────────
    "devops": [
        "Docker", "Kubernetes", "AWS", "GCP", "Azure", "CI/CD",
        "Linux", "Terraform", "Jenkins", "Git"
    ],
    "cloud_architect": [
        "AWS", "Terraform", "Kubernetes", "Docker", "CI/CD",
        "Python", "Linux", "Azure", "GCP", "CloudFormation"
    ],
    "platform_engineer": [
        "Kubernetes", "Helm", "ArgoCD", "Docker", "Terraform",
        "Python", "CI/CD", "Linux", "GitHub Actions", "Go"
    ],
    "sre": [
        "Prometheus", "Grafana", "Kubernetes", "Docker", "Python",
        "Linux", "CI/CD", "AWS", "Git", "Bash"
    ],
    "cloud_security": [
        "AWS", "IAM", "SIEM", "Python", "Linux", "Terraform",
        "Penetration Testing", "Docker", "Kubernetes", "OWASP"
    ],
    "network_engineer": [
        "TCP/IP", "Linux", "Bash", "Python", "Cisco",
        "Firewall", "Wireshark", "Nmap", "Git"
    ],
    "iac_engineer": [
        "Terraform", "Ansible", "Pulumi", "AWS", "Docker",
        "Kubernetes", "Python", "Bash", "Git", "Linux"
    ],
    # ── Game Development ──────────────────────────────────────────────────────
    "unity_developer": [
        "Unity", "C#", "Git", "Physics Engine", "3D Modeling",
        "Game UI", "OOP", "Algorithms"
    ],
    "unreal_developer": [
        "Unreal Engine", "C++", "Blueprints", "Git", "HLSL",
        "3D Modeling", "OOP", "Algorithms"
    ],
    "gameplay_programmer": [
        "C++", "C#", "Unity", "Unreal Engine", "Algorithms",
        "Data Structures", "AI Behavior", "Git"
    ],
    "game_designer": [
        "Unity", "Unreal Engine", "Level Design", "Narrative Design",
        "Figma", "Prototyping", "Game Balancing"
    ],
    "ar_vr_developer": [
        "Unity", "C#", "ARCore", "ARKit", "WebXR",
        "3D Modeling", "REST API", "Git"
    ],
    "technical_artist": [
        "HLSL", "GLSL", "Houdini", "Photoshop", "Maya",
        "Unity", "Unreal Engine", "Python", "Git"
    ],
    # ── Cybersecurity ─────────────────────────────────────────────────────────
    "cybersecurity_analyst": [
        "SIEM", "Wireshark", "Nmap", "Python", "Linux",
        "Penetration Testing", "OWASP", "Bash", "Git"
    ],
    "ethical_hacker": [
        "Kali Linux", "Metasploit", "Burp Suite", "Nmap", "Python",
        "Wireshark", "OWASP", "Penetration Testing", "Bash"
    ],
    "security_architect": [
        "Python", "AWS", "IAM", "Zero Trust", "Linux",
        "Terraform", "SIEM", "Penetration Testing", "Git"
    ],
    "soc_analyst": [
        "SIEM", "Python", "Linux", "Wireshark", "Nmap",
        "Bash", "Incident Response", "Threat Intelligence"
    ],
    "iam_engineer": [
        "Python", "OAuth", "SAML", "SSO", "AWS",
        "Azure", "Linux", "REST API", "Git"
    ],
    "info_security_manager": [
        "Python", "SIEM", "Linux", "Risk Management",
        "Penetration Testing", "AWS", "OWASP", "Git"
    ],
    # ── Product / Design / Management ─────────────────────────────────────────
    "product_manager": [
        "Agile", "Scrum", "SQL", "Figma", "JIRA",
        "Python", "REST API", "Data Analysis", "Git"
    ],
    "ui_ux_designer": [
        "Figma", "Adobe XD", "Sketch", "Prototyping", "User Research",
        "CSS3", "HTML5", "JavaScript", "Accessibility"
    ],
    "product_designer": [
        "Figma", "Sketch", "Prototyping", "User Research",
        "Design Systems", "Adobe XD", "CSS3", "Usability Testing"
    ],
    "technical_pm": [
        "SQL", "JIRA", "Python", "REST API", "Agile",
        "System Design", "Data Analysis", "Stakeholder Management"
    ],
    "scrum_master": [
        "Agile", "Scrum", "JIRA", "Kanban", "Sprint Planning",
        "Confluence", "Stakeholder Management", "CI/CD"
    ],
    "it_systems_analyst": [
        "SQL", "Python", "JIRA", "Business Analysis",
        "ERD Diagrams", "REST API", "Requirements Gathering"
    ],
    # ── QA / Testing ──────────────────────────────────────────────────────────
    "sdet": [
        "Python", "Java", "Selenium", "Cypress", "Playwright",
        "REST API", "CI/CD", "Git", "JUnit", "Postman"
    ],
    "qa_automation": [
        "Selenium", "Cypress", "Playwright", "Python", "Java",
        "JUnit", "TestNG", "Appium", "BDD", "Git"
    ],
    "performance_engineer": [
        "JMeter", "Python", "Gatling", "SQL", "Linux",
        "AWS", "Grafana", "Prometheus", "Git"
    ],
    "security_qa": [
        "OWASP", "Burp Suite", "Python", "Selenium", "Kali Linux",
        "Penetration Testing", "Git", "SQL"
    ],
    # ── Default ───────────────────────────────────────────────────────────────
    "default": [
        "Python", "Java", "C++", "JavaScript", "SQL", "Git",
        "REST API", "PostgreSQL", "Node.js", "OOP"
    ],
}

# ─────────────────────────────────────────────────────────────────────────────
# INDUSTRY RECOMMENDATIONS  (matching tech roles)
# ─────────────────────────────────────────────────────────────────────────────
INDUSTRY_RECOMMENDATIONS = {
    "fullstack": ["Docker", "CI/CD Pipelines", "System Design", "Redis", "Unit Testing", "AWS Cloud"],
    "frontend": ["Next.js", "TypeScript", "Redux", "Cypress", "Web Performance Optimization"],
    "backend": ["Docker", "Redis", "Microservices", "gRPC", "CI/CD Pipelines", "AWS Cloud"],
    "software_engineer": ["System Design", "Docker", "Cloud Deployment (AWS/GCP)", "Competitive Programming", "Microservices"],
    "mobile": ["React Native", "Flutter", "Firebase", "Push Notifications", "App Store Deployment"],
    "api_integration": ["GraphQL", "gRPC", "API Gateway", "Rate Limiting", "API Security Best Practices"],
    "systems_engineer": ["Rust", "Assembly", "OS Kernel Concepts", "Multithreading", "Memory Profiling"],
    "microservices_architect": ["Event-Driven Architecture", "gRPC", "Service Mesh (Istio)", "API Gateway", "Distributed Tracing"],
    "embedded_developer": ["UART / SPI / I2C", "JTAG Debugging", "Power Management", "PCB Design Basics", "MISRA C Compliance"],
    "blockchain_developer": ["Hyperledger", "IPFS", "Smart Contract Auditing", "Layer 2 (Polygon)", "DeFi Protocols"],
    "ml_engineer": ["MLflow", "Feature Stores", "Model Serving (TorchServe)", "A/B Testing", "Kubeflow"],
    "gen_ai_engineer": ["Fine-tuning LLMs", "LlamaIndex", "Pinecone / Weaviate", "Multi-modal AI", "Agentic AI Frameworks"],
    "prompt_engineer": ["Chain-of-Thought Prompting", "Function Calling", "LLM Evaluation Frameworks", "Fine-tuning", "Vector DBs"],
    "data_scientist": ["Deep Learning", "A/B Testing", "Feature Engineering", "Bayesian Statistics", "Tableau / Power BI"],
    "data_engineer": ["Kafka Streams", "dbt Cloud", "Data Lakehouse (Delta Lake)", "Airbyte", "Data Quality Monitoring"],
    "data": ["Apache Spark", "Airflow", "Snowflake", "Tableau", "Kafka", "Data Pipeline CI/CD"],
    "mlops_engineer": ["Seldon Core", "BentoML", "Data Drift Detection", "Model Registry", "Feature Store"],
    "computer_vision": ["YOLO", "OpenMMLab", "Image Segmentation", "3D Point Cloud", "TensorRT Optimization"],
    "nlp_engineer": ["LLM Fine-tuning", "Retrieval Augmented Generation (RAG)", "Named Entity Recognition", "Semantic Search", "LangChain"],
    "analytics_engineer": ["Data Vault Modeling", "Great Expectations (Data Quality)", "Tableau / Looker", "Monte Carlo", "Fivetran"],
    "bi_developer": ["Power BI Premium", "Tableau Certified", "Azure Synapse", "DAX Studio", "Data Modeling Patterns"],
    "devops": ["Kubernetes", "AWS", "GCP", "CI/CD", "Terraform", "Jenkins", "Ansible"],
    "cloud_architect": ["AWS Well-Architected Framework", "Multi-Cloud Strategy", "FinOps", "Disaster Recovery", "CloudFormation"],
    "platform_engineer": ["GitOps", "Service Mesh (Istio)", "Internal Developer Platform", "Crossplane", "Backstage"],
    "sre": ["SLO/SLA Management", "Chaos Engineering", "Distributed Tracing (Jaeger)", "On-call Automation", "Runbook Automation"],
    "cloud_security": ["CSPM Tools", "Cloud SIEM", "SOC 2 / ISO 27001 Compliance", "Secrets Management (Vault)", "Zero Trust Architecture"],
    "network_engineer": ["SD-WAN", "Network Automation (Python/Ansible)", "BGP / OSPF Routing", "Network Segmentation", "VPN Design"],
    "iac_engineer": ["Pulumi", "Spacelift", "Atlantis", "Drift Detection", "Policy as Code (OPA)"],
    "unity_developer": ["Unity DOTS / ECS", "Shader Graph", "Addressable Assets", "Unity Netcode", "IL2CPP Build Optimization"],
    "unreal_developer": ["Nanite & Lumen", "Unreal Motion Graphics (UMG)", "Gameplay Ability System (GAS)", "Niagara VFX", "Chaos Physics"],
    "gameplay_programmer": ["Behavior Trees", "Navigation Mesh (NavMesh)", "Physics Simulation", "Procedural Generation", "ECS Pattern"],
    "game_designer": ["GDD Writing", "Economy Design", "Player Psychology", "A/B Testing Game Features", "Monetization Strategy"],
    "ar_vr_developer": ["Meta Quest SDK", "Spatial Anchors", "Hand Tracking", "WebXR APIs", "Occlusion & Passthrough"],
    "technical_artist": ["Houdini Procedural", "Substance Designer", "Shader Optimization", "Motion Capture Pipeline", "LOD Systems"],
    "cybersecurity_analyst": ["Threat Intelligence Platforms", "MITRE ATT&CK Framework", "SOAR Automation", "Cloud Security", "Digital Forensics"],
    "ethical_hacker": ["Exploit Development", "Red Team Exercises", "Bug Bounty Programs", "Active Directory Attacks", "CVE Research"],
    "security_architect": ["Zero Trust Architecture", "Security Architecture Review", "PKI / Certificate Management", "Threat Modeling", "DLP Solutions"],
    "soc_analyst": ["SOAR Playbooks", "Threat Hunting", "Digital Forensics", "MITRE ATT&CK", "Endpoint Detection & Response (EDR)"],
    "iam_engineer": ["Privileged Access Management (PAM)", "Directory Services (LDAP)", "Zero Trust IAM", "MFA / Passwordless Auth", "SCIM Provisioning"],
    "info_security_manager": ["ISO 27001", "NIST CSF", "Security Awareness Training", "GRC Platforms", "Third-Party Risk Management"],
    "product_manager": ["OKR Frameworks", "User Story Mapping", "A/B Testing", "Analytics (Amplitude/Mixpanel)", "Product-Led Growth"],
    "ui_ux_designer": ["Usability Testing", "Interaction Design", "Micro-animations", "Design Tokens", "Accessibility (WCAG 2.1)"],
    "product_designer": ["Usability Testing", "Interaction Design", "Design Systems", "Motion Design (After Effects)", "User Journey Mapping"],
    "technical_pm": ["API Product Management", "Technical Roadmapping", "System Design Basics", "Engineering Metrics", "Data-Driven Decisions"],
    "scrum_master": ["SAFe (Scaled Agile)", "Metrics & Velocity Tracking", "Conflict Resolution", "OKR Alignment", "Agile Coaching"],
    "it_systems_analyst": ["Business Process Modeling (BPMN)", "TOGAF Architecture", "ERP Systems (SAP/Oracle)", "UAT Management", "System Integration"],
    "sdet": ["Page Object Model (POM)", "API Contract Testing (Pact)", "Performance Testing", "Test Data Management", "AI-Assisted Testing"],
    "qa_automation": ["Performance Testing (JMeter)", "API Testing (REST Assured)", "CI/CD Integration", "Test Coverage Reporting", "Accessibility Testing"],
    "performance_engineer": ["APM Tools (Dynatrace/New Relic)", "Database Query Profiling", "CDN & Caching Strategy", "Stress Testing", "Real User Monitoring"],
    "security_qa": ["Threat Modeling", "DAST / SAST Tools", "API Security Testing", "Compliance Testing (HIPAA/PCI DSS)", "Bug Bounty Methodology"],
    "default": ["Docker", "System Design", "CI/CD Pipelines", "Redis", "Unit Testing", "AWS Cloud"],
}

# ─────────────────────────────────────────────────────────────────────────────
# TECH ROLE MAP  (keyword → role_key, priority-ordered)
# ─────────────────────────────────────────────────────────────────────────────
TECH_ROLE_MAP = [
    # Embedded / Systems
    (["embedded", "firmware", "rtos", "bare metal"], "embedded_developer"),
    (["systems software", "systems engineer", "operating system"], "systems_engineer"),
    # Blockchain / Web3
    (["blockchain", "web3", "solidity", "smart contract", "nft", "defi", "crypto"], "blockchain_developer"),
    # Microservices
    (["microservice", "micro-service", "distributed system", "service mesh"], "microservices_architect"),
    # API / Integration
    (["api engineer", "integration engineer", "api developer", "middleware"], "api_integration"),
    # Game Dev
    (["unity"], "unity_developer"),
    (["unreal", "ue5", "ue4"], "unreal_developer"),
    (["gameplay", "game programmer"], "gameplay_programmer"),
    (["game designer", "level designer", "game design"], "game_designer"),
    (["augmented reality", "virtual reality", "spatial computing", "mixed reality", "ar developer", "vr developer", "xr developer", "ar/vr", "arvr", "arcore", "arkit"], "ar_vr_developer"),
    (["technical artist", "vfx", "shader", "houdini"], "technical_artist"),
    # Cybersecurity
    (["ethical hack", "penetration test", "pen test", "pentest", "red team"], "ethical_hacker"),
    (["soc analyst", "security operations", "threat analyst", "threat hunter"], "soc_analyst"),
    (["cloud security", "security engineer", "cloud security engineer"], "cloud_security"),
    (["security architect", "security architecture"], "security_architect"),
    (["iam", "identity access", "identity and access", "okta engineer", "azure ad"], "iam_engineer"),
    (["information security manager", "infosec manager", "ciso", "security manager"], "info_security_manager"),
    (["cybersecurity", "cyber security", "security analyst"], "cybersecurity_analyst"),
    # AI / ML / Data
    (["generative ai", "genai", "gen ai", "llm engineer", "large language model"], "gen_ai_engineer"),
    (["prompt engineer", "prompt design"], "prompt_engineer"),
    (["mlops", "ml operations", "machine learning operations"], "mlops_engineer"),
    (["computer vision", "image recognition", "visual ai"], "computer_vision"),
    (["nlp", "natural language processing", "text mining", "computational linguistics"], "nlp_engineer"),
    (["data scientist", "data science"], "data_scientist"),
    (["analytics engineer", "analytics"], "analytics_engineer"),
    (["bi developer", "business intelligence", "bi analyst", "power bi", "tableau"], "bi_developer"),
    (["data engineer", "etl", "data pipeline", "data infrastructure"], "data_engineer"),
    (["ml engineer", "machine learning engineer", "ai engineer", "ai/ml"], "ml_engineer"),
    (["data analyst", "data analysis", "ai", "ml"], "data"),
    # Cloud / DevOps / Infrastructure
    (["cloud architect", "solutions architect", "cloud solution"], "cloud_architect"),
    (["platform engineer", "internal developer", "idp"], "platform_engineer"),
    (["site reliability", "sre", "reliability engineer"], "sre"),
    (["network engineer", "network administrator", "network specialist", "netops"], "network_engineer"),
    (["infrastructure as code", "iac engineer", "terraform engineer"], "iac_engineer"),
    (["devops", "cloud engineer", "cloud devops", "cloud infra"], "devops"),
    # Product / Design / Management
    (["product manager", "product owner", "ai product"], "product_manager"),
    (["ui/ux", "ux designer", "ux researcher", "user experience"], "ui_ux_designer"),
    (["product designer", "interaction designer"], "product_designer"),
    (["technical program", "technical project manager", "tpm"], "technical_pm"),
    (["scrum master", "agile coach", "agile lead"], "scrum_master"),
    (["it systems analyst", "business analyst", "it analyst"], "it_systems_analyst"),
    # QA / Testing
    (["sdet", "software development engineer in test"], "sdet"),
    (["performance test", "load test", "performance engineer"], "performance_engineer"),
    (["security qa", "security test", "security quality"], "security_qa"),
    (["qa automation", "automation engineer", "test automation"], "qa_automation"),
    # Full-Stack / Frontend / Backend
    (["full stack", "fullstack", "full-stack"], "fullstack"),
    (["front end", "frontend", "front-end", "react developer", "vue developer", "angular developer", "next.js developer"], "frontend"),
    (["back end", "backend", "back-end", "python developer", "django developer", "node developer", "java developer"], "backend"),
    (["mobile", "android", "ios", "flutter", "react native"], "mobile"),
    # Generalist Software
    (["software engineer", "software developer", "programmer", "web developer"], "software_engineer"),
]

# ─────────────────────────────────────────────────────────────────────────────
# NON-TECH DOMAINS  (18 domain groups)
# ─────────────────────────────────────────────────────────────────────────────
NON_TECH_DOMAINS = {
    # ── Healthcare ───────────────────────────────────────────────────────────
    "medical": {
        "keywords": [
            "doctor", "docter", "physician", "general practitioner", "gp",
            "nurse", "nurse practitioner", "registered nurse", "rn",
            "surgeon", "cardiologist", "neurosurgeon", "orthopedic", "specialist surgeon",
            "pharmacist", "dentist", "orthodontist", "physical therapist",
            "medical doctor", "mbbs", "md degree", "healthcare", "clinic", "hospital"
        ],
        "reqs": [
            "MBBS / MD Degree", "Clinical Practice & Rotations", "Patient Diagnosis & Care",
            "Pharmacology & Drug Interactions", "Medical Ethics & Compliance",
            "EHR / EMR Systems (Epic, Cerner)", "Medical Licensure (Board Exam)",
            "Anatomy & Physiology", "ICD-10 Medical Coding"
        ],
        "recs": [
            "Medical Board Certification", "Specialty Board Exams", "Clinical Research Trials",
            "Telemedicine & Digital Health Tools"
        ],
        "category": "Medical & Healthcare"
    },
    "psychiatry": {
        "keywords": [
            "psychiatrist", "clinical psychologist", "psychologist", "mental health",
            "therapist", "counselor", "behavioral health", "neuropsychologist"
        ],
        "reqs": [
            "MD / PhD in Psychiatry or Psychology", "DSM-5 Diagnostic Criteria",
            "Cognitive Behavioral Therapy (CBT)", "Psychopharmacology",
            "Mental Health Assessment Tools", "Crisis Intervention",
            "Medical Licensure / Psychology Board License"
        ],
        "recs": [
            "EMDR Therapy Certification", "Neuroimaging Familiarity (fMRI)",
            "Telepsychiatry Platforms", "Substance Abuse Counseling (CADC)"
        ],
        "category": "Psychiatry & Mental Health"
    },
    "healthcare_management": {
        "keywords": [
            "health services manager", "hospital administrator", "healthcare manager",
            "medical director", "clinical manager", "health administrator"
        ],
        "reqs": [
            "MHA / MBA (Healthcare)", "Healthcare Regulations (HIPAA, CMS)",
            "Hospital Operations Management", "Financial Budgeting & Resource Allocation",
            "Electronic Health Records (EHR) Systems", "Quality Improvement (LEAN / Six Sigma)",
            "Staff Development & HR in Healthcare"
        ],
        "recs": [
            "FACHE Certification", "Value-Based Care Models", "Population Health Management", "Revenue Cycle Management"
        ],
        "category": "Healthcare Management"
    },
    # ── Legal ─────────────────────────────────────────────────────────────────
    "legal": {
        "keywords": [
            "lawyer", "attorney", "barrister", "solicitor", "advocate",
            "corporate lawyer", "ip attorney", "criminal attorney", "criminal defense",
            "intellectual property", "litigation", "contract law", "mergers and acquisitions", "m&a"
        ],
        "reqs": [
            "Law Degree (LLB / JD)", "Bar Council / State Bar Exam",
            "Legal Research & Drafting (Westlaw/LexisNexis)", "Contract Negotiation",
            "Court Proceedings & Litigation", "Case Management & Client Representation",
            "Regulatory & Compliance Knowledge", "Legal Writing & Memoranda"
        ],
        "recs": [
            "LLM Specialization", "Arbitration / Mediation Certification",
            "E-Discovery Tools (Relativity)", "AI Legal Research Tools (ROSS, Casetext)"
        ],
        "category": "Legal & Law"
    },
    "compliance_legal": {
        "keywords": [
            "compliance officer", "ethics officer", "general counsel", "in-house counsel",
            "legal advisor", "paralegal", "legal analyst", "compliance analyst"
        ],
        "reqs": [
            "Law Degree (LLB / JD) or Paralegal Certification",
            "Regulatory Compliance Frameworks (GDPR, SOX, AML)",
            "Policy Drafting & Review", "Risk Assessment & Internal Auditing",
            "Corporate Governance", "Legal Research Skills"
        ],
        "recs": [
            "CRCM / CCO Certification", "RegTech Tools Knowledge", "AML Compliance Specialization",
            "ESG Compliance Reporting"
        ],
        "category": "Compliance & Legal Advisory"
    },
    # ── Finance / Banking ─────────────────────────────────────────────────────
    "investment_banking": {
        "keywords": [
            "investment banker", "investment banking", "ib analyst", "ib associate",
            "hedge fund", "hedge fund analyst", "m&a analyst", "mergers acquisitions",
            "private equity", "pe associate", "venture capital", "vc associate", "capital markets"
        ],
        "reqs": [
            "Finance Degree / MBA from Top Institution", "Financial Modeling (DCF, LBO, M&A)",
            "Bloomberg Terminal Proficiency", "Valuation (Comparable Companies, Precedent Transactions)",
            "Excel / VBA Advanced Modeling", "Pitch Book & Client Presentation",
            "CFA / FINRA Series 79 Certification"
        ],
        "recs": [
            "CFA Charter", "FINRA License", "Python for Finance & Quant Research",
            "Sector Expertise (Tech M&A, Healthcare IB)"
        ],
        "category": "Investment Banking & Finance"
    },
    "finance": {
        "keywords": [
            "accountant", "auditor", "financial analyst", "cpa", "\bca\b", "chartered accountant",
            "tax consultant", "tax analyst", "banking", "finance analyst", "accounting",
            "finance manager", "controller", "corporate controller"
        ],
        "reqs": [
            "Accounting / Finance Degree", "CPA / CA Certification",
            "Financial Statements (P&L, Balance Sheet, Cash Flow)", "Taxation & Audit",
            "Tally / QuickBooks / SAP", "Financial Modeling in Excel",
            "IFRS / GAAP Standards", "Budgeting & Forecasting"
        ],
        "recs": [
            "CPA / CA / ACCA Certification", "SAP FICO Module", "Power BI for Finance",
            "IFRS 16 / ASC 842 Lease Accounting"
        ],
        "category": "Finance & Accounting"
    },
    "wealth_management": {
        "keywords": [
            "wealth manager", "portfolio manager", "asset manager", "risk manager",
            "risk management specialist", "actuary", "investment advisor", "financial planner",
            "cfa", "cfp"
        ],
        "reqs": [
            "Finance / Economics Degree", "CFA / CFP Certification",
            "Portfolio Construction & Optimization", "Risk Analytics (VaR, Stress Testing)",
            "Bloomberg / Reuters Eikon", "Asset Allocation Strategies",
            "Client Relationship Management"
        ],
        "recs": [
            "CFA Level 3", "FRM (Financial Risk Manager)", "CAIA Certification",
            "Quantitative Finance (Python / R)"
        ],
        "category": "Wealth Management & Risk"
    },
    # ── Business / Management ─────────────────────────────────────────────────
    "management_consulting": {
        "keywords": [
            "management consultant", "strategy consultant", "business consultant",
            "mckinsey", "bcg", "bain", "deloitte consultant", "accenture consultant",
            "strategy analyst", "business strategy"
        ],
        "reqs": [
            "MBA / Top-Tier Business Degree", "Case Interview & Structured Problem Solving",
            "Financial Modeling & Business Case Development", "Stakeholder Management",
            "PowerPoint & Excel Consulting Toolkit", "Process Improvement (LEAN / Six Sigma)",
            "Industry Research & Benchmarking"
        ],
        "recs": [
            "MBB Interview Mastery (Victor Cheng)", "Six Sigma Green Belt", "Design Thinking",
            "Consulting CRM (Salesforce, HubSpot)"
        ],
        "category": "Management Consulting"
    },
    "hr_talent": {
        "keywords": [
            "hr director", "human resources", "hr manager", "talent acquisition",
            "talent lead", "recruiter", "people manager", "people operations",
            "hr business partner", "hrbp", "workforce planning"
        ],
        "reqs": [
            "HR Degree / MBA (HR Specialization)", "SHRM / PHR Certification",
            "Recruitment & Talent Sourcing (LinkedIn, ATS)", "Employee Relations & Labor Law",
            "Performance Management & Appraisals", "HRIS Platforms (Workday, SAP SuccessFactors)",
            "Compensation & Benefits Design"
        ],
        "recs": [
            "SHRM-CP / SHRM-SCP", "People Analytics (Visier, Tableau)", "DEI Strategy & Programs",
            "Organizational Development (OD) Certification"
        ],
        "category": "Human Resources & Talent"
    },
    "operations_supply_chain": {
        "keywords": [
            "operations manager", "supply chain", "logistics director", "supply chain director",
            "operations director", "procurement manager", "inventory manager", "scm"
        ],
        "reqs": [
            "Operations Management / Engineering Degree", "Supply Chain Management (SCM)",
            "ERP Systems (SAP, Oracle)", "Lean Manufacturing & Six Sigma",
            "Vendor Management & Procurement", "Inventory Optimization",
            "Demand Forecasting & Planning (S&OP)"
        ],
        "recs": [
            "APICS CSCP Certification", "SAP S/4HANA SCM", "Power BI / Tableau for Ops Analytics",
            "Sustainability in Supply Chain"
        ],
        "category": "Operations & Supply Chain"
    },
    "sustainability_esg": {
        "keywords": [
            "sustainability", "esg", "environmental social governance", "esg lead",
            "sustainability manager", "green finance", "carbon accounting", "climate"
        ],
        "reqs": [
            "Environmental Science / Sustainability Degree", "ESG Reporting Frameworks (GRI, SASB, TCFD)",
            "Carbon Accounting & Life Cycle Assessment (LCA)", "Regulatory Compliance (EU Taxonomy, SEC Climate Rules)",
            "Stakeholder Engagement & Materiality Assessment", "Sustainability Strategy & Policy"
        ],
        "recs": [
            "GRI Certified Sustainability Professional", "CDP Disclosure Expertise",
            "Net Zero Strategy Development", "Impact Investing Frameworks"
        ],
        "category": "Sustainability & ESG"
    },
    # ── Core Engineering / Science ─────────────────────────────────────────────
    "core_engineering": {
        "keywords": [
            "civil engineer", "mechanical engineer", "electrical engineer", "structural engineer",
            "aerospace engineer", "chemical engineer", "process engineer",
            "biomedical engineer", "environmental engineer", "licensed architect",
            "urban planner", "architect", "industrial engineer"
        ],
        "reqs": [
            "B.E. / B.Tech in Relevant Engineering Discipline", "AutoCAD / SolidWorks / Revit",
            "Structural Analysis & Design Codes (IS, ACI, BS)", "Thermodynamics / Fluid Mechanics",
            "MATLAB / ANSYS / STAAD Pro Simulation", "Site Supervision & Quality Control",
            "Professional Engineer (PE) Licensure"
        ],
        "recs": [
            "ANSYS FEA Simulation", "BIM Modeling (Revit / Navisworks)",
            "P&ID & Process Simulation (HYSYS)", "Project Management Professional (PMP)"
        ],
        "category": "Core Engineering & Architecture"
    },
    # ── Marketing / Media / Creative ───────────────────────────────────────────
    "marketing": {
        "keywords": [
            "marketing manager", "digital marketing", "marketing director", "brand manager",
            "content director", "copywriter", "seo specialist", "sem specialist",
            "social media", "public relations", "pr specialist", "growth hacker",
            "performance marketer", "email marketing", "marketing analyst"
        ],
        "reqs": [
            "Marketing / Communications Degree", "Digital Marketing Strategy",
            "SEO / SEM (Google Ads, Search Console)", "Google Analytics / GA4",
            "Content Marketing & Copywriting", "Social Media Management (Meta, LinkedIn, TikTok)",
            "CRM (Salesforce / HubSpot)", "Email Marketing (Mailchimp, Klaviyo)"
        ],
        "recs": [
            "Google Ads Certified", "Meta Blueprint Certification",
            "HubSpot Inbound Marketing Certification", "Conversion Rate Optimization (CRO)"
        ],
        "category": "Marketing & Brand"
    },
    "creative_media": {
        "keywords": [
            "creative director", "visual designer", "graphic designer", "art director",
            "video producer", "motion designer", "videographer", "animator",
            "corporate communications", "communications manager"
        ],
        "reqs": [
            "Design / Fine Arts / Media Degree", "Adobe Creative Suite (Photoshop, Illustrator, InDesign)",
            "Video Editing (Premiere Pro, After Effects, DaVinci Resolve)",
            "Brand Identity & Visual Systems", "Typography & Layout Design",
            "Client Brief Interpretation & Concept Development"
        ],
        "recs": [
            "Motion Graphics (After Effects, Cavalry)", "3D Design (Cinema 4D / Blender)",
            "UX Copy & Content Design", "Portfolio on Behance / Dribbble"
        ],
        "category": "Creative & Media Production"
    },
    # ── Education / Research / Specialized ─────────────────────────────────────
    "education_academia": {
        "keywords": [
            "professor", "lecturer", "instructor", "university lecturer", "assistant professor",
            "associate professor", "teacher", "academic", "faculty", "instructional designer",
            "curriculum developer", "e-learning designer"
        ],
        "reqs": [
            "PhD / Master's Degree in Relevant Field", "Course Design & Curriculum Development",
            "Academic Research & Publication (Google Scholar, Scopus)",
            "Learning Management Systems (Canvas, Moodle, Blackboard)",
            "Classroom & Online Facilitation Skills", "Student Assessment & Feedback Design"
        ],
        "recs": [
            "Research Grant Writing", "Open Educational Resources (OER)",
            "EdTech Tools (Coursera Build, edX)", "Teaching Excellence Certification"
        ],
        "category": "Education & Academia"
    },
    "aviation": {
        "keywords": [
            "pilot", "airline pilot", "commercial pilot", "captain", "first officer",
            "flight engineer", "atpl", "aviation"
        ],
        "reqs": [
            "ATPL (Airline Transport Pilot License)", "CPL (Commercial Pilot License)",
            "Type Rating (A320, B737 or equivalent)", "Instrument Rating (IR)",
            "Multi-Engine Rating (MER)", "CRM (Crew Resource Management)",
            "ICAO English Language Proficiency Level 4+"
        ],
        "recs": [
            "Advanced Simulator Training (Level D)", "UPRT (Upset Prevention & Recovery Training)",
            "Safety Management Systems (SMS)", "RVSM / RNP AR Approach Certification"
        ],
        "category": "Aviation & Pilot"
    },
    "research_science": {
        "keywords": [
            "research scientist", "laboratory director", "lab director", "scientist",
            "data privacy officer", "dpo", "research analyst", "principal investigator"
        ],
        "reqs": [
            "PhD / Master's in Relevant Science Field",
            "Experimental Design & Statistical Analysis (R, SPSS, Python)",
            "Scientific Writing & Publication (Peer-Reviewed Journals)",
            "Laboratory Safety & Ethics (IRB / IACUC)", "Grant Writing & Funding Applications",
            "Literature Review & Systematic Reviews"
        ],
        "recs": [
            "NIH / NSF Grant Writing", "Bioinformatics Tools (if life sciences)",
            "Machine Learning for Scientific Research", "Research Data Management (RDM)"
        ],
        "category": "Research & Science"
    },
}


def extract_text_from_pdf(pdf_file):
    """Extract text from an uploaded PDF file object or path."""
    try:
        if isinstance(pdf_file, str):
            text = pdf_file
        else:
            import pypdf
            reader = pypdf.PdfReader(pdf_file)
            text = ""
            for page in reader.pages:
                text += page.extract_text() or ""
        
        # Validate minimum character length for viable resume content
        if not text or len(text.strip()) < 50:
            raise ValidationError("The uploaded PDF does not contain enough text to be evaluated as a resume.")
        return text
    except ValidationError:
        raise
    except Exception:
        raise ValidationError("Could not parse text from the uploaded PDF file.")


def evaluate_resume(pdf_file, required_skills):
    # Step 1: Extract text from the uploaded PDF (with validation guard clause)
    resume_text = extract_text_from_pdf(pdf_file)
    
    # Step 2: Your standard matching logic (executed only if text exists & meets criteria)
    matched_skills = []
    missing_skills = []
    
    for skill in required_skills:
        if skill.lower() in resume_text.lower():
            matched_skills.append(skill)
        else:
            missing_skills.append(skill)
            
    # Calculate score safely
    total_skills = len(required_skills)
    score = (len(matched_skills) / total_skills) * 100 if total_skills > 0 else 0.0
    
    return {
        "match_score": round(score, 2),
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "status": "Success"
    }


def extract_skills_from_text(text):
    """Extract and normalize all tech skills found in resume text."""
    text_lower = text.lower()
    extracted_raw = []

    for skill in COMMON_TECH_SKILLS:
        pattern = r'(?<![a-zA-Z0-9_])' + re.escape(skill.lower()) + r'(?![a-zA-Z0-9_])'
        if re.search(pattern, text_lower):
            extracted_raw.append(skill)

    if re.search(r'\b(c\s*language|c\s*\/\s*c\+\+|c\s*programming)\b', text_lower):
        extracted_raw.append("C")

    normalized = []
    for s in extracted_raw:
        norm = SKILL_ALIASES.get(s.lower(), s)
        if norm not in normalized:
            normalized.append(norm)

    return normalized


def _resolve_tech_role(job_title):
    """Dictionary-driven fuzzy role resolver. Returns role_key string."""
    j_lower = job_title.lower().strip()
    for keywords, role_key in TECH_ROLE_MAP:
        if any(kw in j_lower for kw in keywords):
            return role_key
    return "default"


def _resolve_non_tech_domain(job_title):
    """Check if the target job falls under a non-tech domain. Returns (domain_key, domain_info) or (None, None)."""
    j_lower = job_title.lower().strip()
    for domain_key, info in NON_TECH_DOMAINS.items():
        if any(kw in j_lower for kw in info["keywords"]):
            return domain_key, info
    return None, None


def contextual_rewrite_line(orig_line):
    """Rewrite a resume bullet with stronger metrics and action verbs."""
    l_lower = orig_line.lower()

    if any(k in l_lower for k in ['frontend:', 'backend:', 'databases:', 'skills:', 'technologies:']):
        tech_tokens = re.sub(r'^(frontend|backend|databases|skills|technologies):\s*', '', orig_line, flags=re.IGNORECASE).strip()
        if 'frontend' in l_lower or 'react' in l_lower or 'vite' in l_lower or 'tailwind' in l_lower:
            return f"Architected responsive frontend interfaces utilizing {tech_tokens}, boosting render performance by 40% and user responsiveness.", "+40% Recruiter Impact"
        elif 'backend' in l_lower or 'fastapi' in l_lower or 'node' in l_lower or 'express' in l_lower:
            return f"Engineered high-concurrency backend services & REST APIs with {tech_tokens}, maintaining sub-100ms response times.", "+45% Recruiter Impact"
        elif 'database' in l_lower or 'sql' in l_lower or 'mongo' in l_lower or 'postgres' in l_lower:
            return f"Designed & optimized relational and NoSQL database schemas across {tech_tokens}, cutting query latency by 50%.", "+50% Recruiter Impact"
        else:
            return f"Spearheaded technical implementation utilizing {tech_tokens}, improving application scalability by 35%.", "+35% Recruiter Impact"

    clean_orig = re.sub(r'^[•\-\*\d\.\s]+', '', orig_line).strip()
    if any(k in l_lower for k in ['frontend', 'react', 'vite', 'tailwind', 'vue', 'ui', 'interface']):
        return "Architected responsive web portal interface, enhancing page render performance by 35% and user engagement.", "+35% ATS Boost"
    elif any(k in l_lower for k in ['backend', 'api', 'fastapi', 'node', 'express', 'django', 'flask', 'server', 'auth']):
        return "Engineered secure API microservices and backend endpoints, improving request throughput by 40% with zero downtime.", "+40% ATS Boost"
    elif any(k in l_lower for k in ['database', 'postgres', 'mongo', 'mysql', 'sql', 'query']):
        return "Optimized database architecture and indexing, reducing query execution times by 45% and ensuring data integrity.", "+45% ATS Boost"
    else:
        return f"Spearheaded technical execution of \"{clean_orig[:60]}\", achieving 30%+ efficiency gains and robust stability.", "+35% Recruiter Impact"


def _build_feedback(job_title, extracted_skills, recommended_skills, overall_match, role_key, matched, reqs, domain_mismatch_info=None):
    """Build comprehensive, role-specific actionable improvement feedback cards."""
    feedback = []

    # Domain mismatch card (top priority)
    if domain_mismatch_info:
        cat_name = domain_mismatch_info["category"]
        feedback.append({
            "severity": "high",
            "category": "Domain Mismatch",
            "title": f"Critical Skill & Domain Mismatch for {job_title}",
            "description": (
                f"Your resume contains Software Engineering skills ({', '.join(extracted_skills[:4])}), "
                f"but your target role '{job_title}' is a {cat_name} position. "
                f"This role requires domain-specific credentials such as: {', '.join(domain_mismatch_info['reqs'][:3])}. "
                f"Software engineering skills do not pass {cat_name} ATS screening filters."
            ),
            "suggestion": (
                f"If you genuinely want to work as a {job_title}, build domain credentials: "
                f"{', '.join(domain_mismatch_info['recs'][:2])}. "
                f"If you want to apply tech skills in this sector, update your target title to "
                f"'{cat_name} Software Engineer' or 'HealthTech / FinTech Developer'."
            ),
            "impact": "Action Required — Re-align Resume Domain or Target Role",
            "timeframe": "Immediate"
        })

    missing_count = len(reqs) - len(matched) if not domain_mismatch_info else 0
    has_github = any('github' in s.lower() or 'git' in s.lower() for s in extracted_skills)
    has_docker = any('docker' in s.lower() for s in extracted_skills)
    has_leetcode = any('leetcode' in s.lower() or 'dsa' in s.lower() or 'algorithms' in s.lower() for s in extracted_skills)

    # Missing tech skills card
    if missing_count > 0 and recommended_skills and not domain_mismatch_info:
        severity = 'high' if missing_count >= 3 else 'medium'
        feedback.append({
            "severity": severity,
            "category": "Skill Match",
            "title": f"Missing Core Keywords for {job_title}",
            "description": (
                f"Your resume is currently missing {missing_count} critical requirement(s) standard for "
                f"{job_title} positions. ATS parsers match exact skill terms before ranking candidates."
            ),
            "suggestion": f"Add these high-value industry tools to your Skills section and project descriptions: {', '.join(recommended_skills[:4])}.",
            "impact": f"+{min(22, missing_count * 6)}% ATS Match Boost",
            "timeframe": "1–2 Weeks"
        })

    # Quantified achievements
    feedback.append({
        "severity": "high",
        "category": "Experience Impact",
        "title": "Unquantified Achievement Bullet Points",
        "description": "Your project and experience bullets describe tools used, but lack measurable metrics. Recruiters scan for numbers like latency, users served, and throughput.",
        "suggestion": "Apply Google's X-Y-Z formula: 'Accomplished [X] as measured by [Y], by doing [Z]'. Example: 'Engineered 12+ REST endpoints serving 500+ active users with sub-80ms response time.'",
        "impact": "+18% Recruiter Engagement",
        "timeframe": "Immediate"
    })

    # Project depth
    feedback.append({
        "severity": "medium",
        "category": "Project Depth",
        "title": "Demonstrate System Architecture & Scale",
        "description": "Basic CRUD projects fail to stand out at technical screening. Recruiters look for state management, database schema design, caching, and system design decisions.",
        "suggestion": "Highlight technical complexity in project bullets: mention database indexing, JWT auth, Redux/Zustand state, CI/CD pipelines, or Redis caching layers.",
        "impact": "+15% Technical Screening Pass Rate",
        "timeframe": "2–3 Weeks"
    })

    # GitHub & portfolio
    if not has_github:
        feedback.append({
            "severity": "medium",
            "category": "Portfolio",
            "title": "GitHub & Live Demo Links Missing",
            "description": "Tech hiring managers expect clickable GitHub links and live demo deployments (Vercel, Render, Railway) right under project titles.",
            "suggestion": "Add your GitHub URL to your contact header. For every project, include a public repository link and a working live demo link with a README.",
            "impact": "+12% Shortlist Credibility",
            "timeframe": "1 Week"
        })
    else:
        feedback.append({
            "severity": "low",
            "category": "Portfolio",
            "title": "Upgrade GitHub Project READMEs & Live Demos",
            "description": "GitHub links are present, but repositories need professional README documentation with architecture diagrams, setup steps, and demo links.",
            "suggestion": "For each repository, add a README.md with tech stack badges, architecture flow, installation commands, and a deployed Vercel/Render URL.",
            "impact": "+8% Portfolio Review Rate",
            "timeframe": "1 Week"
        })

    # DevOps (only for tech roles)
    if not has_docker and not domain_mismatch_info:
        feedback.append({
            "severity": "medium",
            "category": "DevOps & Cloud",
            "title": "Containerization & CI/CD Pipeline Exposure",
            "description": f"Modern {job_title} positions strongly prefer candidates familiar with Docker containerization and automated CI/CD build pipelines.",
            "suggestion": "Add a Dockerfile to one of your projects and create a .github/workflows/ci.yml GitHub Action that runs tests on push.",
            "impact": f"+14% {job_title} Alignment",
            "timeframe": "2 Weeks"
        })

    # Coding profiles (only for tech roles)
    if not has_leetcode and not domain_mismatch_info:
        feedback.append({
            "severity": "medium",
            "category": "CS Fundamentals",
            "title": "Coding Profiles & Problem Solving Verification",
            "description": "Tech companies use automated coding rounds. Highlighting problem-solving metrics directly on your resume signals interview readiness.",
            "suggestion": "Include your LeetCode profile URL or mention: 'Solved 200+ Data Structures & Algorithms problems across LeetCode & CodeChef'.",
            "impact": "+10% Technical Assessment Confidence",
            "timeframe": "1–2 Months"
        })

    # ATS format (always)
    feedback.append({
        "severity": "low",
        "category": "ATS Format",
        "title": "ATS PDF Single-Column Compliance Checklist",
        "description": "Multi-column layouts, graphics inside text boxes, or tables can cause ATS parsers to misread or scramble your experience section.",
        "suggestion": "Use a clean single-column format, standard fonts (Inter, Arial, Roboto), clear section headings, and save as searchable PDF (not scanned image).",
        "impact": "+5% ATS Parse Accuracy",
        "timeframe": "Immediate"
    })

    return feedback


def generate_deep_resume_analysis(resume_text, job_title="Software Developer"):
    """
    Full structural resume analysis engine.
    Handles 50+ tech roles and 18 non-tech domain groups.
    Returns comprehensive scoring, diagnostics, rewrite suggestions, and feedback.
    """
    # Guard clause against short or empty resume text
    if not resume_text or len(resume_text.strip()) < 50:
        raise ValidationError("The uploaded PDF does not contain enough text to be evaluated as a resume.")

    text_lower = resume_text.lower()
    raw_lines = [l.strip() for l in resume_text.split('\n') if l.strip()]

    # 1. Extract tech skills from resume
    extracted_skills = extract_skills_from_text(resume_text)
    if not extracted_skills:
        extracted_skills = ["Software Development", "Problem Solving", "Git", "REST API", "SQL"]

    # 2. Check non-tech domain first (Doctor, Lawyer, Pilot etc.)
    domain_key, domain_info = _resolve_non_tech_domain(job_title)
    is_domain_mismatch = False

    if domain_key:
        # Non-tech role matched — evaluate against domain requirements
        reqs = domain_info["reqs"]
        recommended_skills = domain_info["recs"]
        matched = [r for r in reqs if any(tok.strip() in text_lower for tok in r.lower().split("/"))]

        if len(matched) == 0:
            # Pure software resume vs non-tech role — severe mismatch
            overall_match = 18
            ats_shortlist = 20
            tech_stack_score = 15
            cs_score = 25
            is_domain_mismatch = True
        else:
            match_ratio = len(matched) / len(reqs)
            overall_match = int(min(96, max(25, round(match_ratio * 80 + 20))))
            ats_shortlist = min(98, overall_match + 2)
            tech_stack_score = overall_match
            cs_score = max(30, overall_match - 5)

        role_key = domain_key

        diagnostics = [
            {
                "title": "Technical Stack Alignment",
                "percentage": tech_stack_score,
                "status": "Critical Mismatch" if is_domain_mismatch else "Moderate",
                "tags": extracted_skills[:4],
                "note": (
                    f"Candidate has Software Engineering stack ({', '.join(extracted_skills[:3])}), "
                    f"but target position '{job_title}' requires {domain_info['category']} credentials."
                    if is_domain_mismatch else
                    f"Matched {len(matched)} of {len(reqs)} domain requirements for {job_title}."
                )
            },
            {
                "title": "Domain Knowledge & Qualifications",
                "percentage": cs_score,
                "status": "Domain Gap" if is_domain_mismatch else ("Qualified" if cs_score >= 70 else "Needs Review"),
                "tags": domain_info["reqs"][:3],
                "note": f"Required: {', '.join(domain_info['reqs'][:2])}."
            },
            {
                "title": "Academic & Experience Projects",
                "percentage": 20 if is_domain_mismatch else min(90, overall_match + 5),
                "status": "Non-Aligned" if is_domain_mismatch else "Verified",
                "tags": extracted_skills[:3],
                "note": "Software projects do not demonstrate domain-specific clinical/legal/financial experience." if is_domain_mismatch else "Domain-relevant work experience detected."
            },
            {
                "title": "Education & Formatting",
                "percentage": 70,
                "status": "Degree Parsed",
                "tags": ["PDF Parsed", "ATS Format"],
                "note": "Resume text extracted cleanly; however, specialization does not match target position."
            }
        ]

    else:
        # Tech role — resolve role_key using TECH_ROLE_MAP
        role_key = _resolve_tech_role(job_title)
        reqs = JOB_ROLE_REQUIREMENTS.get(role_key, JOB_ROLE_REQUIREMENTS["default"])
        has_db = any(db in extracted_skills for db in ["PostgreSQL", "MySQL", "SQLite", "MongoDB", "SQL"])

        matched = []
        for r in reqs:
            if r == "SQL" and has_db:
                matched.append(r)
            elif any(r.lower() == e.lower() for e in extracted_skills):
                matched.append(r)

        rec_candidates = INDUSTRY_RECOMMENDATIONS.get(role_key, INDUSTRY_RECOMMENDATIONS["default"])
        recommended_skills = [
            c for c in rec_candidates
            if not any(c.lower() in e.lower() or e.lower() in c.lower() for e in extracted_skills)
        ][:4]
        if not recommended_skills:
            recommended_skills = ["Docker", "System Design", "CI/CD Pipelines", "Redis"]

        match_ratio = len(matched) / len(reqs) if reqs else 0.8
        overall_match = int(min(96, max(45, round(match_ratio * 80 + 20))))
        ats_shortlist = min(98, overall_match + 2)
        tech_stack_score = min(95, overall_match)
        cs_score = max(55, min(92, overall_match - 4))

        diagnostics = [
            {
                "title": "Technical Stack & Frameworks",
                "percentage": tech_stack_score,
                "status": "Strong" if tech_stack_score >= 80 else "Moderate" if tech_stack_score >= 65 else "Needs Alignment",
                "tags": matched[:4] if matched else extracted_skills[:4],
                "note": f"Matched {len(matched)} of {len(reqs)} core requirements for {job_title}."
            },
            {
                "title": "Academic & Capstone Projects",
                "percentage": min(95, overall_match + 3),
                "status": "Verified",
                "tags": extracted_skills[:3],
                "note": "Technical projects detected and mapped to target role stack."
            },
            {
                "title": "Core Computer Science",
                "percentage": cs_score,
                "status": "Qualified" if cs_score >= 75 else "Needs Review",
                "tags": [s for s in extracted_skills if s in ["Data Structures", "Algorithms", "OOP", "SQL", "DBMS", "PostgreSQL", "MongoDB"]][:3] or ["DBMS", "SQL", "OOP"],
                "note": "Database design & CS logic patterns detected in resume."
            },
            {
                "title": "Education & Formatting",
                "percentage": 90,
                "status": "Passed",
                "tags": ["ATS Layout", "PDF Parsed"],
                "note": "Resume text parsed cleanly into structured AI evaluation matrix."
            }
        ]

    # 3. Degree detection
    for line in raw_lines:
        l_lower = line.lower()
        if any(deg in l_lower for deg in ['b.tech', 'bca', 'mca', 'b.sc', 'm.sc', 'b.e', 'm.tech', 'bachelor', 'master', 'degree', 'phd']):
            diagnostics[-1]["tags"] = [line.strip()[:25], "Degree Verified"]
            diagnostics[-1]["note"] = "Academic credential verified from resume."
            break

    # 4. AI Rewriter bullet extraction
    action_verbs = [
        'developed', 'built', 'created', 'designed', 'implemented', 'managed',
        'engineered', 'optimized', 'architected', 'integrated', 'spearheaded',
        'formulated', 'constructed', 'worked', 'led', 'handled', 'enhanced'
    ]
    candidate_lines = []
    for line in raw_lines:
        clean = re.sub(r'^[•\-\*\d\.\s]+', '', line).strip()
        l_lower = clean.lower()
        if 15 <= len(clean) <= 220:
            if not any(k in l_lower for k in ['@', 'github.com', 'linkedin.com', 'contact', 'phone']):
                if (any(hdr in l_lower for hdr in ['frontend:', 'backend:', 'databases:', 'skills:'])
                        or line.startswith(('-', '•', '*'))
                        or any(l_lower.startswith(v) for v in action_verbs)):
                    candidate_lines.append(clean)

    bullet_rewrites = []
    for orig_line in candidate_lines[:3]:
        rewritten_text, badge_label = contextual_rewrite_line(orig_line)
        bullet_rewrites.append({"before": orig_line, "after": rewritten_text, "badge": badge_label})

    if not bullet_rewrites:
        bullet_rewrites = [{
            "before": "Worked on backend feature development and integrated REST endpoints.",
            "after": f"Engineered 12+ secure RESTful API endpoints in {extracted_skills[0]}, handling 500+ daily requests with sub-100ms response latency.",
            "badge": "+40% Recruiter Engagement"
        }]

    # 5. Project detection
    detected_projects = []
    for line in raw_lines:
        clean = re.sub(r'^[•\-\*\d\.\s]+', '', line).strip()
        l_lower = clean.lower()
        if any(w in l_lower for w in ['project', 'portal', 'system', 'app', 'application', 'platform', 'tool', 'dashboard']):
            if len(clean) < 60 and not clean.endswith('.'):
                detected_projects.append(clean)
    detected_projects = list(dict.fromkeys(detected_projects))

    return {
        "overall_match": overall_match,
        "ats_shortlist": ats_shortlist,
        "tech_stack_score": tech_stack_score,
        "cs_fundamentals_score": cs_score,
        "scores": {
            "ats": ats_shortlist,
            "tech_stack": tech_stack_score,
            "cs_fundamentals": cs_score
        },
        "radar_scores": {
            "skills": tech_stack_score,
            "projects": 20 if is_domain_mismatch else min(95, overall_match + 3),
            "experience": 15 if is_domain_mismatch else max(55, overall_match - 6),
            "education": 70 if is_domain_mismatch else 88,
            "formatting": 90,
            "atsPass": ats_shortlist
        },
        "diagnostics": diagnostics,
        "bullet_rewrites": bullet_rewrites,
        "extracted_skills": extracted_skills,
        "recommended_skills": recommended_skills,
        "feedback": _build_feedback(
            job_title, extracted_skills, recommended_skills,
            overall_match, role_key, matched, reqs,
            domain_info if is_domain_mismatch else None
        )
    }


def analyze_resume_with_gemini(resume_text, job_title="Software Developer"):
    """
    Sends resume to Gemini API for analysis with strict content validity rules.
    Falls back to deep structural analysis on quota errors (429) or API unavailability.
    """
    # Guard clause against short or empty resume text
    if not resume_text or len(resume_text.strip()) < 50:
        raise ValidationError("The uploaded PDF does not contain enough text to be evaluated as a resume.")

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("--- GEMINI API KEY MISSING — USING DEEP RESUME ANALYZER ---")
        return generate_deep_resume_analysis(resume_text, job_title)

    client = genai.Client(api_key=api_key)

    prompt = f"""
You are an expert AI Resume Evaluator and ATS Technical Recruiter with deep knowledge of
100+ job roles across tech, healthcare, legal, finance, business, and creative fields.

Analyze the following resume specifically for: "{job_title}".

CRITICAL VALIDATION & INVALID RESUME RULE:
- If the provided resume text is extremely short (e.g., just "hi", random characters, or lacks professional experience, education, or skill sections typical of a legitimate resume), you MUST set "overall_match": 0, "ats_shortlist": 0, and return feedback explaining that the document does not resemble a legitimate resume.

CRITICAL DOMAIN MISMATCH RULE:
- If the target job is a non-tech role (Doctor, Lawyer, Accountant, Pilot, Civil Engineer, etc.)
  AND the resume contains only Software Engineering / IT skills (Python, React, SQL, etc.),
  you MUST set overall_match between 15–25%, set a "Critical Domain Mismatch" status, and
  recommend the REAL domain qualifications for "{job_title}" in recommended_skills.

Return ONLY valid JSON matching this exact structure:
{{
  "overall_match": 75,
  "ats_shortlist": 77,
  "tech_stack_score": 75,
  "cs_fundamentals_score": 71,
  "scores": {{"ats": 77, "tech_stack": 75, "cs_fundamentals": 71}},
  "radar_scores": {{"skills": 75, "projects": 78, "experience": 69, "education": 88, "formatting": 90, "atsPass": 77}},
  "diagnostics": [
    {{"title": "Technical Stack Alignment", "percentage": 75, "status": "Strong", "tags": ["React.js", "Python"], "note": "Matched 8 of 12 core requirements."}}
  ],
  "bullet_rewrites": [
    {{"before": "Worked on backend API", "after": "Engineered 10+ REST endpoints with sub-100ms latency.", "badge": "+40% Impact"}}
  ],
  "extracted_skills": ["Python", "React.js"],
  "recommended_skills": ["Docker", "CI/CD Pipelines"],
  "feedback": [
    {{"severity": "high", "category": "Skill Match", "title": "Missing Core Keywords", "description": "...", "suggestion": "...", "impact": "+18% ATS Boost", "timeframe": "1 Week"}}
  ]
}}

RESUME TEXT:
{resume_text}
"""

    candidate_models = ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-flash-latest']

    for model_name in candidate_models:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.2,
                ),
            )
            return json.loads(response.text)
        except json.JSONDecodeError:
            pass
        except Exception as api_err:
            last_error = str(api_err)
            print(f"--- GEMINI API ERROR ({model_name}): {last_error} ---")
            if "404" in last_error or "NOT_FOUND" in last_error:
                continue
            if "429" in last_error or "quota" in last_error.lower() or "resource_exhausted" in last_error.lower():
                print("--- GEMINI RATE LIMIT — FALLING BACK TO DEEP ANALYZER ---")
                return generate_deep_resume_analysis(resume_text, job_title)

    print("--- ALL GEMINI MODELS FAILED — USING DEEP RESUME ANALYZER ---")
    return generate_deep_resume_analysis(resume_text, job_title)