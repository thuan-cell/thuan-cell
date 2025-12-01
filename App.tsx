import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import InputSection from './components/InputSection';
import ResultsPanel from './components/ResultsPanel';
import { EvaluationState, RatingLevel } from './types';
import { KPI_DATA } from './constants';
import { Sun, Moon, User, Building2, Briefcase, CreditCard, Calendar, Upload, Image as ImageIcon, Flame, Info, Printer, Download, X, Loader2, Factory, ChevronRight } from 'lucide-react';
import DashboardReport from './components/DashboardReport';

export interface EmployeeInfo {
  name: string;
  id: string;
  position: string;
  department: string;
  reportDate: string;
}

function App() {
  const [ratings, setRatings] = useState<EvaluationState>({});
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  
  // Initialize dark mode state based on what was set in index.html (localStorage or default true)
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return true;
  });
  
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  
  // Preview and Print states
  const [showPreview, setShowPreview] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo>({
    name: '',
    id: '',
    position: '',
    department: '',
    reportDate: new Date().toISOString().slice(0, 10)
  });

  // Refs for date pickers
  const monthInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleRate = useCallback((id: string, level: RatingLevel, score: number) => {
    setRatings(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        level,
        actualScore: score,
        notes: prev[id]?.notes || ''
      }
    }));
  }, []);

  const handleNoteChange = useCallback((id: string, note: string) => {
    setRatings(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        notes: note
      }
    }));
  }, []);

  const handleInfoChange = (field: keyof EmployeeInfo, value: string) => {
    setEmployeeInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- CALCULATION LOGIC (Lifted from ResultsPanel) ---
  const { categoryScores, totalScore, maxTotalScore, percent, ranking } = useMemo(() => {
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
      
      catScore = Math.round(catScore * 100) / 100;
      totalScore += catScore;
      maxTotalScore += catMax;
      
      const percentage = catMax > 0 ? Math.round((catScore / catMax) * 100) : 0;
      
      let shortName = cat.name.split('.')[1]?.trim() || cat.name;

      // Clean short names for UI/Charts
      if (shortName.includes("VẬN HÀNH")) shortName = "Vận hành";
      else if (shortName.includes("AN TOÀN")) shortName = "An toàn";
      else if (shortName.includes("THIẾT BỊ")) shortName = "Thiết bị";
      else if (shortName.includes("NHÂN SỰ")) shortName = "Nhân sự";
      else if (shortName.includes("BÁO CÁO")) shortName = "Báo cáo";

      return { 
        id: cat.id,
        name: cat.name, 
        shortName: shortName,
        score: catScore, 
        max: catMax, 
        percentage: percentage
      };
    });

    totalScore = Math.round(totalScore * 100) / 100;
    const percent = maxTotalScore > 0 ? Math.round((totalScore / maxTotalScore) * 100) : 0;
    
    let ranking = "---";
    
    if (percent > 0) {
        if (percent >= 90) {
            ranking = "Xuất Sắc";
        } else if (percent >= 70) {
            ranking = "Đạt";
        } else {
            ranking = "Không Đạt";
        }
    }

    return { categoryScores, totalScore, maxTotalScore, percent, ranking };
  }, [ratings]);

  // --- Printing and PDF Logic ---
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('printable-dashboard');
    if (!element) {
      alert("Không tìm thấy nội dung báo cáo.");
      return;
    }

    setIsDownloadingPdf(true);

    const opt = {
      margin: 0, 
      filename: `KPI_Bao_Cao_${selectedMonth}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
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
        console.error("PDF error:", err);
        setIsDownloadingPdf(false);
        if (wasHidden) {
          element.classList.add('hidden');
          element.classList.remove('block');
        }
      });
    } else {
      alert("Đang tải thư viện PDF, vui lòng đợi...");
      setIsDownloadingPdf(false);
      if (wasHidden) {
          element.classList.add('hidden');
          element.classList.remove('block');
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500/30 print:bg-white transition-colors duration-300 overflow-hidden">
      
      {/* Decorative Background Mesh */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none no-print">
         <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-indigo-100/40 dark:bg-indigo-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
      </div>

      {/* Header */}
      <header className="shrink-0 z-50 w-full backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/60 dark:border-slate-800/60 no-print supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-[1920px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
               <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
               <div className="relative bg-slate-900 text-white p-2 rounded-lg shadow-xl ring-1 ring-slate-900/5">
                 <Factory size={20} strokeWidth={2} className="text-white" />
               </div>
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight leading-none uppercase">
                Hệ thống KPI <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400">Lò Hơi</span>
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                 <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase bg-slate-100 dark:bg-slate-800 px-1.5 py-0 rounded">V 2.0</span>
                 <span className="text-[9px] font-medium text-slate-400 tracking-wide">Quản lý vận hành & Hiệu suất</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-amber-400 hover:bg-white dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-amber-300 transition-all shadow-sm active:scale-95 hover:shadow-md"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Full Height Flex Container */}
      <main className="flex-1 relative z-10 w-full max-w-[1920px] mx-auto overflow-hidden">
        <div className="flex flex-col xl:flex-row h-full">
          
          {/* Left Column: Form & Inputs - Scrollable Independently */}
          <div className="flex-1 order-2 xl:order-1 no-print min-w-0 h-full overflow-y-auto scroll-smooth custom-scrollbar">
            {/* WIDENED CONTAINER */}
            <div className="p-4 md:p-8 lg:p-10 space-y-8 max-w-[1600px] mx-auto">
              
              {/* Employee Info Card - REDESIGNED & BEAUTIFIED */}
              <div className="group relative bg-white dark:bg-slate-900 rounded-3xl shadow-sm hover:shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300">
                {/* Decorative Top Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                <div className="px-6 md:px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-100 dark:border-slate-700 shadow-sm">
                       <User size={20} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                      <span className="uppercase tracking-wide">Thông tin nhân sự</span>
                      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Cập nhật hồ sơ đánh giá</span>
                    </div>
                  </h2>
                  
                  <div className="relative">
                    <input 
                      type="file" 
                      id="logo-upload" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleLogoUpload}
                    />
                    <label 
                      htmlFor="logo-upload" 
                      className="cursor-pointer group/btn flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-4 py-2.5 rounded-xl transition-all border border-slate-200 dark:border-slate-700 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      {companyLogo ? (
                        <>
                          <div className="w-5 h-5 rounded-full overflow-hidden border border-slate-200 bg-white flex items-center justify-center">
                             <img src={companyLogo} alt="Logo" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-emerald-600 dark:text-emerald-400">Đã tải Logo</span>
                        </>
                      ) : (
                        <>
                          <Upload size={14} className="group-hover/btn:-translate-y-0.5 transition-transform" />
                          <span>Tải Logo</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div className="p-6 md:p-8 bg-slate-50/30 dark:bg-slate-900/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
                    
                    {/* Name */}
                    <div className="xl:col-span-2 space-y-2 group/input">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1 group-focus-within/input:text-indigo-600 transition-colors">
                          Họ và tên nhân viên
                        </label>
                        <div className="relative">
                           <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within/input:text-indigo-500 transition-colors">
                             <User size={18} />
                           </div>
                           <input 
                             type="text" 
                             placeholder="Nhập họ tên đầy đủ..."
                             className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 placeholder:text-slate-400 placeholder:font-normal shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all hover:border-slate-300 dark:hover:border-slate-700"
                             value={employeeInfo.name}
                             onChange={(e) => handleInfoChange('name', e.target.value)}
                           />
                        </div>
                    </div>

                    {/* ID */}
                    <div className="space-y-2 group/input">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1 group-focus-within/input:text-indigo-600 transition-colors">
                          Mã nhân viên
                        </label>
                        <div className="relative">
                           <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within/input:text-indigo-500 transition-colors">
                             <CreditCard size={18} />
                           </div>
                           <input 
                             type="text" 
                             placeholder="VD: NV-001"
                             className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 placeholder:text-slate-400 placeholder:font-normal shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all hover:border-slate-300 dark:hover:border-slate-700"
                             value={employeeInfo.id}
                             onChange={(e) => handleInfoChange('id', e.target.value)}
                           />
                        </div>
                    </div>

                    {/* Position */}
                    <div className="space-y-2 group/input">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1 group-focus-within/input:text-indigo-600 transition-colors">
                          Chức vụ
                        </label>
                        <div className="relative">
                           <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within/input:text-indigo-500 transition-colors">
                             <Briefcase size={18} />
                           </div>
                           <input 
                             type="text" 
                             placeholder="VD: Trưởng ca"
                             className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 placeholder:text-slate-400 placeholder:font-normal shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all hover:border-slate-300 dark:hover:border-slate-700"
                             value={employeeInfo.position}
                             onChange={(e) => handleInfoChange('position', e.target.value)}
                           />
                        </div>
                    </div>
                    
                    {/* Department */}
                    <div className="space-y-2 group/input">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1 group-focus-within/input:text-indigo-600 transition-colors">
                          Bộ phận / Phòng ban
                        </label>
                        <div className="relative">
                           <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within/input:text-indigo-500 transition-colors">
                             <Building2 size={18} />
                           </div>
                           <input 
                             type="text" 
                             placeholder="VD: Kỹ thuật"
                             className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 placeholder:text-slate-400 placeholder:font-normal shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all hover:border-slate-300 dark:hover:border-slate-700"
                             value={employeeInfo.department}
                             onChange={(e) => handleInfoChange('department', e.target.value)}
                           />
                        </div>
                    </div>

                    {/* Report Month - Enhanced with Clickable Icon */}
                    <div className="space-y-2 group/input">
                       <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1 group-focus-within/input:text-indigo-600 transition-colors">
                         Kỳ đánh giá
                      </label>
                       <div className="relative">
                         <div 
                            onClick={() => monthInputRef.current?.showPicker()}
                            className="absolute inset-y-0 left-0 pl-4 flex items-center cursor-pointer text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 group-focus-within/input:text-indigo-500 transition-colors z-10"
                            title="Mở lịch chọn tháng"
                         >
                             <Calendar size={18} />
                         </div>
                         <input 
                          ref={monthInputRef}
                          type="month" 
                          className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700"
                          value={selectedMonth}
                          onChange={(e) => setSelectedMonth(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Report Date - Enhanced with Clickable Icon */}
                    <div className="space-y-2 group/input">
                       <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1 group-focus-within/input:text-indigo-600 transition-colors">
                         Ngày lập báo cáo
                      </label>
                      <div className="relative">
                         <div 
                            onClick={() => dateInputRef.current?.showPicker()}
                            className="absolute inset-y-0 left-0 pl-4 flex items-center cursor-pointer text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 group-focus-within/input:text-indigo-500 transition-colors z-10"
                            title="Mở lịch chọn ngày"
                         >
                             <Calendar size={18} />
                         </div>
                         <input 
                          ref={dateInputRef}
                          type="date" 
                          className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700"
                          value={employeeInfo.reportDate}
                          onChange={(e) => handleInfoChange('reportDate', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-2 pt-2">
                 <div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                      Chi tiết đánh giá KPI
                      <ChevronRight size={24} className="text-slate-300 dark:text-slate-700" />
                    </h2>
                 </div>
              </div>
              
              <InputSection 
                ratings={ratings} 
                onRate={handleRate} 
                onNoteChange={handleNoteChange} 
              />

              {/* Ranking Legend - Redesigned */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-1 bg-indigo-500 rounded-full"></div>
                    <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
                       Quy định xếp loại
                    </h3>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { title: "XUẤT SẮC", range: "90 - 100%", desc: "Hoàn thành xuất sắc nhiệm vụ, không xảy ra sự cố, tuân thủ tuyệt đối quy trình.", color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/10", border: "border-emerald-200 dark:border-emerald-900/30", decoration: "bg-emerald-500" },
                      { title: "ĐẠT YÊU CẦU", range: "70 - 90%", desc: "Hoàn thành nhiệm vụ được giao, còn sai sót nhỏ nhưng đã khắc phục kịp thời.", color: "text-blue-700 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/10", border: "border-blue-200 dark:border-blue-900/30", decoration: "bg-blue-500" },
                      { title: "KHÔNG ĐẠT", range: "< 70%", desc: "Vi phạm quy trình vận hành, để xảy ra sự cố nghiêm trọng hoặc thiếu trách nhiệm.", color: "text-rose-700 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-900/10", border: "border-rose-200 dark:border-rose-900/30", decoration: "bg-rose-500" }
                    ].map((item, i) => (
                      <div key={i} className={`relative p-5 rounded-xl border ${item.bg} ${item.border} hover:shadow-lg transition-all duration-300 group`}>
                         <div className={`absolute top-0 left-0 w-full h-1 rounded-t-xl ${item.decoration} opacity-50`}></div>
                         <div className="flex justify-between items-start mb-3">
                            <span className={`text-base font-black ${item.color}`}>{item.title}</span>
                            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 ${item.color} shadow-sm ring-1 ring-inset ring-black/5`}>{item.range}</span>
                         </div>
                         <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed opacity-90">{item.desc}</p>
                      </div>
                    ))}
                 </div>
              </div>
              
              {/* Padding at bottom to ensure last element is scrollable into view */}
              <div className="h-12"></div>
            </div>
          </div>

          {/* Right Column: Results & Tools - Sticky Side on Desktop */}
          {/* OPTIMIZED: Modern Floating Frame for Results Panel */}
          <div className="w-full xl:w-[440px] 2xl:w-[480px] order-1 xl:order-2 print:hidden flex-shrink-0 xl:h-full flex flex-col p-4 xl:p-8 xl:pl-0 pointer-events-none xl:pointer-events-auto z-20">
             {/* THE FRAME */}
             <div className="w-full h-auto xl:h-full bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-indigo-500/10 border border-slate-200 dark:border-slate-800 flex flex-col relative overflow-hidden pointer-events-auto transition-transform duration-300 hover:scale-[1.005]">
                
                {/* Decorative Top Line */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                
                {/* Background Glows */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                <div className="flex-1 flex flex-col p-6 xl:p-8 relative z-10 overflow-hidden">
                    <ResultsPanel 
                      // Pass calculated props
                      categoryScores={categoryScores}
                      totalScore={totalScore}
                      percent={percent}
                      ranking={ranking}
                      selectedMonth={selectedMonth} 
                      showPreview={showPreview}
                      setShowPreview={setShowPreview}
                      onPrint={handlePrint}
                    />
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* Hidden Print/Preview Overlay - MOVED TO ROOT OF APP to avoid transformation clipping */}
      <div 
        id="print-overlay" 
        className={`${showPreview ? "fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-sm overflow-y-auto p-4 flex justify-center animate-in fade-in duration-200" : "hidden"} print:block print:absolute print:top-0 print:left-0 print:w-full print:h-auto print:bg-white print:p-0 print:m-0 print:z-[100] print:overflow-visible`}
      >
         {/* FLOATING ACTION TOOLBAR - Visible only in Preview Mode */}
         {showPreview && (
            <div className="fixed top-6 right-6 z-[70] flex items-center gap-2 p-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl print:hidden animate-in slide-in-from-top-4 duration-500">
                <button 
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-slate-900 hover:bg-slate-200 text-xs font-bold transition-all active:scale-95 shadow-sm"
                >
                  <Printer size={16} />
                  <span>In Báo Cáo</span>
                </button>
                <button 
                  onClick={handleDownloadPDF}
                  disabled={isDownloadingPdf}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all active:scale-95 shadow-lg shadow-indigo-500/30 disabled:opacity-70"
                >
                  {isDownloadingPdf ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                  <span>Tải PDF</span>
                </button>
                <div className="w-px h-6 bg-white/20 mx-1"></div>
                <button 
                  onClick={() => setShowPreview(false)}
                  className="p-2 rounded-lg hover:bg-white/20 text-white transition-all active:scale-95"
                  title="Đóng xem trước"
                >
                  <X size={20} />
                </button>
            </div>
         )}

         <div 
           id="printable-dashboard" 
           className="bg-white shadow-2xl w-[210mm] min-h-[297mm] origin-top transform transition-transform print:transform-none print:shadow-none print:m-0"
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
              logoUrl={companyLogo}
            />
         </div>
      </div>
      
      {/* Scrollbar styling injected */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.3);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.5);
        }
      `}</style>
    </div>
  );
}

export default App;