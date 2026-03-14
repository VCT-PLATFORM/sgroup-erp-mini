import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useTheme, typography } from '../../../shared/theme/theme';
import { useThemeStore } from '../../../shared/theme/themeStore';
import { SGCard, SGButton } from '../../../shared/ui';
import { Plus, Percent, CalendarClock, ChevronRight, CheckCircle2 } from 'lucide-react-native';

const MOCK_POLICIES = [
  { 
    id: '1', name: 'Chiết khấu Thanh toán sớm 95%', 
    startDate: '01/10/2023', endDate: '31/12/2023',
    status: 'ACTIVE',
    rules: ['Chiết khấu 8% vào giá bán', 'Miễn phí quản lý 2 năm', 'Tặng gói nội thất 100tr'],
    color: '#10b981'
  },
  { 
    id: '2', name: 'Chính sách Vay NH 70% Ân hạn gốc lãi', 
    startDate: '15/10/2023', endDate: '15/01/2024',
    status: 'ACTIVE',
    rules: ['Bảo lãnh NH MBBank', 'Hỗ trợ lãi suất 0% trong 18 tháng', 'Ân hạn nợ gốc 18 tháng'],
    color: '#3b82f6'
  },
  { 
    id: '3', name: 'Hoa hồng Đại lý Quý 4/2023', 
    startDate: '01/10/2023', endDate: '31/12/2023',
    status: 'DRAFT',
    rules: ['Phí MG căn tiêu chuẩn: 2.5%', 'Phí MG căn góc: 3%', 'Thưởng nóng 20tr/căn'],
    color: '#f59e0b'
  },
];

export function ProjectPolicies() {
  const colors = useTheme();
  const { isDark } = useThemeStore();
  const [activeTab, setActiveTab] = useState('active');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={[typography.h2, { color: colors.text }]}>Chính sách Bán hàng</Text>
          <Text style={[typography.body, { color: colors.textSecondary, marginTop: 8 }]}>
            Thiết lập chiết khấu, tiến độ thanh toán và phí môi giới
          </Text>
        </View>
        <SGButton title="Thêm Chính sách" icon={<Plus size={18} color="#fff" />} variant="primary" onPress={() => {}} />
      </View>

      <View style={{ flexDirection: 'row', gap: 24, flex: 1 }}>
        {/* Left Column: List */}
        <View style={{ flex: 1.5 }}>
          <SGCard style={{ flex: 1, padding: 24 }}>
            <View style={{ flexDirection: 'row', gap: 24, marginBottom: 24, borderBottomWidth: 1, borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
              {['active', 'draft'].map(tab => (
                <TouchableOpacity 
                  key={tab} 
                  onPress={() => setActiveTab(tab)}
                  style={{ paddingBottom: 12, borderBottomWidth: 2, borderBottomColor: activeTab === tab ? '#10b981' : 'transparent' }}
                >
                  <Text style={[typography.body, { 
                    color: activeTab === tab ? '#10b981' : colors.textSecondary,
                    fontWeight: activeTab === tab ? '700' : '600'
                  }]}>
                    {tab === 'active' ? 'Đang áp dụng' : 'Bản nháp / Đã đóng'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingBottom: 40 }}>
              {MOCK_POLICIES.filter(p => activeTab === 'active' ? p.status === 'ACTIVE' : p.status === 'DRAFT').map(policy => (
                <TouchableOpacity key={policy.id} style={[styles.policyCard, {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#fff',
                  borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                  borderLeftColor: policy.color, borderLeftWidth: 4,
                }]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={[typography.h4, { color: colors.text, marginBottom: 8 }]}>{policy.name}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <CalendarClock size={14} color={colors.textTertiary} style={{ marginRight: 6 }} />
                          <Text style={[typography.micro, { color: colors.textSecondary }]}>{policy.startDate} - {policy.endDate}</Text>
                        </View>
                        <View style={{ backgroundColor: `${policy.color}15`, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                          <Text style={[typography.micro, { color: policy.color, fontWeight: '700' }]}>{policy.status === 'ACTIVE' ? 'HIỆU LỰC' : 'NHÁP'}</Text>
                        </View>
                      </View>
                    </View>
                    <ChevronRight size={20} color={colors.textTertiary} />
                  </View>
                  
                  <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', gap: 8 }}>
                    {policy.rules.map((r, i) => (
                      <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <CheckCircle2 size={14} color={policy.color} style={{ marginRight: 8 }} />
                        <Text style={[typography.body, { color: colors.textSecondary }]}>{r}</Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </SGCard>
        </View>

        {/* Right Column: Mini Dashboard or Placeholder */}
        <View style={{ flex: 1 }}>
          <SGCard style={{ padding: 24, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: isDark ? 'rgba(16,185,129,0.1)' : '#ecfdf5', justifyContent: 'center', alignItems: 'center', marginBottom: 24 }}>
              <Percent size={40} color="#10b981" />
            </View>
            <Text style={[typography.h3, { color: colors.text, marginBottom: 12, textAlign: 'center' }]}>Chính sách Bán hàng</Text>
            <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center', paddingHorizontal: 20 }]}>
              Chọn một chính sách bên trái để xem chi tiết các điều khoản, tiến độ thanh toán và đối tượng áp dụng.
            </Text>
            <SGButton title="Xem tài liệu hướng dẫn" variant="outline" style={{ marginTop: 32 }} />
          </SGCard>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingBottom: 0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 },
  policyCard: { padding: 20, borderRadius: 16, borderWidth: 1 }
});
