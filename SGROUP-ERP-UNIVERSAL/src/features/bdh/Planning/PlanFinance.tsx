import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, Platform, Pressable, ActivityIndicator } from 'react-native';
import { DollarSign, PieChart, CheckCircle2, Landmark } from 'lucide-react-native';
import { SGActionBar } from '../../../shared/ui/components/SGScenarioBar';
import { SGPlanningNumberField, SGPlanningSectionTitle } from '../../../shared/ui/components';
import { useGetFinanceLatest } from '../hooks/useFinancePlanning';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { sgds } from '../../../shared/theme/theme';

type FinPlan = {
  year: number; targetRevenue: number; cogs: number; mktCost: number; salesCommission: number;
  mgmtCommission: number; bonus: number; opexHR: number; opexOffice: number; opexOther: number;
  taxRate: number; monthlyFixedCost: number;
};

const DEFAULT: FinPlan = {
  year: 2026, targetRevenue: 1800, cogs: 0, mktCost: 108, salesCommission: 630, mgmtCommission: 90,
  bonus: 36, opexHR: 600, opexOffice: 122, opexOther: 233, taxRate: 20, monthlyFixedCost: 80,
};

const fmt = (n: number) => n.toLocaleString('vi-VN');

export function PlanFinance() {
  const { theme, isDark } = useAppTheme();
  
  const [scenario, setScenario] = useState('base');
  const { data: serverData, isLoading } = useGetFinanceLatest(2026, scenario);

  const [plan, setPlan] = useState<FinPlan>(DEFAULT);

  useEffect(() => {
    if (serverData && serverData.data) {
      setPlan(p => ({ ...p, ...serverData.data }));
    }
  }, [serverData]);

  const updateVal = (k: keyof FinPlan, v: number) => setPlan(p => ({ ...p, [k]: v }));

  const calc = useMemo(() => {
    const totalDirectCost = plan.salesCommission + plan.mgmtCommission + plan.mktCost + plan.bonus + plan.cogs;
    const grossProfit = plan.targetRevenue - totalDirectCost;
    const grossMargin = (grossProfit / plan.targetRevenue) * 100;
    const totalOpex = plan.opexHR + plan.opexOffice + plan.opexOther;
    const ebit = grossProfit - totalOpex;
    const tax = ebit * (plan.taxRate / 100);
    const netProfit = ebit - tax;
    const ros = (netProfit / plan.targetRevenue) * 100;
    const breakEvenRevenue = plan.monthlyFixedCost > 0 ? (totalOpex / 12) / ((grossProfit / plan.targetRevenue)) : 0;
    return { totalDirectCost, grossProfit, grossMargin, totalOpex, ebit, tax, netProfit, ros, breakEvenRevenue: Math.round(breakEvenRevenue) };
  }, [plan]);

  const cText = theme.colors.textPrimary; 
  const cSub = theme.colors.textSecondary;
  const cBorder = theme.colors.borderSubtle;

  const card: any = {
    backgroundColor: isDark ? 'rgba(20,24,35,0.45)' : '#fff', borderRadius: 28, padding: 32,
    borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(32px) saturate(180%)', WebkitBackdropFilter: 'blur(32px) saturate(180%)', boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.06)' } : {}),
  };

  const PLRow = ({ label, value, color, bold }: { label: string; value: number; color: string; bold: boolean }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', backgroundColor: bold ? (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)') : 'transparent' }}>
      <Text style={{ flex: 1, fontSize: bold ? 15 : 14, fontWeight: bold ? '900' : '600', color: bold ? cText : cSub }}>{label}</Text>
      <Text style={{ fontSize: bold ? 18 : 16, fontWeight: bold ? '900' : '700', color, textAlign: 'right' }}>
        {value < 0 ? '-' : ''}{fmt(Math.abs(Math.round(value)))} <Text style={{ fontSize: 12, color: cSub }}>Tỷ</Text>
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? theme.colors.background : theme.colors.backgroundAlt }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: cBorder, flexWrap: 'wrap', gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Landmark size={20} color={theme.colors.accentBlue} />
          <Text style={{ ...sgds.typo.h3, color: cText, textTransform: 'uppercase' }}>KẾ HOẠCH TÀI CHÍNH {plan.year}</Text>
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
          <SGPlanningSectionTitle icon={DollarSign} title="1. DỰ TOÁN DOANH THU & CHI PHÍ" accent="#6366f1" />
          <SGPlanningNumberField label="Doanh thu mục tiêu" value={plan.targetRevenue} onChangeValue={(v) => updateVal('targetRevenue', v)} unit="Tỷ" />
          <SGPlanningNumberField label="Hoa hồng Sales" value={plan.salesCommission} onChangeValue={(v) => updateVal('salesCommission', v)} unit="Tỷ" />
          <SGPlanningNumberField label="Hoa hồng Quản lý" value={plan.mgmtCommission} onChangeValue={(v) => updateVal('mgmtCommission', v)} unit="Tỷ" />
          <SGPlanningNumberField label="Chi phí Marketing" value={plan.mktCost} onChangeValue={(v) => updateVal('mktCost', v)} unit="Tỷ" />
          <SGPlanningNumberField label="Thưởng & CK" value={plan.bonus} onChangeValue={(v) => updateVal('bonus', v)} unit="Tỷ" />
          <SGPlanningNumberField label="OPEX HR" value={plan.opexHR} onChangeValue={(v) => updateVal('opexHR', v)} unit="Tỷ" />
          <SGPlanningNumberField label="OPEX Văn phòng" value={plan.opexOffice} onChangeValue={(v) => updateVal('opexOffice', v)} unit="Tỷ" />
          <SGPlanningNumberField label="OPEX Khác" value={plan.opexOther} onChangeValue={(v) => updateVal('opexOther', v)} unit="Tỷ" />
          <SGPlanningNumberField label="Thuế TNDN" value={plan.taxRate} onChangeValue={(v) => updateVal('taxRate', v)} unit="%" />
        </View>

        <View style={card}>
          <SGPlanningSectionTitle icon={PieChart} title="2. BÁO CÁO P&L DỰ KIẾN" accent="#22c55e" />
          <PLRow label="Doanh thu thuần" value={plan.targetRevenue} color="#6366f1" bold />
          <PLRow label="(-) Chi phí trực tiếp" value={-calc.totalDirectCost} color="#ef4444" bold={false} />
          <PLRow label="LỢI NHUẬN GỘP" value={calc.grossProfit} color="#22c55e" bold />
          <PLRow label="(-) Tổng OPEX" value={-calc.totalOpex} color="#f59e0b" bold={false} />
          <PLRow label="EBIT" value={calc.ebit} color={calc.ebit >= 0 ? '#22c55e' : '#ef4444'} bold />
          <PLRow label="(-) Thuế TNDN" value={-calc.tax} color="#ef4444" bold={false} />
          <PLRow label="LỢI NHUẬN RÒNG" value={calc.netProfit} color={calc.netProfit >= 0 ? '#22c55e' : '#ef4444'} bold />

          <View style={{ marginTop: 24, flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            {[
              { l: 'BIÊN GỘP', v: `${calc.grossMargin.toFixed(1)}%`, c: '#6366f1' },
              { l: 'ROS', v: `${calc.ros.toFixed(1)}%`, c: calc.ros >= 0 ? '#22c55e' : '#ef4444' },
              { l: 'BE REVENUE/M', v: `${fmt(calc.breakEvenRevenue)} Tỷ`, c: '#f59e0b' },
            ].map(r => (
              <View key={r.l} style={{ flex: 1, minWidth: 200, padding: 24, borderRadius: 20, backgroundColor: isDark ? `${r.c}10` : `${r.c}05`, borderWidth: 1, borderColor: isDark ? `${r.c}20` : `${r.c}10`, alignItems: 'center' }}>
                <Text style={{ ...sgds.typo.label, color: r.c, marginBottom: 8, fontWeight: '900' }}>{r.l}</Text>
                <Text style={{ fontSize: 26, fontWeight: '900', color: cText }}>{r.v}</Text>
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
