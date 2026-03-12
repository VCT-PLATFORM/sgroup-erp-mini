import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { CheckCircle2, Cpu, Wallet, Settings } from 'lucide-react-native';

import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { sgds } from '../../../shared/theme/theme';
import { SGPlanningNumberField, SGPlanningSectionTitle } from '../../../shared/ui/components';
import { SGActionBar } from '../../../shared/ui/components/SGScenarioBar';
import { useGetLatestPlan, useSavePlanMutation } from '../hooks/useExecPlanning';

type ScenarioKey = 'BASE' | 'OPTIMISTIC' | 'PESSIMISTIC';

type OpsPlan = {
  year: number; hrCost: number; officeCost: number; techCost: number;
  legalCost: number; marketingOpex: number; travelCost: number; otherCost: number;
  slaTarget: number; automationTarget: number; ticketTarget: number; npsTarget: number;
};

const DEFAULT: OpsPlan = {
  year: 2026, hrCost: 600, officeCost: 122, techCost: 85, legalCost: 138,
  marketingOpex: 45, travelCost: 30, otherCost: 25,
  slaTarget: 95, automationTarget: 75, ticketTarget: 200, npsTarget: 80,
};

const SCENARIOS: Array<{ key: ScenarioKey; label: string; color: string }> = [
  { key: 'BASE', label: 'Thực tế', color: '#0EA5E9' },
  { key: 'OPTIMISTIC', label: 'Lạc quan', color: '#22C55E' },
  { key: 'PESSIMISTIC', label: 'Thận trọng', color: '#F59E0B' },
];

const COST_ITEMS: Array<{ label: string; key: keyof OpsPlan; color: string; icon: string }> = [
  { label: 'Nhân sự (HR)', key: 'hrCost', color: '#6366F1', icon: '👥' },
  { label: 'Văn phòng & CSVC', key: 'officeCost', color: '#0EA5E9', icon: '🏢' },
  { label: 'Công nghệ & IT', key: 'techCost', color: '#A855F7', icon: '💻' },
  { label: 'Pháp lý & Compliance', key: 'legalCost', color: '#22C55E', icon: '⚖️' },
  { label: 'Marketing brand', key: 'marketingOpex', color: '#EC4899', icon: '📢' },
  { label: 'Di chuyển & Đào tạo', key: 'travelCost', color: '#F59E0B', icon: '✈️' },
  { label: 'Chi phí khác', key: 'otherCost', color: '#64748B', icon: '📦' },
];

const fmt = (n: number) => n.toLocaleString('vi-VN');

