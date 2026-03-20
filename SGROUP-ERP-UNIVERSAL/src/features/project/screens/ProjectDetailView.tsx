import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import Animated, { FadeInDown, FadeInLeft, FadeInRight } from 'react-native-reanimated';
import { typography, sgds } from '../../../shared/theme/theme';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { SGCard, SGButton, SGAuroraBackground, SGSkeletonLoader, SGEmptyState, SGCircularProgress } from '../../../shared/ui/components';
import { useProject, useProjectProducts } from '../hooks/useProjects';
import { ArrowLeft, MapPin, Grid3x3, CheckCircle2, Edit2, DollarSign, Percent, Layers, Package } from 'lucide-react-native';
import { formatTy } from '../../../shared/utils/formatters';
import { ProjectFormModal } from '../components/ProjectFormModal';

interface Props {
  projectId: string;
  onBack: () => void;
  onNavigateInventory?: (projectId: string) => void;
}

export function ProjectDetailView({ projectId, onBack, onNavigateInventory }: Props) {
  const { colors, theme, isDark } = useAppTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width > 1024;
  const [showEditForm, setShowEditForm] = useState(false);
  
  const { data: project, isLoading: isProjectLoading, isError: isProjectError } = useProject(projectId);
  const { data: products, isLoading: isProductsLoading } = useProjectProducts(projectId);

  const safeProducts = useMemo(() => Array.isArray(products) ? products : [], [products]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return colors.success;
      case 'LOCKED': return colors.warning;
      case 'BOOKED': return '#f97316';
      case 'PENDING_DEPOSIT': return colors.brand;
      case 'DEPOSIT': return colors.purple;
      case 'SOLD': return colors.danger;
      case 'COMPLETED': return colors.textTertiary;
      default: return colors.textSecondary;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'CÒN TRỐNG';
      case 'LOCKED': return 'ĐANG LOCK';
      case 'BOOKED': return 'ĐÃ ĐẶT';
      case 'PENDING_DEPOSIT': return 'CHỜ CỌC';
      case 'DEPOSIT': return 'ĐÃ CỌC';
      case 'SOLD': return 'ĐÃ BÁN';
      case 'COMPLETED': return 'HOÀN TẤT';
      default: return status;
    }
  };

  // Skeleton Loading
  if (isProjectLoading) {
    return (
      <View style={[styles.container, { padding: isDesktop ? 40 : 20 }]}>
        {Platform.OS === 'web' && (
          <View style={[StyleSheet.absoluteFill, { zIndex: 0, overflow: 'hidden' }]} pointerEvents="none">
            <SGAuroraBackground />
          </View>
        )}
        <View style={{ zIndex: 1, gap: 24 }}>
          <SGSkeletonLoader type="stat" count={4} isDark={isDark} />
          <View style={{ flexDirection: isDesktop ? 'row' : 'column', gap: 24 }}>
            <View style={{ flex: 1 }}><SGSkeletonLoader type="card" count={3} isDark={isDark} /></View>
            <View style={{ flex: 1.6 }}><SGSkeletonLoader type="table" rows={6} columns={5} isDark={isDark} /></View>
          </View>
        </View>
      </View>
    );
  }

  if (isProjectError || !project) {
    return (
      <View style={[styles.centerContainer, { minHeight: 400 }]}>
        <SGEmptyState
          emoji="❌"
          title="Lỗi khi tải dự án"
          subtitle="Không thể tải thông tin chi tiết dự án. Vui lòng thử lại."
          actionLabel="Quay lại"
          onAction={onBack}
        />
      </View>
    );
  }

  const liquidityPct = project.totalUnits ? Math.round(((project.soldUnits || 0) / project.totalUnits) * 100) : 0;
  const totalValue = (project.avgPrice || 0) * (project.totalUnits || 0);

  // Status distribution from products
  const statusCounts = safeProducts.reduce((acc: Record<string, number>, p: any) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const liquidityColor = liquidityPct >= 70 ? colors.success : liquidityPct >= 40 ? colors.warning : colors.danger;

  const kpiCards = [
    { label: 'Tổng Sản phẩm', value: project.totalUnits || 0, icon: Layers, color: colors.brand, bg: isDark ? 'rgba(59,130,246,0.1)' : '#eff6ff' },
    { label: 'Đã Bán', value: project.soldUnits || 0, icon: CheckCircle2, color: colors.success, bg: isDark ? 'rgba(16,185,129,0.1)' : '#ecfdf5' },
    { label: 'Giá TB', value: project.avgPrice ? formatTy(project.avgPrice) : 'N/A', icon: DollarSign, color: colors.purple, bg: isDark ? 'rgba(139,92,246,0.1)' : '#f5f3ff' },
    { label: 'Hoa hồng', value: `${project.feeRate || 0}%`, icon: Percent, color: colors.warning, bg: isDark ? 'rgba(245,158,11,0.1)' : '#fffbeb' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      <ProjectFormModal visible={showEditForm} onClose={() => setShowEditForm(false)} editData={project as any} />

      {/* Aurora Backdrop */}
      {Platform.OS === 'web' && (
        <View style={[StyleSheet.absoluteFill, { zIndex: 0, overflow: 'hidden' }]} pointerEvents="none">
          <SGAuroraBackground />
        </View>
      )}

      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100).springify().damping(20)} style={[styles.header, { paddingHorizontal: isDesktop ? 40 : 20, zIndex: 1 }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <View style={[styles.backIcon, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9' }]}>
            <ArrowLeft size={18} color={colors.textSecondary} />
          </View>
          <Text style={[typography.body, { color: colors.textSecondary, marginLeft: 10, fontWeight: '600' }]}>Danh sách Dự án</Text>
        </TouchableOpacity>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 24 }}>
          <View style={{ flex: 1 }}>
            {/* Status color bar */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <View style={[
                styles.statusBadge, 
                { backgroundColor: project.status === 'ACTIVE' ? (isDark ? 'rgba(16,185,129,0.15)' : '#ecfdf5') 
                  : project.status === 'PAUSED' ? (isDark ? 'rgba(245,158,11,0.15)' : '#fffbeb')
                  : (isDark ? 'rgba(100,116,139,0.15)' : '#f8fafc'),
                  borderWidth: 1,
                  borderColor: project.status === 'ACTIVE' ? (isDark ? 'rgba(16,185,129,0.3)' : '#a7f3d0') 
                  : project.status === 'PAUSED' ? (isDark ? 'rgba(245,158,11,0.3)' : '#fde68a')
                  : (isDark ? 'rgba(100,116,139,0.3)' : '#e2e8f0')
                }
              ]}>
                <Text style={[typography.micro, { 
                  color: project.status === 'ACTIVE' ? colors.success : project.status === 'PAUSED' ? colors.warning : colors.textSecondary, 
                  fontWeight: '800', fontSize: 10
                }]}>
                  {project.status === 'ACTIVE' ? 'ĐANG MỞ BÁN' : project.status === 'PAUSED' ? 'TẠM DỪNG' : 'ĐÃ ĐÓNG'}
                </Text>
              </View>
              <Text style={[typography.micro, { color: colors.textTertiary, fontWeight: '600' }]}>Mã: {project.projectCode}</Text>
            </View>

            <Text style={[typography.h1, { color: colors.text, fontWeight: '800', letterSpacing: -0.5, marginBottom: 6 }]}>{project.name}</Text>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <MapPin size={14} color={colors.textTertiary} />
              <Text style={[typography.body, { color: colors.textSecondary, fontSize: 14 }]}>{project.location || 'Chưa cập nhật vị trí'}</Text>
            </View>
          </View>
          <SGButton 
            title="Chỉnh sửa" 
            variant="outline"
            icon={<Edit2 size={16} color={colors.text} />}
            onPress={() => setShowEditForm(true)}
            style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#cbd5e1' }}
          />
        </View>
      </Animated.View>

      {/* KPI Cards Row */}
      <Animated.View entering={FadeInDown.delay(200).springify().damping(20)} style={[styles.kpiRow, { paddingHorizontal: isDesktop ? 40 : 20, zIndex: 1 }]}>
        {kpiCards.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <SGCard key={i} style={[
              styles.kpiCard, 
              sgds.sectionBase(theme),
              { padding: 20 }
            ] as any}>
              <View style={[styles.kpiIconBox, { backgroundColor: kpi.bg }]}>
                <Icon size={20} color={kpi.color} />
              </View>
              <Text style={[typography.micro, { color: colors.textSecondary, fontWeight: '600', marginTop: 12 }]}>{kpi.label}</Text>
              <Text style={[typography.h3, { color: colors.text, fontWeight: '800', marginTop: 4 }]}>{kpi.value}</Text>
            </SGCard>
          );
        })}
      </Animated.View>

      <View style={[styles.mainContent, { flexDirection: isDesktop ? 'row' : 'column', paddingHorizontal: isDesktop ? 40 : 20, zIndex: 1 }]}>
        {/* Left Column: Info & Stats */}
        <Animated.View entering={FadeInLeft.delay(300).springify().damping(20)} style={{ flex: isDesktop ? 1 : undefined, maxWidth: isDesktop ? 400 : undefined }}>
          {/* General Info Card */}
          <SGCard style={[styles.sectionCard, sgds.sectionBase(theme), { padding: 28 }] as any}>
            <Text style={[typography.h4, { color: colors.text, marginBottom: 24, fontWeight: '800' }]}>Thông tin chung</Text>
            
            {[
              { label: 'Chủ đầu tư', value: project.developer || 'Đang cập nhật' },
              { label: 'Vị trí', value: project.location || 'Đang cập nhật' },
              { label: 'Loại hình', value: project.type || 'Đang cập nhật' },
              { label: 'Quy mô', value: `${project.totalUnits || 0} sản phẩm` },
            ].map((item, idx, arr) => (
              <View key={idx}>
                <View style={styles.infoRow}>
                  <Text style={[typography.micro, { color: colors.textTertiary, width: 100, fontWeight: '600' }]}>{item.label}</Text>
                  <Text style={[typography.body, { color: colors.text, flex: 1, fontWeight: '700' }]}>{item.value}</Text>
                </View>
                {idx < arr.length - 1 && <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }]} />}
              </View>
            ))}
          </SGCard>

          {/* Progress & Performance */}
          <SGCard style={[styles.sectionCard, sgds.sectionBase(theme), { padding: 28, marginTop: 24 }] as any}>
            <Text style={[typography.h4, { color: colors.text, marginBottom: 24, fontWeight: '800' }]}>Tiến độ & Hiệu quả</Text>
            
            {/* Liquidity Meter - using SGCircularProgress */}
            <View style={{ alignItems: 'center', marginBottom: 28 }}>
              <SGCircularProgress
                progress={liquidityPct}
                size={100}
                strokeWidth={6}
                color={liquidityColor}
                label="Thanh khoản"
              />
            </View>

            {/* Progress bar */}
            <View style={{ marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={[typography.micro, { color: colors.textTertiary, fontWeight: '600' }]}>Đã bán / Tổng SP</Text>
                <Text style={[typography.micro, { color: colors.text, fontWeight: '800' }]}>
                  {project.soldUnits || 0} / {project.totalUnits || 0}
                </Text>
              </View>
              <View style={{ height: 8, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                <View style={{ width: `${Math.min(liquidityPct, 100)}%`, height: '100%', backgroundColor: liquidityColor, borderRadius: 4 } as any} />
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', marginVertical: 20 }]} />
            
            {/* Value Stats */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {[
                { label: 'Giá TB', value: project.avgPrice ? formatTy(project.avgPrice) : 'N/A', color: colors.brand },
                { label: 'Hoa hồng', value: `${project.feeRate || 0}%`, color: colors.warning },
                { label: 'Tổng GT', value: formatTy(totalValue), color: colors.purple },
              ].map((s, i) => (
                <View key={i} style={{ alignItems: 'center' }}>
                  <Text style={[typography.micro, { color: colors.textTertiary, fontWeight: '600' }]}>{s.label}</Text>
                  <Text style={[typography.h4, { color: s.color, marginTop: 6, fontWeight: '800' }]}>{s.value}</Text>
                </View>
              ))}
            </View>
          </SGCard>
        </Animated.View>

        {/* Right Column: Inventory */}
        <Animated.View entering={FadeInRight.delay(400).springify().damping(20)} style={{ flex: isDesktop ? 1.6 : undefined, marginTop: isDesktop ? 0 : 24 }}>
          <SGCard style={[styles.sectionCard, sgds.sectionBase(theme), { padding: 28, minHeight: 500 }] as any}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={[styles.kpiIconBox, { backgroundColor: isDark ? 'rgba(59,130,246,0.1)' : '#eff6ff' }]}>
                  <Package size={18} color={colors.brand} />
                </View>
                <View>
                  <Text style={[typography.h4, { color: colors.text, fontWeight: '800' }]}>Danh sách Sản phẩm</Text>
                  {safeProducts.length > 0 && (
                    <Text style={[typography.micro, { color: colors.textTertiary, marginTop: 2 }]}>{safeProducts.length} sản phẩm</Text>
                  )}
                </View>
              </View>
              <SGButton 
                title="Quản lý Bảng hàng" 
                variant="outline" 
                size="sm" 
                onPress={() => onNavigateInventory?.(projectId)}
                style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#cbd5e1' }}
              />
            </View>

            {/* Status chips row */}
            {safeProducts.length > 0 && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                {Object.entries(statusCounts).map(([status, count]) => (
                  <View key={status} style={{
                    flexDirection: 'row', alignItems: 'center', gap: 6,
                    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
                    borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                  }}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: getStatusColor(status) }} />
                    <Text style={[typography.micro, { color: colors.textSecondary, fontWeight: '600' }]}>
                      {getStatusLabel(status)} ({count as number})
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {isProductsLoading ? (
              <SGSkeletonLoader type="table" rows={6} columns={5} isDark={isDark} />
            ) : safeProducts.length === 0 ? (
              <SGEmptyState
                icon={<Grid3x3 size={48} color={colors.textTertiary} strokeWidth={1} />}
                title="Chưa có sản phẩm nào"
                subtitle="Dự án chưa import bảng hàng"
                style={{ minHeight: 300 }}
              />
            ) : (
              <ScrollView style={{ flex: 1 }}>
                {/* Header row */}
                <View style={[styles.tableRow, { 
                  paddingBottom: 14, marginBottom: 4,
                  borderBottomWidth: 2, borderBottomColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'  
                }]}>
                  <Text style={[styles.colCode, typography.micro, { color: colors.textTertiary, fontWeight: '700' }]}>MÃ CĂN</Text>
                  <Text style={[styles.colBlock, typography.micro, { color: colors.textTertiary, fontWeight: '700' }]}>BLOCK/TẦNG</Text>
                  <Text style={[styles.colArea, typography.micro, { color: colors.textTertiary, fontWeight: '700' }]}>DIỆN TÍCH</Text>
                  <Text style={[styles.colPrice, typography.micro, { color: colors.textTertiary, fontWeight: '700' }]}>GIÁ BÁN</Text>
                  <Text style={[styles.colStatus, typography.micro, { color: colors.textTertiary, fontWeight: '700', textAlign: 'right' }]}>TRẠNG THÁI</Text>
                </View>
                
                {safeProducts.map((p: any, idx: number) => {
                  const sc = getStatusColor(p.status);
                  const isLast = idx === safeProducts.length - 1;
                  return (
                    <View key={p.id} style={[styles.tableRow, { 
                      paddingVertical: 14,
                      backgroundColor: idx % 2 === 0 ? 'transparent' : (isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.015)'),
                      borderBottomColor: isLast ? 'transparent' : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'), 
                      borderBottomWidth: isLast ? 0 : 1,
                      borderRadius: 8, paddingHorizontal: 8,
                    }]}>
                      <Text style={[styles.colCode, typography.body, { color: colors.text, fontWeight: '700' }]}>{p.code}</Text>
                      <Text style={[styles.colBlock, typography.body, { color: colors.textSecondary }]}>{p.block || '-'}/{p.floor || '-'}</Text>
                      <Text style={[styles.colArea, typography.body, { color: colors.textSecondary }]}>{p.area || 0} m²</Text>
                      <Text style={[styles.colPrice, typography.body, { color: colors.text, fontWeight: '600' }]}>{p.price ? formatTy(p.price) : 'N/A'}</Text>
                      <View style={[styles.colStatus, { flexDirection: 'row', justifyContent: 'flex-end' }]}>
                        <View style={{ 
                          backgroundColor: isDark ? `${sc}20` : `${sc}15`, 
                          paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8,
                          borderWidth: 1, borderColor: `${sc}30`,
                        }}>
                          <Text style={[typography.micro, { color: sc, fontWeight: '800', fontSize: 10 }]}>{getStatusLabel(p.status)}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            )}
          </SGCard>
        </Animated.View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 24,
    paddingBottom: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    width: 36, height: 36, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 24,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  kpiCard: {
    flex: 1,
    minWidth: 160,
    padding: 20,
    borderRadius: 16,
  },
  kpiIconBox: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  mainContent: {
    gap: 24,
    marginTop: 24,
  },
  sectionCard: {
    padding: 28,
    borderRadius: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  divider: {
    height: 1,
    marginVertical: 14,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colCode: { width: 90 },
  colBlock: { width: 90 },
  colArea: { width: 90 },
  colPrice: { width: 110 },
  colStatus: { flex: 1 },
});
