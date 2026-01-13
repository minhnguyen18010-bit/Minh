import React from 'react';

const SkillBar = ({ name, level, colorClass }: { name: string; level: number; colorClass: string }) => (
  <div className="mb-6">
    <div className="flex justify-between mb-2">
      <span className="text-slate-200 font-medium font-mono">{name}</span>
      <span className="text-slate-400 text-sm">{level}%</span>
    </div>
    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full ${colorClass} transition-all duration-1000`} 
        style={{ width: `${level}%` }}
      ></div>
    </div>
  </div>
);

const HobbyTag = ({ name }: { name: string }) => (
  <span className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors cursor-default">
    {name}
  </span>
);

const Skills: React.FC = () => {
  return (
    <section className="py-20" id="skills">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16">
          
          {/* Left: Technical Skills */}
          <div>
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <span className="w-2 h-8 bg-blue-500 rounded-sm"></span>
              Technical Proficiency
            </h3>
            <div className="glass-card p-8 rounded-2xl">
              <SkillBar name="Coding Logic (5 Years Exp)" level={90} colorClass="bg-blue-500" />
              <SkillBar name="Robotics / Hardware" level={85} colorClass="bg-cyan-400" />
              <SkillBar name="Problem Solving" level={88} colorClass="bg-purple-500" />
              <SkillBar name="Teamwork" level={80} colorClass="bg-green-500" />
            </div>
          </div>

          {/* Right: Soft Skills & Hobbies */}
          <div>
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <span className="w-2 h-8 bg-pink-500 rounded-sm"></span>
              Sports & Arts
            </h3>
            <div className="glass-card p-8 rounded-2xl h-full flex flex-col justify-center">
               <p className="text-slate-400 mb-6">
                 Ngoài đam mê công nghệ, tôi luôn duy trì sự cân bằng thông qua các hoạt động thể thao và nghệ thuật.
               </p>
               
               <div className="space-y-6">
                 <div>
                    <h4 className="text-white font-bold mb-3">Athletics</h4>
                    <div className="flex flex-wrap gap-3">
                      <HobbyTag name="Badminton (Cầu lông)" />
                      <HobbyTag name="Endurance" />
                    </div>
                 </div>

                 <div className="w-full h-px bg-slate-700/50"></div>

                 <div>
                    <h4 className="text-white font-bold mb-3">Arts & Music</h4>
                    <div className="flex flex-wrap gap-3">
                      <HobbyTag name="Piano Performance" />
                      <HobbyTag name="Dancing" />
                    </div>
                 </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Skills;