import re

def fix_total_plan(path):
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()
    
    # Fix the footer button weight (black button -> indigo)
    c = c.replace('bg-slate-900 dark:bg-indigo-700 hover:bg-indigo-600 dark:hover:bg-indigo-500 text-white px-8 py-4', 'bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4')
    
    # Fix "Lợi nhuận ròng" box in footer (bg-emerald-50 -> glass)
    c = c.replace('bg-emerald-50 dark:bg-emerald-900/30 px-5 py-2 rounded-xl border border-emerald-100 dark:border-emerald-800', 'bg-emerald-500/10 px-5 py-2 rounded-xl border border-emerald-500/20')
    
    # Fix input fields alignment
    # The suffix in SGNumberInput was absolute right-2. Instead we can put it outside or adjust padding
    c = c.replace('pr-12"', 'pr-0"') # remove excessive padding
    
    # The Total Opex box (green/red)
    c = c.replace('bg-emerald-50 dark:bg-emerald-900/20 rounded-[1.5rem] border border-emerald-100 dark:border-emerald-800', 'bg-emerald-500/10 rounded-[1.5rem] border border-emerald-500/20')
    c = c.replace('bg-rose-50 dark:bg-rose-900/20 rounded-[1.5rem] border border-rose-100 dark:border-rose-800', 'bg-rose-500/10 rounded-[1.5rem] border border-rose-500/20')
    c = c.replace('bg-indigo-50 dark:bg-indigo-900/20 rounded-[1.5rem] border border-indigo-100 dark:border-indigo-800', 'bg-indigo-500/10 rounded-[1.5rem] border border-indigo-500/20')

    # Fix P&L box
    c = c.replace('bg-[#0f172a] rounded-[28px] shadow-2xl border border-slate-800 p-12 text-white', 'bg-white dark:bg-black/30 backdrop-blur-3xl rounded-[28px] shadow-sg-md border border-slate-200/80 dark:border-sg-border p-12')
    c = c.replace('text-slate-100', 'text-sg-heading')
    c = c.replace('text-white text-xl', 'text-sg-heading text-xl')
    c = c.replace('text-4xl text-white', 'text-4xl text-sg-heading')
    
    # Update SGNumberInput to fix % alignment issues
    # Instead of absolute suffix, we do it in parent
    c = c.replace('suffix={<span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-black text-indigo-300 dark:text-indigo-600">%</span>}', 'suffix={<span className="text-[10px] font-black text-indigo-400">%</span>}')
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)

def fix_sales_plan(path):
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()
    
    # Remove "biên nhân sự" block if it exists
    # Actually, check if there's any stray text
    
    # Fix the height mismatch in SalesPlanScreen (flex-col in the right side)
    # The funnel params vs the funnel steps
    c = c.replace('lg:col-span-8 flex flex-col justify-between py-4', 'lg:col-span-8 flex flex-col justify-start gap-4 py-4')
    
    # Fix colors for Marketing and Sales
    c = c.replace('bg-blue-600', 'bg-indigo-500/80 backdrop-blur-sm')
    c = c.replace('bg-orange-400', 'bg-emerald-500/80 backdrop-blur-sm')
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)

fix_total_plan('d:/sgroup-erp/modules/exec/web/screens/TotalPlanScreen.tsx')
fix_sales_plan('d:/sgroup-erp/modules/exec/web/screens/SalesPlanScreen.tsx')
print("Applied comprehensive UI fixes.")
