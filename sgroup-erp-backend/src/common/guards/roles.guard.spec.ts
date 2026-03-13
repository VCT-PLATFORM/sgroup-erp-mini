import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';

// Helper tạo mock ExecutionContext
function createMockContext(user: Record<string, any> | null): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
    getHandler: () => {},
    getClass: () => {},
  } as unknown as ExecutionContext;
}

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
    jest.spyOn(reflector, 'getAllAndOverride');
  });

  it('nên được định nghĩa', () => {
    expect(guard).toBeDefined();
  });

  it('nên cho qua khi không có @Roles() decorator', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(null);

    const ctx = createMockContext({ role: 'employee' });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('nên cho qua khi user có role khớp chính xác', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['admin']);

    const ctx = createMockContext({ role: 'admin', salesRole: null });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('nên cho qua khi user salesRole khớp chính xác', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['sales_manager']);

    const ctx = createMockContext({ role: 'employee', salesRole: 'sales_manager' });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('nên throw ForbiddenException khi role không khớp', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['admin']);

    const ctx = createMockContext({ role: 'employee', salesRole: 'sales' });
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('SECURITY: sales_manager KHÔNG được pass check yêu cầu "sales" bằng includes()', () => {
    // Bug cũ: "sales_manager".includes("sales") === true → BYPASS
    // Fix mới: exact match === → BLOCKED
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['sales']);

    const ctx = createMockContext({ role: 'employee', salesRole: 'sales_manager' });
    // sales_manager KHÔNG phải là "sales" — phải bị block
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('SECURITY: "sales_admin" KHÔNG được bypass check yêu cầu "admin"', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['admin']);

    const ctx = createMockContext({ role: 'employee', salesRole: 'sales_admin' });
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('SECURITY: "ceo" KHÔNG pass check yêu cầu "ceo_admin"', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['ceo_admin']);

    const ctx = createMockContext({ role: 'ceo', salesRole: null });
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('nên throw ForbiddenException khi user là null', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['admin']);

    const ctx = createMockContext(null);
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('nên cho qua khi có nhiều roles và user có 1 trong số đó', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue([
      'admin',
      'sales_manager',
      'hr',
    ]);

    const ctx = createMockContext({ role: 'employee', salesRole: 'sales_manager' });
    expect(guard.canActivate(ctx)).toBe(true);
  });
});
