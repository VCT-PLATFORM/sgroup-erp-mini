---
name: Error Handling
description: Comprehensive error handling patterns for frontend, backend, and cross-cutting concerns in SGROUP ERP
---

# Error Handling Skill — SGROUP ERP

> Kinh nghiệm từ thực tế fix lỗi production. Mọi feature PHẢI tuân thủ các pattern này.

---

## 1 · Frontend Error Handling

### 1.1 ErrorBoundary (Render-time Crashes)

Mỗi feature module phải được wrap trong ErrorBoundary:

```tsx
// src/features/<module>/components/<Module>ErrorBoundary.tsx
import React, { Component, type ReactNode } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { AlertTriangle, RefreshCw } from 'lucide-react-native';

type Props = { children: ReactNode };
type State = { hasError: boolean; error: Error | null };

export class SalesErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[SalesErrorBoundary]', error, info.componentStack);
    // TODO: Send to error tracking (Sentry)
  }

  handleReset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 48, backgroundColor: '#0f172a' }}>
          <AlertTriangle size={40} color="#ef4444" />
          <Text style={{ color: '#fff', fontSize: 22, fontWeight: '900', marginTop: 24 }}>
            Đã xảy ra lỗi
          </Text>
          {__DEV__ && this.state.error && (
            <Text style={{ color: '#ef4444', fontSize: 11, fontFamily: Platform.OS === 'web' ? 'monospace' : undefined }}>
              {this.state.error.message}
            </Text>
          )}
          <TouchableOpacity onPress={this.handleReset}>
            <RefreshCw size={18} color="#fff" />
            <Text style={{ color: '#fff' }}>Thử Lại</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}
```

### 1.2 API Error Handling (Async Operations)

```tsx
// ✅ Standard pattern in Zustand store
fetchData: async () => {
  set({ loading: true, error: null });
  try {
    const { data: raw } = await api.get('/endpoint');
    const items = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : []);
    set({ items, loading: false });
  } catch (error: any) {
    const status = error?.response?.status;
    const message = error?.response?.data?.message
      ?? error?.response?.data?.error?.message
      ?? error?.message
      ?? 'Đã có lỗi xảy ra';

    // Don't set error for 401 — interceptor handles logout
    if (status === 401) { set({ loading: false }); return; }

    set({ error: message, loading: false });
  }
},
```

### 1.3 User-Friendly Error Display

```tsx
// ❌ NEVER show raw error objects
Alert.alert('Error', error); // Shows [object Object]

// ✅ Extract human-readable message
const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.response?.data?.error?.message) return error.response.data.error.message;
  if (error?.message) return error.message;
  return 'Đã có lỗi xảy ra. Vui lòng thử lại.';
};
```

### 1.4 Screen State Management

Every data-fetching screen must handle ALL states:

```tsx
const MyScreen = () => {
  const { items, loading, error } = useMyStore();

  if (loading) return <SGSkeleton count={5} />;
  if (error) return <SGEmptyState icon={<AlertTriangle />} title="Lỗi" description={error} />;
  if (!items?.length) return <SGEmptyState title="Chưa có dữ liệu" />;

  return <FlatList data={items} renderItem={...} />;
};
```

---

## 2 · Backend Error Handling

### 2.1 Exception Filter (Global)

```typescript
// src/common/filters/all-exceptions.filter.ts
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : 500;

    const message = exception instanceof HttpException
      ? exception.message
      : 'Internal server error';

    // Log for debugging
    console.error(`[${status}] ${message}`, exception);

    // Consistent error response
    response.status(status).json({
      error: { code: status, message }
    });
  }
}
```

### 2.2 Service Error Patterns

```typescript
// ✅ Throw specific HTTP exceptions
async findOne(id: string) {
  const item = await this.prisma.item.findUnique({ where: { id } });
  if (!item) throw new NotFoundException(`Item ${id} not found`);
  return item;
}

// ✅ Handle Prisma errors
async create(dto: CreateDto) {
  try {
    return await this.prisma.item.create({ data: dto });
  } catch (error) {
    if (error.code === 'P2002') {
      throw new ConflictException('Duplicate entry');
    }
    throw new InternalServerErrorException('Failed to create item');
  }
}
```

### 2.3 Guard Authorization Errors

```typescript
// ✅ Clear 403 messages
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(), context.getClass(),
    ]);
    if (!requiredRoles) return true;
    const { user } = context.switchToHttp().getRequest();
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        `Role '${user.role}' không có quyền truy cập. Yêu cầu: ${requiredRoles.join(', ')}`
      );
    }
    return true;
  }
}
```

---

## 3 · Cross-Cutting: Axios Interceptor

```typescript
// src/shared/api.ts
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      // Token expired — auto logout
      await AsyncStorage.removeItem('auth_token');
      // Navigate to login (use navigation ref or event)
    }

    // Always reject so individual catch blocks can handle
    return Promise.reject(error);
  }
);
```

---

## 4 · Error Handling Checklist

| Area | Check | Priority |
|------|-------|----------|
| Feature Module | ErrorBoundary wraps all routes | 🔴 Must |
| API Call | `try/catch` in every async function | 🔴 Must |
| API Response | `Array.isArray()` before `.map()` | 🔴 Must |
| Property Access | Optional chaining `?.` | 🔴 Must |
| Screen | Loading / Error / Empty states | 🔴 Must |
| Error Message | Human-readable (not JSON) | 🟡 Should |
| 401 Response | Auto logout via interceptor | 🟡 Should |
| 403 Response | Show "Access Denied" UI | 🟡 Should |
| Network Error | Show retry option | 🟡 Should |
| Prisma Error | Catch P2002 (duplicate) | 🟢 Nice |
