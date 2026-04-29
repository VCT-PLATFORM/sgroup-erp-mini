import re

def fix_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix opacity modifiers on sg variables which do not support it
    content = re.sub(r'bg-sg-card/\d+', 'bg-white/50 dark:bg-black/20', content)
    content = re.sub(r'bg-sg-btn-bg/\d+', 'bg-slate-100 dark:bg-white/5', content)
    content = re.sub(r'border-sg-border/\d+', 'border-slate-200 dark:border-white/10', content)
    
    # Clean up redundant dark classes that I added by mistake
    content = re.sub(r'dark:text-sg-heading', '', content)
    content = re.sub(r'dark:text-sg-muted', '', content)
    content = re.sub(r'dark:border-sg-border', 'dark:border-[var(--color-sg-border)]', content)
    
    # In SalesPlanScreen, there might be 'bg-sg-card/50', replace with proper glass
    content = content.replace('bg-sg-card/50', 'bg-white/40 dark:bg-black/40 backdrop-blur-md')
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_file('d:/sgroup-erp/modules/exec/web/screens/TotalPlanScreen.tsx')
fix_file('d:/sgroup-erp/modules/exec/web/screens/SalesPlanScreen.tsx')
print("Fixed files.")
