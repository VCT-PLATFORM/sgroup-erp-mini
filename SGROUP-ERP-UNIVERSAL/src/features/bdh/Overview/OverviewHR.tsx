/**
 * SGROUP ERP — Tổng quan Nhân sự (SGDS Premium)
 * HR Dashboard with headcount, payroll, turnover, department breakdown
 */
import React from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import { Users, TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight, UserPlus, UserMinus, Building2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { sgds } from '../../../shared/theme/theme';
import { useGetHRPerformance } from '../hooks/useOverview';
import { ActivityIndicator } from 'react-native';

const KPI = [
  { id: 'hc', label: 'TỔNG NHÂN SỰ', value: '287', unit: 'Người', change: 12, color: '#6366f1', icon: Users },
  { id: 'new', label: 'TUYỂN MỚI (YTD)', value: '62', unit: 'Người', change: 28, color: '#22c55e', icon: UserPlus },
  { id: 'turn', label: 'TỶ LỆ NGHỈ VIỆC', value: '8.2', unit: '%', change: -2.5, color: '#ef4444', icon: UserMinus },
  { id: 'pay', label: 'TỔNG QUỸ LƯƠNG', value: '4.8', unit: 'Tỷ/tháng', change: 15, color: '#f59e0b', icon: DollarSign },
];

const DEPARTMENTS = [
  { name: 'Sales', headcount: 156, budget: 2.8, turnover: 10.5, color: '#3b82f6' },
  { name: 'Marketing', headcount: 28, budget: 0.56, turnover: 7.1, color: '#f59e0b' },
  { name: 'Operations', headcount: 35, budget: 0.52, turnover: 4.2, color: '#22c55e' },
  { name: 'Finance', headcount: 18, budget: 0.36, turnover: 3.5, color: '#8b5cf6' },
  { name: 'Technology', headcount: 22, budget: 0.55, turnover: 5.8, color: '#06b6d4' },
  { name: 'HR & Admin', headcount: 15, budget: 0.28, turnover: 2.1, color: '#ec4899' },
  { name: 'Legal', headcount: 8, budget: 0.18, turnover: 0, color: '#64748b' },
  { name: 'BOD', headcount: 5, budget: 0.25, turnover: 0, color: '#0f172a' },
];

const MONTHLY_HC = [
  { m: 'T1', total: 265, new: 8, left: 3 }, { m: 'T2', total: 270, new: 9, left: 4 },
  { m: 'T3', total: 272, new: 7, left: 5 }, { m: 'T4', total: 276, new: 10, left: 6 },
  { m: 'T5', total: 278, new: 6, left: 4 }, { m: 'T6', total: 280, new: 5, left: 3 },
  { m: 'T7', total: 282, new: 8, left: 6 }, { m: 'T8', total: 285, new: 5, left: 2 },
  { m: 'T9', total: 287, new: 4, left: 2 },
];

const fmt = (n: number) => n.toLocaleString('vi-VN');

export function OverviewHR() {
  const { theme, isDark } = useAppTheme();
  
  const { data: hrData, isLoading } = useGetHRPerformance(2026);

  const kpis = hrData?.kpis || KPI;
  const departments = hrData?.departments || DEPARTMENTS;
  const monthlyHc = hrData?.monthlyHc || MONTHLY_HC;

  const totalHC = departments.reduce((s: number, d: any) => s + d.headcount, 0);

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
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: '#ec489920', alignItems: 'center', justifyContent: 'center' }}><Users size={22} color="#ec4899" /></View>
          <View>
            <Text style={{ ...sgds.typo.h2, color: cText }}>Tổng quan Nhân sự</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ ...sgds.typo.body, color: cSub, marginTop: 2 }}>HR Analytics — 2026</Text>
              {isLoading && <ActivityIndicator size="small" color="#ec4899" />}
            </View>
          </View>
        </View>

        {/* KPI Cards */}
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
                {k.change > 0 ? <ArrowUpRight size={14} color={k.id === 'turn' ? '#22c55e' : '#22c55e'} /> : <ArrowDownRight size={14} color="#22c55e" />}
                <Text style={{ fontSize: 12, fontWeight: '800', color: '#22c55e' }}>{k.change > 0 ? '+' : ''}{k.change}%</Text>
              </View>
            </LinearGradient>
          ))}
        </View>

        <View style={{ flexDirection: 'row', gap: 24, flexWrap: 'wrap' }}>
          {/* Department Table */}
          <View style={[sec, { flex: 2, minWidth: 500 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 28, borderLeftWidth: 4, borderLeftColor: '#6366f1', paddingLeft: 12 }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#6366f120', alignItems: 'center', justifyContent: 'center' }}><Building2 size={18} color="#6366f1" /></View>
              <Text style={{ ...sgds.typo.h3, color: cText, textTransform: 'uppercase', letterSpacing: 1 }}>NHÂN SỰ THEO PHÒNG BAN</Text>
            </View>
            <View style={{ flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
              <Text style={{ flex: 2, fontSize: 11, fontWeight: '800', color: cTertiary, textTransform: 'uppercase' }}>PHÒNG BAN</Text>
              <Text style={{ flex: 1, fontSize: 11, fontWeight: '800', color: cTertiary, textAlign: 'right', textTransform: 'uppercase' }}>SỐ LƯỢNG</Text>
              <Text style={{ flex: 1, fontSize: 11, fontWeight: '800', color: cTertiary, textAlign: 'right', textTransform: 'uppercase' }}>QUỸ LƯƠNG</Text>
              <Text style={{ flex: 1, fontSize: 11, fontWeight: '800', color: cTertiary, textAlign: 'right', textTransform: 'uppercase' }}>TỶ LỆ</Text>
              <Text style={{ flex: 1, fontSize: 11, fontWeight: '800', color: cTertiary, textAlign: 'right', textTransform: 'uppercase' }}>TURNOVER</Text>
            </View>
            {departments.map((d: any, i: number) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}>
                <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ width: 8, height: 28, borderRadius: 4, backgroundColor: d.color }} />
                  <Text style={{ fontSize: 14, fontWeight: '700', color: cText }}>{d.name}</Text>
                </View>
                <Text style={{ flex: 1, fontSize: 15, fontWeight: '800', color: d.color, textAlign: 'right' }}>{d.headcount}</Text>
                <Text style={{ flex: 1, fontSize: 14, fontWeight: '700', color: cText, textAlign: 'right' }}>{d.budget} Tỷ</Text>
                <Text style={{ flex: 1, fontSize: 14, fontWeight: '700', color: cSub, textAlign: 'right' }}>{Math.round(d.headcount / totalHC * 100)}%</Text>
                <Text style={{ flex: 1, fontSize: 14, fontWeight: '700', color: d.turnover > 8 ? '#ef4444' : d.turnover > 5 ? '#f59e0b' : '#22c55e', textAlign: 'right' }}>{d.turnover}%</Text>
              </View>
            ))}
          </View>

          {/* Headcount Composition Bars */}
          <View style={[sec, { flex: 1, minWidth: 280 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 28, borderLeftWidth: 4, borderLeftColor: '#22c55e', paddingLeft: 12 }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#22c55e20', alignItems: 'center', justifyContent: 'center' }}><TrendingUp size={18} color="#22c55e" /></View>
              <Text style={{ ...sgds.typo.h3, color: cText, textTransform: 'uppercase', letterSpacing: 1 }}>BIẾN ĐỘNG NS</Text>
            </View>
            {monthlyHc.map((m: any, i: number) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 12 }}>
                <Text style={{ width: 25, fontSize: 12, fontWeight: '700', color: cSub }}>{m.m}</Text>
                <View style={{ flex: 1, height: 20, backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9', borderRadius: 4, overflow: 'hidden', flexDirection: 'row' }}>
                  <View style={{ width: `${(m.total / 300) * 100}%`, height: '100%', backgroundColor: '#6366f1', borderRadius: 4 }} />
                </View>
                <Text style={{ width: 30, fontSize: 12, fontWeight: '800', color: cText, textAlign: 'right' }}>{m.total}</Text>
                <Text style={{ width: 35, fontSize: 11, fontWeight: '700', color: '#22c55e' }}>+{m.new}</Text>
                <Text style={{ width: 25, fontSize: 11, fontWeight: '700', color: '#ef4444' }}>-{m.left}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
