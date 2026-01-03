
import React from 'react';

interface StatsHeaderProps {
  daysLived: number;
  weeksLived: number;
  age: number;
  totalDays: number;
}

const StatsHeader: React.FC<StatsHeaderProps> = ({ daysLived, weeksLived, age, totalDays }) => {
  // Life Clock: 100 years = 24 hours
  const totalMinutes = (age / 100) * 24 * 60;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);
  
  const sleepTimeYears = (daysLived * 8) / (24 * 365);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h4 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-1">人生时钟</h4>
        <div className="text-3xl font-bold text-zinc-900">
          {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}
        </div>
        <p className="text-xs text-zinc-500 mt-2">假设 100 岁是一天 24 小时<br/>现在只是你人生的清晨或午后</p>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h4 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-1">已走过</h4>
        <div className="text-3xl font-bold text-zinc-900">
          {weeksLived.toLocaleString()} <span className="text-sm font-normal text-zinc-400">周</span>
        </div>
        <p className="text-xs text-zinc-500 mt-2">
          占 100 岁可能性的 {((weeksLived / 5200) * 100).toFixed(1)}%
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </div>
        <h4 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-1">睡梦时光</h4>
        <div className="text-3xl font-bold text-zinc-900">
          {sleepTimeYears.toFixed(1)} <span className="text-sm font-normal text-zinc-400">年</span>
        </div>
        <p className="text-xs text-zinc-500 mt-2">假设每天睡眠 8 小时<br/>梦境也是人生重要的构成部分</p>
      </div>
    </div>
  );
};

export default StatsHeader;
