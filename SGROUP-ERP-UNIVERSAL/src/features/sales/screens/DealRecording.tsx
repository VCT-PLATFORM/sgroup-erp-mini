/**
 * DealRecording — Ghi nhận giao dịch mới + Danh sách deals
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Platform, TextInput } from 'react-native';
import { ShoppingCart, Plus, Filter, ChevronDown } from 'lucide-react-native';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { sgds } from '../../../shared/theme/theme';
import { SGCard, SGTable } from '../../../shared/ui/components';
import type { SalesRole } from '../SalesSidebar';

const STAGE_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  LEAD: { bg: '#f1f5f9', text: '#64748b', label: 'Lead' },
  MEETING: { bg: '#eff6ff', text: '#3b82f6', label: 'Hẹn gặp' },
  BOOKING: { bg: '#f5f3ff', text: '#8b5cf6', label: 'Giữ chỗ' },
  DEPOSIT: { bg: '#fef3c7', text: '#d97706', label: 'Đặt cọc' },
  CONTRACT: { bg: '#ecfdf5', text: '#059669', label: 'Ký HĐ' },
  COMPLETED: { bg: '#dcfce7', text: '#16a34a', label: '✓ Hoàn tất' },
  CANCELLED: { bg: '#fef2f2', text: '#dc2626', label: 'Huỷ' },
};

const MOCK_DEALS = [
  { id: '1', dealCode: 'GD-202603-A1X', customer: 'Nguyễn Văn A', phone: '0901234567', project: 'Vinhomes Ocean Park 3', product: 'S1-2005', value: 3.5, feeRate: 5.0, commission: 0.175, stage: 'COMPLETED', staff: 'Trần Thị B', team: 'Team Alpha', source: 'MARKETING', date: '10/03/2026' },
  { id: '2', dealCode: 'GD-202603-B2Y', customer: 'Lê Minh C', phone: '0912345678', project: 'Masteri Waterfront', product: 'MW-1508', value: 5.5, feeRate: 4.5, commission: 0.248, stage: 'CONTRACT', staff: 'Phạm Đức D', team: 'Team Beta', source: 'SELF_GEN', date: '09/03/2026' },
  { id: '3', dealCode: 'GD-202603-C3Z', customer: 'Hoàng Kim E', phone: '0923456789', project: 'Grand Marina', product: 'GM-B05', value: 15.0, feeRate: 3.5, commission: 0.525, stage: 'DEPOSIT', staff: 'Nguyễn Văn A', team: 'Team Alpha', source: 'REFERRAL', date: '08/03/2026' },
  { id: '4', dealCode: 'GD-202603-D4W', customer: 'Vũ Thành F', phone: '0934567890', project: 'The Global City', product: 'TGC-SH012', value: 12.0, feeRate: 4.0, commission: 0.480, stage: 'BOOKING', staff: 'Trần Thị B', team: 'Team Alpha', source: 'MARKETING', date: '07/03/2026' },
  { id: '5', dealCode: 'GD-202603-E5V', customer: 'Đặng Hải G', phone: '0945678901', project: 'Ecopark', product: 'EP-BT15', value: 8.0, feeRate: 5.5, commission: 0.440, stage: 'MEETING', staff: 'Lê Minh C', team: 'Team Gamma', source: 'SELF_GEN', date: '06/03/2026' },
];

const fmt = (n: number) => n.toLocaleString('vi-VN', { minimumFractionDigits: n < 10 ? 1 : 0, maximumFractionDigits: 3 });

export function DealRecording({ userRole }: { userRole?: SalesRole }) {
  const { theme, isDark } = useAppTheme();
  const cText = theme.colors.textPrimary;
  const cSub = theme.colors.textSecondary;
  const canCreate = userRole === 'sales' || userRole === 'sales_manager' || userRole === 'sales_admin';

  const sourceLabels: Record<string, { bg: string; text: string; label: string }> = {
    MARKETING: { bg: '#dbeafe', text: '#2563eb', label: 'MKT' },
    SELF_GEN: { bg: '#fef3c7', text: '#d97706', label: 'TỰ KIẾM' },
    REFERRAL: { bg: '#dcfce7', text: '#16a34a', label: 'GIỚI THIỆU' },
  };

  const DEAL_COLUMNS: any = [
    { key: 'dealCode', title: 'MÃ GD', width: 100, render: (v: any) => <Text style={{ fontSize: 11, fontWeight: '700', color: '#3b82f6' }}>{v}</Text> },
    { key: 'customer', title: 'KHÁCH HÀNG', flex: 1.5, render: (v: any, r: any) => (
      <View>
        <Text style={{ fontSize: 13, fontWeight: '700', color: cText }}>{v}</Text>
        <Text style={{ fontSize: 10, color: cSub, marginTop: 2 }}>{r.phone}</Text>
      </View>
    ) },
    { key: 'project', title: 'DỰ ÁN', flex: 1.5, render: (v: any, r: any) => (
      <View>
        <Text style={{ fontSize: 12, fontWeight: '600', color: cText }}>{v}</Text>
        <Text style={{ fontSize: 10, color: cSub, marginTop: 2 }}>{r.product}</Text>
      </View>
    ) },
    { key: 'value', title: 'GIÁ TRỊ', width: 90, align: 'center', render: (v: any) => <Text style={{ fontSize: 14, fontWeight: '900', color: cText, textAlign: 'center' }}>{fmt(v)} Tỷ</Text> },
    { key: 'feeRate', title: 'PHÍ %', width: 60, align: 'center', render: (v: any) => <Text style={{ fontSize: 12, fontWeight: '700', color: '#8b5cf6', textAlign: 'center' }}>{v}%</Text> },
    { key: 'commission', title: 'HOA HỒNG', width: 90, align: 'center', render: (v: any) => <Text style={{ fontSize: 13, fontWeight: '800', color: '#22c55e', textAlign: 'center' }}>{fmt(v)} Tỷ</Text> },
    { key: 'stage', title: 'TRẠNG THÁI', width: 90, align: 'center', render: (v: any) => {
      const s = STAGE_COLORS[v] || STAGE_COLORS.LEAD;
      return (
        <View style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: s.bg, alignSelf: 'center' }}>
          <Text style={{ fontSize: 9, fontWeight: '800', color: s.text }}>{s.label}</Text>
        </View>
      );
    } },
    { key: 'staff', title: 'SALES', flex: 1, render: (v: any) => <Text style={{ fontSize: 12, fontWeight: '600', color: cSub }}>{v}</Text> },
    { key: 'source', title: 'NGUỒN', width: 70, align: 'center', render: (v: any) => {
      const srcInfo = sourceLabels[v] || sourceLabels.MARKETING;
      return (
        <View style={{ paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4, backgroundColor: srcInfo.bg, alignSelf: 'center' }}>
          <Text style={{ fontSize: 8, fontWeight: '800', color: srcInfo.text }}>{srcInfo.label}</Text>
        </View>
      );
    } },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? theme.colors.background : theme.colors.backgroundAlt }}>
      <ScrollView contentContainerStyle={{ padding: 32, gap: 24, paddingBottom: 120 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: '#3b82f620', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingCart size={22} color="#3b82f6" />
            </View>
            <View>
              <Text style={{ ...sgds.typo.h2, color: cText }}>Giao Dịch</Text>
              <Text style={{ ...sgds.typo.body, color: cSub, marginTop: 2 }}>{MOCK_DEALS.length} giao dịch — Tháng 03/2026</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 }}>
              <Filter size={14} color={cSub} />
              <Text style={{ fontSize: 12, fontWeight: '700', color: cSub }}>BỘ LỌC</Text>
            </Pressable>
            {canCreate && <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#3b82f6', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 }}>
              <Plus size={16} color="#fff" />
              <Text style={{ fontSize: 12, fontWeight: '800', color: '#fff' }}>GHI NHẬN GD</Text>
            </Pressable>}
          </View>
        </View>

        <SGCard variant="glass" noPadding>
          <SGTable 
            columns={DEAL_COLUMNS} 
            data={MOCK_DEALS} 
            onRowPress={(row) => console.log('Press deal', row)} 
            style={{ borderWidth: 0, backgroundColor: 'transparent' }}
          />
        </SGCard>
      </ScrollView>
    </View>
  );
}
