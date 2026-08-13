import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Briefcase, Sparkles, FileText, ArrowRight, AlertCircle, X, CheckCircle2, Search, Cpu, Activity, Zap, ShieldAlert, Clock, LogOut, User as UserIcon } from 'lucide-react';

// Import Robot Companion Asset Images
import baseRobotImg from '../assets/base robot.png';
import angryRobotImg from '../assets/angery robot.png';
import thinkingRobotImg from '../assets/robot1 thinking.png';

// ─── All 100+ supported job roles grouped by category ─────────────────────
export const ALL_JOB_ROLES = [
  // ── 1. Software Engineering ──────────────────────────────────────────────
  { label: 'Full Stack Engineer (React / Node.js / TypeScript)', category: 'Software Engineering' },
  { label: 'Full Stack Developer (Python / Django / Vue.js)', category: 'Software Engineering' },
  { label: 'Full Stack Engineer (Java / Spring Boot / Angular)', category: 'Software Engineering' },
  { label: 'Full Stack Developer (.NET Core / C# / React)', category: 'Software Engineering' },
  { label: 'Full Stack Engineer (PHP / Laravel / Next.js)', category: 'Software Engineering' },
  { label: 'Software Engineer - Core Platform', category: 'Software Engineering' },
  { label: 'Senior Principal Software Architect', category: 'Software Engineering' },
  { label: 'Staff Software Engineer - Infrastructure', category: 'Software Engineering' },
  { label: 'Lead Software Development Engineer (SDE III)', category: 'Software Engineering' },
  { label: 'Junior Software Developer', category: 'Software Engineering' },
  { label: 'Software Engineering Manager', category: 'Software Engineering' },
  { label: 'Distributed Systems Engineer', category: 'Software Engineering' },
  { label: 'Microservices Developer', category: 'Software Engineering' },
  { label: 'API Developer & Integration Architect', category: 'Software Engineering' },
  { label: 'Mainframe & Legacy Systems Modernization Engineer', category: 'Software Engineering' },

  // ── 2. Frontend & Mobile Engineering ────────────────────────────────────
  { label: 'Frontend Engineer (React / Next.js / Tailwind CSS)', category: 'Frontend & Mobile Engineering' },
  { label: 'Frontend Developer (Vue.js / Nuxt.js)', category: 'Frontend & Mobile Engineering' },
  { label: 'Frontend Engineer (Angular / RxJS)', category: 'Frontend & Mobile Engineering' },
  { label: 'Senior Design Systems Engineer', category: 'Frontend & Mobile Engineering' },
  { label: 'Web Performance & Accessibility (a11y) Specialist', category: 'Frontend & Mobile Engineering' },
  { label: 'iOS Developer (Swift / SwiftUI / CoreData)', category: 'Frontend & Mobile Engineering' },
  { label: 'Android Developer (Kotlin / Jetpack Compose)', category: 'Frontend & Mobile Engineering' },
  { label: 'Cross-Platform Mobile Engineer (Flutter / Dart)', category: 'Frontend & Mobile Engineering' },
  { label: 'React Native Mobile Application Developer', category: 'Frontend & Mobile Engineering' },
  { label: 'Mobile Architect', category: 'Frontend & Mobile Engineering' },
  { label: 'Progressive Web App (PWA) Developer', category: 'Frontend & Mobile Engineering' },

  // ── 3. Backend & Systems Engineering ────────────────────────────────────
  { label: 'Backend Engineer (Go / Golang Microservices)', category: 'Backend & Systems Engineering' },
  { label: 'Backend Developer (Rust / High-Throughput Systems)', category: 'Backend & Systems Engineering' },
  { label: 'Backend Engineer (Python / FastAPI / AsyncIO)', category: 'Backend & Systems Engineering' },
  { label: 'Backend Developer (Java / Spring Boot / Kafka)', category: 'Backend & Systems Engineering' },
  { label: 'Backend Engineer (C++ / Low-Latency Systems)', category: 'Backend & Systems Engineering' },
  { label: 'Backend Engineer (Node.js / Express / NestJS)', category: 'Backend & Systems Engineering' },
  { label: 'Systems Software Engineer (C / Linux Kernel)', category: 'Backend & Systems Engineering' },
  { label: 'High-Frequency Trading (HFT) Systems Developer', category: 'Backend & Systems Engineering' },
  { label: 'Concurrency & Multi-Threading Software Engineer', category: 'Backend & Systems Engineering' },

  // ── 4. AI, ML & Data Science ─────────────────────────────────────────────
  { label: 'Artificial Intelligence (AI) Engineer', category: 'AI, ML & Data Science' },
  { label: 'Machine Learning Engineer (PyTorch / TensorFlow)', category: 'AI, ML & Data Science' },
  { label: 'Senior Data Scientist (Predictive Modeling & Statistical Inference)', category: 'AI, ML & Data Science' },
  { label: 'Data Engineer (Apache Spark / Airflow / Snowflake)', category: 'AI, ML & Data Science' },
  { label: 'Senior Data Architect (Enterprise Data Warehousing)', category: 'AI, ML & Data Science' },
  { label: 'MLOps Engineer (Model Deployment & Continuous Training)', category: 'AI, ML & Data Science' },
  { label: 'Computer Vision Engineer (OpenCV / Object Detection)', category: 'AI, ML & Data Science' },
  { label: 'Natural Language Processing (NLP) Specialist', category: 'AI, ML & Data Science' },
  { label: 'Speech & Audio Processing AI Engineer', category: 'AI, ML & Data Science' },
  { label: 'Deep Learning Research Scientist', category: 'AI, ML & Data Science' },
  { label: 'Analytics Engineer (dbt / BigQuery / Databricks)', category: 'AI, ML & Data Science' },
  { label: 'Business Intelligence (BI) Developer (Power BI / Tableau)', category: 'AI, ML & Data Science' },
  { label: 'Lead Data Governance & Metadata Analyst', category: 'AI, ML & Data Science' },
  { label: 'AI Hardware Acceleration Engineer (CUDA / TensorRT)', category: 'AI, ML & Data Science' },
  { label: 'Decision Scientist', category: 'AI, ML & Data Science' },
  { label: 'Quantitative Data Analyst', category: 'AI, ML & Data Science' },

  // ── 5. Generative AI & LLM Engineering ──────────────────────────────────
  { label: 'Large Language Model (LLM) Engineer', category: 'Generative AI & LLM Engineering' },
  { label: 'Generative AI Application Developer (LangChain / LlamaIndex)', category: 'Generative AI & LLM Engineering' },
  { label: 'Prompt Engineer & AI Model Evaluator', category: 'Generative AI & LLM Engineering' },
  { label: 'AI Fine-Tuning & RAG Architect (Retrieval-Augmented Generation)', category: 'Generative AI & LLM Engineering' },
  { label: 'AI Safety & Alignment Researcher', category: 'Generative AI & LLM Engineering' },
  { label: 'AI Ethics & Algorithmic Bias Auditor', category: 'Generative AI & LLM Engineering' },
  { label: 'Synthetic Data Generation Specialist', category: 'Generative AI & LLM Engineering' },
  { label: 'AI Agent & Autonomous Workflow Developer', category: 'Generative AI & LLM Engineering' },

  // ── 6. Cloud, DevOps & Infrastructure ────────────────────────────────────
  { label: 'Cloud Solutions Architect (AWS Certified)', category: 'Cloud, DevOps & Infrastructure' },
  { label: 'Cloud Solutions Architect (Microsoft Azure)', category: 'Cloud, DevOps & Infrastructure' },
  { label: 'Google Cloud Platform (GCP) Infrastructure Engineer', category: 'Cloud, DevOps & Infrastructure' },
  { label: 'DevOps Engineer (CI/CD Pipelines / GitHub Actions / Jenkins)', category: 'Cloud, DevOps & Infrastructure' },
  { label: 'Site Reliability Engineer (SRE - Observability & Uptime)', category: 'Cloud, DevOps & Infrastructure' },
  { label: 'Platform Engineer (Internal Developer Portal / Backstage)', category: 'Cloud, DevOps & Infrastructure' },
  { label: 'Kubernetes & Container Orchestration Specialist', category: 'Cloud, DevOps & Infrastructure' },
  { label: 'Infrastructure as Code (IaC) Engineer (Terraform / Pulumi)', category: 'Cloud, DevOps & Infrastructure' },
  { label: 'FinOps Specialist (Cloud Cost Optimization)', category: 'Cloud, DevOps & Infrastructure' },
  { label: 'Hybrid Cloud Infrastructure Engineer', category: 'Cloud, DevOps & Infrastructure' },
  { label: 'Data Center Facilities & Operations Manager', category: 'Cloud, DevOps & Infrastructure' },
  { label: 'Network Engineer (Cisco / SD-WAN / BGP Routing)', category: 'Cloud, DevOps & Infrastructure' },
  { label: 'Telecom & Wireless Network Architect (5G / Fiber)', category: 'Cloud, DevOps & Infrastructure' },

  // ── 7. Cybersecurity & Information Security ─────────────────────────────
  { label: 'Cybersecurity Operations Center (SOC) Analyst', category: 'Cybersecurity & Information Security' },
  { label: 'Ethical Hacker & Penetration Tester', category: 'Cybersecurity & Information Security' },
  { label: 'Red Team Offensive Security Specialist', category: 'Cybersecurity & Information Security' },
  { label: 'Blue Team Defensive Security Engineer', category: 'Cybersecurity & Information Security' },
  { label: 'Enterprise Security Architect (CISSP)', category: 'Cybersecurity & Information Security' },
  { label: 'Application Security (AppSec) Engineer (SAST / DAST)', category: 'Cybersecurity & Information Security' },
  { label: 'Identity and Access Management (IAM) Engineer (Okta / Ping)', category: 'Cybersecurity & Information Security' },
  { label: 'Cloud Security Posture Manager (CSPM)', category: 'Cybersecurity & Information Security' },
  { label: 'Digital Forensics & Incident Response (DFIR) Specialist', category: 'Cybersecurity & Information Security' },
  { label: 'Threat Intelligence Analyst', category: 'Cybersecurity & Information Security' },
  { label: 'Cryptography & Security Protocols Engineer', category: 'Cybersecurity & Information Security' },
  { label: 'Chief Information Security Officer (CISO)', category: 'Cybersecurity & Information Security' },
  { label: 'Vulnerability Management Analyst', category: 'Cybersecurity & Information Security' },
  { label: 'Zero Trust Network Architecture Specialist', category: 'Cybersecurity & Information Security' },

  // ── 8. Database Architecture & Administration ────────────────────────────
  { label: 'PostgreSQL Database Administrator (DBA)', category: 'Database Architecture & Administration' },
  { label: 'MySQL / MariaDB Database Engineer', category: 'Database Architecture & Administration' },
  { label: 'Oracle Database Administrator & PL/SQL Developer', category: 'Database Architecture & Administration' },
  { label: 'Microsoft SQL Server Administrator', category: 'Database Architecture & Administration' },
  { label: 'NoSQL Database Specialist (MongoDB / Cassandra / Redis)', category: 'Database Architecture & Administration' },
  { label: 'Vector Database Architect (Pinecone / Milvus / Qdrant)', category: 'Database Architecture & Administration' },
  { label: 'Database Reliability Engineer (DBRE)', category: 'Database Architecture & Administration' },

  // ── 9. Quality Assurance & Software Testing ──────────────────────────────
  { label: 'Software Development Engineer in Test (SDET - Java / C#)', category: 'Quality Assurance & Software Testing' },
  { label: 'QA Automation Engineer (Cypress / Playwright / Selenium)', category: 'Quality Assurance & Software Testing' },
  { label: 'Mobile QA Automation Engineer (Appium)', category: 'Quality Assurance & Software Testing' },
  { label: 'Performance & Load Testing Engineer (JMeter / k6)', category: 'Quality Assurance & Software Testing' },
  { label: 'Manual Test Analyst & QA Auditor', category: 'Quality Assurance & Software Testing' },
  { label: 'Security QA Analyst', category: 'Quality Assurance & Software Testing' },
  { label: 'Hardware QA & Validation Engineer', category: 'Quality Assurance & Software Testing' },

  // ── 10. Web3, Blockchain & Crypto ───────────────────────────────────────
  { label: 'Smart Contract Developer (Solidity / EVM)', category: 'Web3, Blockchain & Crypto' },
  { label: 'Rust Blockchain Engineer (Solana / Polkadot)', category: 'Web3, Blockchain & Crypto' },
  { label: 'DeFi (Decentralized Finance) Protocol Architect', category: 'Web3, Blockchain & Crypto' },
  { label: 'Smart Contract Security Auditor', category: 'Web3, Blockchain & Crypto' },
  { label: 'Zero-Knowledge (ZK) Cryptography Developer', category: 'Web3, Blockchain & Crypto' },
  { label: 'Tokenomics & Web3 Strategy Analyst', category: 'Web3, Blockchain & Crypto' },
  { label: 'NFT & Web3 Community Technical Lead', category: 'Web3, Blockchain & Crypto' },

  // ── 11. Game Development & Interactive Media ───────────────────────────
  { label: 'Unity Game Developer (C#)', category: 'Game Development & Interactive Media' },
  { label: 'Unreal Engine Programmer (C++)', category: 'Game Development & Interactive Media' },
  { label: 'Gameplay Mechanics Programmer', category: 'Game Development & Interactive Media' },
  { label: 'Game AI Programmer', category: 'Game Development & Interactive Media' },
  { label: 'Game Graphics Programmer (DirectX / Vulkan / Metal)', category: 'Game Development & Interactive Media' },
  { label: 'Technical Artist (Shaders / Rigging / VFX)', category: 'Game Development & Interactive Media' },
  { label: 'Lead Level Designer', category: 'Game Development & Interactive Media' },
  { label: 'Game Economy & Systems Designer', category: 'Game Development & Interactive Media' },
  { label: 'Game Producer & Studio Project Lead', category: 'Game Development & Interactive Media' },
  { label: 'Audio Engineer & Game Sound Designer', category: 'Game Development & Interactive Media' },

  // ── 12. AR, VR & Spatial Computing ──────────────────────────────────────
  { label: 'Spatial Computing Developer (visionOS / Apple Vision Pro)', category: 'AR, VR & Spatial Computing' },
  { label: 'Meta Quest AR/VR Developer (OpenXR)', category: 'AR, VR & Spatial Computing' },
  { label: 'Augmented Reality (AR) Interaction Designer', category: 'AR, VR & Spatial Computing' },
  { label: '3D Computer Graphics & Simulation Engineer', category: 'AR, VR & Spatial Computing' },
  { label: 'Industrial Metaverse Architect', category: 'AR, VR & Spatial Computing' },

  // ── 13. Embedded Systems & IoT Engineering ──────────────────────────────
  { label: 'Embedded Software Engineer (C / C++ / FreeRTOS)', category: 'Embedded Systems & IoT Engineering' },
  { label: 'Firmware Developer (ARM Cortex / Microcontrollers)', category: 'Embedded Systems & IoT Engineering' },
  { label: 'Internet of Things (IoT) Solutions Architect', category: 'Embedded Systems & IoT Engineering' },
  { label: 'Automotive Embedded Systems Engineer (AUTOSAR)', category: 'Embedded Systems & IoT Engineering' },
  { label: 'Robotics Software Engineer (ROS / ROS2)', category: 'Embedded Systems & IoT Engineering' },
  { label: 'Hardware-in-the-Loop (HIL) Test Engineer', category: 'Embedded Systems & IoT Engineering' },

  // ── 14. Quantum Computing & Deep Tech ───────────────────────────────────
  { label: 'Quantum Software Developer (Qiskit / Cirq)', category: 'Quantum Computing & Deep Tech' },
  { label: 'Quantum Algorithm Researcher', category: 'Quantum Computing & Deep Tech' },
  { label: 'Quantum Hardware Physicist', category: 'Quantum Computing & Deep Tech' },
  { label: 'Nanotechnology Research Engineer', category: 'Quantum Computing & Deep Tech' },

  // ── 15. Product Management ──────────────────────────────────────────────
  { label: 'Technical Product Manager (TPM)', category: 'Product Management' },
  { label: 'AI & Data Product Manager', category: 'Product Management' },
  { label: 'Growth Product Manager', category: 'Product Management' },
  { label: 'Platform Product Manager', category: 'Product Management' },
  { label: 'Consumer Mobile Product Manager', category: 'Product Management' },
  { label: 'Enterprise B2B SaaS Product Manager', category: 'Product Management' },
  { label: 'Director of Product Management', category: 'Product Management' },
  { label: 'Chief Product Officer (CPO)', category: 'Product Management' },
  { label: 'Associate Product Manager (APM)', category: 'Product Management' },

  // ── 16. UI/UX & Product Design ──────────────────────────────────────────
  { label: 'Senior Product Designer (Figma / Design Systems)', category: 'UI/UX & Product Design' },
  { label: 'User Experience (UX) Researcher', category: 'UI/UX & Product Design' },
  { label: 'User Interface (UI) Designer', category: 'UI/UX & Product Design' },
  { label: 'Interaction Designer', category: 'UI/UX & Product Design' },
  { label: 'Design Operations (DesignOps) Manager', category: 'UI/UX & Product Design' },
  { label: 'UX Writer & Content Designer', category: 'UI/UX & Product Design' },
  { label: 'Accessibility (a11y) Design Specialist', category: 'UI/UX & Product Design' },
  { label: 'Creative Director - Digital Products', category: 'UI/UX & Product Design' },

  // ── 17. IT Operations & Helpdesk ────────────────────────────────────────
  { label: 'IT Helpdesk Specialist (Tier 1 & Tier 2 Support)', category: 'IT Operations & Helpdesk' },
  { label: 'IT Systems Administrator (Windows / Linux)', category: 'IT Operations & Helpdesk' },
  { label: 'IT Operations Manager', category: 'IT Operations & Helpdesk' },
  { label: 'Enterprise Service Desk Manager (ITIL Certified)', category: 'IT Operations & Helpdesk' },
  { label: 'Mac Operations & Jamf Administrator', category: 'IT Operations & Helpdesk' },
  { label: 'IT Asset Management (ITAM) Specialist', category: 'IT Operations & Helpdesk' },

  // ── 18. Enterprise Architecture & Solutions ────────────────────────────
  { label: 'Enterprise Systems Architect (TOGAF)', category: 'Enterprise Architecture & Solutions' },
  { label: 'Solutions Architect (Pre-Sales & Technical Design)', category: 'Enterprise Architecture & Solutions' },
  { label: 'Salesforce Certified Technical Architect', category: 'Enterprise Architecture & Solutions' },
  { label: 'SAP S/4HANA Functional Consultant', category: 'Enterprise Architecture & Solutions' },
  { label: 'ServiceNow Platform Architect', category: 'Enterprise Architecture & Solutions' },
  { label: 'Workday Enterprise Systems Consultant', category: 'Enterprise Architecture & Solutions' },

  // ── 19. Medical & Clinical Practice ─────────────────────────────────────
  { label: 'General Practitioner / Family Physician', category: 'Medical & Clinical Practice' },
  { label: 'Internal Medicine Physician', category: 'Medical & Clinical Practice' },
  { label: 'Pediatrician', category: 'Medical & Clinical Practice' },
  { label: 'Emergency Room (ER) Physician', category: 'Medical & Clinical Practice' },
  { label: 'Hospitalist Physician', category: 'Medical & Clinical Practice' },
  { label: 'Radiologist & Diagnostic Imaging Specialist', category: 'Medical & Clinical Practice' },
  { label: 'Anesthesiologist', category: 'Medical & Clinical Practice' },
  { label: 'Pathologist', category: 'Medical & Clinical Practice' },
  { label: 'Dermatologist', category: 'Medical & Clinical Practice' },
  { label: 'Neurologist', category: 'Medical & Clinical Practice' },
  { label: 'Oncologist', category: 'Medical & Clinical Practice' },
  { label: 'Obstetrician & Gynecologist (OB/GYN)', category: 'Medical & Clinical Practice' },

  // ── 20. Surgical & Specialist Care ──────────────────────────────────────
  { label: 'Cardiothoracic Surgeon', category: 'Surgical & Specialist Care' },
  { label: 'Neurosurgeon', category: 'Surgical & Specialist Care' },
  { label: 'Orthopedic Surgeon', category: 'Surgical & Specialist Care' },
  { label: 'General Surgeon', category: 'Surgical & Specialist Care' },
  { label: 'Plastic & Reconstructive Surgeon', category: 'Surgical & Specialist Care' },
  { label: 'Vascular Surgeon', category: 'Surgical & Specialist Care' },
  { label: 'Pediatric Surgeon', category: 'Surgical & Specialist Care' },

  // ── 21. Nursing & Patient Care ──────────────────────────────────────────
  { label: 'Registered Nurse (RN - ICU / Critical Care)', category: 'Nursing & Patient Care' },
  { label: 'Nurse Practitioner (NP - Family / Adult Care)', category: 'Nursing & Patient Care' },
  { label: 'Certified Registered Nurse Anesthetist (CRNA)', category: 'Nursing & Patient Care' },
  { label: 'Certified Nurse Midwife (CNM)', category: 'Nursing & Patient Care' },
  { label: 'Emergency Room Registered Nurse', category: 'Nursing & Patient Care' },
  { label: 'Surgical Scrub Nurse', category: 'Nursing & Patient Care' },
  { label: 'Pediatric Registered Nurse', category: 'Nursing & Patient Care' },
  { label: 'Licensed Practical Nurse (LPN / LVN)', category: 'Nursing & Patient Care' },
  { label: 'Clinical Nurse Specialist (CNS)', category: 'Nursing & Patient Care' },

  // ── 22. Pharmacy & Pharmacology ─────────────────────────────────────────
  { label: 'Clinical Pharmacist', category: 'Pharmacy & Pharmacology' },
  { label: 'Retail Staff Pharmacist', category: 'Pharmacy & Pharmacology' },
  { label: 'Pharmacy Director / Hospital Pharmacy Manager', category: 'Pharmacy & Pharmacology' },
  { label: 'Pharmaceutical Compounder', category: 'Pharmacy & Pharmacology' },
  { label: 'Certified Pharmacy Technician (CPhT)', category: 'Pharmacy & Pharmacology' },

  // ── 23. Mental Health & Therapy ─────────────────────────────────────────
  { label: 'Psychiatrist (MD / DO)', category: 'Mental Health & Therapy' },
  { label: 'Licensed Clinical Psychologist (PsyD / PhD)', category: 'Mental Health & Therapy' },
  { label: 'Licensed Marriage & Family Therapist (LMFT)', category: 'Mental Health & Therapy' },
  { label: 'Licensed Clinical Social Worker (LCSW)', category: 'Mental Health & Therapy' },
  { label: 'Licensed Professional Counselor (LPC)', category: 'Mental Health & Therapy' },
  { label: 'Substance Abuse & Addiction Counselor', category: 'Mental Health & Therapy' },
  { label: 'Physical Therapist (DPT)', category: 'Mental Health & Therapy' },
  { label: 'Occupational Therapist (OTR/L)', category: 'Mental Health & Therapy' },
  { label: 'Speech-Language Pathologist (SLP)', category: 'Mental Health & Therapy' },

  // ── 24. Biotech, Genetics & Life Sciences ───────────────────────────────
  { label: 'Bioinformatics Scientist', category: 'Biotech, Genetics & Life Sciences' },
  { label: 'Computational Biologist', category: 'Biotech, Genetics & Life Sciences' },
  { label: 'Genomics & Gene Editing Scientist (CRISPR)', category: 'Biotech, Genetics & Life Sciences' },
  { label: 'Molecular Biologist', category: 'Biotech, Genetics & Life Sciences' },
  { label: 'Microbiologist', category: 'Biotech, Genetics & Life Sciences' },
  { label: 'Immunology Research Scientist', category: 'Biotech, Genetics & Life Sciences' },
  { label: 'Bioprocess Engineer', category: 'Biotech, Genetics & Life Sciences' },

  // ── 25. Pharmaceutical R&D & Clinical Trials ─────────────────────────────
  { label: 'Clinical Research Associate (CRA)', category: 'Pharmaceutical R&D & Clinical Trials' },
  { label: 'Clinical Trial Manager (CTM)', category: 'Pharmaceutical R&D & Clinical Trials' },
  { label: 'Biostatistician - Clinical Trials', category: 'Pharmaceutical R&D & Clinical Trials' },
  { label: 'Medical Writer - Regulatory & Clinical', category: 'Pharmaceutical R&D & Clinical Trials' },
  { label: 'Pharmacovigilance & Drug Safety Officer', category: 'Pharmaceutical R&D & Clinical Trials' },
  { label: 'Regulatory Affairs Manager (FDA / EMA Compliance)', category: 'Pharmaceutical R&D & Clinical Trials' },

  // ── 26. Medical Technology & Devices ───────────────────────────────────
  { label: 'Biomedical Engineer (Medical Devices)', category: 'Medical Technology & Devices' },
  { label: 'Medical Imaging Equipment Specialist', category: 'Medical Technology & Devices' },
  { label: 'Prosthetic & Orthotic Technician', category: 'Medical Technology & Devices' },
  { label: 'Health Informatics Specialist', category: 'Medical Technology & Devices' },

  // ── 27. Executive & C-Suite Leadership ──────────────────────────────────
  { label: 'Chief Executive Officer (CEO)', category: 'Executive & C-Suite Leadership' },
  { label: 'Chief Operating Officer (COO)', category: 'Executive & C-Suite Leadership' },
  { label: 'Chief Financial Officer (CFO)', category: 'Executive & C-Suite Leadership' },
  { label: 'Chief Technology Officer (CTO)', category: 'Executive & C-Suite Leadership' },
  { label: 'Chief Information Officer (CIO)', category: 'Executive & C-Suite Leadership' },
  { label: 'Chief Revenue Officer (CRO)', category: 'Executive & C-Suite Leadership' },
  { label: 'Chief Marketing Officer (CMO)', category: 'Executive & C-Suite Leadership' },
  { label: 'Chief People Officer (CPO / CHRO)', category: 'Executive & C-Suite Leadership' },
  { label: 'Chief Legal Officer (CLO) / General Counsel', category: 'Executive & C-Suite Leadership' },
  { label: 'Managing Director (MD)', category: 'Executive & C-Suite Leadership' },

  // ── 28. Management & Strategy Consulting ────────────────────────────────
  { label: 'Engagement Manager (McKinsey / BCG / Bain)', category: 'Management & Strategy Consulting' },
  { label: 'Management Consultant - Corporate Strategy', category: 'Management & Strategy Consulting' },
  { label: 'Operations Consulting Manager', category: 'Management & Strategy Consulting' },
  { label: 'Mergers & Acquisitions (M&A) Integration Consultant', category: 'Management & Strategy Consulting' },
  { label: 'Digital Transformation Consultant', category: 'Management & Strategy Consulting' },
  { label: 'Business Process Reengineering Specialist', category: 'Management & Strategy Consulting' },

  // ── 29. Human Resources & Talent Acquisition ───────────────────────────
  { label: 'VP of Global Human Resources', category: 'Human Resources & Talent Acquisition' },
  { label: 'HR Business Partner (Senior HRBP)', category: 'Human Resources & Talent Acquisition' },
  { label: 'Technical Recruiter - Engineering & AI', category: 'Human Resources & Talent Acquisition' },
  { label: 'Executive Talent Acquisition Partner', category: 'Human Resources & Talent Acquisition' },
  { label: 'Head of Compensation & Benefits (Total Rewards)', category: 'Human Resources & Talent Acquisition' },
  { label: 'People Analytics Specialist', category: 'Human Resources & Talent Acquisition' },
  { label: 'Diversity, Equity & Inclusion (DEI) Director', category: 'Human Resources & Talent Acquisition' },
  { label: 'Learning & Organizational Development (L&D) Lead', category: 'Human Resources & Talent Acquisition' },

  // ── 30. Operations & Business Performance ──────────────────────────────
  { label: 'Vice President of Operations', category: 'Operations & Business Performance' },
  { label: 'Director of Business Operations (BizOps)', category: 'Operations & Business Performance' },
  { label: 'Chief of Staff to Executive Leadership', category: 'Operations & Business Performance' },
  { label: 'Continuous Improvement / Lean Six Sigma Black Belt', category: 'Operations & Business Performance' },
  { label: 'Agile Transformation & Program Office Lead', category: 'Operations & Business Performance' },
  { label: 'Program Manager - Strategic Initiatives', category: 'Operations & Business Performance' },

  // ── 31. Corporate Governance & Risk Management ─────────────────────────
  { label: 'Enterprise Risk Management (ERM) Director', category: 'Corporate Governance & Risk Management' },
  { label: 'Corporate Secretary & Governance Officer', category: 'Corporate Governance & Risk Management' },
  { label: 'Crisis Management & Business Continuity Planner', category: 'Corporate Governance & Risk Management' },
  { label: 'Internal Controls & Sox Compliance Manager', category: 'Corporate Governance & Risk Management' },

  // ── 32. Investment Banking & Capital Markets ───────────────────────────
  { label: 'Investment Banking Managing Director', category: 'Investment Banking & Capital Markets' },
  { label: 'M&A Investment Banking Analyst / Associate', category: 'Investment Banking & Capital Markets' },
  { label: 'Equity Research Analyst', category: 'Investment Banking & Capital Markets' },
  { label: 'Fixed Income Trader', category: 'Investment Banking & Capital Markets' },
  { label: 'Private Equity Investment Associate', category: 'Investment Banking & Capital Markets' },
  { label: 'Venture Capital Principal / Partner', category: 'Investment Banking & Capital Markets' },
  { label: 'Quantitative Trader / Financial Engineer', category: 'Investment Banking & Capital Markets' },
  { label: 'Portfolio Manager - Hedge Fund', category: 'Investment Banking & Capital Markets' },

  // ── 33. Corporate Finance & Financial Analysis ──────────────────────────
  { label: 'Director of Financial Planning & Analysis (FP&A)', category: 'Corporate Finance & Financial Analysis' },
  { label: 'Senior FP&A Financial Analyst', category: 'Corporate Finance & Financial Analysis' },
  { label: 'Treasury & Liquidity Management Officer', category: 'Corporate Finance & Financial Analysis' },
  { label: 'Corporate Development Lead', category: 'Corporate Finance & Financial Analysis' },
  { label: 'Commercial Credit Risk Analyst', category: 'Corporate Finance & Financial Analysis' },

  // ── 34. Accounting, Audit & Tax ─────────────────────────────────────────
  { label: 'Corporate Controller', category: 'Accounting, Audit & Tax' },
  { label: 'Certified Public Accountant (CPA)', category: 'Accounting, Audit & Tax' },
  { label: 'External Audit Senior Manager (Big Four)', category: 'Accounting, Audit & Tax' },
  { label: 'Internal Audit Director', category: 'Accounting, Audit & Tax' },
  { label: 'Corporate Tax Manager', category: 'Accounting, Audit & Tax' },
  { label: 'Forensic Accountant & Fraud Examiner', category: 'Accounting, Audit & Tax' },
  { label: 'Senior Revenue Accountant (ASC 606)', category: 'Accounting, Audit & Tax' },

  // ── 35. Fintech & Payment Systems ───────────────────────────────────────
  { label: 'Payments Architecture Specialist', category: 'Fintech & Payment Systems' },
  { label: 'AML & Fraud Detection Analyst', category: 'Fintech & Payment Systems' },
  { label: 'Core Banking Systems Developer', category: 'Fintech & Payment Systems' },
  { label: 'Merchant Services & Processing Specialist', category: 'Fintech & Payment Systems' },

  // ── 36. Real Estate, Property & Construction Development ────────────────
  { label: 'Commercial Real Estate Development Director', category: 'Real Estate, Property & Construction Development' },
  { label: 'Real Estate Investment Trust (REIT) Financial Analyst', category: 'Real Estate, Property & Construction Development' },
  { label: 'Licensed Real Estate Broker', category: 'Real Estate, Property & Construction Development' },
  { label: 'Property Operations & Asset Manager', category: 'Real Estate, Property & Construction Development' },
  { label: 'Construction Project Executive', category: 'Real Estate, Property & Construction Development' },

  // ── 37. Insurance & Actuarial Science ──────────────────────────────────
  { label: 'Fellow of the Society of Actuaries (FSA - Health / Life)', category: 'Insurance & Actuarial Science' },
  { label: 'Casualty Actuarial Society Associate (FCAS / ACAS)', category: 'Insurance & Actuarial Science' },
  { label: 'Commercial Lines Insurance Underwriter', category: 'Insurance & Actuarial Science' },
  { label: 'Claims Adjuster & Loss Assessor', category: 'Insurance & Actuarial Science' },

  // ── 38. Legal & Corporate Counsel ───────────────────────────────────────
  { label: 'Corporate M&A Partner / Senior Attorney', category: 'Legal & Corporate Counsel' },
  { label: 'Intellectual Property (IP) & Patent Attorney', category: 'Legal & Corporate Counsel' },
  { label: 'In-House Commercial Contracts Counsel', category: 'Legal & Corporate Counsel' },
  { label: 'Criminal Defense Attorney', category: 'Legal & Corporate Counsel' },
  { label: 'Litigation Attorney', category: 'Legal & Corporate Counsel' },
  { label: 'Employment & Labor Law Attorney', category: 'Legal & Corporate Counsel' },
  { label: 'Senior Paralegal / Legal Operations Manager', category: 'Legal & Corporate Counsel' },

  // ── 39. Compliance, Ethics & Data Privacy ───────────────────────────────
  { label: 'Chief Compliance Officer (CCO)', category: 'Compliance, Ethics & Data Privacy' },
  { label: 'Data Privacy Officer (DPO - CIPP/E Certified)', category: 'Compliance, Ethics & Data Privacy' },
  { label: 'Export Control & Trade Compliance Specialist', category: 'Compliance, Ethics & Data Privacy' },
  { label: 'Regulatory Compliance Analyst', category: 'Compliance, Ethics & Data Privacy' },

  // ── 40. Government, Public Policy & Diplomacy ────────────────────────────
  { label: 'Foreign Service Officer & Diplomat', category: 'Government, Public Policy & Diplomacy' },
  { label: 'Public Policy Director & Government Affairs Lead', category: 'Government, Public Policy & Diplomacy' },
  { label: 'City Planner & Municipal Operations Manager', category: 'Government, Public Policy & Diplomacy' },
  { label: 'Legislative Director / Policy Advisor', category: 'Government, Public Policy & Diplomacy' },

  // ── 41. Law Enforcement, Defense & Security ─────────────────────────────
  { label: 'Intelligence Analyst (Geopolitical / Counterterrorism)', category: 'Law Enforcement, Defense & Security' },
  { label: 'Federal Law Enforcement Special Agent', category: 'Law Enforcement, Defense & Security' },
  { label: 'Defense Systems Program Manager', category: 'Law Enforcement, Defense & Security' },
  { label: 'Executive Protection & Physical Security Specialist', category: 'Law Enforcement, Defense & Security' },

  // ── 42. Digital Marketing & Growth ──────────────────────────────────────
  { label: 'VP of Growth Marketing', category: 'Digital Marketing & Growth' },
  { label: 'Search Engine Optimization (SEO) Director', category: 'Digital Marketing & Growth' },
  { label: 'Performance Marketing & Paid Media Specialist (PPC)', category: 'Digital Marketing & Growth' },
  { label: 'Marketing Automation Manager (HubSpot / Marketo)', category: 'Digital Marketing & Growth' },
  { label: 'Conversion Rate Optimization (CRO) Lead', category: 'Digital Marketing & Growth' },

  // ── 43. Brand, PR & Corporate Communications ────────────────────────────
  { label: 'Director of Global Brand Strategy', category: 'Brand, PR & Corporate Communications' },
  { label: 'Public Relations (PR) Manager & Spokesperson', category: 'Brand, PR & Corporate Communications' },
  { label: 'Corporate Communications Director', category: 'Brand, PR & Corporate Communications' },
  { label: 'Crisis Communications Specialist', category: 'Brand, PR & Corporate Communications' },

  // ── 44. Sales, Business Development & Account Management ────────────────
  { label: 'Enterprise Sales Account Executive (Strategic Accounts)', category: 'Sales, Business Development & Account Management' },
  { label: 'VP of Global Enterprise Sales', category: 'Sales, Business Development & Account Management' },
  { label: 'Sales Development Representative (SDR Manager)', category: 'Sales, Business Development & Account Management' },
  { label: 'Solutions Engineer / Pre-Sales Specialist', category: 'Sales, Business Development & Account Management' },
  { label: 'Strategic Partnerships & Channel Alliances Manager', category: 'Sales, Business Development & Account Management' },

  // ── 45. Customer Success & Support Operations ───────────────────────────
  { label: 'Director of Customer Success Management', category: 'Customer Success & Support Operations' },
  { label: 'Enterprise Customer Success Manager (CSM)', category: 'Customer Success & Support Operations' },
  { label: 'Technical Account Manager (TAM)', category: 'Customer Success & Support Operations' },
  { label: 'Customer Support Operations Lead (Zendesk / Salesforce)', category: 'Customer Success & Support Operations' },

  // ── 46. Content Creation, Journalism & Media ───────────────────────────
  { label: 'Managing Editor & Journalist', category: 'Content Creation, Journalism & Media' },
  { label: 'Technical Writer & API Documentation Author', category: 'Content Creation, Journalism & Media' },
  { label: 'Senior Video Producer & Post-Production Editor', category: 'Content Creation, Journalism & Media' },
  { label: 'Podcast Host & Audio Producer', category: 'Content Creation, Journalism & Media' },

  // ── 47. E-Commerce & Digital Merchandising ──────────────────────────────
  { label: 'Head of E-Commerce Operations (Shopify Plus / Magento)', category: 'E-Commerce & Digital Merchandising' },
  { label: 'Digital Merchandising Manager', category: 'E-Commerce & Digital Merchandising' },
  { label: 'Amazon / Marketplace Growth Specialist', category: 'E-Commerce & Digital Merchandising' },

  // ── 48. Civil, Structural & Environmental Engineering ──────────────────
  { label: 'Senior Structural Engineer (PE / SE Certified)', category: 'Civil, Structural & Environmental Engineering' },
  { label: 'Civil Infrastructure Engineer', category: 'Civil, Structural & Environmental Engineering' },
  { label: 'Environmental Engineering Consultant', category: 'Civil, Structural & Environmental Engineering' },
  { label: 'Geotechnical Engineer', category: 'Civil, Structural & Environmental Engineering' },
  { label: 'Hydrology & Water Resources Engineer', category: 'Civil, Structural & Environmental Engineering' },

  // ── 49. Mechanical, Aerospace & Robotics Engineering ──────────────────
  { label: 'Mechanical Engineer (CAD / SolidWorks / FEA)', category: 'Mechanical, Aerospace & Robotics Engineering' },
  { label: 'Aerospace Propulsion Engineer', category: 'Mechanical, Aerospace & Robotics Engineering' },
  { label: 'Avionics Systems Architect', category: 'Mechanical, Aerospace & Robotics Engineering' },
  { label: 'Robotics Control Systems Engineer', category: 'Mechanical, Aerospace & Robotics Engineering' },
  { label: 'Thermal Management & HVAC Design Engineer', category: 'Mechanical, Aerospace & Robotics Engineering' },

  // ── 50. Electrical, Electronics & Power Engineering ────────────────────
  { label: 'Electrical Engineer (Power Distribution / High Voltage)', category: 'Electrical, Electronics & Power Engineering' },
  { label: 'Printed Circuit Board (PCB) Layout Engineer', category: 'Electrical, Electronics & Power Engineering' },
  { label: 'ASIC / FPGA Design Engineer (Verilog / VHDL)', category: 'Electrical, Electronics & Power Engineering' },
  { label: 'RF & Microwave Systems Engineer', category: 'Electrical, Electronics & Power Engineering' },

  // ── 51. Chemical, Materials & Process Engineering ───────────────────────
  { label: 'Chemical Process Safety Engineer', category: 'Chemical, Materials & Process Engineering' },
  { label: 'Materials Science Research Engineer', category: 'Chemical, Materials & Process Engineering' },
  { label: 'Metallurgical Engineer', category: 'Chemical, Materials & Process Engineering' },
  { label: 'Plastics & Polymer Engineer', category: 'Chemical, Materials & Process Engineering' },

  // ── 52. Architecture, Urban Planning & Interior Design ──────────────────
  { label: 'Principal Registered Architect (NCARB)', category: 'Architecture, Urban Planning & Interior Design' },
  { label: 'Urban Designer & Master Planner', category: 'Architecture, Urban Planning & Interior Design' },
  { label: 'Commercial Interior Designer (NCIDQ)', category: 'Architecture, Urban Planning & Interior Design' },
  { label: 'Building Information Modeling (BIM) Manager', category: 'Architecture, Urban Planning & Interior Design' },

  // ── 53. Skilled Trades, Manufacturing & Construction ───────────────────
  { label: 'Master Electrician', category: 'Skilled Trades, Manufacturing & Construction' },
  { label: 'Licensed Master Plumber', category: 'Skilled Trades, Manufacturing & Construction' },
  { label: 'HVAC Certified Master Technician', category: 'Skilled Trades, Manufacturing & Construction' },
  { label: 'CNC Machinist & Programmer', category: 'Skilled Trades, Manufacturing & Construction' },
  { label: 'Industrial Automation Specialist (PLC / SCADA)', category: 'Skilled Trades, Manufacturing & Construction' },

  // ── 54. Supply Chain, Logistics & Procurement ─────────────────────────
  { label: 'Vice President of Global Supply Chain', category: 'Supply Chain, Logistics & Procurement' },
  { label: 'Procurement & Strategic Sourcing Director', category: 'Supply Chain, Logistics & Procurement' },
  { label: 'Global Logistics Operations Manager', category: 'Supply Chain, Logistics & Procurement' },
  { label: 'Demand Planning & Inventory Analyst', category: 'Supply Chain, Logistics & Procurement' },
  { label: 'Customs & Trade Compliance Manager', category: 'Supply Chain, Logistics & Procurement' },

  // ── 55. Renewable Energy, Climate & Environmental Science ──────────────
  { label: 'Solar Photovoltaic (PV) Systems Engineer', category: 'Renewable Energy, Climate & Environmental Science' },
  { label: 'Wind Energy Project Developer', category: 'Renewable Energy, Climate & Environmental Science' },
  { label: 'Battery Energy Storage Systems (BESS) Engineer', category: 'Renewable Energy, Climate & Environmental Science' },
  { label: 'ESG & Carbon Accounting Specialist', category: 'Renewable Energy, Climate & Environmental Science' },
  { label: 'Climate Resilience & Sustainability Consultant', category: 'Renewable Energy, Climate & Environmental Science' },

  // ── 56. Agriculture, AgTech & Food Science ─────────────────────────────
  { label: 'Agronomist & AgTech Specialist', category: 'Agriculture, AgTech & Food Science' },
  { label: 'Food Scientist & Product Developer', category: 'Agriculture, AgTech & Food Science' },
  { label: 'Vertical Farming & Hydroponics Manager', category: 'Agriculture, AgTech & Food Science' },
  { label: 'Agricultural Supply Chain Lead', category: 'Agriculture, AgTech & Food Science' },

  // ── 57. Education, Academic Research & EdTech ──────────────────────────
  { label: 'Tenured University Professor', category: 'Education, Academic Research & EdTech' },
  { label: 'Postdoctoral Research Scientist', category: 'Education, Academic Research & EdTech' },
  { label: 'Instructional Designer & Curriculum Developer', category: 'Education, Academic Research & EdTech' },
  { label: 'EdTech Platform Director', category: 'Education, Academic Research & EdTech' },
  { label: 'High School STEM Educator', category: 'Education, Academic Research & EdTech' },

  // ── 58. Aviation, Aerospace & Maritime Operations ───────────────────────
  { label: 'Commercial Airline Captain (ATP Certified)', category: 'Aviation, Aerospace & Maritime Operations' },
  { label: 'Air Traffic Control Specialist', category: 'Aviation, Aerospace & Maritime Operations' },
  { label: 'Aircraft Maintenance Director (FAA A&P License)', category: 'Aviation, Aerospace & Maritime Operations' },
  { label: 'Maritime Vessel Captain', category: 'Aviation, Aerospace & Maritime Operations' },

  // ── 59. Performing Arts, Entertainment & Hospitality ────────────────────
  { label: 'Film & Television Director', category: 'Performing Arts, Entertainment & Hospitality' },
  { label: 'Sound Engineer & Live Event Mixer', category: 'Performing Arts, Entertainment & Hospitality' },
  { label: 'Executive Chef', category: 'Performing Arts, Entertainment & Hospitality' },
  { label: 'General Manager - Luxury Hotel Operations', category: 'Performing Arts, Entertainment & Hospitality' },

  // ── 60. Sports, Fitness & Athletics ────────────────────────────────────
  { label: 'Head Strength & Conditioning Coach', category: 'Sports, Fitness & Athletics' },
  { label: 'Certified Athletic Trainer (ATC)', category: 'Sports, Fitness & Athletics' },
  { label: 'Sports Analytics Lead', category: 'Sports, Fitness & Athletics' },
  { label: 'Director of Athletic Operations', category: 'Sports, Fitness & Athletics' }
];
export const CATEGORY_COLORS = {
  // Technology & Software
  'Software Engineering': '#a78bfa',
  'Frontend & Mobile Engineering': '#818cf8',
  'Backend & Systems Engineering': '#6366f1',
  'AI, ML & Data Science': '#22d3ee',
  'Generative AI & LLM Engineering': '#06b6d4',
  'Cloud, DevOps & Infrastructure': '#34d399',
  'Cybersecurity & Information Security': '#f87171',
  'Database Architecture & Administration': '#a3e635',
  'Quality Assurance & Software Testing': '#4ade80',
  'Web3, Blockchain & Crypto': '#fbbf24',
  'Game Development & Interactive Media': '#f59e0b',
  'AR, VR & Spatial Computing': '#d97706',
  'Embedded Systems & IoT Engineering': '#c084fc',
  'Quantum Computing & Deep Tech': '#e879f9',

  // Product, Design & IT
  'Product Management': '#f472b6',
  'UI/UX & Product Design': '#ec4899',
  'IT Operations & Helpdesk': '#94a3b8',
  'Enterprise Architecture & Solutions': '#64748b',

  // Healthcare & Life Sciences
  'Medical & Clinical Practice': '#2dd4bf',
  'Surgical & Specialist Care': '#14b8a6',
  'Nursing & Patient Care': '#0d9488',
  'Pharmacy & Pharmacology': '#0f766e',
  'Mental Health & Therapy': '#065f46',
  'Biotech, Genetics & Life Sciences': '#0284c7',
  'Pharmaceutical R&D & Clinical Trials': '#0369a1',
  'Medical Technology & Devices': '#075985',

  // Business, HR & Leadership
  'Executive & C-Suite Leadership': '#f97316',
  'Management & Strategy Consulting': '#ea580c',
  'Human Resources & Talent Acquisition': '#c2410c',
  'Operations & Business Performance': '#9a3412',
  'Corporate Governance & Risk Management': '#b45309',

  // Finance, Banking & Real Estate
  'Investment Banking & Capital Markets': '#facc15',
  'Corporate Finance & Financial Analysis': '#eab308',
  'Accounting, Audit & Tax': '#ca8a04',
  'Fintech & Payment Systems': '#a16207',
  'Real Estate, Property & Construction Development': '#854d0e',
  'Insurance & Actuarial Science': '#713f12',

  // Legal, Policy & Public Sector
  'Legal & Corporate Counsel': '#e879f9',
  'Compliance, Ethics & Data Privacy': '#d946ef',
  'Government, Public Policy & Diplomacy': '#c026d3',
  'Law Enforcement, Defense & Security': '#a21caf',

  // Marketing, Sales & Media
  'Digital Marketing & Growth': '#fb7185',
  'Brand, PR & Corporate Communications': '#f43f5e',
  'Sales, Business Development & Account Management': '#e11d48',
  'Customer Success & Support Operations': '#be123c',
  'Content Creation, Journalism & Media': '#9f1239',
  'E-Commerce & Digital Merchandising': '#881337',

  // Core Engineering, Science & Trades
  'Civil, Structural & Environmental Engineering': '#cbd5e1',
  'Mechanical, Aerospace & Robotics Engineering': '#94a3b8',
  'Electrical, Electronics & Power Engineering': '#64748b',
  'Chemical, Materials & Process Engineering': '#475569',
  'Architecture, Urban Planning & Interior Design': '#334155',
  'Skilled Trades, Manufacturing & Construction': '#1e293b',

  // Logistics, Energy & Agriculture
  'Supply Chain, Logistics & Procurement': '#38bdf8',
  'Renewable Energy, Climate & Environmental Science': '#10b981',
  'Agriculture, AgTech & Food Science': '#84cc16',

  // Education & Specialized Arts
  'Education, Academic Research & EdTech': '#a3e635',
  'Aviation, Aerospace & Maritime Operations': '#0284c7',
  'Performing Arts, Entertainment & Hospitality': '#f472b6',
  'Sports, Fitness & Athletics': '#fb923c'
};

