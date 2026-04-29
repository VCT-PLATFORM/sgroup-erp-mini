// ═══════════════════════════════════════════════════════════
// @sgroup/types — Sales Module Types
// ═══════════════════════════════════════════════════════════

export interface KPIData {
  totalLeads: number;
  totalDeals: number;
  closedDeals: number;
  pendingApprovals: number;
  revenue: number;
  pipelineValue: number;
  conversionRate: number;
  avgDealSize: number;
  activeStaff: number;
  teamCount: number;
  totalActivityPoints?: number;
  pointsKPI?: number;
  revenueKPI?: number;
}

export interface MonthlyRevenue {
  year: number;
  month: number;
  label: string;
  gmv: number;
  revenue: number;
  deals: number;
}

// ── Customer ──
// NOTE: Bảng `customers` đã bị xóa khỏi DB.
// Thông tin KH lưu inline trong bookings/deposits (customer_name, customer_phone, customer_email, id_card_no).
// Nếu cần quản lý KH riêng, sử dụng CRM bên ngoài (Bizfly CRM).

// ── Transaction & SalesDeal ──
// NOTE: Bảng `transactions` và `deals` đã bị xóa khỏi DB.
// Flow bán hàng đơn giản hóa: bookings (giữ chỗ) → deposits (đặt cọc).
// Không còn bước "lock" hay bảng deal riêng.

export interface SalesTeam {
  id: string;
  name: string;
  code: string;
  managerId: string;
  managerName: string;
  parentId?: string;
  status: string;
  sortOrder: number;
  members?: SalesStaff[];
  createdAt: string;
  updatedAt: string;
}

export interface SalesStaff {
  id: string;
  employeeCode: string;
  fullName: string;
  phone: string;
  email: string;
  role: string;
  status: string;
  leadsCapacity: number;
  personalTarget: number;
  teamId?: string;
  team?: SalesTeam;
  createdAt: string;
  updatedAt: string;
}

export interface SalesBooking {
  id: string;
  projectName: string;
  unitCode: string;
  customerName: string;
  customerPhone: string;
  bookingAmount: number;
  staffName?: string;
  teamName?: string;
  status: string;
  bookingDate: string;
  createdAt: string;
}

export interface SalesDeposit {
  id: string;
  projectName: string;
  unitCode: string;
  customerName: string;
  depositAmount: number;
  staffName?: string;
  status: string;
  depositDate: string;
}
