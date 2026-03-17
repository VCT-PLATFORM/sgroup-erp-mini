/**
 * AuditLogScreen — System audit trail viewer (Phase 2 Upgraded)
 * Updated fields to match new AuditLog schema: userName, resource, method, responseStatus, duration
 * Added: method filter, export CSV, relative time formatting
 */
import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Platform, ActivityIndicator } from 'react-native';
import {
  FileText, Search, Clock, User, Database, ChevronLeft, ChevronRight,
  RefreshCw, CheckCircle, XCircle, Download, Timer,
} from 'lucide-react-native';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { sgds } from '../../../shared/theme/theme';
import { useAuditLogs } from '../hooks/useAdmin';

const METHOD_COLORS: Record<string, { color: string; bg: string }> = {
  POST:   { color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  PATCH:  { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  PUT:    { color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
  DELETE: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
};

const FILTER_METHODS = ['', 'POST', 'PATCH', 'PUT', 'DELETE'];

export function AuditLogScreen() {
  const { theme, isDark } = useAppTheme();
  const cText = theme.colors.textPrimary;
  const cSub = theme.colors.textSecondary;
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : '#ffffff';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [page, setPage] = useState(1);

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const handleSearch = useCallback((t: string) => {
    setSearch(t);
    setPage(1);
    // Simple debounce via setTimeout
    const timer = setTimeout(() => setDebouncedSearch(t), 500);
    return () => clearTimeout(timer);
  }, []);

  const { data: rawData, isLoading, refetch } = useAuditLogs({
    userName: debouncedSearch || undefined,
    method: methodFilter || undefined,
    page,
    limit: 20,
  });

  const logs = rawData?.data ?? [];
  const meta = rawData?.meta ?? { total: 0, page: 1, totalPages: 1 };

  const inputStyle: any = {
    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f8fafc',
    borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 14, color: cText, flex: 1,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
  };

  const getMethodStyle = (method: string) => {
    return METHOD_COLORS[method?.toUpperCase()] || { color: '#64748b', bg: 'rgba(100,116,139,0.12)' };
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return 'Vừa xong';
    if (mins < 60) return `${mins} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return d.toLocaleDateString('vi', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const handleExportCSV = () => {
    if (Platform.OS !== 'web' || logs.length === 0) return;
    const headers = ['Thời gian', 'Method', 'Action', 'Resource', 'User', 'Status', 'Duration (ms)', 'IP'];
    const rows = logs.map((l: any) => [
      new Date(l.createdAt).toISOString(),
      l.method || '', l.action || '', l.resource || '',
      l.userName || '', l.responseStatus || '', l.duration || '', l.ip || '',
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 28, gap: 20, paddingBottom: 120 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={{ width: 52, height: 52, borderRadius: 18, backgroundColor: isDark ? 'rgba(99,102,241,0.12)' : '#eef2ff', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={24} color="#6366f1" />
            </View>
            <View>
              <Text style={{ ...sgds.typo.h2, color: cText }}>Nhật ký hệ thống</Text>
              <Text style={{ ...sgds.typo.body, color: cSub, marginTop: 2 }}>Tổng cộng {meta.total} bản ghi</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {Platform.OS === 'web' && logs.length > 0 && (
              <Pressable onPress={handleExportCSV} style={{
                flexDirection: 'row', alignItems: 'center', gap: 6,
                paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12,
                backgroundColor: '#6366f1',
              }}>
                <Download size={14} color="#fff" />
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#fff' }}>Export CSV</Text>
              </Pressable>
            )}
            <Pressable onPress={() => refetch()} style={{
              width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
              backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
            }}>
              <RefreshCw size={16} color={cSub} />
            </Pressable>
          </View>
        </View>

        {/* Search */}
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <View style={{
            flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
            backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f8fafc',
            borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
            borderRadius: 14, paddingHorizontal: 14,
          }}>
            <Search size={16} color={cSub} />
            <TextInput
              value={search}
              onChangeText={handleSearch}
              placeholder="Tìm theo tên người thực hiện..."
              placeholderTextColor={cSub}
              style={[inputStyle, { borderWidth: 0, paddingHorizontal: 0, backgroundColor: 'transparent' }]}
            />
          </View>
        </View>

        {/* Method filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
          {FILTER_METHODS.map(m => {
            const isActive = methodFilter === m;
            const style = m ? getMethodStyle(m) : { color: '#6366f1', bg: '#6366f1' };
            return (
              <Pressable
                key={m || 'all'}
                onPress={() => { setMethodFilter(m); setPage(1); }}
                style={{
                  paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12,
                  backgroundColor: isActive ? (m ? style.bg : '#6366f1') : (isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'),
                  borderWidth: isActive && m ? 1 : 0, borderColor: style.color,
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: '700', color: isActive ? (m ? style.color : '#fff') : cSub }}>
                  {m || 'Tất cả'}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Log List */}
        {isLoading ? (
          <View style={{ padding: 60, alignItems: 'center' }}><ActivityIndicator size="large" color="#6366f1" /></View>
        ) : logs.length === 0 ? (
          <View style={{ padding: 60, alignItems: 'center', borderRadius: 20, backgroundColor: cardBg, borderWidth: 1, borderColor }}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>📋</Text>
            <Text style={{ fontSize: 14, fontWeight: '700', color: cSub }}>Chưa có nhật ký nào</Text>
            <Text style={{ fontSize: 12, fontWeight: '600', color: `${cSub}80`, marginTop: 4 }}>
              Các hoạt động trên hệ thống sẽ được ghi lại tại đây
            </Text>
          </View>
        ) : (
          <View style={{ borderRadius: 20, backgroundColor: cardBg, borderWidth: 1, borderColor, overflow: 'hidden' }}>
            {logs.map((log: any, i: number) => {
              const methodStyle = getMethodStyle(log.method);
              const isSuccess = log.responseStatus === 'SUCCESS';
              return (
                <View key={log.id} style={{
                  padding: 18, borderBottomWidth: i < logs.length - 1 ? 1 : 0, borderBottomColor: borderColor,
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
                    {/* Timeline dot */}
                    <View style={{ alignItems: 'center', paddingTop: 4 }}>
                      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: methodStyle.color }} />
                      {i < logs.length - 1 && (
                        <View style={{ width: 2, height: 40, backgroundColor: borderColor, marginTop: 4 }} />
                      )}
                    </View>

                    {/* Content */}
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                        {/* Method badge */}
                        <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: methodStyle.bg }}>
                          <Text style={{ fontSize: 10, fontWeight: '800', color: methodStyle.color }}>{log.method}</Text>
                        </View>
                        {/* Resource */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <Database size={11} color={cSub} />
                          <Text style={{ fontSize: 11, fontWeight: '700', color: cSub }}>{log.resource || log.action}</Text>
                        </View>
                        {/* Status */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                          {isSuccess ? <CheckCircle size={11} color="#10b981" /> : <XCircle size={11} color="#ef4444" />}
                          <Text style={{ fontSize: 10, fontWeight: '700', color: isSuccess ? '#10b981' : '#ef4444' }}>
                            {log.responseStatus}
                          </Text>
                        </View>
                        {/* Duration */}
                        {log.duration != null && (
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                            <Timer size={10} color={cSub} />
                            <Text style={{ fontSize: 10, fontWeight: '600', color: cSub }}>{log.duration}ms</Text>
                          </View>
                        )}
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <User size={12} color={cSub} />
                          <Text style={{ fontSize: 12, fontWeight: '700', color: cText }}>{log.userName || 'System'}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <Clock size={11} color={cSub} />
                          <Text style={{ fontSize: 11, fontWeight: '600', color: cSub }}>{formatDate(log.createdAt)}</Text>
                        </View>
                        {log.ip && (
                          <Text style={{ fontSize: 10, fontWeight: '600', color: `${cSub}80`, fontFamily: 'monospace' }}>IP: {log.ip}</Text>
                        )}
                      </View>

                      {/* Error message */}
                      {log.errorMessage && (
                        <View style={{
                          marginTop: 6, padding: 10, borderRadius: 10,
                          backgroundColor: 'rgba(239,68,68,0.08)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.15)',
                        }}>
                          <Text style={{ fontSize: 11, fontWeight: '600', color: '#ef4444', fontFamily: 'monospace' }} numberOfLines={2}>
                            {log.errorMessage}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 8 }}>
            <Pressable
              onPress={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              style={{
                width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
                backgroundColor: page <= 1 ? (isDark ? 'rgba(255,255,255,0.03)' : '#f1f5f9') : '#6366f1',
              }}
            >
              <ChevronLeft size={16} color={page <= 1 ? cSub : '#fff'} />
            </Pressable>
            <Text style={{ fontSize: 13, fontWeight: '700', color: cText }}>
              Trang {meta.page} / {meta.totalPages}
            </Text>
            <Pressable
              onPress={() => setPage(p => Math.min(meta.totalPages, p + 1))}
              disabled={page >= meta.totalPages}
              style={{
                width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
                backgroundColor: page >= meta.totalPages ? (isDark ? 'rgba(255,255,255,0.03)' : '#f1f5f9') : '#6366f1',
              }}
            >
              <ChevronRight size={16} color={page >= meta.totalPages ? cSub : '#fff'} />
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
