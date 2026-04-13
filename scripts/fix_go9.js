const fs = require('fs');

let t = fs.readFileSync('d:\\SGROUP ERP FULL\\modules\\hr\\api\\internal\\delivery\\http\\payroll_handler.go', 'utf8');
t = t.replace(/AdminID\s+uint\s+\json:"admin_id"\/g, 'AdminID string json:"admin_id"');
fs.writeFileSync('d:\\SGROUP ERP FULL\\modules\\hr\\api\\internal\\delivery\\http\\payroll_handler.go', t);

let o = fs.readFileSync('d:\\SGROUP ERP FULL\\modules\\hr\\api\\internal\\delivery\\http\\org_handler.go', 'utf8');
o = o.replace(/id, err := strconv\.ParseUint\(c\.Param\("id"\), 10, 32\)\n\s+if err != nil \{\n\s+c\.JSON\(http\.StatusBadRequest, gin\.H\{"error": "Invalid ID"\}\)\n\s+return\n\s+\}/g, 'idStr := c.Param("id")');
fs.writeFileSync('d:\\SGROUP ERP FULL\\modules\\hr\\api\\internal\\delivery\\http\\org_handler.go', o);

