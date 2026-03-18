/**
 * UserManagementScreen — Premium upgrade
 * Uses SGPageHeader, SGSearchBar, SGChip, SGPagination, SGAvatar, SGStatusBadge
 * SGSkeleton loading, SGEmptyState, SGConfirmDialog, SGButton
 * Modals extracted to separate files
 * NEW: Bulk actions, unlock user, locked status badge, export CSV, improved filters
 */
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Users, Pencil, Key, UserX, UserCheck, Plus, Building, Mail, Inbox,
  Lock, Unlock, Download, CheckSquare, Square, Upload, Eye,
} from 'lucide-react-native';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { typography, sgds, radius, spacing } from '../../../shared/theme/theme';
import { ROLE_OPTIONS, getRoleStyle } from '../constants/adminConstants';
import { showToast, showAlert, downloadFile } from '../utils/adminUtils';
import { SGPageHeader } from '../../../shared/ui/components/SGPageHeader';
import { SGSearchBar } from '../../../shared/ui/components/SGSearchBar';
import { SGChip } from '../../../shared/ui/components/SGChip';
import { SGPagination } from '../../../shared/ui/components/SGPagination';
import { SGAvatar } from '../../../shared/ui/components/SGAvatar';
import { SGStatusBadge } from '../../../shared/ui/components/SGStatusBadge';
import { SGSkeleton } from '../../../shared/ui/components/SGSkeleton';
import { SGEmptyState } from '../../../shared/ui/components/SGEmptyState';
import { SGButton } from '../../../shared/ui/components/SGButton';
import { SGConfirmDialog } from '../../../shared/ui/components/SGConfirmDialog';
import { SGSection } from '../../../shared/ui/components/SGSection';
import { useAdminUsers, useDeactivateUser, useUnlockUser, useBatchToggleUsers } from '../hooks/useAdmin';
import { exportUsersCSV } from '../api/adminApi';
import { CreateUserModal } from './CreateUserModal';
import { EditUserModal } from './EditUserModal';
import { ResetPasswordModal } from './ResetPasswordModal';
import { UserDetailDrawer } from './UserDetailDrawer';
import { BatchImportModal } from './BatchImportModal';



export function UserManagementScreen() {
  const { colors } = useAppTheme();

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  // Debounced search
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearch = useCallback((t: string) => {
    setSearch(t);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { setDebouncedSearch(t); setPage(1); }, 500);
  }, []);

  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  // Modal states
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [resetModal, setResetModal] = useState(false);
  const [resetUserId, setResetUserId] = useState('');
  const [resetUserName, setResetUserName] = useState('');

  // Confirm deactivate dialog
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmUser, setConfirmUser] = useState<any>(null);

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkConfirmVisible, setBulkConfirmVisible] = useState(false);
  const [bulkAction, setBulkAction] = useState<'activate' | 'deactivate'>('deactivate');

  // Tier 2: Detail drawer + Import modal
  const [detailUserId, setDetailUserId] = useState<string | null>(null);
  const [importVisible, setImportVisible] = useState(false);

  const { data: rawData, isLoading } = useAdminUsers({
    search: debouncedSearch || undefined,
    role: roleFilter || undefined,
    status: statusFilter || undefined,
    page,
    limit: 20,
  });
  const deactivateUser = useDeactivateUser();
  const unlockUserMut = useUnlockUser();
  const batchToggle = useBatchToggleUsers();

  const users = useMemo(() => {
    if (!rawData) return [];
    return Array.isArray(rawData) ? rawData : rawData.data ?? [];
  }, [rawData]);

  const meta = rawData?.meta ?? { total: users.length, page: 1, totalPages: 1 };

  const openEdit = (user: any) => {
    setEditUser(user);
    setEditModal(true);
  };

  const openReset = (user: any) => {
    setResetUserId(user.id);
    setResetUserName(user.name);
    setResetModal(true);
  };

  const confirmDeactivate = (user: any) => {
    setConfirmUser(user);
    setConfirmVisible(true);
  };

  const handleDeactivate = async () => {
    if (!confirmUser) return;
    try {
      await deactivateUser.mutateAsync(confirmUser.id);
      setConfirmVisible(false);
      setConfirmUser(null);
      showToast(
        confirmUser.isActive ? 'Đã vô hiệu hóa tài khoản' : 'Đã kích hoạt lại tài khoản',
        'success',
      );
    } catch (e: any) {
      showToast(e?.response?.data?.message || e?.message || 'Lỗi', 'error');
    }
  };

  const handleUnlock = async (user: any) => {
    try {
      await unlockUserMut.mutateAsync(user.id);
      showToast(`Đã mở khóa tài khoản ${user.name}`, 'success');
    } catch (e: any) {
      showToast(e?.response?.data?.message || e?.message || 'Lỗi', 'error');
    }
  };

  // Bulk actions
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === users.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(users.map((u: any) => u.id)));
    }
  };

  const handleBulkToggle = async () => {
    try {
      await batchToggle.mutateAsync({
        ids: Array.from(selectedIds),
        activate: bulkAction === 'activate',
      });
      setBulkConfirmVisible(false);
      setSelectedIds(new Set());
      showToast(
        `Đã ${bulkAction === 'activate' ? 'kích hoạt' : 'vô hiệu hóa'} ${selectedIds.size} tài khoản`,
        'success',
      );
    } catch (e: any) {
      showToast(e?.response?.data?.message || e?.message || 'Lỗi', 'error');
    }
  };

  const handleExportCSV = async () => {
    try {
      const csv = await exportUsersCSV({ role: roleFilter || undefined, status: statusFilter || undefined });
      downloadFile(csv, `users_export_${new Date().toISOString().slice(0, 10)}.csv`);
      showToast('Đã xuất file CSV', 'success');
    } catch (e: any) {
      showToast('Lỗi khi xuất CSV', 'error');
    }
  };

  const isLocked = (user: any) => user.lockedUntil && new Date(user.lockedUntil) > new Date();

  const renderUserItem = (user: any, index: number) => {
    const roleStyle = getRoleStyle(user.role);
    const locked = isLocked(user);
    const isSelected = selectedIds.has(user.id);
    return (
      <Animated.View entering={FadeInDown.delay(Math.min(index * 40, 300)).duration(300).springify()}>
        <View
          style={[styles.userRow, {
            borderBottomWidth: index < users.length - 1 ? 1 : 0,
            borderBottomColor: colors.border,
            backgroundColor: isSelected ? `${colors.accent}08` : 'transparent',
          }]}
        >
          {/* Checkbox */}
          <Pressable onPress={() => toggleSelect(user.id)} style={styles.checkbox}>
            {isSelected
              ? <CheckSquare size={18} color={colors.accent} />
              : <Square size={18} color={colors.textDisabled} />
            }
          </Pressable>

          {/* Avatar */}
          <SGAvatar
            name={user.name || '?'}
            size="md"
            color={roleStyle.color}
            status={user.isActive === false ? 'offline' : undefined}
          />

          {/* Info */}
          <View style={[styles.userInfo, { opacity: user.isActive === false ? 0.6 : 1 }]}>
            <View style={styles.userName}>
              <Text style={[typography.bodyBold, { color: colors.text }]}>{user.name}</Text>
              {user.isActive === false && (
                <SGStatusBadge status="danger" text="INACTIVE" size="sm" />
              )}
              {locked && (
                <SGStatusBadge status="warning" text="LOCKED" size="sm" />
              )}
            </View>
            <View style={styles.userEmail}>
              <Mail size={11} color={colors.textTertiary} />
              <Text style={[typography.caption, { color: colors.textSecondary }]}>{user.email}</Text>
            </View>
            {user.department && (
              <View style={styles.userDept}>
                <Building size={10} color={colors.textTertiary} />
                <Text style={[typography.caption, { color: colors.textTertiary }]}>{user.department}</Text>
              </View>
            )}
            {user.lastLoginAt && (
              <Text style={[typography.caption, { color: colors.textDisabled, marginTop: 1 }]}>
                {new Date(user.lastLoginAt).toLocaleDateString('vi')} · {user.loginCount ?? 0} lần
              </Text>
            )}
          </View>

          {/* Role badge */}
          <SGChip label={roleStyle.label} color={roleStyle.color} selected />

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable
              onPress={() => setDetailUserId(user.id)}
              accessibilityRole="button"
              accessibilityLabel={`Chi tiết ${user.name}`}
              {...(Platform.OS === 'web' ? { title: 'Chi tiết' } as any : {})}
              style={({ hovered }: any) => [
                styles.actionBtn,
                {
                  backgroundColor: hovered ? `${colors.info}15` : colors.bgCard,
                },
                Platform.OS === 'web' && ({ ...sgds.transition.fast, cursor: 'pointer' } as any),
              ]}
            >
              <Eye size={14} color={colors.info} />
            </Pressable>
            <Pressable
              onPress={() => openEdit(user)}
              accessibilityRole="button"
              accessibilityLabel={`Chỉnh sửa ${user.name}`}
              {...(Platform.OS === 'web' ? { title: 'Chỉnh sửa' } as any : {})}
              style={({ hovered }: any) => [
                styles.actionBtn,
                {
                  backgroundColor: hovered ? `${colors.accent}15` : colors.bgCard,
                },
                Platform.OS === 'web' && ({ ...sgds.transition.fast, cursor: 'pointer' } as any),
              ]}
            >
              <Pencil size={14} color={colors.accent} />
            </Pressable>
            <Pressable
              onPress={() => openReset(user)}
              accessibilityRole="button"
              accessibilityLabel={`Đặt lại mật khẩu ${user.name}`}
              {...(Platform.OS === 'web' ? { title: 'Đặt lại mật khẩu' } as any : {})}
              style={({ hovered }: any) => [
                styles.actionBtn,
                {
                  backgroundColor: hovered ? `${colors.warning}15` : colors.bgCard,
                },
                Platform.OS === 'web' && ({ ...sgds.transition.fast, cursor: 'pointer' } as any),
              ]}
            >
              <Key size={14} color={colors.warning} />
            </Pressable>
            {locked ? (
              <Pressable
                onPress={() => handleUnlock(user)}
                accessibilityRole="button"
                accessibilityLabel={`Mở khóa ${user.name}`}
                {...(Platform.OS === 'web' ? { title: 'Mở khóa' } as any : {})}
                style={({ hovered }: any) => [
                  styles.actionBtn,
                  {
                    backgroundColor: hovered ? `${colors.info}15` : colors.bgCard,
                  },
                  Platform.OS === 'web' && ({ ...sgds.transition.fast, cursor: 'pointer' } as any),
                ]}
              >
                <Unlock size={14} color={colors.info} />
              </Pressable>
            ) : (
              <Pressable
                onPress={() => confirmDeactivate(user)}
                accessibilityRole="button"
                accessibilityLabel={user.isActive ? `Vô hiệu hóa ${user.name}` : `Kích hoạt ${user.name}`}
                {...(Platform.OS === 'web' ? { title: user.isActive ? 'Vô hiệu hóa' : 'Kích hoạt' } as any : {})}
                style={({ hovered }: any) => [
                  styles.actionBtn,
                  {
                    backgroundColor: hovered
                      ? (user.isActive ? `${colors.danger}15` : `${colors.success}15`)
                      : colors.bgCard,
                  },
                  Platform.OS === 'web' && ({ ...sgds.transition.fast, cursor: 'pointer' } as any),
                ]}
              >
                {user.isActive ? <UserX size={14} color={colors.danger} /> : <UserCheck size={14} color={colors.success} />}
              </Pressable>
            )}
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerPadding}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)}>
          <SGPageHeader
            icon={<Users size={24} color={colors.accent} />}
            iconColor={colors.accent}
            title="Quản lý người dùng"
            subtitle={`${meta.total} tài khoản`}
            rightContent={
              <View style={styles.headerActions}>
                {Platform.OS === 'web' && (
                  <SGButton
                    title="Export CSV"
                    variant="secondary"
                    icon={<Download size={16} />}
                    size="sm"
                    onPress={handleExportCSV}
                  />
                )}
                <SGButton
                  title="Import CSV"
                  variant="secondary"
                  icon={<Upload size={16} />}
                  size="sm"
                  onPress={() => setImportVisible(true)}
                />
                <SGButton
                  title="Tạo User"
                  onPress={() => setCreateModal(true)}
                  icon={<Plus size={16} color="#fff" />}
                  size="md"
                />
              </View>
            }
          />
        </Animated.View>

        {/* Search + Filters */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <SGSearchBar
            value={search}
            onChangeText={handleSearch}
            placeholder="Tìm theo tên, email..."
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.filterRow}>
          {/* Role filter */}
          <SGChip
            label="Tất cả"
            selected={!roleFilter}
            onPress={() => { setRoleFilter(''); setPage(1); }}
          />
          {ROLE_OPTIONS.map(r => (
            <SGChip
              key={r.value}
              label={r.label}
              color={r.color}
              selected={roleFilter === r.value}
              onPress={() => { setRoleFilter(roleFilter === r.value ? '' : r.value); setPage(1); }}
            />
          ))}

          <View style={styles.filterSpacer} />

          {/* Status filter */}
          <SGChip
            label="All"
            selected={!statusFilter}
            onPress={() => { setStatusFilter(''); setPage(1); }}
          />
          <SGChip
            label="Active"
            color={colors.success}
            selected={statusFilter === 'active'}
            icon={<UserCheck size={12} color={statusFilter === 'active' ? colors.success : colors.textTertiary} />}
            onPress={() => { setStatusFilter(statusFilter === 'active' ? '' : 'active'); setPage(1); }}
          />
          <SGChip
            label="Inactive"
            color={colors.danger}
            selected={statusFilter === 'inactive'}
            icon={<UserX size={12} color={statusFilter === 'inactive' ? colors.danger : colors.textTertiary} />}
            onPress={() => { setStatusFilter(statusFilter === 'inactive' ? '' : 'inactive'); setPage(1); }}
          />
          <SGChip
            label="Locked"
            color={colors.warning}
            selected={statusFilter === 'locked'}
            icon={<Lock size={12} color={statusFilter === 'locked' ? colors.warning : colors.textTertiary} />}
            onPress={() => { setStatusFilter(statusFilter === 'locked' ? '' : 'locked'); setPage(1); }}
          />
        </Animated.View>

        {/* Bulk actions bar */}
        {selectedIds.size > 0 && (
          <Animated.View entering={FadeInDown.duration(300)} style={[styles.bulkBar, { backgroundColor: `${colors.accent}10`, borderColor: `${colors.accent}25` }]}>
            <View style={styles.bulkInfo}>
              <Text style={[typography.smallBold, { color: colors.accent }]}>
                {selectedIds.size} user đã chọn
              </Text>
            </View>
            <View style={styles.bulkActions}>
              <SGButton
                title="Kích hoạt"
                size="sm"
                variant="secondary"
                icon={<UserCheck size={14} />}
                onPress={() => { setBulkAction('activate'); setBulkConfirmVisible(true); }}
              />
              <SGButton
                title="Vô hiệu hóa"
                size="sm"
                variant="secondary"
                icon={<UserX size={14} />}
                onPress={() => { setBulkAction('deactivate'); setBulkConfirmVisible(true); }}
              />
              <Pressable onPress={() => setSelectedIds(new Set())} style={styles.bulkCancel}>
                <Text style={[typography.caption, { color: colors.textSecondary }]}>Bỏ chọn</Text>
              </Pressable>
            </View>
          </Animated.View>
        )}

        {/* User List */}
        {isLoading ? (
          <View style={styles.skeletonContainer}>
            {Array.from({ length: 6 }).map((_, i) => (
              <View key={i} style={styles.skeletonRow}>
                <SGSkeleton width={40} height={40} variant="circle" />
                <View style={{ flex: 1, gap: 6 }}>
                  <SGSkeleton width="60%" height={14} variant="text" />
                  <SGSkeleton width="40%" height={10} variant="text" />
                </View>
                <SGSkeleton width={60} height={28} borderRadius={20} />
              </View>
            ))}
          </View>
        ) : users.length === 0 ? (
          <SGSection>
            <SGEmptyState
              icon={<Inbox size={48} color={colors.textTertiary} strokeWidth={1} />}
              title="Không tìm thấy user nào"
              subtitle="Thử thay đổi bộ lọc hoặc tạo user mới"
              actionLabel="Tạo User"
              onAction={() => setCreateModal(true)}
            />
          </SGSection>
        ) : (
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <SGSection noPadding>
              {/* Select all row */}
              <Pressable onPress={toggleSelectAll} style={[styles.selectAllRow, { borderBottomColor: colors.border }]}>
                {selectedIds.size === users.length
                  ? <CheckSquare size={16} color={colors.accent} />
                  : <Square size={16} color={colors.textDisabled} />
                }
                <Text style={[typography.caption, { color: colors.textSecondary }]}>
                  Chọn tất cả ({users.length})
                </Text>
              </Pressable>
              {users.map((user: any, index: number) => (
                <React.Fragment key={user.id}>
                  {renderUserItem(user, index)}
                </React.Fragment>
              ))}
            </SGSection>
          </Animated.View>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <Animated.View entering={FadeInDown.delay(300).duration(400)}>
            <SGPagination
              currentPage={page}
              totalPages={meta.totalPages}
              onPageChange={setPage}
            />
          </Animated.View>
        )}
      </View>

      {/* Modals */}
      <CreateUserModal visible={createModal} onClose={() => setCreateModal(false)} />
      <EditUserModal visible={editModal} onClose={() => { setEditModal(false); setEditUser(null); }} user={editUser} />
      <ResetPasswordModal
        visible={resetModal}
        onClose={() => setResetModal(false)}
        userId={resetUserId}
        userName={resetUserName}
      />

      {/* Confirm Deactivate Dialog */}
      <SGConfirmDialog
        visible={confirmVisible}
        title={confirmUser?.isActive ? 'Vô hiệu hóa User' : 'Kích hoạt lại User'}
        message={`Bạn có chắc muốn ${confirmUser?.isActive ? 'vô hiệu hóa' : 'kích hoạt lại'} user "${confirmUser?.name}"?`}
        confirmLabel={confirmUser?.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
        variant={confirmUser?.isActive ? 'danger' : 'default'}
        loading={deactivateUser.isPending}
        onConfirm={handleDeactivate}
        onCancel={() => { setConfirmVisible(false); setConfirmUser(null); }}
      />

      {/* Bulk Action Confirm */}
      <SGConfirmDialog
        visible={bulkConfirmVisible}
        title={bulkAction === 'activate' ? 'Kích hoạt hàng loạt' : 'Vô hiệu hóa hàng loạt'}
        message={`Bạn có chắc muốn ${bulkAction === 'activate' ? 'kích hoạt' : 'vô hiệu hóa'} ${selectedIds.size} tài khoản?`}
        confirmLabel={bulkAction === 'activate' ? 'Kích hoạt' : 'Vô hiệu hóa'}
        variant={bulkAction === 'deactivate' ? 'danger' : 'default'}
        loading={batchToggle.isPending}
        onConfirm={handleBulkToggle}
        onCancel={() => setBulkConfirmVisible(false)}
      />

      {/* Tier 2: User Detail Drawer */}
      <UserDetailDrawer userId={detailUserId} onClose={() => setDetailUserId(null)} />

      {/* Tier 2: Batch Import Modal */}
      <BatchImportModal visible={importVisible} onClose={() => setImportVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerPadding: { padding: spacing['2xl'] - 4, gap: spacing.lg - 4, paddingBottom: 120 },
  headerActions: { flexDirection: 'row', gap: 8 },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' },
  filterSpacer: { width: 12 },
  // Bulk actions bar
  bulkBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 12, borderRadius: 12, borderWidth: 1,
  },
  bulkInfo: { flex: 1 },
  bulkActions: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  bulkCancel: { paddingHorizontal: 8, paddingVertical: 4 },
  // Select all
  selectAllRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: spacing.base, paddingVertical: 10,
    borderBottomWidth: 1,
  },
  // Checkbox
  checkbox: { padding: 4 },
  userRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: spacing.base,
  },
  userInfo: { flex: 1 },
  userName: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  userEmail: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  userDept: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 6 },
  actionBtn: {
    width: 34, height: 34, borderRadius: radius.sm + 2,
    alignItems: 'center', justifyContent: 'center',
  },
  skeletonContainer: { gap: 16 },
  skeletonRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
