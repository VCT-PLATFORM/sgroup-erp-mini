import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { typography, useTheme } from '../../../shared/theme/theme';
import { useProjects } from '../hooks/useProjects';
import { Building2, Home, CheckCircle2, TrendingUp } from 'lucide-react-native';
import { useThemeStore } from '../../../shared/theme/themeStore';
import { SGCard } from '../../../shared/ui/components';
import { formatTy } from '../../../shared/utils/formatters';

export function ProjectDashboard() {
  const colors = useTheme();
  const { isDark } = useThemeStore();
  const { data: projects, isLoading, isError } = useProjects();

  const stats = useMemo(() => {
    if (!projects || !Array.isArray(projects)) {
      return { total: 0, ongoing: 0, totalUnits: 0, soldUnits: 0, value: 0 };
    }
    
    let ongoing = 0;
    let totalUnits = 0;
    let soldUnits = 0;
    let value = 0;
    
    projects.forEach(p => {
      if (p.status === 'ACTIVE') ongoing++;
      totalUnits += (p.totalUnits || 0);
      soldUnits += (p.soldUnits || 0);
      // Rough estimation of pipeline value: avgPrice * totalUnits
      value += (p.avgPrice || 0) * (p.totalUnits || 0);
    });

    return { total: projects.length, ongoing, totalUnits, soldUnits, value };
  }, [projects]);

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Aurora backdrop */}
      {Platform.OS === 'web' && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <View style={[styles.aurora, {
            top: '-10%', left: '-5%', width: 800, height: 800,
            backgroundColor: isDark ? 'rgba(16,185,129,0.05)' : 'rgba(16,185,129,0.03)',
            filter: 'blur(100px)',
          } as any]} />
        </View>
      )}

      <View style={styles.header}>
        <Text style={[typography.h2, { color: colors.text, marginBottom: 8 }]}>Tổng quan Dự án</Text>
        <Text style={[typography.body, { color: colors.textSecondary }]}>
          Báo cáo nhanh các chỉ số về danh mục dự án & bảng hàng
        </Text>
      </View>

      <View style={styles.kpiGrid}>
        <SGCard style={{ ...styles.kpiCard, borderColor: isDark ? 'rgba(16,185,129,0.2)' : '#d1fae5', borderWidth: 1 } as any}>
          <View style={[styles.iconBox, { backgroundColor: isDark ? 'rgba(16,185,129,0.1)' : '#ecfdf5' }]}>
            <Building2 size={24} color="#10b981" />
          </View>
          <Text style={[typography.micro, { color: colors.textSecondary, marginTop: 16, marginBottom: 4 }]}>TỔNG DỰ ÁN</Text>
          <Text style={[typography.h2, { color: colors.text }]}>{stats.total}</Text>
          <Text style={[typography.micro, { color: colors.textTertiary, marginTop: 8 }]}>
            <Text style={{ color: '#10b981', fontWeight: 'bold' }}>{stats.ongoing}</Text> đang mở bán
          </Text>
        </SGCard>

        <SGCard style={styles.kpiCard}>
          <View style={[styles.iconBox, { backgroundColor: isDark ? 'rgba(59,130,246,0.1)' : '#eff6ff' }]}>
            <Home size={24} color="#3b82f6" />
          </View>
          <Text style={[typography.micro, { color: colors.textSecondary, marginTop: 16, marginBottom: 4 }]}>TỔNG SẢN PHẨM</Text>
          <Text style={[typography.h2, { color: colors.text }]}>{stats.totalUnits}</Text>
          <Text style={[typography.micro, { color: colors.textTertiary, marginTop: 8 }]}>Kho hàng phân phối</Text>
        </SGCard>

        <SGCard style={styles.kpiCard}>
          <View style={[styles.iconBox, { backgroundColor: isDark ? 'rgba(139,92,246,0.1)' : '#f5f3ff' }]}>
            <CheckCircle2 size={24} color="#8b5cf6" />
          </View>
          <Text style={[typography.micro, { color: colors.textSecondary, marginTop: 16, marginBottom: 4 }]}>SẢN PHẨM ĐÃ BÁN</Text>
          <Text style={[typography.h2, { color: colors.text }]}>{stats.soldUnits}</Text>
          <Text style={[typography.micro, { color: colors.textTertiary, marginTop: 8 }]}>
            Thanh khoản <Text style={{ color: '#8b5cf6', fontWeight: 'bold' }}>
              {stats.totalUnits > 0 ? Math.round((stats.soldUnits / stats.totalUnits) * 100) : 0}%
            </Text>
          </Text>
        </SGCard>

        <SGCard style={styles.kpiCard}>
          <View style={[styles.iconBox, { backgroundColor: isDark ? 'rgba(245,158,11,0.1)' : '#fffbeb' }]}>
            <TrendingUp size={24} color="#f59e0b" />
          </View>
          <Text style={[typography.micro, { color: colors.textSecondary, marginTop: 16, marginBottom: 4 }]}>TỔNG GIÁ TRỊ TẠM TÍNH</Text>
          <Text style={[typography.h2, { color: colors.text }]} numberOfLines={1}>{formatTy(stats.value)}</Text>
          <Text style={[typography.micro, { color: colors.textTertiary, marginTop: 8 }]}>Dựa trên giá TB & tổng SP</Text>
        </SGCard>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
  },
  aurora: { position: 'absolute', pointerEvents: 'none', borderRadius: 999 },
  header: {
    marginBottom: 32,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  kpiCard: {
    flex: 1,
    minWidth: Platform.OS === 'web' ? 220 : '45%',
    padding: 24,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
