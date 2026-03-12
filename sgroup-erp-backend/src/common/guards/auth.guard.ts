import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';

/**
 * Skeleton auth guard — always allows through in development.
 * TODO: Implement JWT verification when auth is ready.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    // TODO: Verify JWT token from Authorization header
    this.logger.debug(`AuthGuard: ${request.method} ${request.url} — ALLOWED (dev mode)`);
    return true;
  }
}
