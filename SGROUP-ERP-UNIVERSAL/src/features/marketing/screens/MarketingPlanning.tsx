/**
 * MarketingPlanning — Uses marketing-planning API to show plan metrics
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { Target, FileText, Share2, MessageSquare, Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { useQuery } from '@tanstack/react-query';
import { marketingPlanningApi } from '../api/marketingApi';

const ACCENT = '#D97706';

export function MarketingPlanning() {
  const { theme, isDark } = useAppTheme();
  const cText = theme.colors.textPrimary;
  const cSub = theme.colors.textSecondary;

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

  const card: any = {
    backgroundColor: isDark ? 'rgba(20,24,35,0.45)' : '#fff', borderRadius: 24, padding: 32,
    borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(32px)', boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.06)' } : {}),
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? theme.colors.background : theme.colors.backgroundAlt }}>
      <ScrollView contentContainerStyle={{ padding: 32, gap: 24, paddingBottom: 120 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <LinearGradient colors={['#D97706', '#B45309']} style={{ width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}>
            <Target size={26} color="#fff" />
          </LinearGradient>
          <View>
            <Text style={{ fontSize: 26, fontWeight: '900', color: cText }}>KẾ HOẠCH MARKETING</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#94a3b8', marginTop: 3 }}>
              {header?.planName || `Kế hoạch ${mockPlanId}`} • {header?.status || 'Active'}
            </Text>
          </View>
        </View>

        {isLoading ? (
          <View style={{ padding: 60, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={ACCENT} />
            <Text style={{ marginTop: 16, color: cSub, fontWeight: '600' }}>Đang tải dữ liệu từ Backend...</Text>
          </View>
        ) : headerErr ? (
           <View style={{ padding: 40, alignItems: 'center', backgroundColor: '#ef444410', borderRadius: 24 }}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>📡</Text>
            <Text style={{ fontSize: 16, fontWeight: '800', color: cText }}>Lỗi kết nối Backend</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#94a3b8', marginTop: 4 }}>Không thể lấy dữ liệu kế hoạch từ marketing-planning API.</Text>
          </View>
        ) : (
          <View style={{ gap: 24 }}>
            {/* Context Info */}
            <View style={card}>
               <Text style={{ fontSize: 18, fontWeight: '900', color: cText, marginBottom: 16 }}>Tổng quan</Text>
               <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 24 }}>
                  <View style={{ flex: 1, minWidth: 200 }}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Dự án mục tiêu</Text>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: cText, marginTop: 4 }}>{header?.projectId || 'N/A'}</Text>
                  </View>
                  <View style={{ flex: 1, minWidth: 200 }}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Tổng ngân sách</Text>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: cText, marginTop: 4 }}>{header?.totalBudget?.toLocaleString('vi-VN')} ₫</Text>
                  </View>
                  <View style={{ flex: 2, minWidth: 300 }}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Mục tiêu chính</Text>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: cText, marginTop: 4 }}>{header?.objective || 'N/A'}</Text>
                  </View>
               </View>
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 24 }}>
              {/* KPIs */}
              <View style={[card, { flex: 1, minWidth: 300 }]}>
                <Text style={{ fontSize: 18, fontWeight: '900', color: cText, marginBottom: 16 }}>KPI Targets</Text>
                {Array.isArray(kpis) && kpis.map((k, i) => (
                  <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9' }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: cSub }}>{k.metric}</Text>
                    <Text style={{ fontSize: 16, fontWeight: '900', color: cText }}>{k.targetValue} {k.unit}</Text>
                  </View>
                ))}
              </View>

              {/* Assumptions */}
              <View style={[card, { flex: 1.5, minWidth: 400 }]}>
                <Text style={{ fontSize: 18, fontWeight: '900', color: cText, marginBottom: 16 }}>Giả định & Tỷ lệ chuyển đổi</Text>
                {Array.isArray(assumptions) && assumptions.map((a, i) => (
                  <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9' }}>
                    <View style={{ flex: 1 }}>
                       <Text style={{ fontSize: 15, fontWeight: '800', color: cText }}>{a.description || a.factor}</Text>
                       <Text style={{ fontSize: 13, fontWeight: '600', color: cSub }}>{a.factor}</Text>
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: '900', color: ACCENT }}>{a.valuePercentage}%</Text>
                  </View>
                ))}
              </View>
            </View>

             {/* Channels */}
             <View style={card}>
                <Text style={{ fontSize: 18, fontWeight: '900', color: cText, marginBottom: 16 }}>Chiến lược Kênh</Text>
                <View style={{ flexWrap: 'wrap', flexDirection: 'row', gap: 16 }}>
                  {Array.isArray(channels) && channels.map((c, i) => (
                    <View key={i} style={{ flex: 1, minWidth: 280, backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9' }}>
                      <Text style={{ fontSize: 16, fontWeight: '800', color: cText, marginBottom: 12 }}>{c.channel}</Text>
                      <View style={{ gap: 8 }}>
                         <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                           <Text style={{ fontSize: 13, color: cSub }}>Ngân sách</Text>
                           <Text style={{ fontSize: 14, fontWeight: '800', color: cText }}>{c.allocatedBudget?.toLocaleString('vi-VN')} ₫</Text>
                         </View>
                         <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                           <Text style={{ fontSize: 13, color: cSub }}>Phân bổ (%)</Text>
                           <Text style={{ fontSize: 14, fontWeight: '800', color: '#3b82f6' }}>{c.percentageShare}%</Text>
                         </View>
                         {c.expectedLeads && (
                           <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                             <Text style={{ fontSize: 13, color: cSub }}>Leads KPI</Text>
                             <Text style={{ fontSize: 14, fontWeight: '800', color: '#22c55e' }}>{c.expectedLeads}</Text>
                           </View>
                         )}
                      </View>
                    </View>
                  ))}
                </View>
             </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
