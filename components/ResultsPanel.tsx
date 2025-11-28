import React, { useState } from 'react';
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
import { Printer, Loader2, Eye, X, Download, FileCheck } from 'lucide-react';
import DashboardReport from './DashboardReport';
import { EmployeeInfo } from '../App';

interface ResultsPanelProps {
  ratings: EvaluationState;
  selectedMonth: string;
  employeeInfo: EmployeeInfo;
  logoUrl: string | null;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ ratings, selectedMonth, employeeInfo, logoUrl }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // Calculate scores
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
    totalScore += catScore;
    maxTotalScore += catMax;
    
    // Normalize score to 100 for comparison
    const percentage = catMax > 0 ? Math.round((catScore / catMax) * 100) : 0;
    
    // Better short name logic
    let shortName = cat.name;
    if (cat.name.includes("VẬN HÀNH")) shortName = "Vận hành";
    else if (cat.name.includes("THIẾT BỊ")) shortName = "Thiết bị";
    else if (cat.name.includes("NHÂN SỰ")) shortName = "Nhân sự";
    else if (cat.name.includes("BÁO CÁO")) shortName = "Báo cáo";

    return { 
      name: cat.name.split('.')[1].trim(), 
      shortName: shortName,
      score: Number(catScore.toFixed(2)), 
      max: catMax, 
      percentage: percentage,
      fullMark: 100 
    };
  });

  // Fix floating point precision issues for total score
  totalScore = Math.round(totalScore * 100) / 100;

  const percent = maxTotalScore > 0 ? Math.round((totalScore / maxTotalScore) * 100) : 0;
  const ranking = percent >= 95 ? "Xuất sắc" : percent >= 80 ? "Khá/Tốt" : percent >= 50 ? "Trung bình" : "Yếu";

  const COLORS = ['#3b82f6', '#22c55e', '#eab308', '#f97316'];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // Strategy: Use the printable-dashboard (which has ID for this purpose)
    const element = document.getElementById('printable-dashboard');
    
    if (!element) {
      alert("Không tìm thấy nội dung báo cáo.");
      return;
    }

    setIsDownloadingPdf(true);

    // Options configuration for professional A4 output
    const opt = {
      margin: 0, 
      filename: `KPI_Bao_Cao_${selectedMonth}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, // High resolution
        useCORS: true, 
        logging: false,
        scrollY: 0
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    const wasHidden = element.classList.contains('hidden');
    if (wasHidden) {
      element.classList.remove('hidden');
      element.classList.add('block');
    }

    // @ts-ignore
    if (window.html2pdf) {
      // @ts-ignore
      window.html2pdf().set(opt).from(element).save().then(() => {
        setIsDownloadingPdf(false);
        if (wasHidden) {
          element.classList.add('hidden');
          element.classList.remove('block');
        }
      }).catch((err: any) => {
        console.error("PDF generation error:", err);
        setIsDownloadingPdf(false);
        if (wasHidden) {
          element.classList.add('hidden');
          element.classList.remove('block');
        }
      });
    } else {
      alert("Trình tạo PDF chưa tải xong, vui lòng thử lại sau giây lát.");
      setIsDownloadingPdf(false);
      if (wasHidden) {
          element.classList.add('hidden');
          element.classList.remove('block');
      }
    }
  };

  return (
    <>
      {/* Main Interactive Panel */}
      <div className={`bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 sticky top-6 transition-colors ${showPreview ? 'invisible h-0 overflow-hidden' : ''}`}>
        {/* Header Summary */}
        <div className="p-6 bg-slate-900 dark:bg-black text-white rounded-t-xl transition-colors">
          <h2 className="text-xl font-semibold mb-2 opacity-90">Tổng Kết KPI</h2>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-bold tracking-tight">{totalScore}</span>
            <span className="text-xl opacity-60 mb-2">/ {maxTotalScore} điểm</span>
          </div>
          <div className="mt-4 w-full bg-slate-700 h-3 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${percent >= 95 ? 'bg-green-500' : percent >= 80 ? 'bg-blue-500' : 'bg-orange-500'}`} 
              style={{ width: `${percent}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm opacity-75">
            <span>Hiệu suất vận hành</span>
            <span>{percent}%</span>
          </div>
        </div>

        <div className="p-6 space-y-8">
          
          {/* Dashboard Charts */}
          <div className="no-print space-y-6">
            <div>
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Cơ cấu điểm</h3>
              <div className="h-64 w-full bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 p-2 transition-colors">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryScores}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="score"
                      nameKey="shortName"
                    >
                      {categoryScores.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#fff' }} 
                      formatter={(value: number, name: string) => [`${value} điểm`, name]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Chi tiết điểm thành phần</h3>
              <div className="h-48 w-full bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 p-2 transition-colors">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryScores} layout="vertical" margin={{ left: 0, right: 30, top: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#cbd5e1" strokeOpacity={0.3} />
                    <XAxis type="number" hide domain={[0, 'dataMax']} />
                    <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 11, fill: '#64748b'}} interval={0} />
                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.1)'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="score" name="Điểm đạt" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={16} />
                    <Bar dataKey="max" name="Tối đa" fill="#e2e8f0" radius={[0, 4, 4, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 no-print">
              <button onClick={() => setShowPreview(true)} className="flex items-center justify-center gap-2 p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm shadow-blue-200 dark:shadow-none">
                  <Eye size={16} />
                  Xem Báo cáo
              </button>
              <button 
                onClick={handleDownloadPDF} 
                disabled={isDownloadingPdf}
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                 {isDownloadingPdf ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                 Tải về PDF
              </button>
          </div>
        </div>
      </div>

      {/* Full Screen Preview Modal */}
      {showPreview && (
         <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm no-print">
               <div className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                 <FileCheck className="text-blue-500" />
                 Xem trước Báo cáo
               </div>
               <div className="flex items-center gap-4">
                  <button 
                    onClick={handleDownloadPDF} 
                    disabled={isDownloadingPdf}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 shadow-md shadow-red-500/20"
                  >
                     {isDownloadingPdf ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                     Tải PDF
                  </button>
                  <button 
                    onClick={handlePrint} 
                    className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md"
                  >
                     <Printer size={16} />
                     In
                  </button>
                  <button onClick={() => setShowPreview(false)} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                     <X size={16} />
                     Đóng
                  </button>
               </div>
            </div>
            
            <div className="flex-1 overflow-auto bg-slate-100 dark:bg-slate-950 p-8 flex justify-center">
               {/* 
                  PREVIEW WRAPPER:
                  Enforces 210mm width for preview consistency.
                  This should remain WHITE (Paper look) even in Dark Mode.
               */}
               <div id="preview-report-content" className="bg-white shadow-2xl origin-top transform scale-90 md:scale-100 print:scale-100 print:shadow-none" style={{ width: '210mm', minHeight: '297mm' }}>
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
         </div>
      )}

      {/* 
        Printable Section (Hidden on screen, Used for PDF/Print)
        This has ID 'printable-dashboard' for targeting.
        CRITICAL: Fixed width to 210mm to prevent cutting.
      */}
      <div id="printable-dashboard" className="hidden print:block" style={{ width: '210mm', minHeight: '297mm', background: 'white' }}>
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
    </>
  );
};

export default ResultsPanel;