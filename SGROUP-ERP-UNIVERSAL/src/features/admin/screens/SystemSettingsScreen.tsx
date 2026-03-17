/**
 * SystemSettingsScreen — Admin system configuration
 * Groups: General, Email, Security, Notifications
 * Supports: string, boolean, number setting types
 */
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Platform, ActivityIndicator, Switch, Alert } from 'react-native';
import {
  Settings, Save, RotateCcw, Globe, Mail, ShieldCheck, Bell, Check,
} from 'lucide-react-native';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { sgds } from '../../../shared/theme/theme';
import { useSystemSettings, useUpdateSetting } from '../hooks/useAdmin';

const SETTING_GROUPS = [
  { key: 'general', label: 'Cài đặt chung', icon: Globe, color: '#6366f1' },
  { key: 'email', label: 'Email', icon: Mail, color: '#3b82f6' },
  { key: 'security', label: 'Bảo mật', icon: ShieldCheck, color: '#ef4444' },
  { key: 'notification', label: 'Thông báo', icon: Bell, color: '#f59e0b' },
];

// Default settings for display when no settings from API
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
  const { theme, isDark } = useAppTheme();
  const cText = theme.colors.textPrimary;
  const cSub = theme.colors.textSecondary;
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : '#ffffff';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  const [activeGroup, setActiveGroup] = useState('general');
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set());

  const { data: apiSettings, isLoading } = useSystemSettings();
  const updateSetting = useUpdateSetting();

  // Merge API settings with defaults
  const settings = (() => {
    const defaults = DEFAULT_SETTINGS[activeGroup] || [];
    if (!apiSettings || !Array.isArray(apiSettings)) return defaults;

    const apiMap = new Map(apiSettings.filter((s: any) => s.group === activeGroup).map((s: any) => [s.key, s]));
    return defaults.map(d => {
      const apiSetting = apiMap.get(d.key) as any;
      return apiSetting ? { ...d, value: apiSetting.value } : d;
    });
  })();

  // Initialize edit values
  useEffect(() => {
    const vals: Record<string, string> = {};
    settings.forEach(s => { vals[s.key] = s.value; });
    setEditValues(vals);
    setSavedKeys(new Set());
  }, [activeGroup, apiSettings]);

  const handleSave = async (key: string) => {
    try {
      await updateSetting.mutateAsync({ key, value: editValues[key] || '' });
      setSavedKeys(prev => new Set(prev).add(key));
      setTimeout(() => setSavedKeys(prev => { const n = new Set(prev); n.delete(key); return n; }), 2000);
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || 'Lỗi khi lưu';
      Platform.OS === 'web' ? window.alert(msg) : Alert.alert('Lỗi', msg);
    }
  };

  const handleReset = (key: string, original: string) => {
    setEditValues(prev => ({ ...prev, [key]: original }));
  };

  const inputStyle: any = {
    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f8fafc',
    borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 14, color: cText, flex: 1,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 28, gap: 24, paddingBottom: 120 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <View style={{ width: 52, height: 52, borderRadius: 18, backgroundColor: isDark ? 'rgba(99,102,241,0.12)' : '#eef2ff', alignItems: 'center', justifyContent: 'center' }}>
            <Settings size={24} color="#6366f1" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ ...sgds.typo.h2, color: cText }}>Cài đặt hệ thống</Text>
            <Text style={{ ...sgds.typo.body, color: cSub, marginTop: 2 }}>Quản lý cấu hình ứng dụng</Text>
          </View>
        </View>

        {/* Group Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
          {SETTING_GROUPS.map(g => {
            const isActive = activeGroup === g.key;
            const IconComp = g.icon;
            return (
              <Pressable
                key={g.key}
                onPress={() => setActiveGroup(g.key)}
                style={{
                  flexDirection: 'row', alignItems: 'center', gap: 8,
                  paddingHorizontal: 18, paddingVertical: 12, borderRadius: 14,
                  backgroundColor: isActive ? `${g.color}15` : (isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9'),
                  borderWidth: 2, borderColor: isActive ? g.color : 'transparent',
                  ...(Platform.OS === 'web' ? { cursor: 'pointer', transition: 'all 0.2s ease' } : {}),
                } as any}
              >
                <IconComp size={16} color={isActive ? g.color : cSub} strokeWidth={2.5} />
                <Text style={{ fontSize: 13, fontWeight: isActive ? '800' : '600', color: isActive ? g.color : cSub }}>{g.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Settings List */}
        {isLoading ? (
          <View style={{ padding: 60, alignItems: 'center' }}><ActivityIndicator size="large" color="#6366f1" /></View>
        ) : (
          <View style={{ borderRadius: 20, backgroundColor: cardBg, borderWidth: 1, borderColor, overflow: 'hidden' }}>
            {settings.map((setting, i) => {
              const currentValue = editValues[setting.key] ?? setting.value;
              const hasChanged = currentValue !== setting.value;
              const isSaved = savedKeys.has(setting.key);
              const isBoolean = setting.valueType === 'boolean';

              return (
                <View key={setting.key} style={{
                  padding: 20, borderBottomWidth: i < settings.length - 1 ? 1 : 0, borderBottomColor: borderColor,
                }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: '800', color: cText }}>{setting.label}</Text>
                      <Text style={{ fontSize: 12, fontWeight: '600', color: cSub, marginTop: 2 }}>{setting.description}</Text>
                    </View>
                    {!isBoolean && (
                      <View style={{ flexDirection: 'row', gap: 8, marginLeft: 12 }}>
                        {hasChanged && (
                          <Pressable onPress={() => handleReset(setting.key, setting.value)} style={{
                            width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
                            backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                          }}>
                            <RotateCcw size={14} color={cSub} />
                          </Pressable>
                        )}
                        <Pressable
                          onPress={() => handleSave(setting.key)}
                          disabled={!hasChanged || updateSetting.isPending}
                          style={{
                            width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
                            backgroundColor: isSaved ? 'rgba(16,185,129,0.15)' : (hasChanged ? '#6366f1' : (isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9')),
                          }}
                        >
                          {isSaved ? <Check size={14} color="#10b981" /> : <Save size={14} color={hasChanged ? '#fff' : cSub} />}
                        </Pressable>
                      </View>
                    )}
                  </View>

                  {isBoolean ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 }}>
                      <Switch
                        value={currentValue === 'true'}
                        onValueChange={(v) => {
                          const newVal = v ? 'true' : 'false';
                          setEditValues(prev => ({ ...prev, [setting.key]: newVal }));
                          // Auto-save boolean toggles
                          updateSetting.mutate({ key: setting.key, value: newVal });
                        }}
                        trackColor={{ false: isDark ? '#334155' : '#cbd5e1', true: '#6366f1' }}
                        thumbColor="#ffffff"
                      />
                      <Text style={{ fontSize: 13, fontWeight: '700', color: currentValue === 'true' ? '#10b981' : cSub }}>
                        {currentValue === 'true' ? 'Đang bật' : 'Đang tắt'}
                      </Text>
                    </View>
                  ) : (
                    <TextInput
                      value={currentValue}
                      onChangeText={(text) => setEditValues(prev => ({ ...prev, [setting.key]: text }))}
                      keyboardType={setting.valueType === 'number' ? 'numeric' : 'default'}
                      style={inputStyle}
                      placeholderTextColor={cSub}
                    />
                  )}

                  <View style={{ marginTop: 6 }}>
                    <Text style={{ fontSize: 10, fontWeight: '600', color: isDark ? '#475569' : '#94a3b8', fontFamily: 'monospace' }}>
                      key: {setting.key}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
