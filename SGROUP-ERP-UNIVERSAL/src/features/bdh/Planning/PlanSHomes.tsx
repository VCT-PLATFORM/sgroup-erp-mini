import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, Platform, Pressable, ActivityIndicator } from 'react-native';
import { Home, DollarSign, Calendar, CheckCircle2 } from 'lucide-react-native';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { sgds } from '../../../shared/theme/theme';
import { SGActionBar } from '../../../shared/ui/components/SGScenarioBar';
import { SGPlanningNumberField, SGPlanningSectionTitle } from '../../../shared/ui/components';
import { useGetLatestPlan, useSavePlanMutation } from '../hooks/useExecPlanning';

type SHomesPlan = {
  year: number; totalProjects: number; totalUnits: number; targetSold: number;
  avgPrice: number; constructionBudget: number; deliveryTarget: number; landCost: number;
};

const DEFAULT: SHomesPlan = {
  year: 2026, totalProjects: 6, totalUnits: 450, targetSold: 80,
  avgPrice: 2.8, constructionBudget: 850, deliveryTarget: 200, landCost: 1200,
};

const PIPELINE = [
  { name: 'S-Homes Thủ Đức P2', units: 100, status: 'Chuẩn bị', q: 'Q2', color: '#6366f1' },
  { name: 'S-Homes Bình Dương P3', units: 80, status: 'Thiết kế', q: 'Q3', color: '#0ea5e9' },
  { name: 'S-Homes Long An P2', units: 60, status: 'Pháp lý', q: 'Q3', color: '#22c55e' },
  { name: 'S-Homes Đồng Nai P2', units: 90, status: 'Khảo sát', q: 'Q4', color: '#f59e0b' },
  { name: 'S-Homes Quận 9 P2', units: 70, status: 'Ý tưởng', q: '2027', color: '#a855f7' },
];

const fmt = (n: number) => n.toLocaleString('vi-VN');

