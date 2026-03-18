/**
 * ContentCalendar — Content schedule and pipeline management
 */
import React, { useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { CalendarDays, FileText, Share2, Video, Mail, CheckCircle2, Clock, AlertCircle } from 'lucide-react-native';
import { useContent } from '../hooks/useMarketing';
import {
  SGPageContainer,
  SGCard,
  SGPillSelector,
  SGEmptyState
} from '../../../shared/ui';
import { useTheme, typography, spacing } from '../../../shared/theme/theme';

type ContentStatus = 'all' | 'PUBLISHED' | 'SCHEDULED' | 'DRAFT';
type ContentType = 'all' | 'social' | 'blog' | 'video' | 'email';

const STATUS_OPTIONS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'PUBLISHED', label: 'Đã xuất bản', color: '#16a34a' },
  { key: 'SCHEDULED', label: 'Đã lên lịch', color: '#3b82f6' },
  { key: 'DRAFT', label: 'Bản nháp', color: '#64748b' },
];

const CONTENT_TYPES = [
  { key: 'social', label: 'Social Post', icon: Share2, color: '#3b82f6' },
  { key: 'blog', label: 'Blog Article', icon: FileText, color: '#f59e0b' },
  { key: 'video', label: 'Video/Reels', icon: Video, color: '#ef4444' },
  { key: 'email', label: 'Newsletter', icon: Mail, color: '#8b5cf6' },
];

export function ContentCalendar() {
  const c = useTheme();
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
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <View style={{ width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: '#D97706' }}>
            <CalendarDays size={26} color="#fff" />
          </View>
          <View>
            <Text style={{ fontSize: 26, fontWeight: '900', color: c.text }}>LỊCH NỘI DUNG</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: c.textSecondary, marginTop: 3 }}>
              Quản lý kế hoạch content đa kênh
            </Text>
          </View>
        </View>
      </View>

      {/* Filters */}
      <View style={{ flexDirection: 'row', gap: 14, flexWrap: 'wrap', marginBottom: 24, alignItems: 'center' }}>
        <SGPillSelector
          options={STATUS_OPTIONS}
          activeKey={statusFilter}
          onChange={(k) => setStatusFilter(k as ContentStatus)}
        />
        <View style={{ width: 1, height: 24, backgroundColor: c.divider, marginHorizontal: 8 }} />
        <SGPillSelector
          options={[{ key: 'all', label: 'All Types' }, ...CONTENT_TYPES]}
          activeKey={typeFilter}
          onChange={(k) => setTypeFilter(k as ContentType)}
        />
      </View>

      {/* Content List */}
      <View style={{ gap: 12 }}>
        {isLoading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#D97706" />
            <Text style={[typography.smallBold, { color: c.textSecondary, marginTop: 12 }]}>Đang tải lịch...</Text>
          </View>
        ) : filtered.length === 0 ? (
          <SGEmptyState
            title="Không có nội dung"
            subtitle="Thử thay đổi bộ lọc để xem các nội dung khác."
            icon={<CalendarDays size={48} color={c.textTertiary} />}
          />
        ) : (
          filtered.map((item: any) => {
            const typeCfg = CONTENT_TYPES.find(t => t.key === item.type) || CONTENT_TYPES[0];
            const isPublished = item.status === 'published';
            const isDraft = item.status === 'draft';
            const sColor = isPublished ? c.success : isDraft ? c.textTertiary : c.info;

            return (
              <SGCard key={item.id} style={{ padding: spacing.lg, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                {/* Date Column */}
                <View style={{ width: 60, alignItems: 'center', paddingRight: 16, borderRightWidth: 1, borderRightColor: c.divider }}>
                  <Text style={[typography.caption, { fontWeight: '700', color: c.textSecondary, textTransform: 'uppercase' }]}>
                    {new Date(item.date).toLocaleDateString('vi-VN', { weekday: 'short' })}
                  </Text>
                  <Text style={{ fontSize: 22, fontWeight: '900', color: c.text, marginVertical: 2 }}>
                    {item.date.split('-')[2]}
                  </Text>
                  <Text style={[typography.caption, { fontWeight: '800', color: c.textSecondary }]}>
                    {item.time}
                  </Text>
                </View>

                {/* Content Info */}
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: `${typeCfg.color}15` }}>
                      <typeCfg.icon size={12} color={typeCfg.color} />
                      <Text style={[typography.caption, { fontWeight: '800', color: typeCfg.color }]}>{typeCfg.label}</Text>
                    </View>
                    <View style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: `${sColor}15` }}>
                      <Text style={[typography.caption, { fontWeight: '800', color: sColor, textTransform: 'uppercase' }]}>{item.status}</Text>
                    </View>
                  </View>
                  <Text style={[typography.bodyBold, { color: c.text }]}>{item.title}</Text>
                  <Text style={[typography.small, { color: c.textSecondary, marginTop: 4 }]}>
                    Kênh: <Text style={{ color: c.text }}>{item.channel}</Text> • By: {item.author}
                  </Text>
                </View>

                {/* Action Icon */}
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: c.bgTertiary, alignItems: 'center', justifyContent: 'center' }}>
                  {isPublished ? <CheckCircle2 size={20} color={c.success} /> : isDraft ? <AlertCircle size={20} color={c.textTertiary} /> : <Clock size={20} color={c.info} />}
                </View>
              </SGCard>
            );
          })
        )}
      </View>
    </SGPageContainer>
  );
}
