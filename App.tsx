import React, { useState, useCallback, useEffect } from 'react';
import InputSection from './components/InputSection';
import ResultsPanel from './components/ResultsPanel';
import { EvaluationState, RatingLevel } from './types';
import { Sun, Moon, User, Building2, Briefcase, CreditCard, Calendar, Upload, Image as ImageIcon, Flame, Info, Printer, Download, X, Loader2, Factory, ChevronRight, LayoutDashboard, FileBarChart, History, Settings, Bell, Search } from 'lucide-react';

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
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo>({
    name: '',
    id: '',
    position: '',
    department: '',
    reportDate: new Date().toISOString().slice(0, 10)
  });

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

  // --- Printing Logic ---
  const handlePrint = () => {
    // Ensure preview is visible before printing
    setShowPreview(true);
    
    // Open system print dialog
    // We use a small timeout to let the UI rendering settle if it wasn't open yet
    setTimeout(() => {
      window.print();
    }, 500);
  };

  // --- PDF Download Logic ---
  const handleDownloadPDF = async () => {
    if (isGeneratingPdf) return;
    
    // 1. Ensure preview is visible so DOM exists
    setShowPreview(true);
    setIsGeneratingPdf(true);

    // 2. Wait for DOM to fully render the preview content
    await new Promise(resolve => setTimeout(resolve, 800));

    const element = document.getElementById('printable-dashboard');
    if (!element) {
      setIsGeneratingPdf(false);
      alert("Không tìm thấy nội dung báo cáo. Vui lòng thử lại.");
      return;
    }

    try {
      // 3. Create a temporary container for PDF generation
      // Position fixed at 0,0 with very low z-index to be invisible but technically "on screen"
      const container = document.createElement('div');
      container.style.position = 'fixed'; 
      container.style.top = '0';
      container.style.left = '0';
      // Use pixel width for A4 (210mm @ 96dpi approx 794px) to ensure html2canvas precision
      container.style.width = '794px'; 
      container.style.zIndex = '-10000'; 
      container.style.backgroundColor = '#ffffff'; 
      
      // 4. Clone the report
      const clone = element.cloneNode(true) as HTMLElement;
      
      // 5. Clean up the clone's styles to be print-ready
      // Instead of stripping all classes, we only remove transforms/shadows that affect capture
      // and enforce white background and full width.
      clone.classList.remove('shadow-2xl', 'transform', 'scale-75', 'md:scale-90', 'lg:scale-100', 'transition-transform');
      clone.classList.add('bg-white');
      
      // Force exact dimensions and reset all positioning
      clone.style.width = '794px'; 
      clone.style.maxWidth = '794px';
      clone.style.minHeight = '1123px'; // A4 height @ 96dpi
      clone.style.margin = '0';
      clone.style.padding = '0';
      clone.style.position = 'absolute';
      clone.style.top = '0';
      clone.style.left = '0';
      clone.style.transform = 'none';
      clone.style.boxShadow = 'none';
      clone.style.overflow = 'hidden';

      container.appendChild(clone);
      document.body.appendChild(container);

      // 6. Configuration for html2pdf
      const opt = {
        margin: 0, 
        filename: `KPI_BaoCao_${selectedMonth}_${employeeInfo.id || 'NV'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          logging: false,
          scrollY: 0, 
          scrollX: 0,
          // Constrain the window width to avoid capturing whitespace from wide screens
          windowWidth: 800, 
          width: 794,
          backgroundColor: '#ffffff'
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // @ts-ignore
      if (typeof window.html2pdf !== 'undefined') {
        // @ts-ignore
        await window.html2pdf().set(opt).from(clone).save();
      } else {
        alert("Thư viện in ấn chưa tải xong. Vui lòng kiểm tra kết nối mạng và thử lại.");
      }
      
      // 7. Cleanup
      document.body.removeChild(container);

    } catch (err: any) {
      console.error("PDF generation failed", err);
      alert("Có lỗi xảy ra khi tạo PDF: " + (err.message || "Lỗi không xác định"));
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    // Added print:overflow-visible, print:h-auto, print:static to fix clipping issues
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500/30 print:bg-white print:h-auto print:overflow-visible print:static transition-colors duration-300 overflow-hidden relative">
      
      {/* Premium Background Gradient Mesh - Hidden on print */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none print:hidden">
         <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-gradient-to-b from-indigo-200/20 to-transparent dark:from-indigo-900/10 rounded-full blur-3xl opacity-60"></div>
         <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-gradient-to-t from-blue-200/20 to-transparent dark:from-blue-900/10 rounded-full blur-3xl opacity-60"></div>
      </div>

      {/* Header - Enterprise Design */}
      <header className="shrink-0 z-50 w-full bg-slate-900 text-white border-b border-white/10 print:hidden sticky top-0 shadow-2xl shadow-black/50 relative overflow-hidden">
        
        {/* Top Accent Gradient */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>

        {/* Glossy Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

        <div className="max-w-[1920px] mx-auto px-4 md:px-6 h-[70px] flex items-center justify-between relative z-10">
          
          {/* LEFT: Brand Identity */}
          <div className="flex items-center gap-5">
            {/* Logo Box */}
            <div className="relative group cursor-pointer">
               <div className="absolute -inset-2 bg-indigo-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition duration-500"></div>
               <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-950 rounded-xl border border-white/10 shadow-inner group-hover:border-indigo-500/50 transition-colors">
                 <Factory size={20} className="text-indigo-400 drop-shadow-[0_0_5px_rgba(129,140,248,0.5)]" />
               </div>
            </div>

            {/* Title & Subtitle */}
            <div className="flex flex-col justify-center">
              <h1 className="text-xl font-black tracking-tight text-white uppercase leading-none flex items-center gap-2 drop-shadow-md">
                HỆ THỐNG KPI <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">LÒ HƠI</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                 <div className="flex items-center px-1.5 py-0.5 rounded bg-white/5 border border-white/10 backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                    <span className="text-[9px] font-bold text-slate-300 tracking-widest uppercase">V 2.0 ENTERPRISE</span>
                 </div>
              </div>
            </div>
          </div>
          
          {/* RIGHT: User & Tools */}
          <div className="flex items-center gap-3 md:gap-4">
            
            {/* Search (Visual) */}
            <div className="hidden lg:flex items-center relative group">
               <Search size={14} className="absolute left-3 text-slate-500 group-hover:text-slate-300 transition-colors" />
               <input 
                 type="text" 
                 placeholder="Tìm kiếm..." 
                 className="bg-black/20 border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/50 focus:bg-black/40 transition-all w-32 focus:w-48 placeholder:text-slate-600"
               />
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-white/10 mx-1 hidden md:block"></div>

            {/* Notification */}
            <button className="relative p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
               <Bell size={18} />
               <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 border border-slate-900"></span>
            </button>

            {/* Existing Tools (Preview, Theme) */}
            <div className="flex items-center gap-2">
                {showPreview && (
                  <div className="hidden md:flex items-center gap-2 animate-in fade-in slide-in-from-right-8 duration-300 border-r border-white/10 pr-4 mr-2">
                    
                    {/* Print / Select Printer Button */}
                    <button 
                      onClick={handlePrint}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-500/30 active:scale-95 border border-indigo-400/30"
                      title="Mở hộp thoại in của hệ thống để chọn máy in"
                    >
                      <Printer size={14} />
                      <span className="hidden lg:inline">In / Chọn máy in</span>
                      <span className="lg:hidden">In</span>
                    </button>

                    {/* Download PDF Button */}
                    <button 
                      onClick={handleDownloadPDF}
                      disabled={isGeneratingPdf}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-500/30 active:scale-95 border border-emerald-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Tải báo cáo dưới dạng file PDF"
                    >
                      {isGeneratingPdf ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                      <span className="hidden lg:inline">Tải PDF</span>
                      <span className="lg:hidden">PDF</span>
                    </button>

                    <button 
                      onClick={() => setShowPreview(false)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-slate-300 text-xs font-bold transition-all active:scale-95"
                    >
                      <X size={14} />
                      <span>Đóng</span>
                    </button>
                  </div>
                )}

                <button 
                  onClick={toggleTheme}
                  className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-yellow-400 hover:bg-white/10 transition-all"
                  aria-label="Toggle Dark Mode"
                >
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            </div>
            
            {/* User Avatar */}
            <div className="pl-2 hidden md:block">
               <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px] cursor-pointer hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center border border-white/10">
                     <User size={16} className="text-white" />
                  </div>
               </div>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content - Full Height Flex Container */}
      <main className="flex-1 relative z-10 w-full max-w-[1920px] mx-auto overflow-hidden print:overflow-visible print:h-auto print:block">
        <div className="flex flex-col xl:flex-row h-full print:block">
          
          {/* Left Column: Form & Inputs - Scrollable Independently */}
          <div className="flex-1 order-2 xl:order-1 print:hidden min-w-0 h-full overflow-y-auto scroll-smooth custom-scrollbar">
            <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto">
              
              {/* Employee Info Card - Premium Look */}
              <div className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-sm shadow-slate-200/50 dark:shadow-black/20 border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all duration-300">
                <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-50/50 to-white/50 dark:from-slate-800/30 dark:to-slate-900/30">
                  <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 uppercase tracking-wide">
                    <div className="p-1.5 bg-gradient-to-br from-indigo-100 to-white dark:from-indigo-900/50 dark:to-slate-800 rounded-lg text-indigo-600 dark:text-indigo-400 shadow-sm">
                       <User size={16} strokeWidth={2.5} />
                    </div>
                    Thông tin nhân sự
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
                      className="cursor-pointer flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg transition-all border border-slate-200 dark:border-slate-700 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 group-hover:shadow-indigo-100 dark:group-hover:shadow-none"
                    >
                      {companyLogo ? (
                        <>
                          <ImageIcon size={14} className="text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400">Logo OK</span>
                        </>
                      ) : (
                        <>
                          <Upload size={14} />
                          <span>Tải Logo</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div className="p-5 md:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {/* Styled Inputs */}
                    {[
                      { label: 'Họ và tên nhân viên', icon: User, key: 'name', placeholder: 'Nguyễn Văn A' },
                      { label: 'Mã số nhân viên', icon: CreditCard, key: 'id', placeholder: 'NV-001' },
                      { label: 'Chức vụ / Vị trí', icon: Briefcase, key: 'position', placeholder: 'Trưởng ca / Vận hành viên' },
                      { label: 'Bộ phận / Phòng ban', icon: Building2, key: 'department', placeholder: 'Phòng Kỹ thuật' },
                    ].map((field) => (
                      <div key={field.key} className="space-y-1.5 group/input">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 ml-1 transition-colors group-hover/input:text-indigo-600 dark:group-hover/input:text-indigo-400">
                          {field.label}
                        </label>
                        <div className="relative">
                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within/input:text-indigo-500 transition-colors">
                             <field.icon size={16} />
                           </div>
                           <input 
                             type="text" 
                             placeholder={field.placeholder}
                             className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-800 dark:text-white placeholder:text-slate-400/70 placeholder:font-normal focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all shadow-sm hover:border-slate-300 dark:hover:border-slate-700"
                             value={employeeInfo[field.key as keyof EmployeeInfo] as string}
                             onChange={(e) => handleInfoChange(field.key as keyof EmployeeInfo, e.target.value)}
                           />
                        </div>
                      </div>
                    ))}
                    
                    <div className="space-y-1.5 group/input">
                       <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 ml-1 group-hover/input:text-indigo-600">
                         Kỳ đánh giá
                      </label>
                       <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within/input:text-indigo-500">
                             <Calendar size={16} />
                         </div>
                         <input 
                          type="month" 
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-800 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm hover:border-slate-300 dark:hover:border-slate-700"
                          value={selectedMonth}
                          onChange={(e) => setSelectedMonth(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5 group/input">
                       <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 ml-1 group-hover/input:text-indigo-600">
                         Ngày báo cáo
                      </label>
                      <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within/input:text-indigo-500">
                             <Calendar size={16} />
                         </div>
                         <input 
                          type="date" 
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-800 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm hover:border-slate-300 dark:hover:border-slate-700"
                          value={employeeInfo.reportDate}
                          onChange={(e) => handleInfoChange('reportDate', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Title Section */}
              <div className="flex items-center justify-between px-2 pt-2">
                 <div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                      Đánh giá KPI
                      <ChevronRight size={24} className="text-slate-300 dark:text-slate-700" />
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">Hoàn thành bảng đánh giá dưới đây.</p>
                 </div>
                 <div className="hidden lg:flex items-center gap-2 text-[11px] font-bold text-indigo-600 dark:text-indigo-300 bg-white dark:bg-indigo-900/20 px-4 py-2 rounded-xl border border-indigo-100 dark:border-indigo-800/50 shadow-sm">
                    <Info size={14} className="text-indigo-500" />
                    <span>Tự động lưu & tính điểm</span>
                 </div>
              </div>
              
              <InputSection 
                ratings={ratings} 
                onRate={handleRate} 
                onNoteChange={handleNoteChange} 
              />

              {/* Ranking Legend - Clean Professional Look */}
              <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        <Flame size={16} />
                    </div>
                    <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
                       Tiêu chuẩn xếp loại
                    </h3>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { title: "XUẤT SẮC", range: "90 - 100%", desc: "Hoàn thành xuất sắc nhiệm vụ, không xảy ra sự cố, tuân thủ tuyệt đối quy trình.", color: "text-emerald-700 dark:text-emerald-400", bg: "bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-slate-900", border: "border-emerald-100 dark:border-emerald-900/30", decoration: "bg-emerald-500" },
                      { title: "ĐẠT YÊU CẦU", range: "70 - 90%", desc: "Hoàn thành nhiệm vụ được giao, còn sai sót nhỏ nhưng đã khắc phục kịp thời.", color: "text-blue-700 dark:text-blue-400", bg: "bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-slate-900", border: "border-blue-100 dark:border-blue-900/30", decoration: "bg-blue-500" },
                      { title: "KHÔNG ĐẠT", range: "< 70%", desc: "Vi phạm quy trình vận hành, để xảy ra sự cố nghiêm trọng hoặc thiếu trách nhiệm.", color: "text-rose-700 dark:text-rose-400", bg: "bg-gradient-to-br from-rose-50 to-white dark:from-rose-900/20 dark:to-slate-900", border: "border-rose-100 dark:border-rose-900/30", decoration: "bg-rose-500" }
                    ].map((item, i) => (
                      <div key={i} className={`relative p-5 rounded-xl border ${item.bg} ${item.border} hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300 group`}>
                         <div className={`absolute top-0 left-0 w-full h-1 rounded-t-xl ${item.decoration} opacity-70`}></div>
                         <div className="flex justify-between items-start mb-3">
                            <span className="text-sm font-black ${item.color}">{item.title}</span>
                            <span className="text-[10px] font-bold px-2 py-1 rounded bg-white dark:bg-slate-800 ${item.color} shadow-sm border border-current/10">{item.range}</span>
                         </div>
                         <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed opacity-90">{item.desc}</p>
                      </div>
                    ))}
                 </div>
              </div>
              
              {/* Padding at bottom */}
              <div className="h-12"></div>
            </div>
          </div>

          {/* Right Column: Results & Tools - Sticky Side on Desktop */}
          <div className="w-full xl:w-[420px] 2xl:w-[480px] order-1 xl:order-2 print:w-full print:block flex-shrink-0 bg-white/50 dark:bg-slate-900/20 xl:bg-transparent xl:h-full flex flex-col border-l border-slate-200/50 dark:border-slate-800/50 overflow-hidden backdrop-blur-sm xl:backdrop-blur-none print:bg-white print:border-none print:overflow-visible">
             <div className="p-3 md:p-4 w-full h-full flex flex-col print:p-0 print:h-auto">
                <ResultsPanel 
                  ratings={ratings} 
                  selectedMonth={selectedMonth} 
                  employeeInfo={employeeInfo}
                  logoUrl={companyLogo}
                  showPreview={showPreview}
                  setShowPreview={setShowPreview}
                />
             </div>
          </div>

        </div>
      </main>
      
      {/* Scrollbar styling injected */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
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