/**
 * StaffDirectoryScreen — Premium HR Staff Directory page
 * Features: stat cards, search/filter, modern staff cards with department display
 */
import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Platform, TextInput } from 'react-native';
import {
  UserCog, Plus, Users, Target, Search, Filter, Mail, Hash, Phone, Building, Star
} from 'lucide-react-native';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { sgds } from '../../../shared/theme/theme';
import { SGCard } from '../../../shared/ui/components';
import type { HRRole } from '../HRSidebar';

const fmt = (n: number) => n.toLocaleString('vi-VN');

// Mock Data
const MOCK_STAFF = [
  { id: '1', code: 'SG001', name: 'Nguyễn Văn A', dept: 'Sales & Kinh Doanh', role: 'Trưởng phòng', email: 'vana@sgroup.vn', phone: '0901234567', status: 'ACTIVE', joinDate: '2021-03-15' },
  { id: '2', code: 'SG002', name: 'Trần Thị B', dept: 'Công nghệ & IT', role: 'Senior Developer', email: 'thib@sgroup.vn', phone: '0912345678', status: 'ACTIVE', joinDate: '2022-06-10' },
  { id: '3', code: 'SG003', name: 'Lê Văn C', dept: 'Marketing', role: 'Chuyên viên', email: 'vanc@sgroup.vn', phone: '0923456789', status: 'ACTIVE', joinDate: '2023-01-20' },
  { id: '4', code: 'SG004', name: 'Phạm Thị D', dept: 'Tài chính - Kế toán', role: 'Kế toán trưởng', email: 'thid@sgroup.vn', phone: '0934567890', status: 'ACTIVE', joinDate: '2020-11-05' },
  { id: '5', code: 'SG005', name: 'Hoàng Văn E', dept: 'Hành chính - Nhân sự', role: 'HR Manager', email: 'vane@sgroup.vn', phone: '0945678901', status: 'ACTIVE', joinDate: '2021-08-12' },
  { id: '6', code: 'SG006', name: 'Vũ Thị F', dept: 'Sales & Kinh Doanh', role: 'Nhân viên', email: 'thif@sgroup.vn', phone: '0956789012', status: 'ON_LEAVE', joinDate: '2024-02-01' },
];

const FILTER_TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'Sales & Kinh Doanh', label: 'Sales' },
  { key: 'Công nghệ & IT', label: 'IT' },
  { key: 'Marketing', label: 'Marketing' },
  { key: 'Hành chính - Nhân sự', label: 'HR' },
];

// Role config for badges (generic for HR)
const ROLE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  'Trưởng phòng': { label: 'Trưởng phòng', color: '#ef4444', bg: '#ef444410' },
  'HR Manager': { label: 'HR Manager', color: '#f59e0b', bg: '#f59e0b10' },
  'Kế toán trưởng': { label: 'Kế toán trưởng', color: '#8b5cf6', bg: '#8b5cf610' },
  'Senior Developer': { label: 'Senior', color: '#3b82f6', bg: '#3b82f610' },
  'Chuyên viên': { label: 'Chuyên viên', color: '#22c55e', bg: '#22c55e10' },
  'Nhân viên': { label: 'Nhân viên', color: '#64748b', bg: '#f1f5f9' },
};

// Get initials from a full name
function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

