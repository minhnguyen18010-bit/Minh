import React from 'react';
import { Trophy, Code, Award, Heart } from 'lucide-react';

const stats = [
  {
    label: "Coding Experience",
    value: "5 Years",
    sub: "Since young age",
    icon: Code,
    color: "text-blue-400"
  },
  {
    label: "Robotacon",
    value: "3 Silver",
    sub: "Consecutive Wins",
    icon: Trophy,
    color: "text-yellow-400"
  },
  {
    label: "Int'l Dance",
    value: "1 Gold",
    sub: "Malaysia Competition",
    icon: Award,
    color: "text-purple-400"
  },
  {
    label: "Activities",
    value: "15+",
    sub: "Charity & Events",
    icon: Heart,
    color: "text-red-400"
  }
];

const Stats: React.FC = () => {
  return (
    <section className="py-10 border-y border-white/5 bg-white/[0.02]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col p-4 rounded-xl hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">{stat.label}</span>
              </div>
              <span className="text-3xl font-bold text-white mb-1">{stat.value}</span>
              <span className="text-slate-500 text-sm">{stat.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;