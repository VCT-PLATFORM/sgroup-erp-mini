/**
 * AuditLogScreen — Premium system audit trail viewer
 * Uses SGPageHeader, SGSearchBar, SGChip, SGPagination, SGSection, SGSkeleton, SGEmptyState
 * SGStatusBadge, SGButton, SGInput, token colors, typography, staggered animations
 * NEW: Date range filter, detail modal, improved timeline
 */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform, Modal } from 'react-native';
import Animated, { FadeInDown, FadeIn, SlideInRight } from 'react-native-reanimated';
import {
  FileText, Clock, User, Database, RefreshCw,
  Download, Timer, Inbox, X, Calendar, Eye, Code, Globe,
} from 'lucide-react-native';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { typography, sgds, radius, spacing } from '../../../shared/theme/theme';
import { SGPageHeader } from '../../../shared/ui/components/SGPageHeader';
import { SGSearchBar } from '../../../shared/ui/components/SGSearchBar';
import { SGChip } from '../../../shared/ui/components/SGChip';
import { SGPagination } from '../../../shared/ui/components/SGPagination';
import { SGSection } from '../../../shared/ui/components/SGSection';
import { SGSkeleton } from '../../../shared/ui/components/SGSkeleton';
import { SGEmptyState } from '../../../shared/ui/components/SGEmptyState';
import { SGButton } from '../../../shared/ui/components/SGButton';
import { SGStatusBadge } from '../../../shared/ui/components/SGStatusBadge';
import { useAuditLogs } from '../hooks/useAdmin';
import { METHOD_COLORS } from '../constants/adminConstants';
import { formatRelativeDate, downloadFile } from '../utils/adminUtils';



const FILTER_METHODS = ['', 'POST', 'PATCH', 'PUT', 'DELETE'];

