/**
 * PoliciesScreen — HR Policies and Regulations
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { BookOpen, ChevronDown, ChevronUp, Shield, Clock, AlertTriangle, Users, Briefcase } from 'lucide-react-native';
import { useAppTheme } from '../../../shared/theme/useAppTheme';

type PolicySection = {
  id: string;
  title: string;
  icon: any;
  color: string;
  items: string[];
};

const policies: PolicySection[] = [
  {
    id: '1', title: 'Quy Định Chấm Công & Nghỉ Phép', icon: Clock, color: '#f59e0b',
    items: [
      '• Giờ làm việc: 8:30 – 17:30, từ Thứ 2 đến Thứ 6',
      '• Chấp nhận đi trễ tối đa 3 lần/tháng (vượt quá tính nửa ngày không lương)',
      '• Nghỉ phép năm: 12 ngày/năm (sau khi qua thử việc)',
      '• Yêu cầu nộp đơn nghỉ phép tối thiểu trước 24h đối với nghỉ từ 1 ngày',
      '• Check-in hợp lệ: kết nối Wi-Fi Công ty hoặc check-in tại văn phòng',
    ],
  },
  {
    id: '2', title: 'Chính Sách Lương & Phúc Lợi', icon: Briefcase, color: '#10b981',
    items: [
      '• Chu kỳ tính lương: từ ngày 01 đến ngày cuối cùng của tháng',
      '• Ngày trả lương: mùng 05 hàng tháng (nếu rơi vào cuối tuần/lễ sẽ lùi/tiến 1 ngày)',
      '• BHXH, BHYT, BHTN: Công ty đóng 21.5%, Người lao động trích đóng 10.5%',
      '• Phụ cấp ăn trưa: 50,000đ/ngày công thực tế',
      '• Khám sức khỏe định kỳ: 1 lần/năm tại Bệnh viện đa khoa quốc tế',
    ],
  },
  {
    id: '3', title: 'Quy Tắc Văn Hóa SGroup', icon: Users, color: '#8b5cf6',
    items: [
      '• Giao tiếp tôn trọng, minh bạch, cởi mở với đồng nghiệp',
      '• Không bè phái, nói xấu nội bộ gây mất đoàn kết',
      '• Khuyến khích đổi mới, đóng góp ý kiến xây dựng công ty',
      '• Tuân thủ trang phục lịch sự, chuyên nghiệp theo quy định',
      '• Giải quyết mâu thuẫn trực diện và báo cáo cấp quản lý khi cần thiết',
    ],
  },
  {
    id: '4', title: 'Thưởng Phạt & Kỷ Luật', icon: AlertTriangle, color: '#ef4444',
    items: [
      '• Thưởng nóng: Áp dụng cho cá nhân/tập thể có thành tích đột phá',
      '• Kỷ luật nhẹ: Khiển trách bằng văn bản (đi trễ nhiều lần, vi phạm nội quy nhỏ)',
      '• Kỷ luật nặng: Kéo dài thời hạn nâng lương, cách chức (vi phạm quy trình nghiêm trọng)',
      '• Sa thải: Rò rỉ thông tin mật, tham ô, trục lợi cá nhân, bôi nhọ danh dự công ty',
    ],
  },
  {
    id: '5', title: 'Quy Định Bảo Mật Thông Tin', icon: Shield, color: '#3b82f6',
    items: [
      '• Mọi tài liệu nội bộ (chính sách, bảng lương, báo cáo) là tài sản công ty',
      '• Không sao chép, phát tán dữ liệu khách hàng ra bên ngoài',
      '• Cấm chia sẻ tài khoản ERP cá nhân cho người khác',
      '• Sử dụng email công ty đuôi @sgroup.vn chỉ cho công việc',
    ],
  },
];

export function PoliciesScreen() {
  const { theme, isDark } = useAppTheme();
  const cText = theme.colors.textPrimary;
  const cSub = theme.colors.textSecondary;
  const [expandedId, setExpandedId] = useState<string | null>('1');

  const cardStyle: any = {
    backgroundColor: isDark ? 'rgba(20,24,35,0.45)' : '#fff', borderRadius: 24, padding: 0,
    borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    overflow: 'hidden',
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? theme.colors.background : theme.colors.backgroundAlt }}>
      <ScrollView contentContainerStyle={{ padding: 32, gap: 24, paddingBottom: 120 }}>
        {/* Header */}
        <View>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#ec4899', textTransform: 'uppercase', marginBottom: 4 }}>NHÂN SỰ</Text>
          <Text style={{ fontSize: 28, fontWeight: '900', color: cText, letterSpacing: -0.5 }}>Chính Sách Cẩm Nang SGroup</Text>
          <Text style={{ fontSize: 14, fontWeight: '600', color: cSub, marginTop: 8 }}>
            Cập nhật lần cuối: 01/01/2026 • Ban Hành: Giám Đốc Nhân Sự
          </Text>
        </View>

        {/* Accordion List */}
        <View style={{ gap: 12 }}>
          {policies.map(section => {
            const isExpanded = expandedId === section.id;
            const SectionIcon = section.icon;
            return (
              <View key={section.id} style={cardStyle}>
                <TouchableOpacity
                  onPress={() => setExpandedId(isExpanded ? null : section.id)}
                  style={{
                    flexDirection: 'row', alignItems: 'center', padding: 24, gap: 16,
                    backgroundColor: isExpanded ? (isDark ? `${section.color}10` : `${section.color}08`) : 'transparent',
                  }}
                >
                  <View style={{
                    width: 44, height: 44, borderRadius: 14,
                    backgroundColor: isDark ? `${section.color}20` : `${section.color}15`,
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <SectionIcon size={22} color={section.color} />
                  </View>
                  <Text style={{ flex: 1, fontSize: 17, fontWeight: '800', color: cText }}>{section.title}</Text>
                  {isExpanded
                    ? <ChevronUp size={20} color={cSub} />
                    : <ChevronDown size={20} color={cSub} />
                  }
                </TouchableOpacity>

                {isExpanded && (
                  <View style={{ paddingHorizontal: 24, paddingBottom: 24, paddingTop: 8, gap: 12, borderTopWidth: 1, borderTopColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9' }}>
                    {section.items.map((item, idx) => (
                      <Text key={idx} style={{ fontSize: 14, fontWeight: '600', color: isDark ? '#cbd5e1' : '#475569', lineHeight: 24 }}>
                        {item}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
