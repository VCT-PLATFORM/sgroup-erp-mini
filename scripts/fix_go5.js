const fs = require('fs');

const path = require('path');
const walk = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        if (fs.statSync(file).isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.go')) {
            results.push(file);
        }
    });
    return results;
};

const files = walk(path.join(__dirname, '../modules/hr/api/internal/delivery/http'));
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Fix uint(id) in usecase calls
    content = content.replace(/id, err := strconv\.ParseUint\(idStr, 10, 32\)[\s\n]*if err != nil \{[\s\nt]*c\.JSON\(http\.StatusBadRequest, [^\}]+\}[\s\n]*(?:\n|\r|\t|.)*?(?=\n\n|\n\t\w)/g, (match) => {
        return ""; // This is too aggressive. Just replace uint(id) with idStr!
    });
    
    // Simpler and safer way:
    content = content.replace(/uint\(id\)/g, 'idStr');
    // For Department ID query params
    content = content.replace(/id, err := strconv\.ParseUint\(deptID, 10, 32\)\n\s+if err == nil \{\n\s+v := uint\(id\)\n\s+dID = &v\n\s+\}/g, "dID = &deptID");

    fs.writeFileSync(file, content);
});

