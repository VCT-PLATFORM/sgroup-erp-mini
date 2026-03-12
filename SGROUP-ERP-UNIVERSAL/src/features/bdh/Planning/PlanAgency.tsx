/**
 * SGROUP ERP — Kế hoạch Đại lý (SGDS Premium)
 * Agency Planning with partner allocation, commission policy, KPI targets
 */
import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, Platform, Pressable, ActivityIndicator } from 'react-native';
import { Briefcase, Award, CheckCircle2, PieChart } from 'lucide-react-native';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { sgds } from '../../../shared/theme/theme';
import { SGActionBar } from '../../../shared/ui/components/SGScenarioBar';
import { SGPlanningNumberField, SGPlanningSectionTitle } from '../../../shared/ui/components';
import { useGetLatestPlan, useSavePlanMutation } from '../hooks/useExecPlanning';

type AgencyPlan = {
  year: number; totalAgencies: number; targetGMV: number; commissionRate: number;
  platinumCount: number; goldCount: number; silverCount: number; bronzeCount: number;
  platinumGMV: number; goldGMV: number; silverGMV: number; bronzeGMV: number;
  minDealTarget: number; trainingBudget: number;
};

const DEFAULT: AgencyPlan = {
  year: 2026, totalAgencies: 15, targetGMV: 600, commissionRate: 3,
  platinumCount: 2, goldCount: 4, silverCount: 5, bronzeCount: 4,
  platinumGMV: 150, goldGMV: 100, silverGMV: 60, bronzeGMV: 30,
  minDealTarget: 8, trainingBudget: 500,
};

const fmt = (n: number) => n.toLocaleString('vi-VN');