export function PlanSHomes() {
  const { theme, isDark } = useAppTheme();
  
  const { data: serverPlan, isLoading: isLoadingPlan } = useGetLatestPlan({ year: 2026, scenario: 'BASE', tab: 'PLAN_SHOMES' });
  const saveMutation = useSavePlanMutation();

  const [plan, setPlan] = useState<SHomesPlan>(DEFAULT);
  const [scenario, setScenario] = useState('base');

  useEffect(() => {
    if (serverPlan && serverPlan.data) {
      setPlan(p => ({ ...p, ...serverPlan.data }));
    } else if (serverPlan) {
      setPlan(p => ({ ...p, ...serverPlan }));
    }
  }, [serverPlan]);

  const updateVal = (k: keyof SHomesPlan, v: number) => setPlan(p => ({ ...p, [k]: v }));

  const calc = useMemo(() => {
    const targetUnits = Math.round(plan.totalUnits * (plan.targetSold / 100));
    const targetGMV = targetUnits * plan.avgPrice;
    const totalInvestment = plan.constructionBudget + plan.landCost;
    return { targetUnits, targetGMV: Math.round(targetGMV), totalInvestment };
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
          <Home size={20} color={theme.colors.accentBlue} />
          <Text style={{ ...sgds.typo.h3, color: cText, textTransform: 'uppercase' }}>KẾ HOẠCH S-HOMES {plan.year}</Text>
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
          <SGPlanningSectionTitle icon={Home} title="1. TỔNG QUAN S-HOMES" accent="#0ea5e9" />
          <SGPlanningNumberField label="Tổng dự án" value={plan.totalProjects} onChangeValue={(v) => updateVal('totalProjects', v)} unit="dự án" />
          <SGPlanningNumberField label="Tổng căn hộ" value={plan.totalUnits} onChangeValue={(v) => updateVal('totalUnits', v)} unit="căn" />
          <SGPlanningNumberField label="Mục tiêu bán" value={plan.targetSold} onChangeValue={(v) => updateVal('targetSold', v)} unit="%" />
          <SGPlanningNumberField label="Giá trung bình" value={plan.avgPrice} onChangeValue={(v) => updateVal('avgPrice', v)} unit="Tỷ/căn" precision={1} />
          <SGPlanningNumberField label="Mục tiêu giao nhà" value={plan.deliveryTarget} onChangeValue={(v) => updateVal('deliveryTarget', v)} unit="căn" />
          
          <View style={{ marginTop: 24, flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            <View style={{ flex: 1, minWidth: 200, padding: 24, borderRadius: 20, backgroundColor: isDark ? '#22c55e10' : '#ecfdf5', borderWidth: 1, borderColor: isDark ? '#22c55e20' : '#22c55e10', alignItems: 'center' }}>
              <Text style={{ ...sgds.typo.label, color: '#22c55e', marginBottom: 8, fontWeight: '900' }}>CĂN MỤC TIÊU BÁN</Text>
              <Text style={{ fontSize: 28, fontWeight: '900', color: cText }}>{calc.targetUnits} <Text style={{ fontSize: 14, color: cSub }}>căn</Text></Text>
            </View>
            <View style={{ flex: 1, minWidth: 200, padding: 24, borderRadius: 20, backgroundColor: isDark ? '#6366f110' : '#eef2ff', borderWidth: 1, borderColor: isDark ? '#6366f120' : '#6366f110', alignItems: 'center' }}>
              <Text style={{ ...sgds.typo.label, color: '#6366f1', marginBottom: 8, fontWeight: '900' }}>GMV DỰ KIẾN</Text>
              <Text style={{ fontSize: 28, fontWeight: '900', color: cText }}>{fmt(calc.targetGMV)} <Text style={{ fontSize: 14, color: cSub }}>Tỷ</Text></Text>
            </View>
          </View>
        </View>

        <View style={card}>
          <SGPlanningSectionTitle icon={DollarSign} title="2. NGÂN SÁCH ĐẦU TƯ" accent="#f59e0b" />
          <SGPlanningNumberField label="Chi phí xây dựng" value={plan.constructionBudget} onChangeValue={(v) => updateVal('constructionBudget', v)} unit="Tỷ" />
          <SGPlanningNumberField label="Chi phí đất" value={plan.landCost} onChangeValue={(v) => updateVal('landCost', v)} unit="Tỷ" />
          
          <View style={{ marginTop: 24, padding: 24, borderRadius: 20, backgroundColor: isDark ? '#f59e0b10' : '#fffbeb', borderWidth: 1, borderColor: isDark ? '#f59e0b20' : '#f59e0b10', alignItems: 'center' }}>
            <Text style={{ ...sgds.typo.label, color: '#f59e0b', marginBottom: 8, fontWeight: '900' }}>TỔNG ĐẦU TƯ DỰ KIẾN</Text>
            <Text style={{ fontSize: 32, fontWeight: '900', color: cText }}>{fmt(calc.totalInvestment)} <Text style={{ fontSize: 14, color: cSub }}>Tỷ</Text></Text>
          </View>
        </View>

        <View style={card}>
          <SGPlanningSectionTitle icon={Calendar} title="3. PIPELINE DỰ ÁN MỚI" accent="#a855f7" />
          {PIPELINE.map(p => (
            <View key={p.name} style={{ flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: p.color }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '800', color: cText }}>{p.name}</Text>
                <Text style={{ fontSize: 12, fontWeight: '600', color: cSub, marginTop: 4 }}>{p.units} căn hộ</Text>
              </View>
              <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: `${p.color}15` }}>
                <Text style={{ fontSize: 10, fontWeight: '900', color: p.color }}>{p.status.toUpperCase()}</Text>
              </View>
              <View style={{ paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9' }}>
                <Text style={{ fontSize: 11, fontWeight: '800', color: cSub }}>{p.q}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <SGActionBar
          onSave={() => {}}
          onPublish={() => saveMutation.mutate({ year: 2026, scenario: scenario.toUpperCase() as any, tab: 'PLAN_SHOMES', data: plan, userId: 'admin' })}
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
