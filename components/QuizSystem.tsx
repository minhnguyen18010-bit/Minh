import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Star, BookOpen, Layers, X, ChevronLeft, ChevronRight, Rotate3d, Heart, CheckCircle2, Circle, HelpCircle, FileText, Send } from 'lucide-react';

export type QuizType = 'flashcard' | 'multipleChoice' | 'trueFalse' | 'essay';

export interface QuizItem {
  id: string;
  type: QuizType;
  question: string;
  answer: string;
  options?: string[]; // For multiple choice
  isFavorite: boolean;
}

const QuizSystem: React.FC = () => {
  const [items, setItems] = useState<QuizItem[]>(() => {
    const saved = localStorage.getItem('portfolio-quiz-items');
    return saved ? JSON.parse(saved) : [
      { id: '1', type: 'flashcard', question: 'Innovation', answer: 'Sự đổi mới, sáng tạo', isFavorite: true },
      { id: '2', type: 'multipleChoice', question: 'Thủ đô của Việt Nam là gì?', answer: 'Hà Nội', options: ['Hà Nội', 'TP. HCM', 'Đà Nẵng', 'Huế'], isFavorite: false },
      { id: '3', type: 'trueFalse', question: 'React là một Framework?', answer: 'False', options: ['True', 'False'], isFavorite: false }
    ];
  });

  const [isStudyMode, setIsStudyMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  
  // Create Form State
  const [newType, setNewType] = useState<QuizType>('flashcard');
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);

  useEffect(() => {
    localStorage.setItem('portfolio-quiz-items', JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    const newItem: QuizItem = {
      id: Date.now().toString(),
      type: newType,
      question: newQuestion,
      answer: newAnswer,
      options: newType === 'multipleChoice' ? newOptions : newType === 'trueFalse' ? ['True', 'False'] : undefined,
      isFavorite: false
    };
    setItems([newItem, ...items]);
    resetForm();
  };

  const resetForm = () => {
    setNewQuestion('');
    setNewAnswer('');
    setNewOptions(['', '', '', '']);
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, isFavorite: !i.isFavorite } : i));
  };

  const filteredItems = showOnlyFavorites ? items.filter(i => i.isFavorite) : items;

  const nextItem = () => {
    setIsFlipped(false);
    setShowResult(false);
    setUserAnswer('');
    setCurrentIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const prevItem = () => {
    setIsFlipped(false);
    setShowResult(false);
    setUserAnswer('');
    setCurrentIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  const checkAnswer = (ans: string) => {
    setUserAnswer(ans);
    setShowResult(true);
  };

  const renderStudyContent = () => {
    const item = filteredItems[currentIndex];
    if (!item) return null;

    switch (item.type) {
      case 'flashcard':
        return (
          <div className="w-full max-w-lg aspect-[4/3] perspective-1000 cursor-pointer mx-auto" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`flip-card-inner w-full h-full ${isFlipped ? 'flipped' : ''}`}>
              <div className="flip-card-front glass-card border-2 border-white/10 p-12 shadow-2xl">
                <h3 className="text-4xl font-bold text-center text-white">{item.question}</h3>
                <div className="absolute bottom-6 flex items-center gap-2 text-slate-500 text-sm">
                  <Rotate3d size={16} /> Nhấp để lật
                </div>
              </div>
              <div className="flip-card-back bg-blue-600 p-12 shadow-2xl rounded-2xl border-2 border-blue-400">
                <h3 className="text-3xl font-medium text-center text-white leading-relaxed">{item.answer}</h3>
              </div>
            </div>
          </div>
        );
      case 'multipleChoice':
      case 'trueFalse':
        return (
          <div className="w-full max-w-2xl mx-auto space-y-6">
            <div className="glass-card p-8 rounded-2xl border-white/10 mb-8">
               <h3 className="text-2xl font-bold text-center text-white">{item.question}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {item.options?.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => checkAnswer(opt)}
                  disabled={showResult}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    showResult 
                      ? opt === item.answer 
                        ? 'bg-green-500/20 border-green-500 text-green-400' 
                        : opt === userAnswer ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-slate-800 border-slate-700 opacity-50'
                      : 'bg-slate-800 border-slate-700 hover:border-blue-500 hover:bg-slate-700'
                  }`}
                >
                  <span className="font-bold mr-3 text-blue-500">{String.fromCharCode(65 + i)}.</span> {opt}
                </button>
              ))}
            </div>
            {showResult && (
              <div className={`p-4 rounded-xl text-center font-bold animate-in fade-in slide-in-from-bottom-2 ${userAnswer === item.answer ? 'text-green-400' : 'text-red-400'}`}>
                {userAnswer === item.answer ? 'Chính xác! Cố gắng phát huy.' : `Sai rồi! Đáp án đúng là: ${item.answer}`}
              </div>
            )}
          </div>
        );
      case 'essay':
        return (
          <div className="w-full max-w-2xl mx-auto space-y-6">
            <div className="glass-card p-8 rounded-2xl border-white/10">
               <h3 className="text-2xl font-bold text-center text-white mb-6">{item.question}</h3>
               <textarea 
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  disabled={showResult}
                  placeholder="Nhập câu trả lời của bạn vào đây..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 h-40"
               />
               <button 
                  onClick={() => setShowResult(true)}
                  className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all disabled:opacity-50"
                  disabled={showResult || !userAnswer.trim()}
               >
                  Kiểm tra đáp án
               </button>
            </div>
            {showResult && (
               <div className="glass-card p-6 rounded-2xl border-green-500/30 bg-green-500/5 animate-in fade-in">
                  <h4 className="text-green-400 font-bold mb-2 flex items-center gap-2"><CheckCircle2 size={18} /> Đáp án mẫu:</h4>
                  <p className="text-slate-300 italic">{item.answer}</p>
               </div>
            )}
          </div>
        );
    }
  };

  return (
    <section className="py-20 border-t border-white/5" id="flashcards">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
              <Layers className="text-blue-500" />
              Smart <span className="gradient-text">Quiz System</span>
            </h2>
            <p className="text-slate-400">Luyện tập đa chế độ: Flashcard, Trắc nghiệm, Đúng/Sai & Tự luận.</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${showOnlyFavorites ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
            >
              <Star size={18} fill={showOnlyFavorites ? "currentColor" : "none"} />
              Starred
            </button>
            <button 
              onClick={() => { if(filteredItems.length > 0) setIsStudyMode(true); }}
              disabled={filteredItems.length === 0}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
            >
              <BookOpen size={18} />
              Bắt đầu học
            </button>
          </div>
        </div>

        {isStudyMode ? (
          <div className="fixed inset-0 z-[60] bg-background/98 backdrop-blur-2xl flex flex-col items-center justify-center p-6 overflow-y-auto">
            <button 
              onClick={() => { setIsStudyMode(false); setIsFlipped(false); setShowResult(false); setUserAnswer(''); }}
              className="absolute top-8 right-8 p-3 text-slate-400 hover:text-white transition-colors"
            >
              <X size={32} />
            </button>

            <div className="w-full max-w-xl text-center mb-8">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-mono uppercase tracking-widest border border-blue-500/30">
                Mode: {filteredItems[currentIndex].type}
              </span>
              <p className="text-slate-500 mt-2 font-mono text-sm">Question {currentIndex + 1} of {filteredItems.length}</p>
            </div>

            <div className="w-full">
              {renderStudyContent()}
            </div>

            <div className="flex gap-8 mt-12">
              <button onClick={prevItem} className="p-4 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-all shadow-xl">
                <ChevronLeft size={32} />
              </button>
              <button onClick={nextItem} className="p-4 rounded-full bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20">
                <ChevronRight size={32} />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="glass-card p-6 rounded-2xl sticky top-24 border-blue-500/20">
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
                  {(['flashcard', 'multipleChoice', 'trueFalse', 'essay'] as QuizType[]).map(type => (
                    <button 
                      key={type}
                      onClick={() => setNewType(type)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${newType === type ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                    >
                      {type === 'flashcard' && 'Flashcard'}
                      {type === 'multipleChoice' && 'MCQ'}
                      {type === 'trueFalse' && 'T/F'}
                      {type === 'essay' && 'Essay'}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-2 uppercase">Câu hỏi</label>
                    <textarea 
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="Nhập nội dung câu hỏi..."
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {newType === 'multipleChoice' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-mono text-slate-500 mb-2 uppercase">Lựa chọn (Option A-D)</label>
                      {newOptions.map((opt, i) => (
                        <input 
                          key={i}
                          type="text" 
                          value={opt}
                          onChange={(e) => {
                            const updated = [...newOptions];
                            updated[i] = e.target.value;
                            setNewOptions(updated);
                          }}
                          placeholder={`Lựa chọn ${i + 1}...`}
                          className="w-full bg-slate-800/30 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                        />
                      ))}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-2 uppercase">
                      {newType === 'essay' ? 'Gợi ý đáp án' : 'Đáp án đúng'}
                    </label>
                    {newType === 'trueFalse' ? (
                      <div className="flex gap-2">
                        {['True', 'False'].map(val => (
                          <button 
                            key={val}
                            onClick={() => setNewAnswer(val)}
                            className={`flex-1 py-2 rounded-lg border transition-all ${newAnswer === val ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <input 
                        type="text" 
                        value={newAnswer}
                        onChange={(e) => setNewAnswer(e.target.value)}
                        placeholder={newType === 'multipleChoice' ? 'Nhập chính xác 1 trong các lựa chọn trên' : 'Nhập đáp án...'}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                      />
                    )}
                  </div>

                  <button 
                    onClick={addItem}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all mt-4 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                  >
                    <Plus size={18} /> Lưu Quiz
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredItems.length === 0 ? (
                <div className="text-center py-20 bg-white/[0.02] rounded-2xl border border-dashed border-slate-700">
                  <p className="text-slate-500 italic">Danh sách trống. Hãy thêm các câu hỏi trắc nghiệm hoặc flashcard ở bên trái!</p>
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div key={item.id} className="glass-card p-5 rounded-xl border border-white/5 hover:border-white/10 transition-all flex justify-between items-center group">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="px-2 py-0.5 bg-slate-800 text-[10px] rounded uppercase font-bold text-slate-500 border border-slate-700">
                          {item.type}
                        </span>
                        <span className="text-white font-bold truncate block">{item.question}</span>
                        {item.isFavorite && <Heart size={14} fill="#EF4444" className="text-red-500 shrink-0" />}
                      </div>
                      <p className="text-slate-500 text-sm truncate">Ans: {item.answer}</p>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <button 
                        onClick={() => toggleFavorite(item.id)}
                        className={`p-2 rounded-lg transition-colors ${item.isFavorite ? 'text-yellow-500 bg-yellow-500/10' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                      >
                        <Star size={18} fill={item.isFavorite ? "currentColor" : "none"} />
                      </button>
                      <button 
                        onClick={() => deleteItem(item.id)}
                        className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default QuizSystem;