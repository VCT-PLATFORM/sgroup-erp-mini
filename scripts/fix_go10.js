const fs = require('fs');

let t = fs.readFileSync('d:\\SGROUP ERP FULL\\modules\\hr\\api\\internal\\delivery\\http\\payroll_handler.go', 'utf8');
t = t.replace(/CycleStart\s+time\.Time.+\n\s+CycleEnd\s+time\.Time.+/g, 'CycleStart   string json:"cycle_start"\n\t\tCycleEnd     string json:"cycle_end"');
fs.writeFileSync('d:\\SGROUP ERP FULL\\modules\\hr\\api\\internal\\delivery\\http\\payroll_handler.go', t);

let o = fs.readFileSync('d:\\SGROUP ERP FULL\\modules\\hr\\api\\internal\\delivery\\http\\org_handler.go', 'utf8');
o = o.replace(/\t"strconv"\r?\n/g, '');
fs.writeFileSync('d:\\SGROUP ERP FULL\\modules\\hr\\api\\internal\\delivery\\http\\org_handler.go', o);

