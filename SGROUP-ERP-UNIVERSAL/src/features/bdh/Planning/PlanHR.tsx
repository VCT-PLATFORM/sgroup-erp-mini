import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, Platform, Pressable, ActivityIndicator } from 'react-native';
import { Users, UserPlus, Wallet, CheckCircle2 } from 'lucide-react-native';
import { SGActionBar } from '../../../shared/ui/components/SGScenarioBar';
import { SGPlanningNumberField, SGPlanningSectionTitle } from '../../../shared/ui/components';
import { useGetHRLatest } from '../hooks/useHRPlanning';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { sgds } from '../../../shared/theme/theme';

type HRPlan = {
  year: number; totalHeadcount: number; salesHC: number; mktHC: number; opsHC: number; backOfficeHC: number;
  newHireQ1: number; newHireQ2: number; newHireQ3: number; newHireQ4: number;
  avgSalary: number; bonusRate: number; trainingBudget: number; turnoverTarget: number;
};

const DEFAULT: HRPlan = {
  year: 2026, totalHeadcount: 280, salesHC: 140, mktHC: 32, opsHC: 40, backOfficeHC: 28,
  newHireQ1: 15, newHireQ2: 20, newHireQ3: 12, newHireQ4: 8,
  avgSalary: 18, bonusRate: 15, trainingBudget: 800, turnoverTarget: 8,
};

const fmt = (n: number) => n.toLocaleString('vi-VN');

