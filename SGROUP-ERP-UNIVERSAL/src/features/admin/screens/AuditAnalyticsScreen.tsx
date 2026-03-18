/**
 * AuditAnalyticsScreen — Premium audit log analytics dashboard
 * Top users, top resources, error rate, hourly heatmap, method distribution
 */
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  BarChart3, Users, Database, AlertTriangle, Clock, Shield,
  TrendingUp, Activity, Wifi, WifiOff,
} from 'lucide-react-native';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { typography, spacing } from '../../../shared/theme/theme';
import { SGPageHeader } from '../../../shared/ui/components/SGPageHeader';
import { SGSection } from '../../../shared/ui/components/SGSection';
import { SGSkeleton } from '../../../shared/ui/components/SGSkeleton';
import { SGGradientStatCard } from '../../../shared/ui/components/SGGradientStatCard';
import { SGStatusBadge } from '../../../shared/ui/components/SGStatusBadge';
import { useAuditAnalytics, useSuspiciousActivity } from '../hooks/useAdmin';
import { METHOD_COLORS } from '../constants/adminConstants';

const HOUR_LABELS = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11',
  '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];

export function AuditAnalyticsScreen() {
  const { colors } = useAppTheme();
  const { data: analytics, isLoading } = useAuditAnalytics(30);
  const { data: suspicious } = useSuspiciousActivity();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.innerPadding}>
          <SGSkeleton width="50%" height={28} variant="text" />
          <View style={styles.statGrid}>
            {Array.from({ length: 4 }).map((_, i) => (
              <SGSkeleton key={i} width={200} height={100} borderRadius={16} style={{ flex: 1 }} />
            ))}
          </View>
          <SGSkeleton width="100%" height={200} borderRadius={16} />
          <SGSkeleton width="100%" height={200} borderRadius={16} />
        </View>
      </View>
    );
  }

  const maxHourly = Math.max(...(analytics?.hourlyHeatmap || []), 1);
  const alertCount = suspicious?.alertCount || 0;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.innerPadding} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)}>
          <SGPageHeader
            icon={<BarChart3 size={24} color={colors.accent} />}
            iconColor={colors.accent}
            title="Phân tích Audit Log"
            subtitle={`${analytics?.period || '30 ngày'} gần nhất`}
          />
        </Animated.View>

        {/* Stat cards */}
        <View style={styles.statGrid}>
          <Animated.View entering={FadeInDown.delay(50).duration(400)} style={styles.statCard}>
            <SGGradientStatCard icon={<Activity size={18} color={colors.accent} />} label="TỔNG LOGS" value={analytics?.totalLogs ?? 0} color={colors.accent} />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.statCard}>
            <SGGradientStatCard icon={<AlertTriangle size={18} color={colors.danger} />} label="LỖI" value={analytics?.failedLogs ?? 0} color={colors.danger} />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.statCard}>
            <SGGradientStatCard icon={<TrendingUp size={18} color={colors.warning} />} label="TỈ LỆ LỖI" value={analytics?.errorRate ?? '0%'} color={colors.warning} />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.statCard}>
            <SGGradientStatCard icon={<Shield size={18} color={alertCount > 0 ? colors.danger : colors.success} />} label="CẢNH BÁO" value={alertCount} color={alertCount > 0 ? colors.danger : colors.success} />
          </Animated.View>
        </View>

        {/* Suspicious Activity Alerts */}
        {alertCount > 0 && (
          <Animated.View entering={FadeInDown.delay(250).duration(400)}>
            <SGSection
              title="⚠️ Hoạt động đáng ngờ"
              titleIcon={<AlertTriangle size={18} color={colors.danger} />}
              titleColor={colors.danger}
            >
              {suspicious?.suspiciousIPs?.map((s: any, i: number) => (
                <View key={`ip-${i}`} style={styles.alertRow}>
                  <WifiOff size={14} color={colors.danger} />
                  <Text style={[typography.smallBold, { color: colors.danger }]}>
                    IP {s.ip}: {s.failedCount} lần thất bại
                  </Text>
                </View>
              ))}
              {suspicious?.suspiciousUsers?.map((s: any, i: number) => (
                <View key={`user-${i}`} style={styles.alertRow}>
                  <Users size={14} color={colors.warning} />
                  <Text style={[typography.smallBold, { color: colors.warning }]}>
                    User "{s.userName}": {s.failedCount} lần thất bại
                  </Text>
                </View>
              ))}
              {suspicious?.lockedAccounts?.map((s: any) => (
                <View key={s.id} style={styles.alertRow}>
                  <Shield size={14} color="#f59e0b" />
                  <Text style={[typography.smallBold, { color: '#f59e0b' }]}>
                    {s.name} ({s.email}) — bị khóa đến {new Date(s.lockedUntil).toLocaleString('vi')}
                  </Text>
                </View>
              ))}
              {suspicious?.highActivity?.map((s: any, i: number) => (
                <View key={`high-${i}`} style={styles.alertRow}>
                  <Activity size={14} color={colors.info} />
                  <Text style={[typography.smallBold, { color: colors.info }]}>
                    {s.userName}: {s.actionCount} actions/giờ (bất thường)
                  </Text>
                </View>
              ))}
            </SGSection>
          </Animated.View>
        )}

        {/* Hourly Heatmap */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <SGSection
            title="Heatmap hoạt động theo giờ"
            titleIcon={<Clock size={18} color="#14b8a6" />}
            titleColor="#14b8a6"
          >
            <View style={styles.heatmapGrid}>
              {(analytics?.hourlyHeatmap || []).map((count: number, h: number) => {
                const intensity = count / maxHourly;
                const bgColor = intensity === 0 ? colors.bgCard
                  : `rgba(20, 184, 166, ${0.15 + intensity * 0.85})`;
                return (
                  <View key={h} style={[styles.heatCell, { backgroundColor: bgColor }]}>
                    <Text style={[typography.micro, { color: intensity > 0.5 ? '#fff' : colors.textTertiary, fontWeight: '800' }]}>
                      {HOUR_LABELS[h]}
                    </Text>
                    <Text style={[typography.micro, { color: intensity > 0.5 ? '#fff' : colors.textDisabled }]}>
                      {count}
                    </Text>
                  </View>
                );
              })}
            </View>
          </SGSection>
        </Animated.View>

        {/* Top Users + Top Resources side by side */}
        <View style={styles.twoCol}>
          {/* Top Users */}
          <Animated.View entering={FadeInDown.delay(350).duration(400)} style={styles.colFlex}>
            <SGSection
              title="Top Users"
              titleIcon={<Users size={16} color="#8b5cf6" />}
              titleColor="#8b5cf6"
            >
              {(analytics?.topUsers || []).map((u: any, i: number) => {
                const maxCount = analytics?.topUsers?.[0]?.count || 1;
                const pct = (u.count / maxCount) * 100;
                return (
                  <View key={i} style={styles.rankRow}>
                    <Text style={[typography.micro, { color: colors.textDisabled, width: 20 }]}>{i + 1}.</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[typography.smallBold, { color: colors.text }]}>{u.userName}</Text>
                      <View style={[styles.barBg, { backgroundColor: colors.bgCard }]}>
                        <View style={[styles.barFill, { width: `${pct}%` as any, backgroundColor: '#8b5cf6' }]} />
                      </View>
                    </View>
                    <Text style={[typography.smallBold, { color: '#8b5cf6' }]}>{u.count}</Text>
                  </View>
                );
              })}
            </SGSection>
          </Animated.View>

          {/* Top Resources */}
          <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.colFlex}>
            <SGSection
              title="Top Resources"
              titleIcon={<Database size={16} color="#3b82f6" />}
              titleColor="#3b82f6"
            >
              {(analytics?.topResources || []).map((r: any, i: number) => {
                const maxCount = analytics?.topResources?.[0]?.count || 1;
                const pct = (r.count / maxCount) * 100;
                return (
                  <View key={i} style={styles.rankRow}>
                    <Text style={[typography.micro, { color: colors.textDisabled, width: 20 }]}>{i + 1}.</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[typography.smallBold, { color: colors.text }]} numberOfLines={1}>{r.resource}</Text>
                      <View style={[styles.barBg, { backgroundColor: colors.bgCard }]}>
                        <View style={[styles.barFill, { width: `${pct}%` as any, backgroundColor: '#3b82f6' }]} />
                      </View>
                    </View>
                    <Text style={[typography.smallBold, { color: '#3b82f6' }]}>{r.count}</Text>
                  </View>
                );
              })}
            </SGSection>
          </Animated.View>
        </View>

        {/* Method Distribution */}
        <Animated.View entering={FadeInDown.delay(450).duration(400)}>
          <SGSection
            title="Phân bổ theo Method"
            titleIcon={<BarChart3 size={16} color={colors.accent} />}
            titleColor={colors.accent}
          >
            <View style={styles.methodGrid}>
              {(analytics?.methodDistribution || []).map((m: any) => {
                const mc = METHOD_COLORS[m.method] || { color: '#64748b', bg: 'rgba(100,116,139,0.12)' };
                const maxCount = analytics?.methodDistribution?.[0]?.count || 1;
                const pct = (m.count / maxCount) * 100;
                return (
                  <View key={m.method} style={styles.methodRow}>
                    <View style={[styles.methodBadge, { backgroundColor: mc.bg }]}>
                      <Text style={[typography.smallBold, { color: mc.color }]}>{m.method}</Text>
                    </View>
                    <View style={[styles.barBg, { backgroundColor: colors.bgCard, flex: 1 }]}>
                      <View style={[styles.barFill, { width: `${pct}%` as any, backgroundColor: mc.color }]} />
                    </View>
                    <Text style={[typography.smallBold, { color: mc.color, width: 50, textAlign: 'right' }]}>{m.count}</Text>
                  </View>
                );
              })}
            </View>
          </SGSection>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerPadding: { padding: spacing['2xl'] - 4, gap: spacing.lg, paddingBottom: 120 },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  statCard: { flex: 1, minWidth: 180 },
  alertRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  heatmapGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  heatCell: { width: 48, height: 44, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  twoCol: { flexDirection: 'row', gap: 20, flexWrap: 'wrap' },
  colFlex: { flex: 1, minWidth: 300 },
  rankRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  barBg: { height: 6, borderRadius: 3, overflow: 'hidden', marginTop: 4 },
  barFill: {
    height: '100%' as any, borderRadius: 3,
    ...(Platform.OS === 'web' ? { transition: 'width 0.4s ease' } : {}),
  },
  methodGrid: { gap: 12 },
  methodRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  methodBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, width: 70, alignItems: 'center' },
});
