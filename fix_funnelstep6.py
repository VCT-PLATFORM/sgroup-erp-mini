import re

path = 'd:/sgroup-erp/modules/exec/web/screens/SalesPlanScreen.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

new_funnel_step = """function FunnelStep({ num, label, sub, value, unit, bg, numBg, numTone, labelTone, subTone, valTone, unitTone, border, barBg, barWidth, mx }: any) {
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
}"""

# Split before the first occurrence of "function FunnelStep"
# Then find the first occurrence of "function NumberField" after that
part1 = c.split('function FunnelStep')[0]
part2 = c[c.find('function NumberField'):]

c = part1 + new_funnel_step + '\n\n' + part2

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print("CLEANED UP COMPLETELY WITHOUT POWERSHELL CORRUPTION!")
