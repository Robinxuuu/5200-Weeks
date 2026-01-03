
import React, { useState } from 'react';
import { Milestone } from '../types';

interface MilestonesProps {
  milestones: Milestone[];
  onAdd: (m: Milestone) => void;
  onDelete: (id: string) => void;
}

const Milestones: React.FC<MilestonesProps> = ({ milestones, onAdd, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [label, setLabel] = useState('');
  const [date, setDate] = useState('');

  const handleAdd = () => {
    if (label && date) {
      onAdd({
        id: Math.random().toString(36).substr(2, 9),
        label,
        startDate: date
      });
      setLabel('');
      setDate('');
      setIsAdding(false);
    }
  };

  const calculateDays = (startDate: string) => {
    const diff = new Date().getTime() - new Date(startDate).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100 mb-12">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold text-zinc-800">特别的记录</h3>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="p-2 bg-zinc-900 text-white rounded-full hover:scale-110 transition-transform"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      {isAdding && (
        <div className="mb-8 p-4 bg-zinc-50 rounded-2xl flex flex-wrap gap-4 items-end animate-in slide-in-from-top-2 duration-300">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">标签</label>
            <input 
              type="text" 
              value={label} 
              onChange={(e) => setLabel(e.target.value)}
              placeholder="例如：第一只猫、恋爱开始..."
              className="w-full p-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">起始日期</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <button 
            onClick={handleAdd}
            className="px-6 py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800"
          >
            添加
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {milestones.length === 0 && !isAdding && (
          <p className="col-span-full text-center text-zinc-400 py-8 italic">还没有特别记录。点击上方 + 号添加属于你的重要时刻。</p>
        )}
        {milestones.map(m => (
          <div key={m.id} className="group relative bg-zinc-50 p-6 rounded-2xl hover:bg-indigo-50 transition-colors">
            <button 
              onClick={() => onDelete(m.id)}
              className="absolute top-2 right-2 p-1 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <div className="text-3xl font-bold text-zinc-900 mb-1">{calculateDays(m.startDate)} <span className="text-sm font-normal text-zinc-500">天</span></div>
            <div className="text-sm font-medium text-zinc-600">{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Milestones;
