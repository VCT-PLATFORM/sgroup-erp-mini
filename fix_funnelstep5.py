path = 'd:/sgroup-erp/modules/exec/web/screens/SalesPlanScreen.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

new_funnel_step = '''function FunnelStep({ num, label, sub, value, unit, bg, numBg, numTone, labelTone, subTone, valTone, unitTone, border, barBg, barWidth, mx }: any) {
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
}'''

# Split before the first occurrence of "function FunnelStep"
# Then find the first occurrence of "function NumberField" after that
part1 = c.split('function FunnelStep')[0]
part2 = c[c.find('function NumberField'):]

c = part1 + new_funnel_step + '\n\n' + part2

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print("CLEANED UP COMPLETELY")
