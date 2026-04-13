const fs = require('fs');
const problems = [
  {"path":"d:\\SGROUP ERP FULL\\core\\api-gateway\\go.mod","message":"packages.Load error: err: exit status 1: stderr: go: go.work requires go >= 1.26.2 (running go 1.26.1)","startLine":1},
  {"path":"d:\\SGROUP ERP FULL\\modules\\accounting\\api\\go.mod","message":"packages.Load error: err: exit status 1: stderr: go: go.work requires go >= 1.26.2 (running go 1.26.1)","startLine":1},
  {"path":"d:\\SGROUP ERP FULL\\modules\\crm\\api\\go.mod","message":"packages.Load error: err: exit status 1: stderr: go: go.work requires go >= 1.26.2 (running go 1.26.1)","startLine":1},
  {"path":"d:\\SGROUP ERP FULL\\modules\\hr\\api\\go.mod","message":"packages.Load error: err: exit status 1: stderr: go: go.work requires go >= 1.26.2 (running go 1.26.1)","startLine":1},
  {"path":"d:\\SGROUP ERP FULL\\modules\\project\\api\\go.mod","message":"packages.Load error: err: exit status 1: stderr: go: go.work requires go >= 1.26.2 (running go 1.26.1)","startLine":1},
  {"path":"d:\\SGROUP ERP FULL\\modules\\sales\\api\\go.mod","message":"packages.Load error: err: exit status 1: stderr: go: go.work requires go >= 1.26.2 (running go 1.26.1)","startLine":1},
  {"path":"d:\\SGROUP ERP FULL\\packages\\go-common\\go.mod","message":"packages.Load error: err: exit status 1: stderr: go: go.work requires go >= 1.26.2 (running go 1.26.1)","startLine":1},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\components\\ui\\SGConfirmDialog.tsx","message":"The class `z-[99998]` can be written as `z-99998`","startLine":51},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\components\\ui\\SGConfirmDialog.tsx","message":"The class `rounded-[24px]` can be written as `rounded-sg-xl`","startLine":56},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\components\\ui\\SGSkeleton.tsx","message":"The class `rounded-[24px]` can be written as `rounded-sg-xl`","startLine":48},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\components\\ui\\SGSkeleton.tsx","message":"The class `dark:bg-white/[0.06]` can be written as `dark:bg-white/6`","startLine":50},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\components\\ui\\SGSkeleton.tsx","message":"The class `dark:bg-white/[0.06]` can be written as `dark:bg-white/6`","startLine":51},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\components\\ui\\SGSkeleton.tsx","message":"The class `dark:bg-white/[0.06]` can be written as `dark:bg-white/6`","startLine":53},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\components\\ui\\SGSkeleton.tsx","message":"The class `dark:bg-white/[0.06]` can be written as `dark:bg-white/6`","startLine":64},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\components\\ui\\SGSkeleton.tsx","message":"The class `rounded-[24px]` can be written as `rounded-sg-xl`","startLine":74},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\components\\ui\\SGSkeleton.tsx","message":"The class `dark:bg-white/[0.06]` can be written as `dark:bg-white/6`","startLine":76},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\components\\ui\\SGSkeleton.tsx","message":"The class `dark:bg-white/[0.06]` can be written as `dark:bg-white/6`","startLine":78},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\components\\ui\\SGSkeleton.tsx","message":"The class `dark:bg-white/[0.06]` can be written as `dark:bg-white/6`","startLine":79},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\components\\ui\\SGSkeleton.tsx","message":"The class `dark:bg-white/[0.06]` can be written as `dark:bg-white/6`","startLine":84},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\components\\ui\\SGSkeleton.tsx","message":"The class `dark:bg-white/[0.06]` can be written as `dark:bg-white/6`","startLine":85},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\components\\ui\\SGSkeleton.tsx","message":"The class `dark:bg-white/[0.06]` can be written as `dark:bg-white/6`","startLine":96},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\components\\ui\\SGSkeleton.tsx","message":"The class `dark:bg-white/[0.06]` can be written as `dark:bg-white/6`","startLine":97},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\components\\ui\\SGSkeleton.tsx","message":"The class `dark:bg-white/[0.06]` can be written as `dark:bg-white/6`","startLine":103},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\components\\ui\\SGSkeleton.tsx","message":"The class `dark:bg-white/[0.06]` can be written as `dark:bg-white/6`","startLine":104},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\components\\ui\\SGSkeleton.tsx","message":"The class `dark:bg-white/[0.06]` can be written as `dark:bg-white/6`","startLine":106},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\components\\ui\\SGToast.tsx","message":"The class `z-[99999]` can be written as `z-99999`","startLine":63},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\components\\EmployeeCard.tsx","message":"The class `bg-gradient-to-r` can be written as `bg-linear-to-r`","startLine":37},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\components\\EmployeeCard.tsx","message":"The class `flex-shrink-0` can be written as `shrink-0`","startLine":42},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\components\\EmployeeCard.tsx","message":"'items-center' applies the same CSS properties as 'items-center'.","startLine":66},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\components\\EmployeeCard.tsx","message":"'items-center' applies the same CSS properties as 'items-center'.","startLine":67},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\components\\EmployeeCard.tsx","message":"The class `flex-shrink-0` can be written as `shrink-0`","startLine":82},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\components\\EmployeeCard.tsx","message":"The class `flex-shrink-0` can be written as `shrink-0`","startLine":86},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\components\\EmployeeFormModal.tsx","message":"'flex' applies the same CSS properties as 'block'.","startLine":198},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\components\\EmployeeFormModal.tsx","message":"'block' applies the same CSS properties as 'flex'.","startLine":198},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\components\\EmployeeListView.tsx","message":"The class `rounded-[24px]` can be written as `rounded-sg-xl`","startLine":14},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\HRShell.tsx","message":"The class `flex-shrink-0` can be written as `shrink-0`","startLine":132},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\HRShell.tsx","message":"The class `bg-gradient-to-br` can be written as `bg-linear-to-br`","startLine":185},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\HRShell.tsx","message":"The class `z-[9999]` can be written as `z-9999`","startLine":208},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\HRShell.tsx","message":"The class `flex-shrink-0` can be written as `shrink-0`","startLine":212},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\HRShell.tsx","message":"The class `z-[10000]` can be written as `z-10000`","startLine":246},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\HRShell.tsx","message":"The class `bg-gradient-to-br` can be written as `bg-linear-to-br`","startLine":248},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\HRShell.tsx","message":"The class `rounded-[32px]` can be written as `rounded-sg-2xl`","startLine":316},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\HRShell.tsx","message":"The class `z-[10000]` can be written as `z-10000`","startLine":316},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\HRShell.tsx","message":"The class `bg-gradient-to-br` can be written as `bg-linear-to-br`","startLine":318},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\screens\\HRDashboard.tsx","message":"The class `bg-gradient-to-br` can be written as `bg-linear-to-br`","startLine":50},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\screens\\HRDashboard.tsx","message":"The class `flex-shrink-0` can be written as `shrink-0`","startLine":140},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\screens\\HRDashboard.tsx","message":"The class `dark:bg-white/[0.02]` can be written as `dark:bg-white/2`","startLine":150},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\screens\\HRDashboard.tsx","message":"The class `flex-shrink-0` can be written as `shrink-0`","startLine":193},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\screens\\LeavesScreen.tsx","message":"The class `rounded-[32px]` can be written as `rounded-sg-2xl`","startLine":85},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\screens\\LeavesScreen.tsx","message":"The class `bg-gradient-to-br` can be written as `bg-linear-to-br`","startLine":90},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\screens\\LeavesScreen.tsx","message":"The class `rounded-[24px]` can be written as `rounded-sg-xl`","startLine":222},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\screens\\OrgConfigScreen.tsx","message":"The class `bg-gradient-to-br` can be written as `bg-linear-to-br`","startLine":146},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\screens\\OrgConfigScreen.tsx","message":"The class `bg-gradient-to-br` can be written as `bg-linear-to-br`","startLine":201},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\screens\\OrgConfigScreen.tsx","message":"The class `bg-gradient-to-br` can be written as `bg-linear-to-br`","startLine":303},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\screens\\OrgConfigScreen.tsx","message":"The class `rounded-[24px]` can be written as `rounded-sg-xl`","startLine":327},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\screens\\OrgConfigScreen.tsx","message":"The class `bg-gradient-to-r` can be written as `bg-linear-to-r`","startLine":328},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\screens\\OrgConfigScreen.tsx","message":"The class `bg-gradient-to-b` can be written as `bg-linear-to-b`","startLine":329},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\screens\\OrgConfigScreen.tsx","message":"The class `-left-[1px]` can be written as `-left-px`","startLine":352},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\screens\\PayrollScreen.tsx","message":"The class `bg-gradient-to-br` can be written as `bg-linear-to-br`","startLine":80},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\screens\\PayrollScreen.tsx","message":"The class `rounded-[32px]` can be written as `rounded-sg-2xl`","startLine":138},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\screens\\PayrollScreen.tsx","message":"The class `bg-gradient-to-br` can be written as `bg-linear-to-br`","startLine":155},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\screens\\PayrollScreen.tsx","message":"The class `bg-gradient-to-br` can be written as `bg-linear-to-br`","startLine":159},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\screens\\PayrollScreen.tsx","message":"The class `bg-gradient-to-t` can be written as `bg-linear-to-t`","startLine":189},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\screens\\PayrollScreen.tsx","message":"The class `bg-gradient-to-t` can be written as `bg-linear-to-t`","startLine":190},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\screens\\PayrollScreen.tsx","message":"The class `rounded-[8px]` can be written as `rounded-sg-sm`","startLine":287},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\screens\\PayrollScreen.tsx","message":"The class `rounded-[8px]` can be written as `rounded-sg-sm`","startLine":326},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\screens\\StaffDirectoryScreen.tsx","message":"The class `rounded-[16px]` can be written as `rounded-sg-lg`","startLine":148},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\screens\\TimekeepingScreen.tsx","message":"The class `rounded-[24px]` can be written as `rounded-sg-xl`","startLine":119},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\hr\\screens\\TimekeepingScreen.tsx","message":"The class `rounded-[24px]` can be written as `rounded-sg-xl`","startLine":344},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\components\\hub\\ProjectDetails.tsx","message":"The class `rounded-[32px]` can be written as `rounded-sg-2xl`","startLine":11},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\components\\hub\\ProjectHero.tsx","message":"The class `bg-gradient-to-br` can be written as `bg-linear-to-br`","startLine":17},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\components\\hub\\ProjectHero.tsx","message":"The class `bg-gradient-to-t` can be written as `bg-linear-to-t`","startLine":19},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\components\\hub\\ProjectHero.tsx","message":"The class `rounded-[32px]` can be written as `rounded-sg-2xl`","startLine":23},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\components\\hub\\ProjectHero.tsx","message":"The class `bg-gradient-to-br` can be written as `bg-linear-to-br`","startLine":24},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\components\\hub\\ProjectHero.tsx","message":"The class `bg-gradient-to-r` can be written as `bg-linear-to-r`","startLine":50},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\components\\hub\\ProjectManager.tsx","message":"The class `rounded-[32px]` can be written as `rounded-sg-2xl`","startLine":21},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\components\\hub\\ProjectManager.tsx","message":"The class `bg-gradient-to-br` can be written as `bg-linear-to-br`","startLine":28},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\components\\hub\\ProjectManager.tsx","message":"The class `bg-gradient-to-br` can be written as `bg-linear-to-br`","startLine":40},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\components\\hub\\ProjectManager.tsx","message":"The class `rounded-[32px]` can be written as `rounded-sg-2xl`","startLine":52},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\components\\hub\\ProjectStats.tsx","message":"The class `rounded-[24px]` can be written as `rounded-sg-xl`","startLine":23},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\components\\ProjectFormModal.tsx","message":"The class `z-[100]` can be written as `z-100`","startLine":74},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\components\\ProjectFormModal.tsx","message":"The class `rounded-[32px]` can be written as `rounded-sg-2xl`","startLine":79},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\components\\ProjectFormModal.tsx","message":"The class `rounded-[16px]` can be written as `rounded-sg-lg`","startLine":83},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\components\\ProjectFormModal.tsx","message":"The class `bg-gradient-to-br` can be written as `bg-linear-to-br`","startLine":83},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\components\\ProjectFormModal.tsx","message":"The class `bg-gradient-to-r` can be written as `bg-linear-to-r`","startLine":239},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\ProjectShell.tsx","message":"The class `bg-gradient-to-r` can be written as `bg-linear-to-r`","startLine":19},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\ProjectShell.tsx","message":"The class `bg-gradient-to-br` can be written as `bg-linear-to-br`","startLine":20},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\ProjectShell.tsx","message":"The class `rounded-[24px]` can be written as `rounded-sg-xl`","startLine":21},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\ProjectShell.tsx","message":"The class `bg-gradient-to-b` can be written as `bg-linear-to-b`","startLine":56},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\ProjectShell.tsx","message":"The class `rounded-[16px]` can be written as `rounded-sg-lg`","startLine":78},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\ProjectShell.tsx","message":"The class `bg-gradient-to-br` can be written as `bg-linear-to-br`","startLine":78},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\ProjectShell.tsx","message":"The class `bg-gradient-to-r` can be written as `bg-linear-to-r`","startLine":92},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\ProjectShell.tsx","message":"The class `bg-gradient-to-br` can be written as `bg-linear-to-br`","startLine":122},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\ProjectShell.tsx","message":"The class `bg-gradient-to-br` can be written as `bg-linear-to-br`","startLine":124},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\screens\\InventoryGrid.tsx","message":"The class `bg-gradient-to-r` can be written as `bg-linear-to-r`","startLine":57},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\screens\\InventoryGrid.tsx","message":"The class `rounded-[24px]` can be written as `rounded-sg-xl`","startLine":123},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\screens\\InventoryGrid.tsx","message":"The class `bg-gradient-to-br` can be written as `bg-linear-to-br`","startLine":124},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\screens\\LegalKanbanScreen.tsx","message":"The class `bg-gradient-to-r` can be written as `bg-linear-to-r`","startLine":71},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\screens\\LegalKanbanScreen.tsx","message":"The class `bg-gradient-to-r` can be written as `bg-linear-to-r`","startLine":82},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\screens\\LegalKanbanScreen.tsx","message":"The class `rounded-[32px]` can be written as `rounded-sg-2xl`","startLine":104},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\screens\\LegalKanbanScreen.tsx","message":"The class `rounded-[24px]` can be written as `rounded-sg-xl`","startLine":129},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\screens\\LegalKanbanScreen.tsx","message":"The class `bg-gradient-to-br` can be written as `bg-linear-to-br`","startLine":147},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\screens\\ProjectDashboardScreen.tsx","message":"The class `backdrop-blur-[24px]` can be written as `backdrop-blur-xl`","startLine":11},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\screens\\ProjectDashboardScreen.tsx","message":"The class `rounded-[32px]` can be written as `rounded-sg-2xl`","startLine":11},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\screens\\ProjectDashboardScreen.tsx","message":"The class `blur-[40px]` can be written as `blur-2xl`","startLine":12},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\screens\\ProjectDashboardScreen.tsx","message":"The class `bg-gradient-to-r` can be written as `bg-linear-to-r`","startLine":15},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\screens\\ProjectDashboardScreen.tsx","message":"The class `rounded-[32px]` can be written as `rounded-sg-2xl`","startLine":112},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\screens\\ProjectDashboardScreen.tsx","message":"The class `rounded-[32px]` can be written as `rounded-sg-2xl`","startLine":137},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\screens\\ProjectDashboardScreen.tsx","message":"The class `bg-gradient-to-r` can be written as `bg-linear-to-r`","startLine":149},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\screens\\ProjectDashboardScreen.tsx","message":"The class `via-cyan-500/[0.02]` can be written as `via-cyan-500/2`","startLine":149},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\screens\\ProjectDashboardScreen.tsx","message":"The class `translate-x-[-100%]\` can be written as \`-translate-x-full`","startLine":149},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\screens\\ProjectDashboardScreen.tsx","message":"The class `group-hover:translate-x-[100%]\` can be written as `group-hover:translate-x-full`","startLine":149},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\screens\\ProjectDashboardScreen.tsx","message":"'flex' applies the same CSS properties as 'hidden'.","startLine":158},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\screens\\ProjectDashboardScreen.tsx","message":"'hidden' applies the same CSS properties as 'flex'.","startLine":158},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\screens\\ProjectDashboardScreen.tsx","message":"The class `rounded-[24px]` can be written as `rounded-sg-xl`","startLine":184},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\screens\\ProjectDashboardScreen.tsx","message":"The class `border-l-[4px]` can be written as `border-l-4`","startLine":194},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\screens\\ProjectDashboardScreen.tsx","message":"The class `blur-[24px]` can be written as `blur-xl`","startLine":195},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\screens\\ProjectDashboardScreen.tsx","message":"The class `rounded-[8px]` can be written as `rounded-sg-sm`","startLine":199},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\screens\\ProjectDashboardScreen.tsx","message":"The class `bg-gradient-to-br` can be written as `bg-linear-to-br`","startLine":208},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\screens\\ProjectListScreen.tsx","message":"The class `bg-gradient-to-r` can be written as `bg-linear-to-r`","startLine":55},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\screens\\ProjectListScreen.tsx","message":"The class `bg-gradient-to-r` can be written as `bg-linear-to-r`","startLine":84},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\screens\\ProjectListScreen.tsx","message":"The class `rounded-[32px]` can be written as `rounded-sg-2xl`","startLine":96},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\screens\\ProjectListScreen.tsx","message":"The class `bg-gradient-to-r` can be written as `bg-linear-to-r`","startLine":104},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\screens\\ProjectListScreen.tsx","message":"The class `rounded-[32px]` can be written as `rounded-sg-2xl`","startLine":122},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\screens\\ProjectListScreen.tsx","message":"The class `bg-gradient-to-r` can be written as `bg-linear-to-r`","startLine":125},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\screens\\ProjectListScreen.tsx","message":"The class `bg-gradient-to-r` can be written as `bg-linear-to-r`","startLine":186},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\screens\\ProjectListScreen.tsx","message":"The class `bg-gradient-to-br` can be written as `bg-linear-to-br`","startLine":196},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\screens\\ReportsScreen.tsx","message":"The class `rounded-[32px]` can be written as `rounded-sg-2xl`","startLine":42},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\screens\\ReportsScreen.tsx","message":"The class `rounded-[32px]` can be written as `rounded-sg-2xl`","startLine":77},
  {"path":"d:\\SGROUP ERP FULL\\core\\web-host\\src\\features\\project\\screens\\ReportsScreen.tsx","message":"The class `bg-gradient-to-r` can be written as `bg-linear-to-r`","startLine":114}
];

const changes = {};

problems.forEach(p => {
  if (p.message.includes('can be written as')) {
    const regex = /The class \`([^\`]+)\` can be written as \`([^\`]+)\`/;
    const match = p.message.match(regex);
    if (match) {
      if (!changes[p.path]) changes[p.path] = [];
      changes[p.path].push({ from: match[1], to: match[2], line: p.startLine });
    }
  } else if (p.message.includes('applies the same CSS properties')) {
    const regex = /'([^']+)' applies the same CSS properties as '([^']+)'/;
    const match = p.message.match(regex);
    if (match) {
        if (!changes[p.path]) changes[p.path] = [];
        changes[p.path].push({ from: match[1], to: match[1] === match[2] ? '' : match[2], isDup: true, line: p.startLine });
    }
  }
});

for (const [path, reps] of Object.entries(changes)) {
  if (fs.existsSync(path)) {
    let lines = fs.readFileSync(path, 'utf8').split('\n');
    reps.forEach(rep => {
      let lIdx = rep.line - 1;
      if (lIdx >= 0 && lIdx < lines.length) {
         if (rep.isDup) {
            if (rep.from === '') {
                 // skip
            } else if (lines[lIdx].includes(rep.from)) {
               // For duplicates like "items-center items-center" -> "items-center"
               // We can just simple replace standard duplicates
               // e.g. from="items-center" to="" -> wait if we remove it, we might remove the only instance.
               // Let's replace "items-center items-center" with "items-center" just in case it's a direct duplicate
               lines[lIdx] = lines[lIdx].replace(new RegExp(`\\\\b${rep.from}\\\\s+${rep.from}\\\\b`, 'g'), rep.from);
               // Also for 'block' and 'flex', replace 'flex block' with 'block' or whatever the newer precedence is.
               // Let's just remove the first or second. Actually not critically breaking so we will just try replacing class combinations.
               if (rep.from === 'block' && rep.to === '') {
                   lines[lIdx] = lines[lIdx].replace('block flex', 'flex').replace('flex block', 'flex');
               }
               if (rep.from === 'items-center' && rep.to === '') {
                   lines[lIdx] = lines[lIdx].replace('items-center items-center', 'items-center');
               }
            }
         } else {
             // Avoid double escaping \\b since this is not in a string literal anymore... Oh wait, it IS a string literal inside regex constructor.
             // Just use String.replace for simplicity, the lines are unique enough.
             lines[lIdx] = lines[lIdx].replace(rep.from, rep.to);
             // handle second occurrence on same line
             lines[lIdx] = lines[lIdx].replace(rep.from, rep.to);
         }
      }
    });
    fs.writeFileSync(path, lines.join('\n'));
    console.log(`Updated ${path}`);
  }
}
