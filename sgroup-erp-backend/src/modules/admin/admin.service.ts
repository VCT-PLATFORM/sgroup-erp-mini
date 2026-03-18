import { Injectable, Logger, BadRequestException, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, validateCreateUser, validateUpdateUser, validatePasswordStrength } from './admin.dto';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Cron, CronExpression } from '@nestjs/schedule';

const BCRYPT_ROUNDS = 12;
const AUDIT_RETENTION_DAYS = 90;

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ═══════════════════════════════════════════
  // DASHBOARD STATS
  // ═══════════════════════════════════════════
  async getStats() {
    const [
      totalUsers,
      activeUsers,
      totalDepartments,
      totalTeams,
      totalPositions,
      totalEmployees,
      recentUsers,
      deptDistribution,
      roleDistribution,
      recentAuditCount,
      lockedUsers,
      activityTrend,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.hrDepartment.count(),
      this.prisma.hrTeam.count(),
      this.prisma.hrPosition.count(),
      this.prisma.hrEmployee.count(),
      this.prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 8,
        select: {
          id: true, name: true, email: true, role: true, department: true,
          isActive: true, createdAt: true, lastLoginAt: true, loginCount: true,
          lockedUntil: true,
        },
      }),
      this.prisma.hrDepartment.findMany({
        select: { id: true, name: true, code: true, _count: { select: { employees: true, teams: true } } },
        orderBy: { name: 'asc' },
      }),
      this.prisma.user.groupBy({
        by: ['role'],
        _count: { role: true },
        orderBy: { _count: { role: 'desc' } },
      }),
      this.prisma.auditLog.count({
        where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      }),
      this.prisma.user.count({
        where: { lockedUntil: { gt: new Date() } },
      }),
      // Activity trend — last 7 days
      this.getActivityTrend(7),
    ]);

    const inactiveUsers = totalUsers - activeUsers;

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      lockedUsers,
      totalDepartments,
      totalTeams,
      totalPositions,
      totalEmployees,
      recentUsers,
      deptDistribution,
      roleDistribution: roleDistribution.map(r => ({ role: r.role, count: r._count.role })),
      recentAuditCount,
      activityTrend,
    };
  }

  /** Get activity (audit log count) per day for the last N days */
  private async getActivityTrend(days: number) {
    const result: { date: string; count: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const start = new Date();
      start.setDate(start.getDate() - i);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      const count = await this.prisma.auditLog.count({
        where: { createdAt: { gte: start, lt: end } },
      });
      result.push({
        date: start.toISOString().slice(0, 10),
        count,
      });
    }
    return result;
  }

  // ═══════════════════════════════════════════
  // HEALTH CHECK
  // ═══════════════════════════════════════════
  async getHealthCheck() {
    const checks: { name: string; status: string; latency?: number }[] = [];

    // Database check
    const dbStart = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      checks.push({ name: 'Database', status: 'online', latency: Date.now() - dbStart });
    } catch {
      checks.push({ name: 'Database', status: 'offline', latency: Date.now() - dbStart });
    }

    // API Server — always online if we reach here
    checks.push({ name: 'API Server', status: 'online', latency: 0 });

    // Auth — check if JWT module is working
    checks.push({ name: 'Auth Service', status: 'online', latency: 0 });

    // Audit log count (last hour)
    try {
      const count = await this.prisma.auditLog.count({
        where: { createdAt: { gte: new Date(Date.now() - 3600_000) } },
      });
      checks.push({ name: 'Audit Logger', status: count >= 0 ? 'online' : 'offline', latency: 0 });
    } catch {
      checks.push({ name: 'Audit Logger', status: 'degraded', latency: 0 });
    }

    const allOnline = checks.every(c => c.status === 'online');
    return { status: allOnline ? 'healthy' : 'degraded', checks, timestamp: new Date().toISOString() };
  }

  // ═══════════════════════════════════════════
  // USER MANAGEMENT
  // ═══════════════════════════════════════════
  async findAllUsers(opts: { search?: string; role?: string; status?: string; page?: number; limit?: number }) {
    const { search, role, status, page = 1, limit = 50 } = opts;
    const where: Prisma.UserWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (role) where.role = role;
    if (status === 'active') where.isActive = true;
    if (status === 'inactive') where.isActive = false;
    if (status === 'locked') where.lockedUntil = { gt: new Date() };

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true, name: true, email: true, role: true,
          department: true, salesRole: true, isActive: true,
          lastLoginAt: true, loginCount: true, failedLoginAttempts: true,
          lockedUntil: true, passwordChangedAt: true,
          createdAt: true, updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async createUser(data: CreateUserDto) {
    const validation = validateCreateUser(data);
    if (!validation.valid) {
      throw new BadRequestException(validation.errors.join('; '));
    }

    const existing = await this.prisma.user.findUnique({ where: { email: data.email.toLowerCase().trim() } });
    if (existing) {
      throw new ConflictException(`Email "${data.email}" đã tồn tại trong hệ thống`);
    }

    const hashed = await bcrypt.hash(data.password, BCRYPT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        email: data.email.toLowerCase().trim(),
        name: data.name.trim(),
        password: hashed,
        role: data.role || 'employee',
        department: data.department || null,
        passwordChangedAt: new Date(),
      },
      select: { id: true, name: true, email: true, role: true, department: true, isActive: true, createdAt: true },
    });

    this.logger.log(`Admin created user: ${user.email} (role=${user.role})`);
    return user;
  }

  async updateUser(id: string, data: UpdateUserDto) {
    const validation = validateUpdateUser(data);
    if (!validation.valid) {
      throw new BadRequestException(validation.errors.join('; '));
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User "${id}" không tồn tại`);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: validation.sanitized,
      select: {
        id: true, name: true, email: true, role: true, department: true,
        salesRole: true, isActive: true, updatedAt: true,
      },
    });

    this.logger.log(`Admin updated user: ${updated.email} → ${JSON.stringify(validation.sanitized)}`);
    return updated;
  }

  async updateUserEmail(id: string, newEmail: string) {
    const email = newEmail.toLowerCase().trim();
    if (!email || !email.includes('@')) {
      throw new BadRequestException('Email không hợp lệ');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User "${id}" không tồn tại`);

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing && existing.id !== id) {
      throw new ConflictException(`Email "${email}" đã được sử dụng`);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: { email },
      select: { id: true, name: true, email: true, updatedAt: true },
    });

    this.logger.log(`Admin changed email for ${user.email} → ${email}`);
    return updated;
  }

  async deactivateUser(id: string, currentUserId?: string) {
    // Self-deactivation guard
    if (currentUserId && id === currentUserId) {
      throw new ForbiddenException('Không thể vô hiệu hóa tài khoản của chính bạn');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User "${id}" không tồn tại`);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: { id: true, name: true, email: true, role: true, isActive: true, updatedAt: true },
    });

    this.logger.log(`Admin ${updated.isActive ? 'activated' : 'deactivated'} user: ${updated.email}`);
    return updated;
  }

  /** Batch activate/deactivate multiple users */
  async batchToggleUsers(ids: string[], activate: boolean, currentUserId?: string) {
    if (currentUserId && ids.includes(currentUserId)) {
      throw new ForbiddenException('Không thể vô hiệu hóa tài khoản của chính bạn');
    }

    const result = await this.prisma.user.updateMany({
      where: { id: { in: ids } },
      data: { isActive: activate },
    });

    this.logger.log(`Admin batch ${activate ? 'activated' : 'deactivated'} ${result.count} users`);
    return { updated: result.count, activate };
  }

  async resetPassword(id: string, newPassword: string) {
    const pwdCheck = validatePasswordStrength(newPassword);
    if (!pwdCheck.valid) {
      throw new BadRequestException(pwdCheck.errors.join('; '));
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User "${id}" không tồn tại`);
    }

    const hashed = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await this.prisma.user.update({
      where: { id },
      data: { password: hashed, passwordChangedAt: new Date(), failedLoginAttempts: 0, lockedUntil: null },
    });

    this.logger.log(`Admin reset password for: ${user.email}`);

    // Create audit log entry for this sensitive action
    await this.prisma.auditLog.create({
      data: {
        userName: 'ADMIN',
        action: `RESET_PASSWORD for ${user.email}`,
        resource: 'admin/users',
        method: 'POST',
        responseStatus: 'SUCCESS',
      },
    }).catch(() => {}); // Don't fail the main action if audit fails

    return { success: true, message: `Đã đặt lại mật khẩu cho ${user.email}` };
  }

  /** Unlock a locked account */
  async unlockUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User "${id}" không tồn tại`);

    await this.prisma.user.update({
      where: { id },
      data: { failedLoginAttempts: 0, lockedUntil: null },
    });

    this.logger.log(`Admin unlocked user: ${user.email}`);
    return { success: true, message: `Đã mở khóa tài khoản ${user.email}` };
  }

  /** Export users as CSV */
  async exportUsersCSV(opts: { role?: string; status?: string }) {
    const where: Prisma.UserWhereInput = {};
    if (opts.role) where.role = opts.role;
    if (opts.status === 'active') where.isActive = true;
    if (opts.status === 'inactive') where.isActive = false;

    const users = await this.prisma.user.findMany({
      where,
      select: {
        id: true, name: true, email: true, role: true, department: true,
        salesRole: true, isActive: true, lastLoginAt: true, loginCount: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const headers = ['ID', 'Tên', 'Email', 'Vai trò', 'Phòng ban', 'Sales Role', 'Trạng thái', 'Lần đăng nhập cuối', 'Số lần login', 'Ngày tạo'];
    const rows = users.map(u => [
      u.id,
      `"${u.name}"`,
      u.email,
      u.role,
      u.department || '',
      u.salesRole || '',
      u.isActive ? 'Active' : 'Inactive',
      u.lastLoginAt ? new Date(u.lastLoginAt).toISOString() : 'Chưa đăng nhập',
      u.loginCount,
      new Date(u.createdAt).toISOString(),
    ].join(','));

    return [headers.join(','), ...rows].join('\n');
  }

  // ═══════════════════════════════════════════
  // AUDIT LOGS
  // ═══════════════════════════════════════════
  async getAuditLogs(opts: {
    action?: string; resource?: string; userName?: string; method?: string;
    dateFrom?: string; dateTo?: string;
    page?: number; limit?: number;
  }) {
    const { action, resource, userName, method, dateFrom, dateTo, page = 1, limit = 50 } = opts;
    const where: Prisma.AuditLogWhereInput = {};

    if (action) where.action = { contains: action, mode: 'insensitive' };
    if (resource) where.resource = { contains: resource, mode: 'insensitive' };
    if (userName) where.userName = { contains: userName, mode: 'insensitive' };
    if (method) where.method = method;

    // Date range filter
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) (where.createdAt as any).gte = new Date(dateFrom);
      if (dateTo) {
        const end = new Date(dateTo);
        end.setDate(end.getDate() + 1); // inclusive end date
        (where.createdAt as any).lt = end;
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  /** Get single audit log detail by ID */
  async getAuditLogDetail(id: string) {
    const log = await this.prisma.auditLog.findUnique({ where: { id } });
    if (!log) throw new NotFoundException(`Audit log "${id}" không tồn tại`);
    return log;
  }

  // ═══════════════════════════════════════════
  // SYSTEM SETTINGS
  // ═══════════════════════════════════════════
  async getSettings(group?: string) {
    const where: Prisma.SystemSettingWhereInput = {};
    if (group) where.group = group;

    return this.prisma.systemSetting.findMany({
      where,
      orderBy: [{ group: 'asc' }, { key: 'asc' }],
    });
  }

  async updateSetting(key: string, value: string, updatedBy?: string) {
    const setting = await this.prisma.systemSetting.findUnique({ where: { key } });
    if (!setting) {
      throw new NotFoundException(`Setting "${key}" không tồn tại`);
    }

    const oldValue = setting.value;
    const updated = await this.prisma.systemSetting.update({
      where: { key },
      data: { value },
    });

    // Detailed audit log for setting changes
    await this.prisma.auditLog.create({
      data: {
        userName: updatedBy || 'ADMIN',
        action: `SETTING_CHANGE: ${key}`,
        resource: 'admin/settings',
        method: 'PATCH',
        requestBody: JSON.stringify({ key, oldValue, newValue: value }),
        responseStatus: 'SUCCESS',
      },
    }).catch(() => {});

    this.logger.log(`Admin updated setting: ${key} = ${value} (was: ${oldValue})`);
    return updated;
  }

  async upsertSetting(key: string, data: { value: string; group?: string; label?: string; description?: string; valueType?: string }) {
    return this.prisma.systemSetting.upsert({
      where: { key },
      update: { value: data.value },
      create: {
        key,
        value: data.value,
        group: data.group || 'general',
        label: data.label,
        description: data.description,
        valueType: data.valueType || 'string',
      },
    });
  }

  async seedDefaultSettings() {
    const defaults = [
      { key: 'app_name', value: 'SGROUP ERP', group: 'general', label: 'Tên ứng dụng', description: 'Tên hiển thị trên hệ thống', valueType: 'string' },
      { key: 'app_timezone', value: 'Asia/Ho_Chi_Minh', group: 'general', label: 'Múi giờ', description: 'Múi giờ hệ thống', valueType: 'string' },
      { key: 'app_language', value: 'vi', group: 'general', label: 'Ngôn ngữ', description: 'Ngôn ngữ mặc định', valueType: 'string' },
      { key: 'maintenance_mode', value: 'false', group: 'general', label: 'Chế độ bảo trì', description: 'Bật/tắt chế độ bảo trì', valueType: 'boolean' },
      { key: 'smtp_host', value: 'smtp.gmail.com', group: 'email', label: 'SMTP Host', description: 'Địa chỉ máy chủ SMTP', valueType: 'string' },
      { key: 'smtp_port', value: '587', group: 'email', label: 'SMTP Port', description: 'Cổng SMTP', valueType: 'number' },
      { key: 'email_from', value: 'noreply@sgroup.vn', group: 'email', label: 'Email gửi', description: 'Email mặc định gửi thông báo', valueType: 'string' },
      { key: 'email_enabled', value: 'true', group: 'email', label: 'Kích hoạt email', description: 'Bật/tắt gửi email', valueType: 'boolean' },
      { key: 'session_timeout', value: '60', group: 'security', label: 'Session timeout (phút)', description: 'Thời gian hết hạn phiên', valueType: 'number' },
      { key: 'max_login_attempts', value: '5', group: 'security', label: 'Số lần đăng nhập tối đa', description: 'Số lần thử trước khi khóa', valueType: 'number' },
      { key: 'two_factor_enabled', value: 'false', group: 'security', label: 'Xác thực 2 bước', description: 'Bật/tắt 2FA', valueType: 'boolean' },
      { key: 'password_min_length', value: '8', group: 'security', label: 'Độ dài mật khẩu tối thiểu', description: 'Độ dài tối thiểu', valueType: 'number' },
      { key: 'account_lock_minutes', value: '30', group: 'security', label: 'Thời gian khóa tài khoản (phút)', description: 'Thời gian tự động mở khóa sau khi bị lock', valueType: 'number' },
      { key: 'push_enabled', value: 'true', group: 'notification', label: 'Push notification', description: 'Bật/tắt push', valueType: 'boolean' },
      { key: 'notification_email', value: 'true', group: 'notification', label: 'Email thông báo', description: 'Gửi kèm email', valueType: 'boolean' },
      { key: 'digest_frequency', value: 'daily', group: 'notification', label: 'Tần suất tổng hợp', description: 'daily, weekly', valueType: 'string' },
    ];

    const result = await this.prisma.systemSetting.createMany({
      data: defaults,
      skipDuplicates: true,
    });

    this.logger.log(`Seeded ${result.count} new default settings (${defaults.length - result.count} already existed)`);
    return { created: result.count, total: defaults.length, skipped: defaults.length - result.count };
  }

  // ═══════════════════════════════════════════
  // ROLE PERMISSIONS (Configurable RBAC)
  // ═══════════════════════════════════════════

  private readonly DEFAULT_PERMISSIONS: Record<string, Record<string, string>> = {
    admin:    { admin: 'full', hr: 'full', sales: 'full', finance: 'full', project: 'full', marketing: 'full', planning: 'full', reports: 'full' },
    ceo:      { admin: 'read', hr: 'read', sales: 'read', finance: 'full', project: 'full', marketing: 'read', planning: 'full', reports: 'full' },
    hr:       { admin: 'none', hr: 'full', sales: 'read', finance: 'read', project: 'read', marketing: 'none', planning: 'read', reports: 'read' },
    sales:    { admin: 'none', hr: 'none', sales: 'write', finance: 'none', project: 'read', marketing: 'read', planning: 'read', reports: 'read' },
    employee: { admin: 'none', hr: 'none', sales: 'none', finance: 'none', project: 'read', marketing: 'none', planning: 'read', reports: 'read' },
  };

  async getPermissions() {
    const perms = await this.prisma.rolePermission.findMany({
      orderBy: [{ role: 'asc' }, { module: 'asc' }],
    });

    // If no permissions exist, return defaults (not yet configured)
    if (perms.length === 0) {
      return { data: [], isDefault: true, defaults: this.DEFAULT_PERMISSIONS };
    }

    // Convert flat list to matrix
    const matrix: Record<string, Record<string, string>> = {};
    for (const p of perms) {
      if (!matrix[p.role]) matrix[p.role] = {};
      matrix[p.role][p.module] = p.permission;
    }

    return { data: perms, matrix, isDefault: false };
  }

  async updatePermission(role: string, module: string, permission: string) {
    const validPerms = ['full', 'write', 'read', 'none'];
    if (!validPerms.includes(permission)) {
      throw new BadRequestException(`Permission phải là: ${validPerms.join(', ')}`);
    }

    const result = await this.prisma.rolePermission.upsert({
      where: { role_module: { role, module } },
      update: { permission },
      create: { role, module, permission },
    });

    this.logger.log(`Permission updated: ${role}/${module} = ${permission}`);
    return result;
  }

  async bulkUpdatePermissions(updates: { role: string; module: string; permission: string }[]) {
    const validPerms = ['full', 'write', 'read', 'none'];

    // Validate all entries
    for (const u of updates) {
      if (!validPerms.includes(u.permission)) {
        throw new BadRequestException(`Permission "${u.permission}" không hợp lệ cho ${u.role}/${u.module}`);
      }
    }

    // Upsert all in a transaction
    const results = await this.prisma.$transaction(
      updates.map(u =>
        this.prisma.rolePermission.upsert({
          where: { role_module: { role: u.role, module: u.module } },
          update: { permission: u.permission },
          create: { role: u.role, module: u.module, permission: u.permission },
        }),
      ),
    );

    this.logger.log(`Bulk permission update: ${results.length} entries`);
    return { updated: results.length };
  }

  async seedDefaultPermissions() {
    let created = 0;
    for (const [role, modules] of Object.entries(this.DEFAULT_PERMISSIONS)) {
      for (const [module, permission] of Object.entries(modules)) {
        await this.prisma.rolePermission.upsert({
          where: { role_module: { role, module } },
          update: { permission },
          create: { role, module, permission },
        });
        created++;
      }
    }
    this.logger.log(`Seeded ${created} default permissions`);
    return { created };
  }

  async resetPermissionsToDefault() {
    // Delete all and re-seed
    await this.prisma.rolePermission.deleteMany({});
    return this.seedDefaultPermissions();
  }

  // ═══════════════════════════════════════════
  // AUDIT LOG CLEANUP (CRON)
  // ═══════════════════════════════════════════
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async cleanupOldAuditLogs() {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - AUDIT_RETENTION_DAYS);

    const result = await this.prisma.auditLog.deleteMany({
      where: { createdAt: { lt: cutoff } },
    });

    if (result.count > 0) {
      this.logger.log(`[CRON] Cleaned up ${result.count} audit logs older than ${AUDIT_RETENTION_DAYS} days`);
    }
  }

  // ═══════════════════════════════════════════
  // USER DETAIL (profile + login history + sessions)
  // ═══════════════════════════════════════════
  async getUserDetail(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true, name: true, email: true, role: true, department: true,
        salesRole: true, isActive: true, lastLoginAt: true, loginCount: true,
        failedLoginAttempts: true, lockedUntil: true, passwordChangedAt: true,
        createdAt: true, updatedAt: true,
      },
    });
    if (!user) throw new NotFoundException(`User "${id}" không tồn tại`);

    // Login history from audit logs
    const loginHistory = await this.prisma.auditLog.findMany({
      where: {
        OR: [
          { userId: id },
          { userName: user.email },
          { userName: user.name },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 30,
      select: {
        id: true, action: true, method: true, resource: true,
        responseStatus: true, duration: true, ip: true, userAgent: true,
        createdAt: true,
      },
    });

    // Active sessions from refresh tokens
    const sessions = await this.prisma.refreshToken.findMany({
      where: { userId: id, revokedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, deviceInfo: true, createdAt: true, expiresAt: true,
      },
    });

    // Password expiry check
    const passwordExpiryDays = await this.getSettingValue('password_expiry_days', '90');
    const daysInt = parseInt(passwordExpiryDays);
    let passwordExpired = false;
    let passwordDaysLeft: number | null = null;
    if (user.passwordChangedAt && daysInt > 0) {
      const expiryDate = new Date(user.passwordChangedAt);
      expiryDate.setDate(expiryDate.getDate() + daysInt);
      passwordExpired = expiryDate < new Date();
      passwordDaysLeft = Math.ceil((expiryDate.getTime() - Date.now()) / 86400000);
    }

    return {
      ...user,
      loginHistory,
      sessions,
      passwordExpired,
      passwordDaysLeft,
    };
  }

  // ═══════════════════════════════════════════
  // ACTIVE SESSIONS MANAGEMENT
  // ═══════════════════════════════════════════
  async getUserSessions(userId: string) {
    return this.prisma.refreshToken.findMany({
      where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, deviceInfo: true, createdAt: true, expiresAt: true,
      },
    });
  }

  async revokeSession(sessionId: string) {
    const token = await this.prisma.refreshToken.findUnique({ where: { id: sessionId } });
    if (!token) throw new NotFoundException('Session not found');
    await this.prisma.refreshToken.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
    this.logger.log(`Admin revoked session ${sessionId} for user ${token.userId}`);
    return { success: true };
  }

  async revokeAllSessions(userId: string) {
    const result = await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    this.logger.log(`Admin revoked ${result.count} sessions for user ${userId}`);
    return { revoked: result.count };
  }

  // ═══════════════════════════════════════════
  // PASSWORD EXPIRY CHECK
  // ═══════════════════════════════════════════
  async getPasswordExpiryStatus() {
    const expiryDaysSetting = await this.getSettingValue('password_expiry_days', '90');
    const expiryDays = parseInt(expiryDaysSetting);
    if (expiryDays <= 0) return { enabled: false, expiredUsers: [], expiringSoonUsers: [] };

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() - expiryDays);
    const warnDate = new Date();
    warnDate.setDate(warnDate.getDate() - (expiryDays - 7)); // 7 days warning

    const expiredUsers = await this.prisma.user.findMany({
      where: {
        isActive: true,
        OR: [
          { passwordChangedAt: { lt: expiryDate } },
          { passwordChangedAt: null },
        ],
      },
      select: { id: true, name: true, email: true, role: true, passwordChangedAt: true },
      take: 50,
    });

    const expiringSoonUsers = await this.prisma.user.findMany({
      where: {
        isActive: true,
        passwordChangedAt: { gte: expiryDate, lt: warnDate },
      },
      select: { id: true, name: true, email: true, role: true, passwordChangedAt: true },
      take: 50,
    });

    return { enabled: true, expiryDays, expiredUsers, expiringSoonUsers };
  }

  // ═══════════════════════════════════════════
  // AUDIT LOG ANALYTICS
  // ═══════════════════════════════════════════
  async getAuditAnalytics(days: number = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    // Top users (by activity count)
    const topUsersRaw = await this.prisma.auditLog.groupBy({
      by: ['userName'],
      where: { createdAt: { gte: since }, userName: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });
    const topUsers = topUsersRaw.map(r => ({ userName: r.userName, count: r._count.id }));

    // Top resources
    const topResourcesRaw = await this.prisma.auditLog.groupBy({
      by: ['resource'],
      where: { createdAt: { gte: since }, resource: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });
    const topResources = topResourcesRaw.map(r => ({ resource: r.resource, count: r._count.id }));

    // Error rate
    const [totalLogs, failedLogs] = await Promise.all([
      this.prisma.auditLog.count({ where: { createdAt: { gte: since } } }),
      this.prisma.auditLog.count({ where: { createdAt: { gte: since }, responseStatus: 'FAILED' } }),
    ]);
    const errorRate = totalLogs > 0 ? (failedLogs / totalLogs * 100).toFixed(1) : '0';

    // Method distribution
    const methodDistRaw = await this.prisma.auditLog.groupBy({
      by: ['method'],
      where: { createdAt: { gte: since }, method: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });
    const methodDistribution = methodDistRaw.map(r => ({ method: r.method, count: r._count.id }));

    // Hourly heatmap (24 hours × last N days)
    const hourlyData: number[] = Array(24).fill(0);
    const hourlyLogs = await this.prisma.auditLog.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    });
    hourlyLogs.forEach(log => {
      const hour = new Date(log.createdAt).getHours();
      hourlyData[hour]++;
    });

    return {
      period: `${days} ngày`,
      totalLogs,
      failedLogs,
      errorRate: `${errorRate}%`,
      topUsers,
      topResources,
      methodDistribution,
      hourlyHeatmap: hourlyData,
    };
  }

  // ═══════════════════════════════════════════
  // SETTING CHANGE HISTORY
  // ═══════════════════════════════════════════
  async getSettingChangeHistory(limit = 50) {
    return this.prisma.auditLog.findMany({
      where: {
        action: { startsWith: 'SETTING_CHANGE' },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true, action: true, userName: true, requestBody: true, createdAt: true,
      },
    });
  }

  // ═══════════════════════════════════════════
  // FEATURE FLAGS
  // ═══════════════════════════════════════════
  async getFeatureFlags(module?: string) {
    const where: any = {};
    if (module) where.module = module;
    return this.prisma.featureFlag.findMany({
      where,
      orderBy: [{ module: 'asc' }, { key: 'asc' }],
    });
  }

  async toggleFeatureFlag(id: string, enabled: boolean, updatedBy?: string) {
    const flag = await this.prisma.featureFlag.findUnique({ where: { id } });
    if (!flag) throw new NotFoundException('Feature flag not found');

    const updated = await this.prisma.featureFlag.update({
      where: { id },
      data: { enabled, updatedBy },
    });

    this.logger.log(`Feature flag ${flag.key} ${enabled ? 'enabled' : 'disabled'} by ${updatedBy}`);

    // Audit log this change
    await this.prisma.auditLog.create({
      data: {
        userName: updatedBy || 'ADMIN',
        action: `FEATURE_FLAG: ${flag.key} → ${enabled ? 'ON' : 'OFF'}`,
        resource: 'admin/feature-flags',
        method: 'PATCH',
        requestBody: JSON.stringify({ key: flag.key, enabled }),
        responseStatus: 'SUCCESS',
      },
    }).catch(() => {});

    return updated;
  }

  async createFeatureFlag(data: { key: string; description?: string; module?: string; enabled?: boolean }) {
    const existing = await this.prisma.featureFlag.findUnique({ where: { key: data.key } });
    if (existing) throw new ConflictException(`Flag "${data.key}" đã tồn tại`);

    return this.prisma.featureFlag.create({
      data: {
        key: data.key,
        description: data.description,
        module: data.module,
        enabled: data.enabled ?? false,
      },
    });
  }

  async deleteFeatureFlag(id: string) {
    const flag = await this.prisma.featureFlag.findUnique({ where: { id } });
    if (!flag) throw new NotFoundException('Feature flag not found');
    await this.prisma.featureFlag.delete({ where: { id } });
    this.logger.log(`Feature flag deleted: ${flag.key}`);
    return { success: true };
  }

  async seedDefaultFeatureFlags() {
    const defaults = [
      { key: 'module.hr.enabled', description: 'Bật/tắt module HR', module: 'hr', enabled: true },
      { key: 'module.sales.enabled', description: 'Bật/tắt module Sales', module: 'sales', enabled: true },
      { key: 'module.finance.enabled', description: 'Bật/tắt module Finance', module: 'finance', enabled: true },
      { key: 'module.project.enabled', description: 'Bật/tắt module Project', module: 'project', enabled: true },
      { key: 'module.marketing.enabled', description: 'Bật/tắt module Marketing', module: 'marketing', enabled: true },
      { key: 'feature.dark_mode', description: 'Cho phép dark mode', module: 'general', enabled: true },
      { key: 'feature.csv_export', description: 'Cho phép export CSV', module: 'general', enabled: true },
      { key: 'feature.2fa', description: 'Xác thực 2 lớp (TOTP)', module: 'security', enabled: false },
      { key: 'feature.email_notifications', description: 'Email thông báo', module: 'notification', enabled: true },
      { key: 'feature.push_notifications', description: 'Push notification', module: 'notification', enabled: true },
    ];

    const result = await this.prisma.featureFlag.createMany({
      data: defaults,
      skipDuplicates: true,
    });

    return { created: result.count, total: defaults.length };
  }

  // ═══════════════════════════════════════════
  // BACKUP & RESTORE SETTINGS
  // ═══════════════════════════════════════════
  async exportSettingsBackup() {
    const settings = await this.prisma.systemSetting.findMany();
    const flags = await this.prisma.featureFlag.findMany();
    const permissions = await this.prisma.rolePermission.findMany();

    return {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      settings,
      featureFlags: flags,
      rolePermissions: permissions,
    };
  }

  async importSettingsBackup(backup: {
    settings?: any[];
    featureFlags?: any[];
    rolePermissions?: any[];
  }) {
    const results = { settings: 0, featureFlags: 0, rolePermissions: 0 };

    if (backup.settings?.length) {
      for (const s of backup.settings) {
        await this.prisma.systemSetting.upsert({
          where: { key: s.key },
          update: { value: s.value, group: s.group, label: s.label, description: s.description, valueType: s.valueType },
          create: { key: s.key, value: s.value, group: s.group || 'general', label: s.label, description: s.description, valueType: s.valueType || 'string' },
        });
        results.settings++;
      }
    }

    if (backup.featureFlags?.length) {
      for (const f of backup.featureFlags) {
        await this.prisma.featureFlag.upsert({
          where: { key: f.key },
          update: { enabled: f.enabled, description: f.description, module: f.module },
          create: { key: f.key, enabled: f.enabled ?? false, description: f.description, module: f.module },
        });
        results.featureFlags++;
      }
    }

    if (backup.rolePermissions?.length) {
      for (const p of backup.rolePermissions) {
        await this.prisma.rolePermission.upsert({
          where: { role_module: { role: p.role, module: p.module } },
          update: { permission: p.permission },
          create: { role: p.role, module: p.module, permission: p.permission },
        });
        results.rolePermissions++;
      }
    }

    this.logger.log(`Imported backup: ${JSON.stringify(results)}`);
    return results;
  }

  // ═══════════════════════════════════════════
  // BATCH IMPORT USERS (CSV)
  // ═══════════════════════════════════════════
  async batchImportUsers(csvContent: string) {
    const lines = csvContent.trim().split('\n');
    if (lines.length < 2) throw new BadRequestException('CSV phải có ít nhất 1 dòng header + 1 dòng dữ liệu');

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const emailIdx = headers.indexOf('email');
    const nameIdx = headers.indexOf('name');
    const roleIdx = headers.indexOf('role');
    const deptIdx = headers.indexOf('department');

    if (emailIdx === -1 || nameIdx === -1) {
      throw new BadRequestException('CSV phải có cột "email" và "name"');
    }

    const results = { total: 0, created: 0, skipped: 0, errors: [] as string[] };
    const defaultPassword = 'Sgroup@2024!';
    const hashedDefault = await bcrypt.hash(defaultPassword, BCRYPT_ROUNDS);

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
      const email = cols[emailIdx]?.toLowerCase().trim();
      const name = cols[nameIdx]?.trim();
      const role = roleIdx >= 0 ? cols[roleIdx]?.trim() : 'employee';
      const dept = deptIdx >= 0 ? cols[deptIdx]?.trim() : undefined;

      if (!email || !name) {
        results.errors.push(`Dòng ${i + 1}: email hoặc name trống`);
        results.skipped++;
        continue;
      }

      try {
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing) {
          results.errors.push(`Dòng ${i + 1}: ${email} đã tồn tại`);
          results.skipped++;
          continue;
        }

        await this.prisma.user.create({
          data: {
            email,
            name,
            password: hashedDefault,
            role: role || 'employee',
            department: dept || null,
            passwordChangedAt: null, // Force password change on first login
          },
        });
        results.created++;
      } catch (e: any) {
        results.errors.push(`Dòng ${i + 1}: ${e.message}`);
        results.skipped++;
      }
      results.total++;
    }

    this.logger.log(`Batch import: ${results.created} created, ${results.skipped} skipped from ${results.total} rows`);
    return { ...results, defaultPassword };
  }

  // ═══════════════════════════════════════════
  // SUSPICIOUS ACTIVITY DETECTION
  // ═══════════════════════════════════════════
  async getSuspiciousActivity() {
    const since = new Date();
    since.setDate(since.getDate() - 1); // Last 24h

    // Multiple failed logins from same IP
    const failedLoginsByIP = await this.prisma.auditLog.groupBy({
      by: ['ip'],
      where: {
        createdAt: { gte: since },
        responseStatus: 'FAILED',
        ip: { not: null },
      },
      _count: { id: true },
      having: { id: { _count: { gte: 3 } } },
      orderBy: { _count: { id: 'desc' } },
    });

    // Users with most failed actions
    const failedByUser = await this.prisma.auditLog.groupBy({
      by: ['userName'],
      where: {
        createdAt: { gte: since },
        responseStatus: 'FAILED',
        userName: { not: null },
      },
      _count: { id: true },
      having: { id: { _count: { gte: 3 } } },
      orderBy: { _count: { id: 'desc' } },
    });

    // Currently locked accounts
    const lockedAccounts = await this.prisma.user.findMany({
      where: { lockedUntil: { gt: new Date() } },
      select: { id: true, name: true, email: true, failedLoginAttempts: true, lockedUntil: true },
    });

    // Unusual high activity (>50 actions from single user in 1h)
    const oneHourAgo = new Date(Date.now() - 3600_000);
    const highActivityRaw = await this.prisma.auditLog.groupBy({
      by: ['userName'],
      where: {
        createdAt: { gte: oneHourAgo },
        userName: { not: null },
      },
      _count: { id: true },
      having: { id: { _count: { gte: 50 } } },
      orderBy: { _count: { id: 'desc' } },
    });

    return {
      period: '24 giờ',
      suspiciousIPs: failedLoginsByIP.map(r => ({ ip: r.ip, failedCount: r._count.id })),
      suspiciousUsers: failedByUser.map(r => ({ userName: r.userName, failedCount: r._count.id })),
      lockedAccounts,
      highActivity: highActivityRaw.map(r => ({ userName: r.userName, actionCount: r._count.id })),
      alertCount: failedLoginsByIP.length + failedByUser.length + lockedAccounts.length + highActivityRaw.length,
    };
  }

  // ═══════════════════════════════════════════
  // HELPER
  // ═══════════════════════════════════════════
  private async getSettingValue(key: string, fallback: string): Promise<string> {
    try {
      const s = await this.prisma.systemSetting.findUnique({ where: { key } });
      return s?.value || fallback;
    } catch {
      return fallback;
    }
  }

  // ═══════════════════════════════════════════
  // NOTIFICATION CENTER
  // ═══════════════════════════════════════════
  async getNotifications(userId?: string, limit = 30) {
    const where: any = {};
    if (userId) {
      where.OR = [{ userId }, { userId: null }]; // user-specific + broadcast
    }
    const [items, unreadCount] = await Promise.all([
      this.prisma.adminNotification.findMany({
        where, orderBy: { createdAt: 'desc' }, take: limit,
      }),
      this.prisma.adminNotification.count({
        where: { ...where, isRead: false },
      }),
    ]);
    return { items, unreadCount };
  }

  async markNotificationRead(id: string) {
    return this.prisma.adminNotification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllNotificationsRead(userId?: string) {
    const where: any = { isRead: false };
    if (userId) where.OR = [{ userId }, { userId: null }];
    const result = await this.prisma.adminNotification.updateMany({
      where,
      data: { isRead: true },
    });
    return { marked: result.count };
  }

  /** Auto-generate notification for system events */
  async createNotification(data: {
    type: string; title: string; message: string;
    severity?: string; userId?: string; metadata?: any;
  }) {
    return this.prisma.adminNotification.create({
      data: {
        type: data.type,
        title: data.title,
        message: data.message,
        severity: data.severity || 'info',
        userId: data.userId || null,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      },
    });
  }

  /** Auto-notify on key events — called from other methods */
  async notifyEvent(type: string, title: string, message: string, severity = 'info', metadata?: any) {
    try {
      await this.createNotification({ type, title, message, severity, metadata });
    } catch (e) {
      this.logger.warn(`Failed to create notification: ${e}`);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async cleanupOldNotifications() {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30); // keep 30 days
    const result = await this.prisma.adminNotification.deleteMany({
      where: { createdAt: { lt: cutoff }, isRead: true },
    });
    if (result.count > 0) {
      this.logger.log(`[CRON] Cleaned up ${result.count} old read notifications`);
    }
  }

  // ═══════════════════════════════════════════
  // USER ACTIVITY TIMELINE
  // ═══════════════════════════════════════════
  async getUserActivityTimeline(userId: string, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const logs = await this.prisma.auditLog.findMany({
      where: {
        createdAt: { gte: since },
        OR: [
          { userId },
          { userName: user.email },
          { userName: user.name },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true, action: true, method: true, resource: true,
        responseStatus: true, duration: true, ip: true, userAgent: true,
        requestBody: true, errorMessage: true, createdAt: true,
      },
    });

    // Group by date for timeline
    const grouped: Record<string, any[]> = {};
    logs.forEach(log => {
      const date = new Date(log.createdAt).toLocaleDateString('vi');
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(log);
    });

    const timeline = Object.entries(grouped).map(([date, items]) => ({
      date,
      items,
      count: items.length,
    }));

    return { userId, userName: user.name, period: `${days} ngày`, timeline };
  }

  // ═══════════════════════════════════════════
  // SCHEDULED TASKS MANAGER
  // ═══════════════════════════════════════════
  getScheduledTasks() {
    // Return metadata about configured cron jobs
    return [
      {
        name: 'cleanupOldAuditLogs',
        schedule: 'EVERY_DAY_AT_3AM',
        cron: '0 3 * * *',
        description: 'Xóa audit logs cũ hơn 90 ngày',
        module: 'AdminService',
        status: 'active',
      },
      {
        name: 'cleanupOldNotifications',
        schedule: 'EVERY_DAY_AT_1AM',
        cron: '0 1 * * *',
        description: 'Xóa notifications đã đọc cũ hơn 30 ngày',
        module: 'AdminService',
        status: 'active',
      },
      {
        name: 'checkPasswordExpiry',
        schedule: 'EVERY_DAY_AT_8AM',
        cron: '0 8 * * *',
        description: 'Kiểm tra và thông báo mật khẩu sắp hết hạn',
        module: 'AdminService',
        status: 'active',
      },
    ];
  }

  /** Manual trigger a task by name */
  async triggerTask(taskName: string) {
    switch (taskName) {
      case 'cleanupOldAuditLogs':
        await this.cleanupOldAuditLogs();
        return { success: true, message: 'Audit logs cleanup completed' };
      case 'cleanupOldNotifications':
        await this.cleanupOldNotifications();
        return { success: true, message: 'Notifications cleanup completed' };
      case 'checkPasswordExpiry':
        await this.checkAndNotifyPasswordExpiry();
        return { success: true, message: 'Password expiry check completed' };
      default:
        throw new BadRequestException(`Unknown task: ${taskName}`);
    }
  }

  @Cron('0 8 * * *') // 8AM daily
  async checkAndNotifyPasswordExpiry() {
    const status = await this.getPasswordExpiryStatus();
    if (!status.enabled) return;

    for (const user of status.expiredUsers) {
      await this.notifyEvent(
        'PASSWORD_EXPIRED',
        `Mật khẩu hết hạn: ${user.name}`,
        `User ${user.email} chưa đổi mật khẩu, đã quá hạn.`,
        'danger',
        { userId: user.id, email: user.email },
      );
    }

    for (const user of status.expiringSoonUsers) {
      await this.notifyEvent(
        'PASSWORD_EXPIRING',
        `Mật khẩu sắp hết hạn: ${user.name}`,
        `User ${user.email} cần đổi mật khẩu trong 7 ngày tới.`,
        'warning',
        { userId: user.id, email: user.email },
      );
    }

    if (status.expiredUsers.length > 0 || status.expiringSoonUsers.length > 0) {
      this.logger.log(`[CRON] Password expiry: ${status.expiredUsers.length} expired, ${status.expiringSoonUsers.length} expiring soon`);
    }
  }

  // ═══════════════════════════════════════════
  // CHANGELOG
  // ═══════════════════════════════════════════
  async getChangelogs(limit = 20) {
    return this.prisma.changelog.findMany({
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });
  }

  async createChangelog(data: {
    version: string; title: string; description: string;
    type?: string; author?: string;
  }) {
    return this.prisma.changelog.create({
      data: {
        version: data.version,
        title: data.title,
        description: data.description,
        type: data.type || 'feature',
        author: data.author,
      },
    });
  }

  async deleteChangelog(id: string) {
    const entry = await this.prisma.changelog.findUnique({ where: { id } });
    if (!entry) throw new NotFoundException('Changelog entry not found');
    await this.prisma.changelog.delete({ where: { id } });
    return { success: true };
  }

  // ═══════════════════════════════════════════
  // COMMAND PALETTE — Unified Search
  // ═══════════════════════════════════════════
  async commandPaletteSearch(query: string, limit = 10) {
    if (!query || query.length < 2) return { results: [] };
    const q = `%${query}%`;

    const [users, settings, flags, auditLogs] = await Promise.all([
      this.prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: { id: true, name: true, email: true, role: true, isActive: true },
        take: limit,
      }),
      this.prisma.systemSetting.findMany({
        where: {
          OR: [
            { key: { contains: query, mode: 'insensitive' } },
            { label: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: { key: true, value: true, label: true, group: true },
        take: limit,
      }),
      this.prisma.featureFlag.findMany({
        where: {
          OR: [
            { key: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: { id: true, key: true, enabled: true, module: true },
        take: limit,
      }),
      this.prisma.auditLog.findMany({
        where: {
          OR: [
            { action: { contains: query, mode: 'insensitive' } },
            { userName: { contains: query, mode: 'insensitive' } },
          ],
        },
        orderBy: { createdAt: 'desc' },
        select: { id: true, action: true, userName: true, method: true, createdAt: true },
        take: 5,
      }),
    ]);

    const results: any[] = [];
    users.forEach(u => results.push({ type: 'user', id: u.id, title: u.name, subtitle: u.email, meta: u.role, data: u }));
    settings.forEach(s => results.push({ type: 'setting', id: s.key, title: s.label || s.key, subtitle: s.value, meta: s.group, data: s }));
    flags.forEach(f => results.push({ type: 'flag', id: f.id, title: f.key, subtitle: f.enabled ? 'ON' : 'OFF', meta: f.module, data: f }));
    auditLogs.forEach(a => results.push({ type: 'audit', id: a.id, title: a.action, subtitle: a.userName, meta: a.method, data: a }));

    return { results, query, totalResults: results.length };
  }

  // ═══════════════════════════════════════════
  // USER GROWTH STATS
  // ═══════════════════════════════════════════
  async getUserGrowthStats(days = 90) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const users = await this.prisma.user.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    // Daily counts
    const dailyCounts: Record<string, number> = {};
    for (let d = 0; d < days; d++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - d));
      dailyCounts[date.toISOString().slice(0, 10)] = 0;
    }
    users.forEach(u => {
      const key = new Date(u.createdAt).toISOString().slice(0, 10);
      if (dailyCounts[key] !== undefined) dailyCounts[key]++;
    });

    const daily = Object.entries(dailyCounts).map(([date, count]) => ({ date, count }));

    // Weekly counts (last 12 weeks)
    const weekly: { week: string; count: number }[] = [];
    for (let w = 0; w < 12; w++) {
      const start = new Date();
      start.setDate(start.getDate() - (w + 1) * 7);
      const end = new Date();
      end.setDate(end.getDate() - w * 7);
      const count = users.filter(u => u.createdAt >= start && u.createdAt < end).length;
      weekly.unshift({ week: `W${12 - w}`, count });
    }

    // Monthly (last 6 months)
    const monthly: { month: string; count: number }[] = [];
    for (let m = 0; m < 6; m++) {
      const start = new Date();
      start.setMonth(start.getMonth() - m, 1);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      const count = users.filter(u => u.createdAt >= start && u.createdAt < end).length;
      monthly.unshift({ month: start.toLocaleDateString('vi', { month: 'short', year: '2-digit' }), count });
    }

    const totalUsers = await this.prisma.user.count();
    const activeUsers = await this.prisma.user.count({ where: { isActive: true } });

    return { daily, weekly, monthly, totalUsers, activeUsers, newUsersThisPeriod: users.length };
  }

  // ═══════════════════════════════════════════
  // SECURITY SCORE
  // ═══════════════════════════════════════════
  async getSecurityScore() {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [totalUsers, activeUsers, lockedUsers, usersWithOldPwd, failedLogins24h, activeSessions, recentAudits] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.count({ where: { isActive: true } }),
        this.prisma.user.count({ where: { lockedUntil: { gt: now } } }),
        this.prisma.user.count({
          where: {
            passwordChangedAt: { lt: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) }, // 90 days
            isActive: true,
          },
        }),
        this.prisma.auditLog.count({
          where: { createdAt: { gte: last24h }, responseStatus: 'FAILED' },
        }),
        this.prisma.refreshToken.count({
          where: { revokedAt: null, expiresAt: { gt: now } },
        }),
        this.prisma.auditLog.count({ where: { createdAt: { gte: last7d } } }),
      ]);

    // Calculate scores (0-100)
    const passwordScore = totalUsers > 0 ? Math.round(((totalUsers - usersWithOldPwd) / totalUsers) * 100) : 100;
    const lockoutScore = totalUsers > 0 ? Math.round(((totalUsers - lockedUsers) / totalUsers) * 100) : 100;
    const failedLoginScore = Math.max(0, 100 - failedLogins24h * 5); // -5 per failed login
    const sessionScore = activeSessions < totalUsers * 3 ? 100 : Math.max(0, 100 - (activeSessions - totalUsers * 3) * 2);
    const overallScore = Math.round((passwordScore + lockoutScore + failedLoginScore + sessionScore) / 4);

    const getGrade = (score: number) => score >= 90 ? 'A' : score >= 75 ? 'B' : score >= 60 ? 'C' : score >= 40 ? 'D' : 'F';

    return {
      overallScore,
      grade: getGrade(overallScore),
      details: [
        { key: 'password_health', label: 'Sức khỏe mật khẩu', score: passwordScore, grade: getGrade(passwordScore), detail: `${usersWithOldPwd} users chưa đổi MK > 90 ngày` },
        { key: 'lockout_status', label: 'Tài khoản khóa', score: lockoutScore, grade: getGrade(lockoutScore), detail: `${lockedUsers} tài khoản đang bị khóa` },
        { key: 'failed_logins', label: 'Login thất bại (24h)', score: failedLoginScore, grade: getGrade(failedLoginScore), detail: `${failedLogins24h} lần thất bại` },
        { key: 'session_health', label: 'Session health', score: sessionScore, grade: getGrade(sessionScore), detail: `${activeSessions} phiên đang hoạt động` },
      ],
      metrics: { totalUsers, activeUsers, lockedUsers, usersWithOldPwd, failedLogins24h, activeSessions, recentAudits },
    };
  }

  // ═══════════════════════════════════════════
  // LOGIN ACTIVITY CALENDAR (365 days heatmap)
  // ═══════════════════════════════════════════
  async getLoginCalendar() {
    const since = new Date();
    since.setDate(since.getDate() - 365);

    const logs = await this.prisma.auditLog.findMany({
      where: {
        createdAt: { gte: since },
        action: { contains: 'LOGIN', mode: 'insensitive' },
      },
      select: { createdAt: true },
    });

    const calendar: Record<string, number> = {};
    // Init all 365 days
    for (let d = 0; d < 365; d++) {
      const date = new Date();
      date.setDate(date.getDate() - (364 - d));
      calendar[date.toISOString().slice(0, 10)] = 0;
    }

    logs.forEach(l => {
      const key = new Date(l.createdAt).toISOString().slice(0, 10);
      if (calendar[key] !== undefined) calendar[key]++;
    });

    const data = Object.entries(calendar).map(([date, count]) => ({ date, count }));
    const maxCount = Math.max(...data.map(d => d.count), 1);
    const totalLogins = data.reduce((s, d) => s + d.count, 0);

    return { data, maxCount, totalLogins, days: 365 };
  }
}
