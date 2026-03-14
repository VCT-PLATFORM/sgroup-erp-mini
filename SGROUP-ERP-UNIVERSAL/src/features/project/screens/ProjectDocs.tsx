import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useTheme, typography } from '../../../shared/theme/theme';
import { useThemeStore } from '../../../shared/theme/themeStore';
import { SGCard, SGButton } from '../../../shared/ui';
import { FolderPlus, FileCheck, FolderOpen, MoreVertical, FileText, Image as ImageIcon, Download } from 'lucide-react-native';

const MOCK_FOLDERS = [
  { id: '1', name: 'Pháp lý dự án', count: 12, size: '45 MB', updatedAt: '2023-10-12', color: '#10b981' },
  { id: '2', name: 'Sale Kit', count: 24, size: '120 MB', updatedAt: '2023-10-15', color: '#3b82f6' },
  { id: '3', name: 'Mặt bằng & Thiết kế', count: 8, size: '85 MB', updatedAt: '2023-10-10', color: '#f59e0b' },
  { id: '4', name: 'Chính sách', count: 3, size: '5 MB', updatedAt: '2023-10-16', color: '#8b5cf6' },
];

const MOCK_FILES = [
  { id: '1', name: 'Giấy phép xây dựng.pdf', type: 'pdf', size: '2.5 MB', uploader: 'Nguyễn Văn A', date: '12/10/2023' },
  { id: '2', name: 'Sale_Kit_Full_Version_v2.pptx', type: 'powerpoint', size: '45 MB', uploader: 'Trần Thị B', date: '15/10/2023' },
  { id: '3', name: 'Mặt bằng Tầng 3-15.png', type: 'image', size: '4.2 MB', uploader: 'Nguyễn Văn A', date: '10/10/2023' },
  { id: '4', name: 'Quy_trinh_giu_cho_Q4.docx', type: 'word', size: '1.2 MB', uploader: 'Lê Văn C', date: '16/10/2023' },
];

export function ProjectDocs() {
  const colors = useTheme();
  const { isDark } = useThemeStore();
  const [activeTab, setActiveTab] = useState('folders');

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText size={24} color="#ef4444" />;
      case 'image': return <ImageIcon size={24} color="#10b981" />;
      case 'word': return <FileText size={24} color="#3b82f6" />;
      case 'powerpoint': return <FileText size={24} color="#f59e0b" />;
      default: return <FileText size={24} color={colors.textSecondary} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[typography.h2, { color: colors.text }]}>Tài liệu Dự án</Text>
          <Text style={[typography.body, { color: colors.textSecondary, marginTop: 8 }]}>
            Quản lý và lưu trữ hồ sơ pháp lý, ấn phẩm truyền thông
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <SGButton title="Tạo Thư mục" icon={<FolderPlus size={18} color="#10b981" />} variant="outline" onPress={() => {}} />
          <SGButton title="Tải lên" icon={<FileCheck size={18} color="#fff" />} variant="primary" onPress={() => {}} />
        </View>
      </View>

      <SGCard style={{ flex: 1, padding: 24 }}>
        {/* Tabs */}
        <View style={{ flexDirection: 'row', gap: 24, marginBottom: 24, borderBottomWidth: 1, borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
          {['folders', 'recent'].map(tab => (
            <TouchableOpacity 
              key={tab} 
              onPress={() => setActiveTab(tab)}
              style={{ paddingBottom: 12, borderBottomWidth: 2, borderBottomColor: activeTab === tab ? '#10b981' : 'transparent' }}
            >
              <Text style={[typography.body, { 
                color: activeTab === tab ? '#10b981' : colors.textSecondary,
                fontWeight: activeTab === tab ? '700' : '600'
              }]}>
                {tab === 'folders' ? 'Thư mục' : 'Truy cập gần đây'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Folders Grid */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 20, marginBottom: 32 }}>
            {MOCK_FOLDERS.map(folder => (
              <TouchableOpacity key={folder.id} style={[styles.folderCard, { 
                backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
              }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <View style={[styles.folderIconBox, { backgroundColor: `${folder.color}15` }]}>
                    <FolderOpen size={24} color={folder.color} fill={`${folder.color}40`} />
                  </View>
                  <TouchableOpacity>
                    <MoreVertical size={16} color={colors.textTertiary} />
                  </TouchableOpacity>
                </View>
                <Text style={[typography.h4, { color: colors.text, marginBottom: 4 }]} numberOfLines={1}>{folder.name}</Text>
                <Text style={[typography.micro, { color: colors.textSecondary }]}>{folder.count} files • {folder.size}</Text>
                <Text style={[typography.micro, { color: colors.textTertiary, marginTop: 12 }]}>Cập nhật: {folder.updatedAt}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Files List */}
          <Text style={[typography.h4, { color: colors.text, marginBottom: 16 }]}>Danh sách Tài liệu</Text>
          <View style={{ gap: 12 }}>
            {MOCK_FILES.map(file => (
              <View key={file.id} style={[styles.fileRow, {
                backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#fff',
                borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              }]}>
                <View style={[styles.fileIconBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9' }]}>
                  {getFileIcon(file.type)}
                </View>
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <Text style={[typography.body, { color: colors.text, fontWeight: '600' }]} numberOfLines={1}>{file.name}</Text>
                  <Text style={[typography.micro, { color: colors.textSecondary, marginTop: 4 }]}>
                    {file.size} • Tải lên bởi {file.uploader}
                  </Text>
                </View>
                <Text style={[typography.micro, { color: colors.textTertiary, width: 100, textAlign: 'right' }]}>{file.date}</Text>
                <TouchableOpacity style={{ padding: 8, marginLeft: 16 }}>
                  <Download size={18} color={colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 8 }}>
                  <MoreVertical size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </SGCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingBottom: 0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 },
  folderCard: {
    width: (Platform.OS === 'web' ? 'calc(25% - 15px)' : '46%') as any,
    minWidth: 200, padding: 20, borderRadius: 16, borderWidth: 1
  },
  folderIconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  fileRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1 },
  fileIconBox: { width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center' }
});
