/**
 * TimekeepingScreen — HR Time & Attendance Management
 * Features: Daily overview, employee attendance list, leave requests
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Clock, CheckCircle, AlertCircle, Calendar, Users, XCircle, Search, LayoutGrid, List } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { sgds } from '../../../shared/theme/theme';
import { SGCard, SGTable } from '../../../shared/ui/components';
import type { HRRole } from '../HRSidebar';
import { useAttendance } from '../hooks/useHR';

const fmt = (n: number) => n.toLocaleString('vi-VN');

// Status config for attendance display

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  ON_TIME: { bg: '#dcfce7', text: '#16a34a', label: 'Đúng giờ' },
  LATE: { bg: '#fef3c7', text: '#d97706', label: 'Đi trễ' },
  ABSENT: { bg: '#fee2e2', text: '#dc2626', label: 'Vắng mặt' },
};

export function TimekeepingScreen({ userRole }: { userRole?: HRRole }) {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const { theme, isDark } = useAppTheme();
  const cText = theme.colors.textPrimary;
  const cSub = theme.colors.textSecondary;
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : '#ffffff';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  const today = new Date();
  const currentDate = today.toLocaleDateString('vi-VN');
  const todayStr = today.toISOString().split('T')[0];

  // Fetch real attendance from API
  const { data: rawAttendance, isLoading } = useAttendance({ date: todayStr });

  const safeAttendance = Array.isArray(rawAttendance) ? rawAttendance : (rawAttendance as any)?.data ?? [];

  // Transform API data for table display
  const attendanceData = safeAttendance.map((a: any) => {
    const fmtTime = (d: string | null) => d ? new Date(d).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '—';
    const statusMap: Record<string, string> = { PRESENT: 'ON_TIME', LATE: 'LATE', ABSENT: 'ABSENT', HALF_DAY: 'LATE', DAY_OFF: 'ABSENT' };
    return {
      id: a.id,
      code: a.employee?.employeeCode || '',
      name: a.employee?.fullName || '',
      dept: a.employee?.department?.name || '',
      shift: 'Hành chính',
      checkIn: fmtTime(a.checkInTime),
      checkOut: fmtTime(a.checkOutTime),
      status: statusMap[a.status] || a.status,
    };
  });

  const presentCount = attendanceData.filter((a: any) => a.status === 'ON_TIME').length;
  const lateCount = attendanceData.filter((a: any) => a.status === 'LATE').length;
  const absentCount = attendanceData.filter((a: any) => a.status === 'ABSENT').length;

  const COLUMNS: any = [
    { key: 'name', title: 'NHÂN VIÊN', flex: 1.5, render: (v: any, row: any) => (
      <View>
        <Text style={{ fontSize: 13, fontWeight: '700', color: cText }}>{v}</Text>
        <Text style={{ fontSize: 11, color: cSub, marginTop: 2 }}>{row.code} • {row.dept}</Text>
      </View>
    ) },
    { key: 'shift', title: 'CA LÀM VIỆC', flex: 1, render: (v: any) => <Text style={{ fontSize: 12, color: cText }}>{v}</Text> },
    { key: 'checkIn', title: 'CHECK IN', flex: 1, render: (v: any, row: any) => (
      <Text style={{ fontSize: 13, fontWeight: '800', color: row.status === 'LATE' ? '#d97706' : cText }}>{v}</Text>
    ) },
    { key: 'checkOut', title: 'CHECK OUT', flex: 1, render: (v: any) => <Text style={{ fontSize: 13, fontWeight: '600', color: cText }}>{v}</Text> },
    { key: 'status', title: 'TRẠNG THÁI', flex: 1, align: 'center', render: (v: any) => {
      const s = STATUS_CONFIG[v];
      return (
        <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: s?.bg || '#f1f5f9', alignSelf: 'center' }}>
          <Text style={{ fontSize: 10, fontWeight: '800', color: s?.text || '#64748b' }}>{s?.label.toUpperCase() || v}</Text>
        </View>
      );
    } },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? theme.colors.background : theme.colors.backgroundAlt }}>
      <ScrollView contentContainerStyle={{ padding: 28, gap: 24, paddingBottom: 120 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={{ width: 52, height: 52, borderRadius: 18, backgroundColor: '#3b82f620', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={24} color="#3b82f6" />
            </View>
            <View>
              <Text style={{ ...sgds.typo.h2, color: cText }}>Chấm công & Điểm danh</Text>
              <Text style={{ ...sgds.typo.body, color: cSub, marginTop: 2 }}>Hôm nay: {currentDate}</Text>
            </View>
          </View>
          <TouchableOpacity style={{
            backgroundColor: '#3b82f6', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14,
            ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}),
          }}>
            <Text style={{ fontSize: 13, fontWeight: '800', color: '#fff' }}>XUẤT BẢNG CÔNG</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Summary */}
        <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
          {[
            { label: 'TỔNG ĐIỂM DANH', val: attendanceData.length, icon: Users, color: '#3b82f6', gradient: ['#3b82f6', '#2563eb'], shadow: '#3b82f6' },
            { label: 'ĐÚNG GIỜ', val: presentCount, icon: CheckCircle, color: '#22c55e', gradient: ['#10b981', '#059669'], shadow: '#10b981' },
            { label: 'ĐI TRỄ', val: lateCount, icon: AlertCircle, color: '#f59e0b', gradient: ['#f59e0b', '#d97706'], shadow: '#f59e0b' },
            { label: 'VẮNG MẶT', val: absentCount, icon: XCircle, color: '#ef4444', gradient: ['#ef4444', '#dc2626'], shadow: '#ef4444' },
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
          <TouchableOpacity style={{
            paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14,
            backgroundColor: cardBg, borderWidth: 1, borderColor,
          }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: cText }}>Phòng ban: Tất cả</Text>
          </TouchableOpacity>
        </View>

        {/* Content View */}
        {isLoading ? (
          <View style={{ padding: 60, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={{ color: cSub, marginTop: 16, fontSize: 14, fontWeight: '600' }}>Đang tải dữ liệu chấm công...</Text>
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
              data={attendanceData} 
              style={{ borderWidth: 0, backgroundColor: 'transparent' }}
            />
          </View>
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 20 }}>
            {attendanceData.length === 0 ? (
              <Text style={{ color: cSub, fontSize: 15, padding: 32, textAlign: 'center', width: '100%' }}>Chưa có người nào chấm công hôm nay.</Text>
            ) : null}
            {attendanceData.map((item: any, idx: number) => {
              const s = STATUS_CONFIG[item.status] || { bg: '#f1f5f9', text: '#64748b', label: item.status };
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
                        colors={isDark ? ['rgba(59,130,246,0.2)', 'rgba(59,130,246,0.05)'] : ['#eff6ff', '#dbeafe']}
                        style={{ width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(59,130,246,0.1)' }}
                      >
                        <Text style={{ fontSize: 18, fontWeight: '900', color: '#3b82f6' }}>{item.name.charAt(0)}</Text>
                      </LinearGradient>
                      <View style={{ flex: 1, paddingRight: 8 }}>
                        <Text style={{ fontSize: 16, fontWeight: '800', color: cText }} numberOfLines={1}>{item.name}</Text>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: cSub, marginTop: 2 }}>{item.code} • {item.dept}</Text>
                      </View>
                    </View>
                    <View style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: s.bg }}>
                      <Text style={{ fontSize: 11, fontWeight: '800', color: s.text, letterSpacing: 0.5 }}>
                        {s.label.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={{ gap: 14, marginBottom: 8, paddingHorizontal: 4, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ alignItems: 'center', flex: 1, padding: 12, backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc', borderRadius: 16, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9' }}>
                       <Text style={{ fontSize: 12, fontWeight: '700', color: cSub, textTransform: 'uppercase', marginBottom: 4 }}>Check In</Text>
                       <Text style={{ fontSize: 20, fontWeight: '900', color: item.status === 'LATE' ? '#f59e0b' : cText, fontVariant: ['tabular-nums'] }}>{item.checkIn}</Text>
                    </View>
                    <View style={{ alignItems: 'center', flex: 1, padding: 12, backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc', borderRadius: 16, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9' }}>
                       <Text style={{ fontSize: 12, fontWeight: '700', color: cSub, textTransform: 'uppercase', marginBottom: 4 }}>Check Out</Text>
                       <Text style={{ fontSize: 20, fontWeight: '900', color: cText, fontVariant: ['tabular-nums'] }}>{item.checkOut}</Text>
                    </View>
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
