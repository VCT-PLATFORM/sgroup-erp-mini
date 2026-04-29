import re

path = 'd:/sgroup-erp/modules/exec/web/screens/SalesPlanScreen.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# Replace the mangled FunnelStep function
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
}'''

# Find the mangled block using regex. It starts with "function FunnelStep" and ends with "}\n\nfunction DownArrow"
pattern = re.compile(r'function FunnelStep\(\{.*?\}\n\nfunction DownArrow', re.DOTALL)
c = pattern.sub(new_funnel_step + '\n\nfunction DownArrow', c)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

