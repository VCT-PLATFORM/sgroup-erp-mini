import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, User, Mail, Phone, MapPin, Briefcase, Calendar, ShieldCheck, Award } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { sgds, typography } from '../../../shared/theme/theme';
import { useResponsive } from '../../../shared/hooks/useResponsive';
import { useAuthStore } from '../../auth/store/authStore';
import { SGPageContainer, SGPageHeader, SGSection, SGTag, SGStatCard, SGDataGrid } from '../../../shared/ui';

export function EmployeeProfileScreen() {
  const navigation = useNavigation<any>();
  const { theme, colors, isDark } = useAppTheme();
  const { isMobile } = useResponsive();
  const user = useAuthStore((s) => s.user);

  const primaryColor = '#DB2777'; // HR Accent Color

  return (
    <View style={[styles.root, { backgroundColor: isDark ? theme.colors.background : theme.colors.backgroundAlt }]}>
      <Animated.View
        entering={FadeInDown.duration(400)}
        style={[
          styles.topBar,
          {
            borderBottomColor: colors.border,
            backgroundColor: isDark ? 'rgba(12,18,29,0.86)' : 'rgba(255,255,255,0.88)',
          },
          Platform.OS === 'web' ? ({ ...sgds.glass } as any) : null,
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[
            styles.backButton,
            { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)' },
            Platform.OS === 'web' ? (sgds.cursor as any) : null,
          ]}
        >
          <ArrowLeft size={16} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.topBarTitleWrap}>
          <Text style={[typography.h4, { color: colors.text }]}>Hồ Sơ Nhân Sự</Text>
          <Text style={[typography.caption, { color: colors.textTertiary }]}>Thông tin chi tiết và hiệu suất làm việc</Text>
        </View>
      </Animated.View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
        <SGPageContainer padding={isMobile ? 16 : 24} maxWidth={1000}>
          <View style={{ gap: isMobile ? 16 : 24 }}>
            <Animated.View
              entering={FadeInDown.delay(100).duration(400)}
              style={[
                styles.profileHeaderCard,
                {
                  backgroundColor: isDark ? 'rgba(28, 36, 49, 0.6)' : '#FFFFFF',
                  borderColor: colors.borderLight,
                },
              ]}
            >
              <View style={[styles.avatarContainer, { backgroundColor: `${primaryColor}20` }]}>
                <User size={48} color={primaryColor} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={[typography.h2, { color: colors.text, marginBottom: 4 }]}>
                  {user?.name || 'Nguyễn Văn A'}
                </Text>
                <Text style={[typography.body, { color: primaryColor, fontWeight: '600', marginBottom: 12 }]}>
                  {user?.role || 'Chuyên Viên Nhân Sự (HR)'}
                </Text>

                <View style={styles.tagsContainer}>
                  <SGTag label="Đang làm việc" variant="solid" color={colors.success} size="md" />
                  <SGTag label="S-Group Hội Sở" variant="soft" color={colors.info} size="md" />
                  <SGTag label="Full-time" variant="soft" color={colors.textSecondary} size="md" />
                </View>
              </View>
            </Animated.View>

            <View style={[styles.contentRow, { flexDirection: isMobile ? 'column' : 'row' }]}>
              <Animated.View entering={FadeInDown.delay(200).duration(400)} style={{ flex: 1, gap: 16 }}>
                <SGSection title="Thông tin liên hệ" titleIcon={<User size={18} color={primaryColor} />} titleColor={primaryColor}>
                  <View style={styles.detailList}>
                    <DetailItem icon={Mail} label="Email" value={user?.email || 'nguyenvana@sgroup.vn'} colors={colors} />
                    <DetailItem icon={Phone} label="Điện thoại" value="+84 987 654 321" colors={colors} />
                    <DetailItem icon={MapPin} label="Địa chỉ" value="Tòa nhà S-Group, Quận 1, TP.HCM" colors={colors} />
                  </View>
                </SGSection>

                <SGSection title="Thông tin công việc" titleIcon={<Briefcase size={18} color={primaryColor} />} titleColor={primaryColor}>
                  <View style={styles.detailList}>
                    <DetailItem icon={Briefcase} label="Phòng ban" value="Phòng Nhân Sự (HR)" colors={colors} />
                    <DetailItem icon={Calendar} label="Ngày gia nhập" value="15/03/2023" colors={colors} />
                    <DetailItem icon={ShieldCheck} label="Mã nhân viên" value="SG-HR-0042" colors={colors} />
                  </View>
                </SGSection>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(300).duration(400)} style={{ flex: 1, gap: 16 }}>
                <SGSection title="Tổng quan hiệu suất" titleIcon={<Award size={18} color={colors.warning} />} titleColor={colors.warning}>
                  <SGDataGrid gap={12} minItemWidth={140}>
                    <SGStatCard label="Nhiệm vụ hoàn thành" value="142" unit="task" trend={12} icon={<Briefcase size={16} color={colors.success} />} iconColor={colors.success} />
                    <SGStatCard label="Đánh giá KPI" value="95%" trend={5} icon={<Award size={16} color={colors.warning} />} iconColor={colors.warning} />
                    <SGStatCard label="Ngày phép còn lại" value="11" unit="ngày" icon={<Calendar size={16} color={colors.info} />} iconColor={colors.info} />
                    <SGStatCard label="Giờ đào tạo" value="48" unit="giờ" gradient icon={<User size={16} color={primaryColor} />} iconColor={primaryColor} />
                  </SGDataGrid>
                </SGSection>
              </Animated.View>
            </View>
          </View>
        </SGPageContainer>
      </ScrollView>
    </View>
  );
}

const DetailItem = ({ icon: Icon, label, value, colors }: any) => (
  <View style={styles.detailItem}>
    <View style={[styles.detailIcon, { backgroundColor: colors.backgroundAlt }]}>
      <Icon size={16} color={colors.textSecondary} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={[typography.caption, { color: colors.textTertiary, marginBottom: 2 }]}>{label}</Text>
      <Text style={[typography.body, { color: colors.text }]}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitleWrap: { flex: 1, gap: 2 },
  profileHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    gap: 24,
    // Add shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  contentRow: {
    gap: 16,
  },
  detailList: {
    gap: 16,
    paddingVertical: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
