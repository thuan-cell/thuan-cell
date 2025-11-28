import { KPICategory, RatingLevel } from './types';

export const KPI_DATA: KPICategory[] = [
  {
    id: 'cat_1',
    name: '1. KẾT QUẢ VẬN HÀNH',
    items: [
      {
        id: '1.1',
        code: '1.1',
        name: 'Hoàn thành công việc được giao',
        maxPoints: 10,
        unit: '10đ',
        checklist: [
          'Đảm bảo sản lượng hơi đáp ứng đủ theo yêu cầu sản xuất',
          'Duy trì áp suất và nhiệt độ lò ổn định theo định mức',
          'Thực hiện đúng quy trình khởi động và dừng lò an toàn'
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: '≥100% kế hoạch', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: '95–99% kế hoạch', scorePercent: 0.8 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: '<95% kế hoạch', scorePercent: 0.5 },
        },
      },
      {
        id: '1.2',
        code: '1.2',
        name: 'Tỷ lệ sự cố gián đoạn cấp hơi',
        maxPoints: 10,
        unit: '10đ',
        checklist: [
          'Theo dõi thường xuyên, phát hiện sớm các bất thường',
          'Xử lý sự cố nhanh chóng, giảm thiểu thời gian dừng lò',
          'Phân tích nguyên nhân gốc rễ, đảm bảo không lỗi chủ quan'
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Không sự cố', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Có sự cố xử lý đúng quy trình', scorePercent: 0.8 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Sự cố do lỗi chủ quan', scorePercent: 0.0 },
        },
      },
      {
        id: '1.3',
        code: '1.3',
        name: 'Chất lượng hơi',
        maxPoints: 8,
        unit: '8đ',
        checklist: [
          'Kiểm soát độ khô và độ sạch của hơi cấp',
          'Đảm bảo áp suất tại điểm sử dụng không sụt áp đột ngột',
          'Không để xảy ra khiếu nại chất lượng từ sản xuất'
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Ổn định, không có khiếu nại của khác hàng', scorePercent: 1.0 },
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
        checklist: [
          'Vận hành chế độ cháy tối ưu, tránh dư/thiếu gió',
          'Giám sát chặt chẽ điện năng tiêu thụ (Quạt, Bơm)',
          'Kiểm soát tỷ lệ tiêu hao nhiên liệu so với định mức'
        ],
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
        checklist: [
          'Tuân thủ tuyệt đối quy tắc an toàn lao động và PPE',
          'Kiểm soát khói thải, bụi và nước thải ra môi trường',
          'Giữ gìn vệ sinh 5S khu vực làm việc sạch sẽ'
        ],
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
        checklist: [
          'Thực hiện đầy đủ lộ trình tuần tra thiết bị đầu ca/giữa ca',
          'Kiểm tra rung, nhiệt độ, tiếng ồn của Bơm, Quạt, Van',
          'Phát hiện sớm rò rỉ và các dấu hiệu bất thường'
        ],
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
        checklist: [
          'Ghi chép sổ nhật ký vận hành đầy đủ, chính xác',
          'Báo cáo ngay cho cấp trên các hư hỏng cần sửa chữa',
          'Đề xuất phương án vật tư thay thế kịp thời'
        ],
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
        checklist: [
          'Thực hiện đúng lịch bảo trì phòng ngừa (bôi trơn, vệ sinh)',
          'Thực hiện đúng quy trình bảo trì dừng lò định kỳ',
          'Nghiệm thu chất lượng thiết bị kỹ càng sau bảo trì'
        ],
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
        checklist: [
          'Kiểm tra – phát hiện nhanh hành vi sai quy trình',
          'Lập biên bản hoặc nhắc nhở đúng quy định',
          'Đưa ra biện pháp khắc phục ngay lập tức',
          'Theo dõi và ngăn sai phạm tái diễn',
          'Đề xuất đào tạo lại nhân viên nếu lặp lại lỗi'
        ],
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
        checklist: [
          'Đảm bảo quân số trực ca đầy đủ, đúng vị trí',
          'Sắp xếp nhân sự thay thế hợp lý khi có người nghỉ',
          'Bàn giao ca chi tiết, rõ ràng, không sót việc'
        ],
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
        checklist: [
          'Hướng dẫn nhân viên mới về quy trình vận hành/an toàn',
          'Chia sẻ bài học kinh nghiệm (OPL) sau sự cố',
          'Kiểm tra, đánh giá tay nghề nhân viên định kỳ'
        ],
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
        checklist: [
          'Tuân thủ mặc đồng phục và trang bị bảo hộ (PPE)',
          'Không sử dụng rượu bia, chất kích thích khi làm việc',
          'Tuân thủ nghiêm ngặt nội quy ra vào nhà máy'
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Vi phạm 1–2 lần', scorePercent: 0.9 },
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
        checklist: [
          'Gửi báo cáo ca, báo cáo sự cố qua Zalo/Email đúng giờ',
          'Báo cáo chính xác số liệu tồn kho nhiên liệu/hóa chất',
          'Cập nhật đầy đủ dữ liệu vào phần mềm quản lý'
        ],
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
        checklist: [
          'Giao tiếp lịch sự, chuyên nghiệp với các bộ phận liên quan',
          'Hỗ trợ nhiệt tình các bộ phận khác khi cần thiết',
          'Giải quyết xung đột trên tinh thần xây dựng'
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Có phối hợp nhưng chưa chủ động', scorePercent: 0.8 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Xung đột / không hỗ trợ', scorePercent: 0.5 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Gây hậu quả', scorePercent: 0.0 },
        },
      },
      {
        id: '4.3',
        code: '4.3',
        name: 'Hoàn thành công việc được giao khác',
        maxPoints: 3,
        unit: '3đ',
        checklist: [
          'Thực hiện tốt các nhiệm vụ phát sinh từ cấp trên',
          'Chủ động đề xuất ý kiến cải tiến công việc',
          'Sẵn sàng tăng ca hỗ trợ khi có yêu cầu gấp'
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Chậm nhẹ', scorePercent: 0.9 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Không hoàn thành', scorePercent: 0.5 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Bỏ việc', scorePercent: 0.0 },
        },
      },
    ],
  },
];