/**
 * MarketingDashboard — Overview dashboard with KPIs, campaign summary, lead funnel
 */
import React from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import { Megaphone, Users, Wallet, TrendingUp, Target, ArrowUpRight, Zap, BarChart3, Radio } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../../shared/theme/useAppTheme';

const ACCENT = '#D97706';

const MOCK_KPI = [
  { id: 'k1', label: 'CHIẾN DỊCH ĐANG CHẠY', value: '12', unit: 'Active', color: '#D97706', icon: Megaphone },
  { id: 'k2', label: 'MQL THÁNG NÀY', value: '1,245', unit: 'MTD', color: '#22c55e', icon: Users },
  { id: 'k3', label: 'CHI PHÍ MARKETING', value: '680', unit: 'Tr ₫', color: '#3b82f6', icon: Wallet },
  { id: 'k4', label: 'ROAS TRUNG BÌNH', value: '4.1x', unit: '', color: '#8b5cf6', icon: TrendingUp },
];

const MOCK_CAMPAIGNS = [
  { id: '1', name: 'Brand Awareness Q1', channel: 'Facebook Ads', budget: '120 Tr', spend: '98 Tr', leads: 342, roas: '3.8x', status: 'running' },
  { id: '2', name: 'Product Launch Wave 2', channel: 'Google Ads', budget: '200 Tr', spend: '156 Tr', leads: 521, roas: '4.5x', status: 'running' },
  { id: '3', name: 'Retargeting High Intent', channel: 'Facebook Ads', budget: '80 Tr', spend: '72 Tr', leads: 198, roas: '5.2x', status: 'running' },
  { id: '4', name: 'Email Nurture Series', channel: 'Email', budget: '15 Tr', spend: '12 Tr', leads: 89, roas: '6.1x', status: 'running' },
  { id: '5', name: 'Zalo OA Campaign', channel: 'Zalo', budget: '45 Tr', spend: '38 Tr', leads: 156, roas: '3.2x', status: 'paused' },
];

const MOCK_LEAD_SOURCES = [
  { source: 'Facebook Ads', count: 485, pct: 39, color: '#3b82f6' },
  { source: 'Google Ads', count: 342, pct: 27, color: '#22c55e' },
  { source: 'Zalo', count: 198, pct: 16, color: '#0ea5e9' },
  { source: 'Organic / SEO', count: 132, pct: 11, color: '#8b5cf6' },
  { source: 'Referral', count: 88, pct: 7, color: '#f59e0b' },
];

const MOCK_ACTIVITIES = [
  { id: '1', title: 'Campaign launched', detail: '"Product Launch Wave 2" đã được kích hoạt trên Google Ads', time: '09:15', tone: '#22c55e' },
  { id: '2', title: 'Budget alert', detail: 'Brand Awareness Q1 đạt 82% ngân sách — cân nhắc tối ưu', time: '10:30', tone: '#f59e0b' },
  { id: '3', title: 'Lead milestone', detail: 'Tổng MQL vượt mốc 1,200 trong tháng', time: '11:45', tone: '#3b82f6' },
  { id: '4', title: 'Creative update', detail: '18 creative mới đã được upload cho Social Ads', time: '14:20', tone: '#8b5cf6' },
];

const fmt = (n: number) => n.toLocaleString('vi-VN');

