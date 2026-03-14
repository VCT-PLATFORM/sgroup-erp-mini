import React from 'react';
import { View, Text, StyleSheet, Platform, ScrollView } from 'react-native';
import { useTheme, typography } from '../../../shared/theme/theme';
import { useThemeStore } from '../../../shared/theme/themeStore';
import { SGCard, SGButton } from '../../../shared/ui';
import { Plus, Percent } from 'lucide-react-native';

export function ProjectPolicies() {
  const colors = useTheme();
  const { isDark } = useThemeStore();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={[typography.h3, { color: colors.text }]}>Chính sách Bán hàng</Text>
          <Text style={[typography.body, { color: colors.textSecondary, marginTop: 4 }]}>
            Thiết lập chiết khấu, tiến độ thanh toán cho các dự án
          </Text>
        </View>
        <SGButton title="Thêm Chính sách" icon={<Plus size={18} color="#fff" />} variant="primary" onPress={() => {}} />
      </View>

      <SGCard style={{ padding: 40, alignItems: 'center', justifyContent: 'center', marginTop: 24, minHeight: 400 }}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>📜</Text>
        <Text style={[typography.h4, { color: colors.text, marginBottom: 8 }]}>Chưa có CSBH nào được thiếp lập</Text>
        <Text style={[typography.body, { color: colors.textTertiary, textAlign: 'center', maxWidth: 400 }]}>
          Tính năng quản lý tiến độ thanh toán, hoa hồng môi giới, chương trình chiết khấu cho khách hàng đang được xây dựng.
        </Text>
      </SGCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
