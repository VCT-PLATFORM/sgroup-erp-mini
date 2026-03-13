/**
 * BudgetTracker — Budget & Spend Tracking
 */
import React from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import { Wallet, TrendingUp, AlertCircle, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../../shared/theme/useAppTheme';

const ACCENT = '#D97706';

const MOCK_BUDGET_SUMMARY = [
  { id: '1', label: 'TỔNG NGÂN SÁCH THÁNG', value: '1.20', unit: 'Tỷ ₫', icon: Wallet, color: '#3b82f6', trend: '+15%' },
  { id: '2', label: 'ĐÃ TIÊU (SPEND)', value: '680', unit: 'Tr ₫', icon: TrendingUp, color: ACCENT, trend: '+8%' },
  { id: '3', label: 'CÒN LẠI (REMAINING)', value: '520', unit: 'Tr ₫', icon: Activity, color: '#22c55e', trend: '-12%' },
  { id: '4', label: 'TỶ LỆ TIÊU HAO', value: '56.6', unit: '%', icon: AlertCircle, color: '#f59e0b', trend: '+4%' },
];

const MOCK_CHANNEL_BUDGETS = [
  { id: 'c1', channel: 'Facebook Ads', allocated: 450000000, spent: 285000000, roas: '4.2x' },
  { id: 'c2', channel: 'Google Ads', allocated: 350000000, spent: 210000000, roas: '5.1x' },
  { id: 'c3', channel: 'TikTok Ads', allocated: 150000000, spent: 95000000, roas: '2.8x' },
  { id: 'c4', channel: 'Zalo Ads', allocated: 80000000, spent: 42000000, roas: '3.5x' },
  { id: 'c5', channel: 'PR & Events', allocated: 100000000, spent: 28000000, roas: 'N/A' },
  { id: 'c6', channel: 'KOL/Influencer', allocated: 50000000, spent: 15000000, roas: '1.9x' },
  { id: 'c7', channel: 'Email/SMS', allocated: 20000000, spent: 5000000, roas: '8.4x' },
];

const fmtMoney = (v: number) => {
  if (v >= 1000000000) return `${(v / 1000000000).toFixed(1)} Tỷ`;
  if (v >= 1000000) return `${(v / 1000000).toFixed(0)} Tr`;
  return v.toLocaleString('vi-VN');
};

export function BudgetTracker() {
  const { theme, isDark } = useAppTheme();
  const cText = theme.colors.textPrimary;
  const cSub = theme.colors.textSecondary;

  const card: any = {
    backgroundColor: isDark ? 'rgba(20,24,35,0.45)' : '#fff', borderRadius: 24, padding: 24,
    borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(32px)', boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.06)' } : {}),
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? theme.colors.background : theme.colors.backgroundAlt }}>
      <ScrollView contentContainerStyle={{ padding: 32, gap: 24, paddingBottom: 120 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <LinearGradient colors={['#D97706', '#B45309']} style={{ width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}>
            <Wallet size={26} color="#fff" />
          </LinearGradient>
          <View>
            <Text style={{ fontSize: 26, fontWeight: '900', color: cText }}>NGÂN SÁCH & CHI PHÍ</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#94a3b8', marginTop: 3 }}>Theo dõi ngân sách Marketing — Tháng 03/2026</Text>
          </View>
        </View>

        {/* Summary Cards */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
          {MOCK_BUDGET_SUMMARY.map(item => (
            <View key={item.id} style={[card, { flex: 1, minWidth: 200 }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: `${item.color}15`, alignItems: 'center', justifyContent: 'center' }}>
                  {(() => { const Icon = item.icon; return <Icon size={20} color={item.color} />; })()}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: item.trend.startsWith('+') ? '#22c55e15' : '#ef444415', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
                  {item.trend.startsWith('+') ? <ArrowUpRight size={12} color="#16a34a" /> : <ArrowDownRight size={12} color="#ef4444" />}
                  <Text style={{ fontSize: 11, fontWeight: '800', color: item.trend.startsWith('+') ? '#16a34a' : '#ef4444' }}>{item.trend}</Text>
                </View>
              </View>
              <Text style={{ fontSize: 11, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.label}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 32, fontWeight: '900', color: cText, letterSpacing: -1 }}>{item.value}</Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#94a3b8' }}>{item.unit}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Channel Budget Breakdown */}
        <View style={card}>
          <Text style={{ fontSize: 18, fontWeight: '900', color: cText, marginBottom: 24 }}>Phân Bổ Ngân Sách Theo Kênh</Text>
          <View style={{ gap: 20 }}>
            {MOCK_CHANNEL_BUDGETS.sort((a,b) => b.allocated - a.allocated).map((item, index) => {
              const spendPct = Math.round((item.spent / item.allocated) * 100);
              const isOver = spendPct > 90;
              const isWarning = spendPct > 75 && !isOver;
              const barColor = isOver ? '#ef4444' : isWarning ? '#f59e0b' : '#3b82f6';

              return (
                <View key={item.id}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, alignItems: 'flex-end' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: cText }}>{item.channel}</Text>
                      <View style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 }}>
                        <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748b' }}>ROAS: {item.roas}</Text>
                      </View>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ fontSize: 15, fontWeight: '800', color: barColor }}>{fmtMoney(item.spent)} <Text style={{ fontSize: 13, fontWeight: '600', color: '#94a3b8' }}>/ {fmtMoney(item.allocated)}</Text></Text>
                    </View>
                  </View>
                  <View style={{ height: 12, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc', borderRadius: 6, overflow: 'hidden' }}>
                    <View style={{ width: `${Math.min(spendPct, 100)}%`, height: '100%', backgroundColor: barColor, borderRadius: 6 }} />
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
