import React from 'react';
import { KPI_DATA } from '../constants';
import { RatingLevel, EvaluationState, KPIItem } from '../types';
import { ShieldCheck, AlertCircle, XCircle, Pencil, Activity, Wrench, Users, FileBarChart } from 'lucide-react';

interface InputSectionProps {
  ratings: EvaluationState;
  onRate: (id: string, level: RatingLevel, score: number) => void;
  onNoteChange: (id: string, note: string) => void;
}

const InputSection: React.FC<InputSectionProps> = ({ ratings, onRate, onNoteChange }) => {
  
  // Helper to get icon and style based on category ID
  const getCategoryConfig = (id: string) => {
    switch (id) {
      case 'cat_1': // Vận hành
        return {
          icon: <Activity size={24} strokeWidth={2.5} />,
          color: "text-indigo-500 dark:text-indigo-400",
          bg: "bg-indigo-50 dark:bg-indigo-900/20",
          border: "border-indigo-200 dark:border-indigo-500/30",
          shadow: "shadow-indigo-500/20"
        };
      case 'cat_2': // An toàn
        return {
          icon: <ShieldCheck size={24} strokeWidth={2.5} />,
          color: "text-emerald-500 dark:text-emerald-400",
          bg: "bg-emerald-50 dark:bg-emerald-900/20",
          border: "border-emerald-200 dark:border-emerald-500/30",
          shadow: "shadow-emerald-500/20"
        };
      case 'cat_3': // Thiết bị
        return {
          icon: <Wrench size={24} strokeWidth={2.5} />,
          color: "text-amber-500 dark:text-amber-400",
          bg: "bg-amber-50 dark:bg-amber-900/20",
          border: "border-amber-200 dark:border-amber-500/30",
          shadow: "shadow-amber-500/20"
        };
      case 'cat_4': // Nhân sự
        return {
          icon: <Users size={24} strokeWidth={2.5} />,
          color: "text-rose-500 dark:text-rose-400",
          bg: "bg-rose-50 dark:bg-rose-900/20",
          border: "border-rose-200 dark:border-rose-500/30",
          shadow: "shadow-rose-500/20"
        };
      case 'cat_5': // Báo cáo
        return {
          icon: <FileBarChart size={24} strokeWidth={2.5} />,
          color: "text-purple-500 dark:text-purple-400",
          bg: "bg-purple-50 dark:bg-purple-900/20",
          border: "border-purple-200 dark:border-purple-500/30",
          shadow: "shadow-purple-500/20"
        };
      default:
        return {
          icon: <Activity size={24} strokeWidth={2.5} />,
          color: "text-slate-500",
          bg: "bg-slate-100",
          border: "border-slate-200",
          shadow: "shadow-slate-500/20"
        };
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {KPI_DATA.map((category) => {
        const config = getCategoryConfig(category.id);
        
        return (
          <div 
            key={category.id} 
            className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden scroll-mt-24 transition-all duration-300 hover:shadow-md"
          >
            
            {/* Category Header Frame */}
            <div className="px-5 py-4 md:px-8 md:py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 backdrop-blur-sm flex items-center gap-4 group">
               <div className={`relative flex items-center justify-center w-14 h-14 rounded-2xl border-2 ${config.bg} ${config.border} ${config.color} ${config.shadow} shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shrink-0`}>
                  {config.icon}
               </div>
               <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight group-hover:opacity-80 transition-colors duration-300">
                      {category.name.replace(/^\d+\.\s*/, '')}
                  </h3>
                  <div className={`h-1 w-12 rounded-full mt-1.5 opacity-30 ${config.bg.replace('/20', '')} ${config.color.replace('text-', 'bg-')} group-hover:w-24 transition-all duration-500`}></div>
               </div>
            </div>
            
            {/* Items Container Body */}
            <div className="p-4 md:p-6 lg:p-8 bg-slate-50/30 dark:bg-slate-950/20">
              <div className="space-y-3">
                {category.items.map((item) => (
                  <KPIItemRow 
                    key={item.id} 
                    item={item} 
                    currentRating={ratings[item.id]} 
                    onRate={onRate}
                    onNoteChange={onNoteChange}
                    categoryColorClass={config.color}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface KPIItemRowProps {
  item: KPIItem;
  currentRating: EvaluationState[string] | undefined;
  onRate: (id: string, level: RatingLevel, score: number) => void;
  onNoteChange: (id: string, note: string) => void;
  categoryColorClass?: string;
}

const KPIItemRow: React.FC<KPIItemRowProps> = ({ item, currentRating, onRate, onNoteChange, categoryColorClass }) => {
  
  const handleSelect = (level: RatingLevel) => {
    const criteria = item.criteria[level];
    const score = Math.round(item.maxPoints * criteria.scorePercent * 100) / 100;
    onRate(item.id, level, score);
  };

  // Determine styles based on rating
  let containerClassName = `p-4 md:p-5 relative group bg-white dark:bg-[#0f172a] rounded-2xl border transition-all duration-300 ease-out `;
  let leftBorderClass = "hidden"; // Default hidden
  
  if (currentRating?.level === RatingLevel.GOOD) {
    containerClassName += "border-emerald-500/50 shadow-[0_0_15px_-3px_rgba(16,185,129,0.15)] hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.3)] hover:border-emerald-400 z-10 scale-[1.01]";
    leftBorderClass = "bg-emerald-500";
  } else if (currentRating?.level === RatingLevel.AVERAGE) {
    containerClassName += "border-blue-500/50 shadow-[0_0_15px_-3px_rgba(59,130,246,0.15)] hover:shadow-[0_0_25px_-5px_rgba(59,130,246,0.3)] hover:border-blue-400 z-10 scale-[1.01]";
    leftBorderClass = "bg-blue-500";
  } else if (currentRating?.level === RatingLevel.WEAK) {
    containerClassName += "border-rose-500/50 shadow-[0_0_15px_-3px_rgba(244,63,94,0.15)] hover:shadow-[0_0_25px_-5px_rgba(244,63,94,0.3)] hover:border-rose-400 z-10 scale-[1.01]";
    leftBorderClass = "bg-rose-500";
  } else {
    // Not rated state
    containerClassName += "border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg hover:shadow-indigo-500/5 dark:hover:shadow-black/40 hover:-translate-y-0.5";
  }

  return (
    <div className={containerClassName}>
      
      {/* Active Indicator Line */}
      {currentRating && (
         <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl ${leftBorderClass} animate-in fade-in duration-500`}></div>
      )}

      <div className="flex flex-col xl:flex-row gap-5 lg:gap-8">
         
         {/* LEFT: Content & Checklist */}
         <div className="flex-1">
            <div className="flex items-start gap-4 mb-2">
               <div className={`flex items-center justify-center w-9 h-9 rounded-xl border text-sm font-bold shrink-0 mt-0.5 transition-colors duration-300 ${
                 currentRating 
                 ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900' 
                 : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 group-hover:border-indigo-200 dark:group-hover:border-indigo-800 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:bg-white dark:group-hover:bg-slate-800'
               }`}>
                  {item.code}
               </div>
               <div className="w-full">
                  <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                      <h4 className={`text-base md:text-lg font-bold leading-tight transition-colors duration-300 ${
                        currentRating ? 'text-slate-900 dark:text-white' : 'text-slate-800 dark:text-slate-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-300'
                      }`}>
                          {item.name}
                      </h4>
                      <div className="shrink-0 inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-500 dark:text-slate-400 transition-colors group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:shadow-sm">
                          Trọng số: <span className="text-slate-900 dark:text-slate-200 ml-1.5">{item.maxPoints}Đ</span>
                      </div>
                  </div>
                  
                  {/* Checklist Points */}
                  <div className="mt-3 space-y-1.5 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl p-3 border border-slate-100 dark:border-slate-800/50">
                      {item.checklist?.map((point, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 group/item cursor-default">
                            <div className={`mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 transition-all duration-300 group-hover/item:scale-125 shadow-sm ${categoryColorClass ? categoryColorClass.replace('text-', 'bg-') : 'group-hover/item:bg-indigo-500'}`}></div>
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed transition-colors duration-200 group-hover/item:text-slate-900 dark:group-hover/item:text-slate-200">
                              {point}
                            </span>
                        </div>
                      ))}
                  </div>
               </div>
            </div>
         </div>

         {/* RIGHT: Actions */}
         <div className="w-full xl:w-[380px] shrink-0 flex flex-col gap-3 border-t xl:border-t-0 xl:border-l border-slate-100 dark:border-slate-800 pt-4 xl:pt-0 xl:pl-6">
            
            <div className="flex items-center gap-2 mb-1">
               <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Đánh giá kết quả</span>
               <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
            </div>

            {/* Rating Buttons */}
            <div className="grid grid-cols-3 gap-2.5">
               {/* Good Button */}
               <button
                  onClick={() => handleSelect(RatingLevel.GOOD)}
                  className={`flex flex-col items-center justify-center gap-2 py-3 px-2 rounded-xl border transition-all duration-200 active:scale-95 ${
                     currentRating?.level === RatingLevel.GOOD
                     ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-[1.02] ring-2 ring-emerald-500/20 ring-offset-2 dark:ring-offset-slate-900'
                     : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:text-emerald-600 dark:hover:text-emerald-400 hover:shadow-lg hover:shadow-emerald-900/10 hover:-translate-y-0.5'
                  }`}
               >
                  <ShieldCheck size={20} className={`transition-transform duration-300 ${currentRating?.level === RatingLevel.GOOD ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="text-[10px] font-black uppercase tracking-wider">Tốt</span>
               </button>

               {/* Average Button */}
               <button
                  onClick={() => handleSelect(RatingLevel.AVERAGE)}
                  className={`flex flex-col items-center justify-center gap-2 py-3 px-2 rounded-xl border transition-all duration-200 active:scale-95 ${
                     currentRating?.level === RatingLevel.AVERAGE
                     ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20 scale-[1.02] ring-2 ring-blue-500/20 ring-offset-2 dark:ring-offset-slate-900'
                     : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-lg hover:shadow-blue-900/10 hover:-translate-y-0.5'
                  }`}
               >
                  <AlertCircle size={20} className={`transition-transform duration-300 ${currentRating?.level === RatingLevel.AVERAGE ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="text-[10px] font-black uppercase tracking-wider">Trung bình</span>
               </button>

               {/* Weak Button */}
               <button
                  onClick={() => handleSelect(RatingLevel.WEAK)}
                  className={`flex flex-col items-center justify-center gap-2 py-3 px-2 rounded-xl border transition-all duration-200 active:scale-95 ${
                     currentRating?.level === RatingLevel.WEAK
                     ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-500/20 scale-[1.02] ring-2 ring-rose-500/20 ring-offset-2 dark:ring-offset-slate-900'
                     : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 hover:text-rose-600 dark:hover:text-rose-400 hover:shadow-lg hover:shadow-rose-900/10 hover:-translate-y-0.5'
                  }`}
               >
                  <XCircle size={20} className={`transition-transform duration-300 ${currentRating?.level === RatingLevel.WEAK ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="text-[10px] font-black uppercase tracking-wider">Yếu</span>
               </button>
            </div>

            {/* Result Bar */}
            {currentRating && (
               <div className={`px-4 py-2.5 rounded-xl border flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm ${
                  currentRating.level === RatingLevel.GOOD ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400' :
                  currentRating.level === RatingLevel.AVERAGE ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400' :
                  'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400'
               }`}>
                  <span className="text-xs font-bold truncate pr-4 flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                     {item.criteria[currentRating.level].description}
                  </span>
                  <span className="text-sm font-black shrink-0">
                     {currentRating.actualScore.toFixed(2)}/{item.maxPoints}đ
                  </span>
               </div>
            )}

            {/* Note Input */}
            <div className="relative group/note mt-auto">
               <Pencil size={14} className="absolute top-3.5 left-3.5 text-slate-400 group-focus-within/note:text-indigo-500 transition-colors" />
               <textarea
                  value={currentRating?.notes || ''}
                  onChange={(e) => onNoteChange(item.id, e.target.value)}
                  placeholder="Thêm ghi chú chi tiết..."
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs font-medium text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none resize-none h-[42px] min-h-[42px] transition-all hover:border-slate-300 dark:hover:border-slate-700 focus:shadow-md focus:shadow-indigo-500/10"
               />
            </div>
         </div>
      </div>
    </div>
  );
};

export default InputSection;