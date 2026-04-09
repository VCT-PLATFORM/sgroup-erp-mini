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
      { id: '1', fullName: 'Huỳnh Bảo Tuân', employeeCode: 'SGR-001', position: { name: 'Giám đốc Công nghệ' }, department: { name: 'Công nghệ & Hệ thống', code: 'IT' }, phone: '0901234567', email: 'tuan.hb@sgroup.vn', status: 'active', avatarParams: '?seed=Tuan' },
      { id: '2', fullName: 'Nguyễn Hoàng Oanh', employeeCode: 'SGR-002', position: { name: 'Trưởng phòng HR' }, department: { name: 'Hành chính & Nhân sự', code: 'HR' }, phone: '0987654321', email: 'oanh.nh@sgroup.vn', status: 'active', avatarParams: '?seed=Oanh' }
    ],
    meta: { total: 2, page: 1, limit: 10 }
  },
  getEmployee: {
    id: '1', fullName: 'Huỳnh Bảo Tuân', employeeCode: 'SGR-001', 
    position: { name: 'Giám đốc Công nghệ' }, department: { name: 'Công nghệ & Sản phẩm', code: 'TECH' }, 
    phone: '0901234567', email: 'tuan.hb@sgroup.vn', status: 'active', gender: 'male', 
    dob: '1990-01-01', workAddress: 'Hội sở SGROUP'
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
