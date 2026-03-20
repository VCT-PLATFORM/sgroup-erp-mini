/**
 * CampaignManager — Premium campaign list with glass cards, metrics, animations
 * SGDS: glass containers, skeleton loading, staggered entry, gradient accents
 */
import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withSpring, withTiming } from 'react-native-reanimated';
import { Megaphone, Plus, TrendingUp, Users, Wallet, Eye, MousePointerClick, ArrowUpRight } from 'lucide-react-native';
import { useCampaigns } from '../hooks/useMarketing';
import {
  SGPageContainer, SGButton, SGSearchBar, SGPillSelector,
  SGStatusBadge, SGProgressBar, SGEmptyState, SGSkeleton,
} from '../../../shared/ui';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { typography, spacing, radius, sgds } from '../../../shared/theme/theme';
import { LinearGradient } from 'expo-linear-gradient';

type CampaignStatus = 'all' | 'RUNNING' | 'PAUSED' | 'DRAFT' | 'COMPLETED';

const STATUS_OPTIONS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'RUNNING', label: 'Đang chạy' },
  { key: 'PAUSED', label: 'Tạm dừng' },
  { key: 'DRAFT', label: 'Nháp' },
  { key: 'COMPLETED', label: 'Hoàn tất' },
];

const fmtMoney = (v: number) => {
  if (v >= 1000000000) return `${(v / 1000000000).toFixed(1)} Tỷ`;
  if (v >= 1000000) return `${(v / 1000000).toFixed(0)} Tr`;
  return v.toLocaleString('vi-VN');
};

const fmtNum = (n: number) => n.toLocaleString('vi-VN');

/* Stagger wrapper */
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

