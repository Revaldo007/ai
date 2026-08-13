import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, CheckCircle2, AlertTriangle, Download,
  RefreshCw, ShieldCheck, Code2, Cpu,
  FileText, Layers, GraduationCap, GitBranch, FolderGit2,
  LayoutDashboard, Radar, CheckSquare, Wand2, FileSpreadsheet,
  TrendingUp, Target, BookOpen, Lightbulb, ArrowRight, Star,
  Brain, Zap, Award, BarChart3, ChevronRight, Sun, Moon,
  Check, Filter, Clock, Flame, Info, CheckSquare2, Calendar, Milestone, Briefcase, Plus, X
} from 'lucide-react';

import CompetencyRadar from '../components/CompetencyRadar';
import Sidebar from '../components/Sidebar';

/* ─────────────────────────────────────────────────────────────
   RECOMMENDED SKILLS FETCHING COMPONENT
   ───────────────────────────────────────────────────────────── */
function SkillRecommendations({ userSkills, addedSkills, role, onAddSkill, isDarkMode }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function fetchSkills() {
      try {
        setLoading(true);
        const res = await fetch('/api/recommend-skills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userSkills, role }),
        });

        if (!res.ok) throw new Error('Network response was not ok');

        const data = await res.json();
        if (isMounted) {
          const recs = data.recommendedCategories || [];
          setRecommendations(recs.filter(s => !userSkills.includes(s) && !addedSkills.includes(s)));
        }
      } catch (err) {
        if (isMounted) {
          const fallbackPool = ['Docker', 'CI/CD Pipelines', 'System Design', 'Redis', 'Kafka', 'AWS', 'GraphQL'];
          setRecommendations(fallbackPool.filter(s => !userSkills.includes(s) && !addedSkills.includes(s)));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (role) {
      fetchSkills();
    }

    return () => {
      isMounted = false;
    };
  }, [role, userSkills, addedSkills]);

  const toggleSelectSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleConfirmAdd = () => {
    selectedSkills.forEach(skill => {
      onAddSkill(skill);
      setRecommendations(prev => prev.filter(s => s !== skill));
    });
    setSelectedSkills([]);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-amber-400/80 animate-pulse py-2">
        <Sparkles size={13} className="animate-spin" /> Fetching real-time role suggestions...
      </div>
    );
  }

  if (!recommendations.length) {
    return (
      <div className={`text-xs italic py-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
        All top role recommendations have been added or selected!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          ⚡ Recommended Role Skills to Acquire
        </p>
        {selectedSkills.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleConfirmAdd}
            className="px-3 py-1 text-xs font-bold rounded-lg bg-amber-500 text-slate-950 flex items-center gap-1 cursor-pointer shadow-sm"
          >
            <Plus size={13} /> Add Selected ({selectedSkills.length}) to Target Skills
          </motion.button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {recommendations.map((skill) => {
          const isSelected = selectedSkills.includes(skill);
          return (
            <motion.button
              key={skill}
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => toggleSelectSkill(skill)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition cursor-pointer flex items-center gap-1.5 border ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                  : isDarkMode
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                    : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
              }`}
            >
              {isSelected ? <Check size={12} /> : <Plus size={12} />}
              {skill}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN RESULTS VIEW COMPONENT
   ───────────────────────────────────────────────────────────── */
export default function ResultsView({
  fileName = "AI_Resume_Analysis_Sample_Report.pdf",
  jobTitle = "",
  analysisData = null,
  onReset = () => { }
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [improvementFilter, setImprovementFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [fixedCards, setFixedCards] = useState({});
  const [checkedSteps, setCheckedSteps] = useState({ 0: true, 1: true });
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [pdfError, setPdfError] = useState('');

  const displayJobTitle = jobTitle && jobTitle.trim() !== ''
    ? jobTitle
    : "Software Developer";

  // Skill matrix state
  const [extractedSkills] = useState(
    analysisData?.extracted_skills || [
      'React.js', 'Spring Boot', 'PostgreSQL', 'Python', 'Tailwind CSS', 'REST API', 'Git', 'Java'
    ]
  );

  const [addedSkills, setAddedSkills] = useState([]);

  const handleAddSkill = (newSkill) => {
    if (!addedSkills.includes(newSkill) && !extractedSkills.includes(newSkill)) {
      setAddedSkills((prev) => [...prev, newSkill]);
    }
  };

  const handleRemoveAddedSkill = (skillToRemove) => {
    setAddedSkills((prev) => prev.filter(s => s !== skillToRemove));
  };

  const radarScores = analysisData?.radar_scores || {
    skills: 90, projects: 92, experience: 75,
    education: 88, formatting: 95, atsPass: 92
  };

  const overallMatch = analysisData?.overall_match ?? 88;
  const atsShortlist = analysisData?.ats_shortlist ?? 92;
  const techStackScore = analysisData?.tech_stack_score ?? 85;
  const csFundamentalsScore = analysisData?.cs_fundamentals_score ?? 80;

  const recommendedSkills = analysisData?.recommended_skills || [
    'Docker', 'CI/CD Pipelines', 'System Design', 'Redis'
  ];

  const bulletRewrites = analysisData?.bullet_rewrites || [
    {
      before: "Worked on backend API using Node.js and PostgreSQL.",
      after: "Engineered 12+ RESTful endpoints in Node.js & PostgreSQL, handling 500+ daily JSON payloads with sub-100ms response time.",
      badge: "+40% Recruiter Engagement"
    },
    {
      before: "Built a student management system frontend with React.",
      after: "Architected a responsive student management portal using React & Tailwind CSS, improving UI render speed by 25%.",
      badge: "+35% ATS Score"
    }
  ];

  const feedbackItems = analysisData?.feedback || [
    {
      severity: 'high',
      category: 'Skill Match',
      title: `Missing Core Technical Keywords for ${displayJobTitle}`,
      description: `Your resume is missing critical requirement terms standard for ${displayJobTitle} positions. ATS parsers match exact skill keywords before ranking candidates.`,
      suggestion: `Add these high-value industry tools to your Skills section and project descriptions: ${recommendedSkills.slice(0, 3).join(', ')}.`,
      impact: '+20% ATS Match Boost',
      timeframe: '1–2 Weeks'
    },
    {
      severity: 'high',
      category: 'Experience Impact',
      title: 'Unquantified Achievement Bullet Points',
      description: 'Your project bullets describe tools used, but lack measurable metrics (e.g. latency reduced, users served, throughput gained). Recruiters scan for numbers.',
      suggestion: "Apply Google's X-Y-Z formula: 'Accomplished [X] as measured by [Y], by doing [Z]'. Example: 'Engineered 12+ REST endpoints serving 500+ daily users with sub-80ms response time.'",
      impact: '+18% Recruiter Engagement',
      timeframe: 'Immediate'
    },
    {
      severity: 'medium',
      category: 'Project Depth',
      title: 'Demonstrate System Architecture & Scale',
      description: 'Basic CRUD projects fail to stand out for mid-to-senior tech screening. Recruiters look for state management, database schema design, and caching.',
      suggestion: 'Highlight technical complexity in project bullets: mention database indexing, JWT authentication, Redux/Zustand state, or Redis caching layers.',
      impact: '+15% Technical Screening Pass Rate',
      timeframe: '2–3 Weeks'
    },
    {
      severity: 'medium',
      category: 'Portfolio',
      title: 'Upgrade GitHub Project READMEs & Live Demos',
      description: 'GitHub links are present, but project repositories need professional README documentation (architecture diagrams, setup steps, and working demo links).',
      suggestion: 'For each repository, add a clean README.md with tech stack badges, system architecture flow, installation commands, and a deployed Vercel/Render URL.',
      impact: '+10% Credibility Boost',
      timeframe: '1 Week'
    },
    {
      severity: 'medium',
      category: 'DevOps & Cloud',
      title: 'Containerization & CI/CD Pipeline Exposure',
      description: `Modern ${displayJobTitle} positions strongly prefer candidates familiar with Docker containerization and automated CI/CD build pipelines.`,
      suggestion: 'Add a Dockerfile to one of your projects and create a .github/workflows/ci.yml GitHub Action file that runs unit tests on push.',
      impact: '+14% ATS Alignment',
      timeframe: '2 Weeks'
    },
    {
      severity: 'medium',
      category: 'CS Fundamentals',
      title: 'Coding Profiles & Problem Solving Verification',
      description: 'Tech companies use automated coding rounds. Highlighting problem-solving metrics directly on your resume signals interview readiness.',
      suggestion: 'Include your LeetCode profile URL or mention problem count metrics (e.g. "Solved 200+ Data Structures & Algorithms problems across LeetCode").',
      impact: '+10% Technical Assessment Confidence',
      timeframe: '1–2 Months'
    },
    {
      severity: 'low',
      category: 'ATS Format',
      title: 'ATS PDF Single-Column Compliance Checklist',
      description: 'Complex multi-column layouts, graphics, icons inside text boxes, or tables can cause ATS parsers to misread or scramble your experience section.',
      suggestion: 'Ensure your resume uses a clean single-column format, standard fonts (Inter, Arial, Roboto), clear section headings, and is saved as a searchable PDF.',
      impact: '+5% ATS Parse Accuracy',
      timeframe: 'Immediate'
    }
  ];

  const categoriesList = useMemo(() => {
    const cats = new Set(feedbackItems.map(item => item.category).filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, [feedbackItems]);

  const filteredFeedback = useMemo(() => {
    return feedbackItems.filter(item => {
      const matchesSeverity = improvementFilter === 'all' || item.severity === improvementFilter;
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSeverity && matchesCategory;
    });
  }, [feedbackItems, improvementFilter, selectedCategory]);

  const timelineMilestones = [
    {
      phase: '2026 DEPLOYMENT',
      year: '2026',
      title: 'Foundation & Core Keyword Matrix',
      description: `Launched initial resume optimization layer. Integrated essential missing technical keywords (${recommendedSkills.slice(0, 3).join(', ')}) into Skills section and repository descriptions.`,
      status: 'Completed',
      impact: '+20% ATS Parsing'
    },
    {
      phase: '2026 Q2 DEPLOYMENT',
      year: '2026.2',
      title: 'Impact Metrics & Bullet Point Formula',
      description: "Applied Google's X-Y-Z formula to all project bullets. Quantified system throughput, user counts, and query performance optimizations across all experience lines.",
      status: 'In Progress',
      impact: '+18% Recruiter Engagement'
    },
    {
      phase: '2026 Q3 DEPLOYMENT',
      year: '2026.3',
      title: 'System Architecture & Portfolio Live Demos',
      description: 'Deployed direct production ingestion layers and full-stack projects to Vercel and Render with live URLs, custom API documentation, and architecture diagrams.',
      status: 'Upcoming',
      impact: '+15% Shortlist Rate'
    },
    {
      phase: '2026 Q4 DEPLOYMENT',
      year: '2026.4',
      title: 'DevOps Containerization & CI/CD Pipelines',
      description: `Safely integrated Docker containerization scripts and GitHub Actions automated CI build testing workflows into key ${displayJobTitle} portfolio repositories.`,
      status: 'Upcoming',
      impact: '+14% Tech Alignment'
    },
    {
      phase: '2027 TARGET DEPLOYMENT',
      year: '2027',
      title: 'Global Campus & Enterprise Shortlisting',
      description: `Achieved complete enterprise compliance across elite campus placement drives and global tech recruiters. Submitted high-match applications for ${displayJobTitle} roles.`,
      status: 'Upcoming',
      impact: '+95% Offer Eligibility'
    }
  ];

  const toggleFixedCard = (idx) => {
    setFixedCards(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleStep = (idx) => {
    setCheckedSteps(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const completedRoadmapCount = Object.values(checkedSteps).filter(Boolean).length;
  const roadmapProgressPercent = Math.round((completedRoadmapCount / timelineMilestones.length) * 100);

  const navItems = [
    { id: 'overview', label: 'Score Summary', icon: LayoutDashboard },
    { id: 'diagnostics', label: 'Resume Sections', icon: Layers },
    { id: 'rewriter', label: 'AI Rewriter', icon: Wand2 },
    { id: 'skills', label: 'My Skills', icon: CheckSquare },
    { id: 'radar', label: 'Skills Chart', icon: Radar },
    { id: 'improvement', label: 'How to Improve', icon: TrendingUp },
    { id: 'all', label: 'Full Report', icon: FileSpreadsheet },
  ];

  // ── FULL REPORT MARKDOWN EXPORT FUNCTION ──
  const handleExportMarkdown = () => {
    const mdContent = `
# 📄 Full AI Resume Analysis Report

**File Name:** ${fileName}  
**Target Role:** ${displayJobTitle}  
**Status:** Analysis Complete  

---

## 📊 1. Executive Summary & Scores

| Metric | Score | Status |
| :--- | :--- | :--- |
| **Overall Match** | ${overallMatch}% | ${overallMatch >= 75 ? 'Shortlist Eligible' : overallMatch >= 45 ? 'Needs Alignment' : 'Domain Mismatch'} |
| **ATS Shortlist** | ${atsShortlist}% | High Rate |
| **Tech Stack Alignment** | ${techStackScore}% | Role Aligned |
| **CS Fundamentals** | ${csFundamentalsScore}% | DSA & DBMS |

### Match Verdict:
> **${overallMatch >= 75 ? `🎓 ${displayJobTitle} Ready` : overallMatch >= 45 ? `⚠️ ${displayJobTitle} Needs Alignment` : `❌ ${displayJobTitle} Domain Mismatch`}**  
> ${
      overallMatch >= 75
        ? 'High probability of clearing automated ATS screening for this position.'
        : overallMatch >= 45
        ? 'Moderate alignment. Add missing core keywords to improve ATS shortlist ranking.'
        : 'Severe skill/domain mismatch. Resume qualifications do not align with target position requirements.'
    }

---

## 📑 2. Resume Section Analysis

${(analysisData?.diagnostics || [
  { title: "Technical Stack", percentage: techStackScore, status: "Strong", note: "High alignment with target role stack" },
  { title: "Projects & Portfolio", percentage: radarScores.projects || 92, status: "Verified", note: "Verified projects with stack tags" },
  { title: "Core CS Knowledge", percentage: csFundamentalsScore, status: "Verified", note: "Database design & logic patterns detected" },
  { title: "Education & Format", percentage: radarScores.education || 88, status: "Passed", note: "Clean ATS-parseable layout detected" }
]).map(item => `### 🔹 ${item.title} (${item.percentage}%) - *${item.status}*
- **Assessment:** ${item.note}
- **Keywords/Tags:** ${item.tags ? item.tags.join(', ') : 'N/A'}`).join('\n\n')}

---

## 🎯 3. Skill Keyword Matrix

* **Parsed Resume Skills:** ${extractedSkills.join(', ')}
* **Target Skill Additions:** ${addedSkills.length ? addedSkills.join(', ') : 'None added'}
* **Recommended Role Skills:** ${recommendedSkills.join(', ')}

---

## 🕸️ 4. Competency Radar Breakdown

* **Skills Matrix:** ${radarScores.skills}%
* **Projects & Impact:** ${radarScores.projects}%
* **Experience Level:** ${radarScores.experience}%
* **Education & Certs:** ${radarScores.education}%
* **Formatting & ATS Compliance:** ${radarScores.formatting}%
* **ATS Shortlist Probability:** ${radarScores.atsPass}%

---

## ✨ 5. AI Bullet Point Rewrites

${bulletRewrites.map((item, i) => `### Bullet ${i + 1}
- **❌ Before (Weak):** ${item.before}
- **✅ After (ATS-Optimized):** ${item.after}
- **Impact Badge:** \`${item.badge}\``).join('\n\n')}

---

## 🚀 6. Actionable Improvement Plan

${feedbackItems.map((item, idx) => `### ${idx + 1}. [${item.severity.toUpperCase()} PRIORITY] ${item.title}
* **Category:** ${item.category || 'General'}
* **Issue:** ${item.description}
* **Actionable Suggestion:** ${item.suggestion}
* **Expected Impact:** ${item.impact || 'N/A'} | **Est. Time:** ${item.timeframe || 'N/A'}`).join('\n\n')}

---

## 🗺️ 7. Deployment Roadmap Milestones

${timelineMilestones.map((m) => `* **[${m.phase}] ${m.title}** (${m.year})
  - *Description:* ${m.description}
  - *Expected Impact:* ${m.impact}`).join('\n')}
  `.trim();

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const sanitizeName = (displayJobTitle || 'Resume').replace(/[^a-zA-Z0-9]/g, '_');
    link.setAttribute('download', `${sanitizeName}_Full_Analysis_Report.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── PDF EXPORT FUNCTION ──
  const handleExportPDF = useCallback(async () => {
    if (isExportingPDF) return;
    setPdfError('');
    setIsExportingPDF(true);

    setActiveTab('all');
    await new Promise(resolve => setTimeout(resolve, 600));

    try {
      const reportElem = document.getElementById('resume-report-content');
      if (!reportElem) throw new Error('Report element not found');

      const [html2canvasMod, jsPDFMod] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);
      const html2canvas = html2canvasMod.default || html2canvasMod;
      const { jsPDF } = jsPDFMod;

      const canvas = await html2canvas(reportElem, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#0f0f1a',
        windowWidth: reportElem.scrollWidth,
        windowHeight: reportElem.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.97);
      const pdfW = 210;
      const pdfH = Math.ceil((canvas.height / canvas.width) * pdfW);

      const pdf = new jsPDF({ unit: 'mm', format: [pdfW, pdfH], orientation: 'portrait' });
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfW, pdfH);

      const sanitizeName = (displayJobTitle || 'Resume').replace(/[^a-zA-Z0-9]/g, '_');
      pdf.save(`${sanitizeName}_AI_Resume_Analysis.pdf`);
    } catch (err) {
      console.error('PDF Export Error:', err);
      setPdfError('PDF export failed. Please try again.');
      setTimeout(() => setPdfError(''), 4000);
    } finally {
      setIsExportingPDF(false);
    }
  }, [isExportingPDF, displayJobTitle]);

  const scrollViewport = { once: false, amount: 0.12 };

  const containerVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.45, ease: 'easeOut', staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: 'easeOut' } }
  };

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 ${
        isDarkMode ? 'text-slate-100' : 'text-slate-900'
      }`}
      style={
        isDarkMode
          ? { background: 'linear-gradient(135deg,#0b0f1e 0%,#0f172a 50%,#120d2a 100%)' }
          : { background: '#F8FAFC' }
      }
    >
      {isDarkMode && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div style={{ position: 'absolute', top: '-10%', left: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.12) 0%,transparent 70%)', filter: 'blur(40px)' }} />
          <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(59,130,246,0.10) 0%,transparent 70%)', filter: 'blur(40px)' }} />
        </div>
      )}

      {/* TOP HEADER */}
      <header
        className={`relative z-20 sticky top-0 backdrop-blur-md transition-colors duration-300 ${
          isDarkMode
            ? 'border-b border-violet-900/30'
            : 'bg-white/90 border-b border-slate-200 shadow-sm'
        }`}
        style={isDarkMode ? { background: 'rgba(11,15,30,0.85)', backdropFilter: 'blur(20px)' } : {}}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 5 }}
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
              style={
                isDarkMode
                  ? { background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', boxShadow: '0 0 20px rgba(124,58,237,0.4)' }
                  : { background: '#f5f3ff', border: '1px solid #ddd6fe', color: '#7c3aed' }
              }
            >
              <Brain size={18} className={isDarkMode ? "text-white" : "text-violet-600"} />
            </motion.div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className={`text-sm sm:text-base font-extrabold truncate max-w-[200px] sm:max-w-xs ${isDarkMode ? 'text-white' : 'text-slate-900'}`} title={fileName}>
                  {fileName}
                </h1>
                <span
                  className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1"
                  style={
                    isDarkMode
                      ? { background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)', color: '#c4b5fd' }
                      : { background: '#f5f3ff', border: '1px solid #ddd6fe', color: '#6d28d9' }
                  }
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" /> Parsed
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1"
                  style={
                    isDarkMode
                      ? { background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', color: '#a5b4fc' }
                      : { background: '#ede9fe', border: '1px solid #c4b5fd', color: '#5b21b6' }
                  }
                >
                  <Sparkles size={9} /> AI Report
                </span>
              </div>
              <p className={`text-[11px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Target Role: <span className="text-violet-600 dark:text-violet-400 font-semibold capitalize">{displayJobTitle}</span>
                <span className="mx-1.5 opacity-40">•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Analysis Complete</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold text-white cursor-pointer shadow-sm"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', boxShadow: '0 0 16px rgba(124,58,237,0.35)' }}
            >
              <RefreshCw size={13} /> New Resume
            </motion.button>

            {/* EXPORT MARKDOWN BUTTON */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleExportMarkdown}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold cursor-pointer transition ${
                isDarkMode
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                  : 'bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 shadow-xs'
              }`}
              title="Export report as Markdown file (.md)"
            >
              <FileText size={13} />
              <span>Export MD</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                isDarkMode
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                  : 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100'
              }`}
              title={isDarkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
            >
              {isDarkMode ? (
                <>
                  <Sun size={14} className="text-amber-400" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon size={14} className="text-violet-600" />
                  <span>Dark</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </header>

      {/* DASHBOARD BODY */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} navItems={navItems} fileName={fileName} isDarkMode={isDarkMode} />

        <main id="resume-report-content" className="space-y-6">

          {/* ── SECTION 1: SCORE SUMMARY ── */}
          {(activeTab === 'overview' || activeTab === 'all') && (
            <motion.section key="tab-overview" variants={containerVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} className="space-y-5">

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Overall Match', value: overallMatch, icon: Award, sub: 'ATS Ready', grad: 'from-violet-600 to-purple-600' },
                  { label: 'ATS Shortlist', value: atsShortlist, icon: ShieldCheck, sub: 'High Rate', grad: 'from-blue-600 to-cyan-600' },
                  { label: 'Tech Stack', value: techStackScore, icon: Code2, sub: 'Role Aligned', grad: 'from-emerald-600 to-teal-600' },
                  { label: 'CS Score', value: csFundamentalsScore, icon: Cpu, sub: 'DSA & DBMS', grad: 'from-orange-500 to-rose-500' },
                ].map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <motion.div
                      key={idx}
                      variants={itemVariants}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className={`rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden transition ${
                        isDarkMode
                          ? 'bg-white/4 border border-white/8 backdrop-blur-md'
                          : 'bg-white border border-slate-200 shadow-sm'
                      }`}
                    >
                      {isDarkMode && <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-br ${card.grad} opacity-20 blur-xl`} />}
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{card.label}</span>
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${card.grad}`}>
                          <Icon size={13} className="text-white" />
                        </div>
                      </div>
                      <div>
                        <div className={`text-4xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {card.value}<span className="text-lg font-normal text-slate-400">%</span>
                        </div>
                        <div className={`text-[10px] font-medium mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{card.sub}</div>
                      </div>
                      <div className={`h-1 rounded-full overflow-hidden ${isDarkMode ? 'bg-white/10' : 'bg-slate-100'}`}>
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${card.value}%` }}
                          viewport={scrollViewport}
                          transition={{ duration: 1, ease: 'easeOut', delay: idx * 0.1 }}
                          className={`h-full rounded-full bg-gradient-to-r ${card.grad}`}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Match Verdict */}
              <motion.div
                variants={itemVariants}
                className={`rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden transition ${
                  isDarkMode
                    ? 'border border-violet-500/30 backdrop-blur-md'
                    : 'bg-gradient-to-b from-violet-50/50 via-white to-white border border-slate-200 shadow-sm'
                }`}
                style={isDarkMode ? { background: 'linear-gradient(135deg,rgba(124,58,237,0.15) 0%,rgba(79,70,229,0.08) 100%)' } : {}}
              >
                <div className="relative w-28 h-28 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" stroke={isDarkMode ? "rgba(255,255,255,0.06)" : "#F1F5F9"} strokeWidth="8" fill="transparent" />
                    <motion.circle
                      cx="50" cy="50" r="42"
                      stroke="url(#gaugeGrad)" strokeWidth="8" fill="transparent"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: overallMatch / 100 }}
                      viewport={scrollViewport}
                      transition={{ duration: 1.4, ease: 'easeOut' }}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#7c3aed" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{overallMatch}%</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Match</span>
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left z-10">
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold mb-3"
                    style={
                      overallMatch >= 75
                        ? { background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399' }
                        : overallMatch >= 45
                          ? { background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24' }
                          : { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }
                    }
                  >
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${overallMatch >= 75 ? 'bg-emerald-400' : overallMatch >= 45 ? 'bg-amber-400' : 'bg-red-400'}`} />
                    {overallMatch >= 75 ? 'Shortlist Eligible' : overallMatch >= 45 ? 'Needs Alignment' : 'Critical Role Mismatch'}
                  </div>

                  <h2 className={`text-2xl font-black capitalize mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {overallMatch >= 75 ? `🎓 ${displayJobTitle} Ready` : overallMatch >= 45 ? `⚠️ ${displayJobTitle} Needs Alignment` : `❌ ${displayJobTitle} Domain Mismatch`}
                  </h2>
                  <p className={`text-sm leading-relaxed max-w-md ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {overallMatch >= 75
                      ? 'High probability of clearing automated ATS screening for this position.'
                      : overallMatch >= 45
                        ? 'Moderate alignment. Add missing core keywords to improve ATS shortlist ranking.'
                        : 'Severe skill/domain mismatch. Resume qualifications do not align with target position requirements.'}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {[
                      { label: 'Target Role', value: displayJobTitle },
                      { label: 'ATS Pass Rate', value: `${atsShortlist}%` },
                    ].map((item, i) => (
                      <div key={i} className={`rounded-xl px-3 py-2 ${isDarkMode ? 'bg-white/5 border border-white/8' : 'bg-slate-50 border border-slate-200'}`}>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">{item.label}</div>
                        <div className={`text-xs font-extrabold capitalize mt-0.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.section>
          )}

          {/* ── SECTION 2: RESUME SECTIONS ── */}
          {(activeTab === 'diagnostics' || activeTab === 'all') && (
            <motion.div
              key="tab-diagnostics"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={scrollViewport}
              className={`rounded-2xl p-6 space-y-5 transition ${
                isDarkMode
                  ? 'bg-white/3 border border-white/8 backdrop-blur-md'
                  : 'bg-white border border-slate-200 shadow-sm'
              }`}
            >
              <div className={`flex items-center justify-between pb-4 ${isDarkMode ? 'border-b border-white/6' : 'border-b border-slate-100'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-violet-500/20 border border-violet-500/30' : 'bg-violet-50 border border-violet-200'}`}>
                    <Layers size={18} className={isDarkMode ? "text-violet-400" : "text-violet-600"} />
                  </div>
                  <div>
                    <h3 className={`text-base font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Resume Section Analysis</h3>
                    <p className={`text-xs font-medium ${isDarkMode ? 'text-violet-400' : 'text-violet-600'}`}>Evaluated against industry benchmarks</p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${isDarkMode ? 'bg-violet-500/15 border border-violet-500/30 text-violet-300' : 'bg-violet-50 border border-violet-200 text-violet-700'}`}>
                  {displayJobTitle} Benchmark
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(analysisData?.diagnostics || [
                  { title: "Technical Stack", percentage: techStackScore, status: "Strong", tags: extractedSkills.slice(0, 4), note: "High alignment with target role stack" },
                  { title: "Projects & Portfolio", percentage: radarScores.projects || 92, status: "Verified", tags: extractedSkills.slice(2, 5), note: "Verified projects with stack tags" },
                  { title: "Core CS Knowledge", percentage: csFundamentalsScore, status: "Verified", tags: ["DBMS", "Algorithms", "SQL"], note: "Database design & logic patterns detected" },
                  { title: "Education & Format", percentage: radarScores.education || 88, status: "Passed", tags: ["ATS Friendly", "PDF Parsed"], note: "Clean ATS-parseable layout detected" }
                ]).map((item, idx) => {
                  const icons = [<Code2 size={15} />, <FolderGit2 size={15} />, <Cpu size={15} />, <GraduationCap size={15} />];
                  const grads = ['from-violet-500 to-purple-500', 'from-blue-500 to-cyan-500', 'from-emerald-500 to-teal-500', 'from-orange-400 to-rose-400'];
                  const statusColors = {
                    Strong: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', text: '#34d399' },
                    Excellent: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', text: '#34d399' },
                    Verified: { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)', text: '#60a5fa' },
                    Qualified: { bg: 'rgba(251,191,36,0.15)', border: 'rgba(251,191,36,0.3)', text: '#fbbf24' },
                    Passed: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', text: '#34d399' },
                    'Needs Alignment': { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', text: '#f87171' },
                    'Needs Review': { bg: 'rgba(251,191,36,0.15)', border: 'rgba(251,191,36,0.3)', text: '#fbbf24' },
                    Moderate: { bg: 'rgba(251,191,36,0.15)', border: 'rgba(251,191,36,0.3)', text: '#fbbf24' },
                  };
                  const sc = statusColors[item.status] || statusColors['Verified'];
                  return (
                    <motion.div
                      key={idx}
                      variants={itemVariants}
                      whileHover={{ y: -3 }}
                      className={`rounded-xl p-4 space-y-3 ${
                        isDarkMode
                          ? 'bg-white/4 border border-white/8'
                          : 'bg-slate-50/70 border border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg bg-gradient-to-br ${grads[idx % grads.length]}`}>{icons[idx % icons.length]}</div>
                          <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.title}</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text }}>
                          {item.status}
                        </span>
                      </div>
                      <div>
                        <div className={`flex justify-between text-[10px] mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          <span>Score</span><span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.percentage}%</span>
                        </div>
                        <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-white/6' : 'bg-slate-200'}`}>
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${item.percentage}%` }}
                            viewport={scrollViewport}
                            transition={{ duration: 0.9, ease: 'easeOut' }}
                            className={`h-full rounded-full bg-gradient-to-r ${grads[idx % grads.length]}`}
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(item.tags || []).map((tag, ti) => (
                          <span key={ti} className={`text-[10px] font-medium px-2 py-0.5 rounded ${isDarkMode ? 'bg-white/6 border border-white/10 text-slate-400' : 'bg-white border border-slate-200 text-slate-600'}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className={`text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{item.note}</p>
                    </motion.div>
                  );
                })}
              </div>

              <div className={`rounded-xl p-4 flex items-center gap-3 ${isDarkMode ? 'bg-violet-500/8 border border-violet-500/20' : 'bg-violet-50/70 border border-violet-200'}`}>
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-violet-500/20' : 'bg-violet-100 text-violet-700'}`}>
                  <GitBranch size={16} className={isDarkMode ? "text-violet-400" : "text-violet-700"} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Coding Profiles & Portfolio Links</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)', color: '#fbbf24' }}>
                      Priority Fix
                    </span>
                  </div>
                  <p className={`text-[11px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Add target metric highlights (e.g. "200+ Solved", "Live Vercel Demos") tailored to {displayJobTitle} to boost recruiter pass rate.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── SECTION 3: AI REWRITER ── */}
          {(activeTab === 'rewriter' || activeTab === 'all') && (
            <motion.div
              key="tab-rewriter"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={scrollViewport}
              className={`rounded-2xl p-6 space-y-5 transition ${
                isDarkMode
                  ? 'bg-white/3 border border-white/8 backdrop-blur-md'
                  : 'bg-white border border-slate-200 shadow-sm'
              }`}
            >
              <div className={`flex items-center gap-3 pb-4 ${isDarkMode ? 'border-b border-white/6' : 'border-b border-slate-100'}`}>
                <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-cyan-500/20 border border-cyan-500/30' : 'bg-cyan-50 border border-cyan-200'}`}>
                  <Wand2 size={18} className={isDarkMode ? "text-cyan-400" : "text-cyan-600"} />
                </div>
                <div>
                  <h3 className={`text-base font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>AI Bullet Point Rewriter</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>ATS-optimized impact-driven language upgrades for {displayJobTitle}</p>
                </div>
              </div>

              <div className="space-y-4">
                {bulletRewrites.map((item, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    className={`rounded-xl p-4 space-y-3 ${
                      isDarkMode ? 'bg-white/3 border border-white/7' : 'bg-slate-50/60 border border-slate-200'
                    }`}
                  >
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Bullet {idx + 1}</div>
                    <div className="rounded-lg p-3" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                      <div className="text-[9px] font-bold uppercase text-red-500 dark:text-red-400 mb-1.5 flex items-center gap-1">
                        <span>❌</span> Before (Weak)
                      </div>
                      <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item.before}</p>
                    </div>
                    <div className="flex justify-center"><ChevronRight size={16} className="text-slate-400 rotate-90" /></div>
                    <div className="rounded-lg p-3" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
                      <div className="text-[9px] font-bold uppercase text-emerald-600 dark:text-emerald-400 mb-1.5 flex items-center gap-1">
                        <span>✅</span> After (ATS-Optimized)
                      </div>
                      <p className={`text-xs leading-relaxed font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{item.after}</p>
                    </div>
                    <div className="flex justify-end">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: isDarkMode ? '#c4b5fd' : '#6d28d9' }}>
                        {item.badge}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── SECTION 4: MY SKILLS ── */}
          {(activeTab === 'skills' || activeTab === 'all') && (
            <motion.div
              key="tab-skills"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={scrollViewport}
              className={`rounded-2xl p-6 space-y-6 transition ${
                isDarkMode
                  ? 'bg-white/3 border border-white/8 backdrop-blur-md'
                  : 'bg-white border border-slate-200 shadow-sm'
              }`}
            >
              <div className={`flex items-center gap-3 pb-4 ${isDarkMode ? 'border-b border-white/6' : 'border-b border-slate-100'}`}>
                <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-200'}`}>
                  <CheckSquare size={18} className={isDarkMode ? "text-emerald-400" : "text-emerald-600"} />
                </div>
                <div>
                  <h3 className={`text-base font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Skill Keyword Matrix</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Extracted skills & category recommendations for {displayJobTitle}</p>
                </div>
              </div>

              {/* 1. Verified Skills Extracted from Resume */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-400" /> Parsed Extracted Resume Skills ({extractedSkills.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {extractedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full cursor-default border shadow-2xs"
                      style={
                        isDarkMode
                          ? { background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#6ee7b7' }
                          : { background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857' }
                      }
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* 2. Target / Planned Skill Additions (User Selected) */}
              {addedSkills.length > 0 && (
                <div className={isDarkMode ? 'border-t border-white/6 pt-4' : 'border-t border-slate-100 pt-4'}>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
                    <Target size={13} /> Targeted Skill Additions for Resume Improvement ({addedSkills.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <AnimatePresence>
                      {addedSkills.map((skill) => (
                        <motion.span
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 border"
                          style={
                            isDarkMode
                              ? { background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.3)', color: '#67e8f9' }
                              : { background: '#ecfeff', border: '1px solid #a5f3fc', color: '#0e7490' }
                          }
                        >
                          <span>+ {skill}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveAddedSkill(skill)}
                            className="hover:text-rose-400 transition cursor-pointer p-0.5 rounded-full"
                          >
                            <X size={12} />
                          </button>
                        </motion.span>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* 3. Backend-Driven Skill Recommendations */}
              <div className={isDarkMode ? 'border-t border-white/6 pt-5' : 'border-t border-slate-100 pt-5'}>
                <SkillRecommendations
                  userSkills={extractedSkills}
                  addedSkills={addedSkills}
                  role={displayJobTitle}
                  onAddSkill={handleAddSkill}
                  isDarkMode={isDarkMode}
                />
              </div>
            </motion.div>
          )}

          {/* ── SECTION 5: SKILLS CHART ── */}
          {(activeTab === 'radar' || activeTab === 'all') && (
            <CompetencyRadar data={radarScores} isDarkMode={isDarkMode} />
          )}

          {/* ── SECTION 6: HOW TO IMPROVE ── */}
          {(activeTab === 'improvement' || activeTab === 'all') && (
            <motion.div key="tab-improvement" variants={containerVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} className="space-y-6">

              {/* 1. Header & Filter Bar */}
              <motion.div
                variants={itemVariants}
                className={`rounded-2xl p-6 transition ${
                  isDarkMode
                    ? 'bg-white/3 border border-white/8 backdrop-blur-md'
                    : 'bg-white border border-slate-200 shadow-sm'
                }`}
              >
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 ${isDarkMode ? 'border-b border-white/6' : 'border-b border-slate-100'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30' : 'bg-orange-50 border border-orange-200'}`}>
                      <TrendingUp size={22} className={isDarkMode ? "text-orange-400" : "text-orange-600"} />
                    </div>
                    <div>
                      <h3 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        Comprehensive Improvement Plan
                      </h3>
                      <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                        {filteredFeedback.length} Actionable area(s) to guarantee shortlisting for <span className="font-bold underline">{displayJobTitle}</span>
                      </p>
                    </div>
                  </div>

                  <span className={`self-start sm:self-auto text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 ${isDarkMode ? 'bg-orange-500/15 border border-orange-500/30 text-orange-300' : 'bg-orange-50 border border-orange-200 text-orange-700'}`}>
                    <Target size={13} /> {displayJobTitle} Roadmap
                  </span>
                </div>

                {/* Priority Filter Bar */}
                <div className="mt-5 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-xs font-bold mr-1 flex items-center gap-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      <Filter size={12} /> Severity:
                    </span>
                    {[
                      { id: 'all', label: `All Priority (${feedbackItems.length})` },
                      { id: 'high', label: '🔥 High Priority' },
                      { id: 'medium', label: '⚡ Medium Priority' },
                      { id: 'low', label: '💡 Quick Wins' },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setImprovementFilter(tab.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer border ${
                          improvementFilter === tab.id
                            ? isDarkMode
                              ? 'bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-600/30'
                              : 'bg-violet-600 text-white border-violet-600 shadow-sm'
                            : isDarkMode
                              ? 'bg-white/4 text-slate-400 border-white/7 hover:bg-white/8 hover:text-slate-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Category Filter Bar */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className={`text-xs font-bold mr-1 flex items-center gap-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      <Briefcase size={12} /> Category:
                    </span>
                    {categoriesList.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer border ${
                          selectedCategory === cat
                            ? isDarkMode
                              ? 'bg-emerald-600 text-white border-emerald-500'
                              : 'bg-emerald-600 text-white border-emerald-600'
                            : isDarkMode
                              ? 'bg-white/3 text-slate-400 border-white/6 hover:bg-white/8 hover:text-slate-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {cat === 'all' ? 'All Categories' : cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feedback List */}
                <div className="mt-5 space-y-4">
                  <AnimatePresence mode="popLayout">
                    {filteredFeedback.map((item, idx) => {
                      const isFixed = fixedCards[idx];
                      const severityStyles = {
                        high: {
                          bg: isDarkMode ? 'rgba(239,68,68,0.08)' : '#fef2f2',
                          border: isDarkMode ? 'rgba(239,68,68,0.25)' : '#fecaca',
                          badgeBg: 'rgba(239,68,68,0.15)',
                          badgeText: '#f87171',
                          icon: <Flame size={15} className="text-red-500" />
                        },
                        medium: {
                          bg: isDarkMode ? 'rgba(245,158,11,0.08)' : '#fffbeb',
                          border: isDarkMode ? 'rgba(245,158,11,0.25)' : '#fef3c7',
                          badgeBg: 'rgba(245,158,11,0.15)',
                          badgeText: '#fbbf24',
                          icon: <AlertTriangle size={15} className="text-amber-500" />
                        },
                        low: {
                          bg: isDarkMode ? 'rgba(59,130,246,0.08)' : '#eff6ff',
                          border: isDarkMode ? 'rgba(59,130,246,0.25)' : '#dbeafe',
                          badgeBg: 'rgba(59,130,246,0.15)',
                          badgeText: '#60a5fa',
                          icon: <Lightbulb size={15} className="text-blue-500" />
                        }
                      };
                      const style = severityStyles[item.severity] || severityStyles.medium;

                      return (
                        <motion.div
                          key={item.title}
                          layout
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: isFixed ? 0.6 : 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                          whileHover={{ y: -2 }}
                          className={`rounded-2xl p-5 border flex flex-col sm:flex-row gap-4 relative overflow-hidden transition ${
                            isFixed ? 'line-through grayscale opacity-60' : ''
                          }`}
                          style={{ background: style.bg, borderColor: style.border }}
                        >
                          <div className="p-2.5 rounded-xl self-start shrink-0" style={{ background: 'rgba(139,92,246,0.15)' }}>
                            {style.icon}
                          </div>

                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.title}</span>
                                <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border" style={{ background: style.badgeBg, color: style.badgeText, borderColor: style.border }}>
                                  {item.severity} PRIORITY
                                </span>
                                {item.category && (
                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${isDarkMode ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' : 'bg-violet-100 text-violet-700'}`}>
                                    {item.category}
                                  </span>
                                )}
                              </div>

                              <button
                                onClick={() => toggleFixedCard(idx)}
                                className={`text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition cursor-pointer ${
                                  isFixed
                                    ? 'bg-emerald-500 text-white'
                                    : isDarkMode ? 'bg-white/8 text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-400' : 'bg-slate-200 text-slate-700 hover:bg-emerald-100 hover:text-emerald-700'
                                }`}
                              >
                                <Check size={12} />
                                {isFixed ? "Completed!" : "Mark Fixed"}
                              </button>
                            </div>

                            <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{item.description}</p>

                            <div className={`p-3 rounded-xl flex items-start gap-2.5 ${isDarkMode ? 'bg-white/4 border border-white/7' : 'bg-white border border-slate-200 shadow-xs'}`}>
                              <ArrowRight size={13} className="text-violet-500 shrink-0 mt-0.5" />
                              <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{item.suggestion}</p>
                            </div>

                            <div className="flex items-center gap-3 pt-1 flex-wrap">
                              {item.impact && (
                                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 dark:text-violet-300">
                                  ⚡ Expected Impact: {item.impact}
                                </span>
                              )}
                              {item.timeframe && (
                                <span className={`text-[10px] font-medium flex items-center gap-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                  <Clock size={11} /> Est. Time: {item.timeframe}
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* 2. Google's X-Y-Z Resume Bullet Formula Helper Card */}
              <motion.div
                variants={itemVariants}
                className={`rounded-2xl p-6 transition ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-violet-950/60 to-slate-900 border border-violet-800/40 backdrop-blur-md'
                    : 'bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-violet-500/20 border border-violet-500/30 text-violet-300">
                    <Zap size={18} />
                  </div>
                  <div>
                    <h3 className={`text-base font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      Google's X-Y-Z Resume Bullet Formula
                    </h3>
                    <p className={`text-xs ${isDarkMode ? 'text-violet-300' : 'text-violet-700'}`}>
                      Proven structure used by top tech companies to pass initial recruiter screens for {displayJobTitle} roles
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-white/4 border-white/8' : 'bg-white border-slate-200'}`}>
                    <span className="text-xs font-black text-violet-400">1. Accomplished [X]</span>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Action verb + specific feature built or problem solved</p>
                  </div>
                  <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-white/4 border-white/8' : 'bg-white border-slate-200'}`}>
                    <span className="text-xs font-black text-emerald-400">2. Measured by [Y]</span>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Concrete metric (% latency drop, users served, endpoints created)</p>
                  </div>
                  <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-white/4 border-white/8' : 'bg-white border-slate-200'}`}>
                    <span className="text-xs font-black text-cyan-400">3. By doing [Z]</span>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Technologies, frameworks, & engineering methodology used</p>
                  </div>
                </div>

                <div className={`p-3.5 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-white border-violet-200'}`}>
                  <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-1">Example Transformation:</p>
                  <p className="text-xs text-red-400 line-through">❌ "Worked on backend REST API with Python and PostgreSQL."</p>
                  <p className="text-xs font-semibold text-emerald-400 mt-1">
                    ✅ "Engineered 14+ RESTful API endpoints [X], serving 800+ daily JSON requests with sub-90ms response latency [Y], utilizing Python, FastAPI, and PostgreSQL indexing [Z]."
                  </p>
                </div>
              </motion.div>

              {/* 3. MODERN SINGLE-COLUMN CLEAN TIMELINE ROADMAP (UPDATED TO MATCH UI IMAGE) */}
              <motion.div
                variants={itemVariants}
                className={`rounded-3xl p-6 sm:p-8 relative overflow-hidden transition ${
                  isDarkMode
                    ? 'bg-white/[0.04] border border-blue-500/20 backdrop-blur-xl shadow-2xl shadow-blue-950/20'
                    : 'bg-white border border-slate-200/80 shadow-lg shadow-slate-100'
                }`}
              >
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 text-blue-400 shadow-inner">
                      <Milestone size={22} />
                    </div>
                    <div>
                      <h3 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        Deployment Timeline Roadmap
                      </h3>
                      <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-blue-400/90' : 'text-blue-600'}`}>
                        Milestone sequence for target {displayJobTitle} shortlist certification
                      </p>
                    </div>
                  </div>

                  <div className={`px-4 py-2 rounded-2xl text-right border shrink-0 backdrop-blur-md ${
                    isDarkMode ? 'bg-white/[0.04] border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Milestone Progress</span>
                    <div className="text-sm font-black text-blue-400">{roadmapProgressPercent}% Deployed</div>
                  </div>
                </div>

                {/* Vertical Timeline Container */}
                <div className="relative pl-6 sm:pl-8 space-y-4">
                  {/* Clean Vertical Line */}
                  <div className={`absolute top-4 bottom-4 left-[15px] sm:left-[19px] w-[2px] rounded-full ${
                    isDarkMode 
                      ? 'bg-gradient-to-b from-blue-500 via-violet-500/40 to-slate-800' 
                      : 'bg-gradient-to-b from-blue-500 via-indigo-300 to-slate-200'
                  }`} />

                  {timelineMilestones.map((item, idx) => {
                    const isChecked = !!checkedSteps[idx];

                    return (
                      <div key={idx} className="relative flex items-start gap-4 sm:gap-6 group">
                        {/* Circular Check/Indicator Button */}
                        <button
                          type="button"
                          onClick={() => toggleStep(idx)}
                          className={`relative -ml-[25px] sm:-ml-[29px] w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition shrink-0 z-20 cursor-pointer shadow-md ${
                            isChecked
                              ? 'bg-blue-600 border-2 border-white text-white shadow-blue-500/50 scale-105'
                              : isDarkMode
                                ? 'bg-slate-900 border-2 border-blue-500/80 text-blue-400 hover:scale-110 hover:border-blue-400'
                                : 'bg-white border-2 border-blue-500 text-blue-600 hover:scale-110'
                          }`}
                          title="Toggle Milestone Completion"
                        >
                          {isChecked ? <Check size={13} className="stroke-[3]" /> : <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
                        </button>

                        {/* Milestone Card */}
                        <div className="flex-1 min-w-0">
                          <motion.div
                            whileHover={{ y: -2 }}
                            onClick={() => toggleStep(idx)}
                            className={`rounded-2xl p-5 sm:p-6 relative overflow-hidden transition-all duration-300 border cursor-pointer ${
                              isChecked
                                ? isDarkMode 
                                  ? 'bg-gradient-to-r from-blue-950/30 via-slate-900/40 to-slate-900/20 border-blue-500/40 shadow-lg shadow-blue-950/20' 
                                  : 'bg-blue-50/70 border-blue-200/80 shadow-sm'
                                : isDarkMode 
                                  ? 'bg-white/[0.02] border-white/[0.08] hover:border-blue-500/30 hover:bg-white/[0.04]' 
                                  : 'bg-white border-slate-200 shadow-sm hover:border-blue-300'
                            }`}
                          >
                            {/* Background Watermark Year */}
                            <div className={`text-4xl sm:text-5xl font-black tracking-tighter absolute right-4 top-2 select-none pointer-events-none opacity-40 ${
                              isDarkMode ? 'text-blue-200/10' : 'text-blue-600/10'
                            }`}>
                              {item.year}
                            </div>

                            {/* Phase & Status Tags */}
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                                isDarkMode
                                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                                  : 'bg-blue-50 border-blue-200 text-blue-700'
                              }`}>
                                {item.phase}
                              </span>
                              {item.status && (
                                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                                  item.status === 'Completed'
                                    ? isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : item.status === 'In Progress'
                                    ? isDarkMode ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : isDarkMode ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-slate-100 text-slate-600 border border-slate-200'
                                }`}>
                                  ● {item.status}
                                </span>
                              )}
                            </div>

                            {/* Title */}
                            <h4 className={`text-base font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                              {item.title}
                            </h4>

                            {/* Description */}
                            <p className={`text-xs mt-1.5 leading-relaxed max-w-2xl ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                              {item.description}
                            </p>

                            {/* Impact Badge */}
                            {item.impact && (
                              <div className="mt-3.5 pt-2 flex items-center gap-1.5">
                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                                  isDarkMode ? 'bg-purple-500/15 border border-purple-500/30 text-purple-300' : 'bg-purple-50 border border-purple-200 text-purple-700'
                                }`}>
                                  🚀 {item.impact}
                                </span>
                              </div>
                            )}
                          </motion.div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

            </motion.div>
          )}

        </main>
      </div>
    </div>
  );
}