/**
 * SGROUP ERP — Kế hoạch Kinh doanh (SGDS Premium)
 * Sales Planning with targets, funnel, commission structure, monthly weights
 */
import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, Platform, Pressable, ActivityIndicator } from 'react-native';
import { TrendingUp, Target, DollarSign, BarChart3, CheckCircle2 } from 'lucide-react-native';
import { SGActionBar } from '../../../shared/ui/components/SGScenarioBar';
import { SGPlanningNumberField, SGPlanningSectionTitle } from '../../../shared/ui/components';
import { useGetSalesLatest } from '../hooks/useSalesPlanning';
import { useSavePlanMutation } from '../hooks/useExecPlanning';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { sgds } from '../../../shared/theme/theme';

type SalesPlan = {
  year: number; targetRevenue: number; targetGMV: number; targetDeals: number;
  avgDealSize: number; conversionRate: number; leadsNeeded: number;
  commissionRate: number; managerCommission: number;
  q1Weight: number; q2Weight: number; q3Weight: number; q4Weight: number;
};

const DEFAULT: SalesPlan = {
  year: 2026, targetRevenue: 1800, targetGMV: 12000, targetDeals: 360,
  avgDealSize: 33.3, conversionRate: 12, leadsNeeded: 3000,
  commissionRate: 35, managerCommission: 5,
  q1Weight: 20, q2Weight: 25, q3Weight: 30, q4Weight: 25,
};

const fmt = (n: number) => n.toLocaleString('vi-VN');

