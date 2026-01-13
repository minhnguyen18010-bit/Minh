import React from 'react';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Achievements from './components/Achievements';
import Timeline from './components/Timeline';
import Skills from './components/Skills';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-background text-slate-200 selection:bg-blue-500/30 selection:text-blue-200">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-card border-b-0 border-b-white/5 bg-opacity-80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-bold text-xl tracking-tight uppercase">
            Nguyễn <span className="text-blue-500">Thiên Minh</span>
          </span>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#achievements" className="hover:text-white transition-colors">Achievements</a>
            <a href="#education" className="hover:text-white transition-colors">Education</a>
            <a href="#skills" className="hover:text-white transition-colors">Skills</a>
          </div>
          <button className="px-4 py-2 text-xs font-bold bg-white/10 hover:bg-white/20 rounded border border-white/10 transition-colors uppercase tracking-wider">
            Contact Me
          </button>
        </div>
      </nav>

      <main>
        <Hero />
        <Stats />
        <Achievements />
        <Timeline />
        <Skills />
      </main>

      <Footer />
    </div>
  );
}

export default App;