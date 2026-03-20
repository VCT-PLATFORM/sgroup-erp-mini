import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, TextInput, Platform, useWindowDimensions } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { typography, sgds } from '../../../shared/theme/theme';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { SGCard, SGButton, SGAuroraBackground, SGSkeletonLoader, SGEmptyState } from '../../../shared/ui/components';
import { useProjects, useDeleteProject } from '../hooks/useProjects';
import { Building2, Plus, MapPin, Search, Trash2, TrendingUp, Layers, CheckCircle2 } from 'lucide-react-native';
import { formatTy } from '../../../shared/utils/formatters';
import { ProjectDetailView } from './ProjectDetailView';
import { ProjectFormModal } from '../components/ProjectFormModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { useToast } from '../../sales/components/ToastProvider';

interface Props {
  onNavigateInventory?: (projectId: string) => void;
}

export function ProjectListScreen({ onNavigateInventory }: Props) {
  const { colors, theme, isDark } = useAppTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width > 1024;
  const isTablet = width > 768 && width <= 1024;
  const { showToast } = useToast();
  const { data: projects, isLoading, isError, refetch, isRefetching } = useProjects();
  const deleteMutation = useDeleteProject();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editProject, setEditProject] = useState<any>(null);
  const [deletingProject, setDeletingProject] = useState<any | null>(null);

  const filteredProjects = useMemo(() => {
    const safeProjects = Array.isArray(projects) ? projects : [];
    if (!searchQuery) return safeProjects;
    const lowerQ = searchQuery.toLowerCase();
    return safeProjects.filter((p: any) => 
      p.name?.toLowerCase().includes(lowerQ) || 
      p.projectCode?.toLowerCase().includes(lowerQ) ||
      p.developer?.toLowerCase().includes(lowerQ)
    );
  }, [projects, searchQuery]);

  const handleOpenCreate = () => {
    setEditProject(null);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deletingProject) return;
    try {
      await deleteMutation.mutateAsync(deletingProject.id);
      showToast(`Đã xóa dự án "${deletingProject.name}"`, 'success');
      setDeletingProject(null);
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || 'Lỗi không xác định';
      showToast(`Xóa thất bại: ${msg}`, 'error');
    }
  };

  const renderProjectItem = ({ item, index }: { item: any, index: number }) => {
    const liquidity = item.totalUnits ? Math.round((item.soldUnits / item.totalUnits) * 100) : 0;
    
    return (
      <Animated.View entering={FadeInUp.delay(index * 100).springify().damping(20)} style={{ flex: 1 }}>
        <SGCard style={[styles.card, sgds.sectionBase(theme) as any, { padding: 0 }] as any}>
          {/* Top Gradient Banner matching status */}
          <View style={{
            height: 6, width: '100%',
            backgroundColor: item.status === 'ACTIVE' ? colors.success : item.status === 'PAUSED' ? colors.warning : colors.textTertiary
          }} />
  
          <View style={[styles.cardHeader, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', flex: 1 }}>
              <View style={[styles.iconBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc', elevation: 2, ...(Platform.OS==='web'&&{boxShadow:'0 4px 12px rgba(0,0,0,0.05)'} as any) }]}>
                <Building2 size={24} color={isDark ? '#e2e8f0' : '#475569'} strokeWidth={2} />
              </View>
              <View style={{ marginLeft: 16, flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap', gap: 8 }}>
                  <Text style={[typography.h3, { color: colors.text, fontWeight: '800' }]} numberOfLines={1}>{item.name}</Text>
                  <View style={[
                    styles.statusBadge, 
                    { backgroundColor: item.status === 'ACTIVE' ? (isDark ? 'rgba(16,185,129,0.15)' : '#ecfdf5') 
                      : item.status === 'PAUSED' ? (isDark ? 'rgba(245,158,11,0.15)' : '#fffbeb')
                      : (isDark ? 'rgba(100,116,139,0.15)' : '#f8fafc'),
                      borderWidth: 1,
                      borderColor: item.status === 'ACTIVE' ? (isDark ? 'rgba(16,185,129,0.3)' : '#a7f3d0') 
                      : item.status === 'PAUSED' ? (isDark ? 'rgba(245,158,11,0.3)' : '#fde68a')
                      : (isDark ? 'rgba(100,116,139,0.3)' : '#e2e8f0') 
                    }
                  ]}>
                    <Text style={[
                      typography.micro, 
                      { color: item.status === 'ACTIVE' ? colors.success : item.status === 'PAUSED' ? colors.warning : colors.textSecondary, fontWeight: '800', fontSize: 10 }
                    ]}>
                      {item.status === 'ACTIVE' ? 'ĐANG BÁN' : item.status === 'PAUSED' ? 'TẠM DỪNG' : 'ĐÃ ĐÓNG'}
                    </Text>
                </View>
              </View>
              <Text style={[typography.body, { color: colors.textSecondary, fontWeight: '600' }]}>{item.projectCode} • {item.developer || 'Đang cập nhật'}</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            onPress={() => setDeletingProject(item)} 
            style={[styles.miniBtn, { backgroundColor: isDark ? 'rgba(239,68,68,0.1)' : '#fef2f2' }]}
          >
            <Trash2 size={16} color={colors.danger} />
          </TouchableOpacity>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
             <MapPin size={14} color={colors.textSecondary} style={{ marginRight: 6 }} />
             <Text style={[typography.body, { color: colors.textSecondary, flex: 1, fontSize: 13 }]} numberOfLines={1}>{item.location || 'Chưa cập nhật vị trí'}</Text>
          </View>

          {/* Premium Stats Row */}
          <View style={[styles.statsRow, { backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc' }]}>
            <View style={styles.statBox}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Layers size={14} color={colors.textSecondary} style={{ marginRight: 4 }} />
                <Text style={[typography.micro, { color: colors.textSecondary, fontWeight: '600' }]}>Tổng SP</Text>
              </View>
              <Text style={[typography.h3, { color: colors.text, fontWeight: '800' }]}>{item.totalUnits || 0}</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statBox}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <CheckCircle2 size={14} color={colors.success} style={{ marginRight: 4 }} />
                <Text style={[typography.micro, { color: colors.textSecondary, fontWeight: '600' }]}>Đã Bán</Text>
              </View>
              <Text style={[typography.h3, { color: colors.success, fontWeight: '800' }]}>{item.soldUnits || 0}</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statBox}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <TrendingUp size={14} color={colors.brand} style={{ marginRight: 4 }} />
                <Text style={[typography.micro, { color: colors.textSecondary, fontWeight: '600' }]}>Giá TB (Tỷ)</Text>
              </View>
              <Text style={[typography.h3, { color: colors.brand, fontWeight: '800' }]}>{item.avgPrice || 'N/A'}</Text>
            </View>
          </View>
          
          {/* Liquidity Progress */}
          <View style={{ marginTop: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={[typography.micro, { color: colors.textTertiary, fontWeight: '600' }]}>Tốc độ Thanh khoản</Text>
              <Text style={[typography.micro, { color: colors.text, fontWeight: '800' }]}>{liquidity}%</Text>
            </View>
            <View style={{ height: 6, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
              <View style={{ 
                width: `${Math.min(liquidity, 100)}%`, height: '100%', 
                backgroundColor: liquidity >= 70 ? colors.success : liquidity >= 40 ? colors.warning : colors.danger, 
                borderRadius: 3,
                ...(Platform.OS === 'web' && { transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' } as any),
              } as any} />
            </View>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <SGButton 
            title="Xem Bảng Hàng" variant="outline" size="md" 
            style={{ flex: 1, marginRight: 12, borderColor: colors.border }} 
            onPress={() => onNavigateInventory?.(item.id)}
          />
          <SGButton 
            title="Chi Tiết" variant="primary" size="md" 
            style={{ flex: 1, backgroundColor: colors.success }} 
            onPress={() => setSelectedProjectId(item.id)} 
          />
        </View>
        </SGCard>
      </Animated.View>
    );
  };

  if (selectedProjectId) {
    return (
      <ProjectDetailView 
        projectId={selectedProjectId} 
        onBack={() => setSelectedProjectId(null)}
        onNavigateInventory={onNavigateInventory}
      />
    );
  }

  return (
    <View style={[styles.container, { padding: isDesktop ? 40 : 20 }]}>
      <ProjectFormModal visible={showForm} onClose={() => setShowForm(false)} editData={editProject} />
      <DeleteConfirmModal
        visible={!!deletingProject}
        onClose={() => setDeletingProject(null)}
        onConfirm={handleDelete}
        message={`Bạn có chắc chắn muốn xóa dự án "${deletingProject?.name}"?\n\nTất cả sản phẩm liên quan có thể bị ảnh hưởng. Hành động này không thể hoàn tác.`}
        isLoading={deleteMutation.isPending}
      />

      {/* Aurora backdrop for premium feel */}
      {Platform.OS === 'web' && (
        <View style={[StyleSheet.absoluteFill, { zIndex: 0, overflow: 'hidden' }]} pointerEvents="none">
          <SGAuroraBackground />
        </View>
      )}

      <View style={[styles.header, { zIndex: 1 }]}>
        <View>
          <Text style={[typography.h1, { color: colors.text, marginBottom: 8, fontWeight: '800', letterSpacing: -0.5 }]}>Danh mục Dự án</Text>
          <Text style={[typography.body, { color: colors.textSecondary, fontSize: 16 }]}>
            Quản lý thông tin & rổ hàng của toàn bộ hệ thống
          </Text>
        </View>
        <SGButton title="Thêm Dự án" icon={<Plus size={20} color="#fff" />} onPress={handleOpenCreate} 
          style={{ backgroundColor: colors.success, paddingHorizontal: 20 }} />
      </View>

      {isLoading && !isRefetching ? (
        <View style={{ zIndex: 1 }}>
          <SGSkeletonLoader type="card" count={isDesktop ? 4 : 3} isDark={isDark} />
        </View>
      ) : isError ? (
        <View style={styles.centerContainer}>
          <Text style={[typography.body, { color: colors.danger }]}>Đã xảy ra lỗi khi tải danh sách dự án.</Text>
          <SGButton title="Thử lại" onPress={() => refetch()} variant="outline" style={{ marginTop: 16 }} />
        </View>
      ) : (
        <>
          <View style={styles.filterRow}>
            <View style={[styles.searchBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9' }]}>
              <Search size={20} color={colors.textTertiary} />
              <TextInput
                style={[styles.searchInput, { color: colors.text, outlineStyle: 'none' as any }]}
                placeholder="Tìm kiếm theo Tên, Mã, Chủ đầu tư..."
                placeholderTextColor={colors.textTertiary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
        
            <View style={{ zIndex: 1 }}>
              <FlatList
                data={filteredProjects}
                keyExtractor={(item) => item.id}
                renderItem={renderProjectItem}
                contentContainerStyle={{ paddingBottom: 60, gap: 24 }}
                numColumns={isDesktop ? 2 : 1}
                key={isDesktop ? 'desktop-grid' : 'mobile-list'}
                columnWrapperStyle={isDesktop ? { gap: 24 } : undefined}
                refreshControl={
                  <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.success} />
                }
                ListEmptyComponent={
                  <SGEmptyState
                    icon={<Building2 size={48} color={colors.textTertiary} strokeWidth={1} />}
                    title="Chưa có dự án nào"
                    subtitle='Bấm "Thêm Dự án" để khởi tạo dữ liệu.'
                    actionLabel="Thêm Dự án"
                    onAction={handleOpenCreate}
                    style={{ minHeight: 300 }}
                  />
                }
              />
            </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 400 },
  card: { flex: 1, overflow: 'hidden', borderRadius: 28 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 24, paddingBottom: 16 },
  iconBox: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  cardBody: { paddingHorizontal: 24 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 12 },
  statBox: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, height: 32 },
  cardFooter: { flexDirection: 'row', padding: 24, paddingTop: 28 },
  filterRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 32, zIndex: 1 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 48, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(150,150,150,0.1)' },
  searchInput: { flex: 1, marginLeft: 12, fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif", fontSize: 15, height: '100%', fontWeight: '500' },
  miniBtn: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
});
