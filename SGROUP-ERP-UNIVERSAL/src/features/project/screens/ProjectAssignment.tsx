import React from 'react';
import { View, Text, StyleSheet, Platform, ScrollView } from 'react-native';
import { useTheme, typography } from '../../../shared/theme/theme';
import { useThemeStore } from '../../../shared/theme/themeStore';
import { SGCard, SGButton } from '../../../shared/ui';
import { ShieldCheck, Users } from 'lucide-react-native';

export function ProjectAssignment() {
  const colors = useTheme();
  const { isDark } = useThemeStore();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={[typography.h3, { color: colors.text }]}>Phân quyền Dự án</Text>
          <Text style={[typography.body, { color: colors.textSecondary, marginTop: 4 }]}>
            Thiết lập quyền phân phối và truy cập dự án cho nhân sự
          </Text>
        </View>
        <SGButton title="Gán Quyền Khởi Tạo" icon={<ShieldCheck size={18} color="#fff" />} variant="primary" onPress={() => {}} />
      </View>

      <SGCard style={{ padding: 40, alignItems: 'center', justifyContent: 'center', marginTop: 24, minHeight: 400 }}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>🔐</Text>
        <Text style={[typography.h4, { color: colors.text, marginBottom: 8 }]}>Hệ thống Phân quyền Phân phối</Text>
        <Text style={[typography.body, { color: colors.textTertiary, textAlign: 'center', maxWidth: 400 }]}>
          Tính năng gán đại lý, sàn giao dịch hoặc cá nhân vào dự án với cấu hình khóa giỏ hàng đang trong lộ trình phát triển.
        </Text>
      </SGCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
