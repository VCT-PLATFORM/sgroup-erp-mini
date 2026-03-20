/**
 * LeadManagement — Premium MQL/SQL lead pipeline with glass funnel & animated scores
 * SGDS: glass cards, animated score ring, skeleton loading, staggered entry
 */
import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withSpring, withTiming } from 'react-native-reanimated';
import { Users, Phone, Mail, ArrowRight, TrendingUp } from 'lucide-react-native';
import { useLeads } from '../hooks/useMarketing';
import {
  SGPageContainer, SGSearchBar, SGPillSelector,
  SGStatusBadge, SGEmptyState, SGSkeleton, SGSectionHeader,
} from '../../../shared/ui';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { typography, spacing, radius, sgds } from '../../../shared/theme/theme';
import { LinearGradient } from 'expo-linear-gradient';

const PIPELINE_STAGES = [
  { key: 'mql', label: 'MQL', count: 1245, color: '#3b82f6', pct: 100 },
  { key: 'sql', label: 'SQL', count: 486, color: '#8b5cf6', pct: 39 },
  { key: 'opportunity', label: 'Opportunity', count: 198, color: '#D97706', pct: 16 },
  { key: 'booking', label: 'Booking', count: 87, color: '#22c55e', pct: 7 },
  { key: 'closed', label: 'Closed Won', count: 42, color: '#059669', pct: 3.4 },
];

type LeadStatus = 'all' | 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'WON';

const STATUS_OPTIONS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'NEW', label: 'Mới' },
  { key: 'CONTACTED', label: 'Đã liên hệ' },
  { key: 'QUALIFIED', label: 'Đủ điều kiện' },
  { key: 'WON', label: 'Chuyển đổi' },
];

const getScoreColor = (score: number, colors: any) => score >= 80 ? colors.success : score >= 50 ? colors.warning : colors.textTertiary;

const getLeadStatusColor = (st: string): 'success' | 'warning' | 'info' | 'danger' | 'neutral' => {
  if (st === 'WON') return 'success';
  if (st === 'NEW') return 'info';
  if (st === 'CONTACTED' || st === 'QUALIFIED' || st === 'PROPOSAL') return 'warning';
  if (st === 'LOST') return 'danger';
  return 'neutral';
};

const getLeadStatusLabel = (st: string) => {
  const map: Record<string, string> = {
    NEW: 'MỚI', CONTACTED: 'ĐÃ LIÊN HỆ', QUALIFIED: 'ĐỦ ĐK', PROPOSAL: 'PROPOSAL', WON: 'CHUYỂN ĐỔI', LOST: 'MẤT'
  };
  return map[st] || st;
};

const AnimatedItem = ({ index, children }: { index: number; children: React.ReactNode }) => {
  const translateY = useSharedValue(20);
  const opacity = useSharedValue(0);
  useEffect(() => {
    const delay = index * 50;
    translateY.value = withDelay(delay, withSpring(0, { damping: 22, stiffness: 90 }));
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
  }, []);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));
  return <Animated.View style={style}>{children}</Animated.View>;
};

