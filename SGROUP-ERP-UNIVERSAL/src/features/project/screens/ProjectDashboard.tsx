import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, useWindowDimensions } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { typography, sgds } from '../../../shared/theme/theme';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { useProjects } from '../hooks/useProjects';
import { Building2, CheckCircle2, TrendingUp, BarChart3, Percent, Layers, PieChart } from 'lucide-react-native';
import { SGCard, SGAuroraBackground, SGSkeletonLoader, SGEmptyState } from '../../../shared/ui/components';
import { formatTy } from '../../../shared/utils/formatters';

export function ProjectDashboard() {
  const { colors, theme, isDark } = useAppTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width > 1024;
  const isTablet = width > 768 && width <= 1024;
  const { data: projects, isLoading, isError } = useProjects();

  const stats = useMemo(() => {
    if (!projects || !Array.isArray(projects)) {
      return { total: 0, ongoing: 0, paused: 0, closed: 0, totalUnits: 0, soldUnits: 0, value: 0, liquidity: 0 };
    }
    
    let ongoing = 0, paused = 0, closed = 0;
    let totalUnits = 0;
    let soldUnits = 0;
    let value = 0;
    
    projects.forEach((p: any) => {
      if (p.status === 'ACTIVE') ongoing++;
      else if (p.status === 'PAUSED') paused++;
      else closed++;
      totalUnits += (p.totalUnits || 0);
      soldUnits += (p.soldUnits || 0);
      value += (p.avgPrice || 0) * (p.totalUnits || 0);
    });

    const liquidity = totalUnits > 0 ? Math.round((soldUnits / totalUnits) * 100) : 0;
    return { total: projects.length, ongoing, paused, closed, totalUnits, soldUnits, value, liquidity };
  }, [projects]);

  // Top projects by liquidity
  const topProjects = useMemo(() => {
    if (!projects || !Array.isArray(projects)) return [];
    return [...projects]
      .filter((p: any) => p.totalUnits > 0)
      .map((p: any) => ({
        ...p,
        liquidity: Math.round(((p.soldUnits || 0) / p.totalUnits) * 100),
        pipelineValue: (p.avgPrice || 0) * (p.totalUnits || 0),
      }))
      .sort((a: any, b: any) => b.liquidity - a.liquidity)
      .slice(0, 5);
  }, [projects]);

  // Status distribution for bar chart
  const statusDist = useMemo(() => {
    const dist = { ACTIVE: 0, PAUSED: 0, CLOSED: 0 };
    if (!projects || !Array.isArray(projects)) return dist;
    projects.forEach((p: any) => {
      if (p.status === 'ACTIVE') dist.ACTIVE++;
      else if (p.status === 'PAUSED') dist.PAUSED++;
      else dist.CLOSED++;
    });
    return dist;
  }, [projects]);

  // Skeleton Loading State
  if (isLoading) {
    return (
      <View style={[styles.container, { padding: isDesktop ? 40 : 20 }]}>
        {Platform.OS === 'web' && (
          <View style={[StyleSheet.absoluteFill, { zIndex: 0, overflow: 'hidden' }]} pointerEvents="none">
            <SGAuroraBackground />
          </View>
        )}
        <View style={[styles.header, { zIndex: 1 }]}>
          <Text style={[typography.h1, { color: colors.text, marginBottom: 8, fontWeight: '800', letterSpacing: -0.5 }]}>Tổng quan Dự án</Text>
          <Text style={[typography.body, { color: colors.textSecondary, fontSize: 16 }]}>
            Báo cáo nhanh các chỉ số về danh mục dự án & bảng hàng
          </Text>
        </View>
        <View style={{ zIndex: 1, gap: 24 }}>
          <SGSkeletonLoader type="stat" count={4} isDark={isDark} />
          <View style={{ flexDirection: isDesktop ? 'row' : 'column', gap: 24 }}>
            <View style={{ flex: 1 }}><SGSkeletonLoader type="card" count={3} isDark={isDark} /></View>
            <View style={{ flex: 1.5 }}><SGSkeletonLoader type="table" rows={5} columns={4} isDark={isDark} /></View>
          </View>
        </View>
      </View>
    );
  }

  // Empty State when no projects
  if (!isLoading && (!projects || !Array.isArray(projects) || projects.length === 0)) {
    return (
      <View style={[styles.container, { padding: isDesktop ? 40 : 20 }]}>
        {Platform.OS === 'web' && (
          <View style={[StyleSheet.absoluteFill, { zIndex: 0, overflow: 'hidden' }]} pointerEvents="none">
            <SGAuroraBackground />
          </View>
        )}
        <View style={[styles.header, { zIndex: 1 }]}>
          <Text style={[typography.h1, { color: colors.text, marginBottom: 8, fontWeight: '800', letterSpacing: -0.5 }]}>Tổng quan Dự án</Text>
          <Text style={[typography.body, { color: colors.textSecondary, fontSize: 16 }]}>
            Báo cáo nhanh các chỉ số về danh mục dự án & bảng hàng
          </Text>
        </View>
        <SGEmptyState
          icon={<Building2 size={48} color={colors.textTertiary} strokeWidth={1} />}
          title="Chưa có dự án nào"
          subtitle="Thêm dự án đầu tiên để bắt đầu theo dõi các chỉ số KPI"
          style={{ minHeight: 400, zIndex: 1 }}
        />
      </View>
    );
  }

  const maxStatusCount = Math.max(statusDist.ACTIVE, statusDist.PAUSED, statusDist.CLOSED, 1);

  return (
    <ScrollView style={[styles.container, { padding: isDesktop ? 40 : 20 }]}>
        {/* Dynamic Glowing Aurora */}
        {Platform.OS === 'web' && (
          <View style={[StyleSheet.absoluteFill, { zIndex: 0, overflow: 'hidden' }]} pointerEvents="none">
            <SGAuroraBackground />
          </View>
        )}
  
        <View style={[styles.header, { zIndex: 1 }]}>
          <Text style={[typography.h1, { color: colors.text, marginBottom: 8, fontWeight: '800', letterSpacing: -0.5 }]}>Tổng quan Dự án</Text>
          <Text style={[typography.body, { color: colors.textSecondary, fontSize: 16 }]}>
            Báo cáo nhanh các chỉ số về danh mục dự án & bảng hàng
          </Text>
        </View>
  
        {/* KPI Grid - Row 1 */}
        <View style={[styles.kpiGrid, { zIndex: 1 }]}>
          <Animated.View entering={FadeInDown.delay(100).springify().damping(20)} style={[styles.kpiCardWrapper, { minWidth: isDesktop ? 240 : (isTablet ? '45%' : '100%') }]}>
            <SGCard style={[styles.kpiCard, sgds.sectionBase(theme) as any] as any}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View>
                  <Text style={[typography.micro, { color: colors.textSecondary, marginBottom: 8, fontWeight: '700', letterSpacing: 0.5 }]}>TỔNG DỰ ÁN</Text>
                  <Text style={[typography.h1, { color: colors.text, fontWeight: '800' }]}>{stats.total}</Text>
                </View>
                <View style={[styles.iconBox, { backgroundColor: isDark ? 'rgba(16,185,129,0.15)' : '#d1fae5' }]}>
                  <Building2 size={24} color={colors.success} strokeWidth={2.5} />
                </View>
              </View>
              <View style={{ marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border }}>
                <Text style={[typography.micro, { color: colors.textTertiary }]}>
                  <Text style={{ color: colors.success, fontWeight: '800' }}>{stats.ongoing}</Text> đang bán •{' '}
                  <Text style={{ color: colors.warning, fontWeight: '800' }}>{stats.paused}</Text> tạm dừng
                </Text>
              </View>
            </SGCard>
          </Animated.View>
  
          <Animated.View entering={FadeInDown.delay(200).springify().damping(20)} style={[styles.kpiCardWrapper, { minWidth: isDesktop ? 240 : (isTablet ? '45%' : '100%') }]}>
            <SGCard style={[styles.kpiCard, sgds.sectionBase(theme) as any] as any}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View>
                  <Text style={[typography.micro, { color: colors.textSecondary, marginBottom: 8, fontWeight: '700', letterSpacing: 0.5 }]}>TỔNG SẢN PHẨM</Text>
                  <Text style={[typography.h1, { color: colors.text, fontWeight: '800' }]}>{new Intl.NumberFormat('vi-VN').format(stats.totalUnits)}</Text>
                </View>
                <View style={[styles.iconBox, { backgroundColor: isDark ? 'rgba(59,130,246,0.15)' : '#dbeafe' }]}>
                  <Layers size={24} color={colors.brand} strokeWidth={2.5} />
                </View>
              </View>
              <View style={{ marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border }}>
                <Text style={[typography.micro, { color: colors.textTertiary, fontWeight: '500' }]}>Kho hàng toàn hệ thống</Text>
              </View>
            </SGCard>
          </Animated.View>
  
          <Animated.View entering={FadeInDown.delay(300).springify().damping(20)} style={[styles.kpiCardWrapper, { minWidth: isDesktop ? 240 : (isTablet ? '45%' : '100%') }]}>
            <SGCard style={[styles.kpiCard, sgds.sectionBase(theme) as any] as any}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View>
                  <Text style={[typography.micro, { color: colors.textSecondary, marginBottom: 8, fontWeight: '700', letterSpacing: 0.5 }]}>ĐÃ BÁN</Text>
                  <Text style={[typography.h1, { color: colors.text, fontWeight: '800' }]}>{new Intl.NumberFormat('vi-VN').format(stats.soldUnits)}</Text>
                </View>
                <View style={[styles.iconBox, { backgroundColor: isDark ? 'rgba(139,92,246,0.15)' : '#ede9fe' }]}>
                  <CheckCircle2 size={24} color={colors.purple} strokeWidth={2.5} />
                </View>
              </View>
              <View style={{ marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[typography.micro, { color: colors.textTertiary, fontWeight: '500' }]}>Thanh khoản: </Text>
                <Text style={[typography.micro, { color: colors.purple, fontWeight: '800' }]}>{stats.liquidity}%</Text>
              </View>
            </SGCard>
          </Animated.View>
  
          <Animated.View entering={FadeInDown.delay(400).springify().damping(20)} style={[styles.kpiCardWrapper, { minWidth: isDesktop ? 240 : (isTablet ? '45%' : '100%') }]}>
            <SGCard style={[styles.kpiCard, sgds.sectionBase(theme) as any] as any}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Text style={[typography.micro, { color: colors.textSecondary, marginBottom: 8, fontWeight: '700', letterSpacing: 0.5 }]}>GIÁ TRỊ TẠM TÍNH</Text>
                  <Text style={[typography.h1, { color: colors.text, fontWeight: '800', flexShrink: 1 }]} numberOfLines={1}>{formatTy(stats.value)}</Text>
                </View>
                <View style={[styles.iconBox, { backgroundColor: isDark ? 'rgba(245,158,11,0.15)' : '#fef3c7', marginLeft: 8 }]}>
                  <TrendingUp size={24} color={colors.warning} strokeWidth={2.5} />
                </View>
              </View>
              <View style={{ marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border }}>
                <Text style={[typography.micro, { color: colors.textTertiary, fontWeight: '500' }]}>Dựa trên giá Trung bình & Tổng SP</Text>
              </View>
            </SGCard>
          </Animated.View>
        </View>

      {/* Row 2: Charts & Table */}
      <View style={{ flexDirection: isDesktop ? 'row' : 'column', gap: 24, marginTop: 32, zIndex: 1 }}>
        {/* Bar Chart: Status Distribution */}
        <Animated.View entering={FadeInDown.delay(500).springify().damping(20)} style={{ flex: 1 }}>
          <SGCard style={[{ padding: 32, flex: 1 }, sgds.sectionBase(theme)] as any}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 32 }}>
              <View style={[styles.iconBox, { backgroundColor: isDark ? 'rgba(236,72,153,0.15)' : '#fdf2f8', width: 44, height: 44 }]}>
                <PieChart size={22} color={colors.accent} strokeWidth={2.5} />
              </View>
              <Text style={[typography.h3, { color: colors.text, marginLeft: 16, fontWeight: '800' }]}>Trạng thái Mở bán</Text>
            </View>

            <View style={{ gap: 24 }}>
              {[
                { label: 'Đang mở bán', count: statusDist.ACTIVE, color: colors.success },
                { label: 'Tạm dừng', count: statusDist.PAUSED, color: colors.warning },
                { label: 'Đã đóng', count: statusDist.CLOSED, color: colors.textTertiary },
              ].map((item) => (
                <View key={item.label}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <Text style={[typography.body, { color: colors.text, fontWeight: '600', fontSize: 16 }]}>{item.label}</Text>
                    <Text style={[typography.body, { color: item.color, fontWeight: '800', fontSize: 16 }]}>{item.count} <Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: '500' }}>dự án</Text></Text>
                  </View>
                  <View style={{ height: 16, backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)', borderRadius: 8, overflow: 'hidden' }}>
                    <View style={{
                      width: `${Math.round((item.count / maxStatusCount) * 100)}%`,
                      height: '100%',
                      backgroundColor: item.color,
                      borderRadius: 8,
                      minWidth: item.count > 0 ? 8 : 0,
                      ...(Platform.OS === 'web' && { transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' } as any),
                    } as any} />
                  </View>
                </View>
              ))}
            </View>

            {/* Overall Liquidity Meter */}
            <View style={{ marginTop: 40, paddingTop: 32, borderTopWidth: 1, borderTopColor: colors.border }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <View style={[styles.iconBox, { backgroundColor: isDark ? 'rgba(139,92,246,0.15)' : '#ede9fe', width: 32, height: 32, borderRadius: 8 }]}>
                  <Percent size={14} color={colors.purple} strokeWidth={2.5} />
                </View>
                <Text style={[typography.h4, { color: colors.text, fontWeight: '700', marginLeft: 12 }]}>Tốc độ Thanh khoản</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                <View style={{ flex: 1, height: 24, backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)', borderRadius: 12, overflow: 'hidden' }}>
                  <View style={{
                    width: `${Math.min(stats.liquidity, 100)}%`,
                    height: '100%',
                    borderRadius: 12,
                    backgroundColor: stats.liquidity >= 70 ? colors.success : stats.liquidity >= 40 ? colors.warning : colors.danger,
                    ...(Platform.OS === 'web' && { transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' } as any),
                  } as any} />
                </View>
                <Text style={[typography.h2, { 
                  color: stats.liquidity >= 70 ? colors.success : stats.liquidity >= 40 ? colors.warning : colors.danger,
                  minWidth: 56, textAlign: 'right', fontWeight: '900'
                }]}>{stats.liquidity}%</Text>
              </View>
            </View>
          </SGCard>
        </Animated.View>

        {/* Top Projects Table */}
        <Animated.View entering={FadeInDown.delay(600).springify().damping(20)} style={{ flex: 1.5 }}>
          <SGCard style={[{ padding: 32, flex: 1 }, sgds.sectionBase(theme)] as any}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 32 }}>
              <View style={[styles.iconBox, { backgroundColor: isDark ? 'rgba(16,185,129,0.15)' : '#d1fae5', width: 44, height: 44 }]}>
                <BarChart3 size={22} color={colors.success} strokeWidth={2.5} />
              </View>
              <Text style={[typography.h3, { color: colors.text, marginLeft: 16, fontWeight: '800' }]}>Top Dự án Toàn quốc</Text>
            </View>
            
            {topProjects.length === 0 ? (
              <SGEmptyState
                icon={<BarChart3 size={48} color={colors.textTertiary} strokeWidth={1} />}
                title="Chưa có dữ liệu"
                subtitle="Các dự án sẽ hiển thị khi có sản phẩm được import"
                style={{ minHeight: 200 }}
              />
            ) : (
              <>
                {/* Table Header */}
                <View style={[styles.tableRow, { 
                  borderBottomColor: colors.border, 
                  borderBottomWidth: 1, paddingBottom: 16, marginBottom: 8 
                }]}>
                  <Text style={[typography.micro, { color: colors.textSecondary, width: 40, fontWeight: '700' }]}>HẠNG</Text>
                  <Text style={[typography.micro, { color: colors.textSecondary, flex: 1, fontWeight: '700' }]}>TÊN DỰ ÁN & MÃ</Text>
                  <Text style={[typography.micro, { color: colors.textSecondary, width: 100, textAlign: 'center', fontWeight: '700' }]}>ĐÃ BÁN</Text>
                  {isDesktop && <Text style={[typography.micro, { color: colors.textSecondary, width: 120, textAlign: 'center', fontWeight: '700' }]}>THANH KHOẢN</Text>}
                  <Text style={[typography.micro, { color: colors.textSecondary, width: 120, textAlign: 'right', fontWeight: '700' }]}>ĐỊNH GIÁ</Text>
                </View>

                {topProjects.map((p: any, idx: number) => (
                  <View key={p.id} style={[styles.tableRow, {
                    paddingVertical: 18,
                    borderBottomColor: idx < topProjects.length - 1 ? colors.border : 'transparent',
                    borderBottomWidth: idx < topProjects.length - 1 ? 1 : 0,
                  }]}>
                    <View style={{ width: 40 }}>
                      <View style={{
                        width: 28, height: 28, borderRadius: 8,
                        backgroundColor: idx === 0 ? '#f59e0b' : idx === 1 ? '#94A3B8' : idx === 2 ? '#cd7f32' : (isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'),
                        justifyContent: 'center', alignItems: 'center',
                      }}>
                        <Text style={{ color: idx < 3 ? '#fff' : colors.textSecondary, fontSize: 13, fontWeight: '800' }}>{idx + 1}</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1, paddingRight: 16 }}>
                      <Text style={[typography.body, { color: colors.text, fontWeight: '800', fontSize: 16 }]} numberOfLines={1}>{p.name}</Text>
                      <Text style={[typography.micro, { color: colors.textTertiary, marginTop: 4 }]} numberOfLines={1}>{p.projectCode} • {p.developer || 'N/A'}</Text>
                    </View>
                    <Text style={[typography.body, { color: colors.success, width: 100, textAlign: 'center', fontWeight: '800', fontSize: 16 }]}>
                      {p.soldUnits}<Text style={{ color: colors.textSecondary, fontSize: 14, fontWeight: '600' }}>/{p.totalUnits}</Text>
                    </Text>
                    
                    {isDesktop && (
                      <View style={{ width: 120, alignItems: 'center' }}>
                        <View style={{
                          paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8,
                          backgroundColor: p.liquidity >= 70 ? (isDark ? 'rgba(16,185,129,0.15)' : '#ecfdf5') 
                            : p.liquidity >= 40 ? (isDark ? 'rgba(245,158,11,0.15)' : '#fffbeb')
                            : (isDark ? 'rgba(239,68,68,0.15)' : '#fef2f2'),
                          borderWidth: 1,
                          borderColor: p.liquidity >= 70 ? (isDark ? 'rgba(16,185,129,0.3)' : '#a7f3d0') 
                          : p.liquidity >= 40 ? (isDark ? 'rgba(245,158,11,0.3)' : '#fde68a')
                          : (isDark ? 'rgba(239,68,68,0.3)' : '#fecaca'),
                        }}>
                          <Text style={[typography.body, {
                            color: p.liquidity >= 70 ? colors.success : p.liquidity >= 40 ? colors.warning : colors.danger,
                            fontWeight: '800',
                          }]}>{p.liquidity}%</Text>
                        </View>
                      </View>
                    )}
                    
                    <Text style={[typography.body, { color: colors.text, width: 120, textAlign: 'right', fontWeight: '800', fontSize: 15 }]} numberOfLines={1}>
                      {formatTy(p.pipelineValue)}
                    </Text>
                  </View>
                ))}
              </>
            )}
          </SGCard>
        </Animated.View>
      </View>

      {/* Row 3: Per-project Liquidity Comparison */}
      {topProjects.length > 0 && (
        <Animated.View entering={FadeInDown.delay(700).springify().damping(20)}>
          <SGCard style={[{ padding: 32, marginTop: 32, marginBottom: 40, zIndex: 1 }, sgds.sectionBase(theme)] as any}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 32 }}>
              <View style={[styles.iconBox, { backgroundColor: isDark ? 'rgba(139,92,246,0.15)' : '#ede9fe', width: 44, height: 44 }]}>
                <TrendingUp size={22} color={colors.purple} strokeWidth={2.5} />
              </View>
              <Text style={[typography.h3, { color: colors.text, marginLeft: 16, fontWeight: '800' }]}>Phân tích Độ phủ Bảng hàng</Text>
            </View>
  
            <View style={{ gap: 24, flexDirection: isDesktop ? 'row' : 'column', flexWrap: 'wrap' }}>
              {topProjects.map((p: any) => {
                const pct = p.liquidity;
                return (
                  <View key={p.id} style={{ flex: isDesktop ? 1 : undefined, minWidth: isDesktop ? 300 : '100%' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                      <Text style={[typography.body, { color: colors.text, fontWeight: '700', flex: 1, fontSize: 16 }]} numberOfLines={1}>{p.name}</Text>
                      <Text style={[typography.body, { color: colors.textSecondary, marginLeft: 12, fontWeight: '600' }]}>
                        {p.soldUnits || 0} / {p.totalUnits} •{' '}
                        <Text style={{ color: pct >= 70 ? colors.success : pct >= 40 ? colors.warning : colors.danger, fontWeight: '800' }}>{pct}%</Text>
                      </Text>
                    </View>
                    <View style={{ height: 12, backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)', borderRadius: 6, overflow: 'hidden', flexDirection: 'row' }}>
                      {/* Sold portion */}
                      <View style={{
                        width: `${Math.min(pct, 100)}%`,
                        height: '100%',
                        backgroundColor: pct >= 70 ? colors.success : pct >= 40 ? colors.warning : colors.danger,
                        borderRadius: 6,
                        minWidth: (p.soldUnits || 0) > 0 ? 8 : 0,
                        ...(Platform.OS === 'web' && { transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' } as any),
                      } as any} />
                    </View>
                  </View>
                );
              })}
            </View>
          </SGCard>
        </Animated.View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 40,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  kpiCardWrapper: {
    flex: 1,
  },
  kpiCard: {
    padding: 24,
    borderRadius: 24,
    flex: 1,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
