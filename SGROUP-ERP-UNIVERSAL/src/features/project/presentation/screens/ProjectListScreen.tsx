import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useGetProjects } from '../../application/hooks/useProjectQueries';
import { SGCard } from '../../../../shared/ui/components/SGCard';
import { Building, MapPin, Grid, Plus } from 'lucide-react-native';
import { ProjectFormModal } from '../components/ProjectFormModal';

export const ProjectListScreen = ({ onNavigateInventory }: { onNavigateInventory?: (id: string) => void }) => {
  const { data: projects, isLoading } = useGetProjects();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setModalVisible(true);
  };

  const handleAddNew = () => {
    setEditingProject(null);
    setModalVisible(true);
  };

  return (
    <LinearGradient colors={['#F8FAFC', '#E2E8F0']} style={styles.container}>
      <BlurView intensity={90} tint="light" style={styles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text variant="h1" weight="bold" color="#0F172A">Danh Sách Dự Án</Text>
            <Text variant="body2" color="#64748B">Quản lý tổng thể danh mục dự án SGROUP</Text>
          </View>
          <TouchableOpacity style={styles.btnPrimary} onPress={handleAddNew}>
            <Plus size={16} color="#FFF" />
            <Text variant="body2" weight="bold" color="#FFF">Thêm Dự Án</Text>
          </TouchableOpacity>
        </View>
      </BlurView>

      <ScrollView contentContainerStyle={styles.list}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#10B981" style={{ marginTop: 40 }} />
        ) : projects?.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 40, color: '#64748B' }}>Chưa có dự án nào.</Text>
        ) : (
          projects?.map((p: any) => (
            <SGCard key={p.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text variant="h3" weight="bold" color="#1E293B">{p.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 }}>
                    <MapPin size={14} color="#64748B" />
                    <Text variant="caption" color="#64748B">{p.location || 'Chưa cập nhật'}</Text>
                  </View>
                </View>
                <View style={[styles.badge, p.status === 'ACTIVE' ? styles.badgeActive : styles.badgePaused]}>
                  <Text variant="caption" weight="bold" color={p.status === 'ACTIVE' ? '#10B981' : '#F59E0B'}>{p.status}</Text>
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text variant="caption" color="#64748B">Loại Hình</Text>
                  <Text variant="body2" weight="bold">{p.type || 'N/A'}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text variant="caption" color="#64748B">Tổng SP</Text>
                  <Text variant="body2" weight="bold">{p.totalUnits}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text variant="caption" color="#64748B">Đã Bán</Text>
                  <Text variant="body2" weight="bold" color="#10B981">{p.soldUnits}</Text>
                </View>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity style={styles.btnSecondary} onPress={() => handleEdit(p)}>
                  <Text variant="body2" weight="bold" color="#475569">Sửa Dự Án</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.btnPrimary}
                  onPress={() => onNavigateInventory?.(p.id)}
                >
                  <Grid size={16} color="#FFF" />
                  <Text variant="body2" weight="bold" color="#FFF">Xem Bảng Hàng</Text>
                </TouchableOpacity>
              </View>
            </SGCard>
          ))
        )}
      </ScrollView>

      <ProjectFormModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        editData={editingProject} 
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 24, paddingTop: 40, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  list: { padding: 16, gap: 16 },
  card: { padding: 20, borderRadius: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  badgeActive: { backgroundColor: '#D1FAE5' },
  badgePaused: { backgroundColor: '#FEF3C7' },
  statsRow: { flexDirection: 'row', gap: 16, marginBottom: 20, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12 },
  statBox: { flex: 1 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  btnSecondary: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, backgroundColor: '#F1F5F9' },
  btnPrimary: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, backgroundColor: '#10B981' }
});