// Generate a consistent avatar color from name
function nameToColor(name: string) {
  const colors = ['#ec4899', '#8b5cf6', '#3b82f6', '#f59e0b', '#22c55e', '#06b6d4', '#6366f1', '#f43f5e'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export function StaffDirectoryScreen({ userRole }: { userRole?: HRRole }) {
  const { theme, isDark } = useAppTheme();
  const cText = theme.colors.textPrimary;
  const cSub = theme.colors.textSecondary;
  const cBg = isDark ? theme.colors.background : theme.colors.backgroundAlt;
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : '#ffffff';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const canEdit = userRole === 'admin' || userRole === 'hr_manager' || userRole === 'hr_director';

  // Search + filter
  const filteredStaff = useMemo(() => {
    let list = MOCK_STAFF;
    if (activeFilter !== 'all') {
      list = list.filter((s: any) => s.dept === activeFilter);
    }
    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      list = list.filter((s: any) =>
        (s.name || '').toLowerCase().includes(q) ||
        (s.code || '').toLowerCase().includes(q) ||
        (s.email || '').toLowerCase().includes(q) ||
        (s.dept || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeFilter, searchText]);

  // Stats
  const statCards = [
    { label: 'Tổng nhân sự', value: MOCK_STAFF.length, icon: Users, color: '#ec4899', gradient: ['#ec4899', '#be185d'] },
    { label: 'Phòng ban', value: 5, icon: Building, color: '#8b5cf6', gradient: ['#8b5cf6', '#7c3aed'] },
    { label: 'Thử việc', value: 2, icon: Star, color: '#f59e0b', gradient: ['#f59e0b', '#d97706'] },
    { label: 'Nghỉ phép', value: 1, icon: Target, color: '#3b82f6', gradient: ['#3b82f6', '#2563eb'] },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: cBg }}>
      <ScrollView contentContainerStyle={{ padding: 28, gap: 20, paddingBottom: 120 }}>

        {/* ── Header ── */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={{
              width: 52, height: 52, borderRadius: 18,
              backgroundColor: isDark ? 'rgba(236,72,153,0.12)' : '#fdf2f8',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Users size={24} color="#ec4899" />
            </View>
            <View>
              <Text style={{ ...sgds.typo.h2, color: cText, letterSpacing: -0.5 }}>Danh bạ Nhân sự</Text>
              <Text style={{ ...sgds.typo.body, color: cSub, marginTop: 2 }}>
                Quản lý hồ sơ nhân viên toàn công ty
              </Text>
            </View>
          </View>
          {canEdit && (
            <Pressable style={{
              flexDirection: 'row', alignItems: 'center', gap: 8,
              backgroundColor: '#ec4899', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14,
              ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}),
            }}>
              <Plus size={16} color="#fff" />
              <Text style={{ fontSize: 13, fontWeight: '800', color: '#fff', letterSpacing: 0.5 }}>THÊM HỒ SƠ</Text>
            </Pressable>
          )}
        </View>

        {/* ── Stat Cards ── */}
        <View style={{ flexDirection: 'row', gap: 14, flexWrap: 'wrap' }}>
          {statCards.map((sc, i) => {
            const Icon = sc.icon;
            return (
              <View key={i} style={{
                flex: 1, minWidth: 200, borderRadius: 18, padding: 20,
                backgroundColor: cardBg,
                borderWidth: 1, borderColor,
                ...(Platform.OS === 'web' ? { transition: 'all 0.2s ease' as any } : {}),
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <View style={{
                    width: 42, height: 42, borderRadius: 14,
                    backgroundColor: sc.color + '15',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={20} color={sc.color} />
                  </View>
                </View>
                <Text style={{ fontSize: 28, fontWeight: '900', color: cText, letterSpacing: -1 }}>
                  {typeof sc.value === 'number' ? fmt(sc.value) : sc.value}
                </Text>
                <Text style={{ fontSize: 12, fontWeight: '700', color: cSub, marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {sc.label}
                </Text>
              </View>
            );
          })}
        </View>

        {/* ── Search & Filter ── */}
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <View style={{
            flex: 1, minWidth: 240, flexDirection: 'row', alignItems: 'center', gap: 10,
            backgroundColor: cardBg,
            borderWidth: 1, borderColor,
            borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12,
          }}>
            <Search size={18} color={cSub} />
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Tìm theo tên, mã NV, email, phòng ban..."
              placeholderTextColor={cSub}
              style={[{
                flex: 1, fontSize: 14, color: cText,
              }, Platform.OS === 'web' && { outlineStyle: 'none' } as any]}
            />
          </View>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
              {FILTER_TABS.map(tab => {
                const active = activeFilter === tab.key;
                return (
                  <Pressable
                    key={tab.key}
                    onPress={() => setActiveFilter(tab.key)}
                    style={{
                      paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12,
                      backgroundColor: active ? '#ec4899' : (isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9'),
                      borderWidth: active ? 0 : 1,
                      borderColor: active ? 'transparent' : borderColor,
                    }}
                  >
                    <Text style={{
                      fontSize: 12, fontWeight: '800',
                      color: active ? '#fff' : cSub,
                      letterSpacing: 0.3,
                    }}>{tab.label}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>

        {/* ── Staff Grid ── */}
        {filteredStaff.length === 0 ? (
          <SGCard variant="glass" style={{ padding: 60, alignItems: 'center' }}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>👥</Text>
            <Text style={{ fontSize: 18, fontWeight: '800', color: cText, marginBottom: 6 }}>Không có dữ liệu</Text>
            <Text style={{ fontSize: 13, color: cSub, textAlign: 'center' }}>
              {searchText ? 'Không tìm thấy kết quả phù hợp' : 'Danh sách nhân sự trống.'}
            </Text>
          </SGCard>
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            {filteredStaff.map((staff, idx) => {
              const roleConf = ROLE_CONFIG[staff.role] || { label: staff.role, color: '#64748b', bg: '#f1f5f9' };
              const avatarColor = nameToColor(staff.name);

              return (
                <Pressable
                  key={staff.id}
                  style={{
                    flex: 1, minWidth: 340, maxWidth: 440,
                    borderRadius: 20, padding: 0, overflow: 'hidden',
                    backgroundColor: cardBg,
                    borderWidth: 1, borderColor,
                    ...(Platform.OS === 'web' ? {
                      cursor: 'pointer' as any,
                      transition: 'all 0.25s ease' as any,
                    } : {}),
                  }}
                >
                  {/* Top accent bar */}
                  <View style={{ height: 3, backgroundColor: avatarColor, opacity: 0.6 }} />

                  <View style={{ padding: 22 }}>
                    {/* Avatar + Name + Code */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                      <View style={{
                        width: 50, height: 50, borderRadius: 16,
                        backgroundColor: avatarColor + '18',
                        alignItems: 'center', justifyContent: 'center',
                        borderWidth: 2, borderColor: avatarColor + '30',
                      }}>
                        <Text style={{ fontSize: 17, fontWeight: '900', color: avatarColor }}>
                          {getInitials(staff.name)}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: '800', color: cText, letterSpacing: -0.3 }}>{staff.name}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 }}>
                          <Hash size={11} color={cSub} />
                          <Text style={{ fontSize: 11, fontWeight: '700', color: cSub }}>{staff.code}</Text>
                        </View>
                      </View>
                      {/* Role badge */}
                      <View style={{
                        paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10,
                        backgroundColor: roleConf.bg,
                        borderWidth: 1, borderColor: roleConf.color + '20',
                      }}>
                        <Text style={{ fontSize: 10, fontWeight: '900', color: roleConf.color, letterSpacing: 0.3 }}>
                          {roleConf.label}
                        </Text>
                      </View>
                    </View>

                    {/* Department badge */}
                    <View style={{
                      flexDirection: 'row', alignItems: 'center', gap: 8,
                      paddingBottom: 16, marginBottom: 16,
                      borderBottomWidth: 1, borderBottomColor: borderColor,
                    }}>
                      <View style={{
                        width: 26, height: 26, borderRadius: 8,
                        backgroundColor: '#8b5cf615',
                        alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Building size={12} color="#8b5cf6" />
                      </View>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: staff.dept !== '—' ? cText : cSub }}>
                        {staff.dept}
                      </Text>
                      <View style={{
                        paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginLeft: 'auto',
                        backgroundColor: staff.status === 'ACTIVE' ? '#dcfce7' : '#fef3c7',
                      }}>
                        <Text style={{ fontSize: 10, fontWeight: '800', color: staff.status === 'ACTIVE' ? '#16a34a' : '#d97706' }}>
                          {staff.status === 'ACTIVE' ? 'ĐANG LÀM' : 'ĐANG NGHỈ'}
                        </Text>
                      </View>
                    </View>

                    {/* Contact info row */}
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, padding: 10, borderRadius: 12, backgroundColor: isDark ? 'rgba(59,130,246,0.06)' : '#eff6ff' }}>
                        <Mail size={14} color="#3b82f6" />
                        <Text style={{ fontSize: 12, fontWeight: '600', color: cText }} numberOfLines={1}>{staff.email}</Text>
                      </View>
                      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, padding: 10, borderRadius: 12, backgroundColor: isDark ? 'rgba(139,92,246,0.06)' : '#f5f3ff' }}>
                        <Phone size={14} color="#8b5cf6" />
                        <Text style={{ fontSize: 12, fontWeight: '600', color: cText }}>{staff.phone}</Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* ── Results count ── */}
        {filteredStaff.length > 0 && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <Text style={{ fontSize: 12, color: cSub, fontWeight: '600' }}>
              Hiển thị {filteredStaff.length}/{MOCK_STAFF.length} nhân viên
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
