const fs = require('fs');

let t1 = fs.readFileSync('d:\\SGROUP ERP FULL\\modules\\hr\\api\\internal\\delivery\\http\\attendance_handler.go', 'utf8');
t1 = t1.replace(/req.EmployeeID/, 'req.EmployeeID'); // if req.EmployeeID is uint, wait! attendance_handler uses domain.CheckInRequest
t1 = t1.replace(/empIDInt, _ := strconv.Atoi\(empID\)\n\s+empIDPtr := uint\(empIDInt\)\n\s+empID = &empIDPtr/g, 'empIDVal := empID\n\t\tempID = &empIDVal');
// If req is declared without domain, check what req is: struct { EmployeeID uint ... } -> struct { EmployeeID string ... }
t1 = t1.replace(/EmployeeID\s+uint\s+\json:"employee_id"\/g, 'EmployeeID string json:"employee_id"');
fs.writeFileSync('d:\\SGROUP ERP FULL\\modules\\hr\\api\\internal\\delivery\\http\\attendance_handler.go', t1);

let l1 = fs.readFileSync('d:\\SGROUP ERP FULL\\modules\\hr\\api\\internal\\delivery\\http\\leave_handler.go', 'utf8');
l1 = l1.replace(/id, _ := strconv.ParseUint\(idStr, 10, 32\)/g, '');
l1 = l1.replace(/h\.uc\.ApproveRequest\(c\.Request\.Context\(\), uint\(id\), payload\.ApproverID\)/g, 'h.uc.ApproveRequest(c.Request.Context(), idStr, payload.ApproverID)');
l1 = l1.replace(/h\.uc\.RejectRequest\(c\.Request\.Context\(\), uint\(id\), payload\.ApproverID, payload\.Note\)/g, 'h.uc.RejectRequest(c.Request.Context(), idStr, payload.ApproverID, payload.Note)');
l1 = l1.replace(/ApproverID uint/g, 'ApproverID string');
l1 = l1.replace(/id, err := strconv\.ParseUint\(empIDStr, 10, 32\)\n\t\tif err == nil \{\n\t\t\tv := uint\(id\)\n\t\t\tempID = &v\n\t\t\}/g, "empID = &empIDStr");
l1 = l1.replace(/var empID \*uint/g, "var empID *string");
l1 = l1.replace(/id, _ := strconv\.ParseUint\(empIDStr, 10, 32\)/g, "");
l1 = l1.replace(/balance, err := h\.uc\.GetBalance\(c\.Request\.Context\(\), uint\(id\), year\)/g, "balance, err := h.uc.GetBalance(c.Request.Context(), empIDStr, year)");
fs.writeFileSync('d:\\SGROUP ERP FULL\\modules\\hr\\api\\internal\\delivery\\http\\leave_handler.go', l1);