export default function HomePage({ 
  jobTitle: externalJobTitle, 
  setJobTitle: externalSetJobTitle, 
  resumeFile: externalResumeFile, 
  setResumeFile: externalSetResumeFile, 
  onAnalyze,
  isLoading = false,
  error: externalError = '',
  token,
  username,
  onLogout
}) {
  const [localResumeFile, setLocalResumeFile] = useState(null);
  const [localJobTitle, setLocalJobTitle] = useState('');
  const [localError, setLocalError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isPaused, setIsPaused] = useState(false);

  const [robotState, setRobotState] = useState('base');
  const [speechText, setSpeechText] = useState("Hi! I'm your AI Assistant. Upload your resume & select a job title!");

  const [historyData, setHistoryData] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (token) {
      fetch('http://127.0.0.1:8000/api/history/', {
        headers: { 'Authorization': `Token ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setHistoryData(data);
      })
      .catch(err => console.error("Error fetching history:", err));
    }
  }, [token]);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const resumeFile = externalResumeFile !== undefined ? externalResumeFile : localResumeFile;
  const setResumeFile = externalSetResumeFile || setLocalResumeFile;
  const jobTitle = externalJobTitle !== undefined ? externalJobTitle : localJobTitle;
  const setJobTitle = externalSetJobTitle || setLocalJobTitle;
  const error = externalError || localError;

  useEffect(() => {
    if (error) {
      setRobotState('angry');
      setSpeechText(error);
    }
  }, [error]);

  useEffect(() => {
    if (isLoading) {
      setRobotState('thinking');
      setSpeechText('Neural scan in progress... Matching resume vectors against 100+ industry role benchmarks!');
    }
  }, [isLoading]);

  const query = (jobTitle || '').trim().toLowerCase();
  const filteredRoles = query.length === 0
    ? ALL_JOB_ROLES
    : ALL_JOB_ROLES.filter(r => r.label.toLowerCase().includes(query) || r.category.toLowerCase().includes(query));

  const grouped = filteredRoles.reduce((acc, role) => {
    if (!acc[role.category]) acc[role.category] = [];
    acc[role.category].push(role);
    return acc;
  }, {});

  const flatList = filteredRoles;

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = (label) => {
    setJobTitle(label);
    setShowDropdown(false);
    setHighlightedIndex(-1);
    if (localError) setLocalError('');
    if (robotState === 'angry') {
      setRobotState('base');
    }
    setSpeechText(`Target role locked: "${label}". Click Start AI Analysis when ready!`);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(i => Math.min(i + 1, flatList.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelect(flatList[highlightedIndex].label);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const isValidFileType = (file) => {
    if (!file) return false;
    const validExtensions = ['pdf', 'docx', 'txt'];
    const ext = file.name.split('.').pop().toLowerCase();
    return validExtensions.includes(ext);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && isValidFileType(file)) {
      setResumeFile(file);
      if (localError) setLocalError('');
      if (robotState === 'angry') setRobotState('base');
      setSpeechText(`Attached ${file.name}! Now pick or confirm your target job position.`);
    } else {
      setLocalError('Please upload a valid PDF, DOCX, or TXT file.');
      setRobotState('angry');
      setSpeechText('Format Error! Document must be a PDF, DOCX, or TXT file.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file && isValidFileType(file)) {
      setResumeFile(file);
      if (localError) setLocalError('');
      if (robotState === 'angry') setRobotState('base');
      setSpeechText(`Attached ${file.name}! Now select your target job role.`);
    } else if (file) {
      setLocalError('Please upload a valid PDF, DOCX, or TXT file.');
      setRobotState('angry');
      setSpeechText('Format Error! Document must be a PDF, DOCX, or TXT file.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const missingFile = !resumeFile;
    const missingJob = !jobTitle.trim();

    if (missingFile || missingJob) {
      setRobotState('angry');

      if (missingFile && missingJob) {
        setLocalError('Please upload a resume (PDF, DOCX, or TXT) and select a target job title.');
        setSpeechText('Hey! You forgot to upload a resume AND select a job title!');
      } else if (missingFile) {
        setLocalError('Please upload your resume file first.');
        setSpeechText('Hey! I need your resume first before I can analyze!');
      } else {
        setLocalError('Please enter or select a target job title.');
        setSpeechText('Hey! Pick a target job title so I know what role to grade you for!');
      }

      setTimeout(() => {
        setRobotState(current => (current === 'angry' ? 'base' : current));
        setSpeechText("I'm waiting! Complete the missing fields above to get started.");
      }, 3500);

      return;
    }

    setLocalError('');
    setRobotState('thinking');
    setSpeechText('Processing resume with Gemini AI... Evaluating 100+ industry requirements!');

    setTimeout(() => {
      if (onAnalyze) onAnalyze();
    }, 2000);
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-between p-4 sm:p-6 overflow-hidden relative" style={{ background: 'radial-gradient(ellipse at 20% 20%, rgba(124,58,237,0.18) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(6,182,212,0.14) 0%, transparent 60%), #040714' }}>

      {/* Cyberpunk Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(124,58,237,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.15) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 w-full max-w-6xl mx-auto my-auto">

        {/* Top Header & User Menu */}
        <div className="flex justify-between items-start mb-6">
          <div className="text-left max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2 border backdrop-blur-md shadow-lg" style={{ background: 'rgba(124,58,237,0.12)', borderColor: 'rgba(124,58,237,0.3)', color: '#a78bfa' }}>
              <Sparkles size={11} className="text-cyan-400 animate-spin-slow" /> AI Resume Reader & Evaluator
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight">
              Land Your <span style={{ background: 'linear-gradient(135deg,#a78bfa 0%,#22d3ee 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dream Role</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed font-medium">
              Upload your resume & evaluate against <span className="text-cyan-300 font-bold">100+ industry job roles</span> with instant ATS scoring.
            </p>
          </div>

          {/* Top Right User Menu */}
          {token && (
            <div className="flex items-center gap-3 relative z-50">
              {/* History Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setShowHistory(true)}
                onMouseLeave={() => setShowHistory(false)}
              >
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-violet-400 cursor-pointer hover:bg-white/10 transition flex items-center justify-center relative shadow-sm">
                  <Clock size={18} />
                  {historyData.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#040714]" />
                  )}
                </div>
                
                <AnimatePresence>
                  {showHistory && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-12 w-72 bg-[#0f172a] border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50"
                    >
                      <div className="p-3 border-b border-slate-700 bg-slate-800/50 flex items-center gap-2">
                        <Clock size={14} className="text-slate-400" />
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Analysis History</h4>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {historyData.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-500 italic">No history yet.</div>
                        ) : (
                          historyData.map(h => (
                            <div key={h.id} className="p-3 border-b border-slate-800 hover:bg-slate-800/50 transition">
                              <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-bold text-white truncate max-w-[160px]">{h.job_title}</span>
                                <span className={`text-xs font-black ${h.match_score >= 75 ? 'text-emerald-400' : h.match_score >= 45 ? 'text-amber-400' : 'text-red-400'}`}>
                                  {h.match_score}%
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-500 truncate">{h.file_name}</div>
                              <div className="text-[9px] text-slate-600 mt-1">{new Date(h.created_at).toLocaleDateString()}</div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Profile Info */}
              <div className="flex items-center gap-2 pl-3 border-l border-white/10">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                  <UserIcon size={16} />
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-bold text-white">{username}</div>
                  <div className="text-[9px] text-emerald-400 font-medium tracking-wide">ONLINE</div>
                </div>
                <button 
                  onClick={onLogout}
                  className="ml-2 p-1.5 text-slate-400 hover:text-red-400 transition rounded-lg hover:bg-red-500/10"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Main Split Grid: Left = Form, Right = 3D Robot Mascot Stage ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          {/* LEFT: Upload & Input Form (Col 7) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex-1 rounded-3xl p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden" style={{ background: 'rgba(15, 20, 38, 0.75)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(30px)', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}>
              
              <div className="absolute top-0 left-0 w-24 h-[2px] bg-gradient-to-r from-violet-500 to-transparent" />
              <div className="absolute top-0 left-0 h-24 w-[2px] bg-gradient-to-b from-violet-500 to-transparent" />

              <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col justify-between">

                <div className="space-y-4">
                  {/* Step 1: Resume Upload Dropzone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                      <FileText size={14} className="text-violet-400" /> Resume Document (PDF)
                    </label>
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => !resumeFile && document.getElementById('resume-file-input')?.click()}
                      className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center p-4 h-[105px] shrink-0 ${
                        isDragging
                          ? 'border-violet-400 bg-violet-500/15 scale-[1.01]'
                          : resumeFile
                          ? 'border-emerald-500/60 bg-emerald-500/10 cursor-default'
                          : 'border-slate-700/80 hover:border-violet-500/80 hover:bg-violet-500/5'
                      }`}
                    >
                      <input
                        id="resume-file-input"
                        type="file"
                        accept=".pdf,.docx,.txt"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      {resumeFile ? (
                        <>
                          <CheckCircle2 className="mb-1 text-emerald-400 animate-pulse shrink-0" size={24} />
                          <p className="text-xs font-bold text-emerald-400 truncate max-w-full px-2">{resumeFile.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{formatFileSize(resumeFile.size)} · Click X to remove</p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setResumeFile(null);
                              setSpeechText("Resume removed. Upload a new document whenever you're ready!");
                            }}
                            className="absolute top-2 right-2 text-slate-400 hover:text-red-400 transition cursor-pointer p-1 rounded-full hover:bg-white/10"
                          >
                            <X size={14} />
                          </button>
                        </>
                      ) : (
                        <>
                          <FileText className={`mx-auto mb-1 transition-all duration-300 shrink-0 ${isDragging ? 'text-violet-400 scale-110' : 'text-slate-500'}`} size={24} />
                          <p className="text-xs font-semibold text-slate-300">
                            {isDragging ? 'Drop your file here' : 'Click or drag & drop your resume'}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Supports PDF files up to 10MB</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Step 2: Target Job Title Autocomplete */}
                  <div className="space-y-1.5" ref={dropdownRef}>
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                      <Briefcase size={14} className="text-cyan-400" /> Target Job Title
                      <span className="ml-auto text-[10px] font-normal text-slate-500">{ALL_JOB_ROLES.length} roles available</span>
                    </label>

                    <div className="relative">
                      <div className="relative flex items-center">
                        <Search size={14} className="absolute left-3.5 text-slate-500 pointer-events-none" />
                        <input
                          ref={inputRef}
                          type="text"
                          placeholder="Search or type any target position..."
                          value={jobTitle}
                          onChange={(e) => {
                            setJobTitle(e.target.value);
                            setShowDropdown(true);
                            setHighlightedIndex(-1);
                            if (localError) setLocalError('');
                          }}
                          onFocus={() => setShowDropdown(true)}
                          onKeyDown={handleKeyDown}
                          className="w-full text-xs text-slate-200 bg-slate-900/90 border border-slate-700/80 rounded-xl pl-9 pr-10 py-3 outline-none focus:border-violet-500 transition placeholder-slate-600 shadow-inner"
                          autoComplete="off"
                        />
                        {jobTitle && (
                          <button
                            type="button"
                            onClick={() => {
                              setJobTitle('');
                              setShowDropdown(true);
                              inputRef.current?.focus();
                            }}
                            className="absolute right-3 text-slate-500 hover:text-slate-300 transition cursor-pointer"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>

                      {/* Autocomplete Dropdown List */}
                      {showDropdown && (
                        <div
                          className="absolute z-50 w-full mt-1.5 rounded-2xl overflow-hidden"
                          style={{
                            background: 'rgba(10,10,30,0.98)',
                            border: '1px solid rgba(124,58,237,0.4)',
                            boxShadow: '0 24px 64px rgba(0,0,0,0.85)',
                            backdropFilter: 'blur(24px)',
                            maxHeight: '240px',
                            overflowY: 'auto',
                          }}
                        >
                          {Object.keys(grouped).length === 0 ? (
                            <div className="px-4 py-4 text-center text-xs text-slate-500">
                              No exact role matches — you can still type any custom job title!
                            </div>
                          ) : (
                            Object.entries(grouped).map(([category, roles]) => {
                              const color = CATEGORY_COLORS[category] || '#94a3b8';
                              return (
                                <div key={category}>
                                  <div className="px-3 pt-2.5 pb-1 flex items-center gap-2 sticky top-0" style={{ background: 'rgba(10,10,30,0.98)' }}>
                                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
                                    <span className="text-[9px] font-extrabold uppercase tracking-widest" style={{ color }}>{category}</span>
                                  </div>
                                  {roles.map((role) => {
                                    const flatIdx = flatList.indexOf(role);
                                    const isHighlighted = flatIdx === highlightedIndex;
                                    const queryLower = query;
                                    const idx = role.label.toLowerCase().indexOf(queryLower);
                                    let labelEl;
                                    if (queryLower && idx !== -1) {
                                      labelEl = (
                                        <span>
                                          {role.label.slice(0, idx)}
                                          <span style={{ color, fontWeight: 700 }}>{role.label.slice(idx, idx + queryLower.length)}</span>
                                          {role.label.slice(idx + queryLower.length)}
                                        </span>
                                      );
                                    } else {
                                      labelEl = role.label;
                                    }
                                    return (
                                      <button
                                        key={role.label}
                                        type="button"
                                        onMouseEnter={() => setHighlightedIndex(flatIdx)}
                                        onMouseDown={(e) => { e.preventDefault(); handleSelect(role.label); }}
                                        className="w-full text-left px-4 py-2 text-xs transition-all flex items-center gap-2 cursor-pointer"
                                        style={{
                                          background: isHighlighted ? 'rgba(124,58,237,0.22)' : 'transparent',
                                          color: isHighlighted ? '#f8fafc' : '#94a3b8',
                                          borderLeft: isHighlighted ? `3px solid ${color}` : '3px solid transparent',
                                        }}
                                      >
                                        {labelEl}
                                      </button>
                                    );
                                  })}
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Error Banner */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-500/15 border border-red-500/40 text-red-400 text-xs p-3 rounded-xl flex items-center gap-2"
                    >
                      <AlertCircle size={14} className="shrink-0 text-red-400" />
                      <span className="font-semibold">{error}</span>
                    </motion.div>
                  )}
                </div>

                {/* Start AI Analysis Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl text-xs font-black uppercase tracking-wider text-white shadow-xl shadow-purple-600/30 transition flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  <span>{isLoading || robotState === 'thinking' ? 'Analyzing with Gemini AI...' : 'Start AI Analysis'}</span>
                  {!isLoading && robotState !== 'thinking' && <ArrowRight size={16} />}
                </motion.button>
              </form>
            </div>
          </div>

          {/* ── RIGHT: 3D Robot Mascot Stage with Dynamic 3-State Animations ── */}
          <div className="lg:col-span-5 flex flex-col">

            <div
              className="relative w-full flex-1 flex flex-col items-center justify-between text-center p-5 sm:p-6 rounded-3xl transition-all duration-500"
              style={{
                background: 'radial-gradient(ellipse at 50% 50%, rgba(20, 25, 50, 0.85) 0%, rgba(8, 12, 28, 0.95) 100%)',
                border: robotState === 'angry'
                  ? '1px solid rgba(239, 68, 68, 0.4)'
                  : robotState === 'thinking'
                  ? '1px solid rgba(6, 182, 212, 0.4)'
                  : '1px solid rgba(124, 58, 237, 0.25)',
                backdropFilter: 'blur(30px)',
                boxShadow: robotState === 'angry'
                  ? '0 24px 60px rgba(239, 68, 68, 0.25), inset 0 0 30px rgba(239, 68, 68, 0.1)'
                  : robotState === 'thinking'
                  ? '0 24px 60px rgba(6, 182, 212, 0.25), inset 0 0 30px rgba(6, 182, 212, 0.1)'
                  : '0 24px 60px rgba(124, 58, 237, 0.25), inset 0 0 30px rgba(124, 58, 237, 0.08)',
              }}
            >
              {/* Sci-Fi HUD Header Badges */}
              <div className="w-full flex items-center justify-between text-[9px] font-black uppercase tracking-widest px-1">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Cpu size={12} className={robotState === 'thinking' ? 'text-cyan-400 animate-spin' : 'text-violet-400'} />
                  <span>AI Core: {robotState.toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Activity size={12} className={robotState === 'angry' ? 'text-red-400 animate-pulse' : 'text-cyan-400'} />
                  <span className={robotState === 'angry' ? 'text-red-400' : 'text-cyan-400'}>
                    {robotState === 'angry' ? 'SYSTEM ALERT' : 'ONLINE'}
                  </span>
                </div>
              </div>

              {/* Speech / Status Bubble */}
              <div className="w-full my-3 relative">
                <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-700/60 text-xs text-slate-200 font-medium relative shadow-lg">
                  {speechText}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-slate-900/90 border-r border-b border-slate-700/60 rotate-45" />
                </div>
              </div>

              {/* Robot Image Mascot */}
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center my-auto">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={robotState}
                    src={
                      robotState === 'angry'
                        ? angryRobotImg
                        : robotState === 'thinking'
                        ? thinkingRobotImg
                        : baseRobotImg
                    }
                    alt="AI Assistant Robot"
                    initial={{ opacity: 0, scale: 0.85, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.85, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-contain filter drop-shadow-[0_10px_25px_rgba(124,58,237,0.3)]"
                  />
                </AnimatePresence>
              </div>

              {/* Status Footer Badge */}
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold uppercase tracking-wider bg-slate-900/60 px-3 py-1 rounded-full border border-slate-800">
                <Zap size={12} className="text-amber-400" /> Powered by Gemini AI Processing Engine
              </div>

            </div>
          </div>

        </div>
        
      </div>

      {/* ── Bottom Moving ATS Guide & Ticker Bar ── */}
      <div className="w-full z-20 overflow-hidden py-3 border-t border-violet-500/20 bg-slate-950/85 backdrop-blur-md shadow-2xl shrink-0">
        <div className="flex items-center max-w-7xl mx-auto px-4">
          
          {/* Static Label Badge */}
          <div className="shrink-0 flex items-center gap-2 text-[10px] font-black text-violet-400 uppercase tracking-widest border-r border-slate-800 pr-4 mr-4">
            <Sparkles size={12} className="text-cyan-400 animate-spin-slow" /> ATS Insights Guide[cite: 3]
          </div>

          {/* Moving Ticker Track with Smooth CSS Animation Play-State Control */}
          <div 
            className="overflow-hidden whitespace-nowrap flex w-full relative cursor-pointer"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className="flex items-center gap-12 text-xs text-slate-300 font-medium animate-ticker"
              style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
            >
              {[
                { icon: Cpu, text: "What is ATS? Applicant Tracking System software used by companies to collect, organize, filter, and rank resumes before human review.", color: "text-violet-400" },
                { icon: FileText, text: "Step 1: Upload your resume document and let the intelligent parser scan your content.", color: "text-cyan-400" },
                { icon: Search, text: "Step 2: Key information extraction covers Name, Contact details, Skills, Education, Work experience, Projects, and Certifications.", color: "text-emerald-400" },
                { icon: Activity, text: "Step 3: The system compares your profile directly against the job description to assign an instant match score.", color: "text-amber-400" },
                { icon: Sparkles, text: "Recruiter Priority: Companies and recruiters always review the highest-scoring resumes first!", color: "text-purple-400" },
                { icon: Cpu, text: "What is ATS? Applicant Tracking System software used by companies to collect, organize, filter, and rank resumes before human review.", color: "text-violet-400" },
                { icon: FileText, text: "Step 1: Upload your resume document and let the intelligent parser scan your content.", color: "text-cyan-400" },
                { icon: Search, text: "Step 2: Key information extraction covers Name, Contact details, Skills, Education, Work experience, Projects, and Certifications.", color: "text-emerald-400" },
                { icon: Activity, text: "Step 3: The system compares your profile directly against the job description to assign an instant match score.", color: "text-amber-400" },
                { icon: Sparkles, text: "Recruiter Priority: Companies and recruiters always review the highest-scoring resumes first!", color: "text-purple-400" }
              ].map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-2.5 shrink-0">
                    <div className={`p-1 rounded-lg bg-slate-900/90 border border-slate-800 shadow-sm ${item.color}`}>
                      <IconComponent size={14} />
                    </div>
                    <span>{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}