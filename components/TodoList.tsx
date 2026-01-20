import React, { useState, useEffect } from 'react';
import { Plus, Trash2, RotateCcw, CheckSquare, Square, RefreshCw } from 'lucide-react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Todo[]>(() => {
    // Load from local storage on initial render
    const saved = localStorage.getItem('portfolio-todos');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: 'Luyện tập Piano bài mới', completed: false },
      { id: 2, text: 'Giải 5 bài toán nâng cao', completed: true },
    ];
  });
  const [inputValue, setInputValue] = useState('');

  // Save to local storage whenever tasks change
  useEffect(() => {
    localStorage.setItem('portfolio-todos', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (inputValue.trim() === '') return;
    const newTask: Todo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') addTask();
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const resetAll = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hết toàn bộ danh sách không?')) {
      setTasks([]);
    }
  };

  const uncheckAll = () => {
    setTasks(tasks.map(task => ({ ...task, completed: false })));
  };

  return (
    <section className="py-20 border-t border-white/5" id="todo">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Interactive <span className="gradient-text">To-Do List</span>
          </h2>
          <p className="text-slate-400">
            Một ứng dụng nhỏ để quản lý các mục tiêu hàng ngày của tôi.
          </p>
        </div>

        <div className="glass-card p-6 md:p-8 rounded-2xl shadow-2xl shadow-blue-900/10">
          {/* Input Area */}
          <div className="flex gap-3 mb-8">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Thêm công việc mới..."
              className="flex-1 bg-slate-800/50 border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-500"
            />
            <button
              onClick={addTask}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>

          {/* List Area */}
          <div className="space-y-3 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {tasks.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <p>Danh sách trống. Hãy thêm mục tiêu mới!</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                    task.completed
                      ? 'bg-slate-800/30 border-slate-800 opacity-70'
                      : 'bg-slate-800/80 border-slate-700 hover:border-blue-500/50'
                  }`}
                >
                  <div 
                    className="flex items-center gap-4 flex-1 cursor-pointer" 
                    onClick={() => toggleTask(task.id)}
                  >
                    <div className={`transition-colors ${task.completed ? 'text-green-500' : 'text-slate-400 group-hover:text-blue-400'}`}>
                      {task.completed ? <CheckSquare size={24} /> : <Square size={24} />}
                    </div>
                    <span className={`text-lg transition-all ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {task.text}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    title="Xóa công việc này"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Controls Footer */}
          {tasks.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
              <button
                onClick={uncheckAll}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors text-sm font-medium"
              >
                <RefreshCw size={16} />
                Uncheck All (Bỏ tích hết)
              </button>
              
              <button
                onClick={resetAll}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-red-900/30 text-red-400 hover:bg-red-900/20 transition-colors text-sm font-medium"
              >
                <RotateCcw size={16} />
                Reset List (Xóa hết)
              </button>
            </div>
          )}
          
          <div className="mt-4 text-center">
             <p className="text-xs text-slate-500">
               * Dữ liệu được lưu tự động trên trình duyệt của bạn.
             </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TodoList;