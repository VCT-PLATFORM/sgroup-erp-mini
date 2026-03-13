import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform,
} from 'react-native';
import { useTheme, typography } from '../../shared/theme/theme';
import { useThemeStore } from '../../shared/theme/themeStore';
import { useAuthStore } from '../auth/store/authStore';
import {
  LayoutDashboard, Megaphone, Users2, Target, BarChart3, FileText,
  ChevronLeft, ChevronRight, LogOut, Plus, Wallet, CalendarDays,
  UserCircle, TrendingUp, Zap, BookOpen, Settings, PieChart,
  Radio, Mail, Share2, Globe, Layers,
} from 'lucide-react-native';
import { SGThemeToggle } from '../../shared/ui/components/SGThemeToggle';
import { LinearGradient } from 'expo-linear-gradient';

export type MarketingRole = 'marketing' | 'marketing_manager' | 'marketing_director' | 'ceo' | 'admin';

export interface MarketingSidebarItem {
  key: string;
  label: string;
  icon: any;
  section: 'dashboard' | 'campaign' | 'leads' | 'content' | 'finance' | 'reports' | 'settings';
  minRole: MarketingRole[];
}

const ALL_ROLES: MarketingRole[] = ['marketing', 'marketing_manager', 'marketing_director', 'ceo', 'admin'];
const MANAGER_UP: MarketingRole[] = ['marketing_manager', 'marketing_director', 'ceo', 'admin'];

const SIDEBAR_ITEMS: MarketingSidebarItem[] = [
  // Dashboard
  { key: 'MKT_DASHBOARD',        label: 'Tổng quan',            icon: LayoutDashboard, section: 'dashboard', minRole: ALL_ROLES },

  // CHIẾN DỊCH
  { key: 'MKT_CAMPAIGNS',        label: 'Quản lý Chiến dịch',   icon: Megaphone,       section: 'campaign',  minRole: ALL_ROLES },
  { key: 'MKT_CHANNELS',         label: 'Hiệu suất Kênh',       icon: Radio,           section: 'campaign',  minRole: ALL_ROLES },

  // LEADS & CRM
  { key: 'MKT_LEADS',            label: 'MQL & Leads',           icon: Users2,          section: 'leads',     minRole: ALL_ROLES },

  // NỘI DUNG
  { key: 'MKT_CONTENT',          label: 'Lịch Nội dung',         icon: CalendarDays,    section: 'content',   minRole: ALL_ROLES },

  // TÀI CHÍNH
  { key: 'MKT_BUDGET',           label: 'Ngân sách & Chi phí',   icon: Wallet,          section: 'finance',   minRole: ALL_ROLES },

  // BÁO CÁO
  { key: 'MKT_REPORTS',          label: 'Báo cáo & Phân tích',   icon: BarChart3,       section: 'reports',   minRole: ALL_ROLES },
  { key: 'MKT_PLANNING',         label: 'Kế hoạch Marketing',    icon: Target,          section: 'reports',   minRole: MANAGER_UP },
];

interface Props {
  activeKey: string;
  onSelect: (item: MarketingSidebarItem) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  userRole?: MarketingRole;
}

const ACCENT = '#D97706';
const ACCENT_LIGHT = '#F59E0B';

