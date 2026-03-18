/**
 * LeavesScreen — HR Leave Requests Management
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Calendar, Search, CheckCircle, Clock, XCircle, FileText, LayoutGrid, List } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { sgds } from '../../../shared/theme/theme';
import { SGCard, SGTable } from '../../../shared/ui/components';
import { useLeaves } from '../hooks/useHR';

// Leave type display map
const LEAVE_TYPE_LABELS: Record<string, string> = {
  ANNUAL: 'Nghỉ phép năm',
  SICK: 'Nghỉ ốm',
  UNPAID: 'Nghỉ không lương',
  MATERNITY: 'Nghỉ thai sản',
};

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  APPROVED: { bg: '#dcfce7', text: '#16a34a', label: 'ĐÃ DUYỆT' },
  PENDING: { bg: '#fef3c7', text: '#d97706', label: 'CHỜ DUYỆT' },
  REJECTED: { bg: '#fee2e2', text: '#dc2626', label: 'TỪ CHỐI' },
};

export function LeavesScreen() {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const { theme, isDark } = useAppTheme();
  const cText = theme.colors.textPrimary;
  const cSub = theme.colors.textSecondary;
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : '#ffffff';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  // Fetch real leaves from API
  const { data: rawLeaves, isLoading } = useLeaves();
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('vi-VN');

  const safeLeaves = Array.isArray(rawLeaves) ? rawLeaves : (rawLeaves as any)?.data ?? [];

  // Transform for table display
  const leavesData = safeLeaves.map((l: any) => ({
    id: l.id,
    code: l.employee?.employeeCode || '',
    name: l.employee?.fullName || '',
    dept: '',
    type: LEAVE_TYPE_LABELS[l.leaveType] || l.leaveType,
    from: fmtDate(l.startDate),
    to: fmtDate(l.endDate),
    days: l.totalDays,
    status: l.status,
  }));

  const pendingCount = leavesData.filter((l: any) => l.status === 'PENDING').length;
  const approvedCount = leavesData.filter((l: any) => l.status === 'APPROVED').length;
  const rejectedCount = leavesData.filter((l: any) => l.status === 'REJECTED').length;

  const COLUMNS: any = [
    { key: 'name', title: 'NHÂN VIÊN', flex: 1.5, render: (v: any, row: any) => (
      <View>
        <Text style={{ fontSize: 13, fontWeight: '700', color: cText }}>{v}</Text>
        <Text style={{ fontSize: 11, color: cSub, marginTop: 2 }}>{row.dept}</Text>
      </View>
    ) },
    { key: 'type', title: 'LOẠI ĐƠN', flex: 1.2, render: (v: any) => <Text style={{ fontSize: 12, fontWeight: '600', color: cText }}>{v}</Text> },
    { key: 'time', title: 'THỜI GIAN', flex: 1.5, render: (_: any, row: any) => (
      <View>
        <Text style={{ fontSize: 12, color: cText }}>{row.from} - {row.to}</Text>
        <Text style={{ fontSize: 11, fontWeight: '700', color: '#f59e0b', marginTop: 2 }}>{row.days} ngày</Text>
      </View>
    ) },
    { key: 'status', title: 'TRẠNG THÁI', flex: 1, align: 'center', render: (v: any) => {
      const s = STATUS_CONFIG[v];
      return (
        <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: s.bg, alignSelf: 'center' }}>
          <Text style={{ fontSize: 10, fontWeight: '800', color: s.text }}>{s.label}</Text>
        </View>
      );
    } },
    { key: 'actions', title: '', flex: 0.5, align: 'right', render: () => (
      <TouchableOpacity style={{ padding: 6 }}>
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#3b82f6' }}>Duyệt</Text>
      </TouchableOpacity>
    ) }
  ];

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? theme.colors.background : theme.colors.backgroundAlt }}>
      <ScrollView contentContainerStyle={{ padding: 28, gap: 24, paddingBottom: 120 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={{ width: 52, height: 52, borderRadius: 18, backgroundColor: '#f59e0b20', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={24} color="#f59e0b" />
            </View>
            <View>
              <Text style={{ ...sgds.typo.h2, color: cText }}>Quản lý Đơn từ</Text>
              <Text style={{ ...sgds.typo.body, color: cSub, marginTop: 2 }}>Duyệt đơn xin phép, thai sản, công tác</Text>
            </View>
          </View>
        </View>

        {/* Stats Summary */}
        <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
          {[
            { label: 'CHỜ DUYỆT', val: String(pendingCount), icon: Clock, color: '#f59e0b', gradient: ['#f59e0b', '#d97706'], shadow: '#f59e0b' },
            { label: 'ĐÃ DUYỆT', val: String(approvedCount), icon: CheckCircle, color: '#10b981', gradient: ['#10b981', '#059669'], shadow: '#10b981' },
            { label: 'TỪ CHỐI', val: String(rejectedCount), icon: XCircle, color: '#ef4444', gradient: ['#ef4444', '#dc2626'], shadow: '#ef4444' },
          ].map((s, i) => (
            <LinearGradient
              key={i}
              colors={isDark ? ['rgba(30,41,59,0.7)', 'rgba(15,23,42,0.8)'] : ['#ffffff', '#f8fafc']}
              style={{
                flex: 1, minWidth: 200, padding: 24, borderRadius: 24,
                borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)',
                shadowColor: isDark ? '#000' : s.shadow, shadowOpacity: isDark ? 0.3 : 0.08, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 5,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <LinearGradient
                  colors={s.gradient as [string, string]} start={{x:0, y:0}} end={{x:1, y:1}}
                  style={{ width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', shadowColor: s.shadow, shadowOpacity: 0.4, shadowRadius: 8, shadowOffset: {width:0, height:4} }}
                >
                  <s.icon size={22} color="#fff" />
                </LinearGradient>
                <Text style={{ fontSize: 12, fontWeight: '800', color: cSub, flex: 1, letterSpacing: 0.5 }}>{s.label}</Text>
              </View>
              <Text style={{ fontSize: 36, fontWeight: '900', color: cText, letterSpacing: -1 }}>{s.val}</Text>
            </LinearGradient>
          ))}
        </View>

        {/* Table actions */}
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', marginTop: 8 }}>
          <View style={{
            flexDirection: 'row', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
            borderRadius: 16, padding: 4,
          }}>
            <TouchableOpacity onPress={() => setViewMode('table')} style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: viewMode === 'table' ? (isDark ? '#3b82f6' : '#fff') : 'transparent', shadowColor: '#000', shadowOpacity: viewMode === 'table' ? 0.05 : 0, shadowRadius: 4, elevation: viewMode === 'table' ? 2 : 0 }}>
              <List size={18} color={viewMode === 'table' ? (isDark ? '#fff' : cText) : cSub} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setViewMode('grid')} style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: viewMode === 'grid' ? (isDark ? '#3b82f6' : '#fff') : 'transparent', shadowColor: '#000', shadowOpacity: viewMode === 'grid' ? 0.05 : 0, shadowRadius: 4, elevation: viewMode === 'grid' ? 2 : 0 }}>
              <LayoutGrid size={18} color={viewMode === 'grid' ? (isDark ? '#fff' : cText) : cSub} />
            </TouchableOpacity>
          </View>
          <View style={{
            flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10,
            backgroundColor: cardBg, borderWidth: 1, borderColor,
            borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12,
          }}>
            <Search size={18} color={cSub} />
            <Text style={{ color: cSub, fontSize: 14 }}>Tìm nhân viên...</Text>
          </View>
        </View>

        {/* Content View */}
        {isLoading ? (
          <View style={{ padding: 60, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#f59e0b" />
            <Text style={{ color: cSub, marginTop: 16, fontSize: 14, fontWeight: '600' }}>Đang tải đơn từ...</Text>
          </View>
        ) : viewMode === 'table' ? (
          <View style={{
            backgroundColor: isDark ? 'rgba(30,41,59,0.35)' : '#ffffff',
            borderRadius: 28, overflow: 'hidden',
            borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
            ...(Platform.OS === 'web' ? { 
              backdropFilter: 'blur(32px)', 
              WebkitBackdropFilter: 'blur(32px)',
              boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.2)' : '0 12px 32px rgba(0,0,0,0.04)' 
            } : {}),
          }}>
            <SGTable 
              columns={COLUMNS} 
              data={leavesData} 
              style={{ borderWidth: 0, backgroundColor: 'transparent' }}
            />
          </View>
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 20 }}>
            {leavesData.length === 0 ? (
              <Text style={{ color: cSub, fontSize: 15, padding: 32, textAlign: 'center', width: '100%' }}>Không có đơn từ nào.</Text>
            ) : null}
            {leavesData.map((item: any, idx: number) => {
              const s = STATUS_CONFIG[item.status] || STATUS_CONFIG.PENDING;
              return (
                <LinearGradient
                  key={item.id || idx}
                  colors={isDark ? ['rgba(30,41,59,0.5)', 'rgba(15,23,42,0.8)'] : ['#ffffff', '#ffffff']}
                  style={{
                    flex: 1, minWidth: 320, maxWidth: Platform.OS === 'web' ? '48%' : '100%', borderRadius: 24, padding: 24,
                    borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                    shadowColor: '#000', shadowOpacity: isDark ? 0.3 : 0.04, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 4,
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center', flex: 1 }}>
                      <LinearGradient
                        colors={isDark ? ['rgba(245,158,11,0.2)', 'rgba(245,158,11,0.05)'] : ['#fef3c7', '#fde68a']}
                        style={{ width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(245,158,11,0.1)' }}
                      >
                        <FileText size={20} color="#f59e0b" />
                      </LinearGradient>
                      <View style={{ flex: 1, paddingRight: 8 }}>
                        <Text style={{ fontSize: 16, fontWeight: '800', color: cText }} numberOfLines={1}>{item.name}</Text>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: cSub, marginTop: 2 }}>{item.code}</Text>
                      </View>
                    </View>
                    <View style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: s.bg }}>
                      <Text style={{ fontSize: 11, fontWeight: '800', color: s.text, letterSpacing: 0.5 }}>
                        {s.label}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={{ gap: 12, marginBottom: 24, paddingHorizontal: 4 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: cSub }}>Loại đơn</Text>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: cText }}>{item.type}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: cSub }}>Thời gian</Text>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: cText }}>{item.from} - {item.to}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: cSub }}>Tổng số ngày</Text>
                      <Text style={{ fontSize: 14, fontWeight: '800', color: '#f59e0b' }}>{item.days} ngày</Text>
                    </View>
                  </View>

                  <View style={{ borderTopWidth: 1, borderTopColor: borderColor, paddingTop: 18, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <TouchableOpacity style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: isDark ? 'rgba(59,130,246,0.1)' : '#eff6ff', borderRadius: 12 }}>
                      <Text style={{ fontSize: 13, fontWeight: '800', color: '#3b82f6' }}>XEM & DUYỆT</Text>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
