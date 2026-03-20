import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { typography, sgds } from '../../../shared/theme/theme';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { SGCard, SGButton, SGAuroraBackground, SGSkeletonLoader, SGEmptyState } from '../../../shared/ui/components';
import { FolderPlus, FileCheck, FolderOpen, MoreVertical, FileText, Image as ImageIcon, Download, Inbox } from 'lucide-react-native';
import { useProjectDocs } from '../hooks/useProject';



export function ProjectDocs() {
  const { colors, theme, isDark } = useAppTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width > 1024;
  const [activeTab, setActiveTab] = useState('folders');

  const DOC_TYPE_COLORS: Record<string, string> = {
    GENERAL: colors.success,
    LICENSE: colors.brand,
    DECISION: colors.warning,
    CERTIFICATE: colors.purple,
  };

  const { data: rawDocs, isLoading } = useProjectDocs();
  const allDocs = rawDocs || [];

  // Group docs by docType to create 'folders'
  const folders = useMemo(() => {
    return Object.entries(
      allDocs.reduce((acc: any, d: any) => {
        const t = d.docType || 'GENERAL';
        if (!acc[t]) acc[t] = { count: 0, color: DOC_TYPE_COLORS[t] || '#64748b' };
        acc[t].count++;
        return acc;
      }, {} as Record<string, any>)
    ).map(([key, val]: any, i) => ({ id: String(i), name: key, count: val.count, color: val.color, size: '', updatedAt: '' }));
  }, [allDocs]);

  const files = useMemo(() => {
    return allDocs.map((d: any) => ({
      id: d.id,
      name: d.name,
      type: d.fileUrl?.includes('.pdf') ? 'pdf' : d.fileUrl?.includes('.png') || d.fileUrl?.includes('.jpg') ? 'image' : 'word',
      size: '',
      uploader: d.createdBy || '',
      date: d.createdAt ? new Date(d.createdAt).toLocaleDateString('vi-VN') : '',
    }));
  }, [allDocs]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText size={22} color={colors.danger} />;
      case 'image': return <ImageIcon size={22} color={colors.success} />;
      case 'word': return <FileText size={22} color={colors.brand} />;
      case 'powerpoint': return <FileText size={22} color={colors.warning} />;
      default: return <FileText size={22} color={colors.textSecondary} />;
    }
  };

  return (
    <View style={[styles.container, { padding: isDesktop ? 40 : 20 }]}>
      {/* Aurora Background */}
      {Platform.OS === 'web' && (
        <View style={[StyleSheet.absoluteFill, { zIndex: 0, overflow: 'hidden' }]} pointerEvents="none">
          <SGAuroraBackground />
        </View>
      )}

      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100).springify().damping(20)} style={[styles.header, { zIndex: 1 }]}>
        <View>
          <Text style={[typography.h1, { color: colors.text, fontWeight: '800', letterSpacing: -0.5 }]}>Tài liệu Dự án</Text>
          <Text style={[typography.body, { color: colors.textSecondary, marginTop: 8, fontSize: 15 }]}>
            Quản lý và lưu trữ hồ sơ pháp lý, ấn phẩm truyền thông
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <SGButton title="Tạo Thư mục" icon={<FolderPlus size={18} color={colors.success} />} variant="outline" onPress={() => {}}
            style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#cbd5e1' }} />
          <SGButton title="Tải lên" icon={<FileCheck size={18} color="#fff" />} variant="primary" onPress={() => {}}
            style={{ backgroundColor: colors.success }} />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).springify().damping(20)} style={{ flex: 1, zIndex: 1 }}>
        <SGCard style={[styles.sectionCard, sgds.sectionBase(theme) as any] as any}>
          {/* Tabs */}
          <View style={{ flexDirection: 'row', gap: 24, marginBottom: 28, borderBottomWidth: 2, borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}>
            {['folders', 'recent'].map(tab => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={{ paddingBottom: 14, borderBottomWidth: 3, borderBottomColor: activeTab === tab ? colors.brand : 'transparent', marginBottom: -2 }}
              >
                <Text style={[typography.body, {
                  color: activeTab === tab ? colors.brand : colors.textSecondary,
                  fontWeight: activeTab === tab ? '800' : '600'
                }]}>
                  {tab === 'folders' ? 'Thư mục' : 'Truy cập gần đây'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            {isLoading ? (
              <View style={{ gap: 24 }}>
                <SGSkeletonLoader type="stat" count={4} isDark={isDark} />
                <SGSkeletonLoader type="card" count={3} isDark={isDark} />
              </View>
            ) : allDocs.length === 0 ? (
              <SGEmptyState
                icon={<Inbox size={48} color={colors.textTertiary} strokeWidth={1} />}
                title="Chưa có tài liệu nào"
                subtitle="Tải lên tài liệu đầu tiên hoặc tạo thư mục để bắt đầu quản lý hồ sơ"
                actionLabel="Tải lên"
                onAction={() => {}}
                style={{ minHeight: 350 }}
              />
            ) : (
              <>
                {/* Folders Grid */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 20, marginBottom: 36 }}>
                  {folders.map((folder, idx) => (
                    <Animated.View key={folder.id} entering={FadeInUp.delay(idx * 80).springify().damping(20)}
                      style={[styles.folderCard, {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.9)',
                        borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                        ...(Platform.OS === 'web' && {
                          boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.03)',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                        } as any),
                      }]}
                    >
                      <TouchableOpacity>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                          <View style={[styles.folderIconBox, { backgroundColor: `${folder.color}12` }]}>
                            <FolderOpen size={22} color={folder.color} fill={`${folder.color}30`} />
                          </View>
                          <TouchableOpacity style={{ padding: 4 }}>
                            <MoreVertical size={16} color={colors.textTertiary} />
                          </TouchableOpacity>
                        </View>
                        <Text style={[typography.h4, { color: colors.text, marginBottom: 6, fontWeight: '800' }]} numberOfLines={1}>{folder.name}</Text>
                        <Text style={[typography.micro, { color: colors.textSecondary, fontWeight: '500' }]}>{folder.count} files</Text>
                      </TouchableOpacity>
                    </Animated.View>
                  ))}
                </View>

                {/* Files List */}
                <Text style={[typography.h4, { color: colors.text, marginBottom: 18, fontWeight: '800' }]}>Danh sách Tài liệu</Text>
                <View style={{ gap: 12 }}>
                  {files.map((file: any, idx: number) => (
                    <Animated.View key={file.id} entering={FadeInDown.delay(idx * 60).springify().damping(20)}>
                      <View style={[styles.fileRow, {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.9)',
                        borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                        ...(Platform.OS === 'web' && { boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.02)' } as any),
                      }]}>
                        <View style={[styles.fileIconBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc' }]}>
                          {getFileIcon(file.type)}
                        </View>
                        <View style={{ flex: 1, marginLeft: 16 }}>
                          <Text style={[typography.body, { color: colors.text, fontWeight: '700', fontSize: 14 }]} numberOfLines={1}>{file.name}</Text>
                          <Text style={[typography.micro, { color: colors.textTertiary, marginTop: 4, fontWeight: '500' }]}>
                            {file.size ? `${file.size} • ` : ''}Tải lên bởi {file.uploader}
                          </Text>
                        </View>
                        <Text style={[typography.micro, { color: colors.textTertiary, width: 100, textAlign: 'right', fontWeight: '500' }]}>{file.date}</Text>
                        <TouchableOpacity style={[styles.actionBtn, { marginLeft: 16 }]}>
                          <Download size={17} color={colors.textSecondary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionBtn}>
                          <MoreVertical size={17} color={colors.textSecondary} />
                        </TouchableOpacity>
                      </View>
                    </Animated.View>
                  ))}
                </View>
              </>
            )}
          </ScrollView>
        </SGCard>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 },
  folderCard: {
    width: (Platform.OS === 'web' ? 'calc(25% - 15px)' : '46%') as any,
    minWidth: 200, padding: 22, borderRadius: 18, borderWidth: 1
  },
  folderIconBox: { width: 46, height: 46, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  fileRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 14, borderWidth: 1 },
  fileIconBox: { width: 42, height: 42, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  actionBtn: { padding: 8, borderRadius: 8 },
  sectionCard: { padding: 28, borderRadius: 20, flex: 1 },
});
