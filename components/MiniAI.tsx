import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'ai';
  text: string;
}

const MiniAI: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Xin chào! Mình là trợ lý AI của Thiên Minh. Bạn muốn tìm hiểu gì về tài năng Robotics, Piano hay các dự án của Minh không?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: `Bạn là trợ lý ảo Mini AI tích hợp trong Portfolio của Nguyễn Thiên Minh. 
          Thông tin về chủ nhân: 
          - Tên: Nguyễn Thiên Minh (14 tuổi, sinh 25/04/2012).
          - Học vấn: Lớp Toán & Khoa học Tự nhiên Nâng cao tại Wellspring Saigon (8 năm).
          - Thành tích: 3 Huy chương Bạc Robotacon liên tiếp, 1 Huy chương Vàng Nhảy quốc tế tại Malaysia, Biểu diễn Piano chuyên nghiệp.
          - Sở thích: Lập trình (5 năm kinh nghiệm), Robotics, Cầu lông.
          Nhiệm vụ: Trả lời thân thiện, thông minh, hỗ trợ người dùng tìm hiểu về Minh hoặc giải đáp các thắc mắc về học tập, lập trình. Hãy trả lời ngắn gọn, súc tích bằng tiếng Việt.`,
        },
      });

      const aiResponse = response.text || "Xin lỗi, mình gặp chút trục trặc khi suy nghĩ. Bạn thử lại nhé!";
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "Kết nối với não bộ AI bị gián đoạn rồi. Minh đang sửa chữa!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[350px] md:w-[400px] h-[500px] glass-card rounded-2xl border border-blue-500/30 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300 origin-bottom-right">
          {/* Header */}
          <div className="p-4 border-b border-white/10 bg-blue-600/20 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Mini AI Assistant</h3>
                <p className="text-[10px] text-blue-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  Powered by Gemini 3
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-slate-800 text-slate-200 border border-white/5 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-blue-500" />
                  <span className="text-xs text-slate-400">AI đang suy nghĩ...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/10 bg-black/20">
            <div className="relative">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Hỏi AI về Thiên Minh..."
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 pr-12 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-500 hover:text-blue-400 disabled:text-slate-600 transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 group ${
          isOpen ? 'bg-slate-800 text-white' : 'bg-blue-600 text-white'
        }`}
      >
        {isOpen ? <X size={24} /> : (
          <div className="relative">
            <MessageSquare size={24} />
            <div className="absolute -top-2 -right-2 bg-red-500 text-[8px] font-bold px-1.5 py-0.5 rounded-full border-2 border-background animate-bounce">
              AI
            </div>
            <Sparkles size={12} className="absolute -bottom-3 -right-3 text-yellow-400 animate-pulse" />
          </div>
        )}
      </button>
    </div>
  );
};

export default MiniAI;