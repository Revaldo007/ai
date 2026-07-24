import React, { useRef } from 'react';

export default function Sidebar({ activeTab, setActiveTab, navItems, isDarkMode = true }) {
  const scrollRef = useRef(null);

  return (
    <div
      className={`w-full max-w-5xl mx-auto rounded-2xl transition-all duration-300 ${
        isDarkMode
          ? 'bg-white/4 border border-white/8 backdrop-blur-md'
          : 'bg-white border border-slate-200 shadow-sm'
      }`}
    >
      <div
        ref={scrollRef}
        className="p-2 flex items-center gap-2 overflow-x-auto"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          maskImage: 'linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)',
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          let buttonStyle = {};
          if (isDarkMode) {
            buttonStyle = isActive ? {
              background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
              color: '#ffffff',
              boxShadow: '0 0 16px rgba(124,58,237,0.45)',
              border: '1px solid rgba(139,92,246,0.6)',
            } : {
              background: 'rgba(255,255,255,0.04)',
              color: '#94a3b8',
              border: '1px solid rgba(255,255,255,0.07)',
            };
          } else {
            buttonStyle = isActive ? {
              background: '#7c3aed',
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(124,58,237,0.25)',
              border: '1px solid #7c3aed',
            } : {
              background: '#f8fafc',
              color: '#475569',
              border: '1px solid #e2e8f0',
            };
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0"
              style={buttonStyle}
              onMouseEnter={e => {
                if (!isActive) {
                  if (isDarkMode) {
                    e.currentTarget.style.background = 'rgba(139,92,246,0.15)';
                    e.currentTarget.style.color = '#c4b5fd';
                    e.currentTarget.style.border = '1px solid rgba(139,92,246,0.3)';
                  } else {
                    e.currentTarget.style.background = '#f5f3ff';
                    e.currentTarget.style.color = '#6d28d9';
                    e.currentTarget.style.border = '1px solid #ddd6fe';
                  }
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.04)' : '#f8fafc';
                  e.currentTarget.style.color = isDarkMode ? '#94a3b8' : '#475569';
                  e.currentTarget.style.border = isDarkMode ? '1px solid rgba(255,255,255,0.07)' : '1px solid #e2e8f0';
                }
              }}
            >
              <Icon size={14} />
              <span>{item.label}</span>
              {isActive && <span className="w-1 h-1 rounded-full bg-white/80 ml-0.5" />}
            </button>
          );
        })}
      </div>
      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}