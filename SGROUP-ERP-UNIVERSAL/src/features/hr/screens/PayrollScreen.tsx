/**
 * PayrollScreen — HR Payroll and Compensation Management
 * Features: View payslips, salary, allowances, deductions
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { Wallet, DollarSign, ArrowUpRight, ArrowDownRight, Search, FileText, CheckCircle, Clock } from 'lucide-react-native';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { sgds } from '../../../shared/theme/theme';
import { SGCard, SGTable } from '../../../shared/ui/components';
import type { HRRole } from '../HRSidebar';

const fmt = (n: number) => n.toLocaleString('vi-VN');
const currentMonth = new Date().getMonth() + 1;
const currentYear = new Date().getFullYear();

// Mock Data
const MOCK_PAYROLL = [
  { id: '1', code: 'SG001', name: 'Nguyễn Văn A', dept: 'Kinh Doanh', basic: 15000000, allowance: 2000000, commission: 8500000, deduction: 1580000, total: 23920000, status: 'PAID' },
  { id: '2', code: 'SG002', name: 'Trần Thị B', dept: 'IT', basic: 25000000, allowance: 1500000, commission: 0, deduction: 2750000, total: 23750000, status: 'PAID' },
  { id: '3', code: 'SG003', name: 'Lê Văn C', dept: 'Marketing', basic: 12000000, allowance: 1000000, commission: 2000000, deduction: 1250000, total: 13750000, status: 'PAID' },
  { id: '4', code: 'SG004', name: 'Phạm Thị D', dept: 'Kế toán', basic: 18000000, allowance: 1500000, commission: 0, deduction: 1890000, total: 17610000, status: 'PENDING' },
  { id: '5', code: 'SG005', name: 'Hoàng Văn E', dept: 'Nhân sự', basic: 20000000, allowance: 2000000, commission: 0, deduction: 2150000, total: 19850000, status: 'PENDING' },
];

export function PayrollScreen({ userRole }: { userRole?: HRRole }) {
  const { theme, isDark } = useAppTheme();
  const cText = theme.colors.textPrimary;
  const cSub = theme.colors.textSecondary;
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : '#ffffff';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  const COLUMNS: any = [
    { key: 'name', title: 'NHÂN VIÊN', flex: 1.5, render: (v: any, row: any) => (
      <View>
        <Text style={{ fontSize: 13, fontWeight: '700', color: cText }}>{v}</Text>
        <Text style={{ fontSize: 11, color: cSub, marginTop: 2 }}>{row.code} • {row.dept}</Text>
      </View>
    ) },
    { key: 'basic', title: 'LƯƠNG CƠ BẢN', flex: 1, render: (v: any) => <Text style={{ fontSize: 12, fontWeight: '600', color: cText }}>{fmt(v)} ₫</Text> },
    { key: 'allowance', title: 'PHỤ CẤP / THƯỞNG', flex: 1, render: (v: any, row: any) => (
      <View>
        <Text style={{ fontSize: 12, fontWeight: '600', color: '#10b981' }}>+ {fmt(v + row.commission)} ₫</Text>
      </View>
    ) },
    { key: 'deduction', title: 'BHXH & KHẤU TRỪ', flex: 1, render: (v: any) => <Text style={{ fontSize: 12, fontWeight: '600', color: '#ef4444' }}>- {fmt(v)} ₫</Text> },
    { key: 'total', title: 'THỰC LÃNH', flex: 1, render: (v: any) => <Text style={{ fontSize: 14, fontWeight: '800', color: '#3b82f6' }}>{fmt(v)} ₫</Text> },
    { key: 'status', title: 'TRẠNG THÁI', flex: 0.8, align: 'center', render: (v: any) => {
      const isPaid = v === 'PAID';
      return (
        <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: isPaid ? '#dcfce7' : '#fef3c7', alignSelf: 'center' }}>
          <Text style={{ fontSize: 10, fontWeight: '800', color: isPaid ? '#16a34a' : '#d97706' }}>
            {isPaid ? 'ĐÃ CHI' : 'CHỜ DUYỆT'}
          </Text>
        </View>
      );
    } },
    { key: 'actions', title: '', flex: 0.5, align: 'right', render: () => (
      <TouchableOpacity style={{ padding: 6 }}>
        <FileText size={16} color="#3b82f6" />
      </TouchableOpacity>
    ) }
  ];

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? theme.colors.background : theme.colors.backgroundAlt }}>
      <ScrollView contentContainerStyle={{ padding: 28, gap: 24, paddingBottom: 120 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={{ width: 52, height: 52, borderRadius: 18, backgroundColor: '#8b5cf620', alignItems: 'center', justifyContent: 'center' }}>
              <Wallet size={24} color="#8b5cf6" />
            </View>
            <View>
              <Text style={{ ...sgds.typo.h2, color: cText }}>Bảng Lương</Text>
              <Text style={{ ...sgds.typo.body, color: cSub, marginTop: 2 }}>Kỳ lương: Tháng {currentMonth}/{currentYear}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity style={{
              backgroundColor: cardBg, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 14,
              borderWidth: 1, borderColor,
              ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}),
            }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: cText }}>CHỐT BẢNG LƯƠNG</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
              backgroundColor: '#8b5cf6', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14,
              ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}),
            }}>
              <Text style={{ fontSize: 13, fontWeight: '800', color: '#fff' }}>GỬI PAYSLIP</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Summary */}
        <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
          {[
            { label: 'TỔNG QUỸ LƯƠNG', val: '98,900,000', unit: '₫', icon: DollarSign, color: '#8b5cf6' },
            { label: 'THƯỞNG & PHỤ CẤP', val: '16,500,000', unit: '₫', icon: ArrowUpRight, color: '#10b981' },
            { label: 'BHXH & KHẤU TRỪ', val: '9,620,000', unit: '₫', icon: ArrowDownRight, color: '#ef4444' },
            { label: 'ĐÃ THANH TOÁN', val: '60%', unit: '', icon: CheckCircle, color: '#3b82f6' },
          ].map((s, i) => (
            <View key={i} style={{
              flex: 1, minWidth: 200, padding: 22, borderRadius: 20,
              backgroundColor: cardBg, borderWidth: 1, borderColor,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: `${s.color}15`, alignItems: 'center', justifyContent: 'center' }}>
                  <s.icon size={20} color={s.color} />
                </View>
                <Text style={{ fontSize: 11, fontWeight: '800', color: cSub, flex: 1 }}>{s.label}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
                <Text style={{ fontSize: 32, fontWeight: '900', color: cText, letterSpacing: -0.5 }}>{s.val}</Text>
                {s.unit ? <Text style={{ fontSize: 14, fontWeight: '700', color: cSub }}>{s.unit}</Text> : null}
              </View>
            </View>
          ))}
        </View>

        {/* Filters */}
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', marginTop: 8 }}>
          <View style={{
            flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10,
            backgroundColor: cardBg, borderWidth: 1, borderColor,
            borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12,
          }}>
            <Search size={18} color={cSub} />
            <Text style={{ color: cSub, fontSize: 14 }}>Tìm nhân viên, mã NV...</Text>
          </View>
          <TouchableOpacity style={{
            paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14,
            backgroundColor: cardBg, borderWidth: 1, borderColor,
          }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: cText }}>Trạng thái: Tất cả</Text>
          </TouchableOpacity>
        </View>

        {/* Table */}
        <SGCard variant="glass" noPadding>
          <SGTable 
            columns={COLUMNS} 
            data={MOCK_PAYROLL} 
            style={{ borderWidth: 0, backgroundColor: 'transparent' }}
          />
        </SGCard>

      </ScrollView>
    </View>
  );
}
