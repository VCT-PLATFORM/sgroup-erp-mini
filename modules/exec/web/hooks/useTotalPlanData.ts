import { useState, useMemo } from 'react';

// Helpers
const safeNum = (v: any) => { const n = Number(v); return Number.isFinite(n) ? n : 0; };
const safePct = (v: any, d: number = 1) => safeNum(v).toFixed(d);
const r = (v: any, d: number = 2) => {
  const factor = Math.pow(10, d);
  return Math.round(safeNum(v) * factor) / factor;
};
const rTy = (v: any) => r(v, 2);
const rPct = (v: any) => r(v, 1);

const salesRateToRevRate = (salesRate: number, avgFee: number) => safeNum(avgFee) > 0 ? (safeNum(salesRate) * 100 / safeNum(avgFee)) : 0;
const revRateToSalesRate = (revRate: number, avgFee: number) => safeNum(revRate) * safeNum(avgFee) / 100;

export const OPEX_CONFIG = [
  { id:'hr', title:'1. Nhân Sự & Đào Tạo', icon:'Users', color:'blue',
    items:[
      {key:'salSales',label:'Lương Cơ Bản Sales',def:200},
      {key:'salBO',label:'Lương Khối Văn Phòng',def:150},
      {key:'salReward',label:'Thưởng & Phúc Lợi',def:20},
      {key:'recruitTrain',label:'Tuyển Dụng & Đào Tạo',def:10}
    ]},
  { id:'office', title:'2. Vận Hành Văn Phòng', icon:'Building', color:'indigo',
    items:[
      {key:'rent',label:'Thuê Mặt Bằng',def:50},
      {key:'utilities',label:'Điện, Nước, Internet',def:5},
      {key:'stationery',label:'Văn Phòng Phẩm & In Ấn',def:3},
      {key:'maintenance',label:'Bảo Trì, Sửa Chữa & Vệ Sinh',def:3}
    ]},
  { id:'asset', title:'3. Tài Sản & Công Nghệ', icon:'Layers', color:'purple',
    items:[
      {key:'equip',label:'Mua Sắm Thiết Bị',def:5},
      {key:'depreciation',label:'Khấu Hao Tài Sản',def:10},
      {key:'software',label:'Phần Mềm',def:5}
    ]},
  { id:'dev', title:'4. Phát Triển Thương Hiệu', icon:'Megaphone', color:'orange',
    items:[
      {key:'branding',label:'Branding Thương Hiệu',def:15},
      {key:'guest',label:'Tiếp Khách & Quà Tặng',def:20}
    ]},
  { id:'legal', title:'5. Pháp Lý & Dự Phòng', icon:'Shield', color:'slate',
    items:[
      {key:'govFees',label:'Phí & Lệ Phí Nhà Nước',def:2},
      {key:'legalSvc',label:'Dịch Vụ Cố Vấn',def:5},
      {key:'insurance',label:'Bảo Hiểm',def:0, auto:true},
      {key:'other',label:'Chi Phí Khác & Dự Phòng',def:5}
    ]}
];

export const SCENARIOS: Record<string, any> = {
  base:        { label:"Thực tế",    color:"bg-blue-600",  revenue:100, alloc:90, avgFee:5.0 },
  optimistic:  { label:"Lạc quan",   color:"bg-emerald-600",  revenue:150, alloc:95, avgFee:5.5 },
  pessimistic: { label:"Thận trọng", color:"bg-amber-600", revenue:80,  alloc:85, avgFee:4.5 }
};

export const COST_ROWS = [
  {l:"Hoa hồng Sale",         k:"comSale",      rv:"sale",    iconColor:"bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",       icon:"User"},
  {l:"Hoa hồng Quản lý",      k:"comManager",   rv:"mgr",     iconColor:"bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400", icon:"Users"},
  {l:"Marketing",             k:"costMkt",      rv:"mkt",     iconColor:"bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",   icon:"Megaphone"},
  {l:"Thưởng nóng/Thi đua",   k:"costContest",  rv:"contest", iconColor:"bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400",       icon:"Target"},
  {l:"Chiết khấu khách hàng", k:"costDiscount", rv:"disc",    iconColor:"bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400", icon:"CreditCard"},
  {l:"Chi phí khác",          k:"otherInhouse", rv:"other",   iconColor:"bg-slate-100 text-slate-600 dark:bg-slate-700/40 dark:text-slate-300",    icon:"Grid"}
];

