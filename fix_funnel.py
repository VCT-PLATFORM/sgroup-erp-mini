import re

path = 'd:/sgroup-erp/modules/exec/web/screens/SalesPlanScreen.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Add FunnelStep and DownArrow to the components section
components = """
function FunnelStep({ num, label, sub, value, unit, bg, numBg, numTone, labelTone, subTone, valTone, unitTone, border, barBg, barWidth, mx }: any) {
  return (
    <div className={elative flex items-center justify-between overflow-hidden rounded-[1.5rem] p-6 transition-all hover:scale-[1.01]   }>
      <div className="relative z-10 flex items-center gap-4">
        <div className={lex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black  }>
          {num}
        </div>
        <div>
          <div className={	ext-xs font-bold uppercase tracking-wider }>{label}</div>
          <div className={mt-1 text-[10px] font-semibold }>{sub}</div>
        </div>
      </div>
      <div className="relative z-10 text-right">
        <div className={	ext-3xl font-black }>{value}</div>
        <div className={	ext-[10px] font-bold uppercase }>{unit}</div>
      </div>
      <div className={bsolute bottom-0 left-0 h-1  } />
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
"""

# Insert components right before "function NumberField"
c = c.replace('function NumberField', components + '\nfunction NumberField')

# Make sure ChevronDown is imported
if 'ChevronDown' not in c:
    c = c.replace('Users, CalendarDays, BriefcaseBusiness, CheckCircle2', 'Users, CalendarDays, BriefcaseBusiness, CheckCircle2, ChevronDown')


# 2. Replace the FunnelRow block with the Pyramid
old_funnel_block = """            <div className="space-y-4">
              <FunnelRow label="KHQT" value={funnel.leads} unit="khách" width="100%" color="bg-slate-500" icon={Users} />
              <FunnelRow label="Hẹn gặp" value={funnel.meetings} unit="cuộc" width="86%" color="bg-indigo-500/80 backdrop-blur-sm" icon={CalendarDays} />
              <FunnelRow label="Giữ chỗ" value={funnel.bookings} unit="booking" width="72%" color="bg-purple-600" icon={BriefcaseBusiness} />
              <FunnelRow label="Giao dịch" value={funnel.deals} unit="GD" width="58%" color="bg-indigo-600" icon={CheckCircle2} strong />
            </div>"""

new_funnel_block = """            <div className="flex flex-col">
              <FunnelStep num="1" label="Khách hàng quan tâm" sub="Marketing & Sale tự kiếm" value={formatVN(funnel.leads)} unit="Khách hàng"
                bg="bg-slate-50/80 dark:bg-white/5 backdrop-blur-sm" numBg="bg-slate-200 dark:bg-slate-800" numTone="text-slate-500 dark:text-slate-400"
                labelTone="text-slate-600 dark:text-slate-300" subTone="text-slate-400 dark:text-slate-500"
                valTone="text-slate-700 dark:text-slate-200" unitTone="text-slate-400"
                border="border border-slate-200/50 dark:border-white/5" barBg="bg-slate-300 dark:bg-slate-700" barWidth="w-full" mx="" />
              
              <DownArrow />
              
              <FunnelStep num="2" label="Hẹn Gặp" sub="Tư vấn trực tiếp" value={formatVN(funnel.meetings)} unit="Cuộc hẹn"
                bg="bg-blue-50/80 dark:bg-blue-900/10 backdrop-blur-sm" numBg="bg-blue-100 dark:bg-blue-900/40" numTone="text-blue-600 dark:text-blue-400"
                labelTone="text-blue-600 dark:text-blue-400" subTone="text-blue-400 dark:text-blue-500"
                valTone="text-blue-700 dark:text-blue-300" unitTone="text-blue-400 dark:text-blue-500"
                border="border border-blue-100 dark:border-blue-900/30" barBg="bg-blue-200 dark:bg-blue-800" barWidth="w-[80%] rounded-r-full" mx="mx-4 md:mx-8" />
              
              <DownArrow />
              
              <FunnelStep num="3" label="Booking" sub="Giữ chỗ" value={formatVN(funnel.bookings)} unit="Lượt Book"
                bg="bg-indigo-50/80 dark:bg-indigo-900/10 backdrop-blur-sm" numBg="bg-indigo-100 dark:bg-indigo-900/40" numTone="text-indigo-600 dark:text-indigo-400"
                labelTone="text-indigo-600 dark:text-indigo-400" subTone="text-indigo-400 dark:text-indigo-500"
                valTone="text-indigo-700 dark:text-indigo-300" unitTone="text-indigo-400 dark:text-indigo-500"
                border="border border-indigo-100 dark:border-indigo-900/30" barBg="bg-indigo-200 dark:bg-indigo-800" barWidth="w-[60%] rounded-r-full" mx="mx-8 md:mx-16" />
              
              <DownArrow />
              
              <FunnelStep num="4" label="Giao Dịch" sub="Ký HĐMB thành công" value={formatVN(funnel.deals)} unit="Giao dịch"
                bg="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg shadow-indigo-500/20" numBg="bg-white/20" numTone="text-white"
                labelTone="text-white" subTone="text-purple-200"
                valTone="text-white" unitTone="text-purple-200"
                border="border-0" barBg="bg-white/30" barWidth="w-full" mx="mx-12 md:mx-24" />
            </div>"""

c = c.replace(old_funnel_block, new_funnel_block)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

