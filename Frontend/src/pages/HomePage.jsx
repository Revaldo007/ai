import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Briefcase, Sparkles, FileText, ArrowRight, AlertCircle, X, CheckCircle2, Search, Cpu, Activity, Zap, ShieldAlert } from 'lucide-react';

// Import Robot Companion Asset Images (Now 100% Native Alpha Transparent PNGs)
import baseRobotImg from '../assets/base robot.png';
import angryRobotImg from '../assets/angery robot.png';
import thinkingRobotImg from '../assets/robot1 thinking.png';

// ─── All 100+ supported job roles grouped by category ─────────────────────
const ALL_JOB_ROLES = [
  // Software Engineering
  { label: 'Full Stack Developer (React / Node / Python)', category: 'Software Engineering' },
  { label: 'Frontend Developer (React / Next.js / Vue)', category: 'Software Engineering' },
  { label: 'Backend Engineer (Python / Django / Node)', category: 'Software Engineering' },
  { label: 'Software Engineer', category: 'Software Engineering' },
  { label: 'Mobile Application Developer (Flutter / React Native)', category: 'Software Engineering' },
  { label: 'API / Integration Engineer', category: 'Software Engineering' },
  { label: 'Systems Software Engineer', category: 'Software Engineering' },
  { label: 'Microservices Architect', category: 'Software Engineering' },
  { label: 'Embedded Systems Developer', category: 'Software Engineering' },
  { label: 'Web3 / Blockchain Developer', category: 'Software Engineering' },
  // AI / ML / Data
  { label: 'AI / ML Engineer', category: 'AI, ML & Data Science' },
  { label: 'Generative AI / LLM Engineer', category: 'AI, ML & Data Science' },
  { label: 'Prompt Engineer', category: 'AI, ML & Data Science' },
  { label: 'Data Scientist', category: 'AI, ML & Data Science' },
  { label: 'Data Engineer', category: 'AI, ML & Data Science' },
  { label: 'MLOps Engineer', category: 'AI, ML & Data Science' },
  { label: 'Computer Vision Engineer', category: 'AI, ML & Data Science' },
  { label: 'NLP Engineer', category: 'AI, ML & Data Science' },
  { label: 'Analytics Engineer', category: 'AI, ML & Data Science' },
  { label: 'Business Intelligence Developer', category: 'AI, ML & Data Science' },
  // Cloud / DevOps
  { label: 'Cloud Solutions Architect (AWS / Azure / GCP)', category: 'Cloud, DevOps & Infrastructure' },
  { label: 'DevOps Engineer', category: 'Cloud, DevOps & Infrastructure' },
  { label: 'Platform Engineer', category: 'Cloud, DevOps & Infrastructure' },
  { label: 'Site Reliability Engineer (SRE)', category: 'Cloud, DevOps & Infrastructure' },
  { label: 'Cloud Security Engineer', category: 'Cloud, DevOps & Infrastructure' },
  { label: 'Network Systems Engineer', category: 'Cloud, DevOps & Infrastructure' },
  { label: 'Infrastructure as Code Engineer', category: 'Cloud, DevOps & Infrastructure' },
  // Game Dev
  { label: 'Unity Game Developer (C#)', category: 'Game Development & Immersive Tech' },
  { label: 'Unreal Engine Developer (C++)', category: 'Game Development & Immersive Tech' },
  { label: 'Gameplay Programmer', category: 'Game Development & Immersive Tech' },
  { label: 'Game Designer / Level Designer', category: 'Game Development & Immersive Tech' },
  { label: 'AR / VR Developer (Spatial Computing)', category: 'Game Development & Immersive Tech' },
  { label: 'Technical Artist', category: 'Game Development & Immersive Tech' },
  // Cybersecurity
  { label: 'Cybersecurity Analyst', category: 'Cybersecurity & IT' },
  { label: 'Ethical Hacker / Penetration Tester', category: 'Cybersecurity & IT' },
  { label: 'Security Architect', category: 'Cybersecurity & IT' },
  { label: 'SOC Analyst', category: 'Cybersecurity & IT' },
  { label: 'IAM Engineer', category: 'Cybersecurity & IT' },
  { label: 'Information Security Manager', category: 'Cybersecurity & IT' },
  // Product / Design
  { label: 'AI / Tech Product Manager', category: 'Product, Design & Management' },
  { label: 'UI/UX Designer', category: 'Product, Design & Management' },
  { label: 'Product Designer', category: 'Product, Design & Management' },
  { label: 'Technical Program Manager (TPM)', category: 'Product, Design & Management' },
  { label: 'Scrum Master / Agile Coach', category: 'Product, Design & Management' },
  { label: 'IT Systems Analyst', category: 'Product, Design & Management' },
  // QA
  { label: 'SDET (Software Engineer in Test)', category: 'Quality Assurance & Testing' },
  { label: 'QA Automation Engineer', category: 'Quality Assurance & Testing' },
  { label: 'Performance Testing Engineer', category: 'Quality Assurance & Testing' },
  { label: 'Security QA Analyst', category: 'Quality Assurance & Testing' },
  // Healthcare
  { label: 'Medical Doctor (General Practitioner)', category: 'Healthcare & Medical' },
  { label: 'Specialist Surgeon (Cardiologist / Neurosurgeon)', category: 'Healthcare & Medical' },
  { label: 'Psychiatrist', category: 'Healthcare & Medical' },
  { label: 'Clinical Psychologist', category: 'Healthcare & Medical' },
  { label: 'Nurse Practitioner (NP) / Registered Nurse', category: 'Healthcare & Medical' },
  { label: 'Pharmacist', category: 'Healthcare & Medical' },
  { label: 'Dentist / Orthodontist', category: 'Healthcare & Medical' },
  { label: 'Physical Therapist', category: 'Healthcare & Medical' },
  { label: 'Medical & Health Services Manager', category: 'Healthcare & Medical' },
  // Legal
  { label: 'Corporate Lawyer (M&A / Business Law)', category: 'Legal & Compliance' },
  { label: 'Intellectual Property (IP) Attorney', category: 'Legal & Compliance' },
  { label: 'Criminal Defense Attorney', category: 'Legal & Compliance' },
  { label: 'General Counsel / In-House Legal Advisor', category: 'Legal & Compliance' },
  { label: 'Compliance & Ethics Officer', category: 'Legal & Compliance' },
  { label: 'Paralegal / Legal Analyst', category: 'Legal & Compliance' },
  // Finance
  { label: 'Investment Banker', category: 'Finance & Banking' },
  { label: 'Financial Analyst', category: 'Finance & Banking' },
  { label: 'Certified Public Accountant (CPA) / Auditor', category: 'Finance & Banking' },
  { label: 'Wealth & Portfolio Manager', category: 'Finance & Banking' },
  { label: 'Risk Management Specialist', category: 'Finance & Banking' },
  { label: 'Actuary', category: 'Finance & Banking' },
  { label: 'Hedge Fund Analyst', category: 'Finance & Banking' },
  { label: 'Corporate Controller', category: 'Finance & Banking' },
  // Business / HR
  { label: 'Management Consultant (McKinsey / BCG / Bain)', category: 'Business, HR & Strategy' },
  { label: 'HR Director', category: 'Business, HR & Strategy' },
  { label: 'Operations Manager', category: 'Business, HR & Strategy' },
  { label: 'Business Development Manager (BDM)', category: 'Business, HR & Strategy' },
  { label: 'Supply Chain & Logistics Director', category: 'Business, HR & Strategy' },
  { label: 'Talent Acquisition Lead / Recruiter', category: 'Business, HR & Strategy' },
  { label: 'Venture Capital / Private Equity Associate', category: 'Business, HR & Strategy' },
  { label: 'Sustainability & ESG Lead', category: 'Business, HR & Strategy' },
  // Core Engineering
  { label: 'Civil Engineer', category: 'Core Engineering & Science' },
  { label: 'Mechanical Engineer', category: 'Core Engineering & Science' },
  { label: 'Licensed Architect', category: 'Core Engineering & Science' },
  { label: 'Electrical Engineer', category: 'Core Engineering & Science' },
  { label: 'Biomedical Engineer', category: 'Core Engineering & Science' },
  { label: 'Chemical / Process Engineer', category: 'Core Engineering & Science' },
  { label: 'Environmental Specialist', category: 'Core Engineering & Science' },
  // Marketing / Media
  { label: 'Digital Marketing Manager', category: 'Marketing, Media & Creative' },
  { label: 'Brand Manager', category: 'Marketing, Media & Creative' },
  { label: 'Content Director / Copywriter', category: 'Marketing, Media & Creative' },
  { label: 'Public Relations (PR) Specialist', category: 'Marketing, Media & Creative' },
  { label: 'Creative Director / Visual Designer', category: 'Marketing, Media & Creative' },
  { label: 'Video Producer / Motion Designer', category: 'Marketing, Media & Creative' },
  { label: 'Corporate Communications Manager', category: 'Marketing, Media & Creative' },
  // Education / Specialized
  { label: 'University Professor / Lecturer', category: 'Education & Specialized' },
  { label: 'Commercial Airline Pilot', category: 'Education & Specialized' },
  { label: 'Research Scientist / Laboratory Director', category: 'Education & Specialized' },
  { label: 'Instructional Designer', category: 'Education & Specialized' },
  { label: 'Data Privacy Officer (DPO)', category: 'Education & Specialized' },
  { label: 'Urban & Regional Planner', category: 'Education & Specialized' },
];

