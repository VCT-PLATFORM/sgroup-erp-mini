/**
 * SGROUP ERP — Dashboard Tổng hợp Ban Điều Hành (SGDS Premium)
 * Executive summary: KPIs across all departments, real-time alerts, progress
 */
import React from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import { BarChart3, TrendingUp, DollarSign, Users, Building2, Megaphone, ShoppingCart, Building, ArrowUpRight, ArrowDownRight, AlertTriangle, CheckCircle2, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { sgds } from '../../../shared/theme/theme';
import { useGetDashboardData, useGetOverviewAlerts } from '../hooks/useOverview';
import { ActivityIndicator } from 'react-native';

const TOP_KPI = [
  { id: 'gmv', label: 'TỔNG DOANH SỐ', value: '2,500', unit: 'Tỷ', target: '3,000', pct: 83, change: 18.5, color: '#6366f1', icon: DollarSign },
  { id: 'rev', label: 'DOANH THU RÒNG', value: '86.4', unit: 'Tỷ', target: '120', pct: 72, change: 15.2, color: '#22c55e', icon: TrendingUp },
  { id: 'deals', label: 'GIAO DỊCH', value: '714', unit: 'GD', target: '900', pct: 79, change: 22.0, color: '#3b82f6', icon: ShoppingCart },
  { id: 'team', label: 'TỔNG NHÂN SỰ', value: '287', unit: 'Người', target: '320', pct: 90, change: 12.0, color: '#f59e0b', icon: Users },
];

const DEPARTMENT_STATUS = [
  { name: 'Kinh doanh', icon: ShoppingCart, gmv: '2,500 Tỷ', progress: 83, status: 'on-track', color: '#3b82f6' },
  { name: 'Marketing', icon: Megaphone, gmv: '4,200 Tr spent', progress: 70, status: 'on-track', color: '#f59e0b' },
  { name: 'Nhân sự', icon: Users, gmv: '287 người', progress: 90, status: 'on-track', color: '#ec4899' },
  { name: 'Tài chính', icon: DollarSign, gmv: 'ROS 4.8%', progress: 96, status: 'on-track', color: '#22c55e' },
  { name: 'Đại lý', icon: Building2, gmv: '48 đại lý', progress: 75, status: 'warning', color: '#8b5cf6' },
  { name: 'Dự án', icon: Building, gmv: '8 dự án', progress: 68, status: 'on-track', color: '#06b6d4' },
];

const ALERTS = [
  { type: 'warn', msg: 'GMV tháng 9 thấp hơn target 12%', time: '2 giờ trước' },
  { type: 'ok', msg: 'Tuyển dụng tháng 9 đạt 100% target', time: '5 giờ trước' },
  { type: 'warn', msg: 'CPL Google Ads tăng 15% so tháng trước', time: '1 ngày trước' },
  { type: 'ok', msg: 'Dự án The Grand Marina đạt 90% sản phẩm bán', time: '1 ngày trước' },
  { type: 'info', msg: 'Đại lý CenLand vượt target Q3', time: '2 ngày trước' },
];

const MONTHLY_GMV = [
  { m: 'T1', value: 215 }, { m: 'T2', value: 245 }, { m: 'T3', value: 290 },
  { m: 'T4', value: 268 }, { m: 'T5', value: 312 }, { m: 'T6', value: 285 },
  { m: 'T7', value: 298 }, { m: 'T8', value: 275 }, { m: 'T9', value: 260 },
];

const fmt = (n: number) => n.toLocaleString('vi-VN');

export function OverviewDashboard() {
  const { theme, isDark } = useAppTheme();
  
  const { data: dashboardData, isLoading: isLoadingDashboard } = useGetDashboardData(2026);
  const { data: alertsData, isLoading: isLoadingAlerts } = useGetOverviewAlerts();

  const kpis = dashboardData?.kpis || TOP_KPI;
  const deptStatus = dashboardData?.departmentStatus || DEPARTMENT_STATUS;
  const monthlyGmv = dashboardData?.monthlyGmv || MONTHLY_GMV;
  const alerts = alertsData || ALERTS;
  const cText = theme.colors.textPrimary;
  const cSub = theme.colors.textSecondary;
  const cTertiary = theme.colors.textTertiary;
  const sec: any = {
    backgroundColor: isDark ? 'rgba(20,24,35,0.45)' : '#fff', borderRadius: 28, padding: 32,
    borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.06)' } : {}),
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? theme.colors.background : theme.colors.backgroundAlt }}>
      <ScrollView contentContainerStyle={{ padding: 32, gap: 32, paddingBottom: 120 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: '#6366f120', alignItems: 'center', justifyContent: 'center' }}><BarChart3 size={22} color="#6366f1" /></View>
          <View>
            <Text style={{ ...sgds.typo.h2, color: cText }}>Dashboard Ban Điều Hành</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ ...sgds.typo.body, color: cSub, marginTop: 2 }}>Executive Summary — YTD 2026</Text>
              {isLoadingDashboard && <ActivityIndicator size="small" color="#6366f1" />}
            </View>
          </View>
        </View>

        {/* Top KPI with progress */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 20 }}>
          {kpis.map((k: any) => (
            <LinearGradient key={k.id} colors={isDark ? [`${k.color}18`, `${k.color}05`] : [`${k.color}08`, `${k.color}03`]}
              style={[{ flex: 1, minWidth: 240, borderRadius: 24, padding: 28, borderWidth: 1, borderColor: isDark ? `${k.color}30` : `${k.color}20` }, Platform.OS === 'web' ? { boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.04)' } : {}] as any}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: `${k.color}20`, alignItems: 'center', justifyContent: 'center' }}><k.icon size={16} color={k.color} /></View>
                <Text style={{ ...sgds.typo.label, color: cTertiary, flex: 1 }}>{k.label}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
                <Text style={{ fontSize: 36, fontWeight: '900', color: cText, letterSpacing: -1 }}>{k.value}</Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: cTertiary }}>{k.unit}</Text>
              </View>
              {/* Progress bar */}
              <View style={{ marginTop: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={{ fontSize: 11, fontWeight: '600', color: cTertiary }}>Target: {k.target}</Text>
                  <Text style={{ fontSize: 12, fontWeight: '900', color: k.color }}>{k.pct}%</Text>
                </View>
                <View style={{ height: 6, backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                  <View style={{ width: `${Math.min(k.pct, 100)}%`, height: '100%', backgroundColor: k.color, borderRadius: 3 }} />
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 12 }}>
                <ArrowUpRight size={14} color="#22c55e" /><Text style={{ fontSize: 12, fontWeight: '800', color: '#22c55e' }}>+{k.change}% vs cùng kỳ</Text>
              </View>
            </LinearGradient>
          ))}
        </View>

        <View style={{ flexDirection: 'row', gap: 24, flexWrap: 'wrap' }}>
          {/* GMV by Month */}
          <View style={[sec, { flex: 1.5, minWidth: 400 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 28, borderLeftWidth: 4, borderLeftColor: '#6366f1', paddingLeft: 12 }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#6366f120', alignItems: 'center', justifyContent: 'center' }}><TrendingUp size={18} color="#6366f1" /></View>
              <Text style={{ ...sgds.typo.h3, color: cText, textTransform: 'uppercase', letterSpacing: 1 }}>GMV THEO THÁNG (TỶ)</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 12, height: 180 }}>
              {monthlyGmv.map((m: any, i: number) => {
                const maxV = 350;
                const h = (m.value / maxV) * 150;
                return (
                  <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: 10, fontWeight: '800', color: cSub, marginBottom: 4 }}>{m.value}</Text>
                    <View style={{ width: '60%', height: h, borderRadius: 6, backgroundColor: m.value >= 280 ? '#22c55e' : m.value >= 250 ? '#6366f1' : '#f59e0b' }} />
                    <Text style={{ fontSize: 11, fontWeight: '700', color: cSub, marginTop: 8 }}>{m.m}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Department Status */}
          <View style={[sec, { flex: 1, minWidth: 300 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 28, borderLeftWidth: 4, borderLeftColor: '#22c55e', paddingLeft: 12 }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#22c55e20', alignItems: 'center', justifyContent: 'center' }}><Building2 size={18} color="#22c55e" /></View>
              <Text style={{ ...sgds.typo.h3, color: cText, textTransform: 'uppercase', letterSpacing: 1 }}>TÌNH TRẠNG BỘ PHẬN</Text>
            </View>
            {deptStatus.map((d: any, i: number) => {
              const Ic = d.icon;
              return (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}>
                  <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: `${d.color}15`, alignItems: 'center', justifyContent: 'center' }}><Ic size={14} color={d.color} /></View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: cText }}>{d.name}</Text>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: cTertiary, marginTop: 2 }}>{d.gmv}</Text>
                  </View>
                  <View style={{ width: 50, height: 6, backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0', borderRadius: 3, overflow: 'hidden', marginRight: 8 }}>
                    <View style={{ width: `${d.progress}%`, height: '100%', backgroundColor: d.color, borderRadius: 3 }} />
                  </View>
                  <Text style={{ fontSize: 12, fontWeight: '800', color: d.color, width: 35, textAlign: 'right' }}>{d.progress}%</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Alerts */}
        <View style={sec}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 28, borderLeftWidth: 4, borderLeftColor: '#f59e0b', paddingLeft: 12 }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#f59e0b20', alignItems: 'center', justifyContent: 'center' }}><AlertTriangle size={18} color="#f59e0b" /></View>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ ...sgds.typo.h3, color: cText, textTransform: 'uppercase', letterSpacing: 1 }}>CẢNH BÁO & THÔ​NG BÁO</Text>
              {isLoadingAlerts && <ActivityIndicator size="small" color="#f59e0b" />}
            </View>
          </View>
          {alerts.map((a: any, i: number) => {
            const iconMap = { warn: AlertTriangle, ok: CheckCircle2, info: Clock };
            const colorMap = { warn: '#f59e0b', ok: '#22c55e', info: '#3b82f6' };
            const Ic = iconMap[a.type as keyof typeof iconMap];
            const cl = colorMap[a.type as keyof typeof colorMap];
            return (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', gap: 12 }}>
                <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: `${cl}15`, alignItems: 'center', justifyContent: 'center' }}><Ic size={14} color={cl} /></View>
                <Text style={{ flex: 1, fontSize: 13, fontWeight: '600', color: cText }}>{a.msg}</Text>
                <Text style={{ fontSize: 11, fontWeight: '600', color: cTertiary }}>{a.time}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
