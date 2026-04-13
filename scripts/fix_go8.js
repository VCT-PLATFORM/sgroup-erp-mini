const fs = require('fs');

let t1 = fs.readFileSync('d:\\SGROUP ERP FULL\\modules\\hr\\api\\internal\\delivery\\http\\handler.go', 'utf8');
t1 = t1.replace(/id, err := strconv\.ParseUint\(c\.Param\("id"\), 10, 32\)(?:.|\n|\r)+?return\n\t\}/g, 'idStr := c.Param("id")');
fs.writeFileSync('d:\\SGROUP ERP FULL\\modules\\hr\\api\\internal\\delivery\\http\\handler.go', t1);

let t2 = fs.readFileSync('d:\\SGROUP ERP FULL\\modules\\hr\\api\\internal\\delivery\\http\\org_handler.go', 'utf8');
t2 = t2.replace(/id, err := strconv\.ParseUint\(c\.Param\("id"\), 10, 32\)(?:.|\n|\r)+?return\n\t\}/g, 'idStr := c.Param("id")');
t2 = t2.replace(/if di, err := strconv\.ParseUint\(d, 10, 32\); err == nil \{\n\t\t\tid := uint\(di\)\n\t\t\tdeptID = &id\n\t\t\}/g, 'deptID = &d');
fs.writeFileSync('d:\\SGROUP ERP FULL\\modules\\hr\\api\\internal\\delivery\\http\\org_handler.go', t2);

let t3 = fs.readFileSync('d:\\SGROUP ERP FULL\\modules\\hr\\api\\internal\\delivery\\http\\payroll_handler.go', 'utf8');
t3 = t3.replace(/AdminID\s+uint\s+\json:"admin_id"\/g, 'AdminID string json:"admin_id"');
fs.writeFileSync('d:\\SGROUP ERP FULL\\modules\\hr\\api\\internal\\delivery\\http\\payroll_handler.go', t3);

