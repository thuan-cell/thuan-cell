import React from 'react';
import { KPI_DATA } from '../constants';
import { RatingLevel, EvaluationState, KPIItem } from '../types';
import { CheckCircle2, AlertCircle, XCircle, Check, PenLine, Shield, Info, CheckSquare } from 'lucide-react';

interface InputSectionProps {
  ratings: EvaluationState;
  onRate: (id: string, level: RatingLevel, score: number) => void;
  onNoteChange: (id: string, note: string) => void;
}

const InputSection: React.FC<InputSectionProps> = ({ ratings, onRate, onNoteChange }) => {
  return (
    <div className="space-y-6 pb-8">
      {KPI_DATA.map((category) => (
        <div key={category.id} className="relative">
          {/* Compact Sticky Header - Glass Effect */}
          <div className="sticky top-0 z-30 mb-4 -mx-4 px-4 md:-mx-6 md:px-6 lg:mx-0 lg:px-0 pointer-events-none pt-2 pb-1">
             <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 shadow-sm supports-[backdrop-filter]:bg-white/60 lg:rounded-xl lg:border lg:mx-0 lg:shadow-sm"></div>
             <div className="relative flex items-center gap-3 px-2 py-2 pointer-events-auto">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-bold shadow-md shadow-indigo-500/20 text-xs font-mono border border-indigo-400/20">
                  {category.id.split('_')[1]}
                </div>
                <h3 className="text-sm md:text-base font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-tight truncate">
                  {category.name.split('. ')[1] || category.name}
                </h3>
             </div>
          </div>
          
          <div className="grid gap-3">
            {category.items.map((item) => (
              <KPIItemCard 
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

interface KPIItemCardProps {
  item: KPIItem;
  currentRating: EvaluationState[string] | undefined;
  onRate: (id: string, level: RatingLevel, score: number) => void;
  onNoteChange: (id: string, note: string) => void;
}

const KPIItemCard: React.FC<KPIItemCardProps> = ({ item, currentRating, onRate, onNoteChange }) => {
  const handleSelect = (level: RatingLevel) => {
    const criteria = item.criteria[level];
    // Use 100 for better precision, then round
    const score = Math.round(item.maxPoints * criteria.scorePercent * 100) / 100;
    onRate(item.id, level, score);
  };

  const getButtonStyles = (level: RatingLevel, isSelected: boolean) => {
    // Base style for all buttons
    const base = "relative flex flex-col items-center justify-center gap-1.5 py-2 px-1 rounded-lg border transition-all duration-300 cursor-pointer select-none h-full min-h-[64px] group/btn overflow-hidden ";
    
    if (isSelected) {
      switch (level) {
        case RatingLevel.GOOD:
          return base + "bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-[1.02] z-10";
        case RatingLevel.AVERAGE:
          return base + "bg-gradient-to-br from-blue-500 to-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/30 scale-[1.02] z-10";
        case RatingLevel.WEAK:
          return base + "bg-gradient-to-br from-rose-500 to-rose-600 border-rose-500 text-white shadow-lg shadow-rose-500/30 scale-[1.02] z-10";
      }
    }
    
    // Unselected state - Clean modern look
    return base + "bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 active:scale-[0.98]";
  };

  return (
    <div className={`
      group relative bg-white dark:bg-slate-900 rounded-xl border transition-all duration-300 overflow-hidden
      ${currentRating 
        ? 'border-indigo-500/30 dark:border-indigo-500/30 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/20' 
        : 'border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-slate-600'}
    `}>
      
      {/* Status Strip (Left side) - Animated */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-500 ${
         currentRating 
         ? (currentRating.level === RatingLevel.GOOD ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' :
            currentRating.level === RatingLevel.AVERAGE ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 
            'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]')
         : 'bg-transparent'
      }`}></div>

      <div className="flex flex-col lg:flex-row">
        
        {/* LEFT SECTION: Info & Checklist */}
        <div className="flex-1 p-4 pl-5 lg:pr-6 lg:border-r border-slate-100 dark:border-slate-800/50">
          
          {/* Header */}
          <div className="flex justify-between items-start gap-3 mb-3">
             <div className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-xs font-bold border border-slate-200 dark:border-slate-700 mt-0.5 shadow-sm">
                   {item.code}
                </span>
                <div>
                   <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                     {item.name}
                   </h4>
                   <div className="mt-1.5 inline-flex items-center gap-1.5 text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                     <span>Trọng số:</span>
                     <span className="text-slate-900 dark:text-white font-black">{item.maxPoints}Đ</span>
                   </div>
                </div>
             </div>
             
             {/* Score Badge (Mobile only) */}
             {currentRating && (
                <div className="lg:hidden flex flex-col items-end">
                  <div className={`text-lg font-black ${
                    currentRating.level === RatingLevel.GOOD ? 'text-emerald-600' :
                    currentRating.level === RatingLevel.AVERAGE ? 'text-blue-600' : 
                    'text-rose-600'
                  }`}>
                    {currentRating.actualScore.toFixed(2)}
                  </div>
                </div>
             )}
          </div>
          
          {/* Refined Checklist */}
          {item.checklist && item.checklist.length > 0 ? (
            <div className="mt-3 pl-10 space-y-2">
              {item.checklist.map((point, index) => (
                <div key={index} className="flex items-start gap-2.5 group/point">
                   <div className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 group-hover/point:bg-indigo-400 transition-colors shrink-0"></div>
                   <span className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed opacity-90 group-hover/point:text-slate-900 dark:group-hover/point:text-white transition-colors">{point}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="pl-10 text-slate-400 italic text-xs mt-2">Không có tiêu chí cụ thể.</p>
          )}
        </div>

        {/* RIGHT SECTION: Actions (Rating & Note) */}
        <div className="lg:w-[320px] xl:w-[360px] flex-shrink-0 bg-slate-50/80 dark:bg-slate-900/40 p-4 flex flex-col gap-3">
             
             {/* Rating Buttons - Modernized */}
             <div className="grid grid-cols-3 gap-2">
                {Object.values(RatingLevel).map((level) => {
                  const criteria = item.criteria[level];
                  const isSelected = currentRating?.level === level;
                  
                  return (
                    <div 
                      key={level} 
                      className={getButtonStyles(level, isSelected)}
                      onClick={() => handleSelect(level)}
                      title={criteria.description}
                    >
                        {/* Icon */}
                        {level === RatingLevel.GOOD && <Shield size={18} strokeWidth={2.5} className={isSelected ? 'text-white' : ''} />}
                        {level === RatingLevel.AVERAGE && <AlertCircle size={18} strokeWidth={2.5} className={isSelected ? 'text-white' : ''} />}
                        {level === RatingLevel.WEAK && <XCircle size={18} strokeWidth={2.5} className={isSelected ? 'text-white' : ''} />}
                        
                        <span className="font-bold text-[10px] uppercase tracking-wide">{criteria.label}</span>
                        
                        {/* Selected Indicator Check */}
                        {isSelected && (
                          <div className="absolute top-1 right-1">
                             <CheckCircle2 size={12} className="text-white/80" />
                          </div>
                        )}
                        
                        {/* Subtle background shine effect */}
                        {isSelected && <div className="absolute inset-0 bg-white/10 skew-x-12 -ml-4 pointer-events-none"></div>}
                    </div>
                  );
                })}
              </div>

              {/* Feedback Text - Better Contrast */}
              <div className="min-h-[28px] flex items-center">
                {currentRating ? (
                  <div className={`
                     w-full px-3 py-1.5 rounded-lg text-[10px] font-medium border flex items-center justify-between shadow-sm
                     ${currentRating.level === RatingLevel.GOOD ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200 border-emerald-100 dark:border-emerald-800' :
                       currentRating.level === RatingLevel.AVERAGE ? 'bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 border-blue-100 dark:border-blue-800' :
                       'bg-rose-50 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200 border-rose-100 dark:border-rose-800'}
                  `}>
                     <span className="truncate mr-2 font-semibold">{item.criteria[currentRating.level].description}</span>
                     {/* Added .toFixed(2) here */}
                     <span className="font-bold whitespace-nowrap text-xs">{currentRating.actualScore.toFixed(2)}/{item.maxPoints}đ</span>
                  </div>
                ) : (
                  <div className="w-full px-3 py-1.5 rounded-lg text-[10px] text-slate-400 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 italic flex items-center gap-2 shadow-sm">
                    <Info size={12} />
                    Chưa có đánh giá nào
                  </div>
                )}
              </div>

              {/* Note Input - Cleaner */}
              <div className="relative group/input flex-1">
                  <div className="absolute top-2.5 left-2.5 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors">
                      <PenLine size={12} />
                  </div>
                  <textarea 
                      placeholder="Thêm ghi chú..." 
                      className="w-full h-full min-h-[50px] py-2 pl-8 pr-3 text-xs bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-400/80 resize-none transition-all shadow-sm hover:border-slate-300 dark:hover:border-slate-700"
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