const CATEGORY_COLORS = {
  'Software Engineering':              '#a78bfa',
  'AI, ML & Data Science':            '#22d3ee',
  'Cloud, DevOps & Infrastructure':   '#34d399',
  'Game Development & Immersive Tech':'#fbbf24',
  'Cybersecurity & IT':               '#f87171',
  'Product, Design & Management':     '#f472b6',
  'Quality Assurance & Testing':      '#818cf8',
  'Healthcare & Medical':             '#2dd4bf',
  'Legal & Compliance':               '#c084fc',
  'Finance & Banking':                '#facc15',
  'Business, HR & Strategy':          '#fb923c',
  'Core Engineering & Science':       '#94a3b8',
  'Marketing, Media & Creative':      '#fb7185',
  'Education & Specialized':          '#a3e635',
};

export default function HomePage({ 
  jobTitle: externalJobTitle, 
  setJobTitle: externalSetJobTitle, 
  resumeFile: externalResumeFile, 
  setResumeFile: externalSetResumeFile, 
  onAnalyze,
  isLoading = false,
  error: externalError = ''
}) {
  const [localResumeFile, setLocalResumeFile] = useState(null);
  const [localJobTitle, setLocalJobTitle] = useState('');
  const [localError, setLocalError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // 3D Robot Mascot State: 'base' | 'angry' | 'thinking'
  const [robotState, setRobotState] = useState('base');
  const [speechText, setSpeechText] = useState("Hi! I'm your AI Assistant. Upload your resume & select a job title!");

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const resumeFile = externalResumeFile !== undefined ? externalResumeFile : localResumeFile;
  const setResumeFile = externalSetResumeFile || setLocalResumeFile;
  const jobTitle = externalJobTitle !== undefined ? externalJobTitle : localJobTitle;
  const setJobTitle = externalSetJobTitle || setLocalJobTitle;
  const error = externalError || localError;

  // Sync external error with angry robot state
  useEffect(() => {
    if (error) {
      setRobotState('angry');
      setSpeechText(error);
    }
  }, [error]);

  // Sync loading state with thinking robot state
  useEffect(() => {
    if (isLoading) {
      setRobotState('thinking');
      setSpeechText('Neural scan in progress... Matching resume vectors against 100+ industry role benchmarks!');
    }
  }, [isLoading]);

  // Filtered roles based on typed query
  const query = (jobTitle || '').trim().toLowerCase();
  const filteredRoles = query.length === 0
    ? ALL_JOB_ROLES
    : ALL_JOB_ROLES.filter(r => r.label.toLowerCase().includes(query) || r.category.toLowerCase().includes(query));

  // Group filtered roles by category
  const grouped = filteredRoles.reduce((acc, role) => {
    if (!acc[role.category]) acc[role.category] = [];
    acc[role.category].push(role);
    return acc;
  }, {});

  const flatList = filteredRoles;

  // Close dropdown on outside click
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

  // Helper to format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Drag & drop handlers
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
      if (localError) setLocalError('');
      if (robotState === 'angry') setRobotState('base');
      setSpeechText(`PDF Loaded: "${file.name}". Now pick or confirm your target job position.`);
    } else {
      setLocalError('Please upload a valid PDF file.');
      setRobotState('angry');
      setSpeechText('Format Error! Document must be a searchable PDF file.');
    }
  };

  // ── Submit logic with 3-State Robot Animation Controller ──
  const handleSubmit = (e) => {
    e.preventDefault();

    const missingPdf = !resumeFile;
    const missingJob = !jobTitle.trim();

    if (missingPdf || missingJob) {
      // Switch robot state to ANGRY
      setRobotState('angry');

      if (missingPdf && missingJob) {
        setLocalError('Please upload a PDF resume and select a target job title.');
        setSpeechText('Hey! You forgot to upload a PDF resume AND select a job title!');
      } else if (missingPdf) {
        setLocalError('Please upload your resume PDF first.');
        setSpeechText('Hey! I need your PDF resume first before I can analyze!');
      } else {
        setLocalError('Please enter or select a target job title.');
        setSpeechText('Hey! Pick a target job title so I know what role to grade you for!');
      }

      // Revert angry robot back to base state after 3.5s
      setTimeout(() => {
        setRobotState(current => (current === 'angry' ? 'base' : current));
        setSpeechText("I'm waiting! Complete the missing fields above to get started.");
      }, 3500);

      return;
    }

    // Both valid -> trigger 2-second Thinking Robot animation sequence!
    setLocalError('');
    setRobotState('thinking');
    setSpeechText('Processing resume with Gemini AI... Evaluating 100+ industry requirements!');

    setTimeout(() => {
      if (onAnalyze) onAnalyze();
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative overflow-hidden" style={{ background: 'radial-gradient(ellipse at 20% 20%, rgba(124,58,237,0.18) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(6,182,212,0.14) 0%, transparent 60%), #040714' }}>

      {/* Cyberpunk Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(124,58,237,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.15) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 w-full max-w-6xl mx-auto">

        {/* Top Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 border backdrop-blur-md shadow-lg" style={{ background: 'rgba(124,58,237,0.12)', borderColor: 'rgba(124,58,237,0.3)', color: '#a78bfa' }}>
            <Sparkles size={11} className="text-cyan-400 animate-spin-slow" /> AI Resume Reader & Evaluator
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
            Land Your <span style={{ background: 'linear-gradient(135deg,#a78bfa 0%,#22d3ee 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dream Role</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mt-2 leading-relaxed font-medium">
            Upload your resume & evaluate against <span className="text-cyan-300 font-bold">100+ industry job roles</span> with instant ATS scoring & domain matching.
          </p>
        </div>

        {/* ── Main Split Grid: Left = Form, Right = 3D Robot Mascot Stage ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* LEFT: Upload & Input Form (Col 7) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden" style={{ background: 'rgba(15, 20, 38, 0.75)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(30px)', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}>
              
              <div className="absolute top-0 left-0 w-24 h-[2px] bg-gradient-to-r from-violet-500 to-transparent" />
              <div className="absolute top-0 left-0 h-24 w-[2px] bg-gradient-to-b from-violet-500 to-transparent" />

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Step 1: Resume Upload Dropzone */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                    <FileText size={14} className="text-violet-400" /> Resume PDF Document
                  </label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => !resumeFile && document.getElementById('resume-file-input').click()}
                    className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center p-6 ${
                      isDragging
                        ? 'border-violet-400 bg-violet-500/15 scale-[1.01]'
                        : resumeFile
                        ? 'border-emerald-500/60 bg-emerald-500/10 cursor-default'
                        : 'border-slate-700/80 hover:border-violet-500/80 hover:bg-violet-500/5'
                    }`}
                    style={{ minHeight: '115px' }}
                  >
                    <input
                      id="resume-file-input"
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={e => {
                        const f = e.target.files[0];
                        if (f) {
                          setResumeFile(f);
                          if (localError) setLocalError('');
                          if (robotState === 'angry') setRobotState('base');
                          setSpeechText(`Attached ${f.name}! Now select your target job role.`);
                        }
                      }}
                    />
                    {resumeFile ? (
                      <>
                        <CheckCircle2 className="mb-2 text-emerald-400 animate-pulse" size={32} />
                        <p className="text-xs font-bold text-emerald-400 truncate max-w-full px-2">{resumeFile.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{formatFileSize(resumeFile.size)} · Click X to remove</p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setResumeFile(null);
                            setSpeechText("Resume removed. Upload a new PDF resume whenever you're ready!");
                          }}
                          className="absolute top-3 right-3 text-slate-400 hover:text-red-400 transition cursor-pointer p-1 rounded-full hover:bg-white/10"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <FileText className={`mx-auto mb-2 transition-all duration-300 ${isDragging ? 'text-violet-400 scale-110' : 'text-slate-500'}`} size={32} />
                        <p className="text-xs font-semibold text-slate-300">
                          {isDragging ? 'Drop your PDF file here' : 'Click or drag & drop your PDF resume'}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">Supports searchable PDF format up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Step 2: Target Job Title Autocomplete */}
                <div className="space-y-2" ref={dropdownRef}>
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
                        className="w-full text-xs text-slate-200 bg-slate-900/90 border border-slate-700/80 rounded-xl pl-9 pr-10 py-3.5 outline-none focus:border-violet-500 transition placeholder-slate-600 shadow-inner"
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
                        className="absolute z-50 w-full mt-2 rounded-2xl overflow-hidden"
                        style={{
                          background: 'rgba(10,10,30,0.98)',
                          border: '1px solid rgba(124,58,237,0.4)',
                          boxShadow: '0 24px 64px rgba(0,0,0,0.85)',
                          backdropFilter: 'blur(24px)',
                          maxHeight: '320px',
                          overflowY: 'auto',
                        }}
                      >
                        {Object.keys(grouped).length === 0 ? (
                          <div className="px-4 py-6 text-center text-xs text-slate-500">
                            No exact role matches — you can still type any custom job title!
                          </div>
                        ) : (
                          Object.entries(grouped).map(([category, roles]) => {
                            const color = CATEGORY_COLORS[category] || '#94a3b8';
                            return (
                              <div key={category}>
                                <div className="px-3 pt-3 pb-1 flex items-center gap-2 sticky top-0" style={{ background: 'rgba(10,10,30,0.98)' }}>
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
                                      className="w-full text-left px-4 py-2.5 text-xs transition-all flex items-center gap-2 cursor-pointer"
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
                    className="bg-red-500/15 border border-red-500/40 text-red-400 text-xs p-3.5 rounded-xl flex items-center gap-2.5"
                  >
                    <AlertCircle size={16} className="shrink-0 text-red-400" />
                    <span className="font-semibold">{error}</span>
                  </motion.div>
                )}

                {/* Start AI Analysis Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl text-xs font-black uppercase tracking-wider text-white shadow-xl shadow-purple-600/30 transition flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <span>{isLoading || robotState === 'thinking' ? 'Analyzing with Gemini AI...' : 'Start AI Analysis'}</span>
                  {!isLoading && robotState !== 'thinking' && <ArrowRight size={16} />}
                </motion.button>
              </form>
            </div>
          </div>

          {/* ── RIGHT: 3D Robot Mascot Stage with Dynamic 3-State Animations ── */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">

            <div
              className="relative w-full flex flex-col items-center text-center p-6 sm:p-8 rounded-3xl transition-all duration-500"
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
              <div className="w-full flex items-center justify-between mb-4 text-[9px] font-black uppercase tracking-widest px-2">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Cpu size={12} className={robotState === 'thinking' ? 'text-cyan-400 animate-spin' : 'text-violet-400'} />
                  <span>NEURAL MODEL</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-bold transition-colors duration-300 ${
                    robotState === 'angry'
                      ? 'bg-red-500/20 border-red-500/40 text-red-400'
                      : robotState === 'thinking'
                      ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                      : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${robotState === 'angry' ? 'bg-red-400 animate-ping' : robotState === 'thinking' ? 'bg-cyan-400 animate-pulse' : 'bg-emerald-400 animate-pulse'}`} />
                  <span>{robotState === 'angry' ? 'INPUT ERROR' : robotState === 'thinking' ? 'THINKING (2S)' : 'IDLE READY'}</span>
                </div>
              </div>

              {/* Dynamic Speech Bubble */}
              <motion.div
                key={speechText}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`relative mb-6 w-full max-w-xs px-4 py-3 rounded-2xl text-xs font-semibold leading-relaxed shadow-xl border backdrop-blur-xl ${
                  robotState === 'angry'
                    ? 'bg-red-950/50 border-red-500/50 text-red-200'
                    : robotState === 'thinking'
                    ? 'bg-cyan-950/50 border-cyan-500/50 text-cyan-200'
                    : 'bg-violet-950/50 border-violet-500/40 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-[9px] font-extrabold uppercase tracking-wider opacity-80">
                  {robotState === 'angry' ? <ShieldAlert size={12} className="text-red-400" /> : robotState === 'thinking' ? <Zap size={12} className="text-cyan-400" /> : <Activity size={12} className="text-violet-400" />}
                  <span>AI ASSISTANT TRANSMISSION</span>
                </div>
                <span>{speechText}</span>
              </motion.div>

              {/* 3D Robot Image Stage (Clean Transparent Avatar Floating) */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center overflow-visible">

                {/* Vertical Laser Scanline (Thinking Mode) */}
                {robotState === 'thinking' && (
                  <motion.div
                    animate={{ y: [-110, 110, -110] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute z-20 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] pointer-events-none"
                  />
                )}

                {/* Glowing Radial Background Core */}
                <div
                  className={`absolute inset-6 rounded-full blur-3xl transition-all duration-500 ${
                    robotState === 'angry'
                      ? 'bg-red-600/40 scale-110'
                      : robotState === 'thinking'
                      ? 'bg-cyan-500/45 scale-125'
                      : 'bg-violet-600/35 scale-100'
                  }`}
                />

                {/* Thinking Dashed Orbit Ring */}
                {robotState === 'thinking' && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full border border-dashed border-cyan-400/60 pointer-events-none"
                  />
                )}

                {/* Motion Character Wrapper with State Animations */}
                <motion.div
                  animate={
                    robotState === 'angry'
                      ? {
                          x: [0, -16, 16, -12, 12, -6, 6, 0],
                          rotateZ: [0, -8, 8, -5, 5, -2, 2, 0],
                          scale: [1, 1.06, 1],
                        }
                      : robotState === 'thinking'
                      ? {
                          y: [0, -14, 0],
                          scale: [1, 1.05, 1],
                        }
                      : {
                          y: [0, -8, 0],
                          rotateZ: [-1.5, 1.5, -1.5],
                        }
                  }
                  transition={
                    robotState === 'angry'
                      ? { duration: 0.5, repeat: 3, ease: 'easeInOut' }
                      : robotState === 'thinking'
                      ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
                      : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
                  }
                  className="relative z-10 w-full h-full flex items-center justify-center"
                >
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
                      alt="AI Robot Character"
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className={`w-full h-full object-contain filter ${
                        robotState === 'angry'
                          ? 'drop-shadow-[0_0_25px_rgba(239,68,68,0.7)]'
                          : robotState === 'thinking'
                          ? 'drop-shadow-[0_0_30px_rgba(6,182,212,0.7)]'
                          : 'drop-shadow-[0_15px_30px_rgba(124,58,237,0.6)]'
                      }`}
                    />
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Hologram Projector Disc Pad at Base */}
              <div className="relative w-56 h-6 mt-1 flex items-center justify-center">
                <div
                  className="w-full h-full rounded-full blur-xs transition-all duration-500"
                  style={{
                    background: robotState === 'angry'
                      ? 'radial-gradient(ellipse at center, rgba(239, 68, 68, 0.6) 0%, rgba(239, 68, 68, 0.1) 60%, transparent 80%)'
                      : robotState === 'thinking'
                      ? 'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.7) 0%, rgba(6, 182, 212, 0.15) 60%, transparent 80%)'
                      : 'radial-gradient(ellipse at center, rgba(167, 139, 250, 0.6) 0%, rgba(124, 58, 237, 0.15) 60%, transparent 80%)',
                    transform: 'rotateX(70deg)',
                  }}
                />
              </div>

              <div className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 mt-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>AI CHARACTER MODEL · 3 DYNAMIC STATES</span>
              </div>
            </div>

          </div>

        </div>

        {/* Footer info */}
        <p className="text-center text-[10px] text-slate-500 mt-8">
          Powered by Gemini AI · 100+ Industry Job Roles · High-Precision Neural Evaluation
        </p>

      </div>
    </div>
  );
}