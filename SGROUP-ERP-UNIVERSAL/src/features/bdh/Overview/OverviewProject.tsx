/**
 * SGROUP ERP — Tổng quan Dự án (SGDS Premium)
 * Project portfolio, inventory status, booking pipeline, key metrics
 */
import React from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import { Building, TrendingUp, DollarSign, ArrowUpRight, Package, MapPin, CheckCircle2, Clock, BarChart3 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { sgds } from '../../../shared/theme/theme';
import { useGetProjectPerformance } from '../hooks/useOverview';
import { ActivityIndicator } from 'react-native';

const KPI = [
  { id: 'projects', label: 'DỰ ÁN ĐANG BÁN', value: '8', unit: 'Dự án', change: 14, color: '#6366f1', icon: Building },
  { id: 'inv', label: 'TỔNG CĂN HỘ', value: '4,200', unit: 'Căn', change: 0, color: '#3b82f6', icon: Package },
  { id: 'sold', label: 'ĐÃ BÁN', value: '2,856', unit: 'Căn (68%)', change: 5, color: '#22c55e', icon: CheckCircle2 },
  { id: 'gmv', label: 'GMV DỰ ÁN', value: '12,800', unit: 'Tỷ', change: 22, color: '#f59e0b', icon: DollarSign },
];

const PROJECTS = [
  { name: 'The Grand Marina', location: 'Q.1, HCM', units: 800, sold: 720, price: 8.5, status: 'Đang bán', color: '#6366f1', phase: 'Phase 2' },
  { name: 'Eaton Park', location: 'Q.2, HCM', units: 650, sold: 520, price: 5.2, status: 'Đang bán', color: '#3b82f6', phase: 'Phase 1' },
  { name: 'Masteri West Heights', location: 'Q.9, HCM', units: 550, sold: 385, price: 3.8, status: 'Đang bán', color: '#22c55e', phase: 'Phase 1' },
  { name: 'Vinhomes Grand Park', location: 'Q.9, HCM', units: 480, sold: 336, price: 3.2, status: 'Đang bán', color: '#f59e0b', phase: 'Phase 3' },
  { name: 'The Beverly', location: 'Q.7, HCM', units: 420, sold: 294, price: 4.5, status: 'Sắp mở', color: '#ec4899', phase: 'Pre-sale' },
  { name: 'Celesta Rise', location: 'Nhà Bè, HCM', units: 380, sold: 228, price: 2.8, status: 'Đang bán', color: '#06b6d4', phase: 'Phase 2' },
  { name: 'Lumiere Riverside', location: 'An Phú, Q.2', units: 320, sold: 256, price: 6.2, status: 'Đang bán', color: '#8b5cf6', phase: 'Phase 1' },
  { name: 'Akari City', location: 'Bình Tân, HCM', units: 600, sold: 117, price: 2.5, status: 'Sắp mở', color: '#64748b', phase: 'Phase 1' },
];

const fmt = (n: number) => n.toLocaleString('vi-VN');

export function OverviewProject() {
  const { theme, isDark } = useAppTheme();
  
  const { data: projectData, isLoading } = useGetProjectPerformance(2026);

  const kpis = projectData?.kpis || KPI;
  const projects = projectData?.projects || PROJECTS;

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
          <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: '#0ea5e920', alignItems: 'center', justifyContent: 'center' }}><Building size={22} color="#0ea5e9" /></View>
          <View>
            <Text style={{ ...sgds.typo.h2, color: cText }}>Tổng quan Dự án</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ ...sgds.typo.body, color: cSub, marginTop: 2 }}>Project Portfolio — 2026</Text>
              {isLoading && <ActivityIndicator size="small" color="#0ea5e9" />}
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
              {k.change > 0 && <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 12 }}>
                <ArrowUpRight size={14} color="#22c55e" /><Text style={{ fontSize: 12, fontWeight: '800', color: '#22c55e' }}>+{k.change}%</Text>
              </View>}
            </LinearGradient>
          ))}
        </View>

        {/* Project Cards Grid */}
        <View style={sec}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 28, borderLeftWidth: 4, borderLeftColor: '#6366f1', paddingLeft: 12 }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#6366f120', alignItems: 'center', justifyContent: 'center' }}><Building size={18} color="#6366f1" /></View>
            <Text style={{ ...sgds.typo.h3, color: cText, textTransform: 'uppercase', letterSpacing: 1 }}>DANH MỤC DỰ ÁN</Text>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            {projects.map((p: any, i: number) => {
              const pct = Math.round((p.sold / p.units) * 100);
              const remaining = p.units - p.sold;
              return (
                <View key={i} style={{ flex: 1, minWidth: 280, borderRadius: 20, padding: 24, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <View style={{ width: 6, height: 24, borderRadius: 3, backgroundColor: p.color }} />
                      <Text style={{ fontSize: 15, fontWeight: '800', color: cText }}>{p.name}</Text>
                    </View>
                    <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: p.status === 'Đang bán' ? '#22c55e20' : '#f59e0b20' }}>
                      <Text style={{ fontSize: 10, fontWeight: '800', color: p.status === 'Đang bán' ? '#22c55e' : '#f59e0b' }}>{p.status}</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 }}>
                    <MapPin size={12} color={cTertiary} /><Text style={{ fontSize: 12, fontWeight: '600', color: cTertiary }}>{p.location}</Text>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: cSub, marginLeft: 8 }}>· {p.phase}</Text>
                  </View>
                  {/* Progress */}
                  <View style={{ marginBottom: 12 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: cSub }}>Đã bán {fmt(p.sold)}/{fmt(p.units)}</Text>
                      <Text style={{ fontSize: 13, fontWeight: '900', color: p.color }}>{pct}%</Text>
                    </View>
                    <View style={{ height: 8, backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                      <View style={{ width: `${pct}%`, height: '100%', backgroundColor: p.color, borderRadius: 4 }} />
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: cTertiary }}>Giá TB: <Text style={{ fontWeight: '800', color: cText }}>{p.price} Tỷ</Text></Text>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: cTertiary }}>Còn: <Text style={{ fontWeight: '800', color: '#f59e0b' }}>{fmt(remaining)}</Text></Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
