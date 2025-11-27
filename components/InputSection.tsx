import React from 'react';
import { KPI_DATA } from '../constants';
import { RatingLevel, EvaluationState, KPIItem } from '../types';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

interface InputSectionProps {
  ratings: EvaluationState;
  onRate: (id: string, level: RatingLevel, score: number) => void;
  onNoteChange: (id: string, note: string) => void;
}

const InputSection: React.FC<InputSectionProps> = ({ ratings, onRate, onNoteChange }) => {
  return (
    <div className="space-y-6">
      {KPI_DATA.map((category) => (
        <div key={category.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
          <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">{category.name}</h3>
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
    const base = "flex-1 flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200 cursor-pointer text-sm ";
    
    // Unselected state
    if (!isSelected) {
      return base + "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400";
    }
    
    // Selected states
    switch (level) {
      case RatingLevel.GOOD:
        return base + "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 ring-1 ring-green-500 dark:ring-green-500/50";
      case RatingLevel.AVERAGE:
        return base + "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 ring-1 ring-yellow-500 dark:ring-yellow-500/50";
      case RatingLevel.WEAK:
        return base + "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 ring-1 ring-red-500 dark:ring-red-500/50";
      default:
        return base;
    }
  };

  return (
    <div className="p-4 md:p-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded transition-colors">{item.code}</span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Tối đa: {item.maxPoints}đ</span>
          </div>
          <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">{item.name}</h4>
        </div>
        <div className="md:w-32 text-right">
           <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{currentRating ? currentRating.actualScore : 0}</span>
           <span className="text-slate-400 dark:text-slate-500 text-sm"> / {item.maxPoints}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {Object.values(RatingLevel).map((level) => {
          const criteria = item.criteria[level];
          const isSelected = currentRating?.level === level;
          
          return (
            <div 
              key={level} 
              className={getButtonClass(level, isSelected)}
              onClick={() => handleSelect(level)}
            >
              <div className="font-bold mb-1 flex items-center gap-2">
                {level === RatingLevel.GOOD && <CheckCircle2 size={16} />}
                {level === RatingLevel.AVERAGE && <AlertCircle size={16} />}
                {level === RatingLevel.WEAK && <XCircle size={16} />}
                {criteria.label}
              </div>
              <div className="text-xs text-center opacity-90">{criteria.description}</div>
            </div>
          );
        })}
      </div>

      <div>
        <input 
          type="text" 
          placeholder="Ghi chú thêm (tùy chọn)..." 
          className="w-full text-sm p-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/40 focus:border-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
          value={currentRating?.notes || ''}
          onChange={(e) => onNoteChange(item.id, e.target.value)}
        />
      </div>
    </div>
  );
};

export default InputSection;