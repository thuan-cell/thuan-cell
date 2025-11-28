import React from 'react';
import { KPI_DATA } from '../constants';
import { RatingLevel, EvaluationState, KPIItem } from '../types';
import { CheckCircle2, AlertCircle, XCircle, CheckSquare, MessageSquare } from 'lucide-react';

interface InputSectionProps {
  ratings: EvaluationState;
  onRate: (id: string, level: RatingLevel, score: number) => void;
  onNoteChange: (id: string, note: string) => void;
}

const InputSection: React.FC<InputSectionProps> = ({ ratings, onRate, onNoteChange }) => {
  return (
    <div className="space-y-8">
      {KPI_DATA.map((category) => (
        <div key={category.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 hover:shadow-md">
          <div className="bg-slate-50/80 dark:bg-slate-800/80 px-6 py-4 border-b border-slate-200 dark:border-slate-700 backdrop-blur-sm sticky top-0 z-10">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded-full inline-block"></span>
              {category.name}
            </h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {category.items.map((item) => (
              <KPIItemRow 
                key={item.id} 
                item={item} 
                currentRating={ratings[item.id]} 
                onRate={onRate}
                onNoteChange={onNoteChange}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

interface KPIItemRowProps {
  item: KPIItem;
  currentRating: EvaluationState[string] | undefined;
  onRate: (id: string, level: RatingLevel, score: number) => void;
  onNoteChange: (id: string, note: string) => void;
}

const KPIItemRow: React.FC<KPIItemRowProps> = ({ item, currentRating, onRate, onNoteChange }) => {
  const handleSelect = (level: RatingLevel) => {
    const criteria = item.criteria[level];
    const score = Math.round(item.maxPoints * criteria.scorePercent * 10) / 10;
    onRate(item.id, level, score);
  };

  const getButtonClass = (level: RatingLevel, isSelected: boolean) => {
    const base = "relative flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200 cursor-pointer group ";
    
    // Unselected state
    if (!isSelected) {
      return base + "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-white dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 shadow-sm hover:shadow";
    }
    
    // Selected states
    switch (level) {
      case RatingLevel.GOOD:
        return base + "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 ring-1 ring-green-500 shadow-md";
      case RatingLevel.AVERAGE:
        return base + "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 ring-1 ring-yellow-500 shadow-md";
      case RatingLevel.WEAK:
        return base + "border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 ring-1 ring-red-500 shadow-md";
      default:
        return base;
    }
  };

  return (
    <div className="p-6 hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* LEFT COLUMN: INFO & CHECKLIST (Larger proportion) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="flex items-start justify-between">
             <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-600">
                  {item.code}
                </span>
                <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                  {item.name}
                </h4>
             </div>
             <span className="lg:hidden text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full whitespace-nowrap">
                Max: {item.maxPoints}đ
             </span>
          </div>
          
          {/* Checklist Card */}
          {item.checklist && item.checklist.length > 0 && (
            <div className="mt-1 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-100 dark:border-slate-800/60 overflow-hidden">
               <div className="px-3 py-2 bg-slate-100/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800/60 flex items-center gap-2">
                 <CheckSquare size={14} className="text-blue-500" />
                 <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tiêu chí kiểm tra</span>
               </div>
               <ul className="p-3 space-y-2">
                  {item.checklist.map((point, index) => (
                    <li key={index} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                       <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-400/60 flex-shrink-0"></span>
                       <span className="leading-snug">{point}</span>
                    </li>
                  ))}
               </ul>
            </div>
          )}
        </div>
        
        {/* RIGHT COLUMN: CONTROLS (Compact proportion) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
           {/* Score Header Desktop */}
           <div className="hidden lg:flex justify-end items-center gap-2 mb-1">
              <span className="text-xs font-medium text-slate-400 uppercase">Điểm số</span>
              <div className="flex items-baseline gap-1">
                 <span className={`text-2xl font-bold ${currentRating && currentRating.actualScore > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-300 dark:text-slate-600'}`}>
                   {currentRating ? currentRating.actualScore : 0}
                 </span>
                 <span className="text-sm text-slate-400 font-medium">/ {item.maxPoints}</span>
              </div>
           </div>

           {/* Rating Buttons */}
           <div className="grid grid-cols-3 gap-2">
            {Object.values(RatingLevel).map((level) => {
              const criteria = item.criteria[level];
              const isSelected = currentRating?.level === level;
              
              return (
                <div 
                  key={level} 
                  className={getButtonClass(level, isSelected)}
                  onClick={() => handleSelect(level)}
                >
                  <div className="flex flex-col items-center gap-1 mb-1">
                    {level === RatingLevel.GOOD && <CheckCircle2 size={20} className={isSelected ? "text-green-600 dark:text-green-400" : "text-slate-300"} />}
                    {level === RatingLevel.AVERAGE && <AlertCircle size={20} className={isSelected ? "text-yellow-600 dark:text-yellow-400" : "text-slate-300"} />}
                    {level === RatingLevel.WEAK && <XCircle size={20} className={isSelected ? "text-red-600 dark:text-red-400" : "text-slate-300"} />}
                    <span className="font-bold text-sm">{criteria.label}</span>
                  </div>
                  <div className="text-[10px] text-center leading-tight opacity-80 px-1">{criteria.description}</div>
                </div>
              );
            })}
          </div>

          {/* Note Input */}
          <div className="relative">
            <div className="absolute top-2.5 left-3 text-slate-400">
              <MessageSquare size={14} />
            </div>
            <input 
              type="text" 
              placeholder="Ghi chú thêm..." 
              className="w-full text-sm py-2 pl-9 pr-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/40 focus:border-blue-500 transition-all placeholder:text-slate-400"
              value={currentRating?.notes || ''}
              onChange={(e) => onNoteChange(item.id, e.target.value)}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default InputSection;