export function LeadManagement() {
  const { theme, isDark, colors } = useAppTheme();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<LeadStatus>('all');

  const { data: rawLeads, isLoading } = useLeads(
    filter !== 'all' ? { status: filter } : undefined
  );

  const allLeads = (rawLeads || []).map((l: any) => ({
    id: l.id,
    name: l.name,
    phone: l.phone || '',
    email: l.email || '',
    source: l.source,
    campaign: l.campaign?.name || '—',
    score: l.score || 0,
    status: l.status,
    project: '',
    createdAt: new Date(l.createdAt).toLocaleDateString('vi-VN'),
  }));

  const filtered = useMemo(() => {
    if (!search.trim()) return allLeads;
    const q = search.toLowerCase();
    return allLeads.filter((l: any) => l.name.toLowerCase().includes(q) || l.phone.includes(q) || l.source.toLowerCase().includes(q));
  }, [allLeads, search]);

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
              <Users size={26} color="#fff" />
            </LinearGradient>
            <View>
              <Text style={[typography.h1, { color: colors.text }]}>MQL & Lead Management</Text>
              <Text style={[typography.small, { color: colors.textSecondary, marginTop: 3 }]}>
                {allLeads.length} leads
              </Text>
            </View>
          </View>
        </View>
      </AnimatedItem>

      {/* Pipeline Funnel */}
      <AnimatedItem index={1}>
        <View style={[styles.glassSection, {
          backgroundColor: colors.glass,
          borderColor: colors.glassBorder,
        }, Platform.OS === 'web' ? sgds.glass as any : {}]}>
          <SGSectionHeader title="Phễu Chuyển Đổi Lead" icon={<TrendingUp size={18} color={colors.warning} />} />
          <View style={styles.funnelRow}>
            {PIPELINE_STAGES.map((stage, i) => (
              <View key={stage.key} style={styles.funnelItem}>
                <View style={[styles.funnelCard, {
                  backgroundColor: `${stage.color}10`,
                  borderColor: `${stage.color}25`,
                }]}>
                  <Text style={[styles.funnelCount, { color: stage.color }]}>{stage.count.toLocaleString()}</Text>
                  <Text style={[typography.micro, { color: stage.color }]}>{stage.label}</Text>
                  <Text style={[typography.caption, { color: colors.textTertiary, marginTop: 2, fontWeight: '700' }]}>{stage.pct}%</Text>
                </View>
                {i < PIPELINE_STAGES.length - 1 && (
                  <View style={styles.funnelArrow}>
                    <ArrowRight size={14} color={colors.textTertiary} />
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      </AnimatedItem>

      {/* Search + Filter */}
      <AnimatedItem index={2}>
        <View style={styles.filterRow}>
          <View style={styles.searchWrap}>
            <SGSearchBar
              value={search}
              onChangeText={setSearch}
              placeholder="Tìm lead theo tên, SĐT, nguồn..."
            />
          </View>
          <SGPillSelector
            options={STATUS_OPTIONS}
            activeKey={filter}
            onChange={(k) => setFilter(k as LeadStatus)}
          />
        </View>
      </AnimatedItem>

      {/* Lead Cards */}
      <View style={styles.listGap}>
        {isLoading ? (
          <>
            {[0,1,2,3].map(i => (
              <SGSkeleton key={i} width="100%" height={90} borderRadius={radius.xl} />
            ))}
          </>
        ) : filtered.length === 0 ? (
          <SGEmptyState
            title="Không tìm thấy lead nào"
            subtitle="Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm."
            icon={<Users size={48} color={colors.textTertiary} />}
          />
        ) : filtered.map((lead: any, idx: number) => {
          const scoreColor = getScoreColor(lead.score, colors);
          return (
            <AnimatedItem key={lead.id} index={idx + 3}>
              <View style={[styles.leadCard, {
                backgroundColor: colors.glass,
                borderColor: colors.glassBorder,
              }, Platform.OS === 'web' ? {
                ...sgds.glass,
                ...sgds.transition.fast,
              } as any : {}]}>
                <View style={styles.leadRow}>
                  {/* Avatar */}
                  <View style={[styles.avatar, { backgroundColor: `${scoreColor}18` }]}>
                    <Text style={[styles.avatarText, { color: scoreColor }]}>{lead.name.charAt(0)}</Text>
                  </View>
                  {/* Info */}
                  <View style={styles.leadInfo}>
                    <View style={styles.leadNameRow}>
                      <Text style={[typography.bodyBold, { color: colors.text, fontSize: 15 }]}>{lead.name}</Text>
                      <SGStatusBadge status={getLeadStatusColor(lead.status)} text={getLeadStatusLabel(lead.status)} size="sm" />
                    </View>
                    <View style={styles.contactRow}>
                      <View style={styles.contactItem}>
                        <Phone size={12} color={colors.textTertiary} />
                        <Text style={[typography.caption, { color: colors.textSecondary }]}>{lead.phone || '—'}</Text>
                      </View>
                      <View style={styles.contactItem}>
                        <Mail size={12} color={colors.textTertiary} />
                        <Text style={[typography.caption, { color: colors.textSecondary }]}>{lead.email || '—'}</Text>
                      </View>
                    </View>
                    <Text style={[typography.caption, { color: colors.textTertiary, marginTop: 4 }]}>
                      Nguồn: {lead.source} • Campaign: {lead.campaign} • {lead.createdAt}
                    </Text>
                  </View>
                  {/* Score */}
                  <View style={styles.scoreWrap}>
                    <View style={[styles.scoreRing, { borderColor: `${scoreColor}40` }]}>
                      <Text style={[styles.scoreValue, { color: scoreColor }]}>{lead.score}</Text>
                    </View>
                    <Text style={[typography.micro, { color: colors.textTertiary }]}>SCORE</Text>
                  </View>
                </View>
              </View>
            </AnimatedItem>
          );
        })}
      </View>
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
  glassSection: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: 24,
  },
  funnelRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  funnelItem: {
    flex: 1,
    minWidth: 130,
    alignItems: 'center',
  },
  funnelCard: {
    width: '100%',
    paddingVertical: 20,
    borderRadius: radius.lg,
    alignItems: 'center',
    borderWidth: 1,
  },
  funnelCount: {
    fontSize: 28,
    fontWeight: '900',
  },
  funnelArrow: {
    position: 'absolute',
    right: -18,
    top: '50%',
    zIndex: 1,
    transform: [{ translateY: -7 }],
  } as any,
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
  listGap: {
    gap: 12,
  },
  leadCard: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.md,
  },
  leadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '900',
  },
  leadInfo: {
    flex: 1,
  },
  leadNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 6,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scoreWrap: {
    alignItems: 'center',
    gap: 4,
  },
  scoreRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: '900',
  },
});