export function PlanOps() {
  const { theme, isDark } = useAppTheme();
  const [scenario, setScenario] = useState<ScenarioKey>('BASE');
  const [plan, setPlan] = useState<OpsPlan>(DEFAULT);

  const { data: serverPlan, isLoading: isLoadingPlan } = useGetLatestPlan({
    year: plan.year, scenario, tab: 'PLAN_OPS',
  });

  const saveMutation = useSavePlanMutation();

  useEffect(() => {
    if (serverPlan?.data) setPlan((p) => ({ ...p, ...serverPlan.data }));
    else if (serverPlan) setPlan((p) => ({ ...p, ...serverPlan }));
  }, [serverPlan]);

  const totalOpex = useMemo(
    () => plan.hrCost + plan.officeCost + plan.techCost + plan.legalCost + plan.marketingOpex + plan.travelCost + plan.otherCost,
    [plan],
  );

  const cText = theme.colors.textPrimary; 
  const cSub = theme.colors.textSecondary;
  const cBorder = theme.colors.borderSubtle;

  const card: any = {
    backgroundColor: isDark ? 'rgba(20,24,35,0.45)' : '#fff', borderRadius: 28, padding: 32,
    borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(32px) saturate(180%)', WebkitBackdropFilter: 'blur(32px) saturate(180%)', boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.06)' } : {}),
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? theme.colors.background : theme.colors.backgroundAlt }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: cBorder, flexWrap: 'wrap', gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Settings size={20} color={theme.colors.accentBlue} />
          <Text style={{ ...sgds.typo.h3, color: cText, textTransform: 'uppercase' }}>KẾ HOẠCH VẬN HÀNH {plan.year}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {SCENARIOS.map((sc) => (
            <Pressable key={sc.key} style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8, backgroundColor: scenario === sc.key ? sc.color + '22' : 'transparent' }} onPress={() => setScenario(sc.key)}>
              <Text style={{ fontSize: 12, fontWeight: scenario === sc.key ? '800' : '600', color: scenario === sc.key ? sc.color : theme.colors.textTertiary }}>{sc.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 32, gap: 32, paddingBottom: 120 }}>
        <View style={card}>
          <SGPlanningSectionTitle icon={Wallet} title="1. NGÂN SÁCH OPEX" accent="#f97316" />
          {COST_ITEMS.map((item) => {
            const ratio = totalOpex > 0 ? (plan[item.key] / totalOpex) * 100 : 0;
            return (
              <View key={item.key} style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                <View style={{ flex: 1 }}>
                  <SGPlanningNumberField
                    label={item.label}
                    value={plan[item.key]}
                    onChangeValue={(v) => setPlan(p => ({ ...p, [item.key]: v }))}
                    unit="Tr"
                    hideBorder
                  />
                </View>
                <View style={{ width: 60, height: 4, borderRadius: 2, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                  <View style={{ height: 4, backgroundColor: item.color, width: `${ratio}%` }} />
                </View>
                <Text style={{ width: 45, fontSize: 11, fontWeight: '800', color: item.color, textAlign: 'right' }}>{ratio.toFixed(0)}%</Text>
              </View>
            );
          })}

          <View style={{ marginTop: 24, padding: 24, borderRadius: 20, backgroundColor: isDark ? '#f9731610' : '#fff7ed', borderWidth: 1, borderColor: isDark ? '#f9731620' : '#f9731610', alignItems: 'center' }}>
            <Text style={{ ...sgds.typo.label, color: '#f97316', marginBottom: 8, fontWeight: '900' }}>TỔNG CHI PHÍ VẬN HÀNH (OPEX)</Text>
            <Text style={{ fontSize: 32, fontWeight: '900', color: cText }}>{fmt(totalOpex)} <Text style={{ fontSize: 14, color: cSub }}>Tr/năm</Text></Text>
            <View style={{ height: 1, width: 40, backgroundColor: '#f9731630', marginVertical: 12 }} />
            <Text style={{ fontSize: 14, fontWeight: '700', color: cSub }}>Bình quân <Text style={{ color: cText }}>{fmt(Math.round(totalOpex / 12))} Tr</Text> / tháng</Text>
          </View>
        </View>

        <View style={card}>
          <SGPlanningSectionTitle icon={Cpu} title="2. KPI VẬN HÀNH MỤC TIÊU" accent="#22c55e" />
          {[
            { label: 'SLA mục tiêu', key: 'slaTarget' as const, unit: '%' },
            { label: 'Tự động hóa mục tiêu', key: 'automationTarget' as const, unit: '%' },
            { label: 'Ticket xử lý/tháng', key: 'ticketTarget' as const, unit: 'tkt' },
            { label: 'NPS nội bộ mục tiêu', key: 'npsTarget' as const, unit: 'pts' },
          ].map((item) => (
            <SGPlanningNumberField
              key={item.key}
              label={item.label}
              value={plan[item.key]}
              onChangeValue={(v) => setPlan(p => ({ ...p, [item.key]: v }))}
              unit={item.unit}
            />
          ))}
        </View>
      </ScrollView>

      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <SGActionBar
          onSave={() => {}}
          onPublish={() => saveMutation.mutate({ year: plan.year, scenario: scenario, tab: 'PLAN_OPS', data: plan, userId: 'admin' })}
          saveLabel="XUẤT BÁO CÁO"
          publishLabel={saveMutation.isPending ? "ĐANG LƯU..." : "LƯU KẾ HOẠCH"}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16 }}>
            {saveMutation.isPending || isLoadingPlan ? (
              <ActivityIndicator size="small" color="#10B981" />
            ) : (
              <CheckCircle2 size={16} color="#10B981" />
            )}
            <View>
              <Text style={{ fontSize: 9, fontWeight: '900', color: '#10B981', letterSpacing: 1 }}>STATUS</Text>
              <Text style={{ fontSize: 10, color: cSub, fontWeight: '600' }}>
                {isLoadingPlan ? 'LOADING API...' : saveMutation.isPending ? 'DATA SYNCING...' : 'LIVE CONNECTED'}
              </Text>
            </View>
          </View>
        </SGActionBar>
      </View>
    </View>
  );
}

