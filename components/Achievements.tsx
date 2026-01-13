import React from 'react';
import { Medal, Star, Cpu, Globe } from 'lucide-react';

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

        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1: Robotacon */}
          <div className="glass-card p-8 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Cpu size={100} />
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
                <Medal size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Robotacon Competition</h3>
                <p className="text-slate-400 mb-4">
                  Một hành trình bền bỉ với đam mê Robotics. Hoàn thành 3 năm thi đấu liên tục.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-slate-800 rounded-full text-sm text-yellow-400 border border-yellow-400/20 flex items-center gap-1">
                     <Star size={12} fill="currentColor" /> Silver Medal (Year 1)
                  </span>
                  <span className="px-3 py-1 bg-slate-800 rounded-full text-sm text-yellow-400 border border-yellow-400/20 flex items-center gap-1">
                     <Star size={12} fill="currentColor" /> Silver Medal (Year 2)
                  </span>
                  <span className="px-3 py-1 bg-slate-800 rounded-full text-sm text-yellow-400 border border-yellow-400/20 flex items-center gap-1">
                     <Star size={12} fill="currentColor" /> Silver Medal (Year 3)
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
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-purple-500/20 text-purple-400">
                <Medal size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">International Dance Championship</h3>
                <p className="text-slate-400 mb-4">
                  Thi đấu tại Malaysia, thể hiện tài năng nghệ thuật và sự tự tin trên sân khấu quốc tế.
                </p>
                <span className="px-4 py-1.5 bg-yellow-500/10 rounded-full text-sm text-yellow-300 border border-yellow-500/30 flex items-center w-max gap-2">
                   <Star size={14} fill="currentColor" /> Gold Medal Winner
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