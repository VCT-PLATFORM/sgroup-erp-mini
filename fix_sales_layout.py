import re

path = 'd:/sgroup-erp/modules/exec/web/screens/SalesPlanScreen.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# Replace the entire renderDashboard function to match the original layout
new_render_dashboard = """  const renderDashboard = () => (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* ════════ CEO HERO ════════ */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-6 bg-slate-900 dark:bg-slate-100 rounded-full" />
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">
            Kế hoạch chiến lược CEO
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 relative overflow-hidden rounded-[32px] bg-slate-950 p-8 md:p-10 text-white shadow-2xl border border-slate-800">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-indigo-400 mb-6">
                <CircleDollarSign size={20} />
                <span className="text-xs font-black uppercase tracking-[0.2em]">Target Revenue {CURRENT_YEAR}</span>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-baseline gap-4 mb-10">
                <SGNumberInput
                  value={ceoData.targetGMV}
                  step={50}
                  min={0}
                  onChange={(value) => updateCeoNumber('targetGMV', value)}
                  className="w-full md:w-auto bg-transparent text-6xl md:text-8xl font-black tracking-tighter text-white outline-none"
                />
                <span className="text-3xl font-bold text-slate-400 uppercase">Tỷ VNĐ</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/10 pt-8">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">Số giao dịch mục tiêu</div>
                  <div className="text-2xl font-black text-white">{formatVN(Math.ceil(ceoData.targetGMV / Math.max(1, ceoData.avgDealValue)))} <span className="text-xs">GD</span></div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">Giá trung bình/giao dịch</div>
                  <div className="text-2xl font-black text-white">{formatMoney(ceoData.avgDealValue)} <span className="text-xs">Tỷ</span></div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">Nguồn khách Marketing</div>
                  <div className="text-2xl font-black text-blue-400">{formatPercent(mktRate * 100, 0)}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">Sale tự kiếm</div>
                  <div className="text-2xl font-black text-orange-400">{formatPercent(saleRate * 100, 0)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white dark:bg-black/40 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-900/30 shadow-sg-sm flex items-center justify-between transition-all hover:scale-[1.02]">
              <div>
                <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">Giao dịch / Giữ chỗ</div>
                <div className="text-3xl font-black text-slate-800 dark:text-slate-100 mt-1">{ceoData.rates.deal}%</div>
              </div>
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={28} />
              </div>
            </div>
            
            <div className="bg-white dark:bg-black/40 p-6 rounded-3xl border border-amber-100 dark:border-amber-900/30 shadow-sg-sm flex items-center justify-between transition-all hover:scale-[1.02]">
              <div>
                <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">Booking / Hẹn gặp</div>
                <div className="text-3xl font-black text-slate-800 dark:text-slate-100 mt-1">{ceoData.rates.booking}%</div>
              </div>
              <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/30 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400">
                <BriefcaseBusiness size={28} />
              </div>
            </div>
            
            <div className="bg-white dark:bg-black/40 p-6 rounded-3xl border border-rose-100 dark:border-rose-900/30 shadow-sg-sm flex items-center justify-between transition-all hover:scale-[1.02]">
              <div>
                <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">Hẹn gặp / KHQT</div>
                <div className="text-3xl font-black text-slate-800 dark:text-slate-100 mt-1">{ceoData.rates.meeting}%</div>
              </div>
              <div className="w-14 h-14 bg-rose-50 dark:bg-rose-950/30 rounded-2xl flex items-center justify-center text-rose-600 dark:text-rose-400">
                <CalendarDays size={28} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ CCO SECTION ════════ */}
      <section className="bg-white/70 dark:bg-black/30 backdrop-blur-3xl rounded-[32px] shadow-sg-md border border-slate-200/80 dark:border-[var(--color-sg-border)] p-8 md:p-10">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-1.5 h-8 bg-purple-600 rounded-full" />
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">Kế hoạch Phễu Bán Hàng (Sale)</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Xây dựng kịch bản chuyển đổi</p>
          </div>
        </div>

        <div className="mb-10 flex flex-col md:flex-row md:items-end gap-6 bg-slate-50/50 dark:bg-white/5 p-6 rounded-3xl border border-slate-200/80 dark:border-[var(--color-sg-border)]">
          <div>
            <div className="text-sm font-black uppercase tracking-widest text-sg-heading mb-3">GMV mục tiêu tự nhận</div>
            <div className="flex items-end gap-3">
              <SGNumberInput
                value={ccoData.targetGMV}
                step={50}
                min={0}
                onChange={(value) => updateCcoNumber('targetGMV', value)}
                className="w-full md:w-[280px] bg-transparent text-5xl md:text-6xl font-black tracking-tight text-indigo-600 dark:text-indigo-400 outline-none"
              />
              <span className="text-2xl font-black text-sg-muted mb-2">Tỷ</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-sg-muted uppercase mb-1">So với CEO giao</span>
              <span className={inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-black border }>
                {ceoGap >= 0 ? '+' : ''}{formatMoney(ceoGap)} Tỷ ({formatPercent(ceoGapPct)})
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-4">
            <NumberField label="Giá trị TB/GD" value={ccoData.avgDealValue} unit="Tỷ" step={0.1} onChange={(value) => updateCcoNumber('avgDealValue', value)} />
            <NumberField label="Giao dịch / Giữ chỗ" value={ccoData.rates.deal} unit="%" max={100} onChange={(value) => updateCcoRate('deal', value)} />
            <NumberField label="Giữ chỗ / Hẹn gặp" value={ccoData.rates.booking} unit="%" max={100} onChange={(value) => updateCcoRate('booking', value)} />
            <NumberField label="Hẹn gặp / KHQT" value={ccoData.rates.meeting} unit="%" max={100} onChange={(value) => updateCcoRate('meeting', value)} />
          </div>

          <div className="lg:col-span-8 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <FunnelRow label="KHQT" value={funnel.leads} unit="khách" width="100%" color="bg-slate-500" icon={Users} />
              <FunnelRow label="Hẹn gặp" value={funnel.meetings} unit="cuộc" width="86%" color="bg-indigo-500/80 backdrop-blur-sm" icon={CalendarDays} />
              <FunnelRow label="Giữ chỗ" value={funnel.bookings} unit="booking" width="72%" color="bg-purple-600" icon={BriefcaseBusiness} />
              <FunnelRow label="Giao dịch" value={funnel.deals} unit="GD" width="58%" color="bg-indigo-600" icon={CheckCircle2} strong />
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <SourceCard label="Marketing cấp lead" value={mktLeads} percent={mktRate * 100} tone="blue" />
              <SourceCard label="Sales tự kiếm" value={saleLeads} percent={saleRate * 100} tone="orange" />
            </div>
            
            <div className="mt-4 rounded-2xl border border-slate-200/80 bg-white/50 p-6 dark:border-white/10 dark:bg-black/20 backdrop-blur-md">
              <div className="mb-4 flex items-center justify-between text-xs font-black uppercase tracking-widest text-sg-muted">
                <span>Cơ cấu tỷ trọng nguồn khách</span>
                <span>{formatPercent(mktRate * 100, 0)} MKT / {formatPercent(saleRate * 100, 0)} Sales</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={Math.round(mktRate * 100)}
                onChange={(event) => setCeoData((prev) => ({ ...prev, marketingRate: toNumber(event.target.value) / 100 }))}
                className="w-full accent-indigo-600"
              />
              <div className="mt-4 flex h-6 overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800">
                <div className="bg-indigo-500/80 backdrop-blur-sm transition-all" style={{ width: ${mktRate * 100}% }} />
                <div className="bg-orange-500 transition-all" style={{ width: ${saleRate * 100}% }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ HR ALLOCATION (Tóm tắt) ════════ */}
      <section className="bg-white/70 dark:bg-black/30 backdrop-blur-3xl rounded-[32px] shadow-sg-md border border-slate-200/80 dark:border-[var(--color-sg-border)] p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-sg-heading">Định biên và KPI mỗi sales</h3>
            <p className="mt-1 text-xs font-semibold text-sg-muted">{activeStaffCount} nhân sự active trong danh sách, chỉ tiêu đang chia cho {salesCount} người</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 p-1 dark:border-orange-900/30 dark:bg-orange-950/20">
            <button className="rounded-lg p-2 text-orange-700 hover:bg-white dark:text-orange-400 dark:hover:bg-slate-900" onClick={() => setSalesCount(Math.max(1, salesCount - 1))} title="Giảm sĩ số">
              <Minus size={18} />
            </button>
            <SGNumberInput
              value={salesCount}
              min={1}
              onChange={(value) => setSalesCount(Math.max(1, Math.round(toNumber(value))))}
              className="w-20 bg-transparent text-center text-2xl font-black text-orange-700 outline-none dark:text-orange-400"
            />
            <button className="rounded-lg p-2 text-orange-700 hover:bg-white dark:text-orange-400 dark:hover:bg-slate-900" onClick={() => setSalesCount(salesCount + 1)} title="Tăng sĩ số">
              <Plus size={18} />
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 lg:grid-cols-5 gap-4">
          <MetricTile label="GMV / Sales / Tháng" value={formatMoney(perSale.revenue)} unit="Tỷ" />
          <MetricTile label="Giao dịch / Tháng" value={formatMoney(perSale.deals)} unit="GD" tone="text-indigo-600 dark:text-indigo-400" />
          <MetricTile label="Hẹn gặp / Tháng" value={formatMoney(perSale.meetings)} unit="cuộc" tone="text-blue-600 dark:text-blue-400" />
          <MetricTile label="Booking / Tháng" value={formatMoney(perSale.bookings)} unit="booking" tone="text-purple-600 dark:text-purple-400" />
          <MetricTile label="KHQT / Tháng" value={formatVN(perSale.leads)} unit="khách" tone="text-orange-600 dark:text-orange-400" />
        </div>
      </section>
    </div>
  );
"""

# Extract the old renderDashboard function using regex
# We find everything from "const renderDashboard = () => (" up to the definition of "const renderMonthly"
old_pattern = re.compile(r'const renderDashboard = \(\) => \((.*?)\n  \);\n\n  const renderMonthly', re.DOTALL)
c = old_pattern.sub(new_render_dashboard + '\n\n  const renderMonthly', c)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

