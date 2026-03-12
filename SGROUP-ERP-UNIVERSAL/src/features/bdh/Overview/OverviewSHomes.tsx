/**
 * SGROUP ERP — Tổng quan S-Homes (SGDS Premium)
 * S-Homes Dashboard with construction progress, delivery, revenue tracking
 */
import React from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import { Building2, Home, TrendingUp, Package, ArrowUpRight, Clock, CheckCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { sgds } from '../../../shared/theme/theme';
import { useGetSHomesPerformance } from '../hooks/useOverview';
import { ActivityIndicator } from 'react-native';

const KPI_DATA = [
  { id: 'projects', label: 'DỰ ÁN S-HOMES', value: '5', unit: 'dự án', change: 1, color: '#0ea5e9', icon: Building2 },
  { id: 'units', label: 'TỔNG CĂN', value: '380', unit: 'căn', change: 45, color: '#6366f1', icon: Home },
  { id: 'sold', label: 'ĐÃ BÁN', value: '248', unit: 'căn', change: 32, color: '#22c55e', icon: TrendingUp },
  { id: 'delivered', label: 'ĐÃ GIAO', value: '156', unit: 'căn', change: 28, color: '#f59e0b', icon: Package },
];

const PROJECT_LIST = [
  { name: 'S-Homes Thủ Đức', total: 120, sold: 98, delivered: 72, construction: 85, status: 'Đang xây', color: '#6366f1' },
  { name: 'S-Homes Bình Dương', total: 80, sold: 65, delivered: 48, construction: 92, status: 'Sắp giao', color: '#22c55e' },
  { name: 'S-Homes Long An', total: 60, sold: 42, delivered: 36, construction: 100, status: 'Đã giao', color: '#0ea5e9' },
  { name: 'S-Homes Đồng Nai', total: 70, sold: 28, delivered: 0, construction: 35, status: 'Đang xây', color: '#f59e0b' },
  { name: 'S-Homes Quận 9', total: 50, sold: 15, delivered: 0, construction: 12, status: 'Mới khởi công', color: '#a855f7' },
];
export function OverviewSHomes() {
  const { theme, isDark } = useAppTheme();
  
  const { data: homeData, isLoading } = useGetSHomesPerformance(2026);

  const kpis = homeData?.kpis || KPI_DATA;
  const projectList = homeData?.projectList || PROJECT_LIST;

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
          <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: '#0ea5e920', alignItems: 'center', justifyContent: 'center' }}><Building2 size={22} color="#0ea5e9" /></View>
          <View>
            <Text style={{ ...sgds.typo.h2, color: cText }}>Tổng quan S-Homes</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ ...sgds.typo.body, color: cSub, marginTop: 2 }}>S-Homes Portfolio — 2026</Text>
              {isLoading && <ActivityIndicator size="small" color="#0ea5e9" />}
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
                <ArrowUpRight size={14} color="#22c55e" /><Text style={{ fontSize: 12, fontWeight: '800', color: '#22c55e' }}>+{k.change}</Text>
              </View>
            </LinearGradient>
          ))}
        </View>

        <View style={sec}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 28, borderLeftWidth: 4, borderLeftColor: '#0ea5e9', paddingLeft: 12 }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#0ea5e920', alignItems: 'center', justifyContent: 'center' }}><Home size={18} color="#0ea5e9" /></View>
            <Text style={{ ...sgds.typo.h3, color: cText, textTransform: 'uppercase', letterSpacing: 1 }}>DANH MỤC DỰ ÁN S-HOMES</Text>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 20 }}>
            {projectList.map((p: any) => (
              <View key={p.name} style={{ flex: 1, minWidth: 300, borderRadius: 24, padding: 28, borderWidth: 1, borderColor: isDark ? `${p.color}25` : `${p.color}15`, backgroundColor: isDark ? `${p.color}08` : `${p.color}04` }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                  <Text style={{ fontSize: 16, fontWeight: '900', color: cText }}>{p.name}</Text>
                  <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: p.construction >= 100 ? '#22c55e15' : '#f59e0b15' }}>
                    <Text style={{ fontSize: 10, fontWeight: '800', color: p.construction >= 100 ? '#22c55e' : '#f59e0b' }}>{p.status}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 16, marginBottom: 20 }}>
                  {[{ l: 'Tổng', v: p.total, c: cText }, { l: 'Đã bán', v: p.sold, c: '#22c55e' }, { l: 'Đã giao', v: p.delivered, c: '#0ea5e9' }].map(s => (
                    <View key={s.l} style={{ flex: 1, alignItems: 'center' }}>
                      <Text style={{ ...sgds.typo.label, color: cTertiary, marginBottom: 6 }}>{s.l}</Text>
                      <Text style={{ fontSize: 20, fontWeight: '900', color: s.c }}>{s.v}</Text>
                    </View>
                  ))}
                </View>
                <Text style={{ ...sgds.typo.label, color: cTertiary, marginBottom: 8 }}>TIẾN ĐỘ XÂY DỰNG</Text>
                <View style={{ height: 10, borderRadius: 5, backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                  <View style={{ height: 10, borderRadius: 5, backgroundColor: p.color, width: `${p.construction}%` as any }} />
                </View>
                <Text style={{ fontSize: 13, fontWeight: '800', color: p.color, textAlign: 'right', marginTop: 6 }}>{p.construction}%</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
