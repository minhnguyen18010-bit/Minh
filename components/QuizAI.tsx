import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Bot, Loader2, Sparkles, ImagePlus, Paperclip, FileText, BrainCircuit, Type as TypeIcon } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { QuizItem } from './QuizSystem';

interface Message {
  role: 'user' | 'ai';
  text: string;
  image?: string;
}

const QuizAI: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Chào Thiên Minh! Mình đã được nâng cấp. Bạn có thể gửi ảnh đề bài hoặc yêu cầu mình tạo Quiz về bất kỳ chủ đề nào (Toán, Lý, Tiếng Anh...) để nạp thẳng vào app nhé!' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMessage = input.trim();
    const userImage = selectedImage;
    setInput('');
    setSelectedImage(null);
    setMessages(prev => [...prev, { role: 'user', text: userMessage || "Đã gửi một ảnh", image: userImage || undefined }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const contents: any[] = [];
      if (userImage) {
        contents.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: userImage.split(',')[1],
          },
        });
      }
      contents.push({ text: userMessage || "Hãy phân tích ảnh này và tạo các câu hỏi Quiz phù hợp." });

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts: contents },
        config: {
          systemInstruction: `Bạn là Trợ lý Quiz thông minh của Nguyễn Thiên Minh. 
          Nhiệm vụ:
          1. Giải đáp kiến thức học tập.
          2. Tạo nội dung Quiz (Flashcard, Trắc nghiệm, Đúng/Sai, Tự luận).
          
          KHI NGƯỜI DÙNG YÊU CẦU TẠO QUIZ (hoặc gửi ảnh đề bài):
          Bạn PHẢI trả lời kèm theo một khối JSON hợp lệ nằm giữa dấu [QUIZ_DATA] và [/QUIZ_DATA].
          Cấu trúc JSON là một mảng các đối tượng QuizItem:
          {
            "type": "flashcard" | "multipleChoice" | "trueFalse" | "essay",
            "question": "nội dung câu hỏi",
            "answer": "đáp án đúng",
            "options": ["Lựa chọn A", "Lựa chọn B", "Lựa chọn C", "Lựa chọn D"] (CHỈ dùng cho multipleChoice và trueFalse),
            "isFavorite": false
          }
          Hãy tạo khoảng 3-5 câu hỏi chất lượng dựa trên yêu cầu hoặc hình ảnh. 
          Luôn trả lời bằng tiếng Việt thân thiện.`,
        },
      });

      const aiText = response.text || "";
      
      // Extract Quiz Data
      const quizMatch = aiText.match(/\[QUIZ_DATA\]([\s\S]*?)\[\/QUIZ_DATA\]/);
      if (quizMatch) {
        try {
          const quizJson = JSON.parse(quizMatch[1].trim());
          const quizItems = quizJson.map((item: any) => ({
            ...item,
            id: Math.random().toString(36).substr(2, 9)
          }));
          
          // Dispatch custom event to QuizSystem
          window.dispatchEvent(new CustomEvent('add-quiz-items', { detail: quizItems }));
          
          const cleanText = aiText.replace(/\[QUIZ_DATA\][\s\S]*?\[\/QUIZ_DATA\]/, "✅ Mình đã tạo và thêm các câu hỏi mới vào danh sách học tập của bạn rồi nhé!");
          setMessages(prev => [...prev, { role: 'ai', text: cleanText }]);
        } catch (e) {
          setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
        }
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
      }
    } catch (error) {
      console.error("Quiz AI Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "Hệ thống AI đang bận, Minh thử lại sau nhé!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[380px] md:w-[450px] h-[600px] glass-card rounded-2xl border border-blue-500/30 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300 origin-bottom-right">
          <div className="p-4 border-b border-white/10 bg-blue-600/20 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg shadow-lg shadow-blue-500/20">
                <BrainCircuit size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Quiz Creator AI</h3>
                <p className="text-[10px] text-blue-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  Enhanced with Visual Vision
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-slate-800 text-slate-200 border border-white/5 rounded-tl-none shadow-md'
                }`}>
                  {msg.image && <img src={msg.image} alt="User upload" className="rounded-lg mb-2 max-h-40 object-contain w-full bg-black/20" />}
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none flex items-center gap-2 border border-white/5">
                  <Loader2 size={16} className="animate-spin text-blue-500" />
                  <span className="text-xs text-slate-400">AI đang soạn bài...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-md">
            {selectedImage && (
              <div className="mb-3 relative inline-block group">
                <img src={selectedImage} className="h-16 w-16 object-cover rounded-lg border border-blue-500/50" alt="Preview" />
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-lg group-hover:scale-110 transition-transform"
                >
                  <X size={12} />
                </button>
              </div>
            )}
            <div className="relative flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Yêu cầu tạo Quiz hoặc gửi ảnh..."
                  rows={1}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 pr-10 text-sm text-white focus:outline-none focus:border-blue-500 transition-all resize-none max-h-32"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className={`absolute right-3 bottom-3 transition-colors ${selectedImage ? 'text-blue-500' : 'text-slate-500 hover:text-blue-400'}`}
                >
                  <ImagePlus size={18} />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
              </div>
              <button 
                onClick={handleSend}
                disabled={(!input.trim() && !selectedImage) || isLoading}
                className="p-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white rounded-xl transition-all shadow-lg shadow-blue-600/20"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 group relative ${
          isOpen ? 'bg-slate-800 text-white rotate-90' : 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white border-2 border-white/10'
        }`}
      >
        {isOpen ? <X size={28} /> : (
          <div className="relative">
            <Bot size={28} />
            <Sparkles size={14} className="absolute -top-3 -right-3 text-yellow-400 animate-pulse" />
          </div>
        )}
      </button>
    </div>
  );
};

export default QuizAI;