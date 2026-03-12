/**
 * SGROUP ERP — Tổng quan Vận hành (SGDS Premium)
 * Operations Dashboard with OPEX breakdown, efficiency metrics
 */
import React from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import { Settings, Wallet, FileCheck, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { sgds } from '../../../shared/theme/theme';
import { useGetOpsPerformance } from '../hooks/useOverview';
import { ActivityIndicator } from 'react-native';

const KPI_DATA = [
  { id: 'opex', label: 'TỔNG OPEX', value: '42.6', unit: 'Tỷ', change: -3.2, good: true, color: '#f97316', icon: Wallet },
  { id: 'ratio', label: 'OPEX / REVENUE', value: '2.37', unit: '%', change: -0.5, good: true, color: '#22c55e', icon: TrendingDown },
  { id: 'tickets', label: 'TICKETS XỬ LÝ', value: '1,842', unit: 'yêu cầu', change: 15, good: false, color: '#0ea5e9', icon: FileCheck },
  { id: 'sla', label: 'SLA ĐẠT', value: '94.7', unit: '%', change: 2.3, good: true, color: '#a855f7', icon: Settings },
];

const OPEX_DATA = [
  { category: 'Nhân sự', value: 24.8, pct: 58.2, color: '#6366f1', icon: '👥' },
  { category: 'Văn phòng', value: 6.1, pct: 14.3, color: '#0ea5e9', icon: '🏢' },
  { category: 'Công nghệ', value: 3.8, pct: 8.9, color: '#a855f7', icon: '💻' },
  { category: 'Pháp lý', value: 2.4, pct: 5.6, color: '#22c55e', icon: '⚖️' },
  { category: 'Marketing', value: 2.2, pct: 5.2, color: '#ec4899', icon: '📢' },
  { category: 'Đào tạo', value: 1.8, pct: 4.2, color: '#f59e0b', icon: '✈️' },
  { category: 'Khác', value: 1.5, pct: 3.6, color: '#64748b', icon: '📦' },
];

const EFFICIENCY = [
  { metric: 'Thời gian xử lý TB', value: '2.4h', target: '< 4h', ok: true },
  { metric: 'SLA vi phạm', value: '5.3%', target: '< 10%', ok: true },
  { metric: 'Chi phí/NV/tháng', value: '8.4tr', target: '< 10tr', ok: true },
  { metric: 'Downtime', value: '0.02%', target: '< 0.1%', ok: true },
  { metric: 'Tự động hóa', value: '62%', target: '> 70%', ok: false },
  { metric: 'NPS nội bộ', value: '72', target: '> 80', ok: false },
];
export function OverviewOps() {
  const { theme, isDark } = useAppTheme();
  
  const { data: opsData, isLoading } = useGetOpsPerformance(2026);

  const kpis = opsData?.kpis || KPI_DATA;
  const opexData = opsData?.opexData || OPEX_DATA;
  const efficiency = opsData?.efficiency || EFFICIENCY;

  const cText = theme.colors.textPrimary;
  const cSub = theme.colors.textSecondary;
  const cTertiary = theme.colors.textTertiary;
  const sec: any = {
    backgroundColor: isDark ? 'rgba(20,24,35,0.45)' : '#fff', borderRadius: 28, padding: 32,
    borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(32px) saturate(180%)', WebkitBackdropFilter: 'blur(32px) saturate(180%)', boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.06)' } : {}),
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? theme.colors.background : theme.colors.backgroundAlt }}>
      <ScrollView contentContainerStyle={{ padding: 32, gap: 32, paddingBottom: 120 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: '#f9731620', alignItems: 'center', justifyContent: 'center' }}><Settings size={22} color="#f97316" /></View>
          <View>
            <Text style={{ ...sgds.typo.h2, color: cText }}>Tổng quan Vận hành</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ ...sgds.typo.body, color: cSub, marginTop: 2 }}>Operations & OPEX — 2026</Text>
              {isLoading && <ActivityIndicator size="small" color="#f97316" />}
            </View>
          </View>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 20 }}>
          {kpis.map((k: any) => (
            <LinearGradient key={k.id} colors={isDark ? [`${k.color}18`, `${k.color}05`] : [`${k.color}08`, `${k.color}03`]}
              style={[{ flex: 1, minWidth: 220, borderRadius: 24, padding: 28, borderWidth: 1, borderColor: isDark ? `${k.color}30` : `${k.color}20` }, Platform.OS === 'web' ? { boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.04)' } : {}] as any}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: `${k.color}20`, alignItems: 'center', justifyContent: 'center' }}><k.icon size={16} color={k.color} /></View>
                <Text style={{ ...sgds.typo.label, color: cTertiary, flex: 1 }}>{k.label}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
                <Text style={{ fontSize: 36, fontWeight: '900', color: cText, letterSpacing: -1 }}>{k.value}</Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: cTertiary }}>{k.unit}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 12 }}>
                {k.good ? <ArrowUpRight size={14} color="#22c55e" /> : <ArrowDownRight size={14} color="#f59e0b" />}
                <Text style={{ fontSize: 12, fontWeight: '800', color: k.good ? '#22c55e' : '#f59e0b' }}>{Math.abs(k.change)}%</Text>
              </View>
            </LinearGradient>
          ))}
        </View>

        <View style={sec}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 28, borderLeftWidth: 4, borderLeftColor: '#f97316', paddingLeft: 12 }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#f9731620', alignItems: 'center', justifyContent: 'center' }}><Wallet size={18} color="#f97316" /></View>
            <Text style={{ ...sgds.typo.h3, color: cText, textTransform: 'uppercase', letterSpacing: 1 }}>PHÂN BỔ CHI PHÍ VẬN HÀNH</Text>
          </View>
          <View style={{ flexDirection: 'row', height: 40, borderRadius: 20, overflow: 'hidden', marginBottom: 24 }}>
            {opexData.map((i: any) => (<View key={i.category} style={{ flex: i.pct, backgroundColor: i.color, alignItems: 'center', justifyContent: 'center' }}>{i.pct >= 8 && <Text style={{ fontSize: 10, fontWeight: '800', color: '#fff' }}>{i.pct}%</Text>}</View>))}
          </View>
          {opexData.map((i: any) => (
            <View key={i.category} style={{ flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}>
              <Text style={{ fontSize: 24, width: 36, textAlign: 'center' }}>{i.icon}</Text>
              <Text style={{ flex: 1, fontSize: 14, fontWeight: '700', color: cText }}>{i.category}</Text>
              <Text style={{ fontSize: 16, fontWeight: '900', color: cText, minWidth: 80, textAlign: 'right' }}>{i.value} Tỷ</Text>
              <View style={{ width: 100 }}><View style={{ height: 8, borderRadius: 4, backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', overflow: 'hidden' }}><View style={{ height: 8, borderRadius: 4, backgroundColor: i.color, width: `${i.pct}%` as any }} /></View></View>
              <Text style={{ fontSize: 13, fontWeight: '800', color: i.color, minWidth: 50, textAlign: 'right' }}>{i.pct}%</Text>
            </View>
          ))}
        </View>

        <View style={sec}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 28, borderLeftWidth: 4, borderLeftColor: '#22c55e', paddingLeft: 12 }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#22c55e20', alignItems: 'center', justifyContent: 'center' }}><FileCheck size={18} color="#22c55e" /></View>
            <Text style={{ ...sgds.typo.h3, color: cText, textTransform: 'uppercase', letterSpacing: 1 }}>CHỈ SỐ HIỆU SUẤT</Text>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            {efficiency.map((e: any) => (
              <View key={e.metric} style={{ flex: 1, minWidth: 260, borderRadius: 20, padding: 24, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa' }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: cSub, marginBottom: 12 }}>{e.metric}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 28, fontWeight: '900', color: cText }}>{e.value}</Text>
                  <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: e.ok ? '#22c55e15' : '#f59e0b15' }}>
                    <Text style={{ fontSize: 11, fontWeight: '800', color: e.ok ? '#22c55e' : '#f59e0b' }}>{e.target}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
