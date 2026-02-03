import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Star, BookOpen, Layers, X, ChevronLeft, ChevronRight, Rotate3d, Heart } from 'lucide-react';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  isFavorite: boolean;
}

const Flashcards: React.FC = () => {
  const [cards, setCards] = useState<Flashcard[]>(() => {
    const saved = localStorage.getItem('portfolio-flashcards');
    return saved ? JSON.parse(saved) : [
      { id: '1', front: 'Commitment', back: 'Sự cam kết / Tận tụy', isFavorite: true },
      { id: '2', front: 'React Component', back: 'Một khối mã độc lập, có thể tái sử dụng để xây dựng UI.', isFavorite: false }
    ];
  });

  const [isStudyMode, setIsStudyMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');

  useEffect(() => {
    localStorage.setItem('portfolio-flashcards', JSON.stringify(cards));
  }, [cards]);

  const addCard = () => {
    if (!newFront.trim() || !newBack.trim()) return;
    const newCard: Flashcard = {
      id: Date.now().toString(),
      front: newFront,
      back: newBack,
      isFavorite: false
    };
    setCards([newCard, ...cards]);
    setNewFront('');
    setNewBack('');
  };

  const deleteCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setCards(cards.map(c => c.id === id ? { ...c, isFavorite: !c.isFavorite } : c));
  };

  const filteredCards = showOnlyFavorites ? cards.filter(c => c.isFavorite) : cards;

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
    }, 150);
  };

  return (
    <section className="py-20 border-t border-white/5" id="flashcards">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
              <Layers className="text-blue-500" />
              Smart <span className="gradient-text">Flashcards</span>
            </h2>
            <p className="text-slate-400">Học từ vựng và kiến thức hiệu quả bằng phương pháp lặp lại ngắt quãng.</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${showOnlyFavorites ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
            >
              <Star size={18} fill={showOnlyFavorites ? "currentColor" : "none"} />
              Thường dùng
            </button>
            <button 
              onClick={() => { if(filteredCards.length > 0) setIsStudyMode(true); }}
              disabled={filteredCards.length === 0}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
            >
              <BookOpen size={18} />
              Bật chế độ học
            </button>
          </div>
        </div>

        {isStudyMode ? (
          /* STUDY MODE UI */
          <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center p-6">
            <button 
              onClick={() => { setIsStudyMode(false); setIsFlipped(false); }}
              className="absolute top-8 right-8 p-3 text-slate-400 hover:text-white transition-colors"
            >
              <X size={32} />
            </button>

            <div className="w-full max-w-xl text-center mb-8">
              <span className="text-blue-500 font-mono text-sm uppercase tracking-widest">
                Card {currentIndex + 1} of {filteredCards.length}
              </span>
            </div>

            <div className="w-full max-w-lg aspect-[4/3] perspective-1000 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
              <div className={`flip-card-inner w-full h-full ${isFlipped ? 'flipped' : ''}`}>
                {/* Front */}
                <div className="flip-card-front glass-card border-2 border-white/10 p-12 shadow-2xl">
                  <h3 className="text-4xl font-bold text-center text-white">{filteredCards[currentIndex].front}</h3>
                  <div className="absolute bottom-6 flex items-center gap-2 text-slate-500 text-sm">
                    <Rotate3d size={16} /> Click to flip
                  </div>
                </div>
                {/* Back */}
                <div className="flip-card-back bg-blue-600 p-12 shadow-2xl rounded-2xl border-2 border-blue-400">
                  <h3 className="text-3xl font-medium text-center text-white leading-relaxed">{filteredCards[currentIndex].back}</h3>
                  <div className="absolute bottom-6 text-blue-200 text-sm">Click to flip back</div>
                </div>
              </div>
            </div>

            <div className="flex gap-8 mt-12">
              <button onClick={prevCard} className="p-4 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-all">
                <ChevronLeft size={32} />
              </button>
              <button onClick={nextCard} className="p-4 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-all">
                <ChevronRight size={32} />
              </button>
            </div>
          </div>
        ) : (
          /* MANAGEMENT UI */
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Create Card Form */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 rounded-2xl sticky top-24 border-blue-500/20">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Plus size={20} className="text-blue-500" /> Tạo Card mới
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-2 uppercase">Mặt trước (Câu hỏi/Từ vựng)</label>
                    <input 
                      type="text" 
                      value={newFront}
                      onChange={(e) => setNewFront(e.target.value)}
                      placeholder="VD: Innovation"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-2 uppercase">Mặt sau (Đáp án/Định nghĩa)</label>
                    <textarea 
                      value={newBack}
                      onChange={(e) => setNewBack(e.target.value)}
                      placeholder="VD: Sự đổi mới, sáng tạo"
                      rows={3}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <button 
                    onClick={addCard}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all"
                  >
                    Thêm vào bộ sưu tập
                  </button>
                </div>
              </div>
            </div>

            {/* Cards List */}
            <div className="lg:col-span-2 space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredCards.length === 0 ? (
                <div className="text-center py-20 bg-white/[0.02] rounded-2xl border border-dashed border-slate-700">
                  <p className="text-slate-500 italic">Chưa có thẻ nào trong danh sách này.</p>
                </div>
              ) : (
                filteredCards.map((card) => (
                  <div key={card.id} className="glass-card p-5 rounded-xl border border-white/5 hover:border-white/10 transition-all flex justify-between items-center group">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-white font-bold">{card.front}</span>
                        {card.isFavorite && <Heart size={14} fill="#EF4444" className="text-red-500" />}
                      </div>
                      <p className="text-slate-400 text-sm truncate max-w-md">{card.back}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => toggleFavorite(card.id)}
                        className={`p-2 rounded-lg transition-colors ${card.isFavorite ? 'text-yellow-500 bg-yellow-500/10' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                      >
                        <Star size={18} fill={card.isFavorite ? "currentColor" : "none"} />
                      </button>
                      <button 
                        onClick={() => deleteCard(card.id)}
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

export default Flashcards;