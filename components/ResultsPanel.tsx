import React from 'react';
import { KPI_DATA } from '../constants';
import { EvaluationState } from '../types';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Eye, TrendingUp, Award, BarChart3, FileText, CheckCircle2 } from 'lucide-react';
import DashboardReport from './DashboardReport';
import { EmployeeInfo } from '../App';

interface ResultsPanelProps {
  ratings: EvaluationState;
  selectedMonth: string;
  employeeInfo: EmployeeInfo;
  logoUrl: string | null;
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ 
  ratings, 
  selectedMonth, 
  employeeInfo, 
  logoUrl,
  showPreview,
  setShowPreview
}) => {
  let totalScore = 0;
  let maxTotalScore = 0;
  
  const categoryScores = KPI_DATA.map(cat => {
    let catScore = 0;
    let catMax = 0;
    cat.items.forEach(item => {
      catMax += item.maxPoints;
      if (ratings[item.id]) {
        catScore += ratings[item.id].actualScore;
      }
    });
    
    // Ensure category score is rounded properly to 2 decimals to avoid floating point issues
    catScore = Math.round(catScore * 100) / 100;
    
    totalScore += catScore;
    maxTotalScore += catMax;
    
    const percentage = catMax > 0 ? Math.round((catScore / catMax) * 100) : 0;
    
    let shortName = cat.name;
    if (cat.name.includes("VẬN HÀNH")) shortName = "Vận hành";
    else if (cat.name.includes("THIẾT BỊ")) shortName = "Thiết bị";
    else if (cat.name.includes("NHÂN SỰ")) shortName = "Nhân sự";
    else if (cat.name.includes("BÁO CÁO")) shortName = "Báo cáo";
    else if (cat.name.includes("AN TOÀN")) shortName = "An toàn";

    return { 
      name: cat.name.split('.')[1].trim(), 
      shortName: shortName,
      score: catScore, 
      max: catMax, 
      percentage: percentage, 
      fullMark: 100 
    };
  });

  // Ensure total score is rounded properly to 2 decimals
  totalScore = Math.round(totalScore * 100) / 100;
  
  const percent = maxTotalScore > 0 ? Math.round((totalScore / maxTotalScore) * 100) : 0;
  
  // Logic Rating
  const ranking = percent >= 90 ? "Xuất sắc" : percent >= 70 ? "Đạt yêu cầu" : "Không đạt yêu cầu";
  
  const rankingColorClass = percent >= 90 
    ? "text-emerald-100" 
    : percent >= 70 
      ? "text-blue-100" 
      : "text-rose-100";
      
  const rankingBgClass = percent >= 90 
    ? "bg-emerald-500" 
    : percent >= 70 
      ? "bg-blue-500" 
      : "bg-rose-500";
  
  // Professional Palette - Deep Corporate Colors
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <>
      <div className={`flex flex-col h-full gap-3 transition-all duration-500 ease-out ${showPreview ? 'opacity-0 translate-x-10 pointer-events-none' : 'opacity-100'} print:hidden`}>
        
        {/* HERO CARD - Premium Design */}
        <div className="shrink-0 rounded-2xl shadow-lg shadow-indigo-500/10 dark:shadow-black/40 overflow-hidden relative group ring-1 ring-black/5 dark:ring-white/10">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-800"></div>
          
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="relative p-5 text-white">
            <div className="flex justify-between items-center mb-4">
              <div>
                 <h2 className="text-indigo-100 font-bold text-[11px] uppercase tracking-widest mb-1 flex items-center gap-1.5 opacity-90">
                   <Award size={14} />
                   Tổng kết hiệu suất
                 </h2>
                 <div className="flex items-baseline gap-2">
                    {/* Fixed to 2 decimals */}
                    <span className="text-5xl font-black tracking-tight leading-none drop-shadow-md">{totalScore.toFixed(2)}</span>
                    <span className="text-sm font-semibold text-indigo-200">/ {maxTotalScore}</span>
                 </div>
              </div>
              
              <div className="flex flex-col items-end">
                 <div className={`px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-md border border-white/20 shadow-lg mb-1`}>
                    <span className={`text-xs font-black uppercase tracking-wide whitespace-nowrap text-white`}>{ranking}</span>
                 </div>
                 <div className="text-[10px] font-bold text-indigo-200 uppercase tracking-wide">Tỷ lệ: <span className="text-white text-lg">{percent}%</span></div>
              </div>
            </div>
            
            {/* Progress Bar - Glowing */}
            <div className="relative h-2 w-full bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
               <div 
                 className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)] bg-white`}
                 style={{ width: `${percent}%` }}
               ></div>
            </div>
          </div>
        </div>

        {/* Action Button - Gradient & Hover Effects */}
        <button 
          onClick={() => setShowPreview(true)}
          className="shrink-0 w-full py-3.5 px-4 bg-gradient-to-r from-slate-800 to-slate-900 dark:from-indigo-600 dark:to-blue-600 text-white rounded-xl font-bold shadow-lg shadow-slate-300/50 dark:shadow-indigo-900/50 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 group border border-white/10"
        >
           <Eye size={18} className="group-hover:animate-pulse text-indigo-300 dark:text-white" />
           <span className="text-xs uppercase tracking-wider">Xem Báo Cáo</span>
        </button>

        {/* Flexible Chart Area - Clean & Minimalist */}
        <div className="flex-1 min-h-0 flex flex-col gap-3">
           {/* Chart 1: Pie */}
           <div className="flex-1 min-h-0 bg-white dark:bg-slate-900/50 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col">
              <div className="shrink-0 flex items-center justify-between mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                 <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                    <div className="p-1 rounded bg-indigo-50 dark:bg-slate-800 text-indigo-500">
                        <TrendingUp size={14} />
                    </div>
                    Cấu trúc điểm
                 </h3>
              </div>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryScores}
                      cx="50%"
                      cy="50%"
                      innerRadius="50%"
                      outerRadius="80%"
                      paddingAngle={4}
                      dataKey="score"
                      stroke="none"
                    >
                      {categoryScores.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => value.toFixed(2)}
                      contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.95)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '11px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={24} 
                      iconSize={8}
                      formatter={(value) => <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 ml-1">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* Chart 2: Bar */}
           <div className="flex-1 min-h-0 bg-white dark:bg-slate-900/50 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col">
              <div className="shrink-0 flex items-center justify-between mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                 <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                    <div className="p-1 rounded bg-indigo-50 dark:bg-slate-800 text-indigo-500">
                        <BarChart3 size={14} />
                    </div>
                    Chi tiết hạng mục
                 </h3>
              </div>
              <div className="flex-1 w-full min-h-0 text-[10px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={categoryScores}
                      margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" opacity={0.3} />
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis 
                        dataKey="shortName" 
                        type="category" 
                        width={60} 
                        tick={{fill: '#64748b', fontSize: 10, fontWeight: 600}} 
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        cursor={{fill: 'transparent'}}
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-slate-800/95 backdrop-blur text-white text-[11px] p-2.5 rounded-lg shadow-xl border border-white/10">
                                <p className="font-bold mb-1 border-b border-white/10 pb-1">{label}</p>
                                <div className="flex justify-between gap-4">
                                   <span>Đạt được:</span>
                                   <span className="font-mono font-bold">{Number(payload[0].value).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between gap-4 text-emerald-300">
                                   <span>Tỷ lệ:</span>
                                   <span className="font-mono font-bold">{(payload[0].payload as any).percentage}%</span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="score" name="Điểm" radius={[0, 4, 4, 0]} barSize={14}>
                        {categoryScores.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                      <Bar dataKey="max" name="Tối đa" radius={[0, 4, 4, 0]} barSize={14} fill="#f1f5f9" className="opacity-50 -z-10" />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>
      </div>

      {/* 
        PREVIEW / PRINTABLE AREA 
        Updated print classes to force absolute positioning at top-left of the BODY,
        ensuring it captures the full A4 size without parent overflow constraints.
        Removed 'hidden' from print conditional logic to rely on print:block.
      */}
      <div 
        id="print-overlay" 
        className={`${showPreview ? "fixed inset-0 z-40 bg-slate-900/90 backdrop-blur-sm overflow-y-auto p-4 md:p-8 flex justify-center animate-in fade-in duration-200" : "hidden"} print:block print:absolute print:top-0 print:left-0 print:w-full print:h-auto print:bg-white print:p-0 print:m-0 print:z-[100] print:overflow-visible`}
      >
         <div 
           id="printable-dashboard" 
           className="bg-white shadow-2xl w-[210mm] min-h-[297mm] origin-top transform scale-75 md:scale-90 lg:scale-100 transition-transform print:transform-none print:shadow-none print:m-0 print:w-[210mm] print:h-auto"
         >
            <DashboardReport 
              ratings={ratings}
              selectedMonth={selectedMonth}
              totalScore={totalScore}
              maxTotalScore={maxTotalScore}
              percent={percent}
              ranking={ranking}
              categoryScores={categoryScores}
              employeeInfo={employeeInfo}
              logoUrl={logoUrl}
            />
         </div>
      </div>
    </>
  );
};

export default ResultsPanel;