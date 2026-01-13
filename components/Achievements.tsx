import React from 'react';
import { Medal, Star, Cpu, Globe, Music } from 'lucide-react';

const Achievements: React.FC = () => {
  return (
    <section className="py-20" id="achievements">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px bg-slate-700 flex-1"></div>
          <h2 className="text-3xl font-bold text-center">
            <span className="text-blue-400">#</span> Major Achievements
          </h2>
          <div className="h-px bg-slate-700 flex-1"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1: Robotacon */}
          <div className="glass-card p-8 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Cpu size={100} />
            </div>
            <div className="flex flex-col gap-4">
              <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400 w-fit">
                <Medal size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Robotacon</h3>
                <p className="text-slate-400 mb-4 text-sm">
                  3 năm liên tiếp đạt huy chương Bạc, khẳng định đam mê Robotics bền bỉ.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-slate-800 rounded text-xs text-yellow-400 border border-yellow-400/20 flex items-center gap-1">
                     <Star size={10} fill="currentColor" /> 3x Silver Medals
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Dance */}
          <div className="glass-card p-8 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Globe size={100} />
            </div>
            <div className="flex flex-col gap-4">
              <div className="p-3 rounded-lg bg-purple-500/20 text-purple-400 w-fit">
                <Medal size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Int'l Dance</h3>
                <p className="text-slate-400 mb-4 text-sm">
                  Huy chương Vàng tại giải thi đấu Malaysia, tỏa sáng trên sân khấu quốc tế.
                </p>
                <span className="px-2 py-1 bg-yellow-500/10 rounded text-xs text-yellow-300 border border-yellow-500/30 flex items-center w-max gap-1">
                   <Star size={10} fill="currentColor" /> Gold Medal
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Piano & Arts */}
          <div className="glass-card p-8 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Music size={100} />
            </div>
            <div className="flex flex-col gap-4">
              <div className="p-3 rounded-lg bg-pink-500/20 text-pink-400 w-fit">
                <Music size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Piano Talent</h3>
                <p className="text-slate-400 mb-4 text-sm">
                  Nhiều lần biểu diễn Piano tại các sự kiện lớn của trường và các sân khấu nghệ thuật.
                </p>
                <span className="px-2 py-1 bg-pink-500/10 rounded text-xs text-pink-300 border border-pink-500/30 flex items-center w-max gap-1">
                   Stage Performance
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Achievements;