export function PlanSales() {
  const { theme, isDark } = useAppTheme();
  
  const [scenario, setScenario] = useState('base');
  const { data: serverData, isLoading } = useGetSalesLatest(2026, scenario);
  const saveMutation = useSavePlanMutation();

  const [plan, setPlan] = useState<SalesPlan>(DEFAULT);

  useEffect(() => {
    if (serverData && serverData.data) {
      setPlan(p => ({ ...p, ...serverData.data }));
    }
  }, [serverData]);

  const updateVal = (k: keyof SalesPlan, v: number) => setPlan(p => ({ ...p, [k]: v }));

  const calc = useMemo(() => {
    const totalCommission = plan.targetRevenue * (plan.commissionRate / 100);
    const mgrCommission = plan.targetRevenue * (plan.managerCommission / 100);
    const qRevenues = [plan.q1Weight, plan.q2Weight, plan.q3Weight, plan.q4Weight].map(w => Math.round(plan.targetRevenue * (w / 100)));
    return { totalCommission, mgrCommission, qRevenues };
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
          <TrendingUp size={20} color={theme.colors.accentBlue} />
          <Text style={{ ...sgds.typo.h3, color: cText, textTransform: 'uppercase' }}>KẾ HOẠCH KINH DOANH {plan.year}</Text>
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
          <SGPlanningSectionTitle icon={Target} title="1. MỤC TIÊU KINH DOANH" accent="#6366f1" />
          <SGPlanningNumberField label="Doanh thu mục tiêu" value={plan.targetRevenue} onChangeValue={(v) => updateVal('targetRevenue', v)} unit="Tỷ" />
          <SGPlanningNumberField label="GMV mục tiêu" value={plan.targetGMV} onChangeValue={(v) => updateVal('targetGMV', v)} unit="Tỷ" />
          <SGPlanningNumberField label="Số giao dịch" value={plan.targetDeals} onChangeValue={(v) => updateVal('targetDeals', v)} unit="deals" />
          <SGPlanningNumberField label="Giá trị TB/deal" value={plan.avgDealSize} onChangeValue={(v) => updateVal('avgDealSize', v)} unit="Tỷ" precision={1} />
          <SGPlanningNumberField label="Tỷ lệ chuyển đổi" value={plan.conversionRate} onChangeValue={(v) => updateVal('conversionRate', v)} unit="%" />
          <SGPlanningNumberField label="Leads cần thiết" value={plan.leadsNeeded} onChangeValue={(v) => updateVal('leadsNeeded', v)} unit="leads" />
        </View>

        <View style={card}>
          <SGPlanningSectionTitle icon={DollarSign} title="2. CƠ CẤU HOA HỒNG" accent="#22c55e" />
          <SGPlanningNumberField label="Tỷ lệ hoa hồng Sales" value={plan.commissionRate} onChangeValue={(v) => updateVal('commissionRate', v)} unit="%" />
          <SGPlanningNumberField label="Hoa hồng Quản lý" value={plan.managerCommission} onChangeValue={(v) => updateVal('managerCommission', v)} unit="%" />
          
          <View style={{ marginTop: 24, flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
            <View style={{ flex: 1, minWidth: 200, padding: 24, borderRadius: 20, backgroundColor: isDark ? '#6366f110' : '#eef2ff', borderWidth: 1, borderColor: isDark ? '#6366f120' : '#6366f110', alignItems: 'center' }}>
              <Text style={{ ...sgds.typo.label, color: '#6366f1', marginBottom: 8, fontWeight: '900' }}>HOA HỒNG SALES</Text>
              <Text style={{ fontSize: 28, fontWeight: '900', color: cText }}>{fmt(Math.round(calc.totalCommission))} <Text style={{ fontSize: 14, color: cSub }}>Tỷ</Text></Text>
            </View>
            <View style={{ flex: 1, minWidth: 200, padding: 24, borderRadius: 20, backgroundColor: isDark ? '#22c55e10' : '#ecfdf5', borderWidth: 1, borderColor: isDark ? '#22c55e20' : '#22c55e10', alignItems: 'center' }}>
              <Text style={{ ...sgds.typo.label, color: '#22c55e', marginBottom: 8, fontWeight: '900' }}>HOA HỒNG QUẢN LÝ</Text>
              <Text style={{ fontSize: 28, fontWeight: '900', color: cText }}>{fmt(Math.round(calc.mgrCommission))} <Text style={{ fontSize: 14, color: cSub }}>Tỷ</Text></Text>
            </View>
          </View>
        </View>

        <View style={card}>
          <SGPlanningSectionTitle icon={BarChart3} title="3. PHÂN BỔ THEO QUÝ" accent="#f59e0b" />
          <SGPlanningNumberField label="Trọng số Q1" value={plan.q1Weight} onChangeValue={(v) => updateVal('q1Weight', v)} unit="%" />
          <SGPlanningNumberField label="Trọng số Q2" value={plan.q2Weight} onChangeValue={(v) => updateVal('q2Weight', v)} unit="%" />
          <SGPlanningNumberField label="Trọng số Q3" value={plan.q3Weight} onChangeValue={(v) => updateVal('q3Weight', v)} unit="%" />
          <SGPlanningNumberField label="Trọng số Q4" value={plan.q4Weight} onChangeValue={(v) => updateVal('q4Weight', v)} unit="%" />
          
          <View style={{ marginTop: 24, flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
            {['Q1', 'Q2', 'Q3', 'Q4'].map((q, i) => (
              <View key={q} style={{ flex: 1, minWidth: 120, padding: 20, borderRadius: 20, backgroundColor: isDark ? '#f59e0b08' : '#fffbeb', borderWidth: 1, borderColor: isDark ? '#f59e0b25' : '#f59e0b15', alignItems: 'center' }}>
                <Text style={{ fontSize: 13, fontWeight: '900', color: '#f59e0b', marginBottom: 8 }}>{q}</Text>
                <Text style={{ fontSize: 22, fontWeight: '900', color: cText }}>{fmt(calc.qRevenues[i])} <Text style={{ fontSize: 12, color: cSub }}>Tỷ</Text></Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <SGActionBar
          onSave={() => {}}
          onPublish={() => saveMutation.mutate({ year: 2026, scenario: scenario.toUpperCase() as any, tab: 'PLAN_SALES', data: plan, userId: 'admin' })}
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
