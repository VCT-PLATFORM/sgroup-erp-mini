const fs = require('fs');

const f1 = 'd:\\SGROUP ERP FULL\\modules\\hr\\api\\internal\\delivery\\http\\handler.go';
let t1 = fs.readFileSync(f1, 'utf8');
t1 = t1.replace(/id, err := strconv\.ParseUint\(c\.Param\("id"\), 10, 32\)\n\s+if err != nil \{\n\s+c\.JSON\(http\.StatusBadRequest, gin\.H\{"error": "Invalid employee ID"\}\)\n\s+return\n\s+\}/g, 'idStr := c.Param("id")');
fs.writeFileSync(f1, t1);

const f2 = 'd:\\SGROUP ERP FULL\\modules\\hr\\api\\internal\\delivery\\http\\org_handler.go';
let t2 = fs.readFileSync(f2, 'utf8');
t2 = t2.replace(/id, err := strconv\.ParseUint\(c\.Param\("id"\), 10, 32\)\n\s+if err != nil \{\n\s+c\.JSON\(http\.StatusBadRequest, gin\.H\{"error": "Invalid ID"\}\)\n\s+return\n\s+\}/g, 'idStr := c.Param("id")');
fs.writeFileSync(f2, t2);

