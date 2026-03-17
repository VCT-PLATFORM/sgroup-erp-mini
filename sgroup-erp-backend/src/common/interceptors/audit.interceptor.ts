/**
 * AuditInterceptor — NestJS interceptor that logs every mutation (POST, PATCH, DELETE)
 * into the audit_logs table for compliance tracking.
 */
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger('AuditInterceptor');

  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;

    // Only audit mutations
    if (!['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
      return next.handle();
    }

    const startTime = Date.now();
    const userId = req.user?.id || req.user?.sub || null;
    const userName = req.user?.name || req.user?.email || null;
    const resource = req.url.split('?')[0].replace(/^\/api\//, '').replace(/^\//, '');
    const action = `${method} /${resource}`;

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          this.writeAuditLog({
            userId,
            userName,
            action,
            resource,
            method,
            requestBody: method !== 'DELETE' ? this.safeStringify(req.body) : undefined,
            responseStatus: 'SUCCESS',
            duration,
            ip: req.ip || req.connection?.remoteAddress,
          });
        },
        error: (err) => {
          const duration = Date.now() - startTime;
          this.writeAuditLog({
            userId,
            userName,
            action,
            resource,
            method,
            requestBody: method !== 'DELETE' ? this.safeStringify(req.body) : undefined,
            responseStatus: 'FAILED',
            errorMessage: err.message,
            duration,
            ip: req.ip || req.connection?.remoteAddress,
          });
        },
      }),
    );
  }

  private async writeAuditLog(entry: {
    userId?: string | null;
    userName?: string | null;
    action: string;
    resource: string;
    method: string;
    requestBody?: string;
    responseStatus: string;
    errorMessage?: string;
    duration: number;
    ip?: string;
  }) {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId: entry.userId || undefined,
          userName: entry.userName || undefined,
          action: entry.action,
          resource: entry.resource,
          method: entry.method,
          requestBody: entry.requestBody,
          responseStatus: entry.responseStatus,
          errorMessage: entry.errorMessage,
          duration: entry.duration,
          ip: entry.ip,
        },
      });
    } catch (e) {
      // Silent fallback to console — never block the request
      this.logger.warn(
        `[AUDIT-FALLBACK] ${entry.userName || 'unknown'} ${entry.action} → ${entry.responseStatus}`,
      );
    }
  }

  private safeStringify(obj: any): string | undefined {
    try {
      if (!obj || Object.keys(obj).length === 0) return undefined;
      // Redact sensitive fields
      const redacted = { ...obj };
      if (redacted.password) redacted.password = '***REDACTED***';
      if (redacted.newPassword) redacted.newPassword = '***REDACTED***';
      return JSON.stringify(redacted).slice(0, 2000); // Cap at 2KB
    } catch {
      return undefined;
    }
  }
}
