/**
 * LeadManagement — MQL/SQL lead pipeline, source attribution, quality scoring
 */
import React, { useState, useMemo } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Users, Phone, Mail, ArrowRight, TrendingUp } from 'lucide-react-native';
import { useLeads } from '../hooks/useMarketing';
import {
  SGPageContainer,
  SGButton,
  SGCard,
  SGSearchBar,
  SGPillSelector,
  SGStatusBadge,
  SGEmptyState
} from '../../../shared/ui';
import { useTheme, typography, spacing } from '../../../shared/theme/theme';

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
  { key: 'NEW', label: 'Mới', color: '#3b82f6' },
  { key: 'CONTACTED', label: 'Đã liên hệ', color: '#D97706' },
  { key: 'QUALIFIED', label: 'Đủ điều kiện', color: '#8b5cf6' },
  { key: 'WON', label: 'Chuyển đổi', color: '#16a34a' },
];

const getScoreColor = (score: number, c: any) => score >= 80 ? c.success : score >= 50 ? c.warning : c.textTertiary;

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

export function LeadManagement() {
  const c = useTheme();
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
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <View style={{ width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: '#D97706' }}>
            <Users size={26} color="#fff" />
          </View>
          <View>
            <Text style={{ fontSize: 26, fontWeight: '900', color: c.text }}>MQL & LEAD MANAGEMENT</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: c.textSecondary, marginTop: 3 }}>
              {allLeads.length} leads
            </Text>
          </View>
        </View>
      </View>

      {/* Pipeline Funnel */}
      <SGCard style={{ marginBottom: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#D977061A', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={18} color="#D97706" />
          </View>
          <Text style={{ fontSize: 18, fontWeight: '900', color: c.text }}>Phễu Chuyển Đổi Lead</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
          {PIPELINE_STAGES.map((stage, i) => (
            <View key={stage.key} style={{ flex: 1, minWidth: 140, alignItems: 'center' }}>
              <View style={{
                width: '100%', paddingVertical: 20, borderRadius: 16,
                backgroundColor: `${stage.color}15`,
                alignItems: 'center', borderWidth: 1, borderColor: `${stage.color}30`,
              }}>
                <Text style={{ fontSize: 28, fontWeight: '900', color: stage.color }}>{stage.count.toLocaleString()}</Text>
                <Text style={{ fontSize: 12, fontWeight: '800', color: stage.color, letterSpacing: 0.5, marginTop: 4, textTransform: 'uppercase' }}>{stage.label}</Text>
                <Text style={[typography.caption, { color: c.textTertiary, marginTop: 2, fontWeight: '700' }]}>{stage.pct}%</Text>
              </View>
              {i < PIPELINE_STAGES.length - 1 && (
                <View style={{ position: 'absolute', right: -18, top: '50%', zIndex: 1, transform: [{ translateY: -7 }] }}>
                  <ArrowRight size={14} color={c.textTertiary} />
                </View>
              )}
            </View>
          ))}
        </View>
      </SGCard>

      {/* Search + Filter */}
      <View style={{ flexDirection: 'row', gap: 14, flexWrap: 'wrap', marginBottom: 24, alignItems: 'center' }}>
        <View style={{ flex: 1, minWidth: 280 }}>
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

      {/* Lead Cards */}
      <View style={{ gap: 12 }}>
        {isLoading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#D97706" />
            <Text style={[typography.smallBold, { color: c.textSecondary, marginTop: 12 }]}>Đang tải lead...</Text>
          </View>
        ) : filtered.length === 0 ? (
          <SGEmptyState
            title="Không tìm thấy lead nào"
            subtitle="Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm."
            icon={<Users size={48} color={c.textTertiary} />}
          />
        ) : filtered.map((lead: any) => {
          return (
            <SGCard key={lead.id} style={{ padding: spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                {/* Avatar */}
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: `${getScoreColor(lead.score, c)}1A`, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 18, fontWeight: '900', color: getScoreColor(lead.score, c) }}>{lead.name.charAt(0)}</Text>
                </View>
                {/* Info */}
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: c.text }}>{lead.name}</Text>
                    <SGStatusBadge status={getLeadStatusColor(lead.status)} text={getLeadStatusLabel(lead.status)} size="sm" />
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 6 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Phone size={12} color={c.textTertiary} />
                      <Text style={[typography.caption, { color: c.textSecondary, fontWeight: '600' }]}>{lead.phone || '—'}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Mail size={12} color={c.textTertiary} />
                      <Text style={[typography.caption, { color: c.textSecondary, fontWeight: '600' }]}>{lead.email || '—'}</Text>
                    </View>
                  </View>
                  <Text style={[typography.caption, { color: c.textTertiary, marginTop: 6, fontWeight: '600' }]}>
                    Nguồn: {lead.source} • Campaign: {lead.campaign} • {lead.createdAt}
                  </Text>
                </View>
                {/* Score */}
                <View style={{ alignItems: 'center', gap: 4 }}>
                  <View style={{ width: 52, height: 52, borderRadius: 26, borderWidth: 3, borderColor: `${getScoreColor(lead.score, c)}40`, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 18, fontWeight: '900', color: getScoreColor(lead.score, c) }}>{lead.score}</Text>
                  </View>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: c.textTertiary }}>SCORE</Text>
                </View>
              </View>
            </SGCard>
          );
        })}
      </View>
    </SGPageContainer>
  );
}
