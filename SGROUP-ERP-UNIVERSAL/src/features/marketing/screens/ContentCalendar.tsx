/**
 * ContentCalendar — Premium content schedule with glass timeline cards
 * SGDS: glass containers, animated badges, skeleton loading, staggered entry
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withSpring, withTiming } from 'react-native-reanimated';
import { CalendarDays, FileText, Share2, Video, Mail, CheckCircle2, Clock, AlertCircle } from 'lucide-react-native';
import { useContent } from '../hooks/useMarketing';
import { SGPageContainer, SGPillSelector, SGEmptyState, SGSkeleton } from '../../../shared/ui';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { typography, spacing, radius, sgds } from '../../../shared/theme/theme';
import { LinearGradient } from 'expo-linear-gradient';

type ContentStatus = 'all' | 'PUBLISHED' | 'SCHEDULED' | 'DRAFT';
type ContentType = 'all' | 'social' | 'blog' | 'video' | 'email';

const STATUS_OPTIONS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'PUBLISHED', label: 'Đã xuất bản' },
  { key: 'SCHEDULED', label: 'Đã lên lịch' },
  { key: 'DRAFT', label: 'Bản nháp' },
];

const CONTENT_TYPES = [
  { key: 'social', label: 'Social Post', icon: Share2, color: '#3b82f6' },
  { key: 'blog', label: 'Blog Article', icon: FileText, color: '#f59e0b' },
  { key: 'video', label: 'Video/Reels', icon: Video, color: '#ef4444' },
  { key: 'email', label: 'Newsletter', icon: Mail, color: '#8b5cf6' },
];

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

export function ContentCalendar() {
  const { theme, isDark, colors } = useAppTheme();
  const [statusFilter, setStatusFilter] = useState<ContentStatus>('all');
  const [typeFilter, setTypeFilter] = useState<ContentType>('all');

  const { data: rawContent, isLoading } = useContent(
    statusFilter !== 'all' ? { status: statusFilter } : undefined
  );

  const TYPE_KEY_MAP: Record<string, string> = { POST: 'social', VIDEO: 'video', REEL: 'social', STORY: 'social', BLOG: 'blog', EMAIL: 'email' };

  const allContent = (rawContent || []).map((item: any) => {
    const d = item.scheduledDate ? new Date(item.scheduledDate) : new Date(item.createdAt);
    return {
      id: item.id,
      title: item.title,
      date: d.toISOString().split('T')[0],
      time: d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      author: item.author || '',
      type: TYPE_KEY_MAP[item.contentType] || 'social',
      status: item.status.toLowerCase(),
      channel: item.channel,
    };
  });

  const filtered = allContent.filter((item: any) =>
    (typeFilter === 'all' || item.type === typeFilter)
  );

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
              <CalendarDays size={26} color="#fff" />
            </LinearGradient>
            <View>
              <Text style={[typography.h1, { color: colors.text }]}>Lịch Nội Dung</Text>
              <Text style={[typography.small, { color: colors.textSecondary, marginTop: 3 }]}>
                Quản lý kế hoạch content đa kênh
              </Text>
            </View>
          </View>
        </View>
      </AnimatedItem>

      {/* Filters */}
      <AnimatedItem index={1}>
        <View style={styles.filterRow}>
          <SGPillSelector
            options={STATUS_OPTIONS}
            activeKey={statusFilter}
            onChange={(k) => setStatusFilter(k as ContentStatus)}
          />
          <View style={[styles.filterDivider, { backgroundColor: colors.border }]} />
          <SGPillSelector
            options={[{ key: 'all', label: 'Tất cả loại' }, ...CONTENT_TYPES]}
            activeKey={typeFilter}
            onChange={(k) => setTypeFilter(k as ContentType)}
          />
        </View>
      </AnimatedItem>

      {/* Content List */}
      <View style={styles.listGap}>
        {isLoading ? (
          <>
            {[0,1,2,3].map(i => (
              <SGSkeleton key={i} width="100%" height={100} borderRadius={radius.xl} />
            ))}
          </>
        ) : filtered.length === 0 ? (
          <SGEmptyState
            title="Không có nội dung"
            subtitle="Thử thay đổi bộ lọc để xem các nội dung khác."
            icon={<CalendarDays size={48} color={colors.textTertiary} />}
          />
        ) : (
          filtered.map((item: any, idx: number) => {
            const typeCfg = CONTENT_TYPES.find(t => t.key === item.type) || CONTENT_TYPES[0];
            const isPublished = item.status === 'published';
            const isDraft = item.status === 'draft';
            const sColor = isPublished ? colors.success : isDraft ? colors.textTertiary : colors.info;

            return (
              <AnimatedItem key={item.id} index={idx + 2}>
                <View style={[styles.contentCard, {
                  backgroundColor: colors.glass,
                  borderColor: colors.glassBorder,
                }, Platform.OS === 'web' ? {
                  ...sgds.glass,
                  ...sgds.transition.fast,
                } as any : {}]}>
                  {/* Date Column */}
                  <View style={[styles.dateColumn, { borderRightColor: colors.border }]}>
                    <Text style={[typography.micro, { color: colors.textSecondary }]}>
                      {new Date(item.date).toLocaleDateString('vi-VN', { weekday: 'short' })}
                    </Text>
                    <Text style={[styles.dateDay, { color: colors.text }]}>
                      {item.date.split('-')[2]}
                    </Text>
                    <Text style={[typography.caption, { fontWeight: '700', color: colors.textTertiary }]}>
                      {item.time}
                    </Text>
                  </View>

                  {/* Content Info */}
                  <View style={styles.contentInfo}>
                    <View style={styles.badgeRow}>
                      <View style={[styles.typeBadge, { backgroundColor: `${typeCfg.color}15` }]}>
                        <typeCfg.icon size={12} color={typeCfg.color} />
                        <Text style={[typography.micro, { color: typeCfg.color }]}>{typeCfg.label}</Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: `${sColor}15` }]}>
                        <Text style={[typography.micro, { color: sColor }]}>
                          {item.status.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    <Text style={[typography.bodyBold, { color: colors.text }]}>{item.title}</Text>
                    <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 4 }]}>
                      Kênh: <Text style={{ color: colors.text }}>{item.channel}</Text> • By: {item.author}
                    </Text>
                  </View>

                  {/* Status Icon */}
                  <View style={[styles.statusIcon, {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                  }]}>
                    {isPublished
                      ? <CheckCircle2 size={20} color={colors.success} />
                      : isDraft
                        ? <AlertCircle size={20} color={colors.textTertiary} />
                        : <Clock size={20} color={colors.info} />
                    }
                  </View>
                </View>
              </AnimatedItem>
            );
          })
        )}
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
  filterRow: {
    flexDirection: 'row',
    gap: 14,
    flexWrap: 'wrap',
    marginBottom: 24,
    alignItems: 'center',
  },
  filterDivider: {
    width: 1,
    height: 24,
    marginHorizontal: 4,
  },
  listGap: {
    gap: 12,
  },
  contentCard: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  dateColumn: {
    width: 60,
    alignItems: 'center',
    paddingRight: 16,
    borderRightWidth: 1,
  },
  dateDay: {
    fontSize: 22,
    fontWeight: '900',
    marginVertical: 2,
  },
  contentInfo: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
