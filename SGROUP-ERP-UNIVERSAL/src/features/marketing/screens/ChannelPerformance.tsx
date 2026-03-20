/**
 * ChannelPerformance — Premium channel metrics with glass cards
 * SGDS: glass containers, platform-colored accents, skeleton loading, animations
 */
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withSpring, withTiming } from 'react-native-reanimated';
import { Radio, BarChart3 } from 'lucide-react-native';
import { useChannels } from '../hooks/useMarketing';
import { SGPageContainer, SGEmptyState, SGSkeleton, SGSectionHeader } from '../../../shared/ui';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { typography, spacing, radius, sgds } from '../../../shared/theme/theme';
import { LinearGradient } from 'expo-linear-gradient';

const fmtMoney = (v: number) => {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)} Tr`;
  return v.toLocaleString('vi-VN');
};

const fmtNum = (n: number) => n.toLocaleString('vi-VN');

const AnimatedItem = ({ index, children }: { index: number; children: React.ReactNode }) => {
  const translateY = useSharedValue(20);
  const opacity = useSharedValue(0);
  useEffect(() => {
    const delay = index * 80;
    translateY.value = withDelay(delay, withSpring(0, { damping: 22, stiffness: 90 }));
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
  }, []);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));
  return <Animated.View style={style}>{children}</Animated.View>;
};

export function ChannelPerformance() {
  const { theme, isDark, colors } = useAppTheme();

  const CHANNEL_COLORS: Record<string, string> = {
    FACEBOOK: '#1877F2',
    GOOGLE: '#EA4335',
    TIKTOK: isDark ? '#fff' : '#000',
    ZALO: '#0068FF',
    YOUTUBE: '#FF0000',
    EMAIL: '#8b5cf6',
  };

  const { data: rawChannels, isLoading } = useChannels();

  const channels = (rawChannels || []).map((ch: any) => ({
    id: ch.id,
    name: ch.channelKey,
    color: CHANNEL_COLORS[ch.channelKey] || colors.textSecondary,
    spend: Number(ch.spend) || 0,
    revenue: Number(ch.revenue) || 0,
    leads: ch.leads || 0,
    conversions: ch.conversions || 0,
    roas: ch.roas || 0,
    impressions: 0,
    clicks: 0,
  }));

  const METRIC_KEYS = [
    { label: 'Chi phí', key: 'spend', fmt: fmtMoney, colorKey: 'textSecondary' },
    { label: 'Doanh thu', key: 'revenue', fmt: fmtMoney, colorKey: 'success' },
    { label: 'Impressions', key: 'impressions', fmt: fmtNum, colorKey: 'textSecondary' },
    { label: 'Clicks', key: 'clicks', fmt: fmtNum, colorKey: 'info' },
    { label: 'Leads', key: 'leads', fmt: fmtNum, colorKey: 'success' },
    { label: 'ROAS', key: 'roas', fmt: (v: number) => `${v}x`, colorKey: 'warning' },
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
            <Radio size={26} color="#fff" />
          </LinearGradient>
          <View>
            <Text style={[typography.h1, { color: colors.text }]}>Hiệu Suất Kênh</Text>
            <Text style={[typography.small, { color: colors.textSecondary, marginTop: 3 }]}>
              Phân tích chuyên sâu hiệu quả từng kênh quảng cáo
            </Text>
          </View>
        </View>
      </AnimatedItem>

      {/* Channel Cards */}
      <View style={styles.listGap}>
        {isLoading ? (
          <>
            {[0,1,2].map(i => (
              <SGSkeleton key={i} width="100%" height={180} borderRadius={radius.xl} />
            ))}
          </>
        ) : channels.length === 0 ? (
          <SGEmptyState
            title="Không có dữ liệu kênh"
            subtitle="Chưa có dữ liệu hiệu suất của bất kỳ kênh quảng cáo nào."
            icon={<BarChart3 size={48} color={colors.textTertiary} />}
          />
        ) : (
          channels.map((ch: any, idx: number) => (
            <AnimatedItem key={ch.id} index={idx + 1}>
              <View style={[styles.channelCard, {
                backgroundColor: colors.glass,
                borderColor: colors.glassBorder,
              }, Platform.OS === 'web' ? {
                ...sgds.glass,
                ...sgds.transition.normal,
              } as any : {}]}>
                {/* Channel Header */}
                <View style={styles.channelHeader}>
                  <View style={[styles.channelIcon, { backgroundColor: `${ch.color}15` }]}>
                    <BarChart3 size={22} color={ch.color} />
                  </View>
                  <Text style={[typography.h2, { color: colors.text }]}>{ch.name}</Text>
                  {/* Accent line */}
                  <View style={[styles.accentDot, { backgroundColor: ch.color }]} />
                </View>

                {/* Metrics Grid */}
                <View style={styles.metricsGrid}>
                  {METRIC_KEYS.map((m, mIdx) => {
                    const colorVal = (colors as any)[m.colorKey] || colors.textSecondary;
                    return (
                      <View key={mIdx} style={[styles.metricCard, {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                        borderColor: colors.border,
                      }]}>
                        <Text style={[typography.micro, { color: colors.textTertiary }]}>{m.label}</Text>
                        <Text style={[styles.metricValue, { color: colorVal }]}>{m.fmt((ch as any)[m.key])}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </AnimatedItem>
          ))
        )}
      </View>
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
  listGap: {
    gap: 16,
  },
  channelCard: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.xl,
  },
  channelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  channelIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 'auto',
  } as any,
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    minWidth: 100,
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: 6,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '900',
  },
});
