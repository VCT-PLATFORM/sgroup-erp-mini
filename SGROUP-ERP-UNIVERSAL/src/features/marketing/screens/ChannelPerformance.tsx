/**
 * ChannelPerformance — Details metrics for each marketing channel
 */
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Radio, BarChart3 } from 'lucide-react-native';
import { useChannels } from '../hooks/useMarketing';
import {
  SGPageContainer,
  SGCard,
  SGEmptyState
} from '../../../shared/ui';
import { useTheme, typography, spacing } from '../../../shared/theme/theme';

const fmtMoney = (v: number) => {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)} Tr`;
  return v.toLocaleString('vi-VN');
};

const fmtNum = (n: number) => n.toLocaleString('vi-VN');

export function ChannelPerformance() {
  const c = useTheme();

  const CHANNEL_COLORS: Record<string,string> = { 
    FACEBOOK: '#1877F2', 
    GOOGLE: '#EA4335', 
    TIKTOK: c.text, 
    ZALO: '#0068FF', 
    YOUTUBE: '#FF0000', 
    EMAIL: '#8b5cf6' 
  };

  const { data: rawChannels, isLoading } = useChannels();

  const channels = (rawChannels || []).map((ch: any) => ({
    id: ch.id,
    name: ch.channelKey,
    color: CHANNEL_COLORS[ch.channelKey] || c.textSecondary,
    spend: Number(ch.spend) || 0,
    revenue: Number(ch.revenue) || 0,
    leads: ch.leads || 0,
    conversions: ch.conversions || 0,
    roas: ch.roas || 0,
    impressions: 0,
    clicks: 0,
  }));

  return (
    <SGPageContainer>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <View style={{ width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: '#D97706' }}>
          <Radio size={26} color="#fff" />
        </View>
        <View>
          <Text style={{ fontSize: 26, fontWeight: '900', color: c.text }}>HIỆU SUẤT KÊNH</Text>
          <Text style={{ fontSize: 13, fontWeight: '600', color: c.textSecondary, marginTop: 3 }}>
            Phân tích chuyên sâu hiệu quả từng kênh quảng cáo
          </Text>
        </View>
      </View>

      {/* Channel List */}
      <View style={{ gap: 16 }}>
        {isLoading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#D97706" />
            <Text style={[typography.smallBold, { marginTop: 16, color: c.textSecondary }]}>
              Đang tải dữ liệu ROI kênh quảng cáo...
            </Text>
          </View>
        ) : channels.length === 0 ? (
          <SGEmptyState
            title="Không có dữ liệu kênh"
            subtitle="Chưa có dữ liệu hiệu suất của bất kỳ kênh quảng cáo nào."
            icon={<BarChart3 size={48} color={c.textTertiary} />}
          />
        ) : (
          channels.map((ch: any) => {
            const iconColor = ch.color;
            return (
              <SGCard key={ch.id} style={{ padding: spacing.xl }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: `${iconColor}15`, alignItems: 'center', justifyContent: 'center' }}>
                    <BarChart3 size={22} color={iconColor} />
                  </View>
                  <Text style={[typography.h3, { color: c.text }]}>{ch.name}</Text>
                </View>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                  {[
                    { label: 'Spend', value: fmtMoney(ch.spend), tone: c.textSecondary },
                    { label: 'Revenue', value: fmtMoney(ch.revenue || 0), tone: c.success },
                    { label: 'Impressions', value: fmtNum(ch.impressions), tone: c.textSecondary },
                    { label: 'Clicks', value: fmtNum(ch.clicks), tone: c.info },
                    { label: 'Leads', value: fmtNum(ch.leads), tone: c.success },
                    { label: 'ROAS', value: `${ch.roas}x`, tone: '#D97706' },
                  ].map((m, idx) => (
                    <View key={idx} style={{ flex: 1, minWidth: 100, backgroundColor: c.bgTertiary, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: c.border }}>
                      <Text style={[typography.caption, { fontWeight: '800', color: c.textTertiary, textTransform: 'uppercase', marginBottom: 4 }]}>
                        {m.label}
                      </Text>
                      <Text style={{ fontSize: 16, fontWeight: '900', color: m.tone }}>{m.value}</Text>
                    </View>
                  ))}
                </View>
              </SGCard>
            );
          })
        )}
      </View>
    </SGPageContainer>
  );
}
