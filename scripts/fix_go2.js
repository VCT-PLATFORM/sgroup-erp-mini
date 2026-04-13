const fs = require('fs');

let bulk = fs.readFileSync('d:\\SGROUP ERP FULL\\modules\\hr\\api\\internal\\usecase\\bulk_upload_uc.go', 'utf8');
bulk = bulk.replace(/empID, err := strconv\.ParseUint\([^\)]+\)/g, 'empID := row[0]\n\t\tvar err error // spoof');
fs.writeFileSync('d:\\SGROUP ERP FULL\\modules\\hr\\api\\internal\\usecase\\bulk_upload_uc.go', bulk);

let payroll = fs.readFileSync('d:\\SGROUP ERP FULL\\modules\\hr\\api\\internal\\usecase\\payroll_engine_uc.go', 'utf8');
payroll = payroll.replace(/employeeIDs := make\(\[\]uint, 0, len\(validContracts\)\)/g, 'employeeIDs := make([]string, 0, len(validContracts))');
fs.writeFileSync('d:\\SGROUP ERP FULL\\modules\\hr\\api\\internal\\usecase\\payroll_engine_uc.go', payroll);

