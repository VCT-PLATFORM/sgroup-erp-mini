import re

path = 'd:/sgroup-erp/modules/exec/web/screens/SalesPlanScreen.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# Fix sub-components inside SalesPlanScreen to use glassmorphism
c = c.replace('className="block rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60"', 'className="block rounded-2xl border border-slate-200/80 bg-white/40 p-4 dark:border-white/10 dark:bg-black/20 backdrop-blur-md transition-all hover:bg-white/70 dark:hover:bg-black/40"')

c = c.replace('className="w-full bg-transparent text-right text-xl font-black text-sg-heading outline-none"', 'className="w-full bg-transparent text-right text-xl font-black text-indigo-600 dark:text-indigo-400 outline-none"')

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)
