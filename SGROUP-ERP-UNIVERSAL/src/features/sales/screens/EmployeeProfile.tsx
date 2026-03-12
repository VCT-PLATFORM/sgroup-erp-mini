import React from 'react';
import { View, Text, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { UserCircle, Mail, Phone, MapPin, Award, Star, TrendingUp, ShieldCheck, Briefcase } from 'lucide-react-native';
import { SGButton, SGPlanningSectionTitle } from '../../../shared/ui/components';
import { useAuthStore } from '../../auth/store/authStore';

export function EmployeeProfile() {
  const { theme, isDark } = useAppTheme();
  const cText = theme.colors.textPrimary;
  const cSub = theme.colors.textSecondary;
  const { user } = useAuthStore();

  const cardStyle: any = {
    backgroundColor: isDark ? 'rgba(20,24,35,0.45)' : '#fff', borderRadius: 24, padding: 32,
    borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(32px)', boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.06)' } : {}),
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? theme.colors.background : theme.colors.backgroundAlt }}>
      <ScrollView contentContainerStyle={{ padding: 32, gap: 24, paddingBottom: 120 }}>
        
        {/* Header Personal Card */}
        <View style={[cardStyle, { flexDirection: 'row', alignItems: 'center', gap: 32 }]}>
          <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: isDark ? 'rgba(59,130,246,0.1)' : '#eff6ff', alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20 }}>
            <Text style={{ fontSize: 48, fontWeight: '900', color: '#3b82f6' }}>{user?.name?.charAt(0) || 'U'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <Text style={{ fontSize: 32, fontWeight: '900', color: cText, letterSpacing: -0.5 }}>{user?.name || 'Nguyễn Văn A'}</Text>
              <View style={{ backgroundColor: '#f0fdf4', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: '#16a34a20' }}>
                 <Text style={{ fontSize: 11, fontWeight: '800', color: '#16a34a', textTransform: 'uppercase' }}>ĐANG LÀM VIỆC</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 24, marginTop: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Briefcase size={16} color={cSub} />
                <Text style={{ fontSize: 14, fontWeight: '600', color: cSub }}>Chuyên viên Kinh doanh (Mã: SG2023-456)</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ShieldCheck size={16} color={cSub} />
                <Text style={{ fontSize: 14, fontWeight: '600', color: cSub }}>Sàn Giao Dịch BĐS Miền Nam</Text>
              </View>
            </View>
            <View style={{ marginTop: 24, flexDirection: 'row', gap: 12 }}>
               <SGButton title="Cập nhật thông tin" variant="primary" style={{ paddingHorizontal: 24, height: 42, borderRadius: 12 }} />
               <SGButton title="Đổi mật khẩu" variant="outline" style={{ paddingHorizontal: 24, height: 42, borderRadius: 12 }} />
            </View>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 24, flexWrap: 'wrap' }}>
          
          {/* Contact Details */}
          <View style={[cardStyle, { flex: 1, minWidth: 350 }]}>
            <SGPlanningSectionTitle 
              icon={UserCircle}
              title="Thông Tin Liên Hệ & Nhân Sự"
              accent="#8b5cf6"
              badgeText="HR RECORD"
              style={{ marginBottom: 28 }}
            />
            <View style={{ gap: 20 }}>
              {[
                { icon: Mail, label: 'Email công ty', value: 'a.nguyen@sgroup.vn' },
                { icon: Phone, label: 'Số điện thoại', value: '0901 234 567' },
                { icon: MapPin, label: 'Văn phòng', value: 'Tòa nhà SGROUP, Q. Bình Thạnh, TP.HCM' },
                { icon: ShieldCheck, label: 'Mã số thuế', value: '0312678910 (Trực thuộc cty)' },
                { icon: Award, label: 'Ngày gia nhập', value: '15/08/2023 (Thâm niên: 2.5 năm)' },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', alignItems: 'center', justifyContent: 'center' }}>
                         <Icon size={16} color="#64748b" />
                      </View>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: '#64748b' }}>{item.label}</Text>
                    </View>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: cText }}>{item.value}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Performance & Ranking Snapshot */}
          <View style={[cardStyle, { flex: 1, minWidth: 350 }]}>
            <SGPlanningSectionTitle 
              icon={TrendingUp}
              title="Hồ Sơ Năng Lực"
              accent="#ec4899"
              badgeText="PERFORMANCE"
              style={{ marginBottom: 28 }}
            />
            
            <View style={{ padding: 24, borderRadius: 16, backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#fdf4ff', borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#fce7f3', marginBottom: 20, alignItems: 'center' }}>
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#fce7f3', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                 <Star size={32} color="#ec4899" fill="#ec4899" />
              </View>
              <Text style={{ fontSize: 13, fontWeight: '800', color: '#ec4899', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>TOP 5 SALE XUẤT SẮC THÁNG</Text>
              <Text style={{ fontSize: 24, fontWeight: '900', color: cText }}>Hạng Vàng (Gold)</Text>
            </View>

            <View style={{ gap: 16 }}>
               {[
                 { label: 'Doanh số tích luỹ (YTD)', value: '15.5', unit: 'Tỷ', pct: 85 },
                 { label: 'Tỉ lệ chốt Deal (Win Rate)', value: '14.2', unit: '%', pct: 60 },
                 { label: 'Điểm CSAT (Khách hàng)', value: '4.8', unit: '/ 5', pct: 96 }
               ].map((stat, i) => (
                 <View key={i}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: cSub }}>{stat.label}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
                         <Text style={{ fontSize: 16, fontWeight: '800', color: cText }}>{stat.value}</Text>
                         <Text style={{ fontSize: 12, fontWeight: '700', color: '#94a3b8' }}>{stat.unit}</Text>
                      </View>
                    </View>
                    <View style={{ height: 6, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9', borderRadius: 3 }}>
                       <View style={{ width: `${stat.pct}%`, height: '100%', backgroundColor: '#ec4899', borderRadius: 3 }} />
                    </View>
                 </View>
               ))}
            </View>
          </View>
          
        </View>

      </ScrollView>
    </View>
  );
}
