/**
 * SystemSettingsScreen — Premium admin system configuration
 * Uses SGPageHeader, SGSection, SGSkeleton, SGInput, SGChip, SGButton, SGSwitch, SGConfirmDialog
 * Token colors, typography, animations
 * NEW: Seed defaults button, sensitive setting confirmation, toast notifications
 */
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform, Switch } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Settings, Save, RotateCcw, Globe, Mail, ShieldCheck, Bell, Check, Database, AlertTriangle,
} from 'lucide-react-native';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { typography, sgds, radius, spacing } from '../../../shared/theme/theme';
import { SGPageHeader } from '../../../shared/ui/components/SGPageHeader';
import { SGSection } from '../../../shared/ui/components/SGSection';
import { SGSkeleton } from '../../../shared/ui/components/SGSkeleton';
import { SGChip } from '../../../shared/ui/components/SGChip';
import { SGInput } from '../../../shared/ui/components/SGInput';
import { SGButton } from '../../../shared/ui/components/SGButton';
import { SGConfirmDialog } from '../../../shared/ui/components/SGConfirmDialog';
import { useSystemSettings, useUpdateSetting, useSeedSettings } from '../hooks/useAdmin';
import { showToast } from '../utils/adminUtils';

const SETTING_GROUPS = [
  { key: 'general', label: 'Cài đặt chung', icon: Globe, color: '#6366f1' },
  { key: 'email', label: 'Email', icon: Mail, color: '#3b82f6' },
  { key: 'security', label: 'Bảo mật', icon: ShieldCheck, color: '#ef4444' },
  { key: 'notification', label: 'Thông báo', icon: Bell, color: '#f59e0b' },
];

// Keys that require extra confirmation before changing
const SENSITIVE_KEYS = ['maintenance_mode', 'two_factor_enabled', 'session_timeout', 'max_login_attempts', 'account_lock_minutes'];

const DEFAULT_SETTINGS: Record<string, Array<{ key: string; label: string; value: string; valueType: string; description: string; group: string }>> = {
  general: [
    { key: 'app_name', label: 'Tên ứng dụng', value: 'SGROUP ERP', valueType: 'string', description: 'Tên hiển thị trên hệ thống', group: 'general' },
    { key: 'app_timezone', label: 'Múi giờ', value: 'Asia/Ho_Chi_Minh', valueType: 'string', description: 'Múi giờ hệ thống', group: 'general' },
    { key: 'app_language', label: 'Ngôn ngữ', value: 'vi', valueType: 'string', description: 'Ngôn ngữ mặc định', group: 'general' },
    { key: 'maintenance_mode', label: 'Chế độ bảo trì', value: 'false', valueType: 'boolean', description: 'Bật/tắt chế độ bảo trì hệ thống', group: 'general' },
  ],
  email: [
    { key: 'smtp_host', label: 'SMTP Host', value: 'smtp.gmail.com', valueType: 'string', description: 'Địa chỉ máy chủ SMTP', group: 'email' },
    { key: 'smtp_port', label: 'SMTP Port', value: '587', valueType: 'number', description: 'Cổng SMTP', group: 'email' },
    { key: 'email_from', label: 'Email gửi', value: 'noreply@sgroup.vn', valueType: 'string', description: 'Email mặc định gửi thông báo', group: 'email' },
    { key: 'email_enabled', label: 'Kích hoạt email', value: 'true', valueType: 'boolean', description: 'Bật/tắt gửi email thông báo', group: 'email' },
  ],
  security: [
    { key: 'session_timeout', label: 'Session timeout (phút)', value: '60', valueType: 'number', description: 'Thời gian hết hạn phiên đăng nhập', group: 'security' },
    { key: 'max_login_attempts', label: 'Số lần đăng nhập tối đa', value: '5', valueType: 'number', description: 'Số lần thử đăng nhập trước khi khóa', group: 'security' },
    { key: 'account_lock_minutes', label: 'Thời gian khóa (phút)', value: '30', valueType: 'number', description: 'Thời gian tự động mở khóa sau khi bị lock', group: 'security' },
    { key: 'two_factor_enabled', label: 'Xác thực 2 bước', value: 'false', valueType: 'boolean', description: 'Bật/tắt xác thực 2 yếu tố', group: 'security' },
    { key: 'password_min_length', label: 'Độ dài mật khẩu tối thiểu', value: '8', valueType: 'number', description: 'Độ dài tối thiểu khi đặt mật khẩu', group: 'security' },
  ],
  notification: [
    { key: 'push_enabled', label: 'Push notification', value: 'true', valueType: 'boolean', description: 'Bật/tắt notification đẩy', group: 'notification' },
    { key: 'notification_email', label: 'Gửi email thông báo', value: 'true', valueType: 'boolean', description: 'Gửi kèm email khi có notification', group: 'notification' },
    { key: 'digest_frequency', label: 'Tần suất tổng hợp', value: 'daily', valueType: 'string', description: 'Tần suất gửi email tổng hợp: daily, weekly', group: 'notification' },
  ],
};

