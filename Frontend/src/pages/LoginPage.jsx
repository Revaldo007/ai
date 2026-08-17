import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Cpu, BrainCircuit, Loader2 } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ username: '', password: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    const endpoint = isLogin ? '/api/login/' : '/api/register/';
    
    try {
      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed. Please try again.');
      }

      // Successful login/register
      onLogin(data.token, data.username);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0b0f1e]">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[100px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }} 
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[120px]"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.05)_0,transparent_50%)]" />
      </div>

      <div className="relative z-10 w-full max-w-[1000px] p-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Branding / Copy */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden lg:flex flex-col space-y-8"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl shadow-[0_0_30px_rgba(124,58,237,0.5)]">
              <BrainCircuit className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">AI Resume Reader</h1>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 leading-tight">
              Unlock your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Career Potential</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-md leading-relaxed">
              Log in to track your resume analysis history, review ATS scores, and iteratively improve your match percentage for dream roles.
            </p>
          </div>

          <div className="flex gap-6 mt-8">
            {[
              { icon: Cpu, text: "AI-Powered Parsing" },
              { icon: ShieldCheck, text: "Data Privacy" }
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <feature.icon className="w-5 h-5 text-violet-400" />
                </div>
                <span className="text-sm font-semibold text-slate-300">{feature.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Side: Auth Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="backdrop-blur-2xl bg-white/[0.02] border border-white/[0.05] p-8 sm:p-10 rounded-[2rem] shadow-2xl relative overflow-hidden">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-50" />
            
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h3>
                <p className="text-sm text-slate-400">
                  {isLogin ? "Enter your credentials to access your dashboard" : "Sign up to track your resume performance"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-400 transition-colors">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Username"
                      className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                      required
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-400 transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                      required
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-400 text-sm font-medium text-center bg-red-400/10 py-2 rounded-lg border border-red-400/20"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {isLogin ? "Sign In" : "Sign Up"}
                      <ArrowRight size={18} />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Demo Credentials Helper */}
              {isLogin && (
                <div className="mt-5 p-3 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                  <p className="text-xs text-slate-400 mb-2">⚡ Quick Fill Demo Accounts:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button
                      type="button"
                      onClick={() => setFormData({ username: 'reo', password: 'reo123' })}
                      className="px-2.5 py-1 text-xs rounded-lg bg-violet-500/20 text-violet-300 hover:bg-violet-500/30 border border-violet-500/30 transition-all font-mono"
                    >
                      reo (reo123)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ username: 'reception@hospital.com', password: 'password123' })}
                      className="px-2.5 py-1 text-xs rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/30 transition-all font-mono"
                    >
                      reception@hospital.com
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6 text-center">
                <p className="text-sm text-slate-400">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                  <button
                    onClick={toggleMode}
                    className="text-violet-400 hover:text-violet-300 font-bold transition-colors focus:outline-none underline decoration-violet-400/30 underline-offset-4"
                  >
                    {isLogin ? "Create one" : "Sign in"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