export function MarketingDashboard() {
  const { theme, isDark } = useAppTheme();
  const cText = theme.colors.textPrimary;
  const cSub = theme.colors.textSecondary;

  const card: any = {
    backgroundColor: isDark ? 'rgba(20,24,35,0.45)' : '#fff', borderRadius: 28, padding: 28,
    borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(32px)', boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.06)' } : {}),
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? theme.colors.background : theme.colors.backgroundAlt }}>
      <ScrollView contentContainerStyle={{ padding: 32, gap: 28, paddingBottom: 120 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <LinearGradient colors={['#D97706', '#B45309']} style={{ width: 56, height: 56, borderRadius: 20, alignItems: 'center', justifyContent: 'center', shadowColor: '#D97706', shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 6 }}>
            <Megaphone size={28} color="#fff" />
          </LinearGradient>
          <View>
            <Text style={{ fontSize: 28, fontWeight: '900', color: cText, letterSpacing: -0.5 }}>MARKETING DASHBOARD</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#94a3b8', marginTop: 4 }}>Tổng hợp hiệu suất chiến dịch — Tháng 03/2026</Text>
          </View>
        </View>

        {/* KPI Cards */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 20 }}>
          {MOCK_KPI.map(k => (
            <View key={k.id} style={{
              flex: 1, minWidth: 220, backgroundColor: isDark ? 'rgba(30,41,59,0.5)' : '#ffffff',
              borderRadius: 24, padding: 24,
              borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
              shadowColor: '#000', shadowOpacity: isDark ? 0.3 : 0.04, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 4,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: `${k.color}1A`, alignItems: 'center', justifyContent: 'center' }}>
                  {(() => { const Icon = k.icon; return <Icon size={22} color={k.color} />; })()}
                </View>
                <View style={{ backgroundColor: '#22c55e1A', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 }}>
                  <Text style={{ fontSize: 12, fontWeight: '800', color: '#16a34a' }}>+{Math.floor(Math.random() * 15 + 3)}%</Text>
                </View>
              </View>
              <Text style={{ fontSize: 11, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{k.label}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 36, fontWeight: '900', color: cText, letterSpacing: -1 }}>{k.value}</Text>
                {k.unit ? <Text style={{ fontSize: 14, fontWeight: '700', color: '#94a3b8' }}>{k.unit}</Text> : null}
              </View>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: 'row', gap: 24, flexWrap: 'wrap' }}>
          {/* Top Campaigns */}
          <View style={[card, { flex: 1.4, minWidth: 500 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: `${ACCENT}1A`, alignItems: 'center', justifyContent: 'center' }}>
                <Megaphone size={18} color={ACCENT} />
              </View>
              <Text style={{ fontSize: 18, fontWeight: '900', color: cText, flex: 1 }}>Chiến Dịch Đang Chạy</Text>
              <View style={{ backgroundColor: `${ACCENT}1A`, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 }}>
                <Text style={{ fontSize: 12, fontWeight: '800', color: ACCENT }}>TOP 5</Text>
              </View>
            </View>
            {MOCK_CAMPAIGNS.map((c, i) => (
              <View key={c.id} style={{
                flexDirection: 'row', alignItems: 'center', paddingVertical: 14,
                borderBottomWidth: i < MOCK_CAMPAIGNS.length - 1 ? 1 : 0,
                borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
              }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f8fafc', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                  <Text style={{ fontSize: 16, fontWeight: '900', color: ACCENT }}>{i + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '800', color: cText }}>{c.name}</Text>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#94a3b8', marginTop: 3 }}>
                    {c.channel} • Budget: {c.budget} • Spend: {c.spend}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <Text style={{ fontSize: 16, fontWeight: '900', color: '#22c55e' }}>{c.roas}</Text>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#3b82f6' }}>{c.leads} leads</Text>
                </View>
                <View style={{
                  paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginLeft: 14,
                  backgroundColor: c.status === 'running' ? '#dcfce7' : '#fef3c7',
                }}>
                  <Text style={{ fontSize: 10, fontWeight: '800', color: c.status === 'running' ? '#16a34a' : '#D97706', letterSpacing: 0.3 }}>
                    {c.status === 'running' ? 'RUNNING' : 'PAUSED'}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Lead Sources */}
          <View style={[card, { flex: 1, minWidth: 340 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#3b82f61A', alignItems: 'center', justifyContent: 'center' }}>
                <Radio size={18} color="#3b82f6" />
              </View>
              <Text style={{ fontSize: 18, fontWeight: '900', color: cText }}>Nguồn Lead</Text>
            </View>
            {MOCK_LEAD_SOURCES.map((s, i) => (
              <View key={s.source} style={{ marginBottom: 18 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: cText }}>{s.source}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
                    <Text style={{ fontSize: 16, fontWeight: '900', color: s.color }}>{fmt(s.count)}</Text>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#94a3b8' }}>{s.pct}%</Text>
                  </View>
                </View>
                <View style={{ height: 12, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9', borderRadius: 6, padding: 2 }}>
                  <View style={{ width: `${s.pct}%`, height: '100%', backgroundColor: s.color, borderRadius: 4, shadowColor: s.color, shadowOpacity: 0.3, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 } as any} />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Activity Stream */}
        <View style={[card, {}]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#8b5cf61A', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} color="#8b5cf6" />
            </View>
            <Text style={{ fontSize: 18, fontWeight: '900', color: cText }}>Hoạt Động Gần Đây</Text>
          </View>
          {MOCK_ACTIVITIES.map((a, i) => (
            <View key={a.id} style={{
              flexDirection: 'row', alignItems: 'flex-start', gap: 14, paddingVertical: 14,
              borderBottomWidth: i < MOCK_ACTIVITIES.length - 1 ? 1 : 0,
              borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
            }}>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: a.tone, marginTop: 6 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '800', color: cText }}>{a.title}</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#94a3b8', marginTop: 3 }}>{a.detail}</Text>
              </View>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748b' }}>{a.time}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
