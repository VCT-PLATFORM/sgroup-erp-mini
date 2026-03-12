import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Platform,
  StyleSheet,
  Dimensions,
  TextInput,
} from 'react-native';
import {
  PieChart, Users, Building2, Megaphone, Target,
  Settings, CreditCard, LayoutGrid, Filter, Save,
  TrendingUp, Shield, Globe, ChevronDown, ChevronLeft,
  ChevronRight, X, User, History
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import {
  SGCard, SGButton, SGIcons, SGPlanningNumberField, SGPlanningSectionTitle,
  SGKeyValue, SGKeyValueGroup, SGSlider, SGSwitch
} from '../../../shared/ui/components';
import { SGAPIClient } from '../../../shared/ui/components/SGAPIClient';

// --- Assets ---
const BRAND_RED = '#d32f2f'; // Primary SGROUP Red
const ACCENT_BLUE = '#2563eb';
const ACCENT_PURPLE = '#9333ea';
const SUCCESS_GREEN = '#10b981';
const DANGER_RED = '#f43f5e';

// --- Types ---
type ScenarioKey = 'base' | 'optimistic' | 'pessimistic';

type Plan = {
  year: number;
  targetRevenue: number;
  avgFee: number;
  avgPrice: number;
  // CIV
  comSale: number;
  comManager: number;
  costMkt: number;
  costContest: number;
  costDiscount: number;
  otherInhouse: number;
  // OPEX
  salSales: number; salBO: number; salReward: number; recruitTrain: number;
  rent: number; utilities: number; stationery: number; maintenance: number;
  equip: number; depreciation: number; software: number;
  branding: number; guest: number;
  govFees: number; legalSvc: number; insurance: number; other: number;
  // Funnel
  rateDealBooking: number; rateBookingMeeting: number; rateMeetingLead: number;
  salesSelfGenRate: number;
  taxRate: number;
};

// --- Config ---
const SCENARIOS: Record<ScenarioKey, { label: string; color: string; revenue: number; avgFee: number }> = {
  base:        { label: "Thực tế",    color: ACCENT_BLUE,   revenue: 125, avgFee: 5.0 },
  optimistic:  { label: "Lạc quan",   color: SUCCESS_GREEN, revenue: 150, avgFee: 5.5 },
  pessimistic: { label: "Thận trọng", color: DANGER_RED,    revenue: 100, avgFee: 4.5 }
};

const COST_ROWS: Array<{ label: string; key: keyof Plan; rv: string; icon: string; color: string; bgColor: string }> = [
  { label: "Hoa hồng Sale",         key: "comSale",      rv: "sale",    icon: "User",        color: ACCENT_BLUE,   bgColor: "rgba(37,99,235,0.08)" },
  { label: "Hoa hồng Quản lý" ,     key: "comManager",   rv: "mgr",     icon: "Users",       color: ACCENT_PURPLE, bgColor: "rgba(147,51,234,0.08)" },
  { label: "Marketing",             key: "costMkt",      rv: "mkt",     icon: "Megaphone",   color: "#f59e0b",     bgColor: "rgba(245,158,11,0.08)" },
  { label: "Thưởng nóng/Thi đua",   key: "costContest",  rv: "contest", icon: "Target",      color: DANGER_RED,    bgColor: "rgba(244,63,94,0.08)" },
  { label: "Chiết khấu khách hàng", key: "costDiscount", rv: "disc",    icon: "CreditCard",  color: SUCCESS_GREEN, bgColor: "rgba(16,185,129,0.08)" },
  { label: "Chi phí khác",          key: "otherInhouse", rv: "other",   icon: "LayoutGrid",  color: "#64748b",     bgColor: "rgba(100,116,139,0.08)" }
];

const OPEX_CONFIG = [
  { id: 'hr', title: '1. Nhân Sự & Đào Tạo', icon: 'Users', items: [
    { key: 'salSales', label: 'Lương Cơ Bản Sales' },
    { key: 'salBO', label: 'Lương Khối Văn Phòng' },
    { key: 'salReward', label: 'Thưởng & Phúc Lợi' },
    { key: 'recruitTrain', label: 'Tuyển Dụng & Đào Tạo' }
  ]},
  { id: 'office', title: '2. Vận Hành Văn Phòng', icon: 'Building2', items: [
    { key: 'rent', label: 'Thuê Mặt Bằng' },
    { key: 'utilities', label: 'Điện, Nước, Internet' },
    { key: 'stationery', label: 'VPP & In Ấn' },
    { key: 'maintenance', label: 'Bảo Trì & Vệ Sinh' }
  ]},
  { id: 'asset', title: '3. Tài Sản & Công Nghệ', icon: 'Settings', items: [
    { key: 'equip', label: 'Mua Sắm Thiết Bị' },
    { key: 'depreciation', label: 'Khấu Hao Tài Sản' },
    { key: 'software', label: 'Phần Mềm' }
  ]},
  { id: 'dev', title: '4. Phát Triển Thương Hiệu', icon: 'Globe', items: [
    { key: 'branding', label: 'Branding Thương Hiệu' },
    { key: 'guest', label: 'Tiếp Khách & Quà Tặng' }
  ]},
  { id: 'legal', title: '5. Pháp Lý & Dự Phòng', icon: 'Shield', items: [
    { key: 'govFees', label: 'Phí Nhà Nước' },
    { key: 'legalSvc', label: 'Dịch Vụ Cố Vấn' },
    { key: 'insurance', label: 'Bảo Hiểm (Tự động)', auto: true },
    { key: 'other', label: 'Dự Phòng' }
  ]}
];

// --- Helpers ---
const fmt = (v: number) => Number(v || 0).toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmt0 = (v: number) => Math.round(v || 0).toLocaleString('vi-VN');

// Helper component for dynamic icons
const LucideIcons = {
  PieChart, Users, Building2, Megaphone, Target,
  Settings, CreditCard, LayoutGrid, Filter, Save,
  TrendingUp, Shield, Globe, ChevronDown, ChevronLeft,
  ChevronRight, X, User, History
};

const Icon = ({ name, size = 16, color }: { name: keyof typeof LucideIcons; size?: number; color?: string }) => {
  const IconCmp = LucideIcons[name];
  if (!IconCmp) return null;
  return <IconCmp size={size} color={color} />;
};

export function PlanTotal() {
  const { theme, isDark, colors: c } = useAppTheme();
  const [scenario, setScenario] = useState<ScenarioKey>('base');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [plan, setPlan] = useState<Plan>({
    year: 2026, targetRevenue: 125, avgFee: 5.0, avgPrice: 3.5,
    comSale: 35, comManager: 5, costMkt: 6, costContest: 1, costDiscount: 2, otherInhouse: 2,
    salSales: 350, salBO: 200, salReward: 20, recruitTrain: 30,
    rent: 80, utilities: 20, stationery: 10, maintenance: 12,
    equip: 20, depreciation: 10, software: 20, branding: 15, guest: 30,
    govFees: 5, legalSvc: 10, insurance: 0, other: 5,
    rateDealBooking: 60, rateBookingMeeting: 20, rateMeetingLead: 15,
    salesSelfGenRate: 70, taxRate: 20
  });

  // --- Calculations ---
  const result = useMemo(() => {
    const rev = plan.targetRevenue;
    const fee = plan.avgFee;

    // Fixed % Calculation from image: CIV % is based on targetRevenue * avgFee
    // If input is 35%, it means 35% of the Commission (rev), which is (rev * fee / 100)
    const commTotal = rev;
    const civCommPct = (plan.comSale + plan.comManager + plan.costMkt + plan.costContest + plan.costDiscount + plan.otherInhouse);
    
    const civ = {
      sale: (rev * plan.comSale) / 100,
      mgr: (rev * plan.comManager) / 100,
      mkt: (rev * plan.costMkt) / 100,
      contest: (rev * plan.costContest) / 100,
      disc: (rev * plan.costDiscount) / 100,
      other: (rev * plan.otherInhouse) / 100
    };

    const totalCIV = Object.values(civ).reduce((a, b) => a + b, 0);
    const totalCIVPct = civCommPct;
    const netCommission = rev - totalCIV;
    const gpMargin = (netCommission / rev) * 100;
    
    // Auto opex insurance
    const autoInsurance = (plan.salSales + plan.salBO) * 0.215 + 0; // Simplified
    const opexMByGroup = [
      plan.salSales + plan.salBO + plan.salReward + plan.recruitTrain,
      plan.rent + plan.utilities + plan.stationery + plan.maintenance,
      plan.equip + plan.depreciation + plan.software,
      plan.branding + plan.guest,
      plan.govFees + plan.legalSvc + autoInsurance + plan.other
    ];
    
    const totalOpexM = opexMByGroup.reduce((a, b) => a + b, 0);
    const totalOpexY = (totalOpexM * 12) / 1000;
    const ebt = netCommission - totalOpexY;
    const tax = ebt > 0 ? ebt * (plan.taxRate / 100) : 0;
    const netProfit = ebt - tax;
    const ros = rev > 0 ? (netProfit / rev) * 100 : 0;

    const targetGMV = fee > 0 ? (rev / (fee / 100)) : 0;
    const numDeals = plan.avgPrice > 0 ? Math.ceil(targetGMV / plan.avgPrice) : 0;
    
    const numLeads = numDeals / (plan.rateMeetingLead/100 * plan.rateBookingMeeting/100 * plan.rateDealBooking/100);
    const numMeetings = numLeads * (plan.rateMeetingLead/100);
    const numBookings = numMeetings * (plan.rateBookingMeeting/100);

    const breakEvenRev = (totalOpexY / (gpMargin / 100));
    const safetyMargin = rev - breakEvenRev;
    const safetyMarginPct = (safetyMargin / rev) * 100;

    return { 
      civ, totalCIV, totalCIVPct, netCommission, gpMargin, 
      totalOpexM, totalOpexY, ebt, tax, netProfit, ros,
      targetGMV, numDeals, autoInsurance, opexMByGroup,
      numLeads, numMeetings, numBookings,
      breakEvenRev, safetyMargin, safetyMarginPct
    };
  }, [plan]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (typeof (window as any).google !== 'undefined') {
        await SGAPIClient.call('processSavePlan', { plan, result, scenario });
        alert('Đã lưu kế hoạch thành công!');
      } else {
        setTimeout(() => {
          alert('Đã lưu dữ liệu giả lập!');
          setSaving(false);
        }, 1000);
      }
    } catch (e: any) {
      alert(`Lỗi: ${e.message}`);
      setSaving(false);
    }
  };

  const setField = (k: keyof Plan, v: number) => setPlan(p => ({ ...p, [k]: v }));

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={{ fontSize: 32, fontWeight: '900', color: isDark ? '#fff' : '#0f172a' }}>Lập Kế Hoạch Kinh Doanh</Text>
            <Text style={{ fontSize: 12, fontWeight: '700', color: isDark ? '#94a3b8' : '#64748b', letterSpacing: 1.2 }}>SGroup ERP — Planning CEO</Text>
          </View>
          
          <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', padding: 6, borderRadius: 12, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9' }}>
              {(['base', 'optimistic', 'pessimistic'] as const).map(k => (
                <Pressable key={k} onPress={() => setScenario(k)}
                  style={[{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }, scenario === k && { backgroundColor: SCENARIOS[k].color }]}>
                  <Text style={{ fontSize: 11, fontWeight: '800', color: scenario === k ? '#fff' : (isDark ? '#94a3b8' : '#64748b') }}>
                    {SCENARIOS[k].label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <SGButton variant="secondary" icon="History" title="LỊCH SỬ" style={{ borderRadius: 10 }} />
              <SGButton variant="primary" icon="Save" title="LƯU" loading={saving} onPress={handleSave} style={{ borderRadius: 10, width: 90 }} />
            </View>
          </View>
        </View>

        {/* 1. BẢNG DOANH THU & CHI PHÍ */}
        <SGCard variant="glass" style={styles.sectionCard}>
          <SGPlanningSectionTitle 
            icon={() => <LucideIcons.History size={22} color="#fff" />}
            title="1. BẢNG DOANH THU & CHI PHÍ" 
            accent={ACCENT_BLUE}

            style={{ marginBottom: 40 }}
          />

          <View style={styles.metricBigRow}>
            <View style={styles.metricBigBox}>
              <Text style={styles.metricBigLabel}>DOANH THU MỤC TIÊU</Text>
              <View style={styles.metricBigValueLine}>
                <TextInput
                  value={String(plan.targetRevenue || 0)}
                  onChangeText={t => setField('targetRevenue', Number(t) || 0)}
                  style={[styles.bigInputStatic, { color: ACCENT_BLUE, outlineStyle: 'none' } as any]}
                  keyboardType="numeric"
                  underlineColorAndroid="transparent"
                />
                <Text style={styles.unitBigStatic}>Tỷ</Text>
              </View>
            </View>
            <View style={styles.vDividerBig} />
            <View style={styles.metricBigBox}>
              <Text style={styles.metricBigLabel}>PHÍ MÔI GIỚI BÌNH QUÂN</Text>
              <View style={styles.metricBigValueLine}>
                <TextInput
                  value={String(plan.avgFee || 0)}
                  onChangeText={t => setField('avgFee', Number(t) || 0)}
                  style={[styles.bigInputStatic, { color: ACCENT_PURPLE, outlineStyle: 'none' } as any]}
                  keyboardType="numeric"
                  underlineColorAndroid="transparent"
                />
                <Text style={styles.unitBigStatic}>%</Text>
              </View>
            </View>
          </View>

          <View style={styles.tableHeader}>
            <Text style={[styles.headerCol, { flex: 2, textAlign: 'left', paddingLeft: 10 }]}>BIẾN PHÍ VẬN HÀNH</Text>
            <Text style={[styles.headerCol, { flex: 1.2 }]}>TỶ LỆ (%) / DOANH THU</Text>
            <Text style={[styles.headerCol, { flex: 1 }]}>TỶ LỆ (%) / DOANH SỐ</Text>
            <Text style={[styles.headerCol, { flex: 1.2 }]}>GIÁ TRỊ QUY ĐỔI</Text>
            <Text style={[styles.headerCol, { flex: 1, textAlign: 'right' }]}>SỐ TIỀN / GD</Text>
          </View>

          <View style={styles.costTable}>
            {COST_ROWS.map(row => (
              <View key={row.key} style={styles.rowWrapper}>
                <View style={[styles.costLabelCol, { flex: 2 }]}>
                  <View style={[styles.miniIconBox, { backgroundColor: row.bgColor }]}>
                    <Icon name={row.icon as keyof typeof LucideIcons} size={14} color={row.color} />
                  </View>
                  <Text style={styles.rowLabelText}>{row.label}</Text>
                </View>
                
                <View style={[styles.headerCol, { flex: 1.2, alignItems: 'center', justifyContent: 'center' }]}>
                  <SGPlanningNumberField 
                    value={plan[row.key]} 
                    step={0.1} 
                    onChangeValue={v => setField(row.key, v)} 
                    unit="%" 
                    precision={1}
                    compact
                    accent={isDark ? '#fff' : ACCENT_BLUE}
                    hideBorder
                    containerStyle={{ borderBottomWidth: 0, paddingVertical: 2 }}
                  />
                </View>

                <View style={[styles.headerCol, { flex: 1 }]}>
                  <Text style={styles.rowStaticPct}>{fmt((plan[row.key] * plan.avgFee) / 100)} %</Text>
                </View>

                <View style={[styles.headerCol, { flex: 1.2 }]}>
                  <Text style={[styles.rowStaticVal, { color: ACCENT_BLUE }]}>{fmt(result.civ[row.rv as keyof typeof result.civ])} <Text style={{ fontSize: 9 }}>TỶ</Text></Text>
                </View>

                <View style={[styles.headerCol, { flex: 1, alignItems: 'flex-end' }]}>
                  <Text style={[styles.rowStaticVal, { color: ACCENT_PURPLE }]}>{fmt0((result.civ[row.rv as keyof typeof result.civ] * 1000) / (result.numDeals || 1))} <Text style={{ fontSize: 8 }}>TR/GD</Text></Text>
                </View>
              </View>
            ))}

            <View style={styles.totalCIVRow}>
               <Text style={styles.totalLabel}>TỔNG BIẾN PHÍ</Text>
               <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 3, justifyContent: 'flex-end' }}>
                  <View style={{ flex: 1, alignItems: 'center' }}><Text style={[styles.totalVal, { color: ACCENT_PURPLE, fontSize: 22 }]}>{fmt(result.totalCIVPct)} %</Text></View>
                  <View style={{ flex: 0.8, alignItems: 'center' }}><Text style={[styles.totalVal, { fontSize: 20 }]}>{fmt0((result.totalCIVPct * plan.avgFee) / 100)} %</Text></View>
                  <View style={{ flex: 1.2, alignItems: 'center' }}><Text style={[styles.totalVal, { color: ACCENT_BLUE, fontSize: 24 }]}>{fmt(result.totalCIV)} TỶ</Text></View>
                  <View style={{ flex: 1.2, alignItems: 'flex-end' }}><Text style={[styles.totalVal, { color: ACCENT_PURPLE, fontSize: 22 }]}>{fmt0((result.totalCIV * 1000) / (result.numDeals || 1))} TR/GD</Text></View>
               </View>
            </View>
          </View>
        </SGCard>

        {/* GP Banner */}
        <LinearGradient colors={['#1e1b4b', '#312e81']} style={styles.gpBanner}>
           <View style={{ width: 56, height: 56, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' }}>
             <Icon name="CreditCard" size={28} color="#fff" />
           </View>
           <View style={{ flex: 1, marginLeft: 20 }}>
              <Text style={styles.gpTitle}>LỢI NHUẬN GỘP (GP)</Text>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
                 <View style={styles.gpBadge}><Text style={styles.gpBadgeText}>% DOANH THU CÒN LẠI: {fmt(result.gpMargin)}%</Text></View>
                 <View style={styles.gpBadge}><Text style={styles.gpBadgeText}>% DOANH SỐ CÒN LẠI: {fmt((result.gpMargin * plan.avgFee) / 100)}%</Text></View>
              </View>
           </View>
           <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.gpValue}>{fmt(result.netCommission)}</Text>
              <Text style={styles.gpUnit}>TỶ VNĐ</Text>
           </View>
        </LinearGradient>

        <SGCard variant="glass" style={styles.sectionCard}>
           <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
             <SGPlanningSectionTitle 
               icon={() => <Icon name="Filter" size={22} color="#fff" />}
               title="2. ĐỊNH PHÍ VẬN HÀNH (THÁNG)" 
               accent={DANGER_RED} 
               badgeText="CONFIG 02"
               style={{ marginBottom: 40, flex: 1 }}
             />
             <Text style={{ fontSize: 10, fontWeight: '700', color: '#94a3b8', marginTop: 8 }}>ĐƠN VỊ: TRIỆU VNĐ</Text>
           </View>
           
           <View style={styles.opexGridFixed}>
              {OPEX_CONFIG.map((col, idx) => (
                <View key={col.id} style={styles.opexColFixed}>
                   <View style={styles.opexHeaderFixed}>
                      <Icon name={col.icon as keyof typeof LucideIcons} size={14} color="#64748b" />
                      <Text style={styles.opexTitleFixed}>{col.title}</Text>
                   </View>
                   <View style={styles.opexItemsFixed}>
                      {col.items.map(item => (
                        <View key={item.key} style={styles.opexItemRow}>
                           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                             <Text style={styles.opexItemLabel} numberOfLines={2}>{item.label}</Text>
                             {item.auto && (
                               <View style={{ backgroundColor: '#fbbf24', paddingHorizontal: 5, paddingVertical: 1, borderRadius: 3 }}>
                                 <Text style={{ fontSize: 6, fontWeight: '900', color: '#fff' }}>TỰ ĐỘNG</Text>
                               </View>
                             )}
                           </View>
                           <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'flex-end', gap: 3, marginTop: 2 }}>
                              <TextInput 
                                value={String(item.auto ? Math.round(result.autoInsurance) : plan[item.key as keyof Plan])}
                                onChangeText={t => !item.auto && setField(item.key as keyof Plan, Number(t) || 0)}
                                editable={!item.auto}
                                style={[styles.opexItemInput, { 
                                 outlineStyle: 'none',
                                 fontSize: 18,
                                 fontWeight: '900',
                               } as any]}
                               underlineColorAndroid="transparent"
                               keyboardType="numeric"
                             />
                              <Text style={{ fontSize: 9, fontWeight: '700', color: '#94a3b8' }}>Triệu</Text>
                           </View>
                        </View>
                      ))}
                   </View>
                   <View style={styles.opexGroupTotal}>
                      <Text style={styles.opexGroupTotalLabel}>TỔNG NHÓM</Text>
                      <Text style={[styles.opexGroupTotalVal, { fontSize: 18, color: ACCENT_BLUE }]}>{fmt0(result.opexMByGroup[idx])} <Text style={{ fontSize: 10, color: '#94a3b8' }}>Triệu</Text></Text>
                   </View>
                </View>
              ))}
           </View>

           <View style={styles.opexSummaryRow}>
              <View style={[styles.summaryPill, { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }]}>
                 <Text style={styles.summaryLabel}>CHI PHÍ / THÁNG{"\n"}<Text style={{ fontSize: 8, color: '#94a3b8' }}>(DỰ KIẾN TRUNG BÌNH)</Text></Text>
                 <Text style={[styles.summaryValLarge, { color: '#16a34a' }]}>{fmt0(result.totalOpexM)} <Text style={{ fontSize: 16, fontWeight: '700' }}>Triệu</Text></Text>
              </View>
              <View style={[styles.summaryPill, { backgroundColor: '#fef2f2', borderColor: '#fecaca' }]}>
                 <Text style={styles.summaryLabel}>TỔNG ĐỊNH PHÍ / NĂM{"\n"}<Text style={{ fontSize: 8, color: '#94a3b8' }}>(= THÁNG X 12)</Text></Text>
                 <Text style={[styles.summaryValLarge, { color: DANGER_RED }]}>{fmt(result.totalOpexY)} <Text style={{ fontSize: 16, fontWeight: '700' }}>Tỷ</Text></Text>
              </View>
              <View style={[styles.summaryPill, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }]}>
                 <Text style={styles.summaryLabel}>TỶ LỆ / DOANH THU{"\n"}<Text style={{ fontSize: 8, color: '#94a3b8' }}>(ĐỊNH PHÍ / DOANH THU)</Text></Text>
                 <Text style={[styles.summaryValLarge, { color: ACCENT_BLUE }]}>{fmt(result.totalOpexY / plan.targetRevenue * 100)} <Text style={{ fontSize: 20 }}>%</Text></Text>
              </View>
           </View>
        </SGCard>

        {/* 3. BÁO CÁO P&L TÓM TẮT */}
        <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.plDashboard}>
           <View style={{ flex: 1.5, paddingRight: 40, borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.1)' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 30 }}>
                 <Icon name="History" size={18} color="#fff" />
                 <Text style={{ fontSize: 16, fontWeight: '900', color: '#fff' }}>3. BÁO CÁO P&L TÓM TẮT</Text>
              </View>
              
              <View style={styles.plItem}>
                 <Text style={styles.plLabelText}>1. Lợi nhuận Gộp (GP)</Text>
                 <Text style={styles.plItemVal}>{fmt(result.netCommission)} Tỷ</Text>
              </View>
              <View style={styles.plItem}>
                 <Text style={styles.plLabelText}>2. (-) Chi phí Vận hành (OPEX)</Text>
                 <Text style={[styles.plItemVal, { color: DANGER_RED }]}>{fmt(result.totalOpexY)} Tỷ</Text>
              </View>
              <View style={[styles.plItem, { marginTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 20 }]}>
                 <Text style={[styles.plLabelText, { fontSize: 18 }]}>3. Lợi nhuận Trước thuế (EBT)</Text>
                 <Text style={[styles.plItemVal, { fontSize: 28, color: '#fff' }]}>{fmt(result.ebt)} Tỷ</Text>
              </View>
              <View style={[styles.plItem, { alignItems: 'center' }]}>
                 <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={[styles.plLabelText, { fontSize: 11 }]}>Thuế TNDN (%):</Text>
                     <TextInput 
                       value={String(plan.taxRate)}
                       onChangeText={t => setField('taxRate', Number(t) || 0)}
                       style={[styles.plTaxInput, { 
                         outlineStyle: 'none' 
                       } as any]}
                       underlineColorAndroid="transparent"
                       keyboardType="numeric"
                     />
                 </View>
                 <Text style={[styles.plItemVal, { color: DANGER_RED, fontSize: 16 }]}>{fmt(result.tax)} Tỷ</Text>
              </View>
           </View>

           <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={styles.plRightTitle}>LỢI NHUẬN RÒNG</Text>
              <Text style={styles.plNetVal}>{fmt(result.netProfit).replace('.00', '')}</Text>
              <View style={{ flexDirection: 'row', gap: 20, marginTop: 30 }}>
                 <View style={styles.rosBox}>
                    <Text style={styles.rosLabel}>ROS %</Text>
                    <Text style={styles.rosVal}>{fmt(result.ros)}%</Text>
                 </View>
                 <View style={styles.rosBox}>
                    <Text style={styles.rosLabel}>BIÊN LN GỘP</Text>
                    <Text style={styles.rosVal}>{fmt(result.gpMargin)}%</Text>
                 </View>
              </View>
           </View>
        </LinearGradient>

        {/* 4. BREAK-EVEN ANALYTICS */}
        <SGCard variant="glass" style={styles.sectionCard}>
           <SGPlanningSectionTitle 
             icon={() => <Icon name="Target" size={22} color="#fff" />}
             title="4. PHÂN TÍCH ĐIỂM HÒA VỐN (BREAK-EVEN)" 
             accent={ACCENT_BLUE} 
             badgeText="ANALYTICS"
           />

           <View style={{ flexDirection: 'row', gap: 24 }}>
              <View style={[styles.beBox, { flex: 1, backgroundColor: '#f5f8ff' }]}>
                 <Text style={styles.beLabel}>DOANH THU HÒA VỐN (NĂM)</Text>
                 <Text style={[styles.beVal, { color: ACCENT_BLUE }]}>{fmt(result.breakEvenRev)} <Text style={{ fontSize: 18 }}>Tỷ</Text></Text>
                 <Text style={styles.beSub}>Mức doanh thu tối thiểu cần đạt để bù đắp định phí vận hành {fmt(result.totalOpexY)} Tỷ.</Text>
              </View>
              <View style={[styles.beBox, { flex: 1.2, backgroundColor: '#f0fdf4' }]}>
                 <Text style={styles.beLabel}>BIÊN AN TOÀN (SAFETY MARGIN)</Text>
                 <Text style={[styles.beVal, { color: '#16a34a' }]}>{fmt(result.safetyMargin)} <Text style={{ fontSize: 18 }}>Tỷ</Text></Text>
                  <View style={styles.progressContainer}>
                     <View style={[styles.progressBar, { width: `${Math.min(100, result.safetyMarginPct)}%`, backgroundColor: '#16a34a' }]}>
                        <Text style={{ fontSize: 8, fontWeight: '900', color: '#fff', textAlign: 'center', lineHeight: 14 }}>{fmt0(result.safetyMarginPct)}%</Text>
                     </View>
                  </View>
                 <Text style={[styles.beSub, { color: '#16a34a' }]}>An toàn {fmt(result.safetyMarginPct)}% so với hòa vốn.</Text>
              </View>
           </View>
        </SGCard>

        {/* 5. SALES FUNNEL */}
        <SGCard variant="glass" style={styles.sectionCard}>
           <SGPlanningSectionTitle 
             icon={() => <Icon name="Filter" size={22} color="#fff" />}
             title="5. KẾ HOẠCH KINH DOANH & PHỄU BÁN HÀNG (INHOUSE)" 
             accent={ACCENT_PURPLE} 
             badgeText="SALES OPS"
           />

           <View style={styles.gmvSection}>
              <Text style={styles.gmvLabel}>MỤC TIÊU GIÁ TRỊ GIAO DỊCH (GMV)</Text>
              <Text style={styles.gmvVal}>{fmt0(result.targetGMV)} <Text style={{ fontSize: 24 }}>Tỷ</Text></Text>
              <View style={styles.gmvBadge}><Text style={styles.gmvBadgeText}>Doanh thu Inhouse: {fmt(plan.targetRevenue)} Tỷ</Text></View>
           </View>

           <View style={{ flexDirection: 'row', gap: 30, marginTop: 40 }}>
              <View style={{ flex: 1.1 }}>
                 <View style={{ padding: 24, borderRadius: 24, backgroundColor: '#fff', borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 15, shadowOffset: { width: 0, height: 8 }, elevation: 3 }}>
                    <Text style={{ fontSize: 11, fontWeight: '900', color: ACCENT_PURPLE, marginBottom: 16, letterSpacing: 0.5, textTransform: 'uppercase' }}>THAM SỐ HIỆU SUẤT</Text>
                    <SGPlanningNumberField hideBorder label="Giá trị TB / Giao dịch" value={plan.avgPrice} onChangeValue={v => setField('avgPrice', v)} step={0.1} precision={1} compact unit="Tỷ" containerStyle={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }} />
                    <SGPlanningNumberField hideBorder label="Tỷ lệ Giao dịch / Giữ chỗ" value={plan.rateDealBooking} onChangeValue={v => setField('rateDealBooking', v)} unit="%" compact containerStyle={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }} />
                    <SGPlanningNumberField hideBorder label="Tỷ lệ Giữ chỗ / Hẹn gặp" value={plan.rateBookingMeeting} onChangeValue={v => setField('rateBookingMeeting', v)} unit="%" compact containerStyle={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }} />
                    <SGPlanningNumberField hideBorder label="Tỷ lệ Hẹn gặp / KHQT" value={plan.rateMeetingLead} onChangeValue={v => setField('rateMeetingLead', v)} unit="%" compact containerStyle={{ paddingVertical: 10 }} />
                 </View>
              </View>

              <View style={styles.funnelRight}>
                 <View style={[styles.funnelItem, { width: '85%', backgroundColor: '#fff', zIndex: 4, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 }]}><Text style={styles.funnelLabel}>1. KHQT</Text><Text style={styles.funnelVal}>{fmt0(result.numLeads)}</Text></View>
                 <View style={{ zIndex: 5, marginTop: -16, marginBottom: -16 }}>
                   <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 4 }}>
                     <Icon name="ChevronDown" size={18} color="#94a3b8" />
                   </View>
                 </View>
                 
                 <View style={[styles.funnelItem, { width: '75%', backgroundColor: '#f8fafc', zIndex: 3, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 }]}><Text style={styles.funnelLabel}>2. HẸN GẶP</Text><Text style={[styles.funnelVal, { color: '#0ea5e9' }]}>{fmt0(result.numMeetings)}</Text></View>
                 <View style={{ zIndex: 5, marginTop: -16, marginBottom: -16 }}>
                   <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 4 }}>
                     <Icon name="ChevronDown" size={18} color="#94a3b8" />
                   </View>
                 </View>

                 <View style={[styles.funnelItem, { width: '65%', backgroundColor: '#f1f5f9', zIndex: 2, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 }]}><Text style={styles.funnelLabel}>3. BOOKING</Text><Text style={[styles.funnelVal, { color: '#3b82f6' }]}>{fmt0(result.numBookings)}</Text></View>
                 <View style={{ zIndex: 5, marginTop: -16, marginBottom: -16 }}>
                   <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 4 }}>
                     <Icon name="ChevronDown" size={18} color="#94a3b8" />
                   </View>
                 </View>

                 <LinearGradient colors={['#9333ea', '#7e22ce']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.funnelFinal, { width: '55%', zIndex: 1, shadowColor: '#9333ea', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 8 }]}><Text style={styles.funnelLabelLight}>4. GIAO DỊCH</Text><Text style={styles.funnelValLight}>{fmt0(result.numDeals)}</Text></LinearGradient>
              </View>
           </View>
        </SGCard>

        {/* 6. MARKETING ALLOCATION */}
        <SGCard variant="glass" style={styles.sectionCard}>
           <SGPlanningSectionTitle 
             icon={() => <Icon name="Megaphone" size={22} color="#fff" />}
             title="PHÂN BỔ TỪ MARKETING & SALES" 
             accent={ACCENT_BLUE} 
             badgeText="STRATEGY"
             subtitle="Điều chỉnh tỷ trọng phân bổ giữa Marketing & Sales tự kiếm"
           />

           <View style={{ padding: 20 }}>
              <SGSlider 
                value={plan.salesSelfGenRate} 
                onValueChange={v => setField('salesSelfGenRate', v)} 
                min={0} max={100}
                formatValue={v => `MKT ${100-v}% | SALES ${v}%`}
                leftColor="#2563EB"
                rightColor="#F97316"
                trackHeight={12}
                thumbSize={32}
              />
              
              <View style={styles.allocTable}>
                 <View style={styles.allocHeader}>
                    <Text style={styles.allocHCol}>GIAI ĐOẠN</Text>
                    <Text style={styles.allocHCol}>MARKETING</Text>
                    <Text style={styles.allocHCol}>TỔNG</Text>
                    <Text style={styles.allocHCol}>SALES TỰ KIẾM</Text>
                 </View>
                 {[
                   { label: 'KHQT', total: result.numLeads },
                   { label: 'Hẹn Gặp', total: result.numMeetings },
                   { label: 'Giữ Chỗ', total: result.numBookings },
                   { label: 'GIAO DỊCH', total: result.numDeals, bold: true }
                 ].map(row => (
                   <View key={row.label} style={styles.allocRow}>
                      <Text style={[styles.allocLabel, row.bold && { fontWeight: '900', color: ACCENT_PURPLE }]}>{row.label}</Text>
                      <Text style={[styles.allocValMkt, row.bold && { fontSize: 18 }]}>{fmt0(row.total * (1 - plan.salesSelfGenRate/100))}</Text>
                      <Text style={[styles.allocValTotal, row.bold && { fontSize: 18 }]}>{fmt0(row.total)}</Text>
                      <Text style={[styles.allocValSales, row.bold && { fontSize: 18 }]}>{fmt0(row.total * (plan.salesSelfGenRate/100))}</Text>
                   </View>
                 ))}
              </View>
           </View>
        </SGCard>

      </ScrollView>

      {/* Footer Toolbar */}
      <View style={[styles.footer, { backgroundColor: isDark ? '#0f172a' : '#fff', borderTopColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
        <View style={styles.footerContent}>
          <View style={styles.footerMetric}>
            <Text style={styles.fLabel}>GMV ƯỚC TÍNH</Text>
            <Text style={[styles.fVal, { color: isDark ? '#fff' : '#0f172a' }]}>{fmt0(result.targetGMV)} <Text style={styles.fUnit}>Tỷ</Text></Text>
          </View>
          <View style={styles.fDivider} />
          <View style={styles.footerMetric}>
            <Text style={styles.fLabel}>GIAO DỊCH DỰ KIẾN</Text>
            <Text style={[styles.fVal, { color: isDark ? '#fff' : '#0f172a' }]}>{fmt0(result.numDeals)} <Text style={styles.fUnit}>GD</Text></Text>
          </View>
          <View style={styles.fDivider} />
          <View style={styles.footerMetric}>
            <Text style={styles.fLabel}>TỔNG BIẾN PHÍ (CIV)</Text>
            <Text style={[styles.fVal, { color: '#f43f5e' }]}>{fmt(result.totalCIV)} <Text style={styles.fUnit}>Tỷ</Text></Text>
          </View>
          <View style={styles.fDivider} />
          <View style={styles.footerMetric}>
            <Text style={styles.fLabel}>LỢI NHUẬN RÒNG (NP)</Text>
            <Text style={[styles.fVal, { color: '#10b981' }]}>{fmt(result.netProfit)} <Text style={styles.fUnit}>Tỷ</Text></Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 30, paddingBottom: 120, maxWidth: 1400, alignSelf: 'center', width: '100%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  
  sectionCard: { padding: 30, marginBottom: 24 },
  
  metricBigRow: { flexDirection: 'row', padding: 30, borderRadius: 32, backgroundColor: '#fbfcff', marginBottom: 30, alignItems: 'center', borderWidth: 1, borderColor: '#f1f5f9', justifyContent: 'center' },
  metricBigBox: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  metricBigLabel: { fontSize: 11, fontWeight: '900', color: '#94a3b8', letterSpacing: 1.2, marginBottom: 12 },
  metricBigValueLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  bigInputStatic: { fontSize: 84, fontWeight: '900', textAlign: 'center', width: 200, padding: 0, margin: 0,
    borderWidth: 0, backgroundColor: 'transparent' },
  unitBigStatic: { fontSize: 32, fontWeight: '900', color: '#cbd5e1', fontStyle: 'italic', marginLeft: 4, marginTop: 20 },
  vDividerBig: { width: 1, height: 100, backgroundColor: 'rgba(0,0,0,0.04)' },

  tableHeader: { flexDirection: 'row', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.04)', paddingRight: 10 },
  headerCol: { flex: 1, fontSize: 10, fontWeight: '900', color: '#94a3b8', textAlign: 'center' },
  
  rowWrapper: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.04)' },
  costLabelCol: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  miniIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  rowLabelText: { fontSize: 14, fontWeight: '800', color: '#1e293b' },
  rowStaticPct: { fontSize: 14, fontWeight: '800', color: '#64748b', textAlign: 'center' },
  rowStaticVal: { fontSize: 18, fontWeight: '900', textAlign: 'center' },

  costTable: { gap: 0, minWidth: 800 },

  totalCIVRow: { flexDirection: 'row', alignItems: 'center', marginTop: 15, padding: 20, borderRadius: 16, backgroundColor: '#fcfdfe' },
  totalLabel: { flex: 2, fontSize: 20, fontWeight: '900', color: '#1e293b' },
  totalVal: { fontSize: 20, fontWeight: '900', color: '#1e293b' },

  gpBanner: { padding: 30, borderRadius: 24, flexDirection: 'row', alignItems: 'center', marginBottom: 40 },
  gpTitle: { fontSize: 18, fontWeight: '900', color: '#fff' },
  gpValue: { fontSize: 48, fontWeight: '900', color: '#fff' },
  gpUnit: { fontSize: 12, fontWeight: '800', color: 'rgba(255,255,255,0.4)', textAlign: 'right' },
  gpBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.1)' },
  gpBadgeText: { fontSize: 10, fontWeight: '800', color: '#fff' },

  opexGridFixed: { flexDirection: 'row', gap: 12 },
  opexColFixed: { flex: 1, flexShrink: 1, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', padding: 14, backgroundColor: '#fff' },
  opexHeaderFixed: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  opexTitleFixed: { fontSize: 10, fontWeight: '900', color: '#1e293b' },
  opexItemsFixed: { gap: 0 },
  opexItemRow: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  opexItemLabel: { fontSize: 11, fontWeight: '600', color: '#64748b' },
  opexItemInput: { fontSize: 13, fontWeight: '800', textAlign: 'right', minWidth: 40, color: '#1e293b', 
    borderWidth: 0, padding: 0 },
  opexItemUnit: { fontSize: 9, fontWeight: '700', color: '#cbd5e1' },
  opexGroupTotal: { marginTop: 18, paddingTop: 15, borderTopWidth: 2, borderTopColor: '#e2e8f0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  opexGroupTotalLabel: { fontSize: 10, fontWeight: '800', color: '#94a3b8', letterSpacing: 0.5 },
  opexGroupTotalVal: { fontSize: 14, fontWeight: '900', color: '#1e293b' },

  opexSummaryRow: { flexDirection: 'row', gap: 20, marginTop: 40 },
  summaryBox: { flex: 1, padding: 25, borderRadius: 20, alignItems: 'center' },
  summaryPill: { flex: 1, paddingVertical: 25, paddingHorizontal: 30, borderRadius: 50, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 16, borderWidth: 1 },
  summaryLabel: { fontSize: 10, fontWeight: '900', color: '#64748b', textAlign: 'center' },
  summaryVal: { fontSize: 32, fontWeight: '900' },
  summaryValLarge: { fontSize: 36, fontWeight: '900' },

  plDashboard: { padding: 50, borderRadius: 32, flexDirection: 'row', marginBottom: 40 },
  plItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  plLabelText: { fontSize: 15, fontWeight: '700', color: '#94a3b8' },
  plItemVal: { fontSize: 18, fontWeight: '900', color: SUCCESS_GREEN },
  plTaxInput: { width: 50, height: 28, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 6, color: '#fff', textAlign: 'center', fontSize: 12, fontWeight: '900',
    borderWidth: 0, padding: 0 },
  plRightTitle: { fontSize: 14, fontWeight: '900', color: 'rgba(255,255,255,0.4)', letterSpacing: 2 },
  plNetVal: { fontSize: 80, fontWeight: '900', color: SUCCESS_GREEN, lineHeight: 84 },
  rosBox: { width: 140, height: 100, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  rosLabel: { fontSize: 9, fontWeight: '800', color: '#64748b', marginBottom: 10 },
  rosVal: { fontSize: 24, fontWeight: '900', color: ACCENT_BLUE },

  beBox: { padding: 40, borderRadius: 32 },
  beLabel: { fontSize: 12, fontWeight: '900', color: '#64748b', marginBottom: 20 },
  beVal: { fontSize: 56, fontWeight: '900', marginBottom: 20 },
  beSub: { fontSize: 12, fontWeight: '600', color: '#94a3b8' },
  progressContainer: { height: 14, borderRadius: 7, backgroundColor: 'rgba(0,0,0,0.05)', marginVertical: 15 },
  progressBar: { height: 14, borderRadius: 7 },

  gmvSection: { height: 300, borderRadius: 32, backgroundColor: '#fdfbff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#f3e8ff' },
  gmvLabel: { fontSize: 11, fontWeight: '900', color: ACCENT_PURPLE, letterSpacing: 1.5, marginBottom: 20 },
  gmvVal: { fontSize: 84, fontWeight: '900', color: ACCENT_PURPLE },
  gmvBadge: { marginTop: 20, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#f3e8ff' },
  gmvBadgeText: { fontSize: 12, fontWeight: '800', color: ACCENT_PURPLE },

  funnelItem: { paddingVertical: 14, paddingHorizontal: 20, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  funnelLabel: { fontSize: 13, fontWeight: '800', color: '#64748b', marginBottom: 2, textTransform: 'uppercase' },
  funnelVal: { fontSize: 36, fontWeight: '900', color: ACCENT_BLUE },
  funnelFinal: { paddingVertical: 18, paddingHorizontal: 20, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  funnelLabelLight: { fontSize: 14, fontWeight: '800', color: '#fff', marginBottom: 2, textTransform: 'uppercase' },
  funnelValLight: { fontSize: 52, fontWeight: '900', color: '#fff', textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
  funnelRight: { flex: 1.5, alignItems: 'center' },

  allocTable: { marginTop: 30, borderRadius: 20, borderWidth: 1, borderColor: '#f1f5f9', overflow: 'hidden' },
  allocHeader: { flexDirection: 'row', backgroundColor: '#f8fafc', paddingVertical: 15 },
  allocHCol: { flex: 1, textAlign: 'center', fontSize: 10, fontWeight: '900', color: '#94a3b8' },
  allocRow: { flexDirection: 'row', paddingVertical: 20, borderTopWidth: 1, borderTopColor: '#f1f5f9', alignItems: 'center' },
  allocLabel: { flex: 1, paddingLeft: 30, fontSize: 12, fontWeight: '800', color: '#1e293b' },
  allocValMkt: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '800', color: ACCENT_BLUE },
  allocValTotal: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '800', color: '#1e293b' },
  allocValSales: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '800', color: '#f97316' },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, borderTopWidth: 1, zIndex: 100, elevation: 10 },
  footerContent: { maxWidth: 1400, alignSelf: 'center', width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  footerMetric: { alignItems: 'center' },
  fLabel: { fontSize: 10, fontWeight: '900', color: '#64748b', marginBottom: 4 },
  fVal: { fontSize: 20, fontWeight: '900' },
  fUnit: { fontSize: 11, fontWeight: '700', color: '#64748b' },
  fDivider: { width: 1, height: 30, backgroundColor: 'rgba(0,0,0,0.08)' }
});