export const FUNNEL_PARAMS = [
  {l:"Giá trị trung bình một giao dịch (Tỷ)", k:'avgPrice',           u:'Tỷ', step:0.1},
  {l:"Tỷ lệ Giao Dịch / Giữ Chỗ (%)",        k:'rateDealBooking',    u:'%',  step:1},
  {l:"Tỷ lệ Giữ Chỗ / Hẹn Gặp (%)",          k:'rateBookingMeeting', u:'%',  step:1},
  {l:"Tỷ lệ Hẹn Gặp / KHQT (%)",             k:'rateMeetingLead',    u:'%',  step:1}
];

function buildDefaultPlan() {
  const base: Record<string, any> = {
    year: new Date().getFullYear(),
    targetRevenue: 100,
    avgFee: 5.0,
    comSale: 1.5, comManager: 0.1, costMkt: 0.3,
    costContest: 0.2, costDiscount: 0.15, otherInhouse: 0.1,
    taxRate: 20,
    avgPrice: 5.0,
    rateDealBooking: 50,
    rateBookingMeeting: 30,
    rateMeetingLead: 20,
    numSales: 20,
    salesSelfGenRate: 30
  };
  OPEX_CONFIG.forEach(col => {
    col.items.forEach(item => { base[item.key] = item.def; });
  });
  return base;
}