export function PlanAgency() {
  const { theme, isDark } = useAppTheme();
  
  const { data: serverPlan, isLoading: isLoadingPlan } = useGetLatestPlan({ year: 2026, scenario: 'BASE', tab: 'PLAN_AGENCY' });
  const saveMutation = useSavePlanMutation();

  const [plan, setPlan] = useState<AgencyPlan>(DEFAULT);
  const [scenario, setScenario] = useState('base');

  useEffect(() => {
    if (serverPlan && serverPlan.data) {
      setPlan(p => ({ ...p, ...serverPlan.data }));
    } else if (serverPlan) {
      setPlan(p => ({ ...p, ...serverPlan }));
    }
  }, [serverPlan]);

  const updateVal = (k: keyof AgencyPlan, v: number) => setPlan(p => ({ ...p, [k]: v }));

  const computed = useMemo(() => {
    const totalAllocGMV = plan.platinumCount * plan.platinumGMV + plan.goldCount * plan.goldGMV + plan.silverCount * plan.silverGMV + plan.bronzeCount * plan.bronzeGMV;
    const totalCommission = plan.targetGMV * (plan.commissionRate / 100);
    return { totalAllocGMV, totalCommission };
  }, [plan]);

  const cText = theme.colors.textPrimary; 
  const cSub = theme.colors.textSecondary;
  const cBorder = theme.colors.borderSubtle;
  
  const card: any = {
    backgroundColor: isDark ? 'rgba(20,24,35,0.45)' : '#fff', borderRadius: 28, padding: 32,
    borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(32px) saturate(180%)', WebkitBackdropFilter: 'blur(32px) saturate(180%)', boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.06)' } : {}),
  };

  const TIERS = [
    { label: 'Platinum', count: plan.platinumCount, gmv: plan.platinumGMV, color: '#a855f7', ck: 'platinumCount' as const, gk: 'platinumGMV' as const },
    { label: 'Gold', count: plan.goldCount, gmv: plan.goldGMV, color: '#fbbf24', ck: 'goldCount' as const, gk: 'goldGMV' as const },
    { label: 'Silver', count: plan.silverCount, gmv: plan.silverGMV, color: '#94a3b8', ck: 'silverCount' as const, gk: 'silverGMV' as const },
    { label: 'Bronze', count: plan.bronzeCount, gmv: plan.bronzeGMV, color: '#cd7f32', ck: 'bronzeCount' as const, gk: 'bronzeGMV' as const },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? theme.colors.background : theme.colors.backgroundAlt }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: cBorder, flexWrap: 'wrap', gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Briefcase size={20} color={theme.colors.accentBlue} />
          <Text style={{ ...sgds.typo.h3, color: cText, textTransform: 'uppercase' }}>KẾ HOẠCH ĐẠI LÝ {plan.year}</Text>
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
          <SGPlanningSectionTitle icon={PieChart} title="1. TỔNG QUAN ĐẠI LÝ" accent="#ec4899" />
          <SGPlanningNumberField label="Tổng số đại lý" value={plan.totalAgencies} onChangeValue={(v: number) => updateVal('totalAgencies', v)} unit="đơn vị" />
          <SGPlanningNumberField label="GMV mục tiêu (Tỷ)" value={plan.targetGMV} onChangeValue={(v: number) => updateVal('targetGMV', v)} unit="Tỷ" />
          <SGPlanningNumberField label="Tỷ lệ hoa hồng (%)" value={plan.commissionRate} onChangeValue={(v: number) => updateVal('commissionRate', v)} unit="%" />
          <SGPlanningNumberField label="Deal tối thiểu/đại lý" value={plan.minDealTarget} onChangeValue={(v: number) => updateVal('minDealTarget', v)} unit="deals" />
        </View>

        <View style={card}>
          <SGPlanningSectionTitle icon={Award} title="2. PHÂN BỔ THEO TIER" accent="#fbbf24" />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            {TIERS.map(t => (
              <View key={t.label} style={{ flex: 1, minWidth: 220, borderRadius: 20, padding: 24, borderWidth: 1, borderColor: isDark ? `${t.color}30` : `${t.color}20`, backgroundColor: isDark ? `${t.color}08` : `${t.color}05` }}>
                <View style={{ paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, backgroundColor: `${t.color}20`, alignSelf: 'flex-start', marginBottom: 16 }}>
                  <Text style={{ fontSize: 12, fontWeight: '900', color: t.color }}>{t.label}</Text>
                </View>
                
                <SGPlanningNumberField 
                  label="Số lượng" 
                  value={t.count} 
                  onChangeValue={(v: number) => updateVal(t.ck, v)} 
                  hideBorder 
                  compact 
                />
                
                <SGPlanningNumberField 
                  label="GMV/đại lý" 
                  value={t.gmv} 
                  onChangeValue={(v: number) => updateVal(t.gk, v)} 
                  unit="Tỷ" 
                  hideBorder 
                  compact 
                />

                <View style={{ marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}>
                  <Text style={{ fontSize: 11, fontWeight: '800', color: theme.colors.textTertiary }}>TỔNG GMV TIER</Text>
                  <Text style={{ fontSize: 22, fontWeight: '900', color: t.color, marginTop: 4 }}>{fmt(t.count * t.gmv)} Tỷ</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={{ marginTop: 24, flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
            <View style={{ flex: 1, minWidth: 200, padding: 24, borderRadius: 20, backgroundColor: isDark ? '#ec489910' : '#fdf2f8', borderWidth: 1, borderColor: isDark ? '#ec489920' : '#ec489910', alignItems: 'center' }}>
              <Text style={{ ...sgds.typo.label, color: '#ec4899', marginBottom: 8, fontWeight: '900' }}>TỔNG GMV PHÂN BỔ</Text>
              <Text style={{ fontSize: 32, fontWeight: '900', color: cText }}>{fmt(computed.totalAllocGMV)} <Text style={{ fontSize: 16, color: cSub }}>Tỷ</Text></Text>
            </View>
            <View style={{ flex: 1, minWidth: 200, padding: 24, borderRadius: 20, backgroundColor: isDark ? '#22c55e10' : '#ecfdf5', borderWidth: 1, borderColor: isDark ? '#22c55e20' : '#22c55e10', alignItems: 'center' }}>
              <Text style={{ ...sgds.typo.label, color: '#22c55e', marginBottom: 8, fontWeight: '900' }}>TỔNG HOA HỒNG</Text>
              <Text style={{ fontSize: 32, fontWeight: '900', color: cText }}>{fmt(computed.totalCommission)} <Text style={{ fontSize: 16, color: cSub }}>Tỷ</Text></Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <SGActionBar
          onSave={() => {}}
          onPublish={() => saveMutation.mutate({ 
            year: 2026, 
            scenario: scenario.toUpperCase() as any, 
            tab: 'PLAN_AGENCY', 
            data: plan, 
            userId: 'admin' 
          })}
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
