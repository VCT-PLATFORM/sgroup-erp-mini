/**
 * Admin DTOs — Manual validation (no class-validator dependency)
 * Whitelists allowed fields to prevent mass-assignment attacks
 */

// ═══════════════════════════════════════════
// Allowed values
// ═══════════════════════════════════════════
export const ALLOWED_ROLES = ['admin', 'hr', 'employee', 'sales', 'ceo'] as const;
export const ALLOWED_DEPARTMENTS = ['SALES', 'MARKETING', 'HR', 'FINANCE', 'OPS'] as const;

// ═══════════════════════════════════════════
// Create User
// ═══════════════════════════════════════════
export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
  role?: string;
  department?: string;
}

export function validateCreateUser(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!data.email || typeof data.email !== 'string' || !data.email.includes('@')) {
    errors.push('Email không hợp lệ');
  }
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push('Tên phải có ít nhất 2 ký tự');
  }
  if (!data.password || typeof data.password !== 'string' || data.password.length < 8) {
    errors.push('Mật khẩu phải có ít nhất 8 ký tự');
  }
  if (data.role && !ALLOWED_ROLES.includes(data.role)) {
    errors.push(`Role không hợp lệ. Cho phép: ${ALLOWED_ROLES.join(', ')}`);
  }
  if (data.department && !ALLOWED_DEPARTMENTS.includes(data.department)) {
    errors.push(`Department không hợp lệ. Cho phép: ${ALLOWED_DEPARTMENTS.join(', ')}`);
  }
  return { valid: errors.length === 0, errors };
}

// ═══════════════════════════════════════════
// Update User
// ═══════════════════════════════════════════
export interface UpdateUserDto {
  name?: string;
  role?: string;
  department?: string;
}

export function validateUpdateUser(data: any): { valid: boolean; errors: string[]; sanitized: UpdateUserDto } {
  const errors: string[] = [];
  const sanitized: UpdateUserDto = {};

  if (data.name !== undefined) {
    if (typeof data.name !== 'string' || data.name.trim().length < 2) {
      errors.push('Tên phải có ít nhất 2 ký tự');
    } else {
      sanitized.name = data.name.trim();
    }
  }
  if (data.role !== undefined) {
    if (!ALLOWED_ROLES.includes(data.role)) {
      errors.push(`Role không hợp lệ. Cho phép: ${ALLOWED_ROLES.join(', ')}`);
    } else {
      sanitized.role = data.role;
    }
  }
  if (data.department !== undefined) {
    if (data.department !== null && !ALLOWED_DEPARTMENTS.includes(data.department)) {
      errors.push(`Department không hợp lệ. Cho phép: ${ALLOWED_DEPARTMENTS.join(', ')}`);
    } else {
      sanitized.department = data.department;
    }
  }

  return { valid: errors.length === 0, errors, sanitized };
}

// ═══════════════════════════════════════════
// Update Setting
// ═══════════════════════════════════════════
export interface UpdateSettingDto {
  value: string;
}
