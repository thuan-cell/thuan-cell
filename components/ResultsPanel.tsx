import React from 'react';
import { Eye, Zap, Activity, ShieldCheck, Wrench, Users, FileBarChart, Printer } from 'lucide-react';

interface CategoryScore {
  id: string;
  name: string;
  shortName: string;
  score: number;
  max: number;
  percentage: number;
}

interface ResultsPanelProps {
  categoryScores: CategoryScore[];
  totalScore: number;
  percent: number;
  ranking: string;
  selectedMonth: string;
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
  onPrint: () => void;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ 
  categoryScores,
  totalScore,
  percent,
  ranking,
  selectedMonth, 
  showPreview,
  setShowPreview,
  onPrint
}) => {
  
  let rankingColor = "text-slate-400";
  let rankingGradient = "from-slate-500 to-slate-600";
  
  if (percent > 0) {
      if (percent >= 90) {
          rankingColor = "text-emerald-400";
          rankingGradient = "from-emerald-400 to-teal-500";
      } else if (percent >= 70) {
          rankingColor = "text-blue-400";
          rankingGradient = "from-blue-400 to-indigo-500";
      } else {
          rankingColor = "text-rose-400";
          rankingGradient = "from-rose-400 to-pink-500";
      }
  }

  // Circular Progress Calculation
  // Reduced radius for compactness
  const radius = 65;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  // Helper to get icon
  const getIcon = (shortName: string) => {
    if (shortName === "Vận hành") return <Activity size={16} className="text-indigo-500" />;
    if (shortName === "An toàn") return <ShieldCheck size={16} className="text-emerald-500" />;
    if (shortName === "Thiết bị") return <Wrench size={16} className="text-amber-500" />;
    if (shortName === "Nhân sự") return <Users size={16} className="text-rose-500" />;
    if (shortName === "Báo cáo") return <FileBarChart size={16} className="text-purple-500" />;
    return <Activity size={16} />;
  }

  return (
    <div className={`flex flex-col h-full overflow-hidden transition-all duration-300 ${showPreview ? 'opacity-0 pointer-events-none' : 'opacity-100'} print:hidden`}>
        
        {/* Header */}
        <div className="flex items-center justify-between shrink-0 mb-2">
             <div className="flex items-center gap-3">
                 <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400 relative overflow-hidden group shadow-sm">
                     <Zap size={18} strokeWidth={2.5} className="relative z-10" />
                 </div>
                 <div>
                     <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider leading-none">Kết Quả</h3>
                     <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Tháng {selectedMonth.split('-').reverse().join('/')}</p>
                 </div>
             </div>
        </div>

        {/* CONTENT WRAPPER: Flex-1 with justify-evenly to spread content without scroll */}
        <div className="flex-1 flex flex-col justify-evenly min-h-0">
            
            {/* 1. HERO CIRCLE SCORE (Compact) */}
            <div className="flex flex-col items-center justify-center relative py-2">
                {/* Glow Effect */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-gradient-to-tr ${rankingGradient} blur-[60px] opacity-15 pointer-events-none`}></div>

                <div className="relative w-40 h-40 flex items-center justify-center">
                    {/* Background Circle */}
                    <svg className="w-full h-full transform -rotate-90 drop-shadow-lg">
                        <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-slate-100 dark:text-slate-800/60"
                        />
                        {/* Foreground Circle */}
                        <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        fill="transparent"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={percent >= 90 ? '#34d399' : percent >= 70 ? '#60a5fa' : '#fb7185'} />
                            <stop offset="100%" stopColor={percent >= 90 ? '#10b981' : percent >= 70 ? '#3b82f6' : '#f43f5e'} />
                        </linearGradient>
                        </defs>
                    </svg>

                    {/* Center Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">
                            {totalScore}
                        </span>
                        <div className={`mt-1 px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border bg-white/50 dark:bg-slate-800/50 backdrop-blur-md ${rankingColor} border-current/20`}>
                            {ranking}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. CATEGORY BREAKDOWN (Compact List with Icons) */}
            <div className="flex flex-col gap-3 px-1">
                {categoryScores.map((cat, idx) => (
                    <div key={cat.id} className="group flex items-center gap-3">
                        {/* Icon Box */}
                        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                            {getIcon(cat.shortName)}
                        </div>
                        
                        {/* Bar & Text */}
                        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                            <div className="flex justify-between items-end leading-none">
                                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase truncate">
                                    {cat.shortName}
                                </span>
                                <span className="text-[11px] font-black text-slate-800 dark:text-white">
                                    {cat.score}<span className="text-[9px] text-slate-400 font-medium">/{cat.max}</span>
                                </span>
                            </div>
                            {/* Modern Slim Bar */}
                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                                        idx === 0 ? 'bg-indigo-500' :
                                        idx === 1 ? 'bg-emerald-500' :
                                        idx === 2 ? 'bg-amber-500' :
                                        idx === 3 ? 'bg-rose-500' :
                                        'bg-purple-500'
                                    }`}
                                    style={{ width: `${cat.percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* 3. ACTION BUTTONS (Grid 2 Columns) */}
        <div className="shrink-0 mt-2 grid grid-cols-5 gap-2">
           {/* Print Button (Smaller) */}
           <button 
              onClick={onPrint}
              className="col-span-2 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group"
              title="In báo cáo nhanh"
           >
              <Printer size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">In</span>
           </button>

           {/* View Report Button (Larger) */}
           <button 
              onClick={() => setShowPreview(true)}
              className="col-span-3 h-12 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl shadow-indigo-900/10 dark:shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden"
           >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <Eye size={18} />
              <span className="text-xs font-black uppercase tracking-wider">Xem Báo Cáo</span>
           </button>
        </div>
    </div>
  );
};

export default ResultsPanel;