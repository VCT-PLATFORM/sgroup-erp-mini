/**
 * Timekeeping — Bảng chấm công cá nhân
 */
import React from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import { Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react-native';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { sgds } from '../../../shared/theme/theme';
import { SGCard, SGGradientStatCard, SGTable } from '../../../shared/ui/components';
import type { SalesRole } from '../SalesSidebar';

const timekeepingData: { id: string; date: string; dayOfWeek: string; checkIn: string; checkOut: string; status: string }[] = [];

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  ON_TIME: { bg: '#dcfce7', text: '#16a34a', label: 'Đúng giờ' },
  LATE: { bg: '#fef3c7', text: '#d97706', label: 'Đi trễ/Về sớm' },
  LEAVE: { bg: '#fee2e2', text: '#dc2626', label: 'Nghỉ phép' },
};

export function Timekeeping({ userRole }: { userRole?: SalesRole }) {
  const { theme, isDark } = useAppTheme();
  const cText = theme.colors.textPrimary;
  const cSub = theme.colors.textSecondary;

  const TIME_COLUMNS: any = [
    { key: 'date', title: 'NGÀY', flex: 1, render: (v: any, row: any) => (
      <View>
        <Text style={{ fontSize: 13, fontWeight: '700', color: cText }}>{v}</Text>
        <Text style={{ fontSize: 11, color: cSub }}>{row.dayOfWeek}</Text>
      </View>
    ) },
    { key: 'checkIn', title: 'CHECK IN', flex: 1, render: (v: any) => <Text style={{ fontSize: 13, fontWeight: '600', color: cText }}>{v}</Text> },
    { key: 'checkOut', title: 'CHECK OUT', flex: 1, render: (v: any) => <Text style={{ fontSize: 13, fontWeight: '600', color: cText }}>{v}</Text> },
    { key: 'status', title: 'TRẠNG THÁI', flex: 1, align: 'center', render: (v: any) => {
      const s = STATUS_CONFIG[v];
      return (
        <View style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: s.bg, alignSelf: 'center' }}>
          <Text style={{ fontSize: 10, fontWeight: '800', color: s.text }}>{s.label.toUpperCase()}</Text>
        </View>
      );
    } },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? theme.colors.background : theme.colors.backgroundAlt }}>
      <ScrollView contentContainerStyle={{ padding: 32, gap: 24, paddingBottom: 120 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: '#3b82f620', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={22} color="#3b82f6" />
          </View>
          <View>
            <Text style={{ ...sgds.typo.h2, color: cText }}>Chấm Công</Text>
            <Text style={{ ...sgds.typo.body, color: cSub, marginTop: 2 }}>Tháng 03/2026</Text>
          </View>
        </View>

        {/* Summary */}
        <View style={{ flexDirection: 'row', gap: 20, flexWrap: 'wrap' }}>
          <SGGradientStatCard icon={<CheckCircle size={20} color="#22c55e" />} label="SỐ NGÀY CÔNG" value="13.5" unit="ngày" color="#22c55e" />
          <SGGradientStatCard icon={<AlertCircle size={20} color="#f59e0b" />} label="ĐI TRỄ / VỀ SỚM" value="1" unit="lần" color="#f59e0b" />
          <SGGradientStatCard icon={<Calendar size={20} color="#3b82f6" />} label="NGHỈ PHÉP" value="1" unit="ngày" color="#3b82f6" />
        </View>

        {/* Table */}
        <SGCard variant="glass" noPadding>
          <SGTable 
            columns={TIME_COLUMNS} 
            data={timekeepingData} 
            style={{ borderWidth: 0, backgroundColor: 'transparent' }}
          />
        </SGCard>
      </ScrollView>
    </View>
  );
}
