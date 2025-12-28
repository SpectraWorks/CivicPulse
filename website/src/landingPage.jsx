import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, Map as MapIcon, BarChart3, Users } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600 rounded-lg"><Activity size={24} /></div>
          <span className="text-2xl font-bold tracking-tight">CivicPulse</span>
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigate('/login')} className="text-gray-300 hover:text-white font-medium transition-colors">Log In</button>
          <button onClick={() => navigate('/register')} className="bg-indigo-600 hover:bg-indigo-500 px-5 py-2 rounded-lg font-bold transition-all shadow-lg shadow-indigo-500/20">Sign Up</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-5xl mx-auto text-center mt-20 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-6 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-green-500"></span> Live Beta 
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
          Don't just complain.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Fix your neighborhood.</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          CivicPulse is the "Waze for civic issues." We use AI to track problems like traffic, waste, and safety in real-time, helping communities and authorities act faster.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button onClick={() => navigate('/register')} className="group bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition-all">
            Get Started <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button onClick={() => navigate('/login')} className="px-8 py-4 rounded-xl font-bold text-lg border border-gray-700 hover:bg-gray-800 transition-all">
            View Live Map
          </button>
        </div>
      </header>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto mt-32 px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-8 rounded-2xl bg-gray-800/50 border border-gray-700 hover:border-indigo-500/50 transition-colors">
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400 mb-6"><MapIcon size={28} /></div>
            <h3 className="text-xl font-bold mb-3">Real-Time Radar</h3>
            <p className="text-gray-400">See what's hurting your locality right now. From traffic jams to broken streetlights, get instant visual alerts.</p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-2xl bg-gray-800/50 border border-gray-700 hover:border-indigo-500/50 transition-colors">
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-400 mb-6"><BarChart3 size={28} /></div>
            <h3 className="text-xl font-bold mb-3">AI Heatmaps</h3>
            <p className="text-gray-400">Our Gemini-powered AI clusters similar reports to identify high-priority "Hotspots" for authorities.</p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-2xl bg-gray-800/50 border border-gray-700 hover:border-indigo-500/50 transition-colors">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400 mb-6"><Users size={28} /></div>
            <h3 className="text-xl font-bold mb-3">Crowd-Powered</h3>
            <p className="text-gray-400">Earn Karma points for verified reports. Join the leaderboard and become a top contributor in your city.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-10 text-center text-gray-500 text-sm">
        <p>&copy; 2025 CivicPulse. Built for the Hackathon.</p>
      </footer>
    </div>
  );
};

export default LandingPage;