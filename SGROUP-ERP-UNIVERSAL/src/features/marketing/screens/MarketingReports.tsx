/**
 * MarketingReports — Analytics and reporting cards
 */
import React from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import { BarChart3, TrendingUp, PieChart, Activity, Download } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { SGButton } from '../../../shared/ui';

export function MarketingReports() {
  const { theme, isDark } = useAppTheme();
  const cText = theme.colors.textPrimary;
  const cSub = theme.colors.textSecondary;

  const card: any = {
    backgroundColor: isDark ? 'rgba(20,24,35,0.45)' : '#fff', borderRadius: 24, padding: 32,
    borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(32px)', boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.06)' } : {}),
    flex: 1, minWidth: 320,
    alignItems: 'center', justifyContent: 'center'
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? theme.colors.background : theme.colors.backgroundAlt }}>
      <ScrollView contentContainerStyle={{ padding: 32, gap: 24, paddingBottom: 120 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <LinearGradient colors={['#D97706', '#B45309']} style={{ width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}>
              <BarChart3 size={26} color="#fff" />
            </LinearGradient>
            <View>
              <Text style={{ fontSize: 26, fontWeight: '900', color: cText }}>BÁO CÁO PHÂN TÍCH</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#94a3b8', marginTop: 3 }}>Insight & báo cáo chuyên sâu tự động</Text>
            </View>
          </View>
          <SGButton title="Xuất Báo Cáo" icon={Download as any} onPress={() => {}} />
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 24 }}>
           <View style={card}>
              <View style={{ width: 64, height: 64, borderRadius: 24, backgroundColor: '#D977061A', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                 <TrendingUp size={32} color="#D97706" />
              </View>
              <Text style={{ fontSize: 18, fontWeight: '800', color: cText, marginBottom: 8 }}>Báo cáo ROI Chiến dịch</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: cSub, textAlign: 'center', marginBottom: 24 }}>Phân tích lợi tức đầu tư chi tiết theo từng chiến dịch và kênh quảng cáo.</Text>
              <SGButton title="Xem Báo Cáo" variant="outline" onPress={() => {}} />
           </View>
           
           <View style={card}>
              <View style={{ width: 64, height: 64, borderRadius: 24, backgroundColor: '#3b82f61A', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                 <PieChart size={32} color="#3b82f6" />
              </View>
              <Text style={{ fontSize: 18, fontWeight: '800', color: cText, marginBottom: 8 }}>Phân bổ Nguồn Lead</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: cSub, textAlign: 'center', marginBottom: 24 }}>Thống kê chi tiết tỷ lệ chuyển đổi MQL/SQL theo từng nguồn gốc đổ về CRM.</Text>
              <SGButton title="Xem Báo Cáo" variant="outline" onPress={() => {}} />
           </View>

           <View style={card}>
              <View style={{ width: 64, height: 64, borderRadius: 24, backgroundColor: '#8b5cf61A', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                 <Activity size={32} color="#8b5cf6" />
              </View>
              <Text style={{ fontSize: 18, fontWeight: '800', color: cText, marginBottom: 8 }}>Phân tích Creative/Ads</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: cSub, textAlign: 'center', marginBottom: 24 }}>Đo lường độ "fatigue" của creative và so sánh tỷ lệ A/B testing nội dung quảng cáo.</Text>
              <SGButton title="Xem Báo Cáo" variant="outline" onPress={() => {}} />
           </View>
        </View>
      </ScrollView>
    </View>
  );
}
