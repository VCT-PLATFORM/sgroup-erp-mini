/**
 * MarketingDashboard — Overview dashboard with KPIs, campaign summary, lead funnel
 */
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { TrendingUp, Users, Target, DollarSign, BarChart3 } from 'lucide-react-native';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { useMarketingDashboard, useCampaigns, useLeads } from '../hooks/useMarketing';
import { SGCard, SGStatCard, SGStatusBadge, SGPageContainer, SGEmptyState, SGListItem } from '../../../shared/ui';

const ACCENT = '#D97706';

const fmt = (n: number) => n.toLocaleString('vi-VN');

export function MarketingDashboard() {
  const { theme } = useAppTheme();
  const cText = theme.colors.textPrimary;
  const cSub = theme.colors.textSecondary;

  const { data: dashboard, isLoading } = useMarketingDashboard();
  const { data: campaigns } = useCampaigns({ status: 'RUNNING' });
  const { data: leads } = useLeads();

  const KPI_DATA = [
    { label: 'Leads (tổng)', value: dashboard?.totalLeads ?? 0, color: '#3b82f6', icon: <Users size={22} color="#3b82f6" /> },
    { label: 'Chiến dịch', value: dashboard?.totalCampaigns ?? 0, color: '#22c55e', icon: <Target size={22} color="#22c55e" /> },
    { label: 'Chi phí tổng', value: fmt(dashboard?.totalSpend ?? 0) + ' ₫', color: '#f43f5e', icon: <DollarSign size={22} color="#f43f5e" /> },
    { label: 'Chuyển đổi', value: dashboard?.totalConversions ?? 0, color: '#8b5cf6', icon: <BarChart3 size={22} color="#8b5cf6" /> },
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
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <View style={{ width: 56, height: 56, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: ACCENT }}>
          <TrendingUp size={28} color="#fff" />
        </View>
        <View>
          <Text style={{ fontSize: 28, fontWeight: '900', color: cText, letterSpacing: -0.5 }}>MARKETING DASHBOARD</Text>
          <Text style={{ fontSize: 14, fontWeight: '600', color: cSub, marginTop: 4 }}>Tổng hợp hiệu suất chiến dịch — Tháng 03/2026</Text>
        </View>
      </View>

      {/* KPI Cards */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 20, marginBottom: 24 }}>
        {isLoading ? (
          <View style={{ padding: 40, alignItems: 'center', flex: 1 }}>
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        ) : KPI_DATA.map((k, i) => (
          <View key={i} style={{ flex: 1, minWidth: 220 }}>
            <SGStatCard
              label={k.label}
              value={k.value}
              icon={k.icon}
              iconColor={k.color}
            />
          </View>
        ))}
      </View>

      <View style={{ flexDirection: 'row', gap: 24, flexWrap: 'wrap' }}>
        {/* Top Campaigns */}
        <View style={{ flex: 1.4, minWidth: 400 }}>
          <SGCard>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20, paddingHorizontal: 4 }}>
              <Text style={{ fontSize: 18, fontWeight: '900', color: cText, flex: 1 }}>Chiến Dịch Đang Chạy</Text>
            </View>
            {campaignList.length === 0 ? (
              <SGEmptyState title="Chưa có chiến dịch nào" subtitle="Bạn cần tạo chiến dịch mới để theo dõi." icon={<Target size={48} color={cSub} />} />
            ) : campaignList.map((c: any, i: number) => (
              <SGListItem
                key={c.id}
                title={c.name}
                subtitle={`Spend: ${fmt(Number(c.spend))} ₫ • ${c.leads} leads`}
                rightContent={<SGStatusBadge status={getCampaignStatus(c.status)} text={c.status} size="sm" />}
                separator={i < campaignList.length - 1}
              />
            ))}
          </SGCard>
        </View>

        {/* Lead Sources */}
        <View style={{ flex: 1, minWidth: 340 }}>
          <SGCard>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20, paddingHorizontal: 4 }}>
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#3b82f61A', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={18} color="#3b82f6" />
              </View>
              <Text style={{ fontSize: 18, fontWeight: '900', color: cText }}>Lead mới nhất</Text>
            </View>
            {leadList.length === 0 ? (
              <SGEmptyState title="Chưa có lead nào" subtitle="Chưa có thông tin chuyển đổi." icon={<Users size={48} color={cSub} />} />
            ) : leadList.map((l: any, i: number) => (
              <SGListItem
                key={l.id}
                title={l.name}
                subtitle={`${l.source} • ${l.email || l.phone || '—'}`}
                rightContent={<SGStatusBadge status={getLeadStatus(l.status)} text={l.status} size="sm" />}
                separator={i < leadList.length - 1}
              />
            ))}
          </SGCard>
        </View>
      </View>
    </SGPageContainer>
  );
}
