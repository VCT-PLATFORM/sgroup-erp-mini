/**
 * SGROUP ERP — Kế hoạch Marketing (SGDS Premium)
 * Marketing Planning with channel allocation, campaign budget, KPI targets
 */
import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, Platform, Pressable, ActivityIndicator } from 'react-native';
import { Megaphone, Target, BarChart3, CheckCircle2 } from 'lucide-react-native';
import { SGActionBar } from '../../../shared/ui/components/SGScenarioBar';
import { SGPlanningNumberField, SGPlanningSectionTitle } from '../../../shared/ui/components';
import { useGetMarketingHeader } from '../hooks/useMarketingPlanning';
import { useSavePlanMutation } from '../hooks/useExecPlanning';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { sgds } from '../../../shared/theme/theme';

type MktPlan = {
  year: number; totalBudget: number; targetLeads: number; targetCPL: number;
  digitalPct: number; eventPct: number; mediaPct: number; otherPct: number;
  targetROAS: number; targetConversion: number;
};

const DEFAULT: MktPlan = {
  year: 2026, totalBudget: 9200, targetLeads: 3000, targetCPL: 3.1,
  digitalPct: 45, eventPct: 25, mediaPct: 20, otherPct: 10,
  targetROAS: 4.2, targetConversion: 12,
};

const CHANNELS = [
  { name: 'Digital Ads (FB, Google)', color: '#6366f1', key: 'digitalPct' as const },
  { name: 'Sự kiện & Activation', color: '#22c55e', key: 'eventPct' as const },
  { name: 'Truyền thông & PR', color: '#f59e0b', key: 'mediaPct' as const },
  { name: 'Khác (SEO, Referral...)', color: '#0ea5e9', key: 'otherPct' as const },
];

const fmt = (n: number) => n.toLocaleString('vi-VN');

export function PlanMarketing() {
  const { theme, isDark } = useAppTheme();
  
  const { data: serverData, isLoading } = useGetMarketingHeader('mkt-2026-base');
  const saveMutation = useSavePlanMutation();

  const [plan, setPlan] = useState<MktPlan>(DEFAULT);
  const [scenario, setScenario] = useState('base');

  useEffect(() => {
    if (serverData && serverData.data) {
      setPlan(p => ({ ...p, ...serverData.data }));
    }
  }, [serverData]);

  const updateVal = (k: keyof MktPlan, v: number) => setPlan(p => ({ ...p, [k]: v }));

  const calc = useMemo(() => {
    const channelBudgets = CHANNELS.map(ch => ({ ...ch, budget: Math.round(plan.totalBudget * (plan[ch.key] / 100)) }));
    return { channelBudgets };
  }, [plan]);

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
          <Megaphone size={20} color={theme.colors.accentBlue} />
          <Text style={{ ...sgds.typo.h3, color: cText, textTransform: 'uppercase' }}>KẾ HOẠCH MARKETING {plan.year}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {[{ k: 'base', l: 'Thực tế', c: '#0ea5e9' }, { k: 'optimistic', l: 'Lạc quan', c: '#22c55e' }, { k: 'pessimistic', l: 'Thận trọng', c: '#f59e0b' }].map(sc => (
            <Pressable key={sc.k} style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8, backgroundColor: scenario === sc.k ? sc.c + '22' : 'transparent' }} onPress={() => setScenario(sc.k)}>
              <Text style={{ fontSize: 12, fontWeight: scenario === sc.k ? '800' : '600', color: scenario === sc.k ? sc.c : theme.colors.textTertiary }}>{sc.l}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 32, gap: 32, paddingBottom: 120 }}>
        <View style={card}>
          <SGPlanningSectionTitle icon={Target} title="1. MỤC TIÊU MARKETING" accent="#ec4899" />
          <SGPlanningNumberField label="Tổng ngân sách" value={plan.totalBudget} onChangeValue={(v) => updateVal('totalBudget', v)} unit="Tr" />
          <SGPlanningNumberField label="Mục tiêu leads" value={plan.targetLeads} onChangeValue={(v) => updateVal('targetLeads', v)} unit="leads" />
          <SGPlanningNumberField label="CPL mục tiêu" value={plan.targetCPL} onChangeValue={(v) => updateVal('targetCPL', v)} unit="Tr" precision={1} />
          <SGPlanningNumberField label="ROAS mục tiêu" value={plan.targetROAS} onChangeValue={(v) => updateVal('targetROAS', v)} unit="x" precision={1} />
          <SGPlanningNumberField label="Tỷ lệ chuyển đổi" value={plan.targetConversion} onChangeValue={(v) => updateVal('targetConversion', v)} unit="%" />
        </View>

        <View style={card}>
          <SGPlanningSectionTitle icon={BarChart3} title="2. PHÂN BỔ NGÂN SÁCH" accent="#6366f1" />
          {CHANNELS.map(ch => (
            <SGPlanningNumberField 
              key={ch.key}
              label={ch.name} 
              value={plan[ch.key]} 
              onChangeValue={(v) => updateVal(ch.key, v)} 
              unit="%" 
            />
          ))}

          {/* Stacked bar visualization */}
          <View style={{ flexDirection: 'row', height: 32, borderRadius: 16, overflow: 'hidden', marginTop: 24, marginBottom: 16 }}>
            {calc.channelBudgets.map(ch => (
              <View key={ch.key} style={{ flex: Math.max(plan[ch.key], 1), backgroundColor: ch.color, alignItems: 'center', justifyContent: 'center' }}>
                {plan[ch.key] >= 12 && <Text style={{ fontSize: 10, fontWeight: '900', color: '#fff' }}>{plan[ch.key]}%</Text>}
              </View>
            ))}
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {calc.channelBudgets.map(ch => (
              <View key={ch.key} style={{ flex: 1, minWidth: 200, padding: 16, borderRadius: 16, backgroundColor: isDark ? `${ch.color}08` : `${ch.color}05`, borderWidth: 1, borderColor: isDark ? `${ch.color}25` : `${ch.color}15`, alignItems: 'center' }}>
                <Text style={{ fontSize: 11, fontWeight: '800', color: ch.color, marginBottom: 6 }}>{ch.name.split('(')[0].trim().toUpperCase()}</Text>
                <Text style={{ fontSize: 22, fontWeight: '900', color: cText }}>{fmt(ch.budget)} <Text style={{ fontSize: 12, color: cSub }}>Tr</Text></Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <SGActionBar
          onSave={() => {}}
          onPublish={() => saveMutation.mutate({ year: plan.year, scenario: scenario.toUpperCase() as any, tab: 'PLAN_MARKETING', data: plan, userId: 'admin' })}
          saveLabel="XUẤT BÁO CÁO"
          publishLabel={saveMutation.isPending ? "ĐANG LƯU..." : "LƯU KẾ HOẠCH"}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16 }}>
            {isLoading || saveMutation.isPending ? (
              <ActivityIndicator size="small" color="#10B981" />
            ) : (
              <CheckCircle2 size={16} color="#10B981" />
            )}
            <View>
              <Text style={{ fontSize: 9, fontWeight: '900', color: '#10B981', letterSpacing: 1 }}>STATUS</Text>
              <Text style={{ fontSize: 10, color: cSub, fontWeight: '600' }}>
                {isLoading ? 'LOADING API...' : saveMutation.isPending ? 'DATA SYNCING...' : 'LIVE CONNECTED'}
              </Text>
            </View>
          </View>
        </SGActionBar>
      </View>
    </View>
  );
}
