import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Bot, Loader2, Sparkles, ImagePlus, BrainCircuit } from 'lucide-react';
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
    { role: 'ai', text: 'Chào Thiên Minh! Mình đã sẵn sàng. Bạn có thể yêu cầu tạo Quiz (ví dụ: "Tạo 15 câu trắc nghiệm KHTN 8 bài 1") hoặc gửi ảnh đề bài để mình nạp vào app nhé!' }
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
      
      const parts: any[] = [];
      if (userImage) {
        parts.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: userImage.split(',')[1],
          },
        });
      }
      parts.push({ text: userMessage || "Phân tích nội dung và tạo quiz phù hợp." });

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', // Sử dụng bản Pro để xử lý logic phức tạp/số lượng lớn
        contents: { parts },
        config: {
          systemInstruction: `Bạn là Trợ lý Quiz thông minh của Nguyễn Thiên Minh. 
          Nhiệm vụ: Phân tích yêu cầu và tạo danh sách câu hỏi Quiz (Flashcard, Trắc nghiệm, Đúng/Sai, Tự luận).
          - Nếu người dùng yêu cầu số lượng câu cụ thể (ví dụ 15 câu), hãy cố gắng đáp ứng đủ.
          - Nội dung phải chính xác theo chương trình giáo dục Việt Nam (KHTN, Toán, Lý, Hóa...).
          - Trả về danh sách câu hỏi dưới dạng mảng JSON.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              explanation: { 
                type: Type.STRING, 
                description: "Lời nhắn thân thiện bằng tiếng Việt cho người dùng về bộ Quiz vừa tạo." 
              },
              quizItems: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    type: { 
                      type: Type.STRING, 
                      description: "Loại câu hỏi: flashcard, multipleChoice, trueFalse, hoặc essay" 
                    },
                    question: { type: Type.STRING },
                    answer: { type: Type.STRING },
                    options: { 
                      type: Type.ARRAY, 
                      items: { type: Type.STRING },
                      description: "Chỉ cung cấp cho multipleChoice (4 lựa chọn) hoặc trueFalse (True/False)"
                    }
                  },
                  required: ["type", "question", "answer"]
                }
              }
            },
            required: ["explanation", "quizItems"]
          }
        },
      });

      const result = JSON.parse(response.text);
      
      if (result.quizItems && result.quizItems.length > 0) {
        const formattedItems = result.quizItems.map((item: any) => ({
          ...item,
          id: Math.random().toString(36).substr(2, 9),
          isFavorite: false
        }));

        // Gửi sự kiện nạp vào QuizSystem
        window.dispatchEvent(new CustomEvent('add-quiz-items', { detail: formattedItems }));
        
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: result.explanation + `\n\n✅ Đã nạp thành công ${formattedItems.length} câu hỏi vào danh sách của bạn!` 
        }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: result.explanation || "Mình đã tìm hiểu nhưng chưa tạo được câu hỏi phù hợp. Bạn thử yêu cầu khác nhé!" }]);
      }

    } catch (error) {
      console.error("Quiz AI Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "Hệ thống AI gặp lỗi kết nối. Minh hãy kiểm tra lại yêu cầu hoặc thử lại sau nhé!" }]);
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
                <h3 className="text-white font-bold text-sm">Quiz Creator AI (Pro)</h3>
                <p className="text-[10px] text-blue-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  Enhanced Reasoning & Logic
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
                  : 'bg-slate-800 text-slate-200 border border-white/5 rounded-tl-none shadow-md whitespace-pre-wrap'
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
                  <span className="text-xs text-slate-400">AI đang soạn bài (có thể mất 10-20s)...</span>
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
                  placeholder="Ví dụ: Tạo 15 câu trắc nghiệm KHTN 8..."
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