export function useTotalPlanData() {
  const [scenario, setScenario] = useState('base');
  const [plan, setPlan] = useState(buildDefaultPlan());

  const result = useMemo(() => {
    const revInhouse = rTy(plan.targetRevenue);
    const avgFee     = r(plan.avgFee, 1);

    const calcCost = (rev: number, pct: number) => rTy(avgFee > 0 ? (rev / avgFee) * safeNum(pct) : 0);

    const civ: Record<string, number> = {
      sale:    calcCost(revInhouse, plan.comSale),
      mgr:     calcCost(revInhouse, plan.comManager),
      mkt:     calcCost(revInhouse, plan.costMkt),
      contest: calcCost(revInhouse, plan.costContest),
      disc:    calcCost(revInhouse, plan.costDiscount),
      other:   calcCost(revInhouse, plan.otherInhouse)
    };

    const totalCostInhouse = rTy(civ.sale + civ.mgr + civ.mkt + civ.contest + civ.disc + civ.other);
    const totalNetCommission = rTy(revInhouse - totalCostInhouse);
    const avgNetFeePct = r(avgFee - (safeNum(plan.comSale)+safeNum(plan.comManager)+safeNum(plan.costMkt)+safeNum(plan.costContest)+safeNum(plan.costDiscount)+safeNum(plan.otherInhouse)), 2);

    const civRevRates: Record<string, number> = {};
    COST_ROWS.forEach(row => {
      civRevRates[row.rv] = r(salesRateToRevRate(safeNum(plan[row.k]), avgFee), 2);
    });

    const totalVarCostPctRevenue = rPct(revInhouse > 0 ? (totalCostInhouse / revInhouse * 100) : 0);
    const gpPctRevenue = rPct(100 - totalVarCostPctRevenue);

    const autoValues: Record<string, number> = {};
    autoValues.insurance = r((safeNum(plan.salSales) + safeNum(plan.salBO)) * 21.5 / 100, 0);

    let totalOpexMonth = 0;
    OPEX_CONFIG.forEach(col => { col.items.forEach(i => {
      totalOpexMonth += i.auto ? safeNum(autoValues[i.key] || 0) : safeNum(plan[i.key]);
    }); });
    totalOpexMonth = r(totalOpexMonth, 0);
    const totalOpexYear = rTy((totalOpexMonth * 12) / 1000);

    const opexPctRevenue = rPct(revInhouse > 0 ? (totalOpexYear / revInhouse * 100) : 0);

    const ebt       = rTy(totalNetCommission - totalOpexYear);
    const tax       = rTy(ebt > 0 ? ebt * (safeNum(plan.taxRate) / 100) : 0);
    const netProfit = rTy(ebt - tax);
    const gpMargin  = rPct(revInhouse > 0 ? (totalNetCommission / revInhouse * 100) : 0);
    const ros       = rPct(revInhouse > 0 ? (netProfit / revInhouse * 100) : 0);

    const breakEvenRevenue = rTy(gpMargin > 0 ? (totalOpexYear / (gpMargin / 100)) : 0);
    const safetyMargin     = rTy(revInhouse - breakEvenRevenue);
    const safetyMarginPct  = rPct(revInhouse > 0 ? (safetyMargin / revInhouse * 100) : 0);

    const targetGMVInhouse = rTy(avgFee > 0 ? (revInhouse / (avgFee / 100)) : 0);
    const numDeals    = safeNum(plan.avgPrice) > 0 ? Math.ceil(targetGMVInhouse / plan.avgPrice) : 0;
    const numBookings = safeNum(plan.rateDealBooking)    > 0 ? Math.ceil(numDeals    / (plan.rateDealBooking    / 100)) : 0;
    const numMeetings = safeNum(plan.rateBookingMeeting) > 0 ? Math.ceil(numBookings / (plan.rateBookingMeeting / 100)) : 0;
    const numLeads    = safeNum(plan.rateMeetingLead)    > 0 ? Math.ceil(numMeetings / (plan.rateMeetingLead    / 100)) : 0;

    const salesRate   = safeNum(plan.salesSelfGenRate) || 30;
    const mktRate     = 100 - salesRate;
    const numLeadsMkt   = Math.round(numLeads * (mktRate   / 100));
    const numLeadsSales = numLeads - numLeadsMkt;
    const numMeetingsMkt = Math.round(numMeetings * (mktRate / 100));
    const numMeetingsSales = numMeetings - numMeetingsMkt;
    const numBookingsMkt = Math.round(numBookings * (mktRate / 100));
    const numBookingsSales = numBookings - numBookingsMkt;
    const numDealsMkt = Math.round(numDeals * (mktRate / 100));
    const numDealsSales = numDeals - numDealsMkt;

    const civPerDeal: Record<string, number> = {};
    ['sale','mgr','mkt','contest','disc','other'].forEach(k => {
      civPerDeal[k] = numDeals > 0 ? r(civ[k] * 1000 / numDeals, 0) : 0;
    });
    const totalCostPerDeal = numDeals > 0 ? r(totalCostInhouse * 1000 / numDeals, 0) : 0;

    return {
      revInhouse, costInhouseValues: civ, totalCostInhouse,
      totalNetCommission, avgNetFeePct, totalOpexMonth, totalOpexYear,
      ebt, tax, netProfit, gpMargin, ros,
      breakEvenRevenue, safetyMargin, safetyMarginPct,
      targetGMVInhouse, numDeals, numBookings, numMeetings, numLeads, numLeadsMkt, numLeadsSales,
      numMeetingsMkt, numMeetingsSales, numBookingsMkt, numBookingsSales, numDealsMkt, numDealsSales,
      civRevRates, totalVarCostPctRevenue, gpPctRevenue, opexPctRevenue, autoValues,
      civPerDeal, totalCostPerDeal
    };
  }, [plan]);

  const handleChange = (key: string, val: string | number) => {
    setPlan(prev => ({ ...prev, [key]: parseFloat(String(val)) || 0 }));
  };

  const handleRevRateChange = (key: string, revRateStr: string) => {
    const revRate = parseFloat(revRateStr) || 0;
    const avgFee  = safeNum(plan.avgFee);
    const salesRate = revRateToSalesRate(revRate, avgFee);
    const fixed = Number(salesRate.toFixed(4));
    handleChange(key, fixed);
  };

  const changeScenario = (type: string) => {
    setScenario(type);
    const s = SCENARIOS[type] || SCENARIOS.base;
    setPlan(prev => ({ ...prev, targetRevenue: s.revenue, avgFee: s.avgFee }));
  };

  return {
    scenario,
    changeScenario,
    plan,
    setPlan,
    result,
    handleChange,
    handleRevRateChange
  };
}

export const formatVN = (val: any) => safeNum(val).toLocaleString('vi-VN', { maximumFractionDigits: 0 });
export const formatMoney = (val: any) => safeNum(val).toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
