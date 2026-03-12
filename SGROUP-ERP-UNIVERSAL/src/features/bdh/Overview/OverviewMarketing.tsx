/**
 * SGROUP ERP — Tổng quan Marketing (SGDS Premium)
 * Channel performance, lead attribution, budget tracking, CPL analysis
 */
import React from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import { Megaphone, TrendingUp, Target, DollarSign, ArrowUpRight, ArrowDownRight, Users, BarChart3, Globe } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { sgds } from '../../../shared/theme/theme';
import { useGetMarketingPerformance } from '../hooks/useOverview';
import { ActivityIndicator } from 'react-native';

const KPI = [
  { id: 'budget', label: 'NGÂN SÁCH ĐÃ DÙNG', value: '4,200', unit: 'Tr', change: -5.2, color: '#f59e0b', icon: DollarSign },
  { id: 'leads', label: 'TỔNG LEAD', value: '8,450', unit: 'Lead', change: 24.5, color: '#3b82f6', icon: Users },
  { id: 'cpl', label: 'CPL TRUNG BÌNH', value: '497', unit: 'K', change: -12.3, color: '#22c55e', icon: Target },
  { id: 'conv', label: 'TỶ LỆ CHUYỂN ĐỔI', value: '3.4', unit: '%', change: 0.8, color: '#8b5cf6', icon: TrendingUp },
];

const CHANNELS = [
  { name: 'Google Ads', budget: 1260, leads: 2535, cpl: 497, conv: 3.8, color: '#4285F4', trend: 12 },
  { name: 'Facebook/Meta', budget: 1050, leads: 2113, cpl: 497, conv: 3.2, color: '#1877F2', trend: 8 },
  { name: 'Zalo OA', budget: 630, leads: 1268, cpl: 497, conv: 4.1, color: '#0068FF', trend: 15 },
  { name: 'TikTok', budget: 630, leads: 1268, cpl: 497, conv: 2.5, color: '#FF004F', trend: 32 },
  { name: 'Offline/Events', budget: 420, leads: 845, cpl: 497, conv: 5.2, color: '#F59E0B', trend: -3 },
  { name: 'Referral', budget: 210, leads: 421, cpl: 499, conv: 8.1, color: '#22C55E', trend: 18 },
];

const MONTHLY_LEADS = [
  { m: 'T1', google: 280, fb: 230, zalo: 140, tiktok: 120, offline: 90, ref: 45 },
  { m: 'T2', google: 310, fb: 250, zalo: 155, tiktok: 145, offline: 95, ref: 50 },
  { m: 'T3', google: 340, fb: 280, zalo: 170, tiktok: 168, offline: 105, ref: 55 },
  { m: 'T4', google: 290, fb: 245, zalo: 148, tiktok: 155, offline: 100, ref: 48 },
  { m: 'T5', google: 320, fb: 260, zalo: 162, tiktok: 175, offline: 110, ref: 52 },
  { m: 'T6', google: 285, fb: 240, zalo: 145, tiktok: 148, offline: 88, ref: 46 },
  { m: 'T7', google: 300, fb: 255, zalo: 155, tiktok: 160, offline: 95, ref: 50 },
  { m: 'T8', google: 275, fb: 235, zalo: 138, tiktok: 142, offline: 82, ref: 42 },
  { m: 'T9', google: 260, fb: 220, zalo: 130, tiktok: 135, offline: 80, ref: 40 },
];

const fmt = (n: number) => n.toLocaleString('vi-VN');

