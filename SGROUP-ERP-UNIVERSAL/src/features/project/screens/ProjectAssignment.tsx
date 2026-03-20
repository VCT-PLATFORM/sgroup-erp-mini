import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, useWindowDimensions } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { typography, sgds, radius } from '../../../shared/theme/theme';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { SGCard, SGButton, SGAuroraBackground, SGSkeleton, SGEmptyState, SGSkeletonLoader } from '../../../shared/ui/components';
import { ShieldCheck, Users, Search, MoreVertical, Edit2, Mail, X, UserPlus } from 'lucide-react-native';
import { useAssignments } from '../hooks/useProject';



export function ProjectAssignment() {
  const { colors, theme, isDark } = useAppTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width > 1024;
  const [searchQuery, setSearchQuery] = useState('');

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Project Manager': return colors.success;
      case 'Sales Director': return colors.purple;
      case 'Sales Manager': return colors.warning;
      default: return colors.brand;
    }
  };

  const { data: rawAssignments, isLoading } = useAssignments();

  const allUsers = useMemo(() => {
    return (rawAssignments || []).map((a: any) => ({
      id: a.id,
      name: a.name,
      email: a.email || '',
      role: a.role,
      projects: a.projectId ? [a.projectId] : [],
      status: a.status,
      date: new Date(a.assignedAt).toLocaleDateString('vi-VN'),
    }));
  }, [rawAssignments]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return allUsers;
    const q = searchQuery.toLowerCase();
    return allUsers.filter((u: any) =>
      u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q)
    );
  }, [allUsers, searchQuery]);

  return (
    <View style={[styles.container, { padding: isDesktop ? 40 : 20 }]}>
      {/* Aurora Background */}
      {Platform.OS === 'web' && (
        <View style={[StyleSheet.absoluteFill, { zIndex: 0, overflow: 'hidden' }]} pointerEvents="none">
          <SGAuroraBackground />
        </View>
      )}

      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100).springify().damping(20)} style={[styles.header, { zIndex: 1 }]}>
        <View>
          <Text style={[typography.h1, { color: colors.text, fontWeight: '800', letterSpacing: -0.5 }]}>Phân quyền Dự án</Text>
          <Text style={[typography.body, { color: colors.textSecondary, marginTop: 8, fontSize: 15 }]}>
            Thiết lập quyền phân phối và truy cập dự án cho nhân sự
          </Text>
        </View>
        <SGButton title="Thêm Nhân sự" icon={<Users size={18} color="#fff" />} variant="primary" onPress={() => {}}
          style={{ backgroundColor: colors.success }} />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).springify().damping(20)} style={{ flex: 1, zIndex: 1 }}>
        <SGCard style={[styles.sectionCard, sgds.sectionBase(theme) as any] as any}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: isDark ? 'rgba(139,92,246,0.1)' : '#f5f3ff', justifyContent: 'center', alignItems: 'center' }}>
                <ShieldCheck size={18} color={colors.purple} />
              </View>
              <Text style={[typography.h4, { color: colors.text, fontWeight: '800' }]}>Danh sách Cán bộ Phụ trách</Text>
            </View>
            <View style={[styles.searchBox, {
              backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.9)',
              borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'
            }]}>
              <Search size={16} color={colors.textTertiary} />
              <TextInput
                style={[styles.searchInput, { color: colors.text, outlineStyle: 'none' as any }]}
                placeholder="Tìm nhân sự..."
                placeholderTextColor={colors.textTertiary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery !== '' && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X size={14} color={colors.textTertiary} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Table Header */}
            <View style={[styles.tableHeader, { borderBottomColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }]}>
              <Text style={[typography.micro, { color: colors.textTertiary, flex: 2, fontWeight: '700' }]}>NHÂN SỰ</Text>
              <Text style={[typography.micro, { color: colors.textTertiary, flex: 1.5, fontWeight: '700' }]}>VAI TRÒ</Text>
              <Text style={[typography.micro, { color: colors.textTertiary, flex: 2, fontWeight: '700' }]}>DỰ ÁN PHỤ TRÁCH</Text>
              <Text style={[typography.micro, { color: colors.textTertiary, width: 100, textAlign: 'center', fontWeight: '700' }]}>TRẠNG THÁI</Text>
              <Text style={[typography.micro, { color: colors.textTertiary, width: 80, textAlign: 'right', fontWeight: '700' }]}></Text>
            </View>

            {/* Loading Skeleton */}
            {isLoading ? (
              <View style={{ paddingTop: 8 }}>
                <SGSkeletonLoader type="table" rows={6} columns={5} isDark={isDark} />
              </View>
            ) : filteredUsers.length === 0 ? (
              /* Empty State */
              <SGEmptyState
                icon={<UserPlus size={48} color={colors.textTertiary} strokeWidth={1} />}
                title="Chưa có phân quyền nào"
                subtitle="Thêm nhân sự vào dự án để bắt đầu quản lý quyền truy cập"
                actionLabel="Thêm Nhân sự"
                onAction={() => {}}
                style={{ minHeight: 300 }}
              />
            ) : (
              /* Data Rows */
              filteredUsers.map((user: any, idx: number) => (
                <Animated.View
                  key={user.id}
                  entering={FadeInDown.delay(idx * 50).springify().damping(20)}
                  style={[styles.tableRow, {
                    borderBottomWidth: idx < filteredUsers.length - 1 ? 1 : 0,
                    borderBottomColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                    backgroundColor: idx % 2 === 0 ? 'transparent' : (isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.01)'),
                    borderRadius: 8,
                  }]}
                >
                  <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.avatarBox, { backgroundColor: `${getRoleColor(user.role)}15`, borderWidth: 1, borderColor: `${getRoleColor(user.role)}30` }]}>
                      <Text style={{ color: getRoleColor(user.role), fontWeight: '800', fontSize: 15 }}>{user.name.charAt(0)}</Text>
                    </View>
                    <View style={{ marginLeft: 14 }}>
                      <Text style={[typography.body, { color: colors.text, fontWeight: '700' }]}>{user.name}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                        <Mail size={11} color={colors.textTertiary} style={{ marginRight: 5 }} />
                        <Text style={[typography.micro, { color: colors.textTertiary, fontWeight: '500' }]}>{user.email}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={{ flex: 1.5 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <ShieldCheck size={14} color={getRoleColor(user.role)} style={{ marginRight: 6 }} />
                      <Text style={[typography.body, { color: getRoleColor(user.role), fontWeight: '700', fontSize: 13 }]}>{user.role}</Text>
                    </View>
                  </View>

                  <View style={{ flex: 2, flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                    {user.projects.map((p: string) => (
                      <View key={p} style={[styles.projectTag, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc', borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}>
                        <Text style={[typography.micro, { color: colors.textSecondary, fontWeight: '600' }]}>{p}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={{ width: 100, alignItems: 'center' }}>
                    <View style={[styles.statusBadge, {
                      backgroundColor: user.status === 'ACTIVE' ? (isDark ? 'rgba(16,185,129,0.12)' : '#ecfdf5') : (isDark ? 'rgba(239,68,68,0.12)' : '#fef2f2'),
                      borderWidth: 1,
                      borderColor: user.status === 'ACTIVE' ? (isDark ? 'rgba(16,185,129,0.25)' : '#a7f3d0') : (isDark ? 'rgba(239,68,68,0.25)' : '#fca5a5'),
                    }]}>
                      <Text style={[typography.micro, {
                        color: user.status === 'ACTIVE' ? colors.success : colors.danger, fontWeight: '800', fontSize: 10
                      }]}>
                        {user.status === 'ACTIVE' ? 'HOẠT ĐỘNG' : 'KHÓA'}
                      </Text>
                    </View>
                  </View>

                  <View style={{ width: 80, flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc' }]}>
                      <Edit2 size={15} color={colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc' }]}>
                      <MoreVertical size={15} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              ))
            )}
          </ScrollView>
        </SGCard>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 },
  searchBox: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 44, borderRadius: 12, width: 280, borderWidth: 1 },
  searchInput: { flex: 1, marginLeft: 10, fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif", fontSize: 14, height: '100%', fontWeight: '500' },
  tableHeader: { flexDirection: 'row', alignItems: 'center', paddingBottom: 16, borderBottomWidth: 2 },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 8 },
  avatarBox: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  projectTag: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  actionBtn: { padding: 8, borderRadius: 8 },
  sectionCard: { padding: 28, borderRadius: 20, flex: 1 },
});
