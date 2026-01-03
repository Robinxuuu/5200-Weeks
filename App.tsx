
import React, { useState, useEffect, useMemo } from 'react';
import { AppState, WeekData, MoodType, Milestone } from './types';
import { MAX_YEARS, WEEKS_PER_YEAR, MOOD_COLORS } from './constants';
import StatsHeader from './components/StatsHeader';
import WeekModal from './components/WeekModal';
import Milestones from './components/Milestones';
import { generateNarrativeInsight } from './services/geminiService';

const STORAGE_KEY = 'life_narrative_v1';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { profile: null, weeks: {}, milestones: [] };
  });

  const [selectedWeek, setSelectedWeek] = useState<{id: string, year: number, week: number} | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const handleDobSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const dob = formData.get('dob') as string;
    const name = formData.get('name') as string;
    if (dob) {
      setState(prev => ({ ...prev, profile: { dob, name } }));
    }
  };

  const handleReset = () => {
    if (confirm('即将重启人生，请确认安全带已系好。此操作将清空所有现有记录且不可撤销。')) {
      localStorage.removeItem(STORAGE_KEY);
      setState({ profile: null, weeks: {}, milestones: [] });
      setAiInsight(null);
    }
  };

  const lifeStats = useMemo(() => {
    if (!state.profile) return null;
    const dob = new Date(state.profile.dob);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - dob.getTime());
    const daysLived = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weeksLived = Math.floor(daysLived / 7);
    const age = daysLived / 365.25;
    return { daysLived, weeksLived, age, totalDays: MAX_YEARS * 365.25 };
  }, [state.profile]);

  const milestoneWeeksMap = useMemo(() => {
    if (!state.profile) return new Set<string>();
    const dob = new Date(state.profile.dob).getTime();
    const map = new Set<string>();
    state.milestones.forEach(m => {
      const mDate = new Date(m.startDate).getTime();
      const diffWeeks = Math.floor((mDate - dob) / (1000 * 60 * 60 * 24 * 7));
      if (diffWeeks >= 0) {
        const year = Math.floor(diffWeeks / WEEKS_PER_YEAR);
        const week = diffWeeks % WEEKS_PER_YEAR;
        if (year < MAX_YEARS) {
          map.add(`${year}-${week}`);
        }
      }
    });
    return map;
  }, [state.milestones, state.profile]);

  const handleSaveWeek = (data: WeekData) => {
    setState(prev => ({
      ...prev,
      weeks: { ...prev.weeks, [data.id]: data }
    }));
  };

  const handleGetInsight = async () => {
    if (!lifeStats) return;
    setIsGeneratingInsight(true);
    const insight = await generateNarrativeInsight(state.weeks, lifeStats.age);
    setAiInsight(insight);
    setIsGeneratingInsight(false);
  };

  if (!state.profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-6">
        <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-xl border border-zinc-100">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-zinc-900 mb-4 tracking-tight">人生记录器</h1>
            <p className="text-zinc-500 leading-relaxed font-serif">人生不是用来加速的，而是用来被看见、被感受、被理解的。</p>
          </div>
          <form onSubmit={handleDobSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">你的出生日期</label>
              <input 
                name="dob" 
                type="date" 
                required 
                className="w-full p-4 rounded-2xl border border-zinc-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">怎么称呼你？</label>
              <input 
                name="name" 
                type="text" 
                placeholder="你的名字（可选）"
                className="w-full p-4 rounded-2xl border border-zinc-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-lg"
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-5 bg-zinc-900 text-white rounded-2xl font-bold text-xl hover:bg-zinc-800 transform hover:-translate-y-0.5 transition-all shadow-lg shadow-zinc-200"
            >
              开启我的 5200 周
            </button>
          </form>
          <p className="mt-8 text-center text-xs text-zinc-400">所有数据均保存在本地浏览器中。</p>
        </div>
      </div>
    );
  }

  const currentYear = Math.floor(lifeStats?.age || 0);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-12 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-zinc-900 mb-2">
            Hello, {state.profile.name || '旅人'}
          </h1>
          <p className="text-zinc-500 font-serif text-sm md:text-base">
            这是你的 100 岁人生地图，每一个方格都是独一无二的一周。
          </p>
        </div>
        <button 
          onClick={handleReset}
          className="text-xs text-zinc-400 hover:text-indigo-600 font-medium transition-colors border-b border-zinc-200 hover:border-indigo-600 pb-0.5"
        >
          重生点回溯
        </button>
      </header>

      {lifeStats && <StatsHeader {...lifeStats} />}

      <div className="bg-white p-5 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-sm border border-zinc-100 mb-12 overflow-hidden">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <h3 className="text-xl font-bold text-zinc-800">人生全景地图 (Weeks)</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] md:text-xs font-bold text-zinc-400">
            <div className="flex items-center gap-1 whitespace-nowrap">
              <div className="w-3 h-3 rounded-sm bg-yellow-300"></div> <span>顺遂开心</span>
            </div>
            <div className="flex items-center gap-1 whitespace-nowrap">
              <div className="w-3 h-3 rounded-sm bg-zinc-400"></div> <span>艰难挑战</span>
            </div>
            <div className="flex items-center gap-1 whitespace-nowrap">
              <div className="w-3 h-3 rounded-sm bg-zinc-200"></div> <span>时光走廊</span>
            </div>
            <div className="flex items-center gap-1 whitespace-nowrap">
              <div className="w-3 h-3 rounded-sm border border-yellow-400 flex items-center justify-center milestone-glow">
                <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
              </div> <span>重要纪念</span>
            </div>
          </div>
        </div>
        
        <div className="grid-container">
          {Array.from({ length: MAX_YEARS }).map((_, year) => {
            const isCurrentYear = year === currentYear;
            const shouldShowLabel = year % 5 === 0 || isCurrentYear;
            
            return (
              <React.Fragment key={`year-row-${year}`}>
                <div className={`text-[9px] md:text-[10px] font-bold text-center pr-1 select-none flex items-center justify-center leading-none h-full transition-colors ${
                  isCurrentYear ? 'text-indigo-500 scale-110' : 'text-zinc-300'
                }`}>
                  {shouldShowLabel ? year : ''}
                </div>
                
                {Array.from({ length: WEEKS_PER_YEAR }).map((_, weekIndex) => {
                  const weekCount = year * WEEKS_PER_YEAR + weekIndex;
                  const isPast = weekCount < (lifeStats?.weeksLived || 0);
                  const isCurrent = weekCount === (lifeStats?.weeksLived || 0);
                  const id = `${year}-${weekIndex}`;
                  const weekData = state.weeks[id];
                  const hasMilestone = milestoneWeeksMap.has(id);

                  let cellClass = MOOD_COLORS.FUTURE;
                  if (isPast) cellClass = MOOD_COLORS.PAST;
                  if (weekData?.mood && MOOD_COLORS[weekData.mood]) {
                    cellClass = MOOD_COLORS[weekData.mood];
                  }
                  if (isCurrent) cellClass += " " + MOOD_COLORS.CURRENT;
                  if (hasMilestone) cellClass += " milestone-glow";

                  return (
                    <div
                      key={id}
                      onClick={() => setSelectedWeek({ id, year, week: weekIndex })}
                      className={`week-cell rounded-[1px] md:rounded-sm cursor-pointer flex items-center justify-center ${cellClass} group relative`}
                      title={`第 ${year} 岁，第 ${weekIndex + 1} 周${weekData?.note ? ': ' + weekData.note : ''}`}
                    >
                      {weekData?.note && (
                        <div className="absolute -top-[1px] -right-[1px] w-1.5 h-1.5 bg-indigo-500 rounded-full border border-white"></div>
                      )}
                      {hasMilestone && (
                        <div className="w-1.5 h-1.5 bg-white/80 rounded-full shadow-[0_0_4px_rgba(255,255,255,1)]"></div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
        <div className="mt-8 flex justify-center items-center gap-6 md:gap-12 text-[9px] md:text-[10px] uppercase tracking-widest text-zinc-300 font-bold">
          <span className="whitespace-nowrap">出发点 (0岁)</span>
          <span className="flex-1 border-t border-dashed border-zinc-200 mx-2 md:mx-4"></span>
          <span className="whitespace-nowrap">漫长岁月的边际 (100岁)</span>
        </div>
      </div>

      <Milestones 
        milestones={state.milestones}
        onAdd={(m) => setState(prev => ({ ...prev, milestones: [...prev.milestones, m] }))}
        onDelete={(id) => setState(prev => ({ ...prev, milestones: prev.milestones.filter(m => m.id !== id) }))}
      />

      <div className="bg-zinc-900 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h3 className="text-xl md:text-2xl font-bold font-serif text-zinc-100">生命叙事：AI 洞察</h3>
            <button 
              onClick={handleGetInsight}
              disabled={isGeneratingInsight}
              className="px-6 py-2 bg-white text-zinc-900 rounded-full font-bold hover:scale-105 transition-all disabled:opacity-50 text-sm md:text-base self-start sm:self-auto"
            >
              {isGeneratingInsight ? '正在梳理你的足迹...' : '生成生命洞察'}
            </button>
          </div>
          
          <div className="text-base md:text-lg leading-relaxed font-serif text-zinc-300 min-h-[100px]">
            {aiInsight || (
              <div className="text-zinc-500 italic">
                “每一个格子都是你在这个世界上生活的痕迹。点击按钮，让 AI 陪你回顾这段旅程。”
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedWeek && (
        <WeekModal 
          weekId={selectedWeek.id}
          year={selectedWeek.year}
          weekIndex={selectedWeek.week}
          data={state.weeks[selectedWeek.id]}
          onSave={handleSaveWeek}
          onClose={() => setSelectedWeek(null)}
        />
      )}
      
      <footer className="mt-24 text-center text-zinc-400 pb-12">
        <p className="text-xs md:text-sm px-6">人生不仅是格子的填涂，更是这一秒最真实的呼吸。</p>
        <div className="mt-6 flex justify-center gap-4 md:gap-8 grayscale opacity-30">
          <span className="text-[9px] md:text-[10px] font-bold tracking-widest uppercase">Chronicle of 5200</span>
          <span className="text-[9px] md:text-[10px] font-bold tracking-widest uppercase">Intelligence by Gemini</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
