path = 'd:/sgroup-erp/modules/exec/web/screens/SalesPlanScreen.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('Users, CalendarDays, BriefcaseBusiness, CheckCircle2', 'Users, CalendarDays, BriefcaseBusiness, CheckCircle2, ChevronDown')

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print("ADDED CHEVRONDOWN")
