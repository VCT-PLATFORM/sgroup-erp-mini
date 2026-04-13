const fs = require('fs');
const execSync = require('child_process').execSync;

function fixFiles() {
    let output = '';
    try {
        output = execSync('cd "d:\\SGROUP ERP FULL\\modules\\hr\\api" && go build ./...', { encoding: 'utf-8', stdio: 'pipe' });
    } catch (e) {
        output = e.stdout + '\n' + e.stderr;
    }

    if (!output.includes('cannot use')) {
        console.log('No more type errors!');
        return;
    }

    // Run custom regexes for known patterns inside ALL go files in the directory
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

    const files = walk(path.join(__dirname, '../modules/hr/api/internal'));
    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        
        // Fix employeeID *uint to *string
        content = content.replace(/employeeID \*uint/g, 'employeeID *string');
        content = content.replace(/employeeIDs \[\]uint/g, 'employeeIDs []string');
        content = content.replace(/uint\(empID\)/g, 'empID');
        content = content.replace(/approverID \*uint/g, 'approverID *string');
        content = content.replace(/approverID uint/g, 'approverID string');
        content = content.replace(/deptID \*uint/g, 'deptID *string');
        content = content.replace(/adminID uint/g, 'adminID string');
        content = content.replace(/uint(adminID)/g, 'string(adminID)');
        content = content.replace(/\[\]uint\{c.EmployeeID\}/g, '[]string{c.EmployeeID}');
        content = content.replace(/make\(map\[uint\]/g, 'make(map[string]');
        content = content.replace(/departmentID \*uint/gi, 'departmentID *string');
        content = content.replace(/teamID \*uint/gi, 'teamID *string');
        content = content.replace(/\*employeeID > 0/g, '*employeeID != ""');
        
        // Bulk Upload parseInt fixes
        content = content.replace(/empID, _ := strconv\.ParseUint\(row\[0\], 10, 32\)/g, 'empID := row[0]');
        
        // Remove strconv imports if they cause unused errors
        // We will just let goimports clear them!

        fs.writeFileSync(file, content);
    });

    try {
        execSync('cd "d:\\SGROUP ERP FULL\\modules\\hr\\api" && go build ./...', { encoding: 'utf-8', stdio: 'pipe' });
        console.log('Build successful after phase 2');
    } catch (e) {
        console.log('Still errors: ', e.stdout + '\n' + e.stderr);
    }
}

fixFiles();
