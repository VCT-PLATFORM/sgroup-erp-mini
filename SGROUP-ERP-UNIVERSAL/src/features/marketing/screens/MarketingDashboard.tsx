/**
 * MarketingDashboard — Premium overview with KPIs, campaigns, leads
 * SGDS: glass cards, gradient stats, skeleton loading, staggered animations
 */
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withSpring, withTiming } from 'react-native-reanimated';
import { TrendingUp, Users, Target, DollarSign, BarChart3 } from 'lucide-react-native';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { typography, spacing, radius, sgds } from '../../../shared/theme/theme';
import { useMarketingDashboard, useCampaigns, useLeads } from '../hooks/useMarketing';
import { SGCard, SGGradientStatCard, SGStatusBadge, SGPageContainer, SGEmptyState, SGListItem, SGSkeleton, SGSectionHeader } from '../../../shared/ui';
import { LinearGradient } from 'expo-linear-gradient';

const fmt = (n: number) => n.toLocaleString('vi-VN');

/* Stagger-animated wrapper */
const AnimatedCard = ({ index, children }: { index: number; children: React.ReactNode }) => {
  const translateY = useSharedValue(24);
  const opacity = useSharedValue(0);
  useEffect(() => {
    const delay = index * 60;
    translateY.value = withDelay(delay, withSpring(0, { damping: 22, stiffness: 90 }));
    opacity.value = withDelay(delay, withTiming(1, { duration: 350 }));
  }, []);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));
  return <Animated.View style={style}>{children}</Animated.View>;
};

export function MarketingDashboard() {
  const { theme, isDark, colors } = useAppTheme();

  const { data: dashboard, isLoading } = useMarketingDashboard();
  const { data: campaigns } = useCampaigns({ status: 'RUNNING' });
  const { data: leads } = useLeads();

  const KPI_DATA = [
    { label: 'Leads (tổng)', value: dashboard?.totalLeads ?? 0, gradient: ['#3b82f6', '#6366f1'] as [string, string], icon: <Users size={22} color="#fff" /> },
    { label: 'Chiến dịch', value: dashboard?.totalCampaigns ?? 0, gradient: ['#22c55e', '#4ade80'] as [string, string], icon: <Target size={22} color="#fff" /> },
    { label: 'Chi phí tổng', value: fmt(dashboard?.totalSpend ?? 0) + ' ₫', gradient: ['#f43f5e', '#fb7185'] as [string, string], icon: <DollarSign size={22} color="#fff" /> },
    { label: 'Chuyển đổi', value: dashboard?.totalConversions ?? 0, gradient: ['#8b5cf6', '#a78bfa'] as [string, string], icon: <BarChart3 size={22} color="#fff" /> },
  ];

  const campaignList = (campaigns || []).slice(0, 5);
  const leadList = (leads || []).slice(0, 5);

  const getCampaignStatus = (st: string): 'success' | 'warning' | 'neutral' => {
    if (st === 'RUNNING') return 'success';
    if (st === 'PAUSED') return 'warning';
    return 'neutral';
  };

  const getLeadStatus = (st: string): 'info' | 'success' | 'warning' => {
    if (st === 'NEW') return 'info';
    if (st === 'WON') return 'success';
    return 'warning';
  };

  return (
    <SGPageContainer>
      {/* Header */}
      <AnimatedCard index={0}>
        <View style={styles.headerRow}>
          <LinearGradient
            colors={['#F59E0B', '#D97706']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerIcon}
          >
            <TrendingUp size={28} color="#fff" />
          </LinearGradient>
          <View>
            <Text style={[typography.h1, { color: colors.text, letterSpacing: -0.5 }]}>Marketing Dashboard</Text>
            <Text style={[typography.small, { color: colors.textSecondary, marginTop: 4 }]}>
              Tổng hợp hiệu suất chiến dịch — Tháng 03/2026
            </Text>
          </View>
        </View>
      </AnimatedCard>

      {/* KPI Cards */}
      <View style={styles.kpiRow}>
        {isLoading ? (
          <>
            {[0,1,2,3].map(i => (
              <View key={i} style={styles.kpiItem}>
                <SGSkeleton width="100%" height={110} borderRadius={radius.lg} />
              </View>
            ))}
          </>
        ) : KPI_DATA.map((k, i) => (
          <AnimatedCard key={i} index={i + 1}>
            <View style={styles.kpiItem}>
              <SGGradientStatCard
                label={k.label}
                value={k.value}
                icon={k.icon}
                color={k.gradient[0]}
              />
            </View>
          </AnimatedCard>
        ))}
      </View>

      <View style={styles.columnsRow}>
        {/* Top Campaigns */}
        <AnimatedCard index={5}>
          <View style={styles.mainColumn}>
            <View style={[styles.glassSection, {
              backgroundColor: colors.glass,
              borderColor: colors.glassBorder,
            }, Platform.OS === 'web' ? sgds.glass as any : {}]}>
              <SGSectionHeader title="Chiến Dịch Đang Chạy" />
              {campaignList.length === 0 ? (
                <SGEmptyState title="Chưa có chiến dịch nào" subtitle="Bạn cần tạo chiến dịch mới để theo dõi." icon={<Target size={48} color={colors.textTertiary} />} />
              ) : campaignList.map((c: any, i: number) => (
                <SGListItem
                  key={c.id}
                  title={c.name}
                  subtitle={`Spend: ${fmt(Number(c.spend))} ₫ • ${c.leads} leads`}
                  rightContent={<SGStatusBadge status={getCampaignStatus(c.status)} text={c.status} size="sm" />}
                  separator={i < campaignList.length - 1}
                />
              ))}
            </View>
          </View>
        </AnimatedCard>

        {/* Lead Sources */}
        <AnimatedCard index={6}>
          <View style={styles.sideColumn}>
            <View style={[styles.glassSection, {
              backgroundColor: colors.glass,
              borderColor: colors.glassBorder,
            }, Platform.OS === 'web' ? sgds.glass as any : {}]}>
              <SGSectionHeader title="Lead mới nhất" icon={<Users size={18} color={colors.brand} />} />
              {leadList.length === 0 ? (
                <SGEmptyState title="Chưa có lead nào" subtitle="Chưa có thông tin chuyển đổi." icon={<Users size={48} color={colors.textTertiary} />} />
              ) : leadList.map((l: any, i: number) => (
                <SGListItem
                  key={l.id}
                  title={l.name}
                  subtitle={`${l.source} • ${l.email || l.phone || '—'}`}
                  rightContent={<SGStatusBadge status={getLeadStatus(l.status)} text={l.status} size="sm" />}
                  separator={i < leadList.length - 1}
                />
              ))}
            </View>
          </View>
        </AnimatedCard>
      </View>
    </SGPageContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 28,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: 24,
  },
  kpiItem: {
    flex: 1,
    minWidth: 220,
  },
  columnsRow: {
    flexDirection: 'row',
    gap: 24,
    flexWrap: 'wrap',
  },
  mainColumn: {
    flex: 1.4,
    minWidth: 400,
  },
  sideColumn: {
    flex: 1,
    minWidth: 340,
  },
  glassSection: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.lg,
  },
});
