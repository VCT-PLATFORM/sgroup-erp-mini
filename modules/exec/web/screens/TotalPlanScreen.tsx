import React from 'react';
import { 
  PieChart, Target, TrendingUp, Filter, ChevronDown, ChevronLeft, ChevronRight,
  Users, User, Building, Layers, Shield, CreditCard, Megaphone, Grid, Save, History
} from 'lucide-react';
import { SGNumberInput } from '../components/shared/SGNumberInput';
import { 
  useTotalPlanData, OPEX_CONFIG, SCENARIOS, COST_ROWS, FUNNEL_PARAMS,
  formatVN, formatMoney
} from '../hooks/useTotalPlanData';

export function TotalPlanScreen() {
  const { scenario, changeScenario, plan, result, handleChange, handleRevRateChange } = useTotalPlanData();

  const renderScenarioBtn = (key: string) => {
    const s = SCENARIOS[key];
    const active = scenario === key;
    const cls = `px-5 py-2.5 text-sm font-bold rounded-lg transition-all ${
      active ? `${s.color} text-white shadow-md` : "text-sg-muted hover:bg-white dark:hover:bg-slate-700"
    }`;
    return <button key={key} onClick={() => changeScenario(key)} className={cls}>{s.label}</button>;
  };

  const IconMap: Record<string, React.ElementType> = {
    Users, User, Building, Layers, Shield, CreditCard, Megaphone, Grid, Target
  };

  const renderCostRow = (row: typeof COST_ROWS[0], i: number) => {
    const revRate  = result.civRevRates[row.rv];
    const salesRate = plan[row.k] || 0;
    const perDeal  = result.civPerDeal[row.rv];
    const Icon = IconMap[row.icon] || Grid;

    return (
      <div key={i} className="group flex items-center justify-between bg-white dark:bg-black/30 backdrop-blur-3xl hover:bg-indigo-50/40 dark:hover:bg-indigo-900/20 p-5 px-10 rounded-2xl border border-slate-200/80 dark:border-[var(--color-sg-border)] hover:border-indigo-200 dark:hover:border-indigo-700 transition-all duration-200 shadow-sg-md hover:shadow-md">
        <div className="flex-1 flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sg-md ${row.iconColor}`}>
            <Icon size={20} />
          </div>
          <span className="text-[15px] font-bold text-sg-heading">{row.l}</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative w-28">
            <SGNumberInput
              value={Number(revRate.toFixed(2))}
              step={0.5} min={0}
              onChange={(v) => handleRevRateChange(row.k, v)}
              className="w-full text-center font-black text-indigo-700 dark:text-indigo-300 bg-indigo-500/10 dark:bg-indigo-500/20 group-hover:bg-indigo-500/20 dark:group-hover:bg-indigo-900/50 border-2 border-transparent focus:border-indigo-500 rounded-xl py-2 px-3 outline-none transition-all tabular-nums pr-10"
              suffix={<span className="text-[10px] font-black text-indigo-400">%</span>}
            />
          </div>
          <div className="w-24 text-center">
            <div className="inline-flex items-center gap-1 bg-sg-card px-3 py-2 rounded-xl">
              <span className="font-black text-sg-heading tabular-nums text-sm">{Number(salesRate).toFixed(2)}</span>
              <span className="text-[10px] font-black text-sg-muted">%</span>
            </div>
          </div>
          <div className="w-32 text-right">
            <span className="text-lg font-black text-blue-600 dark:text-blue-400 tabular-nums">{formatMoney(result.costInhouseValues[row.rv])}</span>
            <span className="ml-1 text-[10px] font-bold text-blue-300 dark:text-blue-500 uppercase italic">Tỷ</span>
          </div>
          <div className="w-32 text-right">
            <span className="text-base font-black text-purple-600 dark:text-purple-400 tabular-nums">{formatVN(perDeal)}</span>
            <span className="ml-1 text-[10px] font-bold text-purple-300 dark:text-purple-500 uppercase italic">Tr/GD</span>
          </div>
        </div>
      </div>
    );
  };

  const renderOpexCol = (col: typeof OPEX_CONFIG[0]) => {
    const ColIcon = IconMap[col.icon] || Grid;
    return (
      <div key={col.id} className="flex flex-col h-full bg-white dark:bg-black/30 backdrop-blur-3xl rounded-[1.5rem] border border-slate-200/80 dark:border-[var(--color-sg-border)] hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-100/40 dark:hover:shadow-indigo-900/20 transition-all duration-300 group overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200/80 dark:border-[var(--color-sg-border)] flex items-center gap-2 text-xs font-black uppercase bg-sg-btn-bg group-hover:bg-slate-100 dark:group-hover:bg-slate-750 transition-colors h-14">
          <div className="p-1.5 rounded-lg bg-white/60 dark:bg-slate-700/60"><ColIcon size={16} /></div>
          <span className="leading-tight">{col.title}</span>
        </div>
        <div className="p-5 flex-1 space-y-6">
          {col.items.map((item) => {
            const isAuto = !!item.auto;
            const displayVal = isAuto ? (result.autoValues[item.key] || 0) : plan[item.key];
            return (
              <div key={item.key} className="group/item">
                <div className="mb-1.5 min-h-[20px] flex items-center gap-2">
                  <label className="text-[11px] font-bold text-sg-heading  uppercase tracking-wide block leading-snug group-hover/item:text-indigo-700 dark:group-hover/item:text-indigo-400 transition-colors">{item.label}</label>
                  {isAuto && <span className="text-[9px] font-bold text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-700 uppercase tracking-wider select-none">Tự động</span>}
                </div>
                {isAuto ? (
                  <div className="flex items-center border-b border-amber-300 dark:border-amber-700 pb-1.5 bg-amber-50/50 dark:bg-amber-900/20 rounded px-2">
                    <div className="flex-1 text-right font-bold text-amber-700 dark:text-amber-300 text-base py-1.5 tabular-nums select-none">
                      {formatVN(displayVal)}
                    </div>
                    <span className="text-[11px] font-bold text-amber-400 dark:text-amber-500 ml-1.5 select-none">Triệu</span>
                  </div>
                ) : (
                  <div className="flex items-center border-b border-slate-200/80 dark:border-[var(--color-sg-border)] group-hover/item:border-indigo-500 transition-colors pb-1.5 bg-white/50 dark:bg-black/20 rounded px-2 hover:bg-white dark:hover:bg-slate-700">
                    <div className="flex-1">
                      <SGNumberInput
                        value={displayVal} step={1} min={0}
                        onChange={(v) => handleChange(item.key, v)}
                        className="w-full text-right font-bold text-sg-heading outline-none bg-transparent text-base pr-10"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-sg-muted ml-1.5 select-none">Triệu</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="px-5 py-4 bg-sg-btn-bg border-t border-slate-200/80 dark:border-[var(--color-sg-border)] flex justify-between items-center">
          <span className="text-[10px] font-extrabold text-sg-muted uppercase tracking-widest">Tổng nhóm</span>
          <span className="text-base font-black text-sg-heading">
            {formatVN(col.items.reduce((s, i) => s + (i.auto ? (result.autoValues[i.key] || 0) : Number(plan[i.key] || 0)), 0))} <span className="text-[10px] text-sg-muted">Triệu</span>
          </span>
        </div>
      </div>
    );
  };

  const FUNNEL_STEPS = [
    {label:"1. KHQT",     value:result.numLeads,    width:"w-full",  bg:"bg-slate-100 dark:bg-sg-card",        border:"border-slate-200/80 dark:border-[var(--color-sg-border)]", textColor:"text-sg-heading",   labelColor:"text-sg-muted"},
    {label:"2. Hẹn Gặp",  value:result.numMeetings, width:"w-[90%]", bg:"bg-indigo-50 dark:bg-indigo-900/30",    border:"border-indigo-100 dark:border-indigo-800",textColor:"text-indigo-600 dark:text-indigo-400", labelColor:"text-indigo-400 dark:text-indigo-500"},
    {label:"3. Booking",  value:result.numBookings, width:"w-[80%]", bg:"bg-indigo-100 dark:bg-indigo-900/50",   border:"border-indigo-200 dark:border-indigo-700",textColor:"text-indigo-700 dark:text-indigo-300", labelColor:"text-indigo-500 dark:text-indigo-400"}
  ];

  return (
    <div className="relative min-h-[calc(100vh-84px)]">
      <div className="pb-[100px] px-4 md:px-8 pt-6">
        <div className="max-w-[1600px] mx-auto w-full">

          {/* ════════ HEADER ════════ */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
            <div>
              <h1 className="text-4xl font-extrabold text-sg-heading tracking-tight">Kế Hoạch Tổng Thể</h1>
              <p className="text-base font-medium text-sg-muted mt-2">SGroup ERP — Planning CEO</p>
            </div>
            <div className="flex items-center gap-4 bg-white dark:bg-black/30 backdrop-blur-3xl p-2 rounded-2xl shadow-sg-md border border-slate-200/80 dark:border-[var(--color-sg-border)]">
              <div className="flex bg-sg-card rounded-xl p-1">
                {renderScenarioBtn('base')}
                {renderScenarioBtn('optimistic')}
                {renderScenarioBtn('pessimistic')}
              </div>
              <button className="bg-white dark:bg-slate-700 hover:bg-sg-card text-sg-heading border border-slate-200/80 dark:border-[var(--color-sg-border)] px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sg-md transition-all">
                <History size={18} /><span>LỊCH SỬ</span>
              </button>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg">
                <Save size={18} /> LƯU
              </button>
            </div>
          </div>

          {/* ════════ SECTION 1: BẢNG DOANH THU & CHI PHÍ ════════ */}
          <div className="bg-white/70 dark:bg-black/30 backdrop-blur-3xl rounded-[32px] shadow-sg-md border border-slate-200/80 dark:border-[var(--color-sg-border)] p-10 mb-10 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/40 dark:bg-blue-900/20 rounded-full -mr-40 -mt-40 blur-3xl pointer-events-none" />
            <div className="flex items-center justify-between mb-12 relative z-10">
              <div className="flex items-center gap-4 text-2xl font-black text-sg-heading uppercase tracking-widest">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900">
                  <PieChart size={24} />
                </div>
                1. Bảng Doanh thu & Chi phí
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 relative z-10 bg-white/50 dark:bg-black/20 p-10 rounded-[32px] border border-slate-200/80 dark:border-[var(--color-sg-border)]">
              <div className="flex flex-col items-center">
                <span className="text-xs font-black text-sg-muted uppercase tracking-[0.3em] mb-2">Doanh Thu Mục Tiêu</span>
                <div className="flex items-baseline gap-2 w-full justify-center">
                  <div className="w-full max-w-[350px]">
                    <SGNumberInput
                      value={plan.targetRevenue} step={1} min={0}
                      onChange={(v) => handleChange('targetRevenue', v)}
                      className="text-[100px] font-black text-indigo-600 dark:text-indigo-400 text-center bg-transparent outline-none w-full leading-none border-b-4 border-transparent focus:border-indigo-500 transition-all tabular-nums pr-0"
                    />
                  </div>
                  <span className="text-3xl font-black text-slate-300  italic">Tỷ</span>
                </div>
              </div>
              <div className="flex flex-col items-center border-t lg:border-t-0 lg:border-l border-slate-200/80 dark:border-[var(--color-sg-border)] pt-10 lg:pt-0 lg:pl-12">
                <span className="text-xs font-black text-sg-muted uppercase tracking-[0.3em] mb-2">Phí Môi Giới Bình Quân</span>
                <div className="flex items-baseline gap-2 w-full justify-center">
                  <div className="w-full max-w-[280px]">
                    <SGNumberInput
                      value={plan.avgFee} step={0.1} min={0}
                      onChange={(v) => handleChange('avgFee', v)}
                      className="text-[100px] font-black text-purple-600 dark:text-purple-400 text-center bg-transparent outline-none w-full leading-none border-b-4 border-transparent focus:border-purple-500 transition-all tabular-nums pr-0"
                    />
                  </div>
                  <span className="text-3xl font-black text-slate-300  italic">%</span>
                </div>
              </div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
              <div className="flex items-center px-10 mb-4">
                <span className="flex-1 text-[10px] font-black text-sg-muted uppercase tracking-[0.2em]">BIẾN PHÍ VẬN HÀNH</span>
                <div className="flex items-center gap-6">
                  <span className="w-28 text-center text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.15em]">Tỷ lệ (%)/Doanh thu</span>
                  <span className="w-24 text-center text-[10px] font-black text-sg-muted uppercase tracking-[0.15em]">Tỷ lệ (%)/Doanh số</span>
                  <span className="w-32 text-right text-[10px] font-black text-sg-muted uppercase tracking-[0.2em]">Giá trị quy đổi</span>
                  <span className="w-32 text-right text-[10px] font-black text-purple-500 dark:text-purple-400 uppercase tracking-[0.15em]">Số tiền/GD (Triệu)</span>
                </div>
              </div>
              <div className="space-y-3">
                {COST_ROWS.map((row, i) => renderCostRow(row, i))}
              </div>

              <div className="mt-6 flex items-center justify-between bg-sg-btn-bg p-5 px-10 rounded-2xl border border-slate-200/80 dark:border-[var(--color-sg-border)]">
                <span className="text-xl font-black text-sg-muted uppercase tracking-wide">Tổng Biến Phí</span>
                <div className="flex items-center gap-6">
                  <div className="w-28 text-center">
                    <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 tabular-nums">{Number(result.totalVarCostPctRevenue).toFixed(2)}</span>
                    <span className="text-[10px] font-bold text-indigo-400 ml-0.5">%</span>
                  </div>
                  <div className="w-24 text-center">
                    <span className="text-xl font-black text-sg-heading tabular-nums">
                      {(Number(plan.comSale)+Number(plan.comManager)+Number(plan.costMkt)+Number(plan.costContest)+Number(plan.costDiscount)+Number(plan.otherInhouse)).toFixed(2)}
                    </span>
                    <span className="text-[10px] font-bold text-sg-muted ml-0.5">%</span>
                  </div>
                  <div className="w-32 text-right">
                    <span className="text-lg font-black text-blue-600 dark:text-blue-400 tabular-nums">{formatMoney(result.totalCostInhouse)}</span>
                    <span className="ml-1 text-[10px] font-bold text-blue-300 dark:text-blue-500 uppercase italic">Tỷ</span>
                  </div>
                  <div className="w-32 text-right">
                    <span className="text-base font-black text-purple-600 dark:text-purple-400 tabular-nums">{formatVN(result.totalCostPerDeal)}</span>
                    <span className="ml-1 text-[10px] font-bold text-purple-300 dark:text-purple-500 uppercase italic">Tr/GD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ════════ BANNER: LỢI NHUẬN GỘP (GP) ════════ */}
          <div className="mt-12 pt-4 border-t border-slate-100/50 dark:border-slate-800/50">
            <div className="bg-linear-to-r from-[#1e1b4b] to-[#312e81] rounded-[2rem] p-10 text-white shadow-2xl shadow-indigo-900/20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" />
              <div className="absolute -right-32 -top-32 w-96 h-96 bg-indigo-500 rounded-full blur-[120px] opacity-20" />
              <div className="flex items-center gap-8 relative z-10">
                <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner">
                  <CreditCard size={48} className="text-indigo-200" />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-widest mb-3 text-white">LỢI NHUẬN GỘP (GP)</h3>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="inline-flex items-center gap-3 bg-indigo-500/20 px-5 py-2 rounded-xl border border-indigo-500/30 backdrop-blur-sm">
                      <span className="text-sm font-bold text-indigo-200 uppercase tracking-wide">% Doanh thu còn lại:</span>
                      <span className="text-xl font-black text-white">{Number(result.gpPctRevenue).toFixed(1)}%</span>
                    </div>
                    <div className="inline-flex items-center gap-3 bg-white/10 px-5 py-2 rounded-xl border border-white/20 backdrop-blur-sm">
                      <span className="text-sm font-bold text-indigo-200 uppercase tracking-wide">% Doanh số còn lại:</span>
                      <span className="text-xl font-black text-white">{Number(result.avgNetFeePct).toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right relative z-10">
                <div className="text-7xl font-black tracking-tighter text-white drop-shadow-2xl leading-none">{formatMoney(result.totalNetCommission)}</div>
                <div className="text-2xl font-bold text-indigo-300 mt-2 uppercase tracking-[0.2em] opacity-80">Tỷ VNĐ</div>
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <ChevronDown size={32} className="text-slate-300  animate-bounce opacity-50" />
            </div>
          </div>

          {/* ════════ SECTION 2: ĐỊNH PHÍ VẬN HÀNH ════════ */}
          <div className="bg-white/70 dark:bg-black/30 backdrop-blur-3xl rounded-[32px] shadow-sg-md border border-slate-200/80 dark:border-[var(--color-sg-border)] p-10 mb-10">
            <div className="flex justify-between items-center mb-12 border-b border-slate-200/80 dark:border-[var(--color-sg-border)] pb-6">
              <div className="flex items-center gap-4 text-2xl font-black text-sg-heading uppercase tracking-widest">
                <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center text-rose-500 shadow-sg-md">
                  <Filter size={24} />
                </div>
                2. Định Phí Vận Hành (Tháng)
              </div>
              <div className="bg-sg-card px-5 py-2.5 rounded-full text-xs font-bold text-sg-heading uppercase tracking-wide border border-slate-200/80 dark:border-[var(--color-sg-border)]">
                Đơn vị tính: Triệu VNĐ
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {OPEX_CONFIG.map(col => renderOpexCol(col))}
            </div>
            
            <div className="mt-12 flex flex-col md:flex-row justify-end items-stretch gap-8">
              <div className="flex items-center justify-between gap-8 px-10 py-6 bg-emerald-500/10 rounded-[1.5rem] border border-emerald-500/20 shadow-sg-md min-w-[320px]">
                <div className="text-left">
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-1">CHI PHÍ / THÁNG</span>
                  <div className="text-[11px] font-bold text-emerald-400 dark:text-emerald-500 uppercase">(Dự kiến trung bình)</div>
                </div>
                <div className="text-right">
                  <span className="text-4xl font-black text-emerald-700 dark:text-emerald-300 tracking-tighter">{formatVN(result.totalOpexMonth)}</span>
                  <span className="text-lg text-emerald-500 font-bold ml-1">Triệu</span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-10 px-10 py-6 bg-rose-500/10 rounded-[1.5rem] border border-rose-500/20 shadow-sg-md min-w-[380px]">
                <div className="text-left">
                  <span className="text-xs font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest block mb-1">TỔNG ĐỊNH PHÍ / NĂM</span>
                  <div className="text-[11px] font-bold text-rose-400 dark:text-rose-500 uppercase">(= Tháng x 12)</div>
                </div>
                <div className="text-right">
                  <span className="text-5xl font-black text-rose-700 dark:text-rose-300 tracking-tighter">{formatMoney(result.totalOpexYear)}</span>
                  <span className="text-2xl text-rose-500 font-bold ml-1">Tỷ</span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-6 px-8 py-6 bg-indigo-500/10 rounded-[1.5rem] border border-indigo-500/20 shadow-sg-md min-w-[240px]">
                <div className="text-left">
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block mb-1">TỶ LỆ / DOANH THU</span>
                  <div className="text-[11px] font-bold text-indigo-400 dark:text-indigo-500 uppercase">(Định phí / Doanh thu)</div>
                </div>
                <div className="text-right">
                  <span className="text-4xl font-black text-indigo-700 dark:text-indigo-300 tracking-tighter">{Number(result.opexPctRevenue).toFixed(1)}</span>
                  <span className="text-lg text-indigo-500 font-bold ml-1">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* ════════ SECTION 3: P&L ════════ */}
          <div className="bg-white/70 dark:bg-black/30 backdrop-blur-3xl rounded-[32px] shadow-sg-md border border-slate-200/80 dark:border-sg-border p-12 grid grid-cols-1 lg:grid-cols-2 gap-16 mb-12 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse" />
            
            <div className="relative z-10 flex flex-col justify-center">
              <div className="flex items-center gap-4 text-xl font-black text-sg-heading uppercase tracking-widest mb-10 border-b border-slate-700/50 pb-6">
                <PieChart size={24} />
                3. Báo cáo P&L Tóm tắt
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-5 rounded-2xl bg-white/50 dark:bg-black/20 border border-slate-700/50 hover:bg-sg-card transition-all">
                  <span className="text-sg-muted font-bold text-lg">1. Lợi nhuận Gộp (GP)</span>
                  <span className="text-emerald-400 font-black text-2xl tracking-wide">{formatVN(result.totalNetCommission)} Tỷ</span>
                </div>
                <div className="flex justify-between items-center p-5 rounded-2xl bg-white/50 dark:bg-black/20 border border-slate-700/50 hover:bg-sg-card transition-all">
                  <span className="text-sg-muted font-bold text-lg">2. (-) Chi phí Vận hành (OPEX)</span>
                  <span className="text-rose-400 font-black text-2xl tracking-wide">{formatVN(result.totalOpexYear)} Tỷ</span>
                </div>
                <div className="flex justify-between items-center px-5 py-4 mt-2">
                  <span className="font-black text-sg-heading text-xl">3. Lợi nhuận Trước thuế (EBT)</span>
                  <span className="font-black text-4xl text-sg-heading tracking-tight">{formatVN(result.ebt)} Tỷ</span>
                </div>
                <div className="flex justify-between items-center px-5 py-2">
                  <div className="flex items-center gap-3 text-sg-muted font-bold text-base">
                    <span>Thuế TNDN (%):</span>
                    <div className="w-20">
                      <SGNumberInput
                        value={plan.taxRate} step={1} min={0} max={100}
                        onChange={(v) => handleChange('taxRate', v)}
                        className="w-full bg-transparent text-center text-sg-heading font-bold outline-none tabular-nums"
                        wrapClassName="bg-white/5 border border-slate-600 rounded-lg px-2 py-1 focus-within:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>
                  <span className="text-rose-400 font-bold text-2xl">{formatVN(result.tax)} Tỷ</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex flex-col justify-center items-center lg:border-l border-slate-700 lg:pl-16">
              <div className="text-sm font-black text-sg-muted tracking-[0.4em] uppercase mb-12">Lợi Nhuận Ròng</div>
              <div className="text-[140px] font-black text-emerald-400 leading-none mb-2 tracking-tighter drop-shadow-[0_0_25px_rgba(52,211,153,0.4)] uppercase">
                {formatVN(result.netProfit)}
              </div>
              <div className="flex gap-6 w-full max-w-md mt-10">
                <div className="flex-1 flex flex-col items-center bg-white/50 dark:bg-black/20 rounded-3xl p-6 border border-slate-700 shadow-xl backdrop-blur-sm">
                  <span className="text-[10px] text-sg-muted font-bold uppercase tracking-widest mb-2 text-center">Tỷ suất lợi nhuận / DT (ROS)</span>
                  <span className="text-4xl font-black text-emerald-400">{Number(result.ros).toFixed(1)}%</span>
                </div>
                <div className="flex-1 flex flex-col items-center bg-white/50 dark:bg-black/20 rounded-3xl p-6 border border-slate-700 shadow-xl backdrop-blur-sm">
                  <span className="text-[10px] text-sg-muted font-bold uppercase tracking-widest mb-2">Biên lợi nhuận gộp</span>
                  <span className="text-4xl font-black text-blue-400">{Number(result.gpMargin).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* ════════ SECTION 4: BREAK-EVEN ════════ */}
          <div className="bg-white/70 dark:bg-black/30 backdrop-blur-3xl rounded-[32px] shadow-sg-md border border-slate-200/80 dark:border-[var(--color-sg-border)] p-10 mb-10">
            <div className="flex items-center gap-4 text-2xl font-black text-sg-heading uppercase tracking-widest mb-10 border-b border-slate-200/80 dark:border-[var(--color-sg-border)] pb-6">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sg-md">
                <Target size={24} />
              </div>
              4. Phân Tích Điểm Hòa Vốn (Break-even)
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-indigo-50/40 dark:bg-indigo-900/20 rounded-3xl p-10 border border-indigo-100 dark:border-indigo-800 flex flex-col justify-center">
                <div className="text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-widest mb-4">Doanh Thu Hòa Vốn (Năm)</div>
                <div className="text-6xl font-black text-indigo-600 dark:text-indigo-400 mb-4 tracking-tighter">
                  {formatVN(result.breakEvenRevenue)} <span className="text-2xl text-indigo-400 dark:text-indigo-500 font-bold">Tỷ</span>
                </div>
                <p className="text-xs font-medium text-indigo-500 dark:text-indigo-400 max-w-xs leading-relaxed">
                  Mức doanh thu tối thiểu cần đạt để bù đắp định phí vận hành {formatVN(result.totalOpexYear)} Tỷ.
                </p>
              </div>
              
              {(() => {
                const safe = result.safetyMargin >= 0;
                const wrapCls = safe ? "bg-emerald-50/40 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800" : "bg-red-50/40 dark:bg-red-900/20 border-red-100 dark:border-red-800";
                const titleCls = safe ? "text-emerald-800 dark:text-emerald-300" : "text-red-800 dark:text-red-300";
                const numCls   = safe ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400";
                const unitCls  = safe ? "text-emerald-400 dark:text-emerald-500" : "text-red-400 dark:text-red-500";
                const barCls   = safe ? "bg-emerald-500" : "bg-red-500";
                const footCls  = safe ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400";

                return (
                  <div className={`rounded-3xl p-10 border flex flex-col justify-center ${wrapCls}`}>
                    <div className={`text-xs font-bold uppercase tracking-widest mb-4 ${titleCls}`}>Biên An Toàn (Safety Margin)</div>
                    <div className={`text-6xl font-black mb-4 tracking-tighter ${numCls}`}>
                      {formatVN(result.safetyMargin)} <span className={`text-2xl font-bold ${unitCls}`}>Tỷ</span>
                    </div>
                    <div className="w-full bg-white dark:bg-slate-700 rounded-full h-3 mb-3 overflow-hidden border dark:border-slate-600 shadow-inner">
                      <div className={`h-full rounded-full transition-all duration-1000 ${barCls}`} style={{width: Math.min(Math.abs(Number(result.safetyMarginPct)), 100) + '%'}} />
                    </div>
                    <p className={`text-xs font-bold ${footCls}`}>
                      {safe ? "An toàn " : "Nguy hiểm "} {Number(Math.abs(Number(result.safetyMarginPct))).toFixed(1)}% so với hòa vốn.
                    </p>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* ════════ SECTION 5: PHỄU BÁN HÀNG ════════ */}
          <div className="bg-white/70 dark:bg-black/30 backdrop-blur-3xl rounded-[32px] shadow-sg-md border border-slate-200/80 dark:border-[var(--color-sg-border)] p-10 mb-10">
            <div className="flex items-center gap-4 text-2xl font-black text-sg-heading uppercase tracking-widest mb-10 border-b border-slate-200/80 dark:border-[var(--color-sg-border)] pb-6">
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-sg-md">
                <Filter size={24} />
              </div>
              5. Kế Hoạch Kinh Doanh & Phễu Bán Hàng (Inhouse)
            </div>

            <div className="bg-gradient-to-r from-purple-50 via-purple-100/50 to-purple-50 dark:from-purple-900/30 dark:via-purple-900/20 dark:to-purple-900/30 rounded-[2rem] p-12 mb-12 border border-purple-100 dark:border-purple-800 text-center relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-sm font-extrabold text-purple-900 dark:text-purple-300 uppercase tracking-[0.2em] mb-4 opacity-70">MỤC TIÊU GIÁ TRỊ GIAO DỊCH (GMV)</h3>
                <div className="text-[100px] font-black text-purple-600 dark:text-purple-400 leading-none tracking-tighter drop-shadow-sg-md mb-6">
                  {formatVN(result.targetGMVInhouse)} <span className="text-5xl text-purple-300 dark:text-purple-500 font-bold">Tỷ</span>
                </div>
                <div className="inline-block bg-white/80 dark:bg-white/50 dark:bg-black/20 backdrop-blur-md px-6 py-2 rounded-full border border-purple-100 dark:border-purple-700 shadow-sg-md">
                  <p className="text-purple-700 dark:text-purple-300 font-bold text-sm">
                    Doanh thu Inhouse: <span className="font-black text-lg">{formatVN(result.revInhouse)} Tỷ</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
              <div className="lg:col-span-4 bg-white dark:bg-black/30 backdrop-blur-3xl border border-slate-200/80 dark:border-[var(--color-sg-border)] rounded-[2rem] p-8 shadow-sg-md h-fit">
                <h4 className="text-xs font-bold text-sg-muted uppercase tracking-widest mb-8 flex items-center gap-2">
                  <Filter size={16} /> Tham Số Hiệu Suất
                </h4>
                <div className="space-y-8">
                  {FUNNEL_PARAMS.map((item, idx) => (
                    <div key={idx} className="group">
                      <label className="text-[11px] font-bold text-sg-muted uppercase tracking-wide block mb-2">{item.l}</label>
                      <div className="flex items-center border-b-2 border-dotted border-slate-200/80 dark:border-[var(--color-sg-border)] group-hover:border-purple-500 transition-colors pb-1">
                        <div className="flex-1">
                          <SGNumberInput
                            value={plan[item.k]} step={item.step} min={0}
                            onChange={(v) => handleChange(item.k, v)}
                            className="w-full text-right font-black text-sg-heading outline-none bg-transparent text-lg group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors pr-10"
                          />
                        </div>
                        <span className="text-xs font-bold text-sg-muted ml-2 w-6 text-right">{item.u}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-8 flex flex-col justify-between py-4">
                {FUNNEL_STEPS.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <div className={`relative ${step.width} ${idx > 0 ? 'mx-auto' : ''} ${step.bg} rounded-2xl flex items-center justify-between px-8 py-5 border ${step.border} shadow-sg-md mb-2 group hover:shadow-md transition-all`}>
                      <span className={`text-xs font-bold ${step.labelColor} uppercase tracking-widest`}>{step.label}</span>
                      <div className="flex items-center gap-4">
                        <div className={`h-px w-16 ${step.border} group-hover:w-24 transition-all duration-500`} />
                        <span className={`text-3xl font-black ${step.textColor}`}>{formatVN(step.value)}</span>
                      </div>
                    </div>
                    <div className="flex justify-center -my-3 z-10"><ChevronDown size={20} className={step.labelColor} /></div>
                  </React.Fragment>
                ))}
                
                <div className="relative w-[70%] mx-auto bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-between px-8 py-6 text-white shadow-xl shadow-purple-500/30 transform hover:scale-105 transition-all duration-300 mt-2">
                  <span className="text-sm font-black uppercase tracking-widest">4. Giao Dịch</span>
                  <span className="text-5xl font-black tracking-tighter drop-shadow-md">{formatVN(result.numDeals)}</span>
                </div>
              </div>
            </div>

            {/* Phân bổ MKT / Sales */}
            <div className="bg-white/70 dark:bg-black/30 backdrop-blur-3xl rounded-[32px] shadow-xl border border-slate-200/80 dark:border-[var(--color-sg-border)] p-8 mb-10 overflow-hidden relative">
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sg-md">
                  <PieChart size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-sg-heading uppercase tracking-tight">Phân Bổ Từ Marketing & Sales</h3>
                  <p className="text-xs font-bold text-sg-muted mt-1">Điều chỉnh tỷ trọng phân bổ giữa Marketing & Sales tự kiếm</p>
                </div>
              </div>
              
              <div className="relative z-10 px-2">
                <div className="relative py-4 select-none mb-10">
                  <div className="relative w-full h-14 rounded-full overflow-hidden shadow-inner flex items-center bg-sg-card ring-4 ring-slate-50 dark:ring-slate-800 border border-slate-200/80 dark:border-[var(--color-sg-border)]">
                    <div className="h-full bg-blue-600 flex items-center justify-start pl-6 transition-all duration-75 ease-linear relative overflow-hidden" style={{width: `${100 - (plan.salesSelfGenRate || 30)}%`}}>
                      <span className="relative z-10 text-sm font-black text-white uppercase tracking-widest whitespace-nowrap drop-shadow-md flex items-center gap-2">
                        Marketing <span className="bg-white/20 px-2 py-0.5 rounded text-xs">{100 - (plan.salesSelfGenRate || 30)}%</span>
                      </span>
                    </div>
                    <div className="h-full flex-1 bg-orange-400 flex items-center justify-end pr-6 transition-all duration-75 ease-linear relative overflow-hidden">
                      <span className="relative z-10 text-sm font-black text-white uppercase tracking-widest whitespace-nowrap drop-shadow-md flex items-center gap-2">
                        <span className="bg-white/20 px-2 py-0.5 rounded text-xs">{plan.salesSelfGenRate || 30}%</span> Sales
                      </span>
                    </div>
                    <div className="absolute top-1 bottom-1 w-12 bg-white rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.25)] border-[4px] border-slate-50 dark:border-slate-700 flex items-center justify-center cursor-ew-resize z-20" style={{left: `calc(${100 - (plan.salesSelfGenRate || 30)}% - 24px)`}}>
                      <ChevronLeft size={14} className="text-sg-muted" />
                      <ChevronRight size={14} className="text-sg-muted -ml-1" />
                    </div>
                    <input 
                      type="range" min="0" max="100" step="1" 
                      value={100 - (plan.salesSelfGenRate || 30)} 
                      onChange={(e) => handleChange('salesSelfGenRate', 100 - parseInt(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30" 
                    />
                  </div>
                </div>

                <div className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 dark:border-[var(--color-sg-border)]">
                  <div className="grid grid-cols-4 bg-sg-btn-bg border-b border-slate-200/80 dark:border-[var(--color-sg-border)]">
                    <div className="px-6 py-4 text-[10px] font-black text-sg-muted uppercase tracking-widest">Giai đoạn</div>
                    <div className="px-6 py-4 text-center text-[10px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest">Marketing</div>
                    <div className="px-6 py-4 text-center text-[10px] font-black text-sg-muted uppercase tracking-widest">Tổng</div>
                    <div className="px-6 py-4 text-center text-[10px] font-black text-orange-500 dark:text-orange-400 uppercase tracking-widest">Sales Tự Kiếm</div>
                  </div>
                  
                  {/* Rows for Leads, Meetings, Bookings, Deals similarly mapped */}
                  {/* MKT Leads = result.numLeadsMkt, Sales Leads = result.numLeadsSales */}
                  {/* Row 1: KHQT */}
                  <div className="grid grid-cols-4 border-b border-slate-200/80 dark:border-[var(--color-sg-border)] hover:bg-slate-50/50 dark:hover:bg-white/5 dark:bg-black/20 transition-colors">
                    <div className="px-6 py-5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-sg-card flex items-center justify-center text-sg-muted"><Users size={16} /></div>
                      <span className="text-sm font-bold text-sg-heading">KHQT</span>
                    </div>
                    <div className="px-6 py-5 text-center">
                      <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{formatVN(result.numLeadsMkt)}</div>
                      <div className="text-[10px] font-bold text-blue-400 dark:text-blue-500 uppercase mt-1">Khách hàng</div>
                    </div>
                    <div className="px-6 py-5 text-center">
                      <div className="text-2xl font-black text-sg-heading">{formatVN(result.numLeads)}</div>
                      <div className="text-[10px] font-bold text-sg-muted uppercase mt-1">KHQT / Năm</div>
                    </div>
                    <div className="px-6 py-5 text-center">
                      <div className="text-2xl font-black text-orange-500 dark:text-orange-400">{formatVN(result.numLeadsSales)}</div>
                      <div className="text-[10px] font-bold text-orange-400 dark:text-orange-500 uppercase mt-1">Khách hàng</div>
                    </div>
                  </div>

                  {/* Row 2: Hẹn Gặp */}
                  <div className="grid grid-cols-4 border-b border-slate-200/80 dark:border-[var(--color-sg-border)] hover:bg-slate-50/50 dark:hover:bg-white/5 dark:bg-black/20 transition-colors">
                    <div className="px-6 py-5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500"><User size={16} /></div>
                      <span className="text-sm font-bold text-sg-heading">Hẹn Gặp</span>
                    </div>
                    <div className="px-6 py-5 text-center">
                      <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{formatVN(result.numMeetingsMkt)}</div>
                      <div className="text-[10px] font-bold text-blue-400 dark:text-blue-500 uppercase mt-1">Lượt</div>
                    </div>
                    <div className="px-6 py-5 text-center">
                      <div className="text-2xl font-black text-sg-heading">{formatVN(result.numMeetings)}</div>
                      <div className="text-[10px] font-bold text-sg-muted uppercase mt-1">Hẹn Gặp / Năm</div>
                    </div>
                    <div className="px-6 py-5 text-center">
                      <div className="text-2xl font-black text-orange-500 dark:text-orange-400">{formatVN(result.numMeetingsSales)}</div>
                      <div className="text-[10px] font-bold text-orange-400 dark:text-orange-500 uppercase mt-1">Lượt</div>
                    </div>
                  </div>

                  {/* Row 3: Giữ Chỗ */}
                  <div className="grid grid-cols-4 border-b border-slate-200/80 dark:border-[var(--color-sg-border)] hover:bg-slate-50/50 dark:hover:bg-white/5 dark:bg-black/20 transition-colors">
                    <div className="px-6 py-5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-500"><Target size={16} /></div>
                      <span className="text-sm font-bold text-sg-heading">Giữ Chỗ</span>
                    </div>
                    <div className="px-6 py-5 text-center">
                      <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{formatVN(result.numBookingsMkt)}</div>
                      <div className="text-[10px] font-bold text-blue-400 dark:text-blue-500 uppercase mt-1">Giữ chỗ</div>
                    </div>
                    <div className="px-6 py-5 text-center">
                      <div className="text-2xl font-black text-sg-heading">{formatVN(result.numBookings)}</div>
                      <div className="text-[10px] font-bold text-sg-muted uppercase mt-1">Giữ chỗ / Năm</div>
                    </div>
                    <div className="px-6 py-5 text-center">
                      <div className="text-2xl font-black text-orange-500 dark:text-orange-400">{formatVN(result.numBookingsSales)}</div>
                      <div className="text-[10px] font-bold text-orange-400 dark:text-orange-500 uppercase mt-1">Giữ chỗ</div>
                    </div>
                  </div>

                  {/* Row 4: Giao Dịch */}
                  <div className="grid grid-cols-4 hover:bg-slate-50/50 dark:hover:bg-white/5 dark:bg-black/20 transition-colors bg-purple-50/30 dark:bg-purple-900/10">
                    <div className="px-6 py-5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white shadow-md"><Target size={16} /></div>
                      <span className="text-sm font-black text-purple-700 dark:text-purple-400 uppercase">Giao Dịch</span>
                    </div>
                    <div className="px-6 py-5 text-center">
                      <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{formatVN(result.numDealsMkt)}</div>
                      <div className="text-[10px] font-bold text-blue-400 dark:text-blue-500 uppercase mt-1">Giao dịch</div>
                    </div>
                    <div className="px-6 py-5 text-center">
                      <div className="text-3xl font-black text-purple-700 dark:text-purple-400">{formatVN(result.numDeals)}</div>
                      <div className="text-[10px] font-bold text-purple-400 dark:text-purple-500 uppercase mt-1">Giao dịch / Năm</div>
                    </div>
                    <div className="px-6 py-5 text-center">
                      <div className="text-2xl font-black text-orange-500 dark:text-orange-400">{formatVN(result.numDealsSales)}</div>
                      <div className="text-[10px] font-bold text-orange-400 dark:text-orange-500 uppercase mt-1">Giao dịch</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ════════ FOOTER BAR ════════ */}
      <div className="sticky bottom-0 z-50 bg-white/80 dark:bg-black/60 backdrop-blur-2xl border-t border-slate-200/50 dark:border-[var(--color-sg-border)] p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col xl:flex-row justify-between items-center gap-6 max-w-[1600px] mx-auto">
          <div className="flex-1 flex items-center justify-between gap-8 overflow-x-auto w-full pb-2 xl:pb-0 px-2">
            <div className="flex gap-6 items-center flex-shrink-0">
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-sg-muted uppercase tracking-widest mb-1">Doanh Thu Mục Tiêu</span>
                <span className="text-xl font-black text-sg-heading">{formatVN(plan.targetRevenue)} <span className="text-xs font-bold text-sg-muted">Tỷ</span></span>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-sg-muted uppercase tracking-widest mb-1">Tổng Doanh Số (GMV)</span>
                <span className="text-xl font-black text-blue-600 dark:text-blue-400">{formatVN(result.targetGMVInhouse)} <span className="text-xs font-bold text-blue-400">Tỷ</span></span>
              </div>
            </div>
            <div className="w-px h-10 bg-slate-300 dark:bg-slate-600 flex-shrink-0" />
            <div className="flex flex-col flex-shrink-0">
              <span className="text-[10px] font-extrabold text-sg-muted uppercase tracking-widest mb-1">Tổng Biến Phí</span>
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{formatVN(result.totalCostInhouse)} <span className="text-xs font-bold text-amber-400">Tỷ</span></span>
            </div>
            <div className="w-px h-10 bg-slate-300 dark:bg-slate-600 flex-shrink-0" />
            <div className="flex gap-8 items-center flex-shrink-0">
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-sg-muted uppercase tracking-widest mb-1">Tổng Hoa Hồng (Net)</span>
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{formatVN(result.totalNetCommission)} <span className="text-xs font-bold text-indigo-400">Tỷ</span></span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-sg-muted uppercase tracking-widest mb-1">Định Phí Vận Hành</span>
                <span className="text-2xl font-black text-rose-500 dark:text-rose-400">{formatVN(result.totalOpexYear)} <span className="text-xs font-bold text-rose-300">Tỷ</span></span>
              </div>
              <div className="bg-emerald-500/10 px-5 py-2 rounded-xl border border-emerald-500/20 flex flex-col justify-center min-w-[160px] shadow-sg-md">
                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-0.5">Lợi Nhuận Ròng</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-none">{formatVN(result.netProfit)} <span className="text-xs font-bold">Tỷ</span></span>
              </div>
            </div>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl transition-all transform hover:-translate-y-1 flex items-center gap-3 whitespace-nowrap flex-shrink-0">
            <Save size={20} /> LƯU KẾ HOẠCH
          </button>
        </div>
      </div>
    </div>
  );
}


