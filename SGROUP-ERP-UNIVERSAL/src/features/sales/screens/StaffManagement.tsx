/**
 * StaffManagement — CRUD Nhân sự Sales
 */
import React from 'react';
import { View, Text, ScrollView, Pressable, Platform } from 'react-native';
import { UserCog, Plus, Star, User } from 'lucide-react-native';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { sgds } from '../../../shared/theme/theme';
import { SGCard, SGTable } from '../../../shared/ui/components';
import type { SalesRole } from '../SalesSidebar';

const MOCK_STAFF = [
  { id: '1', code: 'NV001', name: 'Nguyễn Văn A', team: 'Team Alpha', role: 'Senior Sales', deals: 28, gmv: 98, target: 120, status: 'ACTIVE' },
  { id: '2', code: 'NV002', name: 'Trần Thị B', team: 'Team Beta', role: 'Sales', deals: 24, gmv: 84, target: 100, status: 'ACTIVE' },
  { id: '3', code: 'NV003', name: 'Lê Minh C', team: 'Team Alpha', role: 'Sales', deals: 22, gmv: 77, target: 100, status: 'ACTIVE' },
  { id: '4', code: 'NV004', name: 'Phạm Đức D', team: 'Team Gamma', role: 'Team Lead', deals: 20, gmv: 70, target: 80, status: 'ACTIVE' },
  { id: '5', code: 'NV005', name: 'Hoàng Kim E', team: 'Team Delta', role: 'Sales', deals: 18, gmv: 63, target: 100, status: 'ACTIVE' },
  { id: '6', code: 'NV006', name: 'Vũ Thành F', team: 'Team Beta', role: 'Junior Sales', deals: 12, gmv: 42, target: 60, status: 'ACTIVE' },
];

const fmt = (n: number) => n.toLocaleString('vi-VN');

export function StaffManagement({ userRole }: { userRole?: SalesRole }) {
  const { theme, isDark } = useAppTheme();
  const cText = theme.colors.textPrimary;
  const cSub = theme.colors.textSecondary;
  const canEdit = userRole !== 'sales' && userRole !== 'ceo';

  const STAFF_COLUMNS: any = [
    { key: 'code', title: 'MÃ NV', width: 80, render: (v: any) => <Text style={{ fontSize: 12, fontWeight: '700', color: cSub }}>{v}</Text> },
    { key: 'name', title: 'HỌ TÊN', flex: 2, render: (v: any) => (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#3b82f610', alignItems: 'center', justifyContent: 'center' }}>
          <User size={14} color="#3b82f6" />
        </View>
        <Text style={{ fontSize: 14, fontWeight: '700', color: cText }}>{v}</Text>
      </View>
    ) },
    { key: 'team', title: 'TEAM', flex: 1.2, render: (v: any) => <Text style={{ fontSize: 12, fontWeight: '600', color: cSub }}>{v}</Text> },
    { key: 'role', title: 'VAI TRÒ', flex: 1, render: (v: any) => (
      <View style={{ backgroundColor: isDark ? 'rgba(139,92,246,0.1)' : '#f5f3ff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' }}>
        <Text style={{ fontSize: 10, fontWeight: '800', color: '#8b5cf6' }}>{v}</Text>
      </View>
    ) },
    { key: 'deals', title: 'DEALS', width: 70, align: 'center', render: (v: any) => <Text style={{ fontSize: 15, fontWeight: '900', color: cText, textAlign: 'center' }}>{v}</Text> },
    { key: 'gmv', title: 'GMV (TỶ)', flex: 1, align: 'center', render: (v: any) => <Text style={{ fontSize: 15, fontWeight: '900', color: '#3b82f6', textAlign: 'center' }}>{fmt(v)}</Text> },
    { key: 'target', title: 'TARGET', flex: 1, align: 'center', render: (v: any) => <Text style={{ fontSize: 13, fontWeight: '700', color: cSub, textAlign: 'center' }}>{fmt(v)}</Text> },
    { key: 'achievement', title: '% ĐẠT', width: 90, align: 'center', render: (_: any, r: any) => {
      const achievement = r.target > 0 ? Math.round((r.gmv / r.target) * 100) : 0;
      const achColor = achievement >= 100 ? '#22c55e' : achievement >= 70 ? '#f59e0b' : '#ef4444';
      return (
        <View style={{ backgroundColor: achColor + '20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'center' }}>
          <Text style={{ fontSize: 12, fontWeight: '900', color: achColor }}>{achievement}%</Text>
        </View>
      );
    } },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? theme.colors.background : theme.colors.backgroundAlt }}>
      <ScrollView contentContainerStyle={{ padding: 32, gap: 24, paddingBottom: 120 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: '#f59e0b20', alignItems: 'center', justifyContent: 'center' }}>
              <UserCog size={22} color="#f59e0b" />
            </View>
            <View>
              <Text style={{ ...sgds.typo.h2, color: cText }}>Nhân Sự Sales</Text>
              <Text style={{ ...sgds.typo.body, color: cSub, marginTop: 2 }}>{MOCK_STAFF.length} nhân viên</Text>
            </View>
          </View>
          {canEdit && <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#3b82f6', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 }}>
            <Plus size={16} color="#fff" />
            <Text style={{ fontSize: 12, fontWeight: '800', color: '#fff' }}>THÊM NV</Text>
          </Pressable>}
        </View>

        <SGCard variant="glass" noPadding>
          <SGTable 
            columns={STAFF_COLUMNS} 
            data={MOCK_STAFF} 
            onRowPress={(row) => console.log('Press staff', row)} 
            style={{ borderWidth: 0, backgroundColor: 'transparent' }}
          />
        </SGCard>
      </ScrollView>
    </View>
  );
}