export function SystemSettingsScreen() {
  const { colors } = useAppTheme();

  const [activeGroup, setActiveGroup] = useState('general');
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set());

  // Sensitive setting confirmation
  const [sensitiveConfirm, setSensitiveConfirm] = useState<{ key: string; value: string; label: string } | null>(null);

  const { data: apiSettings, isLoading } = useSystemSettings();
  const updateSetting = useUpdateSetting();
  const seedSettings = useSeedSettings();

  const settings = (() => {
    const defaults = DEFAULT_SETTINGS[activeGroup] || [];
    if (!apiSettings || !Array.isArray(apiSettings)) return defaults;
    const apiMap = new Map(apiSettings.filter((s: any) => s.group === activeGroup).map((s: any) => [s.key, s]));
    return defaults.map(d => {
      const apiSetting = apiMap.get(d.key) as any;
      return apiSetting ? { ...d, value: apiSetting.value } : d;
    });
  })();

  useEffect(() => {
    const vals: Record<string, string> = {};
    settings.forEach(s => { vals[s.key] = s.value; });
    setEditValues(vals);
    setSavedKeys(new Set());
  }, [activeGroup, apiSettings]);

  const handleSave = async (key: string) => {
    // Check if this is a sensitive setting
    if (SENSITIVE_KEYS.includes(key)) {
      const setting = settings.find(s => s.key === key);
      setSensitiveConfirm({ key, value: editValues[key] || '', label: setting?.label || key });
      return;
    }
    await doSave(key);
  };

  const doSave = async (key: string) => {
    try {
      await updateSetting.mutateAsync({ key, value: editValues[key] || '' });
      setSavedKeys(prev => new Set(prev).add(key));
      showToast(`Đã lưu "${key}" thành công`, 'success');
      setTimeout(() => setSavedKeys(prev => { const n = new Set(prev); n.delete(key); return n; }), 2000);
    } catch (e: any) {
      showToast(e?.response?.data?.message || e?.message || 'Lỗi khi lưu', 'error');
    }
  };

  const handleSensitiveConfirm = async () => {
    if (!sensitiveConfirm) return;
    await doSave(sensitiveConfirm.key);
    setSensitiveConfirm(null);
  };

  const handleReset = (key: string, original: string) => {
    setEditValues(prev => ({ ...prev, [key]: original }));
  };

  const handleToggleBoolean = async (key: string, newValue: boolean) => {
    const val = newValue ? 'true' : 'false';
    setEditValues(prev => ({ ...prev, [key]: val }));

    if (SENSITIVE_KEYS.includes(key)) {
      const setting = settings.find(s => s.key === key);
      setSensitiveConfirm({ key, value: val, label: setting?.label || key });
    } else {
      try {
        await updateSetting.mutateAsync({ key, value: val });
        showToast(`Đã ${newValue ? 'bật' : 'tắt'} "${key}"`, 'success');
      } catch (e: any) {
        showToast(e?.response?.data?.message || e?.message || 'Lỗi', 'error');
      }
    }
  };

  const handleSeedDefaults = async () => {
    try {
      const result = await seedSettings.mutateAsync();
      showToast(`Đã tạo ${result.created} setting mặc định (${result.skipped} đã tồn tại)`, 'success');
    } catch (e: any) {
      showToast(e?.response?.data?.message || e?.message || 'Lỗi', 'error');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.innerPadding} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)}>
          <SGPageHeader
            icon={<Settings size={24} color={colors.accent} />}
            iconColor={colors.accent}
            title="Cài đặt hệ thống"
            subtitle="Quản lý cấu hình ứng dụng"
            rightContent={
              <SGButton
                title="Seed Defaults"
                variant="secondary"
                size="sm"
                icon={<Database size={16} />}
                onPress={handleSeedDefaults}
                loading={seedSettings.isPending}
              />
            }
          />
        </Animated.View>

        {/* Group Tabs */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.groupTabs}>
          {SETTING_GROUPS.map(g => {
            const isActive = activeGroup === g.key;
            const IconComp = g.icon;
            return (
              <SGChip
                key={g.key}
                label={g.label}
                color={g.color}
                selected={isActive}
                icon={<IconComp size={14} color={isActive ? g.color : colors.textTertiary} strokeWidth={2.5} />}
                onPress={() => setActiveGroup(g.key)}
              />
            );
          })}
        </Animated.View>

        {/* Settings List */}
        {isLoading ? (
          <View style={styles.skeletonList}>
            {Array.from({ length: 4 }).map((_, i) => (
              <View key={i} style={styles.skeletonItem}>
                <SGSkeleton width="40%" height={16} variant="text" />
                <SGSkeleton width="60%" height={12} variant="text" />
                <SGSkeleton width="100%" height={44} borderRadius={12} style={{ marginTop: 8 }} />
              </View>
            ))}
          </View>
        ) : (
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <SGSection noPadding>
              {settings.map((setting, i) => {
                const currentValue = editValues[setting.key] ?? setting.value;
                const hasChanged = currentValue !== setting.value;
                const isSaved = savedKeys.has(setting.key);
                const isBoolean = setting.valueType === 'boolean';
                const isSensitive = SENSITIVE_KEYS.includes(setting.key);

                return (
                  <View
                    key={setting.key}
                    style={[styles.settingRow, {
                      borderBottomWidth: i < settings.length - 1 ? 1 : 0,
                      borderBottomColor: colors.border,
                    }]}
                  >
                    <View style={styles.settingHeader}>
                      <View style={styles.settingInfo}>
                        <View style={styles.settingLabelRow}>
                          <Text style={[typography.bodyBold, { color: colors.text }]}>{setting.label}</Text>
                          {isSensitive && (
                            <AlertTriangle size={14} color={colors.warning} />
                          )}
                        </View>
                        <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>{setting.description}</Text>
                      </View>
                      {!isBoolean && (
                        <View style={styles.settingActions}>
                          {hasChanged && (
                            <Pressable
                              onPress={() => handleReset(setting.key, setting.value)}
                              accessibilityLabel="Hoàn tác"
                              style={({ hovered }: any) => [
                                styles.settingActionBtn,
                                { backgroundColor: hovered ? colors.bgCard : 'transparent' },
                                Platform.OS === 'web' && ({ ...sgds.transition.fast, cursor: 'pointer' } as any),
                              ]}
                            >
                              <RotateCcw size={14} color={colors.textSecondary} />
                            </Pressable>
                          )}
                          <Pressable
                            onPress={() => handleSave(setting.key)}
                            disabled={!hasChanged || updateSetting.isPending}
                            style={({ hovered }: any) => [
                              styles.settingActionBtn,
                              {
                                backgroundColor: isSaved
                                  ? `${colors.success}15`
                                  : hasChanged
                                    ? colors.accent
                                    : colors.bgCard,
                              },
                              Platform.OS === 'web' && hasChanged && ({ ...sgds.transition.fast, cursor: 'pointer' } as any),
                            ]}
                          >
                            {isSaved
                              ? <Check size={14} color={colors.success} />
                              : <Save size={14} color={hasChanged ? '#fff' : colors.textTertiary} />}
                          </Pressable>
                        </View>
                      )}
                    </View>

                    {isBoolean ? (
                      <View style={styles.switchRow}>
                        <Switch
                          value={currentValue === 'true'}
                          onValueChange={(v) => handleToggleBoolean(setting.key, v)}
                          trackColor={{ false: colors.bgCard, true: colors.accent }}
                          thumbColor="#ffffff"
                          accessibilityLabel={setting.label}
                          accessibilityRole="switch"
                        />
                        <Text style={[typography.smallBold, {
                          color: currentValue === 'true' ? colors.success : colors.textTertiary,
                        }]}>
                          {currentValue === 'true' ? 'Đang bật' : 'Đang tắt'}
                        </Text>
                      </View>
                    ) : (
                      <SGInput
                        value={currentValue}
                        onChangeText={(text) => setEditValues(prev => ({ ...prev, [setting.key]: text }))}
                        keyboardType={setting.valueType === 'number' ? 'numeric' : 'default'}
                        mono={false}
                      />
                    )}

                    <Text style={[typography.caption, { color: colors.textDisabled, fontFamily: 'monospace', marginTop: 6 }]}>
                      key: {setting.key}
                    </Text>
                  </View>
                );
              })}
            </SGSection>
          </Animated.View>
        )}
      </ScrollView>

      {/* Sensitive Setting Confirmation Dialog */}
      <SGConfirmDialog
        visible={!!sensitiveConfirm}
        title="Thay đổi cài đặt nhạy cảm"
        message={`Bạn đang thay đổi "${sensitiveConfirm?.label}".\nGiá trị mới: ${sensitiveConfirm?.value}\n\nThay đổi này có thể ảnh hưởng đến toàn bộ hệ thống. Bạn có chắc chắn?`}
        confirmLabel="Xác nhận thay đổi"
        variant="danger"
        loading={updateSetting.isPending}
        onConfirm={handleSensitiveConfirm}
        onCancel={() => setSensitiveConfirm(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerPadding: { padding: spacing['2xl'] - 4, gap: spacing.lg, paddingBottom: 120 },
  groupTabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  skeletonList: { gap: 20 },
  skeletonItem: { gap: 6 },
  settingRow: {
    padding: spacing.lg,
  },
  settingHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: 8,
  },
  settingInfo: { flex: 1 },
  settingLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  settingActions: { flexDirection: 'row', gap: 8, marginLeft: 12 },
  settingActionBtn: {
    width: 34, height: 34, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 },
});
