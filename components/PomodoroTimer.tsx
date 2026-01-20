import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer, Brain, Coffee } from 'lucide-react';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

const WORK_TIME = 25 * 60; // 25 minutes
const SHORT_BREAK = 5 * 60; // 5 minutes
const LONG_BREAK = 15 * 60; // 15 minutes
const CYCLES_BEFORE_LONG_BREAK = 4;

const PomodoroTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<TimerMode>('work');
  const [completedCycles, setCompletedCycles] = useState(0);
  
  // Audio ref for notification beep
  const audioContextRef = useRef<AudioContext | null>(null);

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
    oscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);
    oscillator.stop(ctx.currentTime + 0.5);
  };

  useEffect(() => {
    let interval: number | undefined;

    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer finished
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
      
      if (newCycles % CYCLES_BEFORE_LONG_BREAK === 0) {
        setMode('longBreak');
        setTimeLeft(LONG_BREAK);
      } else {
        setMode('shortBreak');
        setTimeLeft(SHORT_BREAK);
      }
    } else {
      // Break is over, back to work
      setMode('work');
      setTimeLeft(WORK_TIME);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
    // Resume audio context if needed (browser policy)
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    // Strict mode: Resetting only restarts the CURRENT phase, doesn't skip it.
    if (mode === 'work') setTimeLeft(WORK_TIME);
    else if (mode === 'shortBreak') setTimeLeft(SHORT_BREAK);
    else setTimeLeft(LONG_BREAK);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const total = mode === 'work' ? WORK_TIME : (mode === 'shortBreak' ? SHORT_BREAK : LONG_BREAK);
    return ((total - timeLeft) / total) * 100;
  };

  const getStatusColor = () => {
    if (mode === 'work') return 'text-red-400';
    if (mode === 'shortBreak') return 'text-green-400';
    return 'text-blue-400';
  };

  const getRingColor = () => {
     if (mode === 'work') return '#F87171'; // red-400
     if (mode === 'shortBreak') return '#4ADE80'; // green-400
     return '#60A5FA'; // blue-400
  };

  return (
    <section className="py-20 border-t border-white/5" id="pomodoro">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left: Info & Stats */}
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
            <p className="text-slate-400 mb-8 leading-relaxed">
              Kỹ thuật quản lý thời gian không thể bỏ qua (Non-skippable). 
              Bạn phải hoàn thành chu trình làm việc để mở khóa thời gian nghỉ.
            </p>

            <div className="flex gap-4">
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 flex-1">
                <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Sessions</div>
                <div className="text-2xl font-bold text-white">{completedCycles}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 flex-1">
                <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Next Long Break</div>
                <div className="text-2xl font-bold text-white">
                  {CYCLES_BEFORE_LONG_BREAK - (completedCycles % CYCLES_BEFORE_LONG_BREAK)} <span className="text-sm font-normal text-slate-500">sessions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: The Timer UI */}
          <div className="flex justify-center">
            <div className="glass-card p-8 rounded-3xl w-full max-w-sm relative shadow-2xl shadow-red-900/10">
              
              {/* Status Header */}
              <div className="text-center mb-8">
                <div className={`flex items-center justify-center gap-2 text-xl font-bold ${getStatusColor()} uppercase tracking-widest`}>
                  {mode === 'work' ? <Brain size={24} /> : <Coffee size={24} />}
                  {mode === 'work' ? 'Focus Time' : (mode === 'shortBreak' ? 'Short Break' : 'Long Break')}
                </div>
              </div>

              {/* Circular Timer Display */}
              <div className="relative w-64 h-64 mx-auto mb-8">
                {/* SVG Ring */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="#1e293b"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke={getRingColor()}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={2 * Math.PI * 120}
                    strokeDashoffset={2 * Math.PI * 120 * (1 - getProgress() / 100)}
                    className="transition-all duration-1000 ease-linear"
                    strokeLinecap="round"
                  />
                </svg>
                
                {/* Time Text */}
                <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                  <span className="text-6xl font-mono font-bold text-white tracking-tighter">
                    {formatTime(timeLeft)}
                  </span>
                  <span className="text-slate-500 text-sm mt-2 font-medium">
                    {isActive ? 'Running...' : 'Paused'}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={toggleTimer}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    isActive 
                      ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                      : 'bg-white text-black hover:scale-105 hover:shadow-lg hover:shadow-white/20'
                  }`}
                >
                  {isActive ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                </button>
                
                <button
                  onClick={resetTimer}
                  className="w-16 h-16 rounded-full flex items-center justify-center bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all"
                  title="Reset (Restart current phase)"
                >
                  <RotateCcw size={24} />
                </button>
              </div>

              <div className="mt-6 text-center">
                 <p className="text-xs text-slate-500/60 font-mono">
                   NO SKIPPING ALLOWED • STRICT WORKFLOW
                 </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PomodoroTimer;