import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useTheme, typography } from '../../../shared/theme/theme';
import { useThemeStore } from '../../../shared/theme/themeStore';
import { SGCard, SGButton } from '../../../shared/ui';
import { ShieldCheck, Users, Search, MoreVertical, Edit2, Trash2, Mail } from 'lucide-react-native';

const MOCK_USERS = [
  { id: '1', name: 'Nguyễn Văn Quyết', email: 'quyet.nv@sgroup.vn', role: 'Project Manager', projects: ['SG Center', 'Eco Park'], status: 'ACTIVE', date: '10/10/2023' },
  { id: '2', name: 'Trần Thị Thu Thảo', email: 'thao.ttt@sgroup.vn', role: 'Sales Director', projects: ['SG Center'], status: 'ACTIVE', date: '12/10/2023' },
  { id: '3', name: 'Lê Hoàng Long', email: 'long.lh@sgroup.vn', role: 'Sales Manager', projects: ['Eco Park', 'Ocean View'], status: 'INACTIVE', date: '05/09/2023' },
  { id: '4', name: 'Phạm Minh Đức', email: 'duc.pm@sgroup.vn', role: 'Project Manager', projects: ['Ocean View'], status: 'ACTIVE', date: '20/10/2023' },
];

export function ProjectAssignment() {
  const colors = useTheme();
  const { isDark } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState('');

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Project Manager': return '#10b981';
      case 'Sales Director': return '#8b5cf6';
      case 'Sales Manager': return '#f59e0b';
      default: return '#3b82f6';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[typography.h2, { color: colors.text }]}>Phân quyền Dự án</Text>
          <Text style={[typography.body, { color: colors.textSecondary, marginTop: 8 }]}>
            Thiết lập quyền phân phối và truy cập dự án cho nhân sự
          </Text>
        </View>
        <SGButton title="Thêm Nhân sự" icon={<Users size={18} color="#fff" />} variant="primary" onPress={() => {}} />
      </View>

      <SGCard style={{ flex: 1, padding: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Text style={[typography.h4, { color: colors.text }]}>Danh sách Cán bộ Phụ trách</Text>
          <View style={[styles.searchBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9' }]}>
            <Search size={18} color={colors.textTertiary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text, outlineStyle: 'none' as any }]}
              placeholder="Tìm nhân sự..."
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[styles.tableHeader, { borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
            <Text style={[typography.micro, { color: colors.textSecondary, flex: 2 }]}>NHÂN SỰ</Text>
            <Text style={[typography.micro, { color: colors.textSecondary, flex: 1.5 }]}>VAI TRÒ</Text>
            <Text style={[typography.micro, { color: colors.textSecondary, flex: 2 }]}>DỰ ÁN PHỤ TRÁCH</Text>
            <Text style={[typography.micro, { color: colors.textSecondary, width: 100, textAlign: 'center' }]}>TRẠNG THÁI</Text>
            <Text style={[typography.micro, { color: colors.textSecondary, width: 80, textAlign: 'right' }]}></Text>
          </View>

          {MOCK_USERS.map((user, idx) => (
            <View key={user.id} style={[styles.tableRow, { 
              borderBottomWidth: idx < MOCK_USERS.length - 1 ? 1 : 0,
              borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            }]}>
              <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
                <View style={[styles.avatarBox, { backgroundColor: `${getRoleColor(user.role)}20` }]}>
                  <Text style={{ color: getRoleColor(user.role), fontWeight: '800', fontSize: 16 }}>{user.name.charAt(0)}</Text>
                </View>
                <View style={{ marginLeft: 12 }}>
                  <Text style={[typography.body, { color: colors.text, fontWeight: '700' }]}>{user.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                    <Mail size={12} color={colors.textTertiary} style={{ marginRight: 4 }} />
                    <Text style={[typography.micro, { color: colors.textSecondary }]}>{user.email}</Text>
                  </View>
                </View>
              </View>

              <View style={{ flex: 1.5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <ShieldCheck size={14} color={getRoleColor(user.role)} style={{ marginRight: 6 }} />
                  <Text style={[typography.body, { color: getRoleColor(user.role), fontWeight: '600' }]}>{user.role}</Text>
                </View>
              </View>

              <View style={{ flex: 2, flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {user.projects.map(p => (
                  <View key={p} style={[styles.projectTag, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9' }]}>
                    <Text style={[typography.micro, { color: colors.textSecondary, fontWeight: '600' }]}>{p}</Text>
                  </View>
                ))}
              </View>

              <View style={{ width: 100, alignItems: 'center' }}>
                <View style={[styles.statusBadge, { 
                  backgroundColor: user.status === 'ACTIVE' ? (isDark ? 'rgba(16,185,129,0.15)' : '#ecfdf5') : (isDark ? 'rgba(239,68,68,0.15)' : '#fef2f2') 
                }]}>
                  <Text style={[typography.micro, { 
                    color: user.status === 'ACTIVE' ? '#10b981' : '#ef4444', fontWeight: '700' 
                  }]}>
                    {user.status === 'ACTIVE' ? 'HOẠT ĐỘNG' : 'KHÓA'}
                  </Text>
                </View>
              </View>

              <View style={{ width: 80, flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
                <TouchableOpacity style={styles.actionBtn}>
                  <Edit2 size={16} color={colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <MoreVertical size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

            </View>
          ))}
        </ScrollView>
      </SGCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingBottom: 0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 },
  searchBox: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 40, borderRadius: 10, width: 250 },
  searchInput: { flex: 1, marginLeft: 8, fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif", fontSize: 13, height: '100%' },
  tableHeader: { flexDirection: 'row', alignItems: 'center', paddingBottom: 16, borderBottomWidth: 1 },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  avatarBox: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  projectTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  actionBtn: { padding: 6 },
});
