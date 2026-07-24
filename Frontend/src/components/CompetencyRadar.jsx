import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Activity } from 'lucide-react';

export default function CompetencyRadar({ data, isDarkMode = true }) {
  const defaultData = {
    skills: 90,
    projects: 92,
    experience: 75,
    education: 88,
    formatting: 95,
    atsPass: 92,
    ...data
  };

  const categories = [
    { key: 'skills', label: 'Skills' },
    { key: 'projects', label: 'Projects' },
    { key: 'experience', label: 'Experience' },
    { key: 'education', label: 'Education' },
    { key: 'formatting', label: 'Formatting' },
    { key: 'atsPass', label: 'ATS Pass' }
  ];

  const total = categories.length;
  const cx = 200;
  const cy = 180;
  const R = 105;

  const getCoordinates = (value, index) => {
    const angle = (Math.PI * 2 / total) * index - Math.PI / 2;
    const r = (value / 100) * R;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return { x, y, angle };
  };

  const points = categories.map((cat, i) => {
    const val = defaultData[cat.key] || 0;
    const { x, y } = getCoordinates(val, i);
    return `${x},${y}`;
  }).join(' ');

  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`rounded-2xl p-6 space-y-4 transition ${
        isDarkMode
          ? 'bg-white/3 border border-white/8 backdrop-blur-md'
          : 'bg-white border border-slate-200 shadow-sm'
      }`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between pb-3 ${isDarkMode ? 'border-b border-white/6' : 'border-b border-slate-100'}`}>
        <div className="flex items-center gap-2">
          <Activity size={16} className={isDarkMode ? "text-violet-400" : "text-violet-600"} />
          <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Skills Chart
          </h3>
        </div>
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 ${
          isDarkMode
            ? 'bg-violet-500/15 border border-violet-500/30 text-violet-300'
            : 'bg-violet-50 border border-violet-200 text-violet-700'
        }`}>
          <Sparkles size={12} />
          Dynamic Visualizer
        </span>
      </div>

      {/* SVG Animated Radar Canvas */}
      <div className="flex justify-center items-center py-2 overflow-x-auto">
        <svg width="420" height="360" viewBox="0 0 400 360" className="overflow-visible select-none">
          <defs>
            <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity={isDarkMode ? "0.4" : "0.3"} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.15" />
            </linearGradient>
            <linearGradient id="strokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          {/* 1. Grid Concentric Rings */}
          {levels.map((level, idx) => {
            const ringPoints = categories.map((_, i) => {
              const { x, y } = getCoordinates(level * 100, i);
              return `${x},${y}`;
            }).join(' ');

            return (
              <motion.polygon
                key={idx}
                points={ringPoints}
                fill="none"
                stroke={isDarkMode ? "rgba(255,255,255,0.07)" : "#E2E8F0"}
                strokeWidth="1"
                strokeDasharray={level < 1 ? "3 3" : "none"}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.06, ease: "easeOut" }}
                style={{ transformOrigin: `${cx}px ${cy}px` }}
              />
            );
          })}

          {/* 2. Spoke Axis Lines */}
          {categories.map((_, i) => {
            const { x, y } = getCoordinates(100, i);
            return (
              <motion.line
                key={i}
                x1={cx}
                y1={cy}
                x2={x}
                y2={y}
                stroke={isDarkMode ? "rgba(255,255,255,0.08)" : "#E2E8F0"}
                strokeWidth="1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.25 }}
              />
            );
          })}

          {/* 3. Main Dynamic Polygon */}
          <motion.polygon
            points={points}
            fill="url(#radarFill)"
            stroke="url(#strokeGrad)"
            strokeWidth="2.5"
            strokeLinejoin="round"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 110,
              damping: 16,
              delay: 0.35
            }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />

          {/* 4. Vertices, Pulse Waves & Percentage Labels */}
          {categories.map((cat, i) => {
            const val = defaultData[cat.key] || 0;
            const { x, y, angle } = getCoordinates(val, i);
            const outerPos = getCoordinates(124, i);

            let textAnchor = "middle";
            if (Math.cos(angle) > 0.3) textAnchor = "start";
            if (Math.cos(angle) < -0.3) textAnchor = "end";

            return (
              <g key={cat.key}>
                {/* Continuous Pulse Aura */}
                <motion.circle
                  cx={x}
                  cy={y}
                  r="8"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="1.2"
                  initial={{ opacity: 0.8, scale: 0.5 }}
                  animate={{ opacity: 0, scale: 2 }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    delay: 0.6 + i * 0.1,
                    ease: "easeOut"
                  }}
                  style={{ transformOrigin: `${x}px ${y}px` }}
                />

                {/* Vertex Dot */}
                <motion.circle
                  cx={x}
                  cy={y}
                  r="4.5"
                  fill="#8B5CF6"
                  stroke={isDarkMode ? "#0F172A" : "#FFFFFF"}
                  strokeWidth="2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                    delay: 0.5 + i * 0.05
                  }}
                />

                {/* Text Label */}
                <motion.text
                  x={outerPos.x}
                  y={outerPos.y + 4}
                  textAnchor={textAnchor}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    fill: isDarkMode ? '#94a3b8' : '#475569',
                    fontFamily: 'sans-serif'
                  }}
                  initial={{ opacity: 0, y: outerPos.y + 8 }}
                  animate={{ opacity: 1, y: outerPos.y + 4 }}
                  transition={{ duration: 0.3, delay: 0.65 + i * 0.05 }}
                >
                  {cat.label}{' '}
                  <tspan style={{ fill: isDarkMode ? '#c4b5fd' : '#6d28d9', fontWeight: 900 }}>
                    ({val}%)
                  </tspan>
                </motion.text>
              </g>
            );
          })}
        </svg>
      </div>
    </motion.div>
  );
}