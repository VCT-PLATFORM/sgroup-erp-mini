/**
 * BudgetTracker — Premium budget & spend tracking
 * SGDS: gradient stat cards, glass sections, skeleton loading, animations
 */
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withSpring, withTiming } from 'react-native-reanimated';
import { Wallet, TrendingUp, AlertCircle, Activity } from 'lucide-react-native';
import { useBudget } from '../hooks/useMarketing';
import { SGPageContainer, SGGradientStatCard, SGProgressBar, SGSkeleton, SGSectionHeader } from '../../../shared/ui';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { typography, spacing, radius, sgds } from '../../../shared/theme/theme';
import { LinearGradient } from 'expo-linear-gradient';

const fmtMoney = (v: number) => {
  if (v >= 1000000000) return `${(v / 1000000000).toFixed(1)} Tỷ`;
  if (v >= 1000000) return `${(v / 1000000).toFixed(0)} Tr`;
  return v.toLocaleString('vi-VN');
};

const AnimatedItem = ({ index, children }: { index: number; children: React.ReactNode }) => {
  const translateY = useSharedValue(20);
  const opacity = useSharedValue(0);
  useEffect(() => {
    const delay = index * 60;
    translateY.value = withDelay(delay, withSpring(0, { damping: 22, stiffness: 90 }));
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
  }, []);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));
  return <Animated.View style={style}>{children}</Animated.View>;
};

export function BudgetTracker() {
  const { theme, isDark, colors } = useAppTheme();

  const { data: budget, isLoading } = useBudget();

  const totalAllocated = budget?.totalAllocated ?? 0;
  const totalSpent = budget?.totalSpent ?? 0;
  const remaining = budget?.remaining ?? 0;
  const burnRate = totalAllocated > 0 ? (totalSpent / totalAllocated * 100) : 0;
  const channelBudgets = budget?.channels || [];

  const KPI_CARDS = [
    { label: 'Tổng Ngân Sách', value: fmtMoney(totalAllocated), gradient: ['#3b82f6', '#6366f1'] as [string, string], icon: <Wallet size={22} color="#fff" /> },
    { label: 'Đã Tiêu (Spend)', value: fmtMoney(totalSpent), gradient: ['#F59E0B', '#D97706'] as [string, string], icon: <TrendingUp size={22} color="#fff" /> },
    { label: 'Còn Lại', value: fmtMoney(remaining), gradient: ['#22c55e', '#4ade80'] as [string, string], icon: <Activity size={22} color="#fff" /> },
    { label: 'Tỷ Lệ Tiêu Hao', value: `${Math.round(burnRate)}%`, gradient: ['#ef4444', '#f87171'] as [string, string], icon: <AlertCircle size={22} color="#fff" /> },
  ];

  return (
    <SGPageContainer>
      {/* Header */}
      <AnimatedItem index={0}>
        <View style={styles.headerRow}>
          <LinearGradient
            colors={['#F59E0B', '#D97706']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerIcon}
          >
            <Wallet size={26} color="#fff" />
          </LinearGradient>
          <View>
            <Text style={[typography.h1, { color: colors.text }]}>Ngân Sách & Chi Phí</Text>
            <Text style={[typography.small, { color: colors.textSecondary, marginTop: 3 }]}>
              Theo dõi ngân sách Marketing — Tháng 03/2026
            </Text>
          </View>
        </View>
      </AnimatedItem>

      {/* Summary Cards */}
      <View style={styles.kpiRow}>
        {isLoading ? (
          <>
            {[0,1,2,3].map(i => (
              <View key={i} style={styles.kpiItem}>
                <SGSkeleton width="100%" height={110} borderRadius={radius.lg} />
              </View>
            ))}
          </>
        ) : KPI_CARDS.map((k, i) => (
          <AnimatedItem key={i} index={i + 1}>
            <View style={styles.kpiItem}>
              <SGGradientStatCard
                label={k.label}
                value={k.value}
                icon={k.icon}
                color={k.gradient[0]}
              />
            </View>
          </AnimatedItem>
        ))}
      </View>

      {/* Channel Budget Breakdown */}
      <AnimatedItem index={5}>
        <View style={[styles.glassSection, {
          backgroundColor: colors.glass,
          borderColor: colors.glassBorder,
        }, Platform.OS === 'web' ? sgds.glass as any : {}]}>
          <SGSectionHeader title="Phân Bổ Ngân Sách Theo Kênh" />
          <View style={styles.channelList}>
            {channelBudgets.sort((a: any, b: any) => b.allocated - a.allocated).map((item: any) => {
              const spendPct = item.allocated > 0 ? (item.spent / item.allocated) * 100 : 0;
              const isOver = spendPct > 90;
              const isWarning = spendPct > 75 && !isOver;
              const barColor = isOver ? colors.danger : isWarning ? colors.warning : colors.brand;

              return (
                <View key={item.id} style={styles.channelItem}>
                  <View style={styles.channelHeader}>
                    <View style={styles.channelLeft}>
                      <Text style={[typography.bodyBold, { color: colors.text }]}>{item.channel}</Text>
                      <View style={[styles.roasBadge, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
                        <Text style={[typography.caption, { fontWeight: '800', color: colors.textSecondary }]}>ROAS: {item.roas}</Text>
                      </View>
                    </View>
                    <View style={styles.channelRight}>
                      <Text style={[typography.bodyBold, { color: barColor }]}>
                        {fmtMoney(item.spent)}{' '}
                        <Text style={[typography.small, { color: colors.textTertiary }]}>
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
        </View>
      </AnimatedItem>
    </SGPageContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  kpiItem: {
    flex: 1,
    minWidth: 200,
  },
  glassSection: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.xl,
  },
  channelList: {
    gap: 24,
  },
  channelItem: {},
  channelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'flex-end',
  },
  channelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roasBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  channelRight: {
    alignItems: 'flex-end',
  },
});
