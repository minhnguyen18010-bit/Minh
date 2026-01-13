import React from 'react';
import { Mail, Github, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 border-t border-white/10 bg-[#080b14]">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tighter">
            DEV<span className="text-blue-500">.PORTFOLIO</span>
          </h2>
          <p className="text-slate-500 text-sm mt-2">© 2024. All rights reserved.</p>
        </div>

        <div className="flex gap-6">
          <a href="#" className="text-slate-400 hover:text-white transition-colors"><Github size={20} /></a>
          <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors"><Linkedin size={20} /></a>
          <a href="#" className="text-slate-400 hover:text-red-400 transition-colors"><Mail size={20} /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;