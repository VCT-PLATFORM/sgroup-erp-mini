/**
 * UserManagementScreen — Manage system users (Phase 2 Upgraded)
 * Full CRUD: Create, Search (debounced), Filter, Edit name/role/dept, Deactivate, Reset Password, Pagination
 */
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Platform, ActivityIndicator, Alert, Modal } from 'react-native';
import {
  Users, Search, Shield, X, Pencil, UserCircle, Mail, Calendar, Plus,
  UserX, UserCheck, ChevronLeft, ChevronRight, Key, Building,
} from 'lucide-react-native';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { sgds } from '../../../shared/theme/theme';
import { useAdminUsers, useUpdateUser, useCreateUser, useDeactivateUser, useResetPassword } from '../hooks/useAdmin';

const ROLE_OPTIONS = [
  { value: 'admin',    label: 'Admin',      color: '#ef4444' },
  { value: 'hr',       label: 'HR',         color: '#ec4899' },
  { value: 'employee', label: 'Nhân viên',  color: '#6366f1' },
  { value: 'sales',    label: 'Sales',      color: '#3b82f6' },
  { value: 'ceo',      label: 'CEO',        color: '#f59e0b' },
];

const DEPT_OPTIONS = ['SALES', 'MARKETING', 'HR', 'FINANCE', 'OPS'];

export function UserManagementScreen() {
  const { theme, isDark } = useAppTheme();
  const cText = theme.colors.textPrimary;
  const cSub = theme.colors.textSecondary;
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : '#ffffff';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  // Search debounce
  const debounceRef = useRef<any>(null);
  const handleSearch = useCallback((t: string) => {
    setSearch(t);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { setDebouncedSearch(t); setPage(1); }, 500);
  }, []);

  // Edit modal state
  const [editModal, setEditModal] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editDept, setEditDept] = useState('');

  // Create modal state
  const [createModal, setCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'employee', department: '' });

  // Reset password modal
  const [resetModal, setResetModal] = useState(false);
  const [resetUserId, setResetUserId] = useState('');
  const [resetUserName, setResetUserName] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const { data: rawData, isLoading } = useAdminUsers({
    search: debouncedSearch || undefined,
    role: roleFilter || undefined,
    status: statusFilter || undefined,
    page,
    limit: 20,
  });
  const updateUser = useUpdateUser();
  const createUser = useCreateUser();
  const deactivateUser = useDeactivateUser();
  const resetPassword = useResetPassword();

  const users = useMemo(() => {
    if (!rawData) return [];
    return Array.isArray(rawData) ? rawData : rawData.data ?? [];
  }, [rawData]);

  const meta = rawData?.meta ?? { total: users.length, page: 1, totalPages: 1 };

  const inputStyle: any = {
    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f8fafc',
    borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 14, color: cText, flex: 1,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
  };

  const showAlert = (msg: string) => {
    Platform.OS === 'web' ? window.alert(msg) : Alert.alert('Thông báo', msg);
  };

  // Open edit modal with user data
  const openEdit = (user: any) => {
    setEditUser(user);
    setEditName(user.name || '');
    setEditRole(user.role || 'employee');
    setEditDept(user.department || '');
    setEditModal(true);
  };

  const handleUpdateUser = async () => {
    if (!editUser) return;
    const data: any = {};
    if (editName !== editUser.name) data.name = editName;
    if (editRole !== editUser.role) data.role = editRole;
    if (editDept !== (editUser.department || '')) data.department = editDept || null;

    if (Object.keys(data).length === 0) {
      setEditModal(false);
      return;
    }

    // Warn if changing to admin
    if (data.role === 'admin' && editUser.role !== 'admin') {
      if (Platform.OS === 'web') {
        if (!window.confirm('⚠️ Bạn sắp cấp quyền ADMIN cho user này. Tiếp tục?')) return;
      }
    }

    try {
      await updateUser.mutateAsync({ id: editUser.id, data });
      setEditModal(false);
      setEditUser(null);
    } catch (e: any) {
      showAlert(e?.response?.data?.message || e?.message || 'Lỗi');
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      showAlert('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    try {
      await createUser.mutateAsync(newUser);
      setCreateModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'employee', department: '' });
      showAlert('Tạo user thành công!');
    } catch (e: any) {
      showAlert(e?.response?.data?.message || e?.message || 'Lỗi');
    }
  };

  const handleDeactivate = async (user: any) => {
    const action = user.isActive ? 'vô hiệu hóa' : 'kích hoạt lại';
    if (Platform.OS === 'web') {
      if (!window.confirm(`Bạn có chắc muốn ${action} user "${user.name}"?`)) return;
    }
    try {
      await deactivateUser.mutateAsync(user.id);
    } catch (e: any) {
      showAlert(e?.response?.data?.message || e?.message || 'Lỗi');
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 8) {
      showAlert('Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }
    try {
      await resetPassword.mutateAsync({ id: resetUserId, newPassword });
      setResetModal(false);
      setNewPassword('');
      showAlert('Đặt lại mật khẩu thành công!');
    } catch (e: any) {
      showAlert(e?.response?.data?.message || e?.message || 'Lỗi');
    }
  };

  const getRoleStyle = (role: string) => {
    const r = ROLE_OPTIONS.find(o => o.value === role);
    return r || { label: role, color: '#64748b' };
  };

  const modalOverlay: any = {
    position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 9999,
    ...(Platform.OS === 'web' ? { position: 'fixed' } : {}),
  };

  const modalBox = {
    width: Platform.OS === 'web' ? 480 : '90%', borderRadius: 24,
    backgroundColor: isDark ? '#1e293b' : '#ffffff', padding: 28,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
    } : { shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 20, elevation: 20 }),
  } as any;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 28, gap: 20, paddingBottom: 120 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={{ width: 52, height: 52, borderRadius: 18, backgroundColor: isDark ? 'rgba(99,102,241,0.12)' : '#eef2ff', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={24} color="#6366f1" />
            </View>
            <View>
              <Text style={{ ...sgds.typo.h2, color: cText }}>Quản lý người dùng</Text>
              <Text style={{ ...sgds.typo.body, color: cSub, marginTop: 2 }}>{meta.total} tài khoản</Text>
            </View>
          </View>
          <Pressable
            onPress={() => setCreateModal(true)}
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 8,
              paddingHorizontal: 18, paddingVertical: 12, borderRadius: 14, backgroundColor: '#6366f1',
              ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}),
            } as any}
          >
            <Plus size={16} color="#fff" />
            <Text style={{ fontSize: 13, fontWeight: '800', color: '#fff' }}>Tạo User</Text>
          </Pressable>
        </View>

        {/* Search + Filters */}
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
          <View style={{
            flex: 1, minWidth: 220, flexDirection: 'row', alignItems: 'center', gap: 8,
            backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f8fafc',
            borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
            borderRadius: 14, paddingHorizontal: 14,
          }}>
            <Search size={16} color={cSub} />
            <TextInput
              value={search}
              onChangeText={handleSearch}
              placeholder="Tìm theo tên, email..."
              placeholderTextColor={cSub}
              style={[inputStyle, { borderWidth: 0, paddingHorizontal: 0, backgroundColor: 'transparent' }]}
            />
          </View>
          {/* Role filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, alignItems: 'center' }}>
            <Pressable
              onPress={() => { setRoleFilter(''); setPage(1); }}
              style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: !roleFilter ? '#6366f1' : (isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9') }}
            >
              <Text style={{ fontSize: 11, fontWeight: '700', color: !roleFilter ? '#fff' : cSub }}>Tất cả</Text>
            </Pressable>
            {ROLE_OPTIONS.map(r => (
              <Pressable
                key={r.value}
                onPress={() => { setRoleFilter(roleFilter === r.value ? '' : r.value); setPage(1); }}
                style={{
                  paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10,
                  backgroundColor: roleFilter === r.value ? `${r.color}20` : (isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'),
                  borderWidth: roleFilter === r.value ? 1 : 0, borderColor: r.color,
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: '700', color: roleFilter === r.value ? r.color : cSub }}>{r.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
          {/* Status filter */}
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {[
              { value: '', label: 'All', icon: null },
              { value: 'active', label: 'Active', icon: UserCheck, color: '#10b981' },
              { value: 'inactive', label: 'Inactive', icon: UserX, color: '#ef4444' },
            ].map(s => (
              <Pressable
                key={s.value}
                onPress={() => { setStatusFilter(statusFilter === s.value ? '' : s.value); setPage(1); }}
                style={{
                  paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 4,
                  backgroundColor: statusFilter === s.value ? (s.color ? `${s.color}15` : '#6366f1') : (isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'),
                }}
              >
                {s.icon && <s.icon size={12} color={statusFilter === s.value ? s.color : cSub} />}
                <Text style={{ fontSize: 11, fontWeight: '700', color: statusFilter === s.value ? (s.color || '#fff') : cSub }}>{s.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* User List */}
        {isLoading ? (
          <View style={{ padding: 60, alignItems: 'center' }}><ActivityIndicator size="large" color="#6366f1" /></View>
        ) : users.length === 0 ? (
          <View style={{ padding: 60, alignItems: 'center', borderRadius: 20, backgroundColor: cardBg, borderWidth: 1, borderColor }}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>👤</Text>
            <Text style={{ fontSize: 14, fontWeight: '700', color: cSub }}>Không tìm thấy user nào</Text>
          </View>
        ) : (
          <View style={{ borderRadius: 20, backgroundColor: cardBg, borderWidth: 1, borderColor, overflow: 'hidden' }}>
            {users.map((user: any, i: number) => {
              const roleStyle = getRoleStyle(user.role);
              return (
                <View key={user.id} style={{
                  flexDirection: 'row', alignItems: 'center', gap: 12,
                  padding: 16, borderBottomWidth: i < users.length - 1 ? 1 : 0, borderBottomColor: borderColor,
                }}>
                  {/* Avatar */}
                  <View style={{
                    width: 44, height: 44, borderRadius: 14,
                    backgroundColor: `${roleStyle.color}12`,
                    alignItems: 'center', justifyContent: 'center',
                    opacity: user.isActive === false ? 0.5 : 1,
                  }}>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: roleStyle.color }}>
                      {user.name?.charAt(0)?.toUpperCase() || '?'}
                    </Text>
                  </View>

                  {/* Info */}
                  <View style={{ flex: 1, opacity: user.isActive === false ? 0.6 : 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: cText }}>{user.name}</Text>
                      {user.isActive === false && (
                        <View style={{ paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4, backgroundColor: 'rgba(239,68,68,0.12)' }}>
                          <Text style={{ fontSize: 8, fontWeight: '800', color: '#ef4444' }}>INACTIVE</Text>
                        </View>
                      )}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Mail size={11} color={cSub} />
                      <Text style={{ fontSize: 11, fontWeight: '600', color: cSub }}>{user.email}</Text>
                    </View>
                    {user.department && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                        <Building size={10} color={cSub} />
                        <Text style={{ fontSize: 10, fontWeight: '600', color: cSub }}>{user.department}</Text>
                      </View>
                    )}
                  </View>

                  {/* Role badge */}
                  <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: `${roleStyle.color}12` }}>
                    <Text style={{ fontSize: 10, fontWeight: '800', color: roleStyle.color }}>{roleStyle.label}</Text>
                  </View>

                  {/* Actions */}
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    <Pressable
                      onPress={() => openEdit(user)}
                      style={{ width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9' }}
                    >
                      <Pencil size={14} color="#6366f1" />
                    </Pressable>
                    <Pressable
                      onPress={() => { setResetUserId(user.id); setResetUserName(user.name); setNewPassword(''); setResetModal(true); }}
                      style={{ width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9' }}
                    >
                      <Key size={14} color="#f59e0b" />
                    </Pressable>
                    <Pressable
                      onPress={() => handleDeactivate(user)}
                      style={{ width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: user.isActive ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)' }}
                    >
                      {user.isActive ? <UserX size={14} color="#ef4444" /> : <UserCheck size={14} color="#10b981" />}
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 8 }}>
            <Pressable
              onPress={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              style={{
                width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
                backgroundColor: page <= 1 ? (isDark ? 'rgba(255,255,255,0.03)' : '#f1f5f9') : '#6366f1',
              }}
            >
              <ChevronLeft size={16} color={page <= 1 ? cSub : '#fff'} />
            </Pressable>
            <Text style={{ fontSize: 13, fontWeight: '700', color: cText }}>
              Trang {meta.page} / {meta.totalPages}
            </Text>
            <Pressable
              onPress={() => setPage(p => Math.min(meta.totalPages, p + 1))}
              disabled={page >= meta.totalPages}
              style={{
                width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
                backgroundColor: page >= meta.totalPages ? (isDark ? 'rgba(255,255,255,0.03)' : '#f1f5f9') : '#6366f1',
              }}
            >
              <ChevronRight size={16} color={page >= meta.totalPages ? cSub : '#fff'} />
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* ═══ CREATE USER MODAL ═══ */}
      {createModal && (
        <View style={modalOverlay}>
          <View style={modalBox}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: cText }}>Tạo User mới</Text>
              <Pressable onPress={() => setCreateModal(false)}><X size={20} color={cSub} /></Pressable>
            </View>
            <View style={{ gap: 14 }}>
              <View>
                <Text style={{ fontSize: 12, fontWeight: '700', color: cSub, marginBottom: 6 }}>Họ tên *</Text>
                <TextInput value={newUser.name} onChangeText={t => setNewUser(p => ({ ...p, name: t }))} placeholder="Nguyễn Văn A" placeholderTextColor={cSub} style={inputStyle} />
              </View>
              <View>
                <Text style={{ fontSize: 12, fontWeight: '700', color: cSub, marginBottom: 6 }}>Email *</Text>
                <TextInput value={newUser.email} onChangeText={t => setNewUser(p => ({ ...p, email: t }))} placeholder="user@sgroup.vn" keyboardType="email-address" placeholderTextColor={cSub} style={inputStyle} />
              </View>
              <View>
                <Text style={{ fontSize: 12, fontWeight: '700', color: cSub, marginBottom: 6 }}>Mật khẩu * (≥ 8 ký tự)</Text>
                <TextInput value={newUser.password} onChangeText={t => setNewUser(p => ({ ...p, password: t }))} placeholder="••••••••" secureTextEntry placeholderTextColor={cSub} style={inputStyle} />
              </View>
              <View>
                <Text style={{ fontSize: 12, fontWeight: '700', color: cSub, marginBottom: 6 }}>Vai trò</Text>
                <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                  {ROLE_OPTIONS.map(r => (
                    <Pressable key={r.value} onPress={() => setNewUser(p => ({ ...p, role: r.value }))} style={{
                      paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10,
                      backgroundColor: newUser.role === r.value ? `${r.color}20` : (isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'),
                      borderWidth: newUser.role === r.value ? 1 : 0, borderColor: r.color,
                    }}>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: newUser.role === r.value ? r.color : cSub }}>{r.label}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
              <View>
                <Text style={{ fontSize: 12, fontWeight: '700', color: cSub, marginBottom: 6 }}>Phòng ban</Text>
                <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                  {DEPT_OPTIONS.map(d => (
                    <Pressable key={d} onPress={() => setNewUser(p => ({ ...p, department: p.department === d ? '' : d }))} style={{
                      paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10,
                      backgroundColor: newUser.department === d ? 'rgba(99,102,241,0.15)' : (isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'),
                      borderWidth: newUser.department === d ? 1 : 0, borderColor: '#6366f1',
                    }}>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: newUser.department === d ? '#6366f1' : cSub }}>{d}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
            <Pressable onPress={handleCreateUser} disabled={createUser.isPending} style={{
              marginTop: 24, paddingVertical: 14, borderRadius: 14, backgroundColor: '#6366f1', alignItems: 'center',
              opacity: createUser.isPending ? 0.6 : 1,
            }}>
              <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff' }}>
                {createUser.isPending ? 'Đang tạo...' : 'Tạo User'}
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* ═══ EDIT USER MODAL ═══ */}
      {editModal && editUser && (
        <View style={modalOverlay}>
          <View style={modalBox}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: cText }}>Chỉnh sửa User</Text>
              <Pressable onPress={() => setEditModal(false)}><X size={20} color={cSub} /></Pressable>
            </View>
            {/* User info header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20, padding: 14, borderRadius: 14, backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc' }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: `${getRoleStyle(editUser.role).color}15`, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: getRoleStyle(editUser.role).color }}>{editUser.name?.charAt(0)?.toUpperCase()}</Text>
              </View>
              <View>
                <Text style={{ fontSize: 13, fontWeight: '600', color: cSub }}>{editUser.email}</Text>
                <Text style={{ fontSize: 10, fontWeight: '600', color: `${cSub}80` }}>ID: {editUser.id?.slice(0, 8)}...</Text>
              </View>
            </View>
            <View style={{ gap: 14 }}>
              <View>
                <Text style={{ fontSize: 12, fontWeight: '700', color: cSub, marginBottom: 6 }}>Họ tên</Text>
                <TextInput value={editName} onChangeText={setEditName} placeholderTextColor={cSub} style={inputStyle} />
              </View>
              <View>
                <Text style={{ fontSize: 12, fontWeight: '700', color: cSub, marginBottom: 6 }}>Vai trò</Text>
                <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                  {ROLE_OPTIONS.map(r => (
                    <Pressable key={r.value} onPress={() => setEditRole(r.value)} style={{
                      paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10,
                      backgroundColor: editRole === r.value ? `${r.color}20` : (isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'),
                      borderWidth: editRole === r.value ? 1 : 0, borderColor: r.color,
                    }}>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: editRole === r.value ? r.color : cSub }}>{r.label}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
              <View>
                <Text style={{ fontSize: 12, fontWeight: '700', color: cSub, marginBottom: 6 }}>Phòng ban</Text>
                <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                  <Pressable onPress={() => setEditDept('')} style={{
                    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10,
                    backgroundColor: !editDept ? 'rgba(99,102,241,0.15)' : (isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'),
                  }}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: !editDept ? '#6366f1' : cSub }}>Không</Text>
                  </Pressable>
                  {DEPT_OPTIONS.map(d => (
                    <Pressable key={d} onPress={() => setEditDept(d)} style={{
                      paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10,
                      backgroundColor: editDept === d ? 'rgba(99,102,241,0.15)' : (isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'),
                      borderWidth: editDept === d ? 1 : 0, borderColor: '#6366f1',
                    }}>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: editDept === d ? '#6366f1' : cSub }}>{d}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
            <Pressable onPress={handleUpdateUser} disabled={updateUser.isPending} style={{
              marginTop: 24, paddingVertical: 14, borderRadius: 14, backgroundColor: '#6366f1', alignItems: 'center',
              opacity: updateUser.isPending ? 0.6 : 1,
            }}>
              <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff' }}>
                {updateUser.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* ═══ RESET PASSWORD MODAL ═══ */}
      {resetModal && (
        <View style={modalOverlay}>
          <View style={modalBox}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: cText }}>Đặt lại mật khẩu</Text>
              <Pressable onPress={() => setResetModal(false)}><X size={20} color={cSub} /></Pressable>
            </View>
            <View style={{
              flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 12, marginBottom: 16,
              backgroundColor: 'rgba(245,158,11,0.08)', borderWidth: 1, borderColor: 'rgba(245,158,11,0.15)',
            }}>
              <Key size={16} color="#f59e0b" />
              <Text style={{ flex: 1, fontSize: 12, fontWeight: '600', color: cSub }}>
                Đặt lại mật khẩu cho <Text style={{ fontWeight: '800', color: cText }}>{resetUserName}</Text>
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 12, fontWeight: '700', color: cSub, marginBottom: 6 }}>Mật khẩu mới (≥ 8 ký tự)</Text>
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Nhập mật khẩu mới..."
                secureTextEntry
                placeholderTextColor={cSub}
                style={inputStyle}
              />
            </View>
            <Pressable onPress={handleResetPassword} disabled={resetPassword.isPending} style={{
              marginTop: 20, paddingVertical: 14, borderRadius: 14, backgroundColor: '#f59e0b', alignItems: 'center',
              opacity: resetPassword.isPending ? 0.6 : 1,
            }}>
              <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff' }}>
                {resetPassword.isPending ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