export function CampaignManager() {
  const { theme, isDark, colors } = useAppTheme();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<CampaignStatus>('all');

  const { data: rawCampaigns, isLoading } = useCampaigns(
    statusFilter !== 'all' ? { status: statusFilter } : undefined
  );

  const allCampaigns = (rawCampaigns || []).map((cObj: any) => ({
    ...cObj,
    budget: Number(cObj.budget) || 0,
    spend: Number(cObj.spend) || 0,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    cpl: cObj.leads > 0 ? Math.round(Number(cObj.spend) / cObj.leads) : 0,
    roas: 0,
  }));

  const filtered = useMemo(() => {
    if (!search.trim()) return allCampaigns;
    const q = search.toLowerCase();
    return allCampaigns.filter((cObj: any) => cObj.name.toLowerCase().includes(q) || cObj.channel.toLowerCase().includes(q));
  }, [allCampaigns, search]);

  const runningCount = allCampaigns.filter((cObj: any) => cObj.status === 'RUNNING').length;

  const getCampaignStatus = (st: string): 'success' | 'warning' | 'neutral' | 'info' => {
    if (st === 'RUNNING') return 'success';
    if (st === 'PAUSED') return 'warning';
    if (st === 'COMPLETED') return 'info';
    return 'neutral';
  };

  const METRICS = [
    { icon: Eye, label: 'Impressions', key: 'impressions', fmt: fmtNum, colorKey: 'textTertiary' },
    { icon: MousePointerClick, label: 'Clicks', key: 'clicks', fmt: fmtNum, colorKey: 'info' },
    { icon: TrendingUp, label: 'CTR', key: 'ctr', fmt: (v: number) => `${v}%`, colorKey: 'brand' },
    { icon: Users, label: 'Leads', key: 'leads', fmt: fmtNum, colorKey: 'success' },
    { icon: Wallet, label: 'CPL', key: 'cpl', fmt: fmtMoney, colorKey: 'warning' },
    { icon: ArrowUpRight, label: 'ROAS', key: 'roas', fmt: (v: number) => `${v}x`, colorKey: 'warning' },
  ];

  return (
    <SGPageContainer>
      {/* Header */}
      <AnimatedItem index={0}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <LinearGradient
              colors={['#F59E0B', '#D97706']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerIcon}
            >
              <Megaphone size={26} color="#fff" />
            </LinearGradient>
            <View>
              <Text style={[typography.h1, { color: colors.text }]}>Quản Lý Chiến Dịch</Text>
              <Text style={[typography.small, { color: colors.textSecondary, marginTop: 3 }]}>
                {allCampaigns.length} chiến dịch • {runningCount} đang chạy
              </Text>
            </View>
          </View>
          <SGButton title="Tạo Chiến Dịch" icon={Plus as any} onPress={() => {}} />
        </View>
      </AnimatedItem>

      {/* Search + Filters */}
      <AnimatedItem index={1}>
        <View style={styles.filterRow}>
          <View style={styles.searchWrap}>
            <SGSearchBar
              value={search}
              onChangeText={setSearch}
              placeholder="Tìm chiến dịch, kênh..."
            />
          </View>
          <SGPillSelector
            options={STATUS_OPTIONS}
            activeKey={statusFilter}
            onChange={(k) => setStatusFilter(k as CampaignStatus)}
          />
        </View>
      </AnimatedItem>

      {/* Campaign Cards */}
      {isLoading ? (
        <View style={styles.skeletonWrap}>
          {[0,1,2].map(i => (
            <SGSkeleton key={i} width="100%" height={200} borderRadius={radius.xl} />
          ))}
        </View>
      ) : filtered.length === 0 ? (
        <SGEmptyState
          title="Không tìm thấy chiến dịch nào"
          subtitle="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm."
          icon={<Megaphone size={48} color={colors.textTertiary} />}
        />
      ) : (
        <View style={styles.listGap}>
          {filtered.map((cObj: any, idx: number) => {
            const spendPct = cObj.budget > 0 ? (cObj.spend / cObj.budget) * 100 : 0;
            const barColor = spendPct > 85 ? colors.danger : spendPct > 60 ? colors.warning : colors.success;

            return (
              <AnimatedItem key={cObj.id} index={idx + 2}>
                <View style={[styles.campaignCard, {
                  backgroundColor: colors.glass,
                  borderColor: colors.glassBorder,
                }, Platform.OS === 'web' ? {
                  ...sgds.glass,
                  ...sgds.transition.normal,
                } as any : {}]}>
                  {/* Header */}
                  <View style={styles.campaignHeader}>
                    <View style={styles.campaignInfo}>
                      <Text style={[typography.h2, { color: colors.text }]}>{cObj.name}</Text>
                      <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 4 }]}>
                        {cObj.channel} • {cObj.objective} • {cObj.startDate} → {cObj.endDate}
                      </Text>
                    </View>
                    <SGStatusBadge status={getCampaignStatus(cObj.status)} text={cObj.status} size="sm" />
                  </View>

                  {/* Metrics Row */}
                  <View style={styles.metricsRow}>
                    {METRICS.map(m => {
                      const I = m.icon;
                      const colorVal = (colors as any)[m.colorKey] || colors.textSecondary;
                      return (
                        <View key={m.label} style={[styles.metricBox, {
                          backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                          borderColor: colors.border,
                        }]}>
                          <View style={styles.metricLabel}>
                            <I size={13} color={colorVal} strokeWidth={2} />
                            <Text style={[typography.micro, { color: colors.textTertiary }]}>{m.label}</Text>
                          </View>
                          <Text style={[typography.h3, { color: colors.text }]}>{m.fmt((cObj as any)[m.key])}</Text>
                        </View>
                      );
                    })}
                  </View>

                  {/* Budget Bar */}
                  <View>
                    <View style={styles.budgetLabel}>
                      <Text style={[typography.smallBold, { color: colors.textSecondary }]}>Ngân sách: {fmtMoney(cObj.budget)}</Text>
                      <Text style={[typography.smallBold, { color: barColor }]}>{Math.round(spendPct)}% đã dùng</Text>
                    </View>
                    <SGProgressBar progress={spendPct} color={barColor} showPercentage={false} size="sm" />
                  </View>
                </View>
              </AnimatedItem>
            );
          })}
        </View>
      )}
    </SGPageContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 14,
    flexWrap: 'wrap',
    marginBottom: 24,
    alignItems: 'center',
  },
  searchWrap: {
    flex: 1,
    minWidth: 280,
  },
  skeletonWrap: {
    gap: 16,
  },
  listGap: {
    gap: 16,
  },
  campaignCard: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.lg,
  },
  campaignHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  campaignInfo: {
    flex: 1,
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  metricBox: {
    flex: 1,
    minWidth: 90,
    padding: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: 4,
  },
  metricLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  budgetLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
});