export function AuditLogScreen() {
  const { colors } = useAppTheme();

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [page, setPage] = useState(1);

  // Date range filter
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Detail modal
  const [detailLog, setDetailLog] = useState<any>(null);

  // Debounced search
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearch = useCallback((t: string) => {
    setSearch(t);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(t);
      setPage(1);
    }, 500);
  }, []);

  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  const { data: rawData, isLoading, refetch } = useAuditLogs({
    userName: debouncedSearch || undefined,
    method: methodFilter || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    page,
    limit: 20,
  });

  const logs = rawData?.data ?? [];
  const meta = rawData?.meta ?? { total: 0, page: 1, totalPages: 1 };

  const getMethodStyle = (method: string) =>
    METHOD_COLORS[method?.toUpperCase()] || { color: '#64748b', bg: 'rgba(100,116,139,0.12)' };

  const handleExportCSV = () => {
    if (Platform.OS !== 'web' || logs.length === 0) return;
    const headers = ['Thời gian', 'Method', 'Action', 'Resource', 'User', 'Status', 'Duration (ms)', 'IP', 'User Agent'];
    const rows = logs.map((l: any) => [
      new Date(l.createdAt).toISOString(),
      l.method || '', l.action || '', l.resource || '',
      l.userName || '', l.responseStatus || '', l.duration || '', l.ip || '',
      `"${(l.userAgent || '').replace(/"/g, '""')}"`,
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    downloadFile(csv, `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  // Quick date range presets
  const setQuickRange = (days: number) => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);
    setDateFrom(from.toISOString().slice(0, 10));
    setDateTo(to.toISOString().slice(0, 10));
    setPage(1);
  };

  const clearDateRange = () => {
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.innerPadding} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)}>
          <SGPageHeader
            icon={<FileText size={24} color={colors.accent} />}
            iconColor={colors.accent}
            title="Nhật ký hệ thống"
            subtitle={`Tổng cộng ${meta.total} bản ghi`}
            rightContent={
              <View style={styles.headerActions}>
                {Platform.OS === 'web' && logs.length > 0 && (
                  <SGButton
                    title="Export CSV"
                    icon={<Download size={16} color="#fff" />}
                    size="sm"
                    onPress={handleExportCSV}
                  />
                )}
                <SGButton
                  title="Tải lại"
                  variant="secondary"
                  icon={<RefreshCw size={16} />}
                  size="sm"
                  onPress={() => refetch()}
                />
              </View>
            }
          />
        </Animated.View>

        {/* Search */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <SGSearchBar
            value={search}
            onChangeText={handleSearch}
            placeholder="Tìm theo tên người thực hiện..."
          />
        </Animated.View>

        {/* Method filter chips */}
        <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.filterRow}>
          {FILTER_METHODS.map(m => {
            const isActive = methodFilter === m;
            const mStyle = m ? getMethodStyle(m) : { color: colors.accent, bg: colors.accent };
            return (
              <SGChip
                key={m || 'all'}
                label={m || 'Tất cả'}
                color={m ? mStyle.color : undefined}
                selected={isActive}
                onPress={() => { setMethodFilter(m); setPage(1); }}
              />
            );
          })}
        </Animated.View>

        {/* Date range filter */}
        <Animated.View entering={FadeInDown.delay(180).duration(400)} style={styles.dateFilterRow}>
          <Calendar size={16} color={colors.textSecondary} />
          <SGChip label="Hôm nay" selected={false} onPress={() => setQuickRange(0)} />
          <SGChip label="7 ngày" selected={false} onPress={() => setQuickRange(7)} />
          <SGChip label="30 ngày" selected={false} onPress={() => setQuickRange(30)} />
          <SGChip label="90 ngày" selected={false} onPress={() => setQuickRange(90)} />
          {(dateFrom || dateTo) && (
            <>
              <View style={[styles.dateTag, { backgroundColor: `${colors.accent}15`, borderColor: `${colors.accent}30` }]}>
                <Text style={[typography.caption, { color: colors.accent, fontWeight: '700' }]}>
                  {dateFrom || '...'} → {dateTo || '...'}
                </Text>
              </View>
              <Pressable
                onPress={clearDateRange}
                style={[styles.clearBtn, { backgroundColor: `${colors.danger}15` }]}
              >
                <X size={12} color={colors.danger} />
              </Pressable>
            </>
          )}
        </Animated.View>

        {/* Log List */}
        {isLoading ? (
          <View style={styles.skeletonList}>
            {Array.from({ length: 8 }).map((_, i) => (
              <View key={i} style={styles.skeletonRow}>
                <SGSkeleton width={10} height={10} variant="circle" />
                <View style={{ flex: 1, gap: 6 }}>
                  <SGSkeleton width="80%" height={14} variant="text" />
                  <SGSkeleton width="50%" height={10} variant="text" />
                </View>
              </View>
            ))}
          </View>
        ) : logs.length === 0 ? (
          <SGSection>
            <SGEmptyState
              icon={<Inbox size={48} color={colors.textTertiary} strokeWidth={1} />}
              title="Chưa có nhật ký nào"
              subtitle="Các hoạt động trên hệ thống sẽ được ghi lại tại đây"
            />
          </SGSection>
        ) : (
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <SGSection noPadding>
              {logs.map((log: any, i: number) => {
                const methodStyle = getMethodStyle(log.method);
                const isSuccess = log.responseStatus === 'SUCCESS';
                return (
                  <Animated.View
                    key={log.id}
                    entering={FadeInDown.delay(200 + i * 30).duration(250).springify()}
                  >
                    <Pressable
                      onPress={() => setDetailLog(log)}
                      accessibilityRole="button"
                      accessibilityLabel={`Xem chi tiết: ${log.action}`}
                      style={({ hovered }: any) => [
                        styles.logRow,
                        {
                          borderBottomWidth: i < logs.length - 1 ? 1 : 0,
                          borderBottomColor: colors.border,
                          backgroundColor: hovered ? `${colors.accent}06` : 'transparent',
                        },
                        Platform.OS === 'web' && ({ ...sgds.transition.fast, cursor: 'pointer' } as any),
                      ]}
                    >
                      <View style={styles.timeline}>
                        <View style={[styles.timelineDot, { backgroundColor: methodStyle.color }]} />
                        {i < logs.length - 1 && (
                          <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />
                        )}
                      </View>

                      <View style={styles.logContent}>
                        <View style={styles.logMeta}>
                          <View style={[styles.methodBadge, { backgroundColor: methodStyle.bg }]}>
                            <Text style={[typography.micro, { color: methodStyle.color }]}>{log.method}</Text>
                          </View>
                          <View style={styles.metaItem}>
                            <Database size={11} color={colors.textTertiary} />
                            <Text style={[typography.caption, { color: colors.textSecondary, fontWeight: '700' }]}>
                              {log.resource || log.action}
                            </Text>
                          </View>
                          <SGStatusBadge
                            status={isSuccess ? 'success' : 'danger'}
                            text={log.responseStatus}
                            size="sm"
                          />
                          {log.duration != null && (
                            <View style={styles.metaItem}>
                              <Timer size={10} color={colors.textTertiary} />
                              <Text style={[typography.caption, { color: colors.textTertiary }]}>{log.duration}ms</Text>
                            </View>
                          )}
                          {/* Clickable indicator */}
                          <Eye size={12} color={colors.textDisabled} />
                        </View>

                        <View style={styles.logInfo}>
                          <View style={styles.metaItem}>
                            <User size={12} color={colors.textTertiary} />
                            <Text style={[typography.smallBold, { color: colors.text }]}>{log.userName || 'System'}</Text>
                          </View>
                          <View style={styles.metaItem}>
                            <Clock size={11} color={colors.textTertiary} />
                            <Text style={[typography.caption, { color: colors.textSecondary }]}>{formatRelativeDate(log.createdAt)}</Text>
                          </View>
                          {log.ip && (
                            <Text style={[typography.caption, { color: colors.textDisabled, fontFamily: 'monospace' }]}>
                              IP: {log.ip}
                            </Text>
                          )}
                        </View>

                        {log.errorMessage && (
                          <View style={[styles.errorBox, {
                            backgroundColor: `${colors.danger}0A`,
                            borderColor: `${colors.danger}20`,
                          }]}>
                            <Text
                              style={[typography.caption, { color: colors.danger, fontFamily: 'monospace' }]}
                              numberOfLines={2}
                            >
                              {log.errorMessage}
                            </Text>
                          </View>
                        )}
                      </View>
                    </Pressable>
                  </Animated.View>
                );
              })}
            </SGSection>
          </Animated.View>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <Animated.View entering={FadeInDown.delay(300).duration(400)}>
            <SGPagination
              currentPage={page}
              totalPages={meta.totalPages}
              onPageChange={setPage}
            />
          </Animated.View>
        )}
      </ScrollView>

      {/* Detail Modal */}
      {detailLog && (
        <Modal visible transparent animationType="fade" onRequestClose={() => setDetailLog(null)}>
          <Pressable style={styles.modalOverlay} onPress={() => setDetailLog(null)}>
            <Pressable style={[styles.modalContent, { backgroundColor: colors.bgCard }]} onPress={() => {}}>
              <View style={styles.modalHeader}>
                <Text style={[typography.h4, { color: colors.text }]}>Chi tiết Audit Log</Text>
                <Pressable
                  onPress={() => setDetailLog(null)}
                  style={[styles.closeBtn, { backgroundColor: `${colors.danger}15` }]}
                >
                  <X size={18} color={colors.danger} />
                </Pressable>
              </View>

              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                <DetailRow label="Action" value={detailLog.action} icon={<FileText size={14} color={colors.accent} />} colors={colors} />
                <DetailRow label="Method" value={detailLog.method} icon={<Code size={14} color={getMethodStyle(detailLog.method).color} />} colors={colors} />
                <DetailRow label="Resource" value={detailLog.resource} icon={<Database size={14} color={colors.textSecondary} />} colors={colors} />
                <DetailRow label="Người thực hiện" value={detailLog.userName || 'System'} icon={<User size={14} color={colors.textSecondary} />} colors={colors} />
                <DetailRow label="Trạng thái" value={detailLog.responseStatus} icon={null} colors={colors}
                  valueColor={detailLog.responseStatus === 'SUCCESS' ? colors.success : colors.danger}
                />
                <DetailRow label="Duration" value={detailLog.duration != null ? `${detailLog.duration}ms` : 'N/A'} icon={<Timer size={14} color={colors.textSecondary} />} colors={colors} />
                <DetailRow label="IP" value={detailLog.ip || 'N/A'} icon={<Globe size={14} color={colors.textSecondary} />} colors={colors} />
                <DetailRow label="Thời gian" value={new Date(detailLog.createdAt).toLocaleString('vi')} icon={<Clock size={14} color={colors.textSecondary} />} colors={colors} />

                {detailLog.userAgent && (
                  <View style={styles.detailSection}>
                    <Text style={[typography.label, { color: colors.textTertiary, marginBottom: 6 }]}>USER AGENT</Text>
                    <Text style={[typography.caption, { color: colors.textSecondary, fontFamily: 'monospace', lineHeight: 18 }]}>
                      {detailLog.userAgent}
                    </Text>
                  </View>
                )}

                {detailLog.requestBody && (
                  <View style={styles.detailSection}>
                    <Text style={[typography.label, { color: colors.textTertiary, marginBottom: 6 }]}>REQUEST BODY</Text>
                    <View style={[styles.codeBlock, { backgroundColor: colors.bg, borderColor: colors.border }]}>
                      <Text style={[typography.caption, { color: colors.textSecondary, fontFamily: 'monospace', lineHeight: 18 }]}>
                        {(() => {
                          try { return JSON.stringify(JSON.parse(detailLog.requestBody), null, 2); } catch { return detailLog.requestBody; }
                        })()}
                      </Text>
                    </View>
                  </View>
                )}

                {detailLog.errorMessage && (
                  <View style={styles.detailSection}>
                    <Text style={[typography.label, { color: colors.danger, marginBottom: 6 }]}>ERROR</Text>
                    <View style={[styles.codeBlock, { backgroundColor: `${colors.danger}08`, borderColor: `${colors.danger}20` }]}>
                      <Text style={[typography.caption, { color: colors.danger, fontFamily: 'monospace', lineHeight: 18 }]}>
                        {detailLog.errorMessage}
                      </Text>
                    </View>
                  </View>
                )}
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

/** Reusable detail row for modal */
function DetailRow({ label, value, icon, colors, valueColor }: any) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailLabel}>
        {icon}
        <Text style={[typography.caption, { color: colors.textTertiary, fontWeight: '700' }]}>{label}</Text>
      </View>
      <Text style={[typography.smallBold, { color: valueColor || colors.text }]}>{value || '—'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerPadding: { padding: spacing['2xl'] - 4, gap: spacing.lg - 4, paddingBottom: 120 },
  headerActions: { flexDirection: 'row', gap: 8 },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  dateFilterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
  dateTag: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1 },
  clearBtn: { width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  skeletonList: { gap: 16 },
  skeletonRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  logRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, padding: 18 },
  timeline: { alignItems: 'center', paddingTop: 4 },
  timelineDot: { width: 10, height: 10, borderRadius: 5 },
  timelineLine: { width: 2, flex: 1, marginTop: 4 },
  logContent: { flex: 1 },
  logMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' },
  methodBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  logInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' },
  errorBox: { marginTop: 6, padding: 10, borderRadius: 10, borderWidth: 1 },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 600,
    maxHeight: '85%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 18,
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  modalBody: { paddingHorizontal: 24, paddingBottom: 24 },
  detailRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12,
  },
  detailLabel: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailSection: { paddingVertical: 12 },
  codeBlock: { padding: 12, borderRadius: 10, borderWidth: 1 },
});
