/**
 * AdminDashboard — Real-time system overview (Phase 2 Upgraded)
 * Shows: stat cards, real health check, role distribution, recent audits, dept distribution
 */
import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, Platform } from 'react-native';
import {
  Users, Building, Briefcase, UsersRound, UserPlus, BarChart3, Clock,
  UserCheck, UserX, Activity, Server, Database, Shield, FileText,
  Wifi, WifiOff, Zap,
} from 'lucide-react-native';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { sgds } from '../../../shared/theme/theme';
import { useAdminStats, useAdminHealth } from '../hooks/useAdmin';

export function AdminDashboard() {
  const { theme, isDark } = useAppTheme();
  const cText = theme.colors.textPrimary;
  const cSub = theme.colors.textSecondary;
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : '#ffffff';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  const { data: stats, isLoading } = useAdminStats();
  const { data: health } = useAdminHealth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 120 }}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={{ color: cSub, marginTop: 12, fontSize: 14, fontWeight: '600' }}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  const statCards = [
    { label: 'NGƯỜI DÙNG', value: stats?.totalUsers ?? 0, icon: Users, color: '#6366f1', desc: 'Tài khoản hệ thống' },
    { label: 'ĐANG HOẠT ĐỘNG', value: stats?.activeUsers ?? 0, icon: UserCheck, color: '#10b981', desc: 'Users active' },
    { label: 'ĐÃ VÔ HIỆU HÓA', value: stats?.inactiveUsers ?? 0, icon: UserX, color: '#ef4444', desc: 'Users deactivated' },
    { label: 'PHÒNG BAN', value: stats?.totalDepartments ?? 0, icon: Building, color: '#ec4899', desc: 'Đang hoạt động' },
    { label: 'TEAMS', value: stats?.totalTeams ?? 0, icon: UsersRound, color: '#3b82f6', desc: 'Thuộc các phòng ban' },
    { label: 'CHỨC VỤ', value: stats?.totalPositions ?? 0, icon: Briefcase, color: '#8b5cf6', desc: 'Đã cấu hình' },
    { label: 'NHÂN VIÊN', value: stats?.totalEmployees ?? 0, icon: UserPlus, color: '#f59e0b', desc: 'Hồ sơ HR' },
    { label: 'AUDIT 24H', value: stats?.recentAuditCount ?? 0, icon: FileText, color: '#14b8a6', desc: 'Hoạt động mới' },
  ];

  const recentUsers = stats?.recentUsers ?? [];
  const deptDist = stats?.deptDistribution ?? [];
  const roleDist = stats?.roleDistribution ?? [];

  const roleLabels: Record<string, { label: string; color: string }> = {
    admin: { label: 'Admin', color: '#ef4444' },
    hr: { label: 'HR', color: '#ec4899' },
    employee: { label: 'Nhân viên', color: '#6366f1' },
    sales: { label: 'Sales', color: '#3b82f6' },
    ceo: { label: 'CEO', color: '#f59e0b' },
  };

  // Health check data
  const healthChecks = health?.checks ?? [];
  const overallStatus = health?.status ?? 'unknown';

  const statusIcon = (status: string) => {
    if (status === 'online') return <Wifi size={13} color="#10b981" strokeWidth={2.5} />;
    if (status === 'degraded') return <Zap size={13} color="#f59e0b" strokeWidth={2.5} />;
    return <WifiOff size={13} color="#ef4444" strokeWidth={2.5} />;
  };

  const statusColor = (status: string) => {
    if (status === 'online' || status === 'healthy') return '#10b981';
    if (status === 'degraded') return '#f59e0b';
    return '#ef4444';
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 28, gap: 24, paddingBottom: 120 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <View style={{ width: 52, height: 52, borderRadius: 18, backgroundColor: isDark ? 'rgba(99,102,241,0.12)' : '#eef2ff', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart3 size={24} color="#6366f1" />
          </View>
          <View>
            <Text style={{ ...sgds.typo.h2, color: cText }}>Tổng quan Hệ thống</Text>
            <Text style={{ ...sgds.typo.body, color: cSub, marginTop: 2 }}>Dữ liệu realtime — cập nhật mỗi 30s</Text>
          </View>
        </View>

        {/* Stat Cards */}
        <View style={{ flexDirection: 'row', gap: 14, flexWrap: 'wrap' }}>
          {statCards.map((s, i) => (
            <View key={i} style={{
              flex: 1, minWidth: 160, padding: 22, borderRadius: 20,
              backgroundColor: cardBg, borderWidth: 1, borderColor,
              ...(Platform.OS === 'web' ? { transition: 'all 0.2s ease' } : {}),
            } as any}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: `${s.color}15`, alignItems: 'center', justifyContent: 'center' }}>
                  <s.icon size={20} color={s.color} />
                </View>
                <View>
                  <Text style={{ fontSize: 11, fontWeight: '800', color: cSub, letterSpacing: 1 }}>{s.label}</Text>
                  <Text style={{ fontSize: 10, fontWeight: '600', color: `${cSub}80`, marginTop: 1 }}>{s.desc}</Text>
                </View>
              </View>
              <Text style={{ fontSize: 36, fontWeight: '900', color: cText }}>{s.value}</Text>
            </View>
          ))}
        </View>

        {/* System Health — from real API */}
        <View style={{ borderRadius: 20, backgroundColor: cardBg, borderWidth: 1, borderColor, overflow: 'hidden' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 20, borderBottomWidth: 1, borderBottomColor: borderColor }}>
            <Activity size={16} color={statusColor(overallStatus)} />
            <Text style={{ fontSize: 15, fontWeight: '800', color: cText }}>System Health</Text>
            <View style={{ marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: statusColor(overallStatus) }} />
              <Text style={{ fontSize: 11, fontWeight: '700', color: statusColor(overallStatus) }}>
                {overallStatus === 'healthy' ? 'All Systems Operational' : overallStatus === 'degraded' ? 'Degraded Performance' : 'Checking...'}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {healthChecks.map((item: any, idx: number) => (
              <View key={idx} style={{
                flex: 1, minWidth: 180, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 12,
                borderRightWidth: idx < healthChecks.length - 1 ? 1 : 0, borderRightColor: borderColor,
              }}>
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: `${statusColor(item.status)}12`, alignItems: 'center', justifyContent: 'center' }}>
                  {statusIcon(item.status)}
                </View>
                <View>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: cText }}>{item.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Text style={{ fontSize: 11, fontWeight: '800', color: statusColor(item.status), textTransform: 'uppercase' }}>{item.status}</Text>
                    {item.latency > 0 && (
                      <Text style={{ fontSize: 9, fontWeight: '600', color: cSub }}>({item.latency}ms)</Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Role Distribution + Recent Users — side by side */}
        <View style={{ flexDirection: 'row', gap: 20, flexWrap: 'wrap' }}>
          {/* Role Distribution */}
          <View style={{ flex: 1, minWidth: 300, borderRadius: 20, backgroundColor: cardBg, borderWidth: 1, borderColor, overflow: 'hidden' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 20, borderBottomWidth: 1, borderBottomColor: borderColor }}>
              <Shield size={16} color="#8b5cf6" />
              <Text style={{ fontSize: 15, fontWeight: '800', color: cText }}>Phân bổ vai trò</Text>
            </View>
            {roleDist.length === 0 ? (
              <View style={{ padding: 30, alignItems: 'center' }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: cSub }}>Chưa có dữ liệu</Text>
              </View>
            ) : (
              <View style={{ padding: 20, gap: 14 }}>
                {roleDist.map((r: any) => {
                  const maxCount = Math.max(...roleDist.map((x: any) => x.count), 1);
                  const pct = (r.count / maxCount) * 100;
                  const rl = roleLabels[r.role] || { label: r.role, color: '#64748b' };
                  return (
                    <View key={r.role}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: rl.color }} />
                          <Text style={{ fontSize: 13, fontWeight: '700', color: cText }}>{rl.label}</Text>
                        </View>
                        <Text style={{ fontSize: 13, fontWeight: '800', color: rl.color }}>{r.count}</Text>
                      </View>
                      <View style={{ height: 8, borderRadius: 4, backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', overflow: 'hidden' }}>
                        <View style={{
                          height: '100%', borderRadius: 4, width: `${pct}%`,
                          backgroundColor: rl.color,
                          ...(Platform.OS === 'web' ? { transition: 'width 0.4s ease' } : {}),
                        } as any} />
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          {/* Recent Users */}
          <View style={{ flex: 1, minWidth: 340, borderRadius: 20, backgroundColor: cardBg, borderWidth: 1, borderColor, overflow: 'hidden' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 20, borderBottomWidth: 1, borderBottomColor: borderColor }}>
              <Clock size={16} color="#6366f1" />
              <Text style={{ fontSize: 15, fontWeight: '800', color: cText }}>Người dùng mới nhất</Text>
            </View>
            {recentUsers.length === 0 ? (
              <View style={{ padding: 30, alignItems: 'center' }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: cSub }}>Chưa có user nào</Text>
              </View>
            ) : (
              recentUsers.map((u: any, i: number) => {
                const r = roleLabels[u.role] || { label: u.role, color: '#64748b' };
                return (
                  <View key={u.id} style={{
                    flexDirection: 'row', alignItems: 'center', gap: 12,
                    paddingHorizontal: 20, paddingVertical: 14,
                    borderBottomWidth: i < recentUsers.length - 1 ? 1 : 0, borderBottomColor: borderColor,
                  }}>
                    <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: `${r.color}12`, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontSize: 14, fontWeight: '800', color: r.color }}>{u.name?.charAt(0)?.toUpperCase()}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={{ fontSize: 13, fontWeight: '700', color: cText }}>{u.name}</Text>
                        {u.isActive === false && (
                          <View style={{ paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4, backgroundColor: 'rgba(239,68,68,0.12)' }}>
                            <Text style={{ fontSize: 8, fontWeight: '800', color: '#ef4444' }}>INACTIVE</Text>
                          </View>
                        )}
                      </View>
                      <Text style={{ fontSize: 11, fontWeight: '600', color: cSub }}>{u.email}</Text>
                    </View>
                    <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: `${r.color}12` }}>
                      <Text style={{ fontSize: 10, fontWeight: '800', color: r.color }}>{r.label}</Text>
                    </View>
                    <Text style={{ fontSize: 10, fontWeight: '600', color: cSub }}>
                      {new Date(u.createdAt).toLocaleDateString('vi')}
                    </Text>
                  </View>
                );
              })
            )}
          </View>
        </View>

        {/* Department Distribution */}
        <View style={{ borderRadius: 20, backgroundColor: cardBg, borderWidth: 1, borderColor, overflow: 'hidden' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 20, borderBottomWidth: 1, borderBottomColor: borderColor }}>
            <Building size={16} color="#ec4899" />
            <Text style={{ fontSize: 15, fontWeight: '800', color: cText }}>Phân bổ nhân sự theo Phòng ban</Text>
          </View>
          {deptDist.length === 0 ? (
            <View style={{ padding: 30, alignItems: 'center' }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: cSub }}>Chưa có phòng ban nào</Text>
            </View>
          ) : (
            <View style={{ padding: 20, gap: 14, flexDirection: 'row', flexWrap: 'wrap' }}>
              {deptDist.map((d: any) => {
                const empCount = d._count?.employees ?? 0;
                const teamCount = d._count?.teams ?? 0;
                const maxEmp = Math.max(...deptDist.map((x: any) => x._count?.employees ?? 0), 1);
                const pct = (empCount / maxEmp) * 100;
                return (
                  <View key={d.id} style={{ flex: 1, minWidth: 280 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={{ fontSize: 13, fontWeight: '700', color: cText }}>{d.name}</Text>
                        <Text style={{ fontSize: 10, fontWeight: '600', color: cSub }}>({d.code})</Text>
                      </View>
                      <View style={{ flexDirection: 'row', gap: 10 }}>
                        <Text style={{ fontSize: 11, fontWeight: '700', color: '#ec4899' }}>{empCount} NV</Text>
                        <Text style={{ fontSize: 11, fontWeight: '700', color: '#3b82f6' }}>{teamCount} team</Text>
                      </View>
                    </View>
                    <View style={{ height: 8, borderRadius: 4, backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', overflow: 'hidden' }}>
                      <View style={{
                        height: '100%', borderRadius: 4, width: `${pct}%`,
                        backgroundColor: '#ec4899',
                        ...(Platform.OS === 'web' ? { transition: 'width 0.4s ease' } : {}),
                      } as any} />
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
