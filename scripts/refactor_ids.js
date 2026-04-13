const fs = require('fs');
const path = require('path');

const walk = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.go')) {
            results.push(file);
        }
    });
    return results;
};

const domainDir = path.join(__dirname, '../modules/hr/api/internal/domain');
const repoDir = path.join(__dirname, '../modules/hr/api/internal/repository');
const usecaseDir = path.join(__dirname, '../modules/hr/api/internal/usecase');
const httpDir = path.join(__dirname, '../modules/hr/api/internal/delivery/http');

function processDomain(files) {
    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        content = content.replace(/\*uint/g, '*string');
        content = content.replace(/ uint\b/g, ' string');
        content = content.replace(/\tuint\b/g, '\tstring');
        fs.writeFileSync(file, content);
    });
}

function processInterfaces(files) {
    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        content = content.replace(/id uint/g, 'id string');
        content = content.replace(/departmentID \*uint/g, 'departmentID *string');
        content = content.replace(/employeeID uint/g, 'employeeID string');
        content = content.replace(/leaderID uint/g, 'leaderID string');
        content = content.replace(/managerID uint/g, 'managerID string');
        fs.writeFileSync(file, content);
    });
}

function processHttp(files) {
    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        // Replace: id, err := strconv.Atoi(c.Param("id"))\n if err != nil { ... }
        // With: id := c.Param("id")\n if id == "" { ... }
        content = content.replace(/id, err := strconv\.Atoi\(c\.Param\("id"\)\)[\n\t\s]*if err != nil \{[\n\t\s]*c\.JSON\(http\.StatusBadRequest, gin\.H\{"error": "Invalid [^"]+"\}\)[\n\t\s]*return[\n\t\s]*\}/g, 
            'id := c.Param("id")\n\tif id == "" {\n\t\tc.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})\n\t\treturn\n\t}');
        // Special case for other Atoi
        content = content.replace(/employeeID, err := strconv\.Atoi\(c\.Param\("employee_id"\)\)[\n\t\s]*if err != nil \{[\n\t\s]*c\.JSON\(http\.StatusBadRequest[^\}]+\} /g, 
            'employeeID := c.Param("employee_id")\n\tif employeeID == "" {\n\t\tc.JSON(http.StatusBadRequest, gin.H{"error": "Invalid employee ID"})\n\t\treturn\n\t} ');
            
        // Fix import strconv if no longer needed
        content = content.replace(/\"strconv\"/g, '');
        fs.writeFileSync(file, content);
    });
}

processDomain(walk(domainDir));
processInterfaces(walk(repoDir));
processInterfaces(walk(usecaseDir));
processHttp(walk(httpDir));
console.log('Refactoring complete.');
