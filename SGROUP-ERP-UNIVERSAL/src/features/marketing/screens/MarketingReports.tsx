/**
 * MarketingReports — Analytics and reporting cards
 */
import React from 'react';
import { View, Text } from 'react-native';
import { BarChart3, TrendingUp, PieChart, Activity, Download } from 'lucide-react-native';
import {
  SGPageContainer,
  SGButton,
  SGCard
} from '../../../shared/ui';
import { useTheme, typography, spacing } from '../../../shared/theme/theme';

export function MarketingReports() {
  const c = useTheme();

  return (
    <SGPageContainer>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <View style={{ width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: '#D97706' }}>
            <BarChart3 size={26} color="#fff" />
          </View>
          <View>
            <Text style={{ fontSize: 26, fontWeight: '900', color: c.text }}>BÁO CÁO PHÂN TÍCH</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: c.textSecondary, marginTop: 3 }}>
              Insight & báo cáo chuyên sâu tự động
            </Text>
          </View>
        </View>
        <SGButton title="Xuất Báo Cáo" icon={<Download size={20} color={c.textInverse} />} onPress={() => {}} />
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 24 }}>
         <SGCard style={{ flex: 1, minWidth: 320, padding: spacing.xl, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 64, height: 64, borderRadius: 24, backgroundColor: '#D977061A', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
               <TrendingUp size={32} color="#D97706" />
            </View>
            <Text style={[typography.h3, { color: c.text, marginBottom: 8, textAlign: 'center' }]}>Báo cáo ROI Chiến dịch</Text>
            <Text style={[typography.body, { color: c.textSecondary, textAlign: 'center', marginBottom: 24 }]}>
              Phân tích lợi tức đầu tư chi tiết theo từng chiến dịch và kênh quảng cáo.
            </Text>
            <SGButton title="Xem Báo Cáo" variant="outline" onPress={() => {}} />
         </SGCard>
         
         <SGCard style={{ flex: 1, minWidth: 320, padding: spacing.xl, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 64, height: 64, borderRadius: 24, backgroundColor: '#3b82f61A', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
               <PieChart size={32} color="#3b82f6" />
            </View>
            <Text style={[typography.h3, { color: c.text, marginBottom: 8, textAlign: 'center' }]}>Phân bổ Nguồn Lead</Text>
            <Text style={[typography.body, { color: c.textSecondary, textAlign: 'center', marginBottom: 24 }]}>
              Thống kê chi tiết tỷ lệ chuyển đổi MQL/SQL theo từng nguồn gốc đổ về CRM.
            </Text>
            <SGButton title="Xem Báo Cáo" variant="outline" onPress={() => {}} />
         </SGCard>

         <SGCard style={{ flex: 1, minWidth: 320, padding: spacing.xl, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 64, height: 64, borderRadius: 24, backgroundColor: '#8b5cf61A', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
               <Activity size={32} color="#8b5cf6" />
            </View>
            <Text style={[typography.h3, { color: c.text, marginBottom: 8, textAlign: 'center' }]}>Phân tích Creative/Ads</Text>
            <Text style={[typography.body, { color: c.textSecondary, textAlign: 'center', marginBottom: 24 }]}>
              Đo lường độ "fatigue" của creative và so sánh tỷ lệ A/B testing nội dung quảng cáo.
            </Text>
            <SGButton title="Xem Báo Cáo" variant="outline" onPress={() => {}} />
         </SGCard>
      </View>
    </SGPageContainer>
  );
}
