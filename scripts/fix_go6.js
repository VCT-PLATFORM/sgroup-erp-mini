const fs = require('fs');

const fixFile = (p) => {
    let t = fs.readFileSync(p, 'utf8');
    t = t.replace(/id, err := strconv\.Atoi\(c\.Param\("id"\)\)[\n\s]+if err != nil \{[\s\n]+c\.JSON\(http\.StatusBadRequest, gin\.H\{"error": "Invalid employee ID"\}\)[\s\n]+return[\n\s]+\}/g, 'idStr := c.Param("id")');
    t = t.replace(/id, err := strconv\.Atoi\(c\.Param\("id"\)\)[\n\s]+if err != nil \{[\s\n]+c\.JSON\(http\.StatusBadRequest, gin\.H\{"error": "Invalid ID"\}\)[\s\n]+return[\n\s]+\}/g, 'idStr := c.Param("id")');
    fs.writeFileSync(p, t);
};

fixFile('d:\\SGROUP ERP FULL\\modules\\hr\\api\\internal\\delivery\\http\\handler.go');
fixFile('d:\\SGROUP ERP FULL\\modules\\hr\\api\\internal\\delivery\\http\\org_handler.go');

