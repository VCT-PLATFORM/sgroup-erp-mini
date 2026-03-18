/**
 * MarketingPlanning — Uses marketing-planning API to show plan metrics
 */
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Target } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { marketingPlanningApi } from '../api/marketingApi';
import {
  SGPageContainer,
  SGCard,
} from '../../../shared/ui';
import { useTheme, typography, spacing } from '../../../shared/theme/theme';

export function MarketingPlanning() {
  const c = useTheme();

  // Use fixed planId for demo
  const mockPlanId = 'PLAN-2026-Q1';

  // Fetch data
  const { data: header, isLoading: headerLoading, error: headerErr } = useQuery({
    queryKey: ['mkt-plan-header', mockPlanId],
    queryFn: () => marketingPlanningApi.getHeader(mockPlanId),
    retry: 1,
  });

  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ['mkt-plan-kpis', mockPlanId],
    queryFn: () => marketingPlanningApi.getKpiTargets(mockPlanId),
    retry: 1,
  });

  const { data: assumptions, isLoading: asmLoading } = useQuery({
    queryKey: ['mkt-plan-asm', mockPlanId],
    queryFn: () => marketingPlanningApi.getAssumptions(mockPlanId),
    retry: 1,
  });

  const { data: channels, isLoading: channelsLoading } = useQuery({
    queryKey: ['mkt-plan-channels', mockPlanId],
    queryFn: () => marketingPlanningApi.getChannelBudgets(mockPlanId),
    retry: 1,
  });

  const isLoading = headerLoading || kpisLoading || asmLoading || channelsLoading;

  return (
    <SGPageContainer>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <View style={{ width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: '#D97706' }}>
          <Target size={26} color="#fff" />
        </View>
        <View>
          <Text style={{ fontSize: 26, fontWeight: '900', color: c.text }}>KẾ HOẠCH MARKETING</Text>
          <Text style={{ fontSize: 13, fontWeight: '600', color: c.textSecondary, marginTop: 3 }}>
            {header?.planName || `Kế hoạch ${mockPlanId}`} • {header?.status || 'Active'}
          </Text>
        </View>
      </View>

      {isLoading ? (
        <View style={{ padding: 60, alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#D97706" />
          <Text style={[typography.smallBold, { marginTop: 16, color: c.textSecondary }]}>Đang tải dữ liệu từ Backend...</Text>
        </View>
      ) : headerErr ? (
         <View style={{ padding: 40, alignItems: 'center', backgroundColor: '#ef444410', borderRadius: 24 }}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>📡</Text>
          <Text style={{ fontSize: 16, fontWeight: '800', color: c.text }}>Lỗi kết nối Backend</Text>
          <Text style={{ fontSize: 14, fontWeight: '600', color: c.textSecondary, marginTop: 4 }}>Không thể lấy dữ liệu kế hoạch từ marketing-planning API.</Text>
        </View>
      ) : (
        <View style={{ gap: 24 }}>
          {/* Context Info */}
          <SGCard style={{ padding: spacing.xl }}>
             <Text style={[typography.h3, { color: c.text, marginBottom: 16 }]}>Tổng quan</Text>
             <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 24 }}>
                <View style={{ flex: 1, minWidth: 200 }}>
                  <Text style={[typography.caption, { fontWeight: '700', color: c.textTertiary, textTransform: 'uppercase' }]}>Dự án mục tiêu</Text>
                  <Text style={[typography.bodyBold, { color: c.text, marginTop: 4 }]}>{header?.projectId || 'N/A'}</Text>
                </View>
                <View style={{ flex: 1, minWidth: 200 }}>
                  <Text style={[typography.caption, { fontWeight: '700', color: c.textTertiary, textTransform: 'uppercase' }]}>Tổng ngân sách</Text>
                  <Text style={[typography.bodyBold, { color: c.text, marginTop: 4 }]}>{header?.totalBudget?.toLocaleString('vi-VN')} ₫</Text>
                </View>
                <View style={{ flex: 2, minWidth: 300 }}>
                  <Text style={[typography.caption, { fontWeight: '700', color: c.textTertiary, textTransform: 'uppercase' }]}>Mục tiêu chính</Text>
                  <Text style={[typography.bodyBold, { color: c.text, marginTop: 4 }]}>{header?.objective || 'N/A'}</Text>
                </View>
             </View>
          </SGCard>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 24 }}>
            {/* KPIs */}
            <SGCard style={{ flex: 1, minWidth: 300, padding: spacing.xl }}>
              <Text style={[typography.h3, { color: c.text, marginBottom: 16 }]}>KPI Targets</Text>
              {Array.isArray(kpis) && kpis.map((k, i) => (
                <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: c.divider }}>
                  <Text style={[typography.bodyBold, { color: c.textSecondary }]}>{k.metric}</Text>
                  <Text style={[typography.bodyBold, { color: c.text }]}>{k.targetValue} {k.unit}</Text>
                </View>
              ))}
            </SGCard>

            {/* Assumptions */}
            <SGCard style={{ flex: 1.5, minWidth: 400, padding: spacing.xl }}>
              <Text style={[typography.h3, { color: c.text, marginBottom: 16 }]}>Giả định & Tỷ lệ chuyển đổi</Text>
              {Array.isArray(assumptions) && assumptions.map((a, i) => (
                <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: c.divider }}>
                  <View style={{ flex: 1 }}>
                     <Text style={[typography.bodyBold, { color: c.text }]}>{a.description || a.factor}</Text>
                     <Text style={[typography.smallBold, { color: c.textSecondary }]}>{a.factor}</Text>
                  </View>
                  <Text style={[typography.h3, { color: '#D97706' }]}>{a.valuePercentage}%</Text>
                </View>
              ))}
            </SGCard>
          </View>

           {/* Channels */}
           <SGCard style={{ padding: spacing.xl }}>
              <Text style={[typography.h3, { color: c.text, marginBottom: 16 }]}>Chiến lược Kênh</Text>
              <View style={{ flexWrap: 'wrap', flexDirection: 'row', gap: 16 }}>
                {Array.isArray(channels) && channels.map((ch, i) => (
                  <View key={i} style={{ flex: 1, minWidth: 280, backgroundColor: c.bgTertiary, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: c.border }}>
                    <Text style={[typography.bodyBold, { color: c.text, marginBottom: 12 }]}>{ch.channel}</Text>
                    <View style={{ gap: 8 }}>
                       <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                         <Text style={[typography.small, { color: c.textSecondary }]}>Ngân sách</Text>
                         <Text style={[typography.smallBold, { color: c.text }]}>{ch.allocatedBudget?.toLocaleString('vi-VN')} ₫</Text>
                       </View>
                       <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                         <Text style={[typography.small, { color: c.textSecondary }]}>Phân bổ (%)</Text>
                         <Text style={[typography.smallBold, { color: c.info }]}>{ch.percentageShare}%</Text>
                       </View>
                       {ch.expectedLeads && (
                         <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                           <Text style={[typography.small, { color: c.textSecondary }]}>Leads KPI</Text>
                           <Text style={[typography.smallBold, { color: c.success }]}>{ch.expectedLeads}</Text>
                         </View>
                       )}
                    </View>
                  </View>
                ))}
              </View>
           </SGCard>
        </View>
      )}
    </SGPageContainer>
  );
}
