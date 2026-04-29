import re

path = 'd:/sgroup-erp/modules/exec/web/screens/SalesPlanScreen.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix layout wrapper
content = content.replace('className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 relative"', 'className="relative min-h-[calc(100vh-84px)] p-6 lg:p-8 space-y-6"')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
