import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { typography, sgds } from '../../../shared/theme/theme';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { SGCard, SGButton, SGAuroraBackground, SGSkeletonLoader, SGEmptyState } from '../../../shared/ui/components';
import { Plus, Percent, CalendarClock, ChevronRight, CheckCircle2, FileText } from 'lucide-react-native';
import { usePolicies } from '../hooks/useProject';

export function ProjectPolicies() {
  const { colors, theme, isDark } = useAppTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width > 1024;
  const [activeTab, setActiveTab] = useState('active');

  const { data: rawPolicies, isLoading } = usePolicies();

  const policies = useMemo(() => {
    return (rawPolicies || []).map((p: any) => {
      let rules: string[] = [];
      try { rules = p.rules ? JSON.parse(p.rules) : []; } catch { rules = []; }
      return {
        ...p,
        rules,
        startDate: p.startDate ? new Date(p.startDate).toLocaleDateString('vi-VN') : '',
        endDate: p.endDate ? new Date(p.endDate).toLocaleDateString('vi-VN') : '',
      };
    });
  }, [rawPolicies]);

  const filteredPolicies = useMemo(() => {
    return policies.filter((p: any) => activeTab === 'active' ? p.status === 'ACTIVE' : p.status === 'DRAFT');
  }, [policies, activeTab]);

  return (
    <View style={[styles.container, { padding: isDesktop ? 40 : 20 }]}>
      {/* Aurora Background */}
      {Platform.OS === 'web' && (
        <View style={[StyleSheet.absoluteFill, { zIndex: 0, overflow: 'hidden' }]} pointerEvents="none">
          <SGAuroraBackground />
        </View>
      )}

      <Animated.View entering={FadeInDown.delay(100).springify().damping(20)} style={[styles.header, { zIndex: 1 }]}>
        <View>
          <Text style={[typography.h1, { color: colors.text, fontWeight: '800', letterSpacing: -0.5 }]}>Chính sách Bán hàng</Text>
          <Text style={[typography.body, { color: colors.textSecondary, marginTop: 8, fontSize: 15 }]}>
            Thiết lập chiết khấu, tiến độ thanh toán và phí môi giới
          </Text>
        </View>
        <SGButton title="Thêm Chính sách" icon={<Plus size={18} color="#fff" />} variant="primary" onPress={() => {}}
          style={{ backgroundColor: colors.success }} />
      </Animated.View>

      <View style={{ flexDirection: isDesktop ? 'row' : 'column', gap: 24, flex: 1, zIndex: 1 }}>
        {/* Left Column: List */}
        <Animated.View entering={FadeInDown.delay(200).springify().damping(20)} style={{ flex: 1.5 }}>
          <SGCard style={[styles.sectionCard, sgds.sectionBase(theme) as any] as any}>
            <View style={{ flexDirection: 'row', gap: 24, marginBottom: 24, borderBottomWidth: 2, borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}>
              {['active', 'draft'].map(tab => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={{ paddingBottom: 14, borderBottomWidth: 3, borderBottomColor: activeTab === tab ? colors.success : 'transparent', marginBottom: -2 }}
                >
                  <Text style={[typography.body, {
                    color: activeTab === tab ? colors.success : colors.textSecondary,
                    fontWeight: activeTab === tab ? '800' : '600'
                  }]}>
                    {tab === 'active' ? 'Đang áp dụng' : 'Bản nháp / Đã đóng'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingBottom: 40 }}>
              {isLoading ? (
                <SGSkeletonLoader type="card" count={4} isDark={isDark} />
              ) : filteredPolicies.length === 0 ? (
                <SGEmptyState
                  icon={<FileText size={48} color={colors.textTertiary} strokeWidth={1} />}
                  title={activeTab === 'active' ? 'Chưa có chính sách nào' : 'Không có bản nháp'}
                  subtitle={activeTab === 'active' ? 'Tạo chính sách bán hàng đầu tiên để áp dụng cho dự án' : 'Các chính sách nháp sẽ hiển thị ở đây'}
                  actionLabel={activeTab === 'active' ? 'Thêm Chính sách' : undefined}
                  onAction={activeTab === 'active' ? () => {} : undefined}
                  style={{ minHeight: 250 }}
                />
              ) : (
                filteredPolicies.map((policy: any, idx: number) => (
                  <Animated.View key={policy.id} entering={FadeInDown.delay(idx * 80).springify().damping(20)}>
                    <TouchableOpacity style={[styles.policyCard, {
                      backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.9)',
                      borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                      borderLeftColor: policy.color, borderLeftWidth: 4,
                      ...(Platform.OS === 'web' && { boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.03)' } as any),
                    }]}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <View style={{ flex: 1 }}>
                          <Text style={[typography.h4, { color: colors.text, marginBottom: 10, fontWeight: '800' }]}>{policy.name}</Text>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <CalendarClock size={14} color={colors.textTertiary} style={{ marginRight: 6 }} />
                              <Text style={[typography.micro, { color: colors.textSecondary, fontWeight: '500' }]}>{policy.startDate} - {policy.endDate}</Text>
                            </View>
                            <View style={{ backgroundColor: `${policy.color}15`, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: `${policy.color}30` }}>
                              <Text style={[typography.micro, { color: policy.color, fontWeight: '800', fontSize: 10 }]}>{policy.status === 'ACTIVE' ? 'HIỆU LỰC' : 'NHÁP'}</Text>
                            </View>
                          </View>
                        </View>
                        <ChevronRight size={20} color={colors.textTertiary} />
                      </View>

                      <View style={{ marginTop: 18, paddingTop: 18, borderTopWidth: 1, borderTopColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', gap: 10 }}>
                        {policy.rules.map((r: string, i: number) => (
                          <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <CheckCircle2 size={14} color={policy.color} style={{ marginRight: 10 }} />
                            <Text style={[typography.body, { color: colors.textSecondary, fontSize: 14 }]}>{r}</Text>
                          </View>
                        ))}
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                ))
              )}
            </ScrollView>
          </SGCard>
        </Animated.View>

        {/* Right Column: Info Panel */}
        {isDesktop && (
          <Animated.View entering={FadeInDown.delay(300).springify().damping(20)} style={{ flex: 1 }}>
            <SGCard style={[styles.sectionCard, sgds.sectionBase(theme), { flex: 1, justifyContent: 'center', alignItems: 'center' }] as any}>
              <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: isDark ? 'rgba(16,185,129,0.08)' : '#ecfdf5', justifyContent: 'center', alignItems: 'center', marginBottom: 24 }}>
                <Percent size={36} color={colors.success} />
              </View>
              <Text style={[typography.h3, { color: colors.text, marginBottom: 12, textAlign: 'center', fontWeight: '800' }]}>Chính sách Bán hàng</Text>
              <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center', paddingHorizontal: 24, lineHeight: 22 }]}>
                Chọn một chính sách bên trái để xem chi tiết các điều khoản, tiến độ thanh toán và đối tượng áp dụng.
              </Text>
              <SGButton title="Xem tài liệu hướng dẫn" variant="outline" style={{ marginTop: 32, borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#cbd5e1' }} />
            </SGCard>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 },
  policyCard: { padding: 22, borderRadius: 16, borderWidth: 1 },
  sectionCard: { padding: 28, borderRadius: 20, flex: 1 },
});
