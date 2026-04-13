const fs = require('fs');
const execSync = require('child_process').execSync;

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
    
    // Fix struct fields
    content = content.replace(/EmployeeID\s+uint\s+\json:"employee_id"/g, 'EmployeeID string json:"employee_id"');
    content = content.replace(/ManagerID\s+\*uint\s+\json:"manager_id/g, 'ManagerID *string json:"manager_id');
    content = content.replace(/DepartmentID\s+uint\s+\json:"department_id/g, 'DepartmentID string json:"department_id');
    content = content.replace(/DepartmentID\s+\*uint\s+\json:"department_id/g, 'DepartmentID *string json:"department_id');
    content = content.replace(/TeamID\s+\*uint\s+\json:"team_id/g, 'TeamID *string json:"team_id');
    content = content.replace(/PositionID\s+\*uint\s+\json:"position_id/g, 'PositionID *string json:"position_id');
    content = content.replace(/BaseSalary\s+float64/g, 'BaseSalary float64'); // Noop, just testing struct regex
    content = content.replace(/EmployeeID uint/g, 'EmployeeID string');

    // Fix query param parsing
    content = content.replace(/empIDInt, _ := strconv\.Atoi\(empID\)\n\t\tempIDPtr := uint\(empIDInt\)\n\t\tempID = &empIDPtr/g, 'empIDVal := empID\n\t\tempID = &empIDVal');
    content = content.replace(/empID := \(\*uint\)\(nil\)/g, 'empID := (*string)(nil)');
    
    // Restore strconv import if we butchered it and it's still needed
    if (content.includes('strconv.') && !content.includes('"strconv"')) {
        content = content.replace(/import \(\n/g, 'import (\n\t"strconv"\n');
    }

    fs.writeFileSync(file, content);
});

// Run go fmt and goimports
try {
    execSync('cd "d:\\SGROUP ERP FULL\\modules\\hr\\api" && go build ./...', { encoding: 'utf-8', stdio: 'pipe' });
} catch (e) {
    console.log(e.stdout + e.stderr);
}
