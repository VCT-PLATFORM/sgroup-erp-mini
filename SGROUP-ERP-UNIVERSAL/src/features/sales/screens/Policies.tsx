/**
 * Policies — Chính sách bán hàng & nội quy
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { BookOpen, ChevronDown, ChevronUp, Shield, Gift, Clock, AlertTriangle, Users } from 'lucide-react-native';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { sgds } from '../../../shared/theme/theme';
import { SGPlanningSectionTitle } from '../../../shared/ui/components';

type PolicySection = {
  id: string;
  title: string;
  icon: any;
  color: string;
  items: string[];
};

const MOCK_POLICIES: PolicySection[] = [
  {
    id: '1', title: 'Chính Sách Hoa Hồng', icon: Gift, color: '#22c55e',
    items: [
      '• Hoa hồng cơ bản: 1.5% – 2.0% giá trị HĐMB tùy dự án.',
      '• Hệ số thưởng vượt target: ×1.2 khi đạt 120% KPI, ×1.5 khi đạt 150% KPI.',
      '• Hoa hồng được giải ngân sau khi khách hoàn tất đợt thanh toán thứ 2.',
      '• Trường hợp khách hủy cọc: hoa hồng bị thu hồi 100%.',
    ]
  },
  {
    id: '2', title: 'Quy Trình Booking & Giao Dịch', icon: Shield, color: '#3b82f6',
    items: [
      '• Thời gian giữ chỗ tối đa: 48 giờ kể từ lúc khóa căn trên hệ thống.',
      '• Khách hàng phải đặt cọc tối thiểu 50 triệu VNĐ trong 48h.',
      '• Mỗi NVKD được giữ chỗ tối đa 3 căn cùng lúc.',
      '• Sau 48h không đặt cọc, căn hộ tự động mở bán lại.',
    ]
  },
  {
    id: '3', title: 'Nội Quy Làm Việc', icon: Clock, color: '#f59e0b',
    items: [
      '• Giờ làm việc: 8:00 – 17:30 (Thứ 2 – Thứ 7). Chủ nhật nghỉ luân phiên.',
      '• Check-in qua ứng dụng trước 8:15. Đi trễ 3 lần/tháng = trừ 1 ngày phép.',
      '• Báo cáo hoạt động hàng ngày trước 17:00 (qua Quick Add trên Dashboard).',
      '• Tham gia họp Team Sales sáng thứ 2 hàng tuần (bắt buộc).',
    ]
  },
  {
    id: '4', title: 'Xử Lý Vi Phạm', icon: AlertTriangle, color: '#ef4444',
    items: [
      '• Cắt booking của NVKD khác: Cảnh cáo lần 1, kỷ luật lần 2.',
      '• Tự ý giảm giá ngoài chính sách: Chịu bù phần chênh lệch.',
      '• Không hoàn thành KPI 3 tháng liên tiếp: Xem xét chuyển vị trí.',
      '• Vi phạm bảo mật thông tin khách hàng: Xử lý theo quy định pháp luật.',
    ]
  },
  {
    id: '5', title: 'Chính Sách Đào Tạo & Phát Triển', icon: Users, color: '#8b5cf6',
    items: [
      '• NVKD mới được đào tạo 2 tuần về sản phẩm, quy trình và kỹ năng bán hàng.',
      '• Mỗi quý tổ chức 1 workshop nâng cao kỹ năng (Đàm phán, Closing, CRM).',
      '• Top 3 NVKD xuất sắc nhất quý được tham gia chương trình "Leadership Track".',
      '• Hỗ trợ chi phí thi chứng chỉ BĐS (tối đa 5 triệu VNĐ/năm).',
    ]
  },
];

export function Policies() {
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
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#8b5cf6', textTransform: 'uppercase', marginBottom: 4 }}>NỘI QUY & QUY ĐỊNH</Text>
          <Text style={{ fontSize: 28, fontWeight: '900', color: cText, letterSpacing: -0.5 }}>Chính Sách Bán Hàng</Text>
          <Text style={{ fontSize: 14, fontWeight: '600', color: cSub, marginTop: 8 }}>
            Cập nhật lần cuối: 01/03/2026 • Phiên bản 2.1
          </Text>
        </View>

        {/* Accordion List */}
        <View style={{ gap: 12 }}>
          {MOCK_POLICIES.map(section => {
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