export function MarketingSidebar({ activeKey, onSelect, collapsed, onToggleCollapse, userRole = 'marketing' }: Props) {
  const colors = useTheme();
  const { isDark } = useThemeStore();
  const { logout } = useAuthStore();

  const visibleItems = SIDEBAR_ITEMS.filter(item => item.minRole.includes(userRole));
  const sections = [
    { key: 'dashboard', label: '' },
    { key: 'campaign',  label: 'CHIẾN DỊCH' },
    { key: 'leads',     label: 'LEADS & CRM' },
    { key: 'content',   label: 'NỘI DUNG' },
    { key: 'finance',   label: 'TÀI CHÍNH' },
    { key: 'reports',   label: 'BÁO CÁO' },
    { key: 'settings',  label: 'CÀI ĐẶT' },
  ];

  const renderItem = (item: MarketingSidebarItem) => {
    const isActive = activeKey === item.key;
    const IconComp = item.icon;
    return (
      <TouchableOpacity
        key={item.key}
        onPress={() => onSelect(item)}
        style={[styles.menuItem, {
          backgroundColor: isActive ? (isDark ? 'rgba(217,119,6,0.15)' : '#fffbeb') : 'transparent',
          borderRadius: 16, marginHorizontal: 12, marginBottom: 4, paddingVertical: 12, paddingHorizontal: 12,
          ...(isActive && !isDark && Platform.OS === 'web' ? { boxShadow: '0 4px 14px rgba(217,119,6,0.12)' } : {}),
        } as any]}
      >
        <View style={{ width: 24, alignItems: 'center', justifyContent: 'center' }}>
          <IconComp size={20} color={isActive ? ACCENT : (isDark ? '#94A3B8' : '#64748b')} strokeWidth={isActive ? 2.5 : 2} />
        </View>
        {!collapsed && (
          <Text style={{
            fontSize: 14, fontWeight: isActive ? '800' : '600',
            fontFamily: "'Plus Jakarta Sans', 'Inter', 'Segoe UI', system-ui, sans-serif",
            color: isActive ? ACCENT : (isDark ? '#E2E8F0' : '#475569'),
            marginLeft: 14, flex: 1, letterSpacing: 0.2
          }} numberOfLines={1}>
            {item.label}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.sidebar, {
      width: collapsed ? 80 : 260,
      backgroundColor: isDark ? 'rgba(15,20,32,0.8)' : 'rgba(255,255,255,0.9)',
      borderRightColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
      ...(Platform.OS === 'web' ? { backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' } : {}),
    } as any]}>
      {/* Header — Premium Brand */}
      <View style={[styles.header, {
        borderBottomColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
      }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: collapsed ? 0 : 12, flex: collapsed ? 0 : 1 }}>
          <LinearGradient
            colors={isDark ? ['#F59E0B', '#D97706'] : ['#D97706', '#B45309']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 38, height: 38, borderRadius: 12,
              justifyContent: 'center', alignItems: 'center',
              ...(Platform.OS === 'web' ? {
                boxShadow: isDark
                  ? '0 4px 16px rgba(245,158,11,0.3), 0 0px 8px rgba(217,119,6,0.2)'
                  : '0 4px 14px rgba(217,119,6,0.25)',
              } : {
                shadowColor: ACCENT, shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 6,
              }),
            } as any}
          >
            <Text style={{
              fontSize: 15, fontWeight: '900', color: '#fff',
              letterSpacing: 1.5,
              fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
            }}>SG</Text>
          </LinearGradient>
          {!collapsed && (
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 14, fontWeight: '800', color: isDark ? '#fff' : '#0f172a',
                letterSpacing: 0.8,
                fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
              }}>MARKETING</Text>
              <Text style={{
                fontSize: 10, fontWeight: '600',
                color: isDark ? ACCENT_LIGHT : ACCENT,
                letterSpacing: 2, marginTop: 1,
                fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
              }}>MKT MODULE</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          onPress={onToggleCollapse}
          style={[styles.collapseBtn, {
            backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          }]}
        >
          {collapsed ? <ChevronRight size={14} color={isDark ? '#94A3B8' : '#64748b'} strokeWidth={2.5} /> : <ChevronLeft size={14} color={isDark ? '#94A3B8' : '#64748b'} strokeWidth={2.5} />}
        </TouchableOpacity>
      </View>

      {/* Subtle gradient glow line under header */}
      {Platform.OS === 'web' && (
        <View style={{
          height: 1,
          background: isDark
            ? 'linear-gradient(90deg, transparent, rgba(245,158,11,0.4), rgba(217,119,6,0.3), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(217,119,6,0.2), rgba(245,158,11,0.15), transparent)',
        } as any} />
      )}

      {/* Quick Action Button */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
        <TouchableOpacity style={{
          height: 48, borderRadius: 14, backgroundColor: ACCENT,
          flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
          shadowColor: ACCENT, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 4
        }}>
          <Plus size={20} color="#fff" strokeWidth={3} />
          {!collapsed && <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff' }}>Tạo Chiến Dịch</Text>}
        </TouchableOpacity>
      </View>

      {/* Menu */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 8 }}>
        {sections.map(sec => {
          const sectionItems = visibleItems.filter(i => i.section === sec.key);
          if (sectionItems.length === 0) return null;
          return (
            <View key={sec.key}>
              {!collapsed && sec.label !== '' && (
                <Text style={styles.sectionLabel}>{sec.label}</Text>
              )}
              {sectionItems.map(renderItem)}
              <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]} />
            </View>
          );
        })}
      </ScrollView>

      {/* User Profile & Footer Area */}
      <View style={{ padding: 12, borderTopWidth: 1, borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}>
        <TouchableOpacity
          onPress={() => onSelect({ key: 'MKT_PROFILE', label: 'Hồ sơ Của Tôi', icon: UserCircle, section: 'dashboard', minRole: ALL_ROLES })}
          style={{ flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 14, backgroundColor: activeKey === 'MKT_PROFILE' ? (isDark ? 'rgba(217,119,6,0.15)' : '#fffbeb') : 'transparent' }}
        >
          <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9', alignItems: 'center', justifyContent: 'center' }}>
            <UserCircle size={20} color={isDark ? '#fff' : '#475569'} />
          </View>
          {!collapsed && (
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: '800', color: isDark ? '#fff' : '#0f172a' }}>Hồ Sơ Của Tôi</Text>
              <Text style={{ fontSize: 11, fontWeight: '600', color: '#64748b', textTransform: 'capitalize' }}>{userRole.replace('_', ' ')}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={[styles.footer, { borderTopWidth: 0, paddingVertical: 12, flexDirection: collapsed ? 'column' : 'row', justifyContent: collapsed ? 'center' : 'space-between' }]}>
        <SGThemeToggle size="sm" />
        <TouchableOpacity onPress={logout} style={[styles.logoutBtn, { backgroundColor: isDark ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.05)', marginTop: collapsed ? 12 : 0 }]}>
          <LogOut size={16} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: { borderRightWidth: 1, height: '100%' },
  header: {
    height: 80, flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.02)',
  },
  collapseBtn: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 11, fontWeight: '800', letterSpacing: 1.8, textTransform: 'uppercase',
    color: '#94A3B8', paddingHorizontal: 24, marginTop: 16, marginBottom: 10,
    fontFamily: "'Plus Jakarta Sans', 'Inter', 'Segoe UI', system-ui, sans-serif",
  },
  divider: { height: 1, marginHorizontal: 24, marginVertical: 6 },
  footer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 16, paddingHorizontal: 20, borderTopWidth: 1, gap: 8,
  },
  logoutBtn: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
});
