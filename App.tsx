import React, { useState, useCallback, useEffect } from 'react';
import InputSection from './components/InputSection';
import ResultsPanel from './components/ResultsPanel';
import { EvaluationState, RatingLevel } from './types';
import { Factory, Moon, Sun, User, Building2, Briefcase, IdCard, Calendar } from 'lucide-react';

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
  const [darkMode, setDarkMode] = useState(false);
  
  // State cho thông tin nhân viên
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo>({
    name: '',
    id: '',
    position: '',
    department: '',
    reportDate: new Date().toISOString().slice(0, 10)
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
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

  return (
    <div className="min-h-screen pb-12 print:pb-0 print:bg-white transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 shadow-sm no-print transition-colors duration-300">
        <div className="w-full px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-500/30">
              <Factory size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white leading-none">Boiler KPI</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Hệ thống đánh giá quản lý lò hơi</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Full Width Layout */}
      <main className="w-full px-4 md:px-6 lg:px-8 py-6 print:p-0">
        <div className="flex flex-col xl:flex-row gap-6 print:block">
          
          {/* Left Column: Form */}
          <div className="flex-1 order-2 xl:order-1 no-print min-w-0 space-y-6">
            
            {/* Employee Info Form */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                Thông tin nhân viên
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <User size={12} /> Họ và tên
                  </label>
                  <input 
                    type="text" 
                    placeholder="Nhập họ tên..." 
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={employeeInfo.name}
                    onChange={(e) => handleInfoChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <IdCard size={12} /> Mã nhân viên
                  </label>
                  <input 
                    type="text" 
                    placeholder="Nhập mã NV..." 
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={employeeInfo.id}
                    onChange={(e) => handleInfoChange('id', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Briefcase size={12} /> Chức vụ
                  </label>
                  <input 
                    type="text" 
                    placeholder="Nhập chức vụ..." 
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={employeeInfo.position}
                    onChange={(e) => handleInfoChange('position', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Building2 size={12} /> Bộ phận
                  </label>
                  <input 
                    type="text" 
                    placeholder="Nhập bộ phận..." 
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={employeeInfo.department}
                    onChange={(e) => handleInfoChange('department', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                   <label className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Calendar size={12} /> Kỳ đánh giá (Tháng)
                  </label>
                   <input 
                    type="month" 
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                   <label className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Calendar size={12} /> Ngày lập báo cáo
                  </label>
                   <input 
                    type="date" 
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={employeeInfo.reportDate}
                    onChange={(e) => handleInfoChange('reportDate', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Đánh Giá Chi Tiết</h2>
              <p className="text-slate-500 dark:text-slate-400">Chọn mức độ hoàn thành cho từng hạng mục công việc.</p>
            </div>
            
            <InputSection 
              ratings={ratings} 
              onRate={handleRate} 
              onNoteChange={handleNoteChange} 
            />
          </div>

          {/* Right Column: Results & Tools */}
          <div className="w-full xl:w-[420px] 2xl:w-[480px] order-1 xl:order-2 print:w-full flex-shrink-0">
            <ResultsPanel 
              ratings={ratings} 
              selectedMonth={selectedMonth} 
              employeeInfo={employeeInfo}
            />
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;