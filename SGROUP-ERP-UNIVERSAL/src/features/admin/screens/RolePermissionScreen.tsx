/**
 * RolePermissionScreen — Premium interactive RBAC permission matrix
 * Uses SGPageHeader, SGSection, SGChip, SGButton, SGSkeleton, SGStatusBadge
 * Reanimated animations, accessibility, token colors
 */
import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Shield, Check, X, Eye, Pencil, Info, Save, RotateCcw, Zap,
} from 'lucide-react-native';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { typography, sgds, radius, spacing } from '../../../shared/theme/theme';
import { SGPageHeader } from '../../../shared/ui/components/SGPageHeader';
import { SGSection } from '../../../shared/ui/components/SGSection';
import { SGButton } from '../../../shared/ui/components/SGButton';
import { SGSkeleton } from '../../../shared/ui/components/SGSkeleton';
import { SGConfirmDialog } from '../../../shared/ui/components/SGConfirmDialog';
import { usePermissions, useBulkUpdatePermissions, useResetPermissions } from '../hooks/useAdmin';
import { showAlert } from '../utils/adminUtils';

const ROLES = [
  { key: 'admin', label: 'Admin', color: '#ef4444', desc: 'Toàn quyền hệ thống' },
  { key: 'ceo', label: 'CEO', color: '#f59e0b', desc: 'Xem toàn bộ, quản lý chiến lược' },
  { key: 'hr', label: 'HR Manager', color: '#ec4899', desc: 'Quản lý nhân sự, lương, tuyển dụng' },
  { key: 'sales', label: 'Sales', color: '#3b82f6', desc: 'Bán hàng, chăm sóc KH' },
  { key: 'employee', label: 'Nhân viên', color: '#6366f1', desc: 'Quyền cơ bản' },
];

const MODULES = [
  { key: 'admin', label: 'Quản trị hệ thống' },
  { key: 'hr', label: 'Nhân sự' },
  { key: 'sales', label: 'Bán hàng' },
  { key: 'finance', label: 'Tài chính' },
  { key: 'project', label: 'Dự án' },
  { key: 'marketing', label: 'Marketing' },
  { key: 'planning', label: 'Kế hoạch' },
  { key: 'reports', label: 'Báo cáo' },
];

type Permission = 'full' | 'write' | 'read' | 'none';
const PERM_CYCLE: Permission[] = ['full', 'write', 'read', 'none'];

const DEFAULT_MATRIX: Record<string, Record<string, Permission>> = {
  admin:    { admin: 'full', hr: 'full', sales: 'full', finance: 'full', project: 'full', marketing: 'full', planning: 'full', reports: 'full' },
  ceo:      { admin: 'read', hr: 'read', sales: 'read', finance: 'full', project: 'full', marketing: 'read', planning: 'full', reports: 'full' },
  hr:       { admin: 'none', hr: 'full', sales: 'read', finance: 'read', project: 'read', marketing: 'none', planning: 'read', reports: 'read' },
  sales:    { admin: 'none', hr: 'none', sales: 'write', finance: 'none', project: 'read', marketing: 'read', planning: 'read', reports: 'read' },
  employee: { admin: 'none', hr: 'none', sales: 'none', finance: 'none', project: 'read', marketing: 'none', planning: 'read', reports: 'read' },
};

const PERM_CONFIG: Record<Permission, { icon: any; color: string; label: string; bg: string }> = {
  full:  { icon: Check, color: '#10b981', label: 'Toàn quyền', bg: 'rgba(16,185,129,0.12)' },
  write: { icon: Pencil, color: '#3b82f6', label: 'Đọc & Ghi', bg: 'rgba(59,130,246,0.12)' },
  read:  { icon: Eye, color: '#f59e0b', label: 'Chỉ đọc', bg: 'rgba(245,158,11,0.12)' },
  none:  { icon: X, color: '#94a3b8', label: 'Không có', bg: 'rgba(148,163,184,0.08)' },
};

export function RolePermissionScreen() {
  const { colors } = useAppTheme();

  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [localMatrix, setLocalMatrix] = useState<Record<string, Record<string, Permission>>>(DEFAULT_MATRIX);
  const [originalMatrix, setOriginalMatrix] = useState<Record<string, Record<string, Permission>>>(DEFAULT_MATRIX);
  const [resetConfirm, setResetConfirm] = useState(false);

  const { data: permData, isLoading } = usePermissions();
  const bulkUpdate = useBulkUpdatePermissions();
  const resetPerms = useResetPermissions();

  useEffect(() => {
    if (!permData) return;
    let matrix: Record<string, Record<string, Permission>>;
    if (permData.isDefault) {
      matrix = permData.defaults || DEFAULT_MATRIX;
    } else if (permData.matrix) {
      matrix = permData.matrix as Record<string, Record<string, Permission>>;
    } else {
      matrix = DEFAULT_MATRIX;
    }
    const complete: Record<string, Record<string, Permission>> = {};
    for (const role of ROLES) {
      complete[role.key] = {};
      for (const mod of MODULES) {
        complete[role.key][mod.key] = (matrix[role.key]?.[mod.key] as Permission) || 'none';
      }
    }
    setLocalMatrix(complete);
    setOriginalMatrix(JSON.parse(JSON.stringify(complete)));
  }, [permData]);

  const handleCellClick = (role: string, module: string) => {
    if (role === 'admin' && module === 'admin') return;
    setLocalMatrix(prev => {
      const current = prev[role]?.[module] || 'none';
      const nextIdx = (PERM_CYCLE.indexOf(current) + 1) % PERM_CYCLE.length;
      return { ...prev, [role]: { ...prev[role], [module]: PERM_CYCLE[nextIdx] } };
    });
  };

  const handleSave = async () => {
    const updates: { role: string; module: string; permission: string }[] = [];
    for (const role of ROLES) {
      for (const mod of MODULES) {
        updates.push({ role: role.key, module: mod.key, permission: localMatrix[role.key]?.[mod.key] || 'none' });
      }
    }
    try {
      await bulkUpdate.mutateAsync(updates);
      setOriginalMatrix(JSON.parse(JSON.stringify(localMatrix)));
      showAlert('Đã lưu phân quyền thành công!', 'Thành công');
    } catch (e: any) {
      showAlert(e?.response?.data?.message || e?.message || 'Lỗi khi lưu', 'Lỗi');
    }
  };

  const handleReset = async () => {
    try {
      await resetPerms.mutateAsync();
      setResetConfirm(false);
    } catch (e: any) {
      showAlert(e?.response?.data?.message || e?.message || 'Lỗi', 'Lỗi');
    }
  };

  const changeCount = useMemo(() => {
    let count = 0;
    for (const role of ROLES) {
      for (const mod of MODULES) {
        if (localMatrix[role.key]?.[mod.key] !== originalMatrix[role.key]?.[mod.key]) count++;
      }
    }
    return count;
  }, [localMatrix, originalMatrix]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.innerPadding}>
          <SGSkeleton width="50%" height={28} variant="text" style={{ marginBottom: 8 }} />
          <SGSkeleton width="70%" height={16} variant="text" style={{ marginBottom: 32 }} />
          <View style={styles.roleCardGrid}>
            {Array.from({ length: 5 }).map((_, i) => (
              <SGSkeleton key={i} height={100} borderRadius={18} style={{ flex: 1, minWidth: 160 }} />
            ))}
          </View>
          <SGSkeleton height={400} borderRadius={20} style={{ marginTop: 24 }} />
        </View>
      </View>
    );
  }

  const visibleRoles = selectedRole ? ROLES.filter(r => r.key === selectedRole) : ROLES;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.innerPadding} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)}>
          <SGPageHeader
            icon={<Shield size={24} color={colors.accent} />}
            iconColor={colors.accent}
            title="Phân quyền hệ thống"
            subtitle="Cấu hình quyền truy cập theo vai trò"
            rightContent={
              <View style={styles.headerActions}>
                <SGButton
                  title="Đặt lại"
                  variant="secondary"
                  icon={<RotateCcw size={16} />}
                  size="sm"
                  onPress={() => setResetConfirm(true)}
                  loading={resetPerms.isPending}
                />
                {changeCount > 0 && (
                  <SGButton
                    title={bulkUpdate.isPending ? 'Đang lưu...' : `Lưu (${changeCount})`}
                    icon={<Save size={16} color="#fff" />}
                    size="sm"
                    onPress={handleSave}
                    loading={bulkUpdate.isPending}
                  />
                )}
              </View>
            }
          />
        </Animated.View>

        {/* Info */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <View style={[styles.infoBanner, { backgroundColor: `${colors.accent}0A`, borderColor: `${colors.accent}20` }]}>
            <Info size={18} color={colors.accent} />
            <Text style={[typography.small, { color: colors.textSecondary, flex: 1, lineHeight: 20 }]}>
              Nhấn vào ô quyền để chuyển đổi mức quyền. Thay đổi chỉ được lưu khi bấm "Lưu".
            </Text>
          </View>
        </Animated.View>

        {/* Role Cards */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.roleCardGrid}>
          {ROLES.map((role, i) => {
            const isSelected = selectedRole === role.key;
            return (
              <Animated.View key={role.key} entering={FadeInDown.delay(200 + i * 60).duration(300).springify()}>
                <Pressable
                  onPress={() => setSelectedRole(isSelected ? null : role.key)}
                  accessibilityRole="button"
                  accessibilityLabel={`Vai trò ${role.label}`}
                  style={({ hovered }: any) => [
                    styles.roleCard,
                    { backgroundColor: isSelected ? `${role.color}15` : colors.bgCard, borderColor: isSelected ? role.color : colors.border, borderWidth: isSelected ? 2 : 1 },
                    hovered && !isSelected && { borderColor: `${role.color}40` },
                    Platform.OS === 'web' && ({ ...sgds.transition.fast, cursor: 'pointer' } as any),
                  ]}
                >
                  <View style={styles.roleCardHeader}>
                    <View style={[styles.roleIcon, { backgroundColor: `${role.color}15` }]}>
                      <Shield size={16} color={role.color} />
                    </View>
                    <Text style={[typography.bodyBold, { color: isSelected ? role.color : colors.text }]}>{role.label}</Text>
                  </View>
                  <Text style={[typography.caption, { color: colors.textSecondary, lineHeight: 18 }]}>{role.desc}</Text>
                </Pressable>
              </Animated.View>
            );
          })}
        </Animated.View>

        {/* Permission Matrix */}
        <Animated.View entering={FadeInDown.delay(500).duration(400)}>
          <SGSection noPadding>
            <View style={[styles.tableHeader, { backgroundColor: colors.bgCard, borderBottomColor: colors.border }]}>
              <Text style={[styles.moduleCol, typography.label, { color: colors.textTertiary }]}>MODULE</Text>
              {visibleRoles.map(role => (
                <View key={role.key} style={styles.roleCol}>
                  <View style={[styles.roleBadge, { backgroundColor: `${role.color}12` }]}>
                    <Text style={[typography.caption, { color: role.color, fontWeight: '800' }]}>{role.label}</Text>
                  </View>
                </View>
              ))}
            </View>
            {MODULES.map((mod, i) => (
              <View key={mod.key} style={[styles.tableRow, { borderBottomWidth: i < MODULES.length - 1 ? 1 : 0, borderBottomColor: colors.border }]}>
                <Text style={[styles.moduleCol, typography.smallBold, { color: colors.text }]}>{mod.label}</Text>
                {visibleRoles.map(role => {
                  const perm = (localMatrix[role.key]?.[mod.key] || 'none') as Permission;
                  const config = PERM_CONFIG[perm];
                  const IconComp = config.icon;
                  const isLocked = role.key === 'admin' && mod.key === 'admin';
                  const isChanged = localMatrix[role.key]?.[mod.key] !== originalMatrix[role.key]?.[mod.key];
                  return (
                    <View key={role.key} style={styles.roleCol}>
                      <Pressable
                        onPress={() => !isLocked && handleCellClick(role.key, mod.key)}
                        accessibilityRole="button"
                        accessibilityLabel={`${role.label} - ${mod.label}: ${config.label}`}
                        accessibilityHint="Nhấn để chuyển đổi mức quyền"
                        disabled={isLocked}
                        style={({ hovered, pressed }: any) => [
                          styles.permCell,
                          { backgroundColor: hovered && !isLocked ? `${config.color}20` : config.bg, borderWidth: isChanged ? 2 : 0, borderColor: isChanged ? colors.accent : 'transparent', opacity: isLocked ? 0.6 : 1 },
                          pressed && !isLocked && { transform: [{ scale: 0.92 }] },
                          Platform.OS === 'web' && !isLocked && ({ ...sgds.transition.fast, cursor: 'pointer' } as any),
                        ]}
                      >
                        <IconComp size={13} color={config.color} strokeWidth={2.5} />
                        <Text style={[typography.caption, { color: config.color, fontWeight: '700' }]}>{config.label}</Text>
                        {isChanged && <Zap size={9} color={colors.accent} />}
                      </Pressable>
                    </View>
                  );
                })}
              </View>
            ))}
          </SGSection>
        </Animated.View>

        {/* Legend */}
        <Animated.View entering={FadeInDown.delay(600).duration(400)} style={styles.legend}>
          {Object.entries(PERM_CONFIG).map(([key, config]) => {
            const IconComp = config.icon;
            return (
              <View key={key} style={styles.legendItem}>
                <View style={[styles.legendIcon, { backgroundColor: config.bg }]}>
                  <IconComp size={14} color={config.color} strokeWidth={2.5} />
                </View>
                <Text style={[typography.caption, { color: colors.textSecondary, fontWeight: '700' }]}>{config.label}</Text>
              </View>
            );
          })}
          <View style={styles.legendItem}>
            <View style={[styles.legendIcon, { borderWidth: 2, borderColor: colors.accent }]}>
              <Zap size={12} color={colors.accent} />
            </View>
            <Text style={[typography.caption, { color: colors.accent, fontWeight: '700' }]}>Đã thay đổi</Text>
          </View>
        </Animated.View>

        {permData?.isDefault && (
          <View style={[styles.infoBanner, { backgroundColor: `${colors.warning}0A`, borderColor: `${colors.warning}20` }]}>
            <Info size={16} color={colors.warning} />
            <Text style={[typography.small, { color: colors.textSecondary, flex: 1 }]}>
              Chưa cấu hình. Đang hiển thị quyền mặc định. Bấm{' '}
              <Text style={{ fontWeight: '800', color: colors.accent }}>Lưu</Text> để lưu vào cơ sở dữ liệu.
            </Text>
          </View>
        )}
      </ScrollView>

      <SGConfirmDialog
        visible={resetConfirm}
        title="Đặt lại quyền mặc định"
        message="Tất cả quyền sẽ được đặt lại về mặc định. Hành động này không thể hoàn tác."
        confirmLabel="Đặt lại"
        variant="danger"
        loading={resetPerms.isPending}
        onConfirm={handleReset}
        onCancel={() => setResetConfirm(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerPadding: { padding: spacing['2xl'] - 4, gap: spacing.lg, paddingBottom: 120 },
  headerActions: { flexDirection: 'row', gap: 8 },
  infoBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: spacing.base, borderRadius: radius.lg, borderWidth: 1 },
  roleCardGrid: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  roleCard: { flex: 1, minWidth: 160, padding: 18, borderRadius: 18 },
  roleCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  roleIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  tableHeader: { flexDirection: 'row', padding: spacing.base, borderBottomWidth: 1 },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.base, paddingVertical: 14 },
  moduleCol: { width: 160 },
  roleCol: { flex: 1, alignItems: 'center' },
  roleBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  permCell: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  legend: { flexDirection: 'row', gap: 20, flexWrap: 'wrap', alignItems: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendIcon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
});
