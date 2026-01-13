import React from 'react';
import { Download, ChevronRight, Terminal } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl opacity-30" />

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Open to Opportunities
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Building the <br />
            <span className="gradient-text">Digital Future.</span>
          </h1>
          
          <p className="text-slate-400 text-lg max-w-lg leading-relaxed">
            Học sinh xuất sắc với niềm đam mê công nghệ và nghệ thuật.
            Kinh nghiệm 5 năm Coding, 3 năm chinh chiến Robotacon và huy chương Vàng nghệ thuật quốc tế.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a 
              href="#"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 group"
            >
              Xem Dự Án
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="#"
              className="px-8 py-3 glass-card hover:bg-white/5 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download CV
            </a>
          </div>
        </div>

        {/* Right Content - Abstract Code Visual */}
        <div className="relative">
          <div className="glass-card rounded-xl p-1 border-t border-white/10 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
            <div className="bg-[#0f1420] rounded-lg p-6 font-mono text-sm overflow-hidden">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="space-y-2 text-slate-300">
                <p><span className="text-purple-400">const</span> <span className="text-blue-400">profile</span> = <span className="text-yellow-300">{`{`}</span></p>
                <p className="pl-4"><span className="text-sky-300">experience</span>: <span className="text-orange-300">"5 years coding"</span>,</p>
                <p className="pl-4"><span className="text-sky-300">achievements</span>: <span className="text-yellow-300">[</span></p>
                <p className="pl-8"><span className="text-green-400">"Robotacon Silver (3x)"</span>,</p>
                <p className="pl-8"><span className="text-green-400">"Malaysia Dance Gold"</span>,</p>
                <p className="pl-4"><span className="text-yellow-300">]</span>,</p>
                <p className="pl-4"><span className="text-sky-300">academics</span>: <span className="text-orange-300">"Excellent Student (6 yrs)"</span>,</p>
                <p className="pl-4"><span className="text-sky-300">hobbies</span>: <span className="text-yellow-300">[</span><span className="text-green-400">"Coding"</span>, <span className="text-green-400">"Badminton"</span><span className="text-yellow-300">]</span></p>
                <p><span className="text-yellow-300">{`}`}</span>;</p>
                <div className="mt-4 flex items-center gap-2 text-slate-500">
                  <Terminal size={14} />
                  <span className="animate-pulse">_cursor_active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;