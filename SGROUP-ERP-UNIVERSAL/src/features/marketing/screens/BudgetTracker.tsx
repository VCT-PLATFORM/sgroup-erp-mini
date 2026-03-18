/**
 * BudgetTracker — Budget & Spend Tracking
 */
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Wallet, TrendingUp, AlertCircle, Activity } from 'lucide-react-native';
import { useBudget } from '../hooks/useMarketing';
import {
  SGPageContainer,
  SGCard,
  SGStatCard,
  SGProgressBar
} from '../../../shared/ui';
import { useTheme, typography, spacing } from '../../../shared/theme/theme';

const fmtMoney = (v: number) => {
  if (v >= 1000000000) return `${(v / 1000000000).toFixed(1)} Tỷ`;
  if (v >= 1000000) return `${(v / 1000000).toFixed(0)} Tr`;
  return v.toLocaleString('vi-VN');
};

export function BudgetTracker() {
  const c = useTheme();

  const { data: budget, isLoading } = useBudget();

  const totalAllocated = budget?.totalAllocated ?? 0;
  const totalSpent = budget?.totalSpent ?? 0;
  const remaining = budget?.remaining ?? 0;
  const burnRate = totalAllocated > 0 ? (totalSpent / totalAllocated * 100) : 0;
  const channelBudgets = budget?.channels || [];

  return (
    <SGPageContainer>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <View style={{ width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: '#D97706' }}>
          <Wallet size={26} color="#fff" />
        </View>
        <View>
          <Text style={{ fontSize: 26, fontWeight: '900', color: c.text }}>NGÂN SÁCH & CHI PHÍ</Text>
          <Text style={{ fontSize: 13, fontWeight: '600', color: c.textSecondary, marginTop: 3 }}>
            Theo dõi ngân sách Marketing — Tháng 03/2026
          </Text>
        </View>
      </View>

      {/* Summary Cards */}
      {isLoading ? (
        <View style={{ padding: 40, alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#D97706" />
        </View>
      ) : (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
          <View style={{ flex: 1, minWidth: 200 }}>
            <SGStatCard
              label="Tổng Ngân Sách"
              value={fmtMoney(totalAllocated)}
              icon={<Wallet size={22} color={c.info} />}
            />
          </View>
          <View style={{ flex: 1, minWidth: 200 }}>
            <SGStatCard
              label="Đã Tiêu (Spend)"
              value={fmtMoney(totalSpent)}
              icon={<TrendingUp size={22} color="#D97706" />}
            />
          </View>
          <View style={{ flex: 1, minWidth: 200 }}>
            <SGStatCard
              label="Còn Lại"
              value={fmtMoney(remaining)}
              icon={<Activity size={22} color={c.success} />}
            />
          </View>
          <View style={{ flex: 1, minWidth: 200 }}>
            <SGStatCard
              label="Tỷ Lệ Tiêu Hao"
              value={`${Math.round(burnRate)}%`}
              icon={<AlertCircle size={22} color={c.warning} />}
            />
          </View>
        </View>
      )}

      {/* Channel Budget Breakdown */}
      <SGCard style={{ padding: spacing.xl }}>
        <Text style={[typography.h3, { color: c.text, marginBottom: 24 }]}>Phân Bổ Ngân Sách Theo Kênh</Text>
        <View style={{ gap: 24 }}>
          {channelBudgets.sort((a: any, b: any) => b.allocated - a.allocated).map((item: any, index: number) => {
            const spendPct = item.allocated > 0 ? (item.spent / item.allocated) * 100 : 0;
            const isOver = spendPct > 90;
            const isWarning = spendPct > 75 && !isOver;
            const barColor = isOver ? c.danger : isWarning ? c.warning : c.info;

            return (
              <View key={item.id}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, alignItems: 'flex-end' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={[typography.bodyBold, { color: c.text }]}>{item.channel}</Text>
                    <View style={{ backgroundColor: c.bgTertiary, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 }}>
                      <Text style={[typography.caption, { fontWeight: '800', color: c.textSecondary }]}>ROAS: {item.roas}</Text>
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 15, fontWeight: '800', color: barColor }}>
                      {fmtMoney(item.spent)}{' '}
                      <Text style={{ fontSize: 13, fontWeight: '600', color: c.textTertiary }}>
                        / {fmtMoney(item.allocated)}
                      </Text>
                    </Text>
                  </View>
                </View>
                <SGProgressBar progress={spendPct} color={barColor} showPercentage={false} size="md" />
              </View>
            );
          })}
        </View>
      </SGCard>
    </SGPageContainer>
  );
}
