import React, { useState, useEffect, useRef } from 'react';
import { Download, ChevronRight, Code, Music, Trophy, User, RefreshCw, ImagePlus } from 'lucide-react';

const Hero: React.FC = () => {
  // State quản lý ảnh: Mặc định là null để kiểm tra local storage trước
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Khi trang web tải lên, kiểm tra xem đã có ảnh lưu trước đó chưa
  useEffect(() => {
    const savedImage = localStorage.getItem("my-fixed-profile-image");
    if (savedImage) {
      setProfileImage(savedImage); // Nếu có, dùng ảnh đó
    } else {
      setProfileImage(null); // Nếu chưa, để trống (sẽ hiện icon User mặc định)
    }
  }, []);

  // 2. Hàm xử lý khi bạn chọn ảnh từ máy tính
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      
      // Khi đọc xong file
      reader.onloadend = () => {
        const base64String = reader.result as string;
        
        // Cập nhật lên giao diện ngay lập tức
        setProfileImage(base64String);
        
        // LƯU CỐ ĐỊNH VÀO TRÌNH DUYỆT (Local Storage)
        // Lần sau mở lại trang web, ảnh này sẽ tự động hiện ra
        localStorage.setItem("my-fixed-profile-image", base64String);
      };
      
      // Bắt đầu đọc file ảnh
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl opacity-30" />

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-6 z-10">
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
            Xin chào, mình là <strong className="text-white">Nguyễn Thiên Minh</strong> (14 tuổi).
            <br />
            Sinh nhật: 25/04/2012. 
            <br />
            Học sinh lớp <strong>Toán & Khoa học Tự nhiên Nâng cao</strong> tại trường <strong>Wellspring Saigon</strong> (8 năm).
            Đam mê công nghệ, Robotics, Piano và Cầu lông.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a 
              href="#achievements"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 group"
            >
              Xem Thành Tựu
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

        {/* Right Content - Profile Picture */}
        <div className="relative flex justify-center items-center">
          <div className="relative w-64 h-64 md:w-80 md:h-80 group">
            {/* Animated Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse" />
            
            {/* Image Container */}
            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/10 shadow-2xl bg-slate-900 flex items-center justify-center bg-slate-800">
               
               {/* 1. Nếu có ảnh (từ upload hoặc local storage) thì hiển thị */}
               {profileImage ? (
                 <img 
                  src={profileImage} 
                  alt="Nguyen Thien Minh"
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110 relative z-10"
                />
               ) : (
                 /* 2. Nếu chưa có ảnh, hiện Icon User và hướng dẫn */
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 z-0">
                    <User size={80} strokeWidth={1} />
                    <span className="text-xs mt-2 font-mono opacity-50">No Image Set</span>
                 </div>
               )}

              {/* Upload Button Overlay - Luôn hiện để có thể chỉnh sửa bất cứ lúc nào */}
              <div className="absolute bottom-4 right-0 left-0 flex justify-center z-20">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden" 
                  accept="image/*"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-slate-900/80 backdrop-blur-md border border-white/20 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all hover:scale-105 flex items-center gap-2 group/btn"
                  title="Tải ảnh lên (Lưu cố định)"
                >
                  {profileImage ? <RefreshCw size={16} /> : <ImagePlus size={16} />}
                  <span className="text-sm font-medium">
                    {profileImage ? 'Đổi Ảnh' : 'Tải Ảnh Lên'}
                  </span>
                </button>
              </div>
            </div>

            {/* Floating Badges */}
            <div className="absolute -right-4 top-10 p-3 glass-card rounded-xl animate-bounce shadow-lg shadow-blue-500/20" style={{ animationDelay: '0s' }}>
               <Code className="text-blue-400 w-6 h-6" />
            </div>
            <div className="absolute -left-4 bottom-20 p-3 glass-card rounded-xl animate-bounce shadow-lg shadow-purple-500/20" style={{ animationDelay: '1.5s' }}>
               <Music className="text-purple-400 w-6 h-6" />
            </div>
            <div className="absolute right-10 -bottom-4 p-3 glass-card rounded-xl animate-bounce shadow-lg shadow-yellow-500/20" style={{ animationDelay: '3s' }}>
               <Trophy className="text-yellow-400 w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;