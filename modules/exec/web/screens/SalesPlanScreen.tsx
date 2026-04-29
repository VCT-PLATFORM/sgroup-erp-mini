import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Filter,
  LineChart,
  LockKeyhole,
  Minus,
  Plus,
  Save,
  Target,
  Trash2,
  TrendingUp,
  UnlockKeyhole,
  UserPlus,
  Users,
  ChevronDown,
} from 'lucide-react';
import { SGNumberInput } from '../components/shared/SGNumberInput';
import {
  CURRENT_MONTH,
  CURRENT_YEAR,
  MONTHS_OPTS,
  SCENARIO_META,
  type FunnelMetric,
  type MemberAllocation,
  type MonthlyFunnel,
  type SalesStaff,
  type SalesTeam,
  type TeamAllocation,
  formatMoney,
  formatPercent,
  formatVN,
  isActiveInMonth,
  metricTotal,
  useSalesPlanData,
} from '../hooks/useSalesPlanData';

type PlanTab = 'dashboard' | 'monthly' | 'allocation' | 'people';
type PeopleTab = 'staff' | 'team';
type AllocationTab = 'alloc' | 'kpi';

const metricOptions: Array<{
  key: FunnelMetric;
  label: string;
  tone: string;
  format: (value: unknown) => string;
}> = [
  { key: 'gmv', label: 'GMV', tone: 'text-slate-900 dark:text-white', format: formatMoney },
  { key: 'deals', label: 'Giao dịch', tone: 'text-indigo-600 dark:text-indigo-300', format: formatVN },
  { key: 'bookings', label: 'Giữ chỗ', tone: 'text-purple-600 dark:text-purple-300', format: formatVN },
  { key: 'meetings', label: 'Hẹn gặp', tone: 'text-blue-600 dark:text-blue-300', format: formatVN },
  { key: 'leadsSale', label: 'KHQT Sale', tone: 'text-orange-600 dark:text-orange-300', format: formatVN },
];

