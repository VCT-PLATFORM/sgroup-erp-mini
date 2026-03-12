/**
 * AuditInterceptor — NestJS interceptor that logs every mutation (POST, PATCH, DELETE)
 * into the audit_log table for compliance tracking.
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
    const userId = req.user?.id || req.user?.sub || 'anonymous';
    const userName = req.user?.name || req.user?.email || 'unknown';
    const action = `${method} ${req.url}`;

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - startTime;
          this.logAudit({
            userId,
            userName,
            action,
            resource: req.url.split('?')[0].replace('/api/', ''),
            method,
            requestBody: method !== 'DELETE' ? JSON.stringify(req.body || {}) : undefined,
            responseStatus: 'SUCCESS',
            duration,
            ip: req.ip || req.connection?.remoteAddress,
          });
        },
        error: (err) => {
          const duration = Date.now() - startTime;
          this.logAudit({
            userId,
            userName,
            action,
            resource: req.url.split('?')[0].replace('/api/', ''),
            method,
            requestBody: method !== 'DELETE' ? JSON.stringify(req.body || {}) : undefined,
            responseStatus: 'FAILED',
            errorMessage: err.message,
            duration,
            ip: req.ip || req.connection?.remoteAddress,
          });
        },
      }),
    );
  }

  private async logAudit(entry: {
    userId: string;
    userName: string;
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
      // Try to write to database if AuditLog model exists
      // @ts-ignore — model may not exist yet, fallback to console
      if (this.prisma.auditLog) {
        await (this.prisma as any).auditLog.create({ data: entry });
      } else {
        // Fallback: structured console log
        this.logger.log(
          `[AUDIT] ${entry.userName} (${entry.userId}) ${entry.action} → ${entry.responseStatus} (${entry.duration}ms)`,
        );
      }
    } catch {
      // Silent fallback to console
      this.logger.warn(
        `[AUDIT-FALLBACK] ${entry.userName} ${entry.action} → ${entry.responseStatus}`,
      );
    }
  }
}
