/**
 * ContentCalendar — Content schedule and pipeline management
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { CalendarDays, FileText, Share2, Video, Mail, CheckCircle2, Clock, AlertCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../../shared/theme/useAppTheme';

const ACCENT = '#D97706';

type ContentStatus = 'all' | 'published' | 'scheduled' | 'draft';
type ContentType = 'all' | 'social' | 'blog' | 'video' | 'email';

const STATUS_TABS: { key: ContentStatus; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'published', label: 'Đã xuất bản' },
  { key: 'scheduled', label: 'Đã lên lịch' },
  { key: 'draft', label: 'Bản nháp' },
];

const CONTENT_TYPES: { key: ContentType; label: string; icon: any; color: string }[] = [
  { key: 'social', label: 'Social Post', icon: Share2, color: '#3b82f6' },
  { key: 'blog', label: 'Blog Article', icon: FileText, color: '#f59e0b' },
  { key: 'video', label: 'Video/Reels', icon: Video, color: '#ef4444' },
  { key: 'email', label: 'Newsletter', icon: Mail, color: '#8b5cf6' },
];

const MOCK_CONTENT = [
  { id: '1', title: 'Ra mắt phân khu mới SG Center', date: '2026-03-15', time: '10:00', author: 'Minh T.', type: 'social', status: 'scheduled', channel: 'Facebook Page' },
  { id: '2', title: '5 Lý do nên đầu tư biệt thự ven sông', date: '2026-03-14', time: '14:30', author: 'Hương N.', type: 'blog', status: 'published', channel: 'Website SGROUP' },
  { id: '3', title: 'Review tiến độ thực tế SG Nest', date: '2026-03-16', time: '19:00', author: 'Tuấn A.', type: 'video', status: 'scheduled', channel: 'TikTok / Reels' },
  { id: '4', title: 'Newsletter: Thị trường BĐS Quý 1', date: '2026-03-20', time: '09:00', author: 'Lan P.', type: 'email', status: 'draft', channel: 'Customer DB' },
  { id: '5', title: 'Infographic: CSBH SG Center', date: '2026-03-13', time: '08:00', author: 'Minh T.', type: 'social', status: 'published', channel: 'Zalo OA' },
];

export function ContentCalendar() {
  const { theme, isDark } = useAppTheme();
  const cText = theme.colors.textPrimary;
  const [statusFilter, setStatusFilter] = useState<ContentStatus>('all');
  const [typeFilter, setTypeFilter] = useState<ContentType>('all');

  const filtered = MOCK_CONTENT.filter(c =>
    (statusFilter === 'all' || c.status === statusFilter) &&
    (typeFilter === 'all' || c.type === typeFilter)
  );

  const card: any = {
    backgroundColor: isDark ? 'rgba(20,24,35,0.45)' : '#fff', borderRadius: 24, padding: 24,
    borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(32px)', boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.06)' } : {}),
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? theme.colors.background : theme.colors.backgroundAlt }}>
      <ScrollView contentContainerStyle={{ padding: 32, gap: 24, paddingBottom: 120 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <LinearGradient colors={['#D97706', '#B45309']} style={{ width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}>
              <CalendarDays size={26} color="#fff" />
            </LinearGradient>
            <View>
              <Text style={{ fontSize: 26, fontWeight: '900', color: cText }}>LỊCH NỘI DUNG</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#94a3b8', marginTop: 3 }}>Quản lý kế hoạch content đa kênh</Text>
            </View>
          </View>
        </View>

        {/* Filters */}
        <View style={{ flexDirection: 'row', gap: 14, flexWrap: 'wrap' }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {STATUS_TABS.map(tab => (
              <TouchableOpacity key={tab.key} onPress={() => setStatusFilter(tab.key)} style={{
                paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12,
                backgroundColor: statusFilter === tab.key ? (isDark ? 'rgba(217,119,6,0.2)' : '#fffbeb') : (isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc'),
                borderWidth: 1, borderColor: statusFilter === tab.key ? `${ACCENT}40` : 'transparent',
              }}>
                <Text style={{ fontSize: 13, fontWeight: statusFilter === tab.key ? '800' : '600', color: statusFilter === tab.key ? ACCENT : '#64748b' }}>{tab.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ width: 1, backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0', marginHorizontal: 8 }} />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity onPress={() => setTypeFilter('all')} style={{
              paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12,
              backgroundColor: typeFilter === 'all' ? (isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9') : 'transparent',
            }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: typeFilter === 'all' ? cText : '#94a3b8' }}>All Types</Text>
            </TouchableOpacity>
            {CONTENT_TYPES.map(type => (
              <TouchableOpacity key={type.key} onPress={() => setTypeFilter(type.key)} style={{
                flexDirection: 'row', alignItems: 'center', gap: 6,
                paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12,
                backgroundColor: typeFilter === type.key ? `${type.color}15` : 'transparent',
              }}>
                <type.icon size={14} color={typeFilter === type.key ? type.color : '#94a3b8'} />
                <Text style={{ fontSize: 13, fontWeight: '600', color: typeFilter === type.key ? type.color : '#94a3b8' }}>{type.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Content List */}
        <View style={{ gap: 12 }}>
          {filtered.length === 0 ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: cText }}>Không có nội dung</Text>
            </View>
          ) : (
            filtered.map(item => {
              const typeCfg = CONTENT_TYPES.find(t => t.key === item.type) || CONTENT_TYPES[0];
              const isPublished = item.status === 'published';
              const isDraft = item.status === 'draft';
              const sColor = isPublished ? '#16a34a' : isDraft ? '#64748b' : '#3b82f6';

              return (
                <View key={item.id} style={[card, { padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16 }]}>
                  {/* Date Column */}
                  <View style={{ width: 60, alignItems: 'center', paddingRight: 16, borderRightWidth: 1, borderRightColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9' }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>
                      {new Date(item.date).toLocaleDateString('vi-VN', { weekday: 'short' })}
                    </Text>
                    <Text style={{ fontSize: 22, fontWeight: '900', color: cText, marginVertical: 2 }}>{item.date.split('-')[2]}</Text>
                    <Text style={{ fontSize: 11, fontWeight: '800', color: '#64748b' }}>{item.time}</Text>
                  </View>

                  {/* Content Info */}
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: `${typeCfg.color}15` }}>
                        <typeCfg.icon size={12} color={typeCfg.color} />
                        <Text style={{ fontSize: 10, fontWeight: '800', color: typeCfg.color }}>{typeCfg.label}</Text>
                      </View>
                      <View style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: `${sColor}15` }}>
                        <Text style={{ fontSize: 10, fontWeight: '800', color: sColor, textTransform: 'uppercase' }}>{item.status}</Text>
                      </View>
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: cText }}>{item.title}</Text>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#94a3b8', marginTop: 4 }}>
                      Kênh: <Text style={{ color: cText }}>{item.channel}</Text> • By: {item.author}
                    </Text>
                  </View>

                  {/* Action Icon */}
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc', alignItems: 'center', justifyContent: 'center' }}>
                    {isPublished ? <CheckCircle2 size={20} color="#16a34a" /> : isDraft ? <AlertCircle size={20} color="#64748b" /> : <Clock size={20} color="#3b82f6" />}
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}