const tabs: Array<{ id: PlanTab; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = [
  { id: 'dashboard', label: 'Tổng quan', icon: BarChart3 },
  { id: 'monthly', label: 'Phân bổ tháng', icon: LineChart },
  { id: 'allocation', label: 'Phân bổ team', icon: Target },
  { id: 'people', label: 'Nhân sự', icon: Users },
];

const toNumber = (value: unknown) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const newId = (prefix: string) => `${prefix}${Date.now()}`;

export function SalesPlanScreen() {
  const {
    scenario,
    setScenario,
    ceoData,
    setCeoData,
    ccoData,
    setCcoData,
    salesCount,
    setSalesCount,
    staffList,
    setStaffList,
    teams,
    setTeams,
    allocTeamId,
    setAllocTeamId,
    selectedAllocationTeam,
    funnel,
    perSale,
    mktRate,
    saleRate,
    monthsData,
    monthlyFunnel,
    teamAllocation,
    memberAllocation,
    applyMonthPreset,
    updateMonthWeight,
    saveDraft,
    savedAt,
  } = useSalesPlanData();

  const [activeTab, setActiveTab] = useState<PlanTab>('dashboard');
  const [peopleTab, setPeopleTab] = useState<PeopleTab>('staff');
  const [allocationTab, setAllocationTab] = useState<AllocationTab>('alloc');
  const [allocMetric, setAllocMetric] = useState<FunnelMetric>('gmv');
  const [memberMetric, setMemberMetric] = useState<FunnelMetric>('gmv');
  const [histLocked, setHistLocked] = useState(true);
  const [selectedStaffId, setSelectedStaffId] = useState(staffList[0]?.id || '');
  const [savePulse, setSavePulse] = useState(false);

  const selectedStaff = staffList.find((staff) => staff.id === selectedStaffId) || staffList[0] || null;
  const activeStaffCount = staffList.filter((staff) => staff.status === 'active').length;
  const totalWeight = metricTotal(monthsData, 'weight');
  const totalMonthlyGmv = metricTotal(monthsData, 'gmv');
  const selectedTeamPlan = teamAllocation.find((team) => team.teamId === selectedAllocationTeam?.id) || null;
  const scenarioTone = SCENARIO_META[scenario].tone;

  const ceoGap = toNumber(ccoData.targetGMV) - toNumber(ceoData.targetGMV);
  const ceoGapPct = ceoData.targetGMV > 0 ? ceoGap / ceoData.targetGMV * 100 : 0;
  const mktLeads = Math.round(funnel.leads * mktRate);
  const saleLeads = funnel.leads - mktLeads;

  const teamYear = useMemo(() => {
    if (!selectedTeamPlan) return null;
    return {
      gmv: metricTotal(selectedTeamPlan.months, 'gmv'),
      deals: metricTotal(selectedTeamPlan.months, 'deals'),
      bookings: metricTotal(selectedTeamPlan.months, 'bookings'),
      meetings: metricTotal(selectedTeamPlan.months, 'meetings'),
      leadsSale: metricTotal(selectedTeamPlan.months, 'leadsSale'),
    };
  }, [selectedTeamPlan]);

  const updateCeoNumber = (key: keyof typeof ceoData, value: string | number) => {
    setCeoData((prev) => ({ ...prev, [key]: toNumber(value) }));
  };

  const updateCcoNumber = (key: keyof typeof ccoData, value: string | number) => {
    setCcoData((prev) => ({ ...prev, [key]: toNumber(value) }));
  };

  const updateCcoRate = (key: keyof typeof ccoData.rates, value: string | number) => {
    setCcoData((prev) => ({ ...prev, rates: { ...prev.rates, [key]: toNumber(value) } }));
  };

  const updateTeam = (teamId: string, patch: Partial<SalesTeam>) => {
    const currentTeam = teams.find((team) => team.id === teamId);
    if (currentTeam && patch.name && patch.name !== currentTeam.name) {
      setStaffList((staffPrev) => staffPrev.map((staff) => (
        staff.team === currentTeam.name ? { ...staff, team: patch.name || '' } : staff
      )));
    }
    setTeams((prev) => prev.map((team) => (team.id === teamId ? { ...team, ...patch } : team)));
  };

  const updateStaff = (staffId: string, patch: Partial<SalesStaff>) => {
    setStaffList((prev) => prev.map((staff) => (staff.id === staffId ? { ...staff, ...patch } : staff)));
  };

  const addTeam = () => {
    const id = newId('team-');
    const team: SalesTeam = {
      id,
      name: 'Team mới',
      leaderId: '',
      leaderName: '',
      status: 'active',
      activeFrom: CURRENT_MONTH,
      activeTo: 12,
    };
    setTeams((prev) => [...prev, team]);
    setAllocTeamId(id);
    setPeopleTab('team');
  };

  const removeTeam = (teamId: string) => {
    const team = teams.find((item) => item.id === teamId);
    if (!team || !window.confirm(`Xóa ${team.name}? Nhân sự trong team sẽ chuyển về trạng thái chưa gán.`)) return;
    setTeams((prev) => prev.filter((item) => item.id !== teamId));
    setStaffList((prev) => prev.map((staff) => (staff.team === team.name ? { ...staff, team: '' } : staff)));
  };

  const addStaff = () => {
    const firstTeam = teams[0]?.name || '';
    const staff: SalesStaff = {
      id: newId('NV'),
      hoTen: 'Nhân sự mới',
      role: 'Sales',
      team: firstTeam,
      status: 'active',
      activeFrom: CURRENT_MONTH,
      activeTo: 12,
      leadsCapacity: 50,
      rates: { deal: 50, booking: 30, meeting: 20 },
    };
    setStaffList((prev) => [staff, ...prev]);
    setSelectedStaffId(staff.id);
    setPeopleTab('staff');
  };

  const removeStaff = (staffId: string) => {
    const staff = staffList.find((item) => item.id === staffId);
    if (!staff || !window.confirm(`Xóa nhân sự ${staff.hoTen}?`)) return;
    setStaffList((prev) => prev.filter((item) => item.id !== staffId));
    setSelectedStaffId(staffList.find((item) => item.id !== staffId)?.id || '');
  };

  const handleSave = () => {
    saveDraft();
    setSavePulse(true);
    window.setTimeout(() => setSavePulse(false), 1200);
  };

    const renderDashboard = () => (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* ════════ CEO HERO ════════ */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-6 bg-slate-900 rounded-full" />
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Kế hoạch chiến lược CEO</h2>
          </div>
          <div className="flex items-center gap-2">
            {(['base', 'optimistic', 'pessimistic'] as const).map((s) => (
              <button key={s} onClick={() => setScenario(s)}
                className={`px-4 py-1.5 text-[11px] font-black uppercase rounded-lg border transition-all ${scenario === s ? SCENARIO_META[s].activeCls : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>
                {SCENARIO_META[s].label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dark hero card */}
          <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-2xl">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-blue-400 mb-4">
                <CircleDollarSign size={20} />
                <span className="text-xs font-black uppercase tracking-[0.2em]">Target Revenue {CURRENT_YEAR}</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-7xl md:text-8xl font-black tracking-tighter">{formatVN(ceoData.targetGMV)}</span>
                <span className="text-3xl font-bold text-slate-400 uppercase">Tỷ VNĐ</span>
              </div>
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/10 pt-6">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Số giao dịch mục tiêu</div>
                  <div className="text-xl font-black">{formatVN(Math.ceil(ceoData.targetGMV / Math.max(1, ceoData.avgDealValue)))}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Giá trung bình/giao dịch</div>
                  <div className="text-xl font-black text-white">{ceoData.avgDealValue} <span className="text-xs">Tỷ</span></div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Nguồn khách Marketing</div>
                  <div className="text-xl font-black text-blue-400">{Math.round(mktRate * 100)}%</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Sale tự kiếm</div>
                  <div className="text-xl font-black text-orange-400">{Math.round(saleRate * 100)}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Rate cards */}
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase">Giao dịch / Giữ chỗ</div>
                <div className="text-2xl font-black text-slate-800">{ceoData.rates.deal}%</div>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <CheckCircle2 size={24} />
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase">Booking / Hẹn gặp</div>
                <div className="text-2xl font-black text-slate-800">{ceoData.rates.booking}%</div>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                <CalendarDays size={24} />
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase">Hẹn gặp / KHQT</div>
                <div className="text-2xl font-black text-slate-800">{ceoData.rates.meeting}%</div>
              </div>
              <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                <Users size={24} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ CCO SECTION ════════ */}
      <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1.5 h-8 bg-purple-600 rounded-full" />
          <div>
            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Kế hoạch Phễu Bán Hàng (Sale)</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Xây dựng kịch bản chuyển đổi</p>
          </div>
        </div>

        {/* GMV Input */}
        <div className="bg-slate-900 rounded-[2rem] p-10 text-center relative overflow-hidden group mb-10">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 opacity-50" />
          <div className="relative z-10">
            <div className="text-sm font-bold text-indigo-300 uppercase tracking-[0.2em] mb-4">DOANH SỐ MỤC TIÊU (GMV)</div>
            <div className="flex items-center justify-center gap-4">
              <SGNumberInput
                value={ccoData.targetGMV}
                step={50}
                min={0}
                onChange={(value) => updateCcoNumber('targetGMV', value)}
                className="text-7xl font-black text-white bg-transparent border-b-2 border-white/20 focus:border-indigo-500 outline-none w-80 text-center transition-all"
              />
              <span className="text-3xl font-bold text-indigo-400 self-end mb-2">TỶ</span>
            </div>
            <div className="mt-6 flex justify-center">
              {ceoGap < 0 ? (
                <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 px-4 py-2 rounded-xl border border-red-500/30 animate-pulse">
                  <AlertTriangle size={16} />
                  <span className="text-xs font-bold uppercase tracking-wide">Thấp hơn kỳ vọng CEO {Math.abs(ceoGapPct).toFixed(1)}% (-{formatVN(Math.abs(ceoGap))} Tỷ)</span>
                </div>
              ) : ceoGap > 0 ? (
                <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-4 py-2 rounded-xl border border-indigo-500/30">
                  <TrendingUp size={16} />
                  <span className="text-xs font-bold uppercase tracking-wide">Xuất sắc! Vượt {ceoGapPct.toFixed(1)}% (+{formatVN(ceoGap)} Tỷ)</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-xl border border-emerald-500/30">
                  <CheckCircle2 size={16} />
                  <span className="text-xs font-bold uppercase tracking-wide">Đạt chuẩn kỳ vọng CEO (100%)</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Params + Funnel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-200">
              <div className="flex items-center gap-2 mb-6 text-indigo-600">
                <Filter size={20} />
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-700">Tham số hiệu suất</h3>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block ml-1">Giá trị trung bình / Giao dịch</label>
                  <div className="relative">
                    <SGNumberInput value={ccoData.avgDealValue} step={0.1} min={0}
                      onChange={(value) => updateCcoNumber('avgDealValue', value)}
                      className="w-full p-4 pr-12 rounded-xl bg-white border-2 border-slate-100 font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all text-right" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">TỶ</span>
                  </div>
                </div>
                {([
                  { label: 'Tỷ lệ Giao Dịch / Giữ Chỗ', key: 'deal' as const },
                  { label: 'Tỷ lệ Giữ Chỗ / Hẹn Gặp', key: 'booking' as const },
                  { label: 'Tỷ lệ Hẹn Gặp / KHQT', key: 'meeting' as const },
                ] as const).map((item) => (
                  <div key={item.key}>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block ml-1">{item.label}</label>
                    <div className="relative group">
                      <SGNumberInput value={ccoData.rates[item.key]} step={1} min={0} max={100}
                        onChange={(value) => updateCcoRate(item.key, value)}
                        className="w-full p-4 pr-12 rounded-xl bg-white border-2 border-slate-100 font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all text-right group-hover:border-indigo-200" />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col justify-between gap-4">
            {/* Funnel Pyramid */}
            <FunnelStep num="1" label="Khách hàng quan tâm" sub="Sale tự kiếm và Marketing" value={formatVN(funnel.leads)} unit="Khách hàng"
              bg="bg-slate-100" numBg="bg-slate-200" numTone="text-slate-500"
              labelTone="text-slate-600" subTone="text-slate-400"
              valTone="text-slate-700" unitTone="text-slate-400"
              border="" barBg="bg-slate-300" barWidth="w-full" mx="" />
            <DownArrow />
            <FunnelStep num="2" label="Hẹn Gặp" sub="Tư vấn trực tiếp" value={formatVN(funnel.meetings)} unit="Cuộc hẹn"
              bg="bg-blue-50" numBg="bg-blue-100" numTone="text-blue-600"
              labelTone="text-blue-600" subTone="text-blue-400"
              valTone="text-blue-700" unitTone="text-blue-400"
              border="border border-blue-100" barBg="bg-blue-200" barWidth="w-[80%] rounded-r-full" mx="mx-4" />
            <DownArrow />
            <FunnelStep num="3" label="Booking" sub="Giữ chỗ" value={formatVN(funnel.bookings)} unit="Lượt Book"
              bg="bg-indigo-50" numBg="bg-indigo-100" numTone="text-indigo-600"
              labelTone="text-indigo-600" subTone="text-indigo-400"
              valTone="text-indigo-700" unitTone="text-indigo-400"
              border="border border-indigo-100" barBg="bg-indigo-200" barWidth="w-[60%] rounded-r-full" mx="mx-8" />
            <DownArrow />
            <FunnelStep num="4" label="Giao Dịch" sub="Ký HĐMB thành công" value={formatVN(funnel.deals)} unit="Giao dịch"
              bg="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg shadow-indigo-200 text-white"
              numBg="bg-white/20" numTone="text-white"
              labelTone="text-white" subTone="text-purple-200"
              valTone="text-white" unitTone="text-purple-200"
              border="" barBg="" barWidth="" mx="mx-12" />
          </div>
        </div>

        {/* Lead Source */}
        <div className="mt-8 pt-8 border-t-2 border-slate-200">
          <div className="flex items-center gap-2 mb-6">
            <Users size={20} className="text-orange-600" />
            <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider">Phân Bổ KPI & Định Biên Nhân Sự Sales</h3>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Cơ cấu nguồn khách hàng</div>
                <div className="text-[10px] font-semibold text-slate-400 mt-0.5">Dựa trên tổng {formatVN(funnel.leads)} khách hàng mục tiêu</div>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /><span className="text-[10px] font-bold text-slate-600 uppercase">Marketing ({Math.round(mktRate * 100)}%)</span></div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500" /><span className="text-[10px] font-bold text-slate-600 uppercase">Sale Tự Kiếm ({Math.round(saleRate * 100)}%)</span></div>
              </div>
            </div>
            <div className="h-6 w-full bg-slate-100 rounded-lg overflow-hidden flex mb-4">
              <div style={{ width: `${mktRate * 100}%` }} className="bg-blue-500 h-full flex items-center justify-center text-[10px] font-bold text-white/90 transition-all duration-500">{mktRate > 0.1 ? 'MKT' : ''}</div>
              <div style={{ width: `${saleRate * 100}%` }} className="bg-orange-500 h-full flex items-center justify-center text-[10px] font-bold text-white/90 transition-all duration-500">{saleRate > 0.1 ? 'SALE' : ''}</div>
            </div>
            <div className="grid grid-cols-2 gap-8 pt-2">
              <div className="pl-2 border-l-4 border-blue-500">
                <div className="text-3xl font-black text-blue-600 tracking-tighter">{formatVN(mktLeads)}</div>
                <div className="text-[10px] font-bold text-blue-400 uppercase mt-1">Khách từ Marketing</div>
              </div>
              <div className="pl-2 border-l-4 border-orange-500">
                <div className="text-3xl font-black text-orange-600 tracking-tighter">{formatVN(saleLeads)}</div>
                <div className="text-[10px] font-bold text-orange-400 uppercase mt-1">Khách Sale Tự Kiếm</div>
              </div>
            </div>
          </div>

          {/* HR KPI Cards */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-orange-50 rounded-xl p-6 border-2 border-orange-200">
                <div className="text-xs font-bold text-orange-600 uppercase mb-3">Tổng Nhân Sự Sales (Người)</div>
                <div className="hr-counter flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm">
                  <button onClick={() => setSalesCount(Math.max(1, salesCount - 1))} className="w-9 h-9 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 flex items-center justify-center font-bold transition-all hover:scale-110">
                    <ChevronDown size={18} />
                  </button>
                  <SGNumberInput value={salesCount} min={1}
                    onChange={(value) => setSalesCount(Math.max(1, Math.round(toNumber(value))))}
                    className="text-3xl font-black text-orange-600 flex-1 text-center bg-transparent border-none outline-none w-full" />
                  <button onClick={() => setSalesCount(salesCount + 1)} className="w-9 h-9 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 flex items-center justify-center font-bold transition-all hover:scale-110">
                    <Plus size={18} />
                  </button>
                </div>
                <div className="text-xs text-orange-600 font-semibold text-center mt-2">Đang có: {staffList.length} NS</div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="text-xs font-bold text-slate-500 uppercase mb-3">Doanh Số (GMV) / Sale</div>
                <div className="text-3xl font-black text-slate-800 mb-1">{formatMoney(perSale.revenue)}</div>
                <div className="text-sm font-semibold text-slate-500">Tỷ/tháng</div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="text-xs font-bold text-slate-500 uppercase mb-3">Số Giao Dịch / Sale</div>
                <div className="text-3xl font-black text-indigo-600 mb-1">{formatMoney(perSale.deals)}</div>
                <div className="text-sm font-semibold text-slate-500">Giao dịch/tháng</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="text-xs font-bold text-slate-500 uppercase mb-3">KPI Hẹn Gặp / Sale</div>
                <div className="text-3xl font-black text-blue-600 mb-1">{formatMoney(perSale.meetings)}</div>
                <div className="text-sm font-semibold text-slate-500">Cuộc hẹn/tháng</div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="text-xs font-bold text-slate-500 uppercase mb-3">KPI Giữ Chỗ / Sale</div>
                <div className="text-3xl font-black text-purple-600 mb-1">{formatMoney(perSale.bookings)}</div>
                <div className="text-sm font-semibold text-slate-500">Booking/tháng</div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="text-xs font-bold text-slate-500 uppercase mb-3">KPI KHQT / Sale</div>
                <div className="text-3xl font-black text-orange-600 mb-1">{formatVN(perSale.leads)}</div>
                <div className="text-sm font-semibold text-slate-500">Khách/tháng</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );


    const renderMonthly = () => {
    const maxWeight = Math.max(20, Math.max(...monthsData.map((month) => month.weight)) + 4);
    const chartWidth = 1000;
    const chartHeight = 280;
    const stepX = chartWidth / 11;
    const points = monthsData.map((month, index) => ({
      x: index * stepX,
      y: chartHeight - (month.weight / maxWeight) * chartHeight,
      locked: histLocked && month.month < CURRENT_MONTH,
    }));
    const path = points.reduce((acc, point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;
      const prev = points[index - 1];
      const cpX = prev.x + (point.x - prev.x) / 2;
      return `${acc} C ${cpX} ${prev.y}, ${cpX} ${point.y}, ${point.x} ${point.y}`;
    }, '');

    return (
      <div className="space-y-5">
        <section className="bg-white/70 dark:bg-black/30 backdrop-blur-3xl rounded-[32px] shadow-sg-md border border-slate-200/80 dark:border-[var(--color-sg-border)] p-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <SectionTitle icon={TrendingUp} title="Nhịp độ kinh doanh theo tháng" subtitle="Kéo chỉnh bằng bảng trọng số; các tháng đã qua có thể khóa để tránh sửa nhầm" />
            <div className="flex flex-wrap items-center gap-2">
              {[
                ['equal', 'Phân bổ đều'],
                ['year_end', 'Dồn cuối năm'],
                ['spring_peak', 'Cao điểm đầu năm'],
              ].map(([key, label]) => (
                <button key={key} onClick={() => applyMonthPreset(key as 'equal')} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-black uppercase tracking-wide text-sg-heading hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900">
                  {label}
                </button>
              ))}
              <button onClick={() => setHistLocked((value) => !value)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black uppercase tracking-wide text-sg-heading hover:border-amber-300 dark:border-slate-800 dark:bg-slate-900">
                {histLocked ? <LockKeyhole size={14} /> : <UnlockKeyhole size={14} />}
                {histLocked ? 'Khóa tháng cũ' : 'Mở khóa'}
              </button>
            </div>
          </div>

          <div className="mt-6 bg-slate-50/50 dark:bg-white/5 backdrop-blur-sm rounded-[20px] border border-slate-200/80 dark:border-[var(--color-sg-border)] p-6">
            <svg width="100%" height="320" viewBox="-35 -12 1070 330" preserveAspectRatio="none" role="img" aria-label="Biểu đồ trọng số kế hoạch theo tháng">
              {[0, 0.25, 0.5, 0.75, 1].map((level) => (
                <g key={level}>
                  <line x1={0} y1={chartHeight * level} x2={chartWidth} y2={chartHeight * level} stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth={1} />
                  <text x={-30} y={chartHeight * level + 4} className="fill-slate-400 text-[11px] font-bold">{Math.round(maxWeight * (1 - level))}%</text>
                </g>
              ))}
              <path d={`${path} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`} fill="rgb(79 70 229 / 0.12)" />
              <path d={path} fill="none" stroke="#4f46e5" strokeWidth={4} strokeLinecap="round" />
              {points.map((point, index) => (
                <g key={index}>
                  <circle cx={point.x} cy={point.y} r={point.locked ? 4 : 7} fill={point.locked ? '#cbd5e1' : '#4f46e5'} />
                  <text x={point.x - 12} y={310} className="fill-slate-500 text-[11px] font-black">T{index + 1}</text>
                </g>
              ))}
            </svg>
          </div>
        </section>

        <section className="overflow-hidden bg-white/70 dark:bg-black/30 backdrop-blur-3xl rounded-[32px] shadow-sg-md border border-slate-200/80 dark:border-[var(--color-sg-border)]">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/60">
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-sg-heading">Bảng phân bổ GMV và phễu</h3>
              <p className="mt-1 text-xs font-semibold text-sg-muted">KHQT trong bảng là phần Sales tự kiếm sau khi tách nguồn Marketing</p>
            </div>
            <span className={`rounded-lg px-3 py-1 text-xs font-black ${Math.abs(totalWeight - 100) < 0.2 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'}`}>
              Tổng {formatPercent(totalWeight)}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-black uppercase tracking-widest text-sg-muted dark:border-slate-800">
                  <th className="px-5 py-3">Tháng</th>
                  <th className="px-5 py-3 text-right">Trọng số</th>
                  <th className="px-5 py-3 text-right text-indigo-600 dark:text-indigo-300">GMV</th>
                  <th className="px-5 py-3 text-right">GD</th>
                  <th className="px-5 py-3 text-right">Booking</th>
                  <th className="px-5 py-3 text-right">Hẹn gặp</th>
                  <th className="px-5 py-3 text-right text-orange-600 dark:text-orange-300">KHQT Sales</th>
                </tr>
              </thead>
              <tbody>
                {monthlyFunnel.map((month, index) => {
                  const locked = histLocked && month.month < CURRENT_MONTH;
                  return (
                    <tr key={month.month} className="border-b border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/50">
                      <td className="px-5 py-3 text-sm font-black text-sg-heading">
                        <span className="inline-flex items-center gap-2">
                          {locked ? <LockKeyhole size={14} className="text-slate-400" /> : <CalendarDays size={14} className="text-indigo-500" />}
                          Tháng {month.month}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <SGNumberInput
                          value={monthsData[index].weight}
                          step={0.1}
                          min={0}
                          onChange={(value) => updateMonthWeight(index, toNumber(value))}
                          inputProps={{ disabled: locked }}
                          className="w-20 bg-transparent text-right text-sm font-black text-indigo-600 outline-none disabled:text-slate-400 dark:text-indigo-300"
                        />
                      </td>
                      <td className="px-5 py-3 text-right text-sm font-black text-indigo-600 dark:text-indigo-300">{formatMoney(month.gmv)} Tỷ</td>
                      <td className="px-5 py-3 text-right text-sm font-bold text-sg-heading">{formatVN(month.deals)}</td>
                      <td className="px-5 py-3 text-right text-sm font-bold text-sg-heading">{formatVN(month.bookings)}</td>
                      <td className="px-5 py-3 text-right text-sm font-bold text-sg-heading">{formatVN(month.meetings)}</td>
                      <td className="px-5 py-3 text-right text-sm font-black text-orange-600 dark:text-orange-300">{formatVN(month.leadsSale)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-slate-100 dark:bg-slate-900 text-sg-heading">
                <tr className="text-sm font-black">
                  <td className="px-5 py-4 uppercase tracking-widest">Tổng năm</td>
                  <td className="px-5 py-4 text-right">{formatPercent(totalWeight)}</td>
                  <td className="px-5 py-4 text-right text-indigo-200">{formatMoney(totalMonthlyGmv)} Tỷ</td>
                  <td className="px-5 py-4 text-right">{formatVN(metricTotal(monthlyFunnel, 'deals'))}</td>
                  <td className="px-5 py-4 text-right">{formatVN(metricTotal(monthlyFunnel, 'bookings'))}</td>
                  <td className="px-5 py-4 text-right">{formatVN(metricTotal(monthlyFunnel, 'meetings'))}</td>
                  <td className="px-5 py-4 text-right text-orange-200">{formatVN(metricTotal(monthlyFunnel, 'leadsSale'))}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
      </div>
    );
  };

  const renderAllocation = () => {
    const currentMetric = metricOptions.find((metric) => metric.key === allocMetric) || metricOptions[0];
    const memberMetricOption = metricOptions.find((metric) => metric.key === memberMetric) || metricOptions[0];

    return (
      <div className="space-y-5">
        <div className="flex flex-col gap-4 bg-white/70 dark:bg-black/30 backdrop-blur-3xl rounded-[32px] shadow-sg-md border border-slate-200/80 dark:border-[var(--color-sg-border)] p-8 md:flex-row md:items-center md:justify-between">
          <SectionTitle icon={Target} title="Phân bổ team" subtitle="Chia chỉ tiêu theo team hoạt động trong từng tháng, sau đó chia xuống nhân sự active" />
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900">
            <button onClick={() => setAllocationTab('alloc')} className={`rounded-md px-4 py-2 text-xs font-black uppercase tracking-wide ${allocationTab === 'alloc' ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-300' : 'text-sg-muted'}`}>Phân bổ</button>
            <button onClick={() => setAllocationTab('kpi')} className={`rounded-md px-4 py-2 text-xs font-black uppercase tracking-wide ${allocationTab === 'kpi' ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-300' : 'text-sg-muted'}`}>KPI team</button>
          </div>
        </div>

        {allocationTab === 'alloc' ? (
          <div className="space-y-5">
            <AllocationTable
              title="Chỉ tiêu cho team"
              subtitle="Tổng nguồn từ tab phân bổ tháng"
              metric={allocMetric}
              setMetric={setAllocMetric}
              metricOption={currentMetric}
              rows={teamAllocation}
              selectedTeamId={allocTeamId}
              onSelectTeam={setAllocTeamId}
              footerSource={monthlyFunnel}
            />

            <MemberAllocationTable
              metric={memberMetric}
              setMetric={setMemberMetric}
              metricOption={memberMetricOption}
              teams={teams}
              selectedTeamId={allocTeamId}
              setSelectedTeamId={setAllocTeamId}
              rows={memberAllocation}
              teamPlan={selectedTeamPlan}
            />
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              {teams.map((team) => (
                <button key={team.id} onClick={() => setAllocTeamId(team.id)} className={`rounded-lg border px-4 py-2 text-xs font-black uppercase tracking-wide ${allocTeamId === team.id ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 bg-white text-sg-heading hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-950'}`}>
                  {team.name}
                  {team.status !== 'active' ? <span className="ml-1 opacity-60">(ngưng)</span> : null}
                </button>
              ))}
            </div>

            {!selectedAllocationTeam || !teamYear ? (
              <EmptyPanel label="Chưa có team để phân bổ" />
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                  <MetricTile label="GMV năm" value={formatMoney(teamYear.gmv)} unit="Tỷ" />
                  <MetricTile label="Giao dịch" value={formatVN(teamYear.deals)} unit="GD" tone="text-indigo-600 dark:text-indigo-300" />
                  <MetricTile label="Giữ chỗ" value={formatVN(teamYear.bookings)} unit="booking" tone="text-purple-600 dark:text-purple-300" />
                  <MetricTile label="Hẹn gặp" value={formatVN(teamYear.meetings)} unit="cuộc" tone="text-blue-600 dark:text-blue-300" />
                  <MetricTile label="KHQT Sales" value={formatVN(teamYear.leadsSale)} unit="khách" tone="text-orange-600 dark:text-orange-300" />
                </div>

                <TeamKpiTable team={selectedAllocationTeam} teamPlan={selectedTeamPlan} teamYear={teamYear} />
                <MemberKpiBreakdown rows={memberAllocation} />
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderPeople = () => (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 bg-white/70 dark:bg-black/30 backdrop-blur-3xl rounded-[32px] shadow-sg-md border border-slate-200/80 dark:border-[var(--color-sg-border)] p-8 md:flex-row md:items-center md:justify-between">
        <SectionTitle icon={Users} title="Cấu hình nhân sự kinh doanh" subtitle="Quản lý team, thời gian hoạt động và trạng thái nhân sự dùng để tính KPI" />
        <div className="flex items-center gap-2">
          <button onClick={addStaff} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-xs font-black uppercase tracking-wide text-white hover:bg-indigo-700 shadow-md">
            <UserPlus size={15} />
            Thêm nhân sự
          </button>
          <button onClick={addTeam} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-wide text-sg-heading hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900">
            <Plus size={15} />
            Thêm team
          </button>
        </div>
      </div>

      <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900">
        <button onClick={() => setPeopleTab('staff')} className={`rounded-md px-4 py-2 text-xs font-black uppercase tracking-wide ${peopleTab === 'staff' ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-300' : 'text-sg-muted'}`}>Nhân sự</button>
        <button onClick={() => setPeopleTab('team')} className={`rounded-md px-4 py-2 text-xs font-black uppercase tracking-wide ${peopleTab === 'team' ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-300' : 'text-sg-muted'}`}>Team</button>
      </div>

      {peopleTab === 'staff' ? (
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <div className="xl:col-span-5 overflow-hidden bg-white/70 dark:bg-black/30 backdrop-blur-3xl rounded-[32px] shadow-sg-md border border-slate-200/80 dark:border-[var(--color-sg-border)]">
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/60">
              <h3 className="text-sm font-black uppercase tracking-widest text-sg-heading">Đội ngũ sales</h3>
              <p className="mt-1 text-xs font-semibold text-sg-muted">{staffList.length} nhân sự, {activeStaffCount} active</p>
            </div>
            <div className="max-h-[620px] space-y-2 overflow-y-auto p-4">
              {staffList.map((staff) => (
                <button key={staff.id} onClick={() => setSelectedStaffId(staff.id)} className={`flex w-full items-center justify-between rounded-lg border p-4 text-left transition ${selectedStaff?.id === staff.id ? 'border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-950/30' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-900/60'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-lg text-base font-black ${selectedStaff?.id === staff.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
                      {(staff.hoTen || 'N').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-black text-sg-heading">{staff.hoTen}</div>
                      <div className="mt-1 text-[11px] font-bold uppercase tracking-wide text-sg-muted">{staff.role} · {staff.team || 'Chưa gán'}</div>
                    </div>
                  </div>
                  <StatusBadge status={staff.status} />
                </button>
              ))}
            </div>
          </div>

          <div className="xl:col-span-7">
            {!selectedStaff ? (
              <EmptyPanel label="Chọn nhân sự để chỉnh cấu hình" />
            ) : (
              <div className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
                <div className="flex items-center justify-between rounded-t-lg bg-slate-950 px-6 py-5 text-white">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-indigo-600 text-2xl font-black">
                      {(selectedStaff.hoTen || 'N').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <input value={selectedStaff.hoTen} onChange={(event) => updateStaff(selectedStaff.id, { hoTen: event.target.value })} className="w-full bg-transparent text-2xl font-black outline-none" />
                      <div className="mt-1 text-xs font-black uppercase tracking-widest text-indigo-200">ID: {selectedStaff.id}</div>
                    </div>
                  </div>
                  <button onClick={() => removeStaff(selectedStaff.id)} className="rounded-lg p-2 text-white/60 hover:bg-rose-500 hover:text-white" title="Xóa nhân sự">
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="space-y-5 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField label="Chức vụ" value={selectedStaff.role} onChange={(value) => updateStaff(selectedStaff.id, { role: value })} />
                    <SelectField label="Team" value={selectedStaff.team} onChange={(value) => updateStaff(selectedStaff.id, { team: value })} options={[['', 'Chưa gán'], ...teams.map((team) => [team.name, team.name] as [string, string])]} />
                    <SelectField label="Trạng thái" value={selectedStaff.status} onChange={(value) => updateStaff(selectedStaff.id, { status: value as SalesStaff['status'] })} options={[['active', 'Active'], ['planned', 'Planned'], ['off', 'Off']]} />
                    <NumberField label="Năng lực lead/tháng" value={selectedStaff.leadsCapacity} unit="lead" onChange={(value) => updateStaff(selectedStaff.id, { leadsCapacity: toNumber(value) })} />
                  </div>

                  <div className="bg-slate-50/50 dark:bg-white/5 backdrop-blur-sm rounded-[20px] border border-slate-200/80 dark:border-[var(--color-sg-border)] p-6">
                    <div className="mb-3 text-[11px] font-black uppercase tracking-widest text-sg-muted">Thời gian hoạt động</div>
                    <div className="flex flex-wrap items-center gap-3">
                      <MonthSelect value={selectedStaff.activeFrom} onChange={(value) => updateStaff(selectedStaff.id, { activeFrom: value })} />
                      <span className="text-xs font-bold text-sg-muted">đến</span>
                      <MonthSelect value={selectedStaff.activeTo} onChange={(value) => updateStaff(selectedStaff.id, { activeTo: value })} />
                    </div>
                    <MonthTimeline from={selectedStaff.activeFrom} to={selectedStaff.activeTo} isOff={selectedStaff.status !== 'active'} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {teams.map((team, index) => {
            const activeMembers = staffList.filter((staff) => staff.team === team.name && staff.status === 'active');
            return (
              <div key={team.id} className={`bg-white/70 dark:bg-black/30 backdrop-blur-3xl rounded-[32px] shadow-sg-md border border-slate-200/80 dark:border-[var(--color-sg-border)] p-8 ${team.status !== 'active' ? 'opacity-70' : ''}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-lg text-xl font-black text-white ${index % 2 ? 'bg-emerald-600' : 'bg-indigo-600'}`}>
                      {(team.name || 'T').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <input value={team.name} onChange={(event) => updateTeam(team.id, { name: event.target.value })} className="w-full bg-transparent text-xl font-black text-sg-heading outline-none" />
                      <button onClick={() => updateTeam(team.id, { status: team.status === 'active' ? 'inactive' : 'active' })} className={`mt-2 inline-flex items-center gap-2 rounded-lg border px-3 py-1 text-[10px] font-black uppercase tracking-wide ${team.status === 'active' ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' : 'border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-800 dark:bg-slate-900'}`}>
                        {team.status === 'active' ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                        {team.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                      </button>
                    </div>
                  </div>
                  <button onClick={() => removeTeam(team.id)} className="rounded-lg p-2 text-sg-muted hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40" title="Xóa team">
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50/50 dark:bg-white/5 backdrop-blur-sm rounded-[20px] border border-slate-200/80 dark:border-[var(--color-sg-border)] p-6">
                    <div className="text-[10px] font-black uppercase tracking-widest text-sg-muted">Trưởng phòng</div>
                    <select value={team.leaderId} onChange={(event) => {
                      const leader = staffList.find((staff) => staff.id === event.target.value);
                      updateTeam(team.id, { leaderId: event.target.value, leaderName: leader?.hoTen || '' });
                    }} className="mt-2 w-full bg-transparent text-sm font-black text-sg-heading outline-none">
                      <option value="">Chưa chọn</option>
                      {staffList.map((staff) => <option key={staff.id} value={staff.id}>{staff.hoTen}</option>)}
                    </select>
                  </div>
                  <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-900 dark:bg-indigo-950/30">
                    <div className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-300">Nhân sự active</div>
                    <div className="mt-2 text-3xl font-black text-indigo-600 dark:text-indigo-300">{activeMembers.length}</div>
                  </div>
                </div>

                <div className="mt-5 bg-slate-50/50 dark:bg-white/5 backdrop-blur-sm rounded-[20px] border border-slate-200/80 dark:border-[var(--color-sg-border)] p-6">
                  <div className="mb-3 text-[10px] font-black uppercase tracking-widest text-sg-muted">Thời gian hoạt động</div>
                  <div className="flex flex-wrap items-center gap-3">
                    <MonthSelect value={team.activeFrom} onChange={(value) => updateTeam(team.id, { activeFrom: value })} />
                    <span className="text-xs font-bold text-sg-muted">đến</span>
                    <MonthSelect value={team.activeTo} onChange={(value) => updateTeam(team.id, { activeTo: value })} />
                  </div>
                  <MonthTimeline from={team.activeFrom} to={team.activeTo} isOff={team.status !== 'active'} color={index % 2 ? 'bg-emerald-500' : 'bg-indigo-500'} />
                </div>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );

  return (
    <div className="relative min-h-[calc(100vh-84px)]">
      <div className="pb-[100px] px-4 md:px-8 pt-6">
        <div className="max-w-[1600px] mx-auto w-full space-y-10">
        <div className="bg-white/70 dark:bg-black/30 backdrop-blur-3xl rounded-[32px] shadow-sg-md border border-slate-200/80 dark:border-[var(--color-sg-border)] p-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-widest text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300">
                <Target size={14} />
                Sales Planning Control
              </div>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-sg-heading">Kế hoạch kinh doanh</h2>
              <p className="mt-1 text-sm font-semibold text-sg-muted">Chỉ tiêu CEO, phễu CCO, phân bổ tháng, team và nhân sự trong một màn hình điều hành.</p>
            </div>

            <div className="flex items-center gap-4 bg-white dark:bg-black/30 backdrop-blur-3xl p-2 rounded-2xl shadow-sg-md border border-slate-200/80 dark:border-[var(--color-sg-border)]">
              <div className="flex bg-sg-card rounded-xl p-1">
                {(Object.keys(SCENARIO_META) as Array<keyof typeof SCENARIO_META>).map((key) => (
                  <button
                    key={key}
                    onClick={() => setScenario(key)}
                    className={`rounded-md px-4 py-2 text-xs font-black uppercase tracking-wide transition ${scenario === key ? scenarioTone : 'text-sg-muted hover:bg-white hover:text-sg-heading dark:hover:bg-slate-800'}`}
                  >
                    {SCENARIO_META[key].label}
                  </button>
                ))}
              </div>
              <button onClick={handleSave} className={`inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-black tracking-wide text-white shadow-sm transition hover:bg-indigo-600 ${savePulse ? 'ring-4 ring-emerald-300/50' : ''}`}>
                <Save size={17} />
                Lưu nháp
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
            <MetricTile label="GMV CEO" value={formatMoney(ceoData.targetGMV)} unit="Tỷ" icon={CircleDollarSign} />
            <MetricTile label="GMV CCO" value={formatMoney(ccoData.targetGMV)} unit="Tỷ" tone="text-indigo-600 dark:text-indigo-300" icon={Target} />
            <MetricTile label="Giao dịch cần đạt" value={formatVN(funnel.deals)} unit="GD" tone="text-emerald-600 dark:text-emerald-300" icon={CheckCircle2} />
            <MetricTile label="Lưu gần nhất" value={savedAt ? new Date(savedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : 'Chưa lưu'} unit={savedAt ? 'local' : 'draft'} tone="text-slate-700 dark:text-slate-200" icon={Save} />
          </div>
        </div>

        <nav className="flex gap-4 overflow-x-auto bg-white dark:bg-black/30 backdrop-blur-3xl p-3 rounded-2xl shadow-sg-md border border-slate-200/80 dark:border-[var(--color-sg-border)] mb-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-black transition ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-sg-muted hover:bg-slate-100 hover:text-sg-heading dark:hover:bg-slate-900'}`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'monthly' && renderMonthly()}
        {activeTab === 'allocation' && renderAllocation()}
        {activeTab === 'people' && renderPeople()}
      </div>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title, subtitle }: { icon: React.ComponentType<{ size?: number; className?: string }>; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-indigo-100 bg-indigo-50 text-indigo-600 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300">
        <Icon size={18} />
      </div>
      <div>
        <h3 className="text-sm font-black uppercase tracking-widest text-sg-heading">{title}</h3>
        <p className="mt-1 text-xs font-semibold leading-5 text-sg-muted">{subtitle}</p>
      </div>
    </div>
  );
}

function MetricTile({ label, value, unit, tone = 'text-sg-heading', icon: Icon }: { label: string; value: string | number; unit?: string; tone?: string; icon?: React.ComponentType<{ size?: number; className?: string }> }) {
  return (
    <div className="bg-white/70 dark:bg-black/30 backdrop-blur-3xl rounded-[32px] shadow-sg-md border border-slate-200/80 dark:border-[var(--color-sg-border)] p-8">
      <div className="flex items-start justify-between gap-3">
        <div className="text-[11px] font-black uppercase tracking-widest text-sg-muted">{label}</div>
        {Icon ? <Icon size={16} className="text-slate-400" /> : null}
      </div>
      <div className={`mt-3 text-2xl font-black tabular-nums ${tone}`}>{value}</div>
      {unit ? <div className="mt-1 text-[11px] font-bold uppercase tracking-wide text-sg-muted">{unit}</div> : null}
    </div>
  );
}

function GlassStat({ label, value, unit, tone = 'text-sg-heading' }: { label: string; value: string; unit: string; tone?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/40 dark:bg-black/20 backdrop-blur-md p-4">
      <div className="text-[10px] font-black uppercase tracking-widest text-sg-muted">{label}</div>
      <div className={`mt-2 text-2xl font-black tabular-nums ${tone}`}>{value}</div>
      <div className="mt-1 text-[10px] font-bold uppercase tracking-wide text-sg-muted/70">{unit}</div>
    </div>
  );
}




function FunnelStep({ num, label, sub, value, unit, bg, numBg, numTone, labelTone, subTone, valTone, unitTone, border, barBg, barWidth, mx }: any) {
  return (
    <div className={`relative flex items-center justify-between overflow-hidden rounded-[1.5rem] p-6 transition-all hover:scale-[1.01] ${bg} ${mx} ${border}`}>
      <div className="relative z-10 flex items-center gap-4">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black ${numBg} ${numTone}`}>
          {num}
        </div>
        <div>
          <div className={`text-xs font-bold uppercase tracking-wider ${labelTone}`}>{label}</div>
          <div className={`mt-1 text-[10px] font-semibold ${subTone}`}>{sub}</div>
        </div>
      </div>
      <div className="relative z-10 text-right">
        <div className={`text-3xl font-black ${valTone}`}>{value}</div>
        <div className={`text-[10px] font-bold uppercase ${unitTone}`}>{unit}</div>
      </div>
      <div className={`absolute bottom-0 left-0 h-1 ${barBg} ${barWidth}`} />
    </div>
  );
}

function DownArrow() {
  return (
    <div className="flex justify-center -my-1 text-slate-300 dark:text-slate-600 opacity-60">
      <ChevronDown size={24} />
    </div>
  );
}

function NumberField({ label, value, unit, step = 1, min = 0, max, onChange }: { label: string; value: number; unit: string; step?: number; min?: number; max?: number; onChange: (value: string) => void }) {
  return (
    <label className="block rounded-2xl border border-slate-200/80 bg-white/40 p-4 dark:border-white/10 dark:bg-black/20 backdrop-blur-md transition-all hover:bg-white/70 dark:hover:bg-black/40">
      <span className="text-[11px] font-black uppercase tracking-widest text-sg-muted">{label}</span>
      <div className="mt-3 flex items-center gap-2">
        <SGNumberInput value={value} step={step} min={min} max={max} onChange={onChange} className="w-full bg-transparent text-right text-xl font-black text-indigo-600 dark:text-indigo-400 outline-none" />
        <span className="w-9 text-right text-xs font-black uppercase text-sg-muted">{unit}</span>
      </div>
    </label>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-[11px] font-black uppercase tracking-widest text-sg-muted">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-sg-heading outline-none focus:border-indigo-400 dark:border-slate-800 dark:bg-slate-900" />
    </label>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: Array<[string, string]>; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-[11px] font-black uppercase tracking-widest text-sg-muted">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-sg-heading outline-none focus:border-indigo-400 dark:border-slate-800 dark:bg-slate-900">
        {options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}
      </select>
    </label>
  );
}

function FunnelRow({ label, value, unit, width, color, icon: Icon, strong }: { label: string; value: number; unit: string; width: string; color: string; icon: React.ComponentType<{ size?: number; className?: string }>; strong?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-sg-muted dark:border-slate-800 dark:bg-slate-900">
        <Icon size={17} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between text-xs font-black uppercase tracking-widest text-sg-muted">
          <span>{label}</span>
          <span className={strong ? 'text-indigo-600 dark:text-indigo-300' : 'text-sg-heading'}>{formatVN(value)} {unit}</span>
        </div>
        <div className="h-3 rounded bg-slate-100 dark:bg-slate-800">
          <div className={`h-full rounded ${color}`} style={{ width }} />
        </div>
      </div>
      <ChevronRight size={16} className="hidden text-sg-muted md:block" />
    </div>
  );
}

function SourceCard({ label, value, percent, tone }: { label: string; value: number; percent: number; tone: 'blue' | 'orange' }) {
  const toneClass = tone === 'blue'
    ? 'border-blue-100 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300'
    : 'border-orange-100 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950/30 dark:text-orange-300';

  return (
    <div className={`rounded-lg border p-4 ${toneClass}`}>
      <div className="text-[11px] font-black uppercase tracking-widest opacity-80">{label}</div>
      <div className="mt-2 flex items-end justify-between gap-3">
        <div className="text-3xl font-black tabular-nums">{formatVN(value)}</div>
        <div className="text-sm font-black">{formatPercent(percent, 0)}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: SalesStaff['status'] }) {
  const cls = status === 'active'
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300'
    : status === 'planned'
      ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300'
      : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-900';

  return <span className={`rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${cls}`}>{status}</span>;
}

function MonthSelect({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <select value={value || 1} onChange={(event) => onChange(Number(event.target.value) || 1)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-black text-sg-heading outline-none focus:border-indigo-400 dark:border-slate-800 dark:bg-slate-950">
      {MONTHS_OPTS.map((month) => <option key={month} value={month}>Tháng {month}</option>)}
    </select>
  );
}

function MonthTimeline({ from, to, isOff, color = 'bg-indigo-500' }: { from: number; to: number; isOff?: boolean; color?: string }) {
  return (
    <div className="mt-4 grid grid-cols-12 gap-1">
      {MONTHS_OPTS.map((month) => {
        const active = !isOff && month >= from && month <= to;
        return <div key={month} className={`h-2 rounded ${active ? color : 'bg-slate-200 dark:bg-slate-800'}`} title={`Tháng ${month}`} />;
      })}
    </div>
  );
}

function EmptyPanel({ label }: { label: string }) {
  return (
    <div className="rounded-lg border-2 border-dashed border-slate-200 bg-white p-12 text-center text-sm font-black uppercase tracking-widest text-sg-muted dark:border-slate-800 dark:bg-slate-950/70">
      {label}
    </div>
  );
}

function MetricSelector({ value, onChange }: { value: FunnelMetric; onChange: (value: FunnelMetric) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {metricOptions.map((metric) => (
        <button key={metric.key} onClick={() => onChange(metric.key)} className={`rounded-md border px-3 py-1.5 text-[10px] font-black uppercase tracking-wide ${value === metric.key ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 bg-white text-sg-muted hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900'}`}>
          {metric.label}
        </button>
      ))}
    </div>
  );
}

function AllocationTable({
  title,
  subtitle,
  metric,
  setMetric,
  metricOption,
  rows,
  selectedTeamId,
  onSelectTeam,
  footerSource,
}: {
  title: string;
  subtitle: string;
  metric: FunnelMetric;
  setMetric: (metric: FunnelMetric) => void;
  metricOption: typeof metricOptions[number];
  rows: TeamAllocation[];
  selectedTeamId: string;
  onSelectTeam: (teamId: string) => void;
  footerSource: MonthlyFunnel[];
}) {
  return (
    <section className="overflow-hidden bg-white/70 dark:bg-black/30 backdrop-blur-3xl rounded-[32px] shadow-sg-md border border-slate-200/80 dark:border-[var(--color-sg-border)]">
      <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/60 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-sg-heading">{title}</h3>
          <p className="mt-1 text-xs font-semibold text-sg-muted">{subtitle}</p>
        </div>
        <MetricSelector value={metric} onChange={setMetric} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px]">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] font-black uppercase tracking-widest text-sg-muted dark:border-slate-800">
              <th className="sticky left-0 z-10 bg-white px-5 py-3 text-left dark:bg-slate-950">Team</th>
              {MONTHS_OPTS.map((month) => <th key={month} className="px-3 py-3 text-right">T{month}</th>)}
              <th className="bg-indigo-50 px-5 py-3 text-right text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-300">Tổng</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const yearTotal = metricTotal(row.months, metric);
              return (
                <tr key={row.teamId} onClick={() => onSelectTeam(row.teamId)} className={`cursor-pointer border-b border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/50 ${selectedTeamId === row.teamId ? 'bg-indigo-50/60 dark:bg-indigo-950/20' : ''}`}>
                  <td className="sticky left-0 z-10 bg-white px-5 py-3 text-left dark:bg-slate-950">
                    <div className="text-sm font-black text-sg-heading">{row.teamName}</div>
                    <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-sg-muted">{row.status === 'active' ? 'Hoạt động' : 'Ngưng HĐ'}</div>
                  </td>
                  {row.months.map((month, index) => (
                    <td key={index} className={`px-3 py-3 text-right text-sm tabular-nums ${month.active ? `font-black ${metricOption.tone}` : 'text-sg-muted'}`}>
                      {month.active ? metricOption.format(month[metric]) : '-'}
                    </td>
                  ))}
                  <td className={`bg-indigo-50/60 px-5 py-3 text-right text-sm font-black tabular-nums dark:bg-indigo-950/20 ${metricOption.tone}`}>{metricOption.format(yearTotal)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-slate-100 dark:bg-slate-900 text-sg-heading">
            <tr>
              <td className="sticky left-0 bg-slate-950 px-5 py-4 text-left text-[10px] font-black uppercase tracking-widest">Tổng gốc</td>
              {footerSource.map((month, index) => <td key={index} className="px-3 py-4 text-right text-xs font-black">{metricOption.format(month[metric])}</td>)}
              <td className="bg-indigo-950 px-5 py-4 text-right text-xs font-black">{metricOption.format(metricTotal(footerSource, metric))}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}

function MemberAllocationTable({
  metric,
  setMetric,
  metricOption,
  teams,
  selectedTeamId,
  setSelectedTeamId,
  rows,
  teamPlan,
}: {
  metric: FunnelMetric;
  setMetric: (metric: FunnelMetric) => void;
  metricOption: typeof metricOptions[number];
  teams: SalesTeam[];
  selectedTeamId: string;
  setSelectedTeamId: (teamId: string) => void;
  rows: MemberAllocation[];
  teamPlan: TeamAllocation | null;
}) {
  return (
    <section className="overflow-hidden bg-white/70 dark:bg-black/30 backdrop-blur-3xl rounded-[32px] shadow-sg-md border border-slate-200/80 dark:border-[var(--color-sg-border)]">
      <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/60 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-sg-heading">Chỉ tiêu cho nhân sự</h3>
          <p className="mt-1 text-xs font-semibold text-sg-muted">Chọn team để xem chỉ tiêu từng người</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select value={selectedTeamId} onChange={(event) => setSelectedTeamId(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-black text-sg-heading outline-none dark:border-slate-800 dark:bg-slate-900">
            {teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
          </select>
          <MetricSelector value={metric} onChange={setMetric} />
        </div>
      </div>

      {rows.length === 0 ? <EmptyPanel label="Chưa có nhân sự trong team này" /> : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px]">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-black uppercase tracking-widest text-sg-muted dark:border-slate-800">
                <th className="sticky left-0 z-10 bg-white px-5 py-3 text-left dark:bg-slate-950">Nhân sự</th>
                {MONTHS_OPTS.map((month) => <th key={month} className="px-3 py-3 text-right">T{month}</th>)}
                <th className="bg-purple-50 px-5 py-3 text-right text-purple-600 dark:bg-purple-950/30 dark:text-purple-300">Tổng</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.memberId} className="border-b border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/50">
                  <td className="sticky left-0 z-10 bg-white px-5 py-3 text-left dark:bg-slate-950">
                    <div className="text-sm font-black text-sg-heading">{row.memberName}</div>
                    <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-sg-muted">{row.status}</div>
                  </td>
                  {row.months.map((month, index) => (
                    <td key={index} className={`px-3 py-3 text-right text-sm tabular-nums ${month.active ? `font-black ${metricOption.tone}` : 'text-sg-muted'}`}>
                      {month.active ? metricOption.format(month[metric]) : '-'}
                    </td>
                  ))}
                  <td className={`bg-purple-50/60 px-5 py-3 text-right text-sm font-black tabular-nums dark:bg-purple-950/20 ${metricOption.tone}`}>{metricOption.format(metricTotal(row.months, metric))}</td>
                </tr>
              ))}
            </tbody>
            {teamPlan ? (
              <tfoot className="bg-slate-100 dark:bg-slate-900 text-sg-heading">
                <tr>
                  <td className="sticky left-0 bg-slate-950 px-5 py-4 text-left text-[10px] font-black uppercase tracking-widest">Tổng team</td>
                  {teamPlan.months.map((month, index) => <td key={index} className="px-3 py-4 text-right text-xs font-black">{month.active ? metricOption.format(month[metric]) : '-'}</td>)}
                  <td className="bg-purple-950 px-5 py-4 text-right text-xs font-black">{metricOption.format(metricTotal(teamPlan.months, metric))}</td>
                </tr>
              </tfoot>
            ) : null}
          </table>
        </div>
      )}
    </section>
  );
}

function TeamKpiTable({ team, teamPlan, teamYear }: { team: SalesTeam; teamPlan: TeamAllocation | null; teamYear: Record<FunnelMetric, number> }) {
  if (!teamPlan) return null;
  return (
    <section className="overflow-hidden bg-white/70 dark:bg-black/30 backdrop-blur-3xl rounded-[32px] shadow-sg-md border border-slate-200/80 dark:border-[var(--color-sg-border)]">
      <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/60 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-sg-heading">{team.name} - KPI 12 tháng</h3>
          <p className="mt-1 text-xs font-semibold text-sg-muted">Hoạt động T{team.activeFrom} đến T{team.activeTo}</p>
        </div>
        <MonthTimeline from={team.activeFrom} to={team.activeTo} isOff={team.status !== 'active'} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px]">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] font-black uppercase tracking-widest text-sg-muted dark:border-slate-800">
              <th className="px-5 py-3 text-left">Tháng</th>
              <th className="px-5 py-3 text-right">GMV</th>
              <th className="px-5 py-3 text-right text-indigo-600 dark:text-indigo-300">GD</th>
              <th className="px-5 py-3 text-right">Booking</th>
              <th className="px-5 py-3 text-right">Hẹn gặp</th>
              <th className="px-5 py-3 text-right text-orange-600 dark:text-orange-300">KHQT</th>
              <th className="px-5 py-3 text-right">NS Active</th>
            </tr>
          </thead>
          <tbody>
            {teamPlan.months.map((month, index) => (
              <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/50">
                <td className="px-5 py-3 text-sm font-black text-sg-heading">Tháng {index + 1}</td>
                <td className="px-5 py-3 text-right text-sm font-bold">{month.active ? `${formatMoney(month.gmv)} Tỷ` : '-'}</td>
                <td className="px-5 py-3 text-right text-sm font-black text-indigo-600 dark:text-indigo-300">{month.active ? formatVN(month.deals) : '-'}</td>
                <td className="px-5 py-3 text-right text-sm font-bold">{month.active ? formatVN(month.bookings) : '-'}</td>
                <td className="px-5 py-3 text-right text-sm font-bold">{month.active ? formatVN(month.meetings) : '-'}</td>
                <td className="px-5 py-3 text-right text-sm font-black text-orange-600 dark:text-orange-300">{month.active ? formatVN(month.leadsSale) : '-'}</td>
                <td className="px-5 py-3 text-right text-sm font-bold text-emerald-600 dark:text-emerald-300">{month.active ? month.staffCount : '-'}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-100 dark:bg-slate-900 text-sg-heading">
            <tr>
              <td className="px-5 py-4 text-xs font-black uppercase tracking-widest">Tổng năm</td>
              <td className="px-5 py-4 text-right text-sm font-black">{formatMoney(teamYear.gmv)} Tỷ</td>
              <td className="px-5 py-4 text-right text-sm font-black text-indigo-200">{formatVN(teamYear.deals)}</td>
              <td className="px-5 py-4 text-right text-sm font-black">{formatVN(teamYear.bookings)}</td>
              <td className="px-5 py-4 text-right text-sm font-black">{formatVN(teamYear.meetings)}</td>
              <td className="px-5 py-4 text-right text-sm font-black text-orange-200">{formatVN(teamYear.leadsSale)}</td>
              <td className="px-5 py-4 text-right text-sm font-black">-</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}

function MemberKpiBreakdown({ rows }: { rows: MemberAllocation[] }) {
  if (!rows.length) return null;
  const breakdownRows: Array<{ key: FunnelMetric; label: string; format: (value: unknown) => string; tone: string }> = [
    { key: 'gmv', label: 'GMV', format: formatMoney, tone: 'text-slate-900 dark:text-white' },
    { key: 'deals', label: 'GD', format: formatVN, tone: 'text-indigo-600 dark:text-indigo-300' },
    { key: 'leadsSale', label: 'KHQT', format: formatVN, tone: 'text-orange-600 dark:text-orange-300' },
  ];

  return (
    <section className="overflow-hidden bg-white/70 dark:bg-black/30 backdrop-blur-3xl rounded-[32px] shadow-sg-md border border-slate-200/80 dark:border-[var(--color-sg-border)]">
      <div className="border-b border-purple-100 bg-purple-50 px-5 py-4 dark:border-purple-900 dark:bg-purple-950/30">
        <h3 className="text-sm font-black uppercase tracking-widest text-purple-800 dark:text-purple-200">Chi tiết KPI theo nhân sự</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1120px]">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] font-black uppercase tracking-widest text-sg-muted dark:border-slate-800">
              <th className="sticky left-0 z-10 bg-white px-5 py-3 text-left dark:bg-slate-950">Nhân sự</th>
              <th className="px-3 py-3 text-center">Chỉ số</th>
              {MONTHS_OPTS.map((month) => <th key={month} className="px-3 py-3 text-right">T{month}</th>)}
              <th className="bg-indigo-50 px-5 py-3 text-right text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-300">Tổng</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((member) => (
              <React.Fragment key={member.memberId}>
                {breakdownRows.map((row, rowIndex) => (
                  <tr key={`${member.memberId}-${row.key}`} className="border-b border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/50">
                    {rowIndex === 0 ? (
                      <td rowSpan={breakdownRows.length} className="sticky left-0 z-10 border-r border-slate-100 bg-white px-5 py-3 text-left dark:border-slate-800 dark:bg-slate-950">
                        <div className="text-sm font-black text-sg-heading">{member.memberName}</div>
                        <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-sg-muted">{member.status} · T{member.activeFrom}→T{member.activeTo}</div>
                      </td>
                    ) : null}
                    <td className="px-3 py-2 text-center text-[10px] font-black uppercase tracking-wide text-sg-muted">{row.label}</td>
                    {member.months.map((month, index) => (
                      <td key={index} className={`px-3 py-2 text-right text-xs tabular-nums ${month.active ? `font-bold ${row.tone}` : 'text-sg-muted'}`}>
                        {month.active ? row.format(month[row.key]) : '-'}
                      </td>
                    ))}
                    <td className={`bg-indigo-50/60 px-5 py-2 text-right text-xs font-black tabular-nums dark:bg-indigo-950/20 ${row.tone}`}>{row.format(metricTotal(member.months, row.key))}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
