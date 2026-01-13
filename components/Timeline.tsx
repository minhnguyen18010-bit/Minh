import React from 'react';
import { GraduationCap, HeartHandshake, Calendar } from 'lucide-react';

interface TimelineItemProps {
  year: string;
  title: string;
  desc: string;
  tags?: string[];
  icon: React.ElementType;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ year, title, desc, tags, icon: Icon }) => (
  <div className="relative pl-8 sm:pl-32 py-6 group">
    {/* Line */}
    <div className="hidden sm:flex flex-col items-end absolute left-0 top-6 w-24 pr-8">
      <span className="text-lg font-bold text-blue-400">{year}</span>
    </div>
    
    {/* Mobile Year */}
    <div className="sm:hidden mb-2">
        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded font-mono">{year}</span>
    </div>

    {/* Dot & Line */}
    <div className="absolute left-0 sm:left-24 top-0 bottom-0 w-px bg-slate-800 group-last:bottom-auto group-last:h-8"></div>
    <div className="absolute left-[-5px] sm:left-[91px] top-7 w-3 h-3 rounded-full bg-blue-500 border-4 border-[#0B0F19]"></div>

    {/* Content Card */}
    <div className="glass-card p-6 rounded-xl hover:border-blue-500/30 transition-colors">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-slate-800 rounded-lg">
          <Icon className="w-5 h-5 text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        {desc}
      </p>
      {tags && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span key={i} className="text-xs px-2 py-1 bg-slate-800 text-slate-300 rounded border border-slate-700">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  </div>
);

const Timeline: React.FC = () => {
  return (
    <section className="py-20 bg-black/20" id="education">
      <div className="container mx-auto px-6 max-w-4xl">
         <div className="mb-12">
           <h2 className="text-3xl font-bold mb-4">Education & Activities</h2>
           <p className="text-slate-400">Hành trình học tập và phát triển bản thân.</p>
         </div>

         <div className="space-y-2">
            <TimelineItem 
              year="8 Years"
              title="Wellspring Saigon"
              desc="Học sinh lớp Toán Nâng Cao và Khoa Học Tự Nhiên Nâng Cao. Luôn duy trì thành tích xuất sắc và tích cực tham gia các hoạt động trường."
              icon={GraduationCap}
              tags={['Adv Math', 'Adv Science', 'Excellent Student']}
            />
             <TimelineItem 
              year="Ongoing"
              title="Social Activities & Charity"
              desc="Tham gia tích cực vào hơn 15 hoạt động trải nghiệm thực tế và các chương trình từ thiện, đóng góp cho cộng đồng."
              icon={HeartHandshake}
              tags={['Volunteer', 'Community', 'Leadership']}
            />
            <TimelineItem 
              year="2019-2024"
              title="Coding Journey"
              desc="5 năm kinh nghiệm tự học và rèn luyện lập trình. Phát triển tư duy logic thông qua các dự án cá nhân và thi đấu."
              icon={Calendar}
              tags={['Python', 'C++', 'Scratch']}
            />
         </div>
      </div>
    </section>
  );
};

export default Timeline;