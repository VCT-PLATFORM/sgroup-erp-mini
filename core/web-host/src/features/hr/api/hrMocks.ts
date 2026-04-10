export const MOCK_DELAY = 600;

export const mockHRData = {
  getDashboard: {
    totalEmployees: 156, activeEmployees: 142, probationEmployees: 14, pendingLeaves: 5
  },
  getDepartments: {
    data: [
      { id: '1', name: 'Kinh Doanh', code: 'SALES', _count: { employees: 120 }, manager: { fullName: 'Ngô Việt' } },
      { id: '2', name: 'Marketing', code: 'MKT', _count: { employees: 25 }, manager: { fullName: 'Lê Hương' } },
      { id: '3', name: 'Nhân Sự', code: 'HR', _count: { employees: 15 }, manager: { fullName: 'Nguyễn Hoàng Oanh' } },
      { id: '4', name: 'Tài Chính Kế Toán', code: 'FIN', _count: { employees: 10 }, manager: { fullName: 'Trần Kế' } },
      { id: '5', name: 'Dự Án', code: 'PRJ', _count: { employees: 45 }, manager: { fullName: 'Phạm Huỳnh' } },
      { id: '6', name: 'Đại Lý', code: 'AGC', _count: { employees: 80 }, manager: { fullName: 'Lý Quốc' } },
      { id: '7', name: 'Hồ Sơ Thủ Tục', code: 'DOC', _count: { employees: 20 }, manager: { fullName: 'Trịnh Thanh' } }
    ]
  },
  getPositions: {
    data: [
      { id: '1', name: 'Giám đốc', code: 'DIR', level: 'Director' },
      { id: '2', name: 'Trưởng phòng', code: 'MGR', level: 'Manager' },
      { id: '3', name: 'Trưởng nhóm', code: 'LEAD', level: 'Leader' },
      { id: '4', name: 'Chuyên viên cao cấp', code: 'SNR', level: 'Senior' },
      { id: '5', name: 'Nhân viên', code: 'STF', level: 'Staff' }
    ]
  },
  getTeams: { data: [] },
  getEmployees: {
    data: [
      {
        id: '1', fullName: 'Huỳnh Bảo Tuân', englishName: 'Tuan Huynh Bao', employeeCode: 'SGR-001',
        phone: '0901234567', relativePhone: '0909888777', email: 'tuan.hb@sgroup.vn',
        level: 'Director', division: 'Ban Giám đốc', department: { name: 'Dự Án', code: 'PRJ' },
        position: { name: 'Giám đốc Dự án' }, directManager: 'CEO - Nguyễn Văn A',
        dob: '1990-05-15', idNumber: '079190012345', idIssueDate: '2021-06-20', idIssuePlace: 'Cục CS QLHC về TTXH',
        permanentAddress: '123 Nguyễn Huệ, Quận 1, TP.HCM', contactAddress: '456 Lê Lợi, Quận 3, TP.HCM',
        taxCode: '8234567890', insuranceBook: 'DN0123456789',
        bankName: 'Vietcombank', bankAccount: '0071000123456',
        personalDocs: 'Đầy đủ', vnId: 'VNID-SGR-001',
        createdAt: '2023-01-10', contractDate: '2023-03-15', startDate: '2023-03-15',
        employmentType: 'Toàn thời gian', probationSalary: 25000000, officialSalary: 35000000,
        workStatus: 'Đang làm việc', recruiter: 'Nguyễn Hoàng Oanh', candidateSource: 'LinkedIn',
        totalLeaveDays: 14, remainingLeaveDays: 8,
        status: 'active', gender: 'male'
      },
      {
        id: '2', fullName: 'Nguyễn Hoàng Oanh', englishName: 'Oanh Nguyen Hoang', employeeCode: 'SGR-002',
        phone: '0987654321', relativePhone: '0912345678', email: 'oanh.nh@sgroup.vn',
        level: 'Manager', division: 'Khối Hỗ trợ', department: { name: 'Nhân Sự', code: 'HR' },
        position: { name: 'Trưởng phòng HR' }, directManager: 'Huỳnh Bảo Tuân',
        dob: '1992-08-20', idNumber: '079192054321', idIssueDate: '2022-01-15', idIssuePlace: 'Cục CS QLHC về TTXH',
        permanentAddress: '789 Trần Hưng Đạo, Quận 5, TP.HCM', contactAddress: '789 Trần Hưng Đạo, Quận 5, TP.HCM',
        taxCode: '8234567891', insuranceBook: 'DN0123456790',
        bankName: 'Techcombank', bankAccount: '19033456789012',
        personalDocs: 'Đầy đủ', vnId: 'VNID-SGR-002',
        createdAt: '2022-06-01', contractDate: '2022-08-01', startDate: '2022-08-01',
        employmentType: 'Toàn thời gian', probationSalary: 18000000, officialSalary: 28000000,
        workStatus: 'Đang làm việc', recruiter: 'Trần Bình', candidateSource: 'Giới thiệu nội bộ',
        totalLeaveDays: 16, remainingLeaveDays: 12,
        status: 'active', gender: 'female'
      },
      {
        id: '3', fullName: 'Trần Minh Khôi', englishName: 'Khoi Tran Minh', employeeCode: 'SGR-003',
        phone: '0976543210', relativePhone: '0918765432', email: 'khoi.tm@sgroup.vn',
        level: 'Senior', division: 'Khối Kinh doanh', department: { name: 'Kinh Doanh', code: 'SALES' },
        position: { name: 'Chuyên viên Kinh doanh cao cấp' }, directManager: 'Ngô Việt',
        dob: '1995-11-03', idNumber: '079195098765', idIssueDate: '2020-09-10', idIssuePlace: 'Cục CS QLHC về TTXH',
        permanentAddress: '12 Pasteur, Quận 3, TP.HCM', contactAddress: '55 Hai Bà Trưng, Quận 1, TP.HCM',
        taxCode: '8234567892', insuranceBook: 'DN0123456791',
        bankName: 'MB Bank', bankAccount: '0801234567890',
        personalDocs: 'Đầy đủ', vnId: 'VNID-SGR-003',
        createdAt: '2024-01-15', contractDate: '2024-03-15', startDate: '2024-03-15',
        employmentType: 'Toàn thời gian', probationSalary: 12000000, officialSalary: 18000000,
        workStatus: 'Đang làm việc', recruiter: 'Nguyễn Hoàng Oanh', candidateSource: 'TopCV',
        totalLeaveDays: 12, remainingLeaveDays: 10,
        status: 'active', gender: 'male'
      },
      {
        id: '4', fullName: 'Lê Thị Hồng Nhung', englishName: 'Nhung Le Thi Hong', employeeCode: 'SGR-004',
        phone: '0965432109', relativePhone: '0923456789', email: 'nhung.lth@sgroup.vn',
        level: 'Staff', division: 'Khối Hỗ trợ', department: { name: 'Marketing', code: 'MKT' },
        position: { name: 'Nhân viên Marketing' }, directManager: 'Lê Hương',
        dob: '1998-03-22', idNumber: '079198076543', idIssueDate: '2023-02-28', idIssuePlace: 'Cục CS QLHC về TTXH',
        permanentAddress: '88 Võ Văn Tần, Quận 3, TP.HCM', contactAddress: '88 Võ Văn Tần, Quận 3, TP.HCM',
        taxCode: '8234567893', insuranceBook: 'DN0123456792',
        bankName: 'ACB', bankAccount: '54321098765',
        personalDocs: 'Thiếu bản sao CCCD', vnId: 'VNID-SGR-004',
        createdAt: '2025-06-01', contractDate: '2025-08-01', startDate: '2025-08-01',
        employmentType: 'Toàn thời gian', probationSalary: 8000000, officialSalary: 12000000,
        workStatus: 'Thử việc', recruiter: 'Nguyễn Hoàng Oanh', candidateSource: 'Website công ty',
        totalLeaveDays: 12, remainingLeaveDays: 12,
        status: 'probation', gender: 'female'
      }
    ],
    meta: { total: 4, page: 1, limit: 10 }
  },
  getEmployee: {
    id: '1', fullName: 'Huỳnh Bảo Tuân', englishName: 'Tuan Huynh Bao', employeeCode: 'SGR-001',
    phone: '0901234567', relativePhone: '0909888777', email: 'tuan.hb@sgroup.vn',
    level: 'Director', division: 'Ban Giám đốc', department: { name: 'Dự Án', code: 'PRJ' },
    position: { name: 'Giám đốc Dự án' }, directManager: 'CEO - Nguyễn Văn A',
    dob: '1990-05-15', idNumber: '079190012345', idIssueDate: '2021-06-20', idIssuePlace: 'Cục CS QLHC về TTXH',
    permanentAddress: '123 Nguyễn Huệ, Quận 1, TP.HCM', contactAddress: '456 Lê Lợi, Quận 3, TP.HCM',
    taxCode: '8234567890', insuranceBook: 'DN0123456789',
    bankName: 'Vietcombank', bankAccount: '0071000123456',
    personalDocs: 'Đầy đủ', vnId: 'VNID-SGR-001',
    createdAt: '2023-01-10', contractDate: '2023-03-15', startDate: '2023-03-15',
    employmentType: 'Toàn thời gian', probationSalary: 25000000, officialSalary: 35000000,
    workStatus: 'Đang làm việc', recruiter: 'Nguyễn Hoàng Oanh', candidateSource: 'LinkedIn',
    totalLeaveDays: 14, remainingLeaveDays: 8,
    status: 'active', gender: 'male'
  },
  getDashboardEvents: {
    data: [
      { type: 'birthday', date: 'Hôm nay 15/04', name: 'Nguyễn Hoàng Oanh', desc: 'Sinh nhật', role: 'Trưởng phòng HR' },
      { type: 'anniversary', date: 'Ngày mai 16/04', name: 'Huỳnh Bảo Tuân', desc: 'Kỷ niệm 1 năm làm việc', role: 'Giám đốc Công nghệ' }
    ]
  },
  getContracts: { data: [] },
  getAttendance: { data: [] },
  getLeaves: { data: [] },
  getPayroll: { data: [] },
  getPerformance: { data: [] },
  getJobs: { data: [] },
  getCandidates: { data: [] },
  getCourses: { data: [] },
  getTrainees: { data: [] },
  getTransfers: { data: [] },
  getLeaveBalances: { data: [] },
  getLeaveBalance: { data: [] },
  getBenefits: { data: [] },
  getPolicies: { data: [] },
  getOvertime: { data: [] },
  getDashboardActivities: {
    data: [
      { id: 1, title: 'Bổ nhiệm Giám đốc', time: 'Vừa xong', detail: 'Công bố quyết định bổ nhiệm Giám đốc Công nghệ khu vực Miền Nam', tone: '#8b5cf6' },
      { id: 2, title: 'Khen thưởng', time: '2 giờ trước', detail: 'Tuyên dương Team xuất sắc nhất quý I/2026', tone: '#22c55e' }
    ]
  }
};

// Helper function to simulate API delay
export function mockRespond<T>(data: T): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(data), MOCK_DELAY));
}
