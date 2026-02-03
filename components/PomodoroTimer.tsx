import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer, Brain, Coffee, Settings, Check } from 'lucide-react';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

interface ModeSettings {
  work: number;
  shortBreak: number;
  longBreak: number;
}

const PomodoroTimer: React.FC = () => {
  const [settings, setSettings] = useState<ModeSettings>({
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  });

  const [timeLeft, setTimeLeft] = useState(settings.work);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<TimerMode>('work');
  const [completedCycles, setCompletedCycles] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Audio ref
  const audioContextRef = useRef<AudioContext | null>(null);

  const presets = [
    { name: 'Classic (25/5)', work: 25, short: 5, long: 15 },
    { name: 'Deep Work (50/10)', work: 50, short: 10, long: 20 },
    { name: 'Rapid (15/3)', work: 15, short: 3, long: 10 },
  ];

  const applyPreset = (p: typeof presets[0]) => {
    const newSettings = {
      work: p.work * 60,
      shortBreak: p.short * 60,
      longBreak: p.long * 60
    };
    setSettings(newSettings);
    if (!isActive) setTimeLeft(mode === 'work' ? newSettings.work : (mode === 'shortBreak' ? newSettings.shortBreak : newSettings.longBreak));
  };

  const handleCustomChange = (m: keyof ModeSettings, value: string) => {
    const mins = parseInt(value) || 0;
    const newSettings = { ...settings, [m]: mins * 60 };
    setSettings(newSettings);
  };

  const playNotificationSound = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);
    oscillator.stop(ctx.currentTime + 0.5);
  };

  useEffect(() => {
    let interval: number | undefined;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      playNotificationSound();
      setIsActive(false);
      handleTimerComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    if (mode === 'work') {
      const newCycles = completedCycles + 1;
      setCompletedCycles(newCycles);
      if (newCycles % 4 === 0) {
        setMode('longBreak');
        setTimeLeft(settings.longBreak);
      } else {
        setMode('shortBreak');
        setTimeLeft(settings.shortBreak);
      }
    } else {
      setMode('work');
      setTimeLeft(settings.work);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
    if (audioContextRef.current?.state === 'suspended') audioContextRef.current.resume();
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(settings[mode]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const total = settings[mode];
    return ((total - timeLeft) / total) * 100;
  };

  return (
    <section className="py-20 border-t border-white/5" id="pomodoro">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-mono mb-6">
               <span className="relative flex h-2 w-2">
                  <span className={`absolute inline-flex h-full w-full rounded-full bg-red-400 ${isActive ? 'animate-ping' : ''}`}></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
               </span>
               Strict Mode Active
            </div>
            
            <h2 className="text-3xl font-bold mb-4">
              Deep Work <span className="gradient-text">Pomodoro</span>
            </h2>
            
            <div className="space-y-6 mb-8">
              <p className="text-slate-400 leading-relaxed">
                Tùy chỉnh thời gian học tập của bạn để tương thích tốt nhất với bộ Flashcards.
              </p>
              
              <div className="flex flex-wrap gap-2">
                {presets.map((p) => (
                  <button 
                    key={p.name}
                    onClick={() => applyPreset(p)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-700 transition-colors"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 flex-1">
                <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Sessions</div>
                <div className="text-2xl font-bold text-white">{completedCycles}</div>
              </div>
              <button 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`p-4 rounded-xl border flex-1 transition-all flex items-center justify-center gap-2 ${isSettingsOpen ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-800/50 border-slate-700 text-slate-400'}`}
              >
                <Settings size={20} />
                Custom Time
              </button>
            </div>

            {isSettingsOpen && (
              <div className="mt-6 p-6 glass-card rounded-2xl border-blue-500/20 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-mono mb-1 block">Work</label>
                    <input 
                      type="number" 
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white" 
                      value={settings.work / 60}
                      onChange={(e) => handleCustomChange('work', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-mono mb-1 block">Short</label>
                    <input 
                      type="number" 
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white" 
                      value={settings.shortBreak / 60}
                      onChange={(e) => handleCustomChange('shortBreak', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-mono mb-1 block">Long</label>
                    <input 
                      type="number" 
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white" 
                      value={settings.longBreak / 60}
                      onChange={(e) => handleCustomChange('longBreak', e.target.value)}
                    />
                  </div>
                </div>
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="w-full py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg text-sm hover:bg-blue-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Check size={16} /> Lưu cài đặt
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <div className="glass-card p-8 rounded-3xl w-full max-w-sm relative shadow-2xl shadow-red-900/10 border-white/5 hover:border-white/10 transition-all">
              <div className="text-center mb-8">
                <div className={`flex items-center justify-center gap-2 text-xl font-bold uppercase tracking-widest ${mode === 'work' ? 'text-red-400' : 'text-green-400'}`}>
                  {mode === 'work' ? <Brain size={24} /> : <Coffee size={24} />}
                  {mode === 'work' ? 'Focus Time' : 'Break Time'}
                </div>
              </div>

              <div className="relative w-64 h-64 mx-auto mb-8">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="128" cy="128" r="120" stroke="#1e293b" strokeWidth="8" fill="none" />
                  <circle
                    cx="128" cy="128" r="120"
                    stroke={mode === 'work' ? '#F87171' : '#4ADE80'}
                    strokeWidth="8" fill="none"
                    strokeDasharray={2 * Math.PI * 120}
                    strokeDashoffset={2 * Math.PI * 120 * (1 - getProgress() / 100)}
                    className="transition-all duration-1000 ease-linear"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                  <span className="text-6xl font-mono font-bold text-white tracking-tighter">{formatTime(timeLeft)}</span>
                  <span className="text-slate-500 text-sm mt-2 font-medium">{isActive ? 'Running...' : 'Paused'}</span>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={toggleTimer}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-slate-700 text-slate-300' : 'bg-white text-black hover:scale-105'}`}
                >
                  {isActive ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                </button>
                <button onClick={resetTimer} className="w-16 h-16 rounded-full flex items-center justify-center bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-all">
                  <RotateCcw size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PomodoroTimer;