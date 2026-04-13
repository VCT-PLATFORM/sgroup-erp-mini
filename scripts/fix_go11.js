const fs = require('fs');

let r1 = fs.readFileSync('d:\\SGROUP ERP FULL\\modules\\hr\\api\\internal\\repository\\payroll_repo.go', 'utf8');
r1 = r1.replace(/runID uint/g, 'runID string');
fs.writeFileSync('d:\\SGROUP ERP FULL\\modules\\hr\\api\\internal\\repository\\payroll_repo.go', r1);

let u1 = fs.readFileSync('d:\\SGROUP ERP FULL\\modules\\hr\\api\\internal\\usecase\\payroll_engine_uc.go', 'utf8');
u1 = u1.replace(/runID uint/g, 'runID string');
fs.writeFileSync('d:\\SGROUP ERP FULL\\modules\\hr\\api\\internal\\usecase\\payroll_engine_uc.go', u1);

