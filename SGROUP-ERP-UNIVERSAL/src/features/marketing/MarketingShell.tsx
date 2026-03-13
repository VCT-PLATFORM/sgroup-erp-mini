/**
 * SGROUP ERP — Marketing Module Shell
 * Main app shell with Sidebar + TopBar + Content Area
 */
import React, { useState, useMemo } from 'react';
import { View, ScrollView, Text, StyleSheet, Platform } from 'react-native';
import { MarketingSidebar, MarketingSidebarItem, MarketingRole } from './MarketingSidebar';
import { SGTopBar } from '../../shared/ui';
import { typography } from '../../shared/theme/theme';
import { useTheme } from '../../shared/theme/theme';
import { useThemeStore } from '../../shared/theme/themeStore';
import { useAuthStore } from '../auth/store/authStore';
import { MarketingErrorBoundary } from './components/MarketingErrorBoundary';
import { useMarketingRoute } from './hooks/useMarketingRoute';

// Screens
import { MarketingDashboard } from './screens/MarketingDashboard';
import { CampaignManager } from './screens/CampaignManager';
import { LeadManagement } from './screens/LeadManagement';
import { BudgetTracker } from './screens/BudgetTracker';
import { ContentCalendar } from './screens/ContentCalendar';
import { ChannelPerformance } from './screens/ChannelPerformance';
import { MarketingReports } from './screens/MarketingReports';
import { MarketingPlanning } from './screens/MarketingPlanning';

const KEY_TO_COMPONENT: Record<string, React.ComponentType<any>> = {
  MKT_DASHBOARD: MarketingDashboard,
  MKT_CAMPAIGNS: CampaignManager,
  MKT_CHANNELS: ChannelPerformance,
  MKT_LEADS: LeadManagement,
  MKT_CONTENT: ContentCalendar,
  MKT_BUDGET: BudgetTracker,
  MKT_REPORTS: MarketingReports,
  MKT_PLANNING: MarketingPlanning,
};

export function MarketingShell() {
  const validKeys = useMemo(() => Object.keys(KEY_TO_COMPONENT), []);
  const { activeKey, navigate } = useMarketingRoute(validKeys);
  const [activeLabel, setActiveLabel] = useState('Tổng quan');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const colors = useTheme();
  const { isDark } = useThemeStore();
  const { user } = useAuthStore();

  const userRole: MarketingRole = (user?.role === 'admin' ? 'admin' : 'marketing');

  const handleSelect = (item: MarketingSidebarItem) => {
    navigate(item.key);
    setActiveLabel(item.label);
    setActiveSection(item.section);
  };

  const ContentComponent = KEY_TO_COMPONENT[activeKey];

  const sectionLabels: Record<string, string> = {
    dashboard: 'TỔNG QUAN',
    campaign: 'CHIẾN DỊCH',
    leads: 'LEADS & CRM',
    content: 'NỘI DUNG',
    finance: 'TÀI CHÍNH',
    reports: 'BÁO CÁO',
    settings: 'CÀI ĐẶT',
  };

  const breadcrumb = (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={[typography.micro, { color: colors.textTertiary, opacity: 0.8 }]}>
        {sectionLabels[activeSection] || 'MARKETING'}
      </Text>
      <View style={[styles.breadcrumbDot, { backgroundColor: '#D97706' }]} />
      <Text style={[typography.micro, { color: '#D97706', fontWeight: '800' }]}>
        {activeLabel.toUpperCase()}
      </Text>
    </View>
  );

  return (
    <View style={[styles.shell, { backgroundColor: isDark ? '#05070A' : '#F8FAFC' }]}>
      {/* Aurora backdrop */}
      {Platform.OS === 'web' && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <View style={[styles.aurora, {
            top: '-10%', left: '-5%', width: 1000, height: 1000,
            backgroundColor: isDark ? 'rgba(217,119,6,0.08)' : 'rgba(217,119,6,0.04)',
            filter: 'blur(100px)',
          } as any]} />
          <View style={[styles.aurora, {
            bottom: '-15%', right: '-8%', width: 900, height: 900,
            backgroundColor: isDark ? 'rgba(245,158,11,0.06)' : 'rgba(245,158,11,0.03)',
            filter: 'blur(120px)',
          } as any]} />
        </View>
      )}

      {/* Sidebar */}
      <View style={{ zIndex: 1000 }}>
        <MarketingSidebar
          activeKey={activeKey}
          onSelect={handleSelect}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(c => !c)}
          userRole={userRole}
        />
      </View>

      {/* Main Area */}
      <View style={styles.mainArea}>
        <View style={styles.topBarWrapper}>
          <SGTopBar
            title={activeLabel}
            breadcrumb={breadcrumb}
            userName={user?.name || 'User'}
            userRole={userRole.replace(/_/g, ' ').toUpperCase()}
          />
        </View>
        <View style={styles.content}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <MarketingErrorBoundary key={activeKey}>
            {ContentComponent ? (
              <ContentComponent userRole={userRole} />
            ) : (
              <View style={styles.placeholder}>
                <Text style={{ fontSize: 60, marginBottom: 24 }}>📣</Text>
                <Text style={[typography.h3, { color: colors.text, marginBottom: 8 }]}>Module Đang Phát Triển</Text>
                <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center', maxWidth: 400 }]}>
                  Tính năng này đang được phát triển.
                </Text>
              </View>
            )}
            </MarketingErrorBoundary>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, flexDirection: 'row', height: Platform.OS === 'web' ? '100vh' as any : '100%' },
  mainArea: { flex: 1, position: 'relative', zIndex: 1 },
  aurora: { position: 'absolute', pointerEvents: 'none', borderRadius: 999 },
  topBarWrapper: {
    zIndex: 100,
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' } : {}),
  } as any,
  breadcrumbDot: { width: 4, height: 4, borderRadius: 2, marginHorizontal: 8 },
  content: { flex: 1, zIndex: 1 },
  scrollContent: { paddingBottom: 40 },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 100 },
});
