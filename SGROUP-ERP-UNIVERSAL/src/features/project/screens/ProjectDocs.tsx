import React from 'react';
import { View, Text, StyleSheet, Platform, ScrollView } from 'react-native';
import { useTheme, typography } from '../../../shared/theme/theme';
import { useThemeStore } from '../../../shared/theme/themeStore';
import { SGCard, SGButton } from '../../../shared/ui';
import { FolderPlus, FileCheck } from 'lucide-react-native';

export function ProjectDocs() {
  const colors = useTheme();
  const { isDark } = useThemeStore();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={[typography.h3, { color: colors.text }]}>Tài liệu Dự án</Text>
          <Text style={[typography.body, { color: colors.textSecondary, marginTop: 4 }]}>
            Quản lý và lưu trữ hình ảnh, ấn phẩm, hồ sơ pháp lý
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <SGButton title="Tạo Thư mục" icon={<FolderPlus size={18} color="#10b981" />} variant="outline" onPress={() => {}} />
          <SGButton title="Tải lên Tài liệu" icon={<FileCheck size={18} color="#fff" />} variant="primary" onPress={() => {}} />
        </View>
      </View>

      <SGCard style={{ padding: 40, alignItems: 'center', justifyContent: 'center', marginTop: 24, minHeight: 400 }}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>📂</Text>
        <Text style={[typography.h4, { color: colors.text, marginBottom: 8 }]}>Chưa có tài liệu nào</Text>
        <Text style={[typography.body, { color: colors.textTertiary, textAlign: 'center', maxWidth: 400 }]}>
          Tài liệu pháp lý, sale kit, ấn phẩm truyền thông của các dự án sẽ được hiển thị và quản lý tại đây. Tính năng này đang được phát triển.
        </Text>
      </SGCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
