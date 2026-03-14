import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: any;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((res) => {
        const timestamp = new Date().toISOString();
        if (res && typeof res === 'object' && 'data' in res) {
          return {
            success: true,
            data: res.data,
            meta: res.meta,
            timestamp,
          };
        }
        return {
          success: true,
          data: res as unknown as T,
          timestamp,
        };
      }),
    );
  }
}