export function PlanHR() {
  const { theme, isDark } = useAppTheme();
  
  const { data: serverData, isLoading } = useGetHRLatest(2026);

  const [plan, setPlan] = useState<HRPlan>(DEFAULT);
  const [scenario, setScenario] = useState('base');

  useEffect(() => {
    if (serverData && serverData.data) {
      setPlan(p => ({ ...p, ...serverData.data }));
    }
  }, [serverData]);

  const updateVal = (k: keyof HRPlan, v: number) => setPlan(p => ({ ...p, [k]: v }));

  const computed = useMemo(() => {
    const totalNewHire = plan.newHireQ1 + plan.newHireQ2 + plan.newHireQ3 + plan.newHireQ4;
    const totalSalaryBudget = plan.totalHeadcount * plan.avgSalary * 12;
    const totalBonus = totalSalaryBudget * (plan.bonusRate / 100);
    const totalHRCost = totalSalaryBudget + totalBonus + plan.trainingBudget;
    return { totalNewHire, totalSalaryBudget, totalBonus, totalHRCost };
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
          <Users size={20} color={theme.colors.accentBlue} />
          <Text style={{ ...sgds.typo.h3, color: cText, textTransform: 'uppercase' }}>KẾ HOẠCH NHÂN SỰ {plan.year}</Text>
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
          <SGPlanningSectionTitle icon={Users} title="1. CƠ CẤU NHÂN SỰ" accent="#6366f1" />
          <SGPlanningNumberField label="Tổng headcount" value={plan.totalHeadcount} onChangeValue={(v) => updateVal('totalHeadcount', v)} unit="người" />
          <SGPlanningNumberField label="Sales" value={plan.salesHC} onChangeValue={(v) => updateVal('salesHC', v)} unit="người" />
          <SGPlanningNumberField label="Marketing" value={plan.mktHC} onChangeValue={(v) => updateVal('mktHC', v)} unit="người" />
          <SGPlanningNumberField label="Vận hành" value={plan.opsHC} onChangeValue={(v) => updateVal('opsHC', v)} unit="người" />
          <SGPlanningNumberField label="Back Office" value={plan.backOfficeHC} onChangeValue={(v) => updateVal('backOfficeHC', v)} unit="người" />
          <View style={{ marginTop: 24, padding: 16, borderRadius: 12, backgroundColor: isDark ? 'rgba(99,102,241,0.1)' : '#eef2ff', alignItems: 'center' }}>
            <Text style={{ fontSize: 13, fontWeight: '800', color: '#6366f1' }}>NHÂN SỰ KHÁC: <Text style={{ fontSize: 15, fontWeight: '900' }}>{plan.totalHeadcount - plan.salesHC - plan.mktHC - plan.opsHC - plan.backOfficeHC}</Text> NGƯỜI</Text>
          </View>
        </View>

        <View style={card}>
          <SGPlanningSectionTitle icon={UserPlus} title="2. KẾ HOẠCH TUYỂN DỤNG" accent="#22c55e" />
          <SGPlanningNumberField label="Tuyển mới Q1" value={plan.newHireQ1} onChangeValue={(v) => updateVal('newHireQ1', v)} unit="người" />
          <SGPlanningNumberField label="Tuyển mới Q2" value={plan.newHireQ2} onChangeValue={(v) => updateVal('newHireQ2', v)} unit="người" />
          <SGPlanningNumberField label="Tuyển mới Q3" value={plan.newHireQ3} onChangeValue={(v) => updateVal('newHireQ3', v)} unit="người" />
          <SGPlanningNumberField label="Tuyển mới Q4" value={plan.newHireQ4} onChangeValue={(v) => updateVal('newHireQ4', v)} unit="người" />
          
          <View style={{ marginTop: 24, flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
            <View style={{ flex: 1, minWidth: 200, padding: 24, borderRadius: 24, backgroundColor: isDark ? '#22c55e10' : '#ecfdf5', borderWidth: 1, borderColor: isDark ? '#22c55e20' : '#22c55e10', alignItems: 'center' }}>
              <Text style={{ ...sgds.typo.label, color: '#22c55e', marginBottom: 8, fontWeight: '900' }}>TỔNG TUYỂN MỚI</Text>
              <Text style={{ fontSize: 32, fontWeight: '900', color: cText }}>{computed.totalNewHire}</Text>
            </View>
            <View style={{ flex: 1, minWidth: 200, padding: 24, borderRadius: 24, backgroundColor: isDark ? '#f59e0b10' : '#fffbeb', borderWidth: 1, borderColor: isDark ? '#f59e0b20' : '#f59e0b10', alignItems: 'center' }}>
              <Text style={{ ...sgds.typo.label, color: '#f59e0b', marginBottom: 8, fontWeight: '900' }}>BIẾN ĐỘNG (TARGET)</Text>
              <Text style={{ fontSize: 32, fontWeight: '900', color: cText }}>{plan.turnoverTarget}%</Text>
            </View>
          </View>
        </View>

        <View style={card}>
          <SGPlanningSectionTitle icon={Wallet} title="3. NGÂN SÁCH NHÂN SỰ" accent="#f59e0b" />
          <SGPlanningNumberField label="Lương trung bình" value={plan.avgSalary} onChangeValue={(v) => updateVal('avgSalary', v)} unit="Tr/tháng" />
          <SGPlanningNumberField label="Tỷ lệ thưởng" value={plan.bonusRate} onChangeValue={(v) => updateVal('bonusRate', v)} unit="%" />
          <SGPlanningNumberField label="Ngân sách đào tạo" value={plan.trainingBudget} onChangeValue={(v) => updateVal('trainingBudget', v)} unit="Tr/năm" />
          <SGPlanningNumberField label="Turnover mục tiêu" value={plan.turnoverTarget} onChangeValue={(v) => updateVal('turnoverTarget', v)} unit="%" />
          
          <View style={{ marginTop: 24, flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
            {[
              { l: 'Tổng lương/năm', v: `${fmt(Math.round(computed.totalSalaryBudget))} Tr`, c: '#6366f1' },
              { l: 'Tổng thưởng', v: `${fmt(Math.round(computed.totalBonus))} Tr`, c: '#22c55e' },
              { l: 'TỔNG CHI PHÍ HR', v: `${fmt(Math.round(computed.totalHRCost))} Tr`, c: '#f59e0b' },
            ].map(r => (
              <View key={r.l} style={{ flex: 1, minWidth: 200, padding: 24, borderRadius: 24, backgroundColor: isDark ? `${r.c}10` : `${r.c}05`, borderWidth: 1, borderColor: isDark ? `${r.c}20` : `${r.c}10`, alignItems: 'center' }}>
                <Text style={{ ...sgds.typo.label, color: r.c, marginBottom: 8, fontWeight: '900' }}>{r.l}</Text>
                <Text style={{ fontSize: 24, fontWeight: '900', color: cText }}>{r.v}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <SGActionBar
          onSave={() => {}}
          onPublish={() => {}}
          saveLabel="XUẤT BÁO CÁO"
          publishLabel="LƯU KẾ HOẠCH"
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16 }}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#10B981" />
            ) : (
              <CheckCircle2 size={16} color="#10B981" />
            )}
            <View>
              <Text style={{ fontSize: 9, fontWeight: '900', color: '#10B981', letterSpacing: 1 }}>STATUS</Text>
              <Text style={{ fontSize: 10, color: cSub, fontWeight: '600' }}>
                {isLoading ? 'LOADING API...' : 'LIVE CONNECTED'}
              </Text>
            </View>
          </View>
        </SGActionBar>
      </View>
    </View>
  );
}
