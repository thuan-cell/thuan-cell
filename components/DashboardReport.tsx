import React from 'react';
import { KPI_DATA } from '../constants';
import { EvaluationState } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { CheckCircle2 } from 'lucide-react';
import { EmployeeInfo } from '../App';

interface DashboardReportProps {
  ratings: EvaluationState;
  selectedMonth: string;
  totalScore: number;
  maxTotalScore: number;
  percent: number;
  ranking: string;
  categoryScores: any[];
  employeeInfo: EmployeeInfo;
}

const DashboardReport: React.FC<DashboardReportProps> = ({
  ratings,
  selectedMonth,
  totalScore,
  maxTotalScore,
  percent,
  ranking,
  categoryScores,
  employeeInfo
}) => {
  const [year, month] = selectedMonth.split('-');
  const reportDateObj = employeeInfo.reportDate ? new Date(employeeInfo.reportDate) : new Date();

  const COLORS = ['#3b82f6', '#22c55e', '#eab308', '#f97316'];

  return (
    // Reduced padding to p-6 (approx 24px) to save space
    <div className="bg-white text-slate-900 font-sans w-full p-6 relative leading-tight">
      {/* --- HEADER --- */}
      <div className="flex border-b border-slate-900 pb-2 mb-2 items-center">
        <div className="w-1/4 flex flex-col items-center justify-center border-r border-slate-200 pr-4">
           {/* LOGO AREA */}
           <img 
              src="https://placehold.co/400x150/ffffff/0047AB?text=TRIVIET+BIOGEN&font=poppins" 
              alt="TRIVIET BIOGEN Logo" 
              className="w-full max-h-10 object-contain" 
           />
           <div className="text-[6px] text-green-600 mt-0.5 font-bold uppercase tracking-widest text-center">Năng lượng sạch, vì một tương lai xanh</div>
        </div>
        <div className="w-3/4 pl-4 flex flex-col justify-center">
           <h1 className="text-xl font-bold text-blue-900 uppercase tracking-wide">Báo Cáo Hiệu Quả Công Việc (KPI)</h1>
           <div className="flex justify-between items-end mt-1">
             <div className="text-slate-600 font-bold text-[10px] uppercase bg-slate-100 px-2 py-0.5 rounded">Dành cho cấp Quản lý / Vận hành Lò hơi</div>
             <div className="flex gap-4 text-[9px]">
                <div><span className="text-slate-500">Kỳ đánh giá:</span> <span className="font-bold text-slate-900">Tháng {month}/{year}</span></div>
                <div><span className="text-slate-500">Ngày lập:</span> <span className="font-bold text-slate-900">{reportDateObj.toLocaleDateString('vi-VN')}</span></div>
             </div>
           </div>
        </div>
      </div>

      {/* --- EMPLOYEE INFO (Single Row Compact) --- */}
      <div className="bg-slate-50 border border-slate-200 rounded p-2 mb-2 grid grid-cols-4 gap-4 text-[9px]">
         <div className="flex flex-col border-r border-slate-200 pr-2">
            <span className="text-slate-500 uppercase text-[8px] mb-0.5">Họ và tên</span>
            <span className="font-bold uppercase text-blue-900 text-[10px]">{employeeInfo.name || '................................'}</span>
         </div>
         <div className="flex flex-col border-r border-slate-200 pr-2">
            <span className="text-slate-500 uppercase text-[8px] mb-0.5">Mã nhân viên</span>
            <span className="font-bold text-slate-800">{employeeInfo.id || '................................'}</span>
         </div>
         <div className="flex flex-col border-r border-slate-200 pr-2">
            <span className="text-slate-500 uppercase text-[8px] mb-0.5">Chức vụ</span>
            <span className="font-bold text-slate-800">{employeeInfo.position || '................................'}</span>
         </div>
         <div className="flex flex-col">
            <span className="text-slate-500 uppercase text-[8px] mb-0.5">Bộ phận</span>
            <span className="font-bold text-slate-800">{employeeInfo.department || '................................'}</span>
         </div>
      </div>

      {/* --- DASHBOARD VISUALS (Compact Height) --- */}
      <div className="grid grid-cols-3 gap-3 mb-2 h-32">
         {/* KPI SCORE CARD */}
         <div className="col-span-1 bg-white rounded border border-slate-200 p-1 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 p-1 opacity-5">
               <CheckCircle2 size={50} />
            </div>
            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tổng Điểm</div>
            <div className="text-4xl font-extrabold text-blue-900 leading-none mb-1">{Number(totalScore).toFixed(2)}</div>
            <div className="text-slate-400 text-[9px] font-medium mb-2">/ {maxTotalScore} điểm tối đa</div>
            <div className={`px-3 py-0.5 rounded-full text-[9px] font-bold border ${
               percent >= 95 ? 'bg-green-100 text-green-800 border-green-200' :
               percent >= 80 ? 'bg-blue-100 text-blue-800 border-blue-200' :
               'bg-orange-100 text-orange-800 border-orange-200'
            }`}>
               XẾP LOẠI: {ranking.toUpperCase()}
            </div>
         </div>

         {/* PIE CHART */}
         <div className="col-span-1 border border-slate-200 rounded p-1 relative shadow-sm flex items-center justify-center">
            <div className="absolute top-1 left-2 text-[8px] font-bold text-slate-500 uppercase tracking-wider">Cơ cấu điểm</div>
            <PieChart width={200} height={120}>
               <Pie
                  data={categoryScores}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={45}
                  paddingAngle={2}
                  dataKey="score"
                  nameKey="shortName"
                  isAnimationActive={false}
                  labelLine={false}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return percent > 0.05 ? (
                        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={7} fontWeight="bold">
                          {`${(percent * 100).toFixed(0)}%`}
                        </text>
                      ) : null;
                  }}
               >
                  {categoryScores.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
               </Pie>
               <Legend iconSize={6} wrapperStyle={{ fontSize: '7px', bottom: 0 }} layout="horizontal" align="center" verticalAlign="bottom" />
            </PieChart>
         </div>

         {/* BAR CHART */}
         <div className="col-span-1 border border-slate-200 rounded p-1 relative shadow-sm flex items-center justify-center">
            <div className="absolute top-1 left-2 text-[8px] font-bold text-slate-500 uppercase tracking-wider">Chi tiết theo mục</div>
            <BarChart width={200} height={120} data={categoryScores} margin={{ top: 20, right: 5, left: -25, bottom: 0 }}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
               <XAxis dataKey="shortName" tick={{fontSize: 7, fill: '#0f172a', fontWeight: 600}} interval={0} />
               <YAxis tick={{fontSize: 7, fill: '#64748b'}} domain={[0, 'dataMax']} />
               <Bar dataKey="max" fill="#cbd5e1" radius={[2, 2, 0, 0]} barSize={8} name="Tối đa" isAnimationActive={false} />
               <Bar dataKey="score" fill="#1e3a8a" radius={[2, 2, 0, 0]} barSize={8} name="Đạt được" isAnimationActive={false} />
               <Legend iconSize={6} wrapperStyle={{ fontSize: '7px', paddingTop: '2px' }} />
            </BarChart>
         </div>
      </div>

      {/* --- DETAILED TABLE (Condensed) --- */}
      <div className="mb-2">
         <h3 className="text-[9px] font-bold text-white bg-blue-900 uppercase py-0.5 px-2 mb-0 rounded-t inline-block">Bảng điểm chi tiết</h3>
         <div className="border-t border-blue-900">
            <table className="w-full text-[9px] border-collapse">
                <thead>
                <tr className="bg-slate-100 text-slate-800 uppercase font-bold">
                    <th className="border border-slate-300 px-1 py-0.5 text-center w-6">TT</th>
                    <th className="border border-slate-300 px-1 py-0.5 text-left">Nội dung / Tiêu chí đánh giá</th>
                    <th className="border border-slate-300 px-1 py-0.5 text-center w-8">Max</th>
                    <th className="border border-slate-300 px-1 py-0.5 text-center w-8">Đạt</th>
                    <th className="border border-slate-300 px-1 py-0.5 text-center w-14">Xếp loại</th>
                    <th className="border border-slate-300 px-1 py-0.5 text-left w-[320px]">Ghi chú</th>
                </tr>
                </thead>
                <tbody>
                {KPI_DATA.map(category => (
                    <React.Fragment key={category.id}>
                        <tr className="bg-blue-50/50 font-bold text-blue-900">
                            <td className="border border-slate-300 px-1 py-0.5 text-center">{category.id.split('_')[1]}</td>
                            <td className="border border-slate-300 px-1 py-0.5" colSpan={5}>{category.name}</td>
                        </tr>
                        {category.items.map(item => {
                            const rating = ratings[item.id];
                            return (
                            <tr key={item.id}>
                                <td className="border border-slate-300 px-1 py-0.5 text-center text-slate-500">{item.code}</td>
                                <td className="border border-slate-300 px-1 py-0.5">
                                    <div className="font-semibold text-slate-800 text-[8.5px]">{item.name}</div>
                                    <div className="text-slate-500 italic mt-0.5 text-[7.5px] leading-tight">
                                        {rating ? item.criteria[rating.level].description : `Mục tiêu: ${item.criteria['GOOD'].description}`}
                                    </div>
                                </td>
                                <td className="border border-slate-300 px-1 py-0.5 text-center text-slate-500">{item.maxPoints}</td>
                                <td className="border border-slate-300 px-1 py-0.5 text-center font-bold text-slate-800">{rating ? rating.actualScore : 0}</td>
                                <td className="border border-slate-300 px-1 py-0.5 text-center">
                                    {rating ? (
                                        <span className={`inline-flex items-center gap-0.5 px-1 py-0 rounded text-[7px] font-bold border ${
                                        rating.level === 'GOOD' ? 'bg-green-50 text-green-700 border-green-200' :
                                        rating.level === 'AVERAGE' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                        'bg-red-50 text-red-700 border-red-200'
                                        }`}>
                                        {rating.level === 'GOOD' ? 'TỐT' : rating.level === 'AVERAGE' ? 'KHÁ' : 'YẾU'}
                                        </span>
                                    ) : <span className="text-slate-300">-</span>}
                                </td>
                                <td className="border border-slate-300 px-1 py-0.5 text-slate-600 whitespace-normal break-words">{rating?.notes}</td>
                            </tr>
                            );
                        })}
                    </React.Fragment>
                ))}
                </tbody>
            </table>
         </div>
      </div>

      {/* --- SIGNATURES (Compact Spacing) --- */}
      <div className="grid grid-cols-3 gap-8 mt-4 pt-1">
         <div className="text-center">
            <div className="font-bold text-[8px] uppercase mb-8 text-slate-800">Người được đánh giá</div>
            <div className="border-t border-slate-300 w-24 mx-auto pt-1 text-[9px] font-bold text-slate-900 uppercase">
                {employeeInfo.name || '.....................'}
            </div>
         </div>
         <div className="text-center">
            <div className="font-bold text-[8px] uppercase mb-8 text-slate-800">Người đánh giá</div>
            <div className="border-t border-slate-300 w-24 mx-auto pt-1 text-[8px] text-slate-400 italic">Ký & ghi rõ họ tên</div>
         </div>
         <div className="text-center">
            <div className="font-bold text-[8px] uppercase mb-8 text-slate-800">Giám đốc phê duyệt</div>
            <div className="border-t border-slate-300 w-24 mx-auto pt-1 text-[8px] text-slate-400 italic">Ký & ghi rõ họ tên</div>
         </div>
      </div>
    </div>
  );
};

export default DashboardReport;