/**
 * RolePermissionScreen — Manage roles & permissions matrix
 * Displays a permission matrix (Roles × Modules) with visual permission indicators
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Platform } from 'react-native';
import {
  Shield, Check, X, Eye, Pencil, Trash2, Info,
} from 'lucide-react-native';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { sgds } from '../../../shared/theme/theme';

// ═══════════════════════════════════════════
// Role & Permission definitions
// ═══════════════════════════════════════════
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

type Permission = 'full' | 'read' | 'write' | 'none';

// Default permission matrix
const PERMISSION_MATRIX: Record<string, Record<string, Permission>> = {
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
  const { theme, isDark } = useAppTheme();
  const cText = theme.colors.textPrimary;
  const cSub = theme.colors.textSecondary;
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : '#ffffff';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 28, gap: 24, paddingBottom: 120 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <View style={{ width: 52, height: 52, borderRadius: 18, backgroundColor: isDark ? 'rgba(99,102,241,0.12)' : '#eef2ff', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={24} color="#6366f1" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ ...sgds.typo.h2, color: cText }}>Phân quyền hệ thống</Text>
            <Text style={{ ...sgds.typo.body, color: cSub, marginTop: 2 }}>Ma trận quyền truy cập theo vai trò</Text>
          </View>
        </View>

        {/* Info banner */}
        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 16,
          backgroundColor: isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.06)',
          borderWidth: 1, borderColor: isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.12)',
        }}>
          <Info size={18} color="#6366f1" />
          <Text style={{ flex: 1, fontSize: 13, fontWeight: '600', color: cSub, lineHeight: 20 }}>
            Bảng phân quyền hiển thị quyền truy cập mặc định của từng vai trò. Hệ thống sử dụng Role-Based Access Control (RBAC).
          </Text>
        </View>

        {/* Role Cards */}
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
          {ROLES.map(role => {
            const isSelected = selectedRole === role.key;
            return (
              <Pressable
                key={role.key}
                onPress={() => setSelectedRole(isSelected ? null : role.key)}
                style={{
                  flex: 1, minWidth: 160, padding: 18, borderRadius: 18,
                  backgroundColor: isSelected ? `${role.color}15` : cardBg,
                  borderWidth: 2, borderColor: isSelected ? role.color : borderColor,
                  ...(Platform.OS === 'web' ? { cursor: 'pointer', transition: 'all 0.2s ease' } : {}),
                } as any}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: `${role.color}15`, alignItems: 'center', justifyContent: 'center' }}>
                    <Shield size={16} color={role.color} />
                  </View>
                  <Text style={{ fontSize: 15, fontWeight: '800', color: isSelected ? role.color : cText }}>{role.label}</Text>
                </View>
                <Text style={{ fontSize: 12, fontWeight: '600', color: cSub, lineHeight: 18 }}>{role.desc}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Permission Matrix */}
        <View style={{ borderRadius: 20, backgroundColor: cardBg, borderWidth: 1, borderColor, overflow: 'hidden' }}>
          {/* Table Header */}
          <View style={{
            flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: borderColor,
            backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
          }}>
            <Text style={{ width: 160, fontSize: 11, fontWeight: '800', color: cSub, textTransform: 'uppercase', letterSpacing: 1 }}>Module</Text>
            {(selectedRole ? ROLES.filter(r => r.key === selectedRole) : ROLES).map(role => (
              <View key={role.key} style={{ flex: 1, alignItems: 'center' }}>
                <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: `${role.color}12` }}>
                  <Text style={{ fontSize: 11, fontWeight: '800', color: role.color }}>{role.label}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Table Rows */}
          {MODULES.map((mod, i) => (
            <View key={mod.key} style={{
              flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14,
              borderBottomWidth: i < MODULES.length - 1 ? 1 : 0, borderBottomColor: borderColor,
              ...(Platform.OS === 'web' ? { transition: 'background-color 0.15s' } : {}),
            } as any}>
              <Text style={{ width: 160, fontSize: 13, fontWeight: '700', color: cText }}>{mod.label}</Text>
              {(selectedRole ? ROLES.filter(r => r.key === selectedRole) : ROLES).map(role => {
                const perm = PERMISSION_MATRIX[role.key]?.[mod.key] || 'none';
                const config = PERM_CONFIG[perm];
                const IconComp = config.icon;
                return (
                  <View key={role.key} style={{ flex: 1, alignItems: 'center' }}>
                    <View style={{
                      flexDirection: 'row', alignItems: 'center', gap: 6,
                      paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10,
                      backgroundColor: config.bg,
                    }}>
                      <IconComp size={13} color={config.color} strokeWidth={2.5} />
                      <Text style={{ fontSize: 11, fontWeight: '700', color: config.color }}>{config.label}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        {/* Legend */}
        <View style={{ flexDirection: 'row', gap: 20, flexWrap: 'wrap' }}>
          {Object.entries(PERM_CONFIG).map(([key, config]) => {
            const IconComp = config.icon;
            return (
              <View key={key} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: config.bg, alignItems: 'center', justifyContent: 'center' }}>
                  <IconComp size={14} color={config.color} strokeWidth={2.5} />
                </View>
                <Text style={{ fontSize: 12, fontWeight: '700', color: cSub }}>{config.label}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