export function OverviewMarketing() {
  const { theme, isDark } = useAppTheme();
  
  const { data: mktData, isLoading } = useGetMarketingPerformance(2026);

  const kpis = mktData?.kpis || KPI;
  const channels = mktData?.channels || CHANNELS;
  const monthlyLeads = mktData?.monthlyLeads || MONTHLY_LEADS;

  const totalBudget = channels.reduce((s: number, c: any) => s + c.budget, 0);

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
          <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: '#f59e0b20', alignItems: 'center', justifyContent: 'center' }}><Megaphone size={22} color="#f59e0b" /></View>
          <View>
            <Text style={{ ...sgds.typo.h2, color: cText }}>Tổng quan Marketing</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ ...sgds.typo.body, color: cSub, marginTop: 2 }}>Performance Dashboard — 2026</Text>
              {isLoading && <ActivityIndicator size="small" color="#f59e0b" />}
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
                {k.change > 0 ? <ArrowUpRight size={14} color="#22c55e" /> : <ArrowDownRight size={14} color="#22c55e" />}
                <Text style={{ fontSize: 12, fontWeight: '800', color: '#22c55e' }}>{k.change > 0 ? '+' : ''}{k.change}%</Text>
                <Text style={{ fontSize: 11, fontWeight: '600', color: cTertiary, marginLeft: 4 }}>vs cùng kỳ</Text>
              </View>
            </LinearGradient>
          ))}
        </View>

        {/* Channel Performance Table */}
        <View style={sec}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 28, borderLeftWidth: 4, borderLeftColor: '#3b82f6', paddingLeft: 12 }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#3b82f620', alignItems: 'center', justifyContent: 'center' }}><Globe size={18} color="#3b82f6" /></View>
            <Text style={{ ...sgds.typo.h3, color: cText, textTransform: 'uppercase', letterSpacing: 1 }}>HIỆU SUẤT THEO KÊNH</Text>
          </View>
          {/* Header */}
          <View style={{ flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
            <Text style={{ flex: 2, fontSize: 11, fontWeight: '800', color: cTertiary, textTransform: 'uppercase' }}>KÊNH</Text>
            <Text style={{ flex: 1, fontSize: 11, fontWeight: '800', color: cTertiary, textAlign: 'right', textTransform: 'uppercase' }}>NGÂN SÁCH</Text>
            <Text style={{ flex: 1, fontSize: 11, fontWeight: '800', color: cTertiary, textAlign: 'right', textTransform: 'uppercase' }}>LEAD</Text>
            <Text style={{ flex: 1, fontSize: 11, fontWeight: '800', color: cTertiary, textAlign: 'right', textTransform: 'uppercase' }}>CPL</Text>
            <Text style={{ flex: 1, fontSize: 11, fontWeight: '800', color: cTertiary, textAlign: 'right', textTransform: 'uppercase' }}>CONV.</Text>
            <Text style={{ flex: 1, fontSize: 11, fontWeight: '800', color: cTertiary, textAlign: 'right', textTransform: 'uppercase' }}>TREND</Text>
          </View>
          {channels.map((ch: any, i: number) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}>
              <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ width: 8, height: 28, borderRadius: 4, backgroundColor: ch.color }} />
                <Text style={{ fontSize: 14, fontWeight: '700', color: cText }}>{ch.name}</Text>
              </View>
              <Text style={{ flex: 1, fontSize: 14, fontWeight: '700', color: cText, textAlign: 'right' }}>{fmt(ch.budget)} Tr</Text>
              <Text style={{ flex: 1, fontSize: 14, fontWeight: '800', color: ch.color, textAlign: 'right' }}>{fmt(ch.leads)}</Text>
              <Text style={{ flex: 1, fontSize: 14, fontWeight: '700', color: cText, textAlign: 'right' }}>{fmt(ch.cpl)}K</Text>
              <Text style={{ flex: 1, fontSize: 14, fontWeight: '700', color: ch.conv >= 4 ? '#22c55e' : cText, textAlign: 'right' }}>{ch.conv}%</Text>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
                {ch.trend > 0 ? <ArrowUpRight size={12} color="#22c55e" /> : <ArrowDownRight size={12} color="#ef4444" />}
                <Text style={{ fontSize: 13, fontWeight: '800', color: ch.trend > 0 ? '#22c55e' : '#ef4444' }}>{ch.trend > 0 ? '+' : ''}{ch.trend}%</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Budget Allocation Bar */}
        <View style={sec}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 28, borderLeftWidth: 4, borderLeftColor: '#f59e0b', paddingLeft: 12 }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#f59e0b20', alignItems: 'center', justifyContent: 'center' }}><BarChart3 size={18} color="#f59e0b" /></View>
            <Text style={{ ...sgds.typo.h3, color: cText, textTransform: 'uppercase', letterSpacing: 1 }}>PHÂN BỔ NGÂN SÁCH</Text>
          </View>
          <View style={{ height: 32, flexDirection: 'row', borderRadius: 8, overflow: 'hidden', marginBottom: 20 }}>
            {channels.map((ch: any, i: number) => (
              <View key={i} style={{ flex: ch.budget / totalBudget, backgroundColor: ch.color, justifyContent: 'center', alignItems: 'center' }}>
                {ch.budget / totalBudget > 0.12 && <Text style={{ fontSize: 10, fontWeight: '800', color: '#fff' }}>{Math.round(ch.budget / totalBudget * 100)}%</Text>}
              </View>
            ))}
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            {channels.map((ch: any, i: number) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: ch.color }} />
                <Text style={{ fontSize: 11, fontWeight: '600', color: cSub }}>{ch.name} ({fmt(ch.budget)} Tr)</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Monthly Lead Trend (stacked bars) */}
        <View style={sec}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 28, borderLeftWidth: 4, borderLeftColor: '#8b5cf6', paddingLeft: 12 }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#8b5cf620', alignItems: 'center', justifyContent: 'center' }}><TrendingUp size={18} color="#8b5cf6" /></View>
            <Text style={{ ...sgds.typo.h3, color: cText, textTransform: 'uppercase', letterSpacing: 1 }}>LEAD THEO THÁNG</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 200 }}>
            {monthlyLeads.map((m: any, i: number) => {
              const total = m.google + m.fb + m.zalo + m.tiktok + m.offline + m.ref;
              const maxT = 1200;
              const h = (total / maxT) * 170;
              return (
                <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ fontSize: 10, fontWeight: '800', color: cSub, marginBottom: 4 }}>{total}</Text>
                  <View style={{ width: '70%', height: h, borderRadius: 6, overflow: 'hidden' }}>
                    <View style={{ height: `${(m.google / total) * 100}%`, backgroundColor: '#4285F4' }} />
                    <View style={{ height: `${(m.fb / total) * 100}%`, backgroundColor: '#1877F2' }} />
                    <View style={{ height: `${(m.zalo / total) * 100}%`, backgroundColor: '#0068FF' }} />
                    <View style={{ height: `${(m.tiktok / total) * 100}%`, backgroundColor: '#FF004F' }} />
                    <View style={{ height: `${(m.offline / total) * 100}%`, backgroundColor: '#F59E0B' }} />
                    <View style={{ height: `${(m.ref / total) * 100}%`, backgroundColor: '#22C55E' }} />
                  </View>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: cSub, marginTop: 8 }}>{m.m}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
