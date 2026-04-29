import re

def fix_sales_plan(path):
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()
    
    # Fix the main CEO panel which used to be dark but is now light glass
    # Target: text-white -> text-sg-heading in CEO section
    # Let's find DarkStat and rename to GlassStat
    c = c.replace('DarkStat', 'GlassStat')
    c = re.sub(r'text-white( shadow-sm dark:border-slate-800)', r'text-sg-heading\1', c)
    c = c.replace('text-white outline-none', 'text-sg-heading outline-none') # CEO input
    c = c.replace('text-slate-300', 'text-sg-muted') # CEO description
    c = c.replace('text-blue-200', 'text-indigo-600 dark:text-indigo-300') # CEO badge text
    
    # Fix GlassStat component definition
    old_glass_stat = r"function GlassStat\(\{ label, value, unit, tone = 'text-white' \}: \{ label: string; value: string; unit: string; tone\?: string \}\) \{(.*?)\}"
    new_glass_stat = r"""function GlassStat({ label, value, unit, tone = 'text-sg-heading' }: { label: string; value: string; unit: string; tone?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/40 dark:bg-black/20 backdrop-blur-md p-4">
      <div className="text-[10px] font-black uppercase tracking-widest text-sg-muted">{label}</div>
      <div className={mt-2 text-2xl font-black tabular-nums }>{value}</div>
      <div className="mt-1 text-[10px] font-bold uppercase tracking-wide text-sg-muted/70">{unit}</div>
    </div>
  );
}"""
    c = re.sub(old_glass_stat, new_glass_stat, c, flags=re.DOTALL)
    
    # Fix all standard bg-white dark:bg-black/30 backdrop-blur-3xl to bg-white/70
    c = c.replace('bg-white dark:bg-black/30 backdrop-blur-3xl rounded-[28px]', 'bg-white/70 dark:bg-black/30 backdrop-blur-3xl rounded-[32px]')
    c = c.replace('bg-white dark:bg-black/20 backdrop-blur-md', 'bg-white/50 dark:bg-black/20 backdrop-blur-md')
    
    # Fix the tabs (nav)
    c = c.replace('className={inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-black transition }', 
    'className={inline-flex shrink-0 items-center gap-2 rounded-xl px-5 py-3 text-sm font-black transition-all }')
    
    # Fix specific buttons like bg-slate-950
    c = c.replace('bg-slate-950 px-4 py-2 text-xs font-black uppercase tracking-wide text-white hover:bg-indigo-600', 'bg-indigo-600 px-5 py-2.5 text-xs font-black uppercase tracking-wide text-white hover:bg-indigo-700 shadow-md')
    c = c.replace('bg-slate-950 text-white', 'bg-slate-100 dark:bg-slate-900 text-sg-heading')
    c = c.replace('bg-slate-950 px-5 py-3 text-sm font-black uppercase tracking-wide text-white', 'bg-indigo-600 px-6 py-3 text-sm font-black tracking-wide text-white')
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)

def fix_total_plan(path):
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()
    
    # Fix bg-white backdrop-blur to bg-white/70
    c = c.replace('bg-white dark:bg-black/30 backdrop-blur-3xl rounded-[28px]', 'bg-white/70 dark:bg-black/30 backdrop-blur-3xl rounded-[32px]')
    c = c.replace('bg-white dark:bg-black/20 backdrop-blur-md', 'bg-white/50 dark:bg-black/20 backdrop-blur-md')
    
    # Fix bg-indigo-50 inputs to bg-indigo-500/10
    c = c.replace('bg-indigo-50 dark:bg-indigo-900/30 group-hover:bg-indigo-100', 'bg-indigo-500/10 dark:bg-indigo-500/20 group-hover:bg-indigo-500/20')
    
    # Fix Sticky Bar at bottom
    c = c.replace('bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/80', 'bg-white/80 dark:bg-black/60 backdrop-blur-2xl border-t border-slate-200/50')
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)

fix_sales_plan('d:/sgroup-erp/modules/exec/web/screens/SalesPlanScreen.tsx')
fix_total_plan('d:/sgroup-erp/modules/exec/web/screens/TotalPlanScreen.tsx')

print("Applied massive UI fixes based on audit.")
