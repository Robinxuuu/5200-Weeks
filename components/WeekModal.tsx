
import React, { useState } from 'react';
import { WeekData, MoodType } from '../types';

interface WeekModalProps {
  weekId: string;
  data?: WeekData;
  onSave: (data: WeekData) => void;
  onClose: () => void;
  year: number;
  weekIndex: number;
}

const WeekModal: React.FC<WeekModalProps> = ({ weekId, data, onSave, onClose, year, weekIndex }) => {
  const [note, setNote] = useState(data?.note || '');
  const [mood, setMood] = useState<MoodType>(data?.mood || MoodType.NEUTRAL);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: weekId,
      note,
      mood,
      timestamp: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
          <div>
            <h3 className="text-xl font-bold text-zinc-800">第 {year} 年，第 {weekIndex + 1} 周</h3>
            <p className="text-sm text-zinc-500">{weekId}</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-zinc-700">这周过得怎么样？</label>
            <div className="flex gap-4">
              {[
                { type: MoodType.HAPPY, label: '顺遂/开心', color: 'bg-yellow-300' },
                { type: MoodType.NEUTRAL, label: '平静/日常', color: 'bg-blue-100' },
                { type: MoodType.TOUGH, label: '艰难/挑战', color: 'bg-zinc-400' }
              ].map((m) => (
                <button
                  key={m.type}
                  type="button"
                  onClick={() => setMood(m.type)}
                  className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    mood === m.type ? 'border-indigo-500 bg-indigo-50/30' : 'border-transparent bg-zinc-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full ${m.color}`} />
                  <span className="text-xs font-medium">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-zinc-700">记录些什么吧...</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="这周发生了什么让你难忘的事？有什么想对自己说的？"
              className="w-full h-32 p-4 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all placeholder:text-zinc-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-zinc-900 text-white rounded-xl font-semibold hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-200"
          >
            保存这段记忆
          </button>
        </form>
      </div>
    </div>
  );
};

export default WeekModal;
