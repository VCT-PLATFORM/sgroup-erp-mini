import re

path = 'd:/sgroup-erp/modules/exec/web/screens/SalesPlanScreen.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Fix the main layout wrapper to match TotalPlanScreen
c = re.sub(
    r'<div className="min-h-\[calc\(100vh-84px\)\] bg-slate-50 px-4 py-5 dark:bg-slate-950 sm:px-6 lg:px-8">\s*<div className="mx-auto max-w-\[1500px\] space-y-5">',
    '<div className="relative min-h-[calc(100vh-84px)]">\n      <div className="pb-[100px] px-4 md:px-8 pt-6">\n        <div className="max-w-[1600px] mx-auto w-full space-y-10">',
    c
)

# 2. Fix the Header to match TotalPlanScreen header layout
old_header = r'''<header className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-\[11px\] font-black uppercase tracking-widest text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300">
                <Target size={14} />
                Sales Planning Control
              </div>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-sg-heading">Kế hoạch kinh doanh</h2>
              <p className="mt-1 text-sm font-semibold text-sg-muted">Chỉ tiêu CEO, phễu CCO, phân bổ tháng, team và nhân sự trong một màn hình điều hành\.</p>
            </div>'''

new_header = '''<div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
            <div>
              <h1 className="text-4xl font-extrabold text-sg-heading tracking-tight">Kế Hoạch Kinh Doanh</h1>
              <p className="text-base font-medium text-sg-muted mt-2">SGroup ERP — Planning CCO</p>
            </div>'''

c = re.sub(old_header, new_header, c)

# 3. Fix the top scenario buttons wrapper to match TotalPlanScreen
c = c.replace(
    '''<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900">''',
    '''<div className="flex items-center gap-4 bg-white dark:bg-black/30 backdrop-blur-3xl p-2 rounded-2xl shadow-sg-md border border-slate-200/80 dark:border-[var(--color-sg-border)]">
              <div className="flex bg-sg-card rounded-xl p-1">'''
)

c = re.sub(
    r'<button onClick=\{handleSave\} className="\[\^"\]*Save size=\{17\} />\s*Lưu nháp\s*</button>',
    '''<button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg ">
                <Save size={18} /> LƯU NHÁP
              </button>''',
    c
)

# 4. Remove the <div className="mt-5 grid ..."> that was inside the old header, we'll just put it below the header.
c = c.replace('</header>', '</div>') # The header closing tag since we removed <header>

# 5. Fix tabs container
c = c.replace(
    '''<nav className="flex gap-2 overflow-x-auto rounded-lg border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">''',
    '''<nav className="flex gap-4 overflow-x-auto bg-white dark:bg-black/30 backdrop-blur-3xl p-3 rounded-2xl shadow-sg-md border border-slate-200/80 dark:border-[var(--color-sg-border)] mb-10">'''
)

c = c.replace(
    '''''',
    ''''''
)

# 6. Global replacement for the boring panels into Glassmorphism panels
# Target: rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/70
# Wait, let's use regex to find all such panel wrappers
c = re.sub(
    r'rounded-lg border border-slate-200 bg-(white|slate-950) p-[456] text-white shadow-sm dark:border-slate-800',
    r'bg-white dark:bg-black/30 backdrop-blur-3xl rounded-[28px] shadow-sg-md border border-slate-200/80 dark:border-[var(--color-sg-border)] p-8',
    c
)
c = re.sub(
    r'rounded-lg border border-slate-200 bg-(white|slate-50|slate-950) p-[456] shadow-sm dark:border-slate-800( dark:bg-slate-950/70| dark:bg-slate-950/80)?',
    r'bg-white dark:bg-black/30 backdrop-blur-3xl rounded-[28px] shadow-sg-md border border-slate-200/80 dark:border-[var(--color-sg-border)] p-8',
    c
)

c = re.sub(
    r'overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/70',
    r'overflow-hidden bg-white dark:bg-black/30 backdrop-blur-3xl rounded-[28px] shadow-sg-md border border-slate-200/80 dark:border-[var(--color-sg-border)]',
    c
)

# 7. Update MetricTiles and sub-panels
# Target: rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50
c = re.sub(
    r'rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50',
    r'bg-slate-50/50 dark:bg-white/5 backdrop-blur-sm rounded-[20px] border border-slate-200/80 dark:border-[var(--color-sg-border)] p-6',
    c
)
# Target: rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/70
c = re.sub(
    r'rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/70',
    r'bg-white dark:bg-black/20 backdrop-blur-md rounded-[20px] shadow-sm border border-slate-200/80 dark:border-[var(--color-sg-border)] p-6',
    c
)


# 8. Fix closing divs from min-h
# We need to make sure the root div is closed properly.
c = c.replace(
    '  </div>\n    </div>\n  );\n}\n\nfunction SectionTitle',
    '  </div>\n      </div>\n    </div>\n  );\n}\n\nfunction SectionTitle'
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

