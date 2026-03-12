/**
 * SGROUP ERP — Tổng quan Tài chính (SGDS Premium)
 * Financial Dashboard with P&L, cashflow, revenue vs cost analysis
 */
import React from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import { CreditCard, TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight, PieChart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { sgds } from '../../../shared/theme/theme';
import { useGetFinancePerformance } from '../hooks/useOverview';
import { ActivityIndicator } from 'react-native';

const KPI_DATA = [
  { id: 'rev', label: 'DOANH THU', value: '1,800', unit: 'Tỷ', change: 12.5, color: '#6366f1', icon: DollarSign },
  { id: 'cost', label: 'TỔNG CHI PHÍ', value: '1,628', unit: 'Tỷ', change: 8.3, color: '#ef4444', icon: TrendingDown },
  { id: 'profit', label: 'LỢI NHUẬN RÒNG', value: '86.4', unit: 'Tỷ', change: 15.2, color: '#22c55e', icon: TrendingUp },
  { id: 'ros', label: 'ROS (BIÊN LỢI NHUẬN)', value: '4.8', unit: '%', change: 0.6, color: '#f59e0b', icon: PieChart },
];

const PL_DATA = [
  { label: 'Doanh thu thuần', value: 1800, pct: 100, color: '#6366f1', indent: 0 },
  { label: '(-) Hoa hồng Sales', value: -630, pct: -35, color: '#ef4444', indent: 1 },
  { label: '(-) Hoa hồng Quản lý', value: -90, pct: -5, color: '#ef4444', indent: 1 },
  { label: '(-) Chi phí Marketing', value: -108, pct: -6, color: '#f59e0b', indent: 1 },
  { label: '(-) Thưởng & Chiết khấu', value: -54, pct: -3, color: '#f59e0b', indent: 1 },
  { label: '(-) Chi phí khác', value: -36, pct: -2, color: '#64748b', indent: 1 },
  { label: 'Lợi nhuận gộp', value: 882, pct: 49, color: '#22c55e', indent: 0 },
  { label: '(-) OPEX HR', value: -600, pct: -33.3, color: '#a855f7', indent: 1 },
  { label: '(-) OPEX Văn phòng', value: -122, pct: -6.8, color: '#0ea5e9', indent: 1 },
  { label: '(-) OPEX Khác', value: -52, pct: -2.9, color: '#64748b', indent: 1 },
  { label: 'EBIT', value: 108, pct: 6, color: '#22c55e', indent: 0 },
  { label: '(-) Thuế TNDN (20%)', value: -21.6, pct: -1.2, color: '#ef4444', indent: 1 },
  { label: 'LỢI NHUẬN RÒNG', value: 86.4, pct: 4.8, color: '#22c55e', indent: 0 },
];

const CASHFLOW = [
  { month: 'T1', inflow: 120, outflow: 108 },
  { month: 'T2', inflow: 135, outflow: 118 },
  { month: 'T3', inflow: 168, outflow: 142 },
  { month: 'T4', inflow: 185, outflow: 155 },
  { month: 'T5', inflow: 210, outflow: 178 },
  { month: 'T6', inflow: 198, outflow: 165 },
  { month: 'T7', inflow: 175, outflow: 148 },
  { month: 'T8', inflow: 160, outflow: 138 },
  { month: 'T9', inflow: 145, outflow: 128 },
];

const fmt = (n: number) => Math.abs(n).toLocaleString('vi-VN');

export function OverviewFinance() {
  const { theme, isDark } = useAppTheme();
  
  const { data: finData, isLoading } = useGetFinancePerformance(2026);

  const kpis = finData?.kpis || KPI_DATA;
  const plData = finData?.plData || PL_DATA;
  const cashflow = finData?.cashflow || CASHFLOW;

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
          <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: '#10b98120', alignItems: 'center', justifyContent: 'center' }}><CreditCard size={22} color="#10b981" /></View>
          <View>
            <Text style={{ ...sgds.typo.h2, color: cText }}>Tổng quan Tài chính</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ ...sgds.typo.body, color: cSub, marginTop: 2 }}>Financial P&L Dashboard — 2026</Text>
              {isLoading && <ActivityIndicator size="small" color="#10b981" />}
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
                <ArrowUpRight size={14} color="#22c55e" /><Text style={{ fontSize: 12, fontWeight: '800', color: '#22c55e' }}>+{k.change}%</Text>
              </View>
            </LinearGradient>
          ))}
        </View>

        {/* P&L */}
        <View style={sec}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 28, borderLeftWidth: 4, borderLeftColor: '#6366f1', paddingLeft: 12 }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#6366f120', alignItems: 'center', justifyContent: 'center' }}><DollarSign size={18} color="#6366f1" /></View>
            <Text style={{ ...sgds.typo.h3, color: cText, textTransform: 'uppercase', letterSpacing: 1 }}>BÁO CÁO P&L DỰ KIẾN</Text>
          </View>
          {plData.map((row: any, i: number) => (
            <View key={i} style={{
              flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingLeft: row.indent * 24,
              borderBottomWidth: 1, borderBottomColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
              backgroundColor: row.indent === 0 ? (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)') : 'transparent',
            }}>
              <Text style={{ flex: 2, fontSize: row.indent === 0 ? 15 : 13, fontWeight: row.indent === 0 ? '900' : '600', color: row.indent === 0 ? cText : cSub }}>{row.label}</Text>
              <Text style={{ flex: 1, fontSize: row.indent === 0 ? 16 : 14, fontWeight: row.indent === 0 ? '900' : '700', color: row.value >= 0 ? (row.indent === 0 ? '#22c55e' : cText) : '#ef4444', textAlign: 'right' }}>
                {row.value < 0 ? '-' : ''}{fmt(row.value)} Tỷ
              </Text>
              <Text style={{ width: 60, fontSize: 12, fontWeight: '700', color: row.color, textAlign: 'right' }}>{row.pct}%</Text>
            </View>
          ))}
        </View>

        {/* Cashflow */}
        <View style={sec}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 28, borderLeftWidth: 4, borderLeftColor: '#22c55e', paddingLeft: 12 }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#22c55e20', alignItems: 'center', justifyContent: 'center' }}><TrendingUp size={18} color="#22c55e" /></View>
            <Text style={{ ...sgds.typo.h3, color: cText, textTransform: 'uppercase', letterSpacing: 1 }}>DÒNG TIỀN THEO THÁNG</Text>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {cashflow.map((m: any) => {
              const net = m.inflow - m.outflow;
              return (
                <View key={m.month} style={{ flex: 1, minWidth: 110, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa', alignItems: 'center' }}>
                  <Text style={{ fontSize: 13, fontWeight: '800', color: cText, marginBottom: 12 }}>{m.month}</Text>
                  <View style={{ width: '100%', height: 60, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row', gap: 4 }}>
                    <View style={{ flex: 1, height: `${(m.inflow / 220) * 100}%` as any, borderRadius: 6, backgroundColor: '#22c55e' }} />
                    <View style={{ flex: 1, height: `${(m.outflow / 220) * 100}%` as any, borderRadius: 6, backgroundColor: '#ef4444' }} />
                  </View>
                  <Text style={{ fontSize: 12, fontWeight: '800', color: net > 0 ? '#22c55e' : '#ef4444', marginTop: 8 }}>+{net} Tỷ</Text>
                </View>
              );
            })}
          </View>
          <View style={{ flexDirection: 'row', gap: 20, marginTop: 16, justifyContent: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><View style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: '#22c55e' }} /><Text style={{ fontSize: 11, fontWeight: '600', color: cSub }}>Thu</Text></View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><View style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: '#ef4444' }} /><Text style={{ fontSize: 11, fontWeight: '600', color: cSub }}>Chi</Text></View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
