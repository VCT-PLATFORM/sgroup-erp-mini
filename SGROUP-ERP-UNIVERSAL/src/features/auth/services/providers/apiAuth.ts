import { AuthProvider } from '../authProvider';
import { apiFetch } from '../../../../core/api/api';
import { AuthUser } from '../../types';

export const apiAuthProvider: AuthProvider = {
  async login(email: string, password: string) {
    const res = await apiFetch<{ user: AuthUser; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return res;
  },
  async logout() {
    await apiFetch('/auth/logout', { method: 'POST' });
  },
};
