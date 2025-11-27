import { KPICategory, RatingLevel } from './types';

export const KPI_DATA: KPICategory[] = [
  {
    id: 'cat_1',
    name: '1. KẾT QUẢ VẬN HÀNH',
    items: [
      {
        id: '1.1',
        code: '1.1',
        name: 'Hoàn thành sản lượng / công việc',
        maxPoints: 10,
        unit: '10đ',
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: '≥100% kế hoạch', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: '95–99% kế hoạch', scorePercent: 0.8 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: '<95% kế hoạch', scorePercent: 0.5 },
        },
      },
      {
        id: '1.2',
        code: '1.2',
        name: 'Tỷ lệ sự cố / ngừng máy',
        maxPoints: 10,
        unit: '10đ',
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Không sự cố', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Có sự cố xử lý đúng quy trình', scorePercent: 0.8 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Sự cố do lỗi chủ quan', scorePercent: 0.0 },
        },
      },
      {
        id: '1.3',
        code: '1.3',
        name: 'Chất lượng hơi / sản phẩm đầu ra',
        maxPoints: 8,
        unit: '8đ',
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Ổn định, không phàn nàn', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Có chênh lệch nhỏ', scorePercent: 0.8 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Bị khách hàng phản ánh', scorePercent: 0.5 },
        },
      },
      {
        id: '1.4',
        code: '1.4',
        name: 'Hiệu suất & tiêu hao (Nhiên liệu - Điện - Nước)',
        maxPoints: 6,
        unit: '6đ',
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: '≤ mức chuẩn', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Vượt +5–10%', scorePercent: 0.7 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Vượt >10%', scorePercent: 0.0 },
        },
      },
      {
        id: '1.5',
        code: '1.5',
        name: 'An toàn – PCCC – Môi trường',
        maxPoints: 6,
        unit: '6đ',
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Không vi phạm', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Vi phạm nhỏ', scorePercent: 0.7 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Lặp lỗi hoặc sự cố nặng', scorePercent: 0.0 },
        },
      },
    ],
  },
  {
    id: 'cat_2',
    name: '2. QUẢN LÝ THIẾT BỊ',
    items: [
      {
        id: '2.1',
        code: '2.1',
        name: 'Kiểm tra nhà máy theo kế hoạch',
        maxPoints: 10,
        unit: '10đ',
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: '≥100% lượt kiểm tra', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: '80–99%', scorePercent: 0.8 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: '<80%', scorePercent: 0.5 },
        },
      },
      {
        id: '2.2',
        code: '2.2',
        name: 'Báo cáo kiểm tra thiết bị',
        maxPoints: 5,
        unit: '5đ',
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Đầy đủ – đúng hạn', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Thiếu mục / Trễ nhẹ', scorePercent: 0.7 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Không báo cáo', scorePercent: 0.0 },
        },
      },
      {
        id: '2.3',
        code: '2.3',
        name: 'Tuân thủ bảo trì PM/CM',
        maxPoints: 5,
        unit: '5đ',
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: '≥98%', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: '90–97%', scorePercent: 0.8 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: '<90%', scorePercent: 0.5 },
        },
      },
      {
        id: '2.4',
        code: '2.4',
        name: 'Phát hiện & xử lý sai phạm (SOP - 5S)',
        maxPoints: 5,
        unit: '5đ',
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Phát hiện & xử lý tốt', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Phát hiện muộn', scorePercent: 0.7 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Bỏ sót / Hậu quả lớn', scorePercent: 0.0 },
        },
      },
    ],
  },
  {
    id: 'cat_3',
    name: '3. QUẢN LÝ NHÂN SỰ',
    items: [
      {
        id: '3.1',
        code: '3.1',
        name: 'Duy trì nhân sự ca/kíp',
        maxPoints: 8,
        unit: '8đ',
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Đủ 100% ca', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Thiếu ca nhưng có bù', scorePercent: 0.8 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Thiếu gây ảnh hưởng', scorePercent: 0.4 },
        },
      },
      {
        id: '3.2',
        code: '3.2',
        name: 'Đào tạo – hướng dẫn nhân viên',
        maxPoints: 6,
        unit: '6đ',
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: '≥95% hoàn thành', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: '70–94%', scorePercent: 0.7 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: '<70%', scorePercent: 0.0 },
        },
      },
      {
        id: '3.3',
        code: '3.3',
        name: 'Kỷ luật – PPE – Nội quy',
        maxPoints: 6,
        unit: '6đ',
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Vi phạm 1–2 lần', scorePercent: 0.9 }, // Adjusted slightly for realism
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Vi phạm lặp lại, mức nặng', scorePercent: 0.5 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Vi phạm nghiêm trọng', scorePercent: 0.0 },
        },
      },
    ],
  },
  {
    id: 'cat_4',
    name: '4. BÁO CÁO',
    items: [
      {
        id: '4.1',
        code: '4.1',
        name: 'Báo cáo đầy đủ – đúng hạn',
        maxPoints: 7,
        unit: '7đ',
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Đủ, đúng hạn', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Trễ nhẹ', scorePercent: 0.8 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Thiếu hoặc không báo cáo', scorePercent: 0.0 },
        },
      },
      {
        id: '4.2',
        code: '4.2',
        name: 'Phối hợp phòng ban – khách hàng',
        maxPoints: 5,
        unit: '5đ',
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Có phối hợp nhưng chưa chủ động', scorePercent: 0.8 }, // Text says "Good" is actually "Not proactive enough"? Adjusting to image flow usually Good is best.
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Xung đột / không hỗ trợ', scorePercent: 0.5 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Gây hậu quả', scorePercent: 0.0 },
        },
      },
      {
        id: '4.3',
        code: '4.3',
        name: 'Hoàn thành công việc được giao',
        maxPoints: 3,
        unit: '3đ',
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Chậm nhẹ', scorePercent: 0.9 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Không hoàn thành', scorePercent: 0.0 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Bỏ việc', scorePercent: 0.0 },
        },
      },
    ],
  },
];