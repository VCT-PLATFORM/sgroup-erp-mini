/**
 * CampaignManager — Campaign list with status filters, search, and performance metrics
 */
import React, { useState, useMemo } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Megaphone, Plus, TrendingUp, Users, Wallet, Eye, MousePointerClick, ArrowUpRight } from 'lucide-react-native';
import { useCampaigns } from '../hooks/useMarketing';
import {
  SGPageContainer,
  SGButton,
  SGCard,
  SGSearchBar,
  SGPillSelector,
  SGStatusBadge,
  SGProgressBar,
  SGEmptyState
} from '../../../shared/ui';
import { useTheme, typography } from '../../../shared/theme/theme';

type CampaignStatus = 'all' | 'RUNNING' | 'PAUSED' | 'DRAFT' | 'COMPLETED';

const STATUS_OPTIONS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'RUNNING', label: 'Đang chạy' },
  { key: 'PAUSED', label: 'Tạm dừng', color: '#D97706' },
  { key: 'DRAFT', label: 'Nháp', color: '#64748b' },
  { key: 'COMPLETED', label: 'Hoàn tất', color: '#3b82f6' },
];

const fmtMoney = (v: number) => {
  if (v >= 1000000000) return `${(v / 1000000000).toFixed(1)} Tỷ`;
  if (v >= 1000000) return `${(v / 1000000).toFixed(0)} Tr`;
  return v.toLocaleString('vi-VN');
};

const fmtNum = (n: number) => n.toLocaleString('vi-VN');

export function CampaignManager() {
  const c = useTheme();
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

  return (
    <SGPageContainer>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <View style={{ width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: '#D97706' }}>
            <Megaphone size={26} color="#fff" />
          </View>
          <View>
            <Text style={{ fontSize: 26, fontWeight: '900', color: c.text }}>QUẢN LÝ CHIẾN DỊCH</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: c.textSecondary, marginTop: 3 }}>
              {allCampaigns.length} chiến dịch • {runningCount} đang chạy
            </Text>
          </View>
        </View>
        <SGButton title="Tạo Chiến Dịch" icon={Plus as any} onPress={() => {}} />
      </View>

      {/* Search + Filters */}
      <View style={{ flexDirection: 'row', gap: 14, flexWrap: 'wrap', marginBottom: 24, alignItems: 'center' }}>
        <View style={{ flex: 1, minWidth: 280 }}>
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

      {/* Campaign Cards */}
      {isLoading ? (
        <View style={{ padding: 60, alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#D97706" />
          <Text style={[typography.smallBold, { color: c.textSecondary, marginTop: 12 }]}>Đang tải chiến dịch...</Text>
        </View>
      ) : filtered.length === 0 ? (
        <SGEmptyState
          title="Không tìm thấy chiến dịch nào"
          subtitle="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm."
          icon={<Megaphone size={48} color={c.textTertiary} />}
        />
      ) : (
        <View style={{ gap: 16 }}>
          {filtered.map((cObj: any) => {
            const spendPct = cObj.budget > 0 ? (cObj.spend / cObj.budget) * 100 : 0;
            const barColor = spendPct > 85 ? c.danger : spendPct > 60 ? c.warning : c.success;

            return (
              <SGCard key={cObj.id}>
                {/* Header */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: '900', color: c.text }}>{cObj.name}</Text>
                    <Text style={[typography.caption, { color: c.textSecondary, marginTop: 4 }]}>
                      {cObj.channel} • {cObj.objective} • {cObj.startDate} → {cObj.endDate}
                    </Text>
                  </View>
                  <SGStatusBadge status={getCampaignStatus(cObj.status)} text={cObj.status} size="sm" />
                </View>

                {/* Metrics Row */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
                  {[
                    { icon: Eye, label: 'Impressions', value: fmtNum(cObj.impressions), color: c.textTertiary },
                    { icon: MousePointerClick, label: 'Clicks', value: fmtNum(cObj.clicks), color: c.info },
                    { icon: TrendingUp, label: 'CTR', value: `${cObj.ctr}%`, color: c.brand },
                    { icon: Users, label: 'Leads', value: fmtNum(cObj.leads), color: c.success },
                    { icon: Wallet, label: 'CPL', value: fmtMoney(cObj.cpl), color: c.warning },
                    { icon: ArrowUpRight, label: 'ROAS', value: `${cObj.roas}x`, color: '#D97706' },
                  ].map(m => (
                    <View key={m.label} style={{ minWidth: 100, gap: 4 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        {(() => { const I = m.icon; return <I size={14} color={m.color} />; })()}
                        <Text style={[typography.caption, { fontWeight: '700', textTransform: 'uppercase' }]}>{m.label}</Text>
                      </View>
                      <Text style={[typography.h3, { color: c.text }]}>{m.value}</Text>
                    </View>
                  ))}
                </View>

                {/* Budget Bar */}
                <View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Text style={[typography.smallBold, { color: c.textSecondary }]}>Ngân sách: {fmtMoney(cObj.budget)}</Text>
                    <Text style={[typography.smallBold, { color: barColor }]}>{Math.round(spendPct)}% đã dùng</Text>
                  </View>
                  <SGProgressBar progress={spendPct} color={barColor} showPercentage={false} size="sm" />
                </View>
              </SGCard>
            );
          })}
        </View>
      )}
    </SGPageContainer>
  );
}
