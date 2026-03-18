/**
 * ChangelogScreen — Version history / release notes
 * Create + view changelogs with type badges
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform, Modal, TextInput } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  BookOpen, Plus, Trash2, X, Tag, Zap, Bug, Shield, Wrench, AlertTriangle,
} from 'lucide-react-native';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { typography, spacing } from '../../../shared/theme/theme';
import { SGPageHeader } from '../../../shared/ui/components/SGPageHeader';
import { SGSection } from '../../../shared/ui/components/SGSection';
import { SGSkeleton } from '../../../shared/ui/components/SGSkeleton';
import { SGButton } from '../../../shared/ui/components/SGButton';
import { SGChip } from '../../../shared/ui/components/SGChip';
import { SGConfirmDialog } from '../../../shared/ui/components/SGConfirmDialog';
import { SGEmptyState } from '../../../shared/ui/components/SGEmptyState';
import { useChangelogs, useCreateChangelog, useDeleteChangelog } from '../hooks/useAdmin';
import { showToast } from '../utils/adminUtils';

const TYPE_CONFIG: Record<string, { icon: any; color: string; label: string }> = {
  feature:     { icon: Zap,            color: '#3b82f6', label: '✨ Tính năng mới' },
  bugfix:      { icon: Bug,            color: '#ef4444', label: '🐛 Sửa lỗi' },
  improvement: { icon: Wrench,         color: '#10b981', label: '🔧 Cải tiến' },
  security:    { icon: Shield,         color: '#f59e0b', label: '🔒 Bảo mật' },
  breaking:    { icon: AlertTriangle,  color: '#dc2626', label: '⚠️ Breaking Change' },
};

export function ChangelogScreen() {
  const { colors } = useAppTheme();
  const [createVisible, setCreateVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [form, setForm] = useState({ version: '', title: '', description: '', type: 'feature', author: '' });

  const { data: changelogs, isLoading } = useChangelogs();
  const createMut = useCreateChangelog();
  const deleteMut = useDeleteChangelog();

  const handleCreate = async () => {
    if (!form.version || !form.title || !form.description) {
      return showToast('Hãy nhập đầy đủ version, title, description', 'warning');
    }
    try {
      await createMut.mutateAsync(form);
      showToast(`Đã tạo changelog v${form.version}`, 'success');
      setCreateVisible(false);
      setForm({ version: '', title: '', description: '', type: 'feature', author: '' });
    } catch (e: any) {
      showToast(e?.response?.data?.message || 'Lỗi', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMut.mutateAsync(deleteTarget.id);
      showToast('Đã xóa changelog', 'success');
      setDeleteTarget(null);
    } catch { showToast('Lỗi khi xóa', 'error'); }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.innerPadding} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)}>
          <SGPageHeader
            icon={<BookOpen size={24} color={colors.accent} />}
            iconColor={colors.accent}
            title="Changelog"
            subtitle="Lịch sử phiên bản & release notes"
            rightContent={
              <SGButton
                title="Tạo mới"
                size="sm"
                icon={<Plus size={16} color="#fff" />}
                onPress={() => setCreateVisible(true)}
              />
            }
          />
        </Animated.View>

        {isLoading ? (
          <View style={{ gap: 16 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <SGSkeleton key={i} width="100%" height={120} borderRadius={16} />
            ))}
          </View>
        ) : (changelogs || []).length === 0 ? (
          <SGSection>
            <SGEmptyState
              icon={<BookOpen size={48} color={colors.textTertiary} strokeWidth={1} />}
              title="Chưa có changelog nào"
              subtitle="Tạo changelog đầu tiên để theo dõi lịch sử phiên bản"
              actionLabel="Tạo mới"
              onAction={() => setCreateVisible(true)}
            />
          </SGSection>
        ) : (
          /* Timeline */
          <View style={styles.timeline}>
            {(changelogs || []).map((entry: any, i: number) => {
              const typeConf = TYPE_CONFIG[entry.type] || TYPE_CONFIG.feature;
              const TypeIcon = typeConf.icon;
              return (
                <Animated.View
                  key={entry.id}
                  entering={FadeInDown.delay(100 + i * 60).duration(400).springify()}
                >
                  <View style={styles.timelineItem}>
                    {/* Timeline line */}
                    {i < (changelogs || []).length - 1 && (
                      <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />
                    )}

                    {/* Dot */}
                    <View style={[styles.timelineDot, { backgroundColor: typeConf.color }]}>
                      <TypeIcon size={12} color="#fff" />
                    </View>

                    {/* Content */}
                    <SGSection noPadding style={{ flex: 1 }}>
                      <View style={styles.entryCard}>
                        <View style={styles.entryHeader}>
                          <View style={[styles.versionBadge, { backgroundColor: `${typeConf.color}12` }]}>
                            <Tag size={12} color={typeConf.color} />
                            <Text style={[typography.smallBold, { color: typeConf.color }]}>v{entry.version}</Text>
                          </View>
                          <View style={[styles.typeBadge, { backgroundColor: `${typeConf.color}08` }]}>
                            <Text style={[typography.micro, { color: typeConf.color }]}>{typeConf.label}</Text>
                          </View>
                          <Pressable
                            onPress={() => setDeleteTarget(entry)}
                            style={[styles.deleteBtn, { backgroundColor: `${colors.danger}10` }]}
                          >
                            <Trash2 size={12} color={colors.danger} />
                          </Pressable>
                        </View>
                        <Text style={[typography.bodyBold, { color: colors.text, marginTop: 8 }]}>{entry.title}</Text>
                        <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 4, lineHeight: 20 }]}>
                          {entry.description}
                        </Text>
                        <View style={styles.entryMeta}>
                          {entry.author && (
                            <Text style={[typography.micro, { color: colors.textDisabled }]}>by {entry.author}</Text>
                          )}
                          <Text style={[typography.micro, { color: colors.textDisabled }]}>
                            {new Date(entry.publishedAt).toLocaleDateString('vi', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                          </Text>
                        </View>
                      </View>
                    </SGSection>
                  </View>
                </Animated.View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Create Modal */}
      <Modal visible={createVisible} transparent animationType="fade" onRequestClose={() => setCreateVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setCreateVisible(false)}>
          <Pressable style={[styles.modalContent, { backgroundColor: colors.bgCard }]} onPress={() => {}}>
            <View style={styles.modalHeader}>
              <Text style={[typography.h4, { color: colors.text }]}>Tạo Changelog</Text>
              <Pressable onPress={() => setCreateVisible(false)} style={[styles.closeBtn, { backgroundColor: `${colors.danger}15` }]}>
                <X size={18} color={colors.danger} />
              </Pressable>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={[typography.label, { color: colors.textTertiary }]}>VERSION</Text>
              <TextInput
                value={form.version}
                onChangeText={t => setForm(p => ({ ...p, version: t }))}
                placeholder="1.2.0"
                placeholderTextColor={colors.textDisabled}
                style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.bg }]}
              />

              <Text style={[typography.label, { color: colors.textTertiary, marginTop: 12 }]}>TIÊU ĐỀ</Text>
              <TextInput
                value={form.title}
                onChangeText={t => setForm(p => ({ ...p, title: t }))}
                placeholder="Feature Flags & Audit Analytics"
                placeholderTextColor={colors.textDisabled}
                style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.bg }]}
              />

              <Text style={[typography.label, { color: colors.textTertiary, marginTop: 12 }]}>LOẠI</Text>
              <View style={styles.typeChips}>
                {Object.entries(TYPE_CONFIG).map(([key, conf]) => (
                  <SGChip
                    key={key}
                    label={conf.label}
                    color={conf.color}
                    selected={form.type === key}
                    onPress={() => setForm(p => ({ ...p, type: key }))}
                  />
                ))}
              </View>

              <Text style={[typography.label, { color: colors.textTertiary, marginTop: 12 }]}>MÔ TẢ (hỗ trợ markdown)</Text>
              <TextInput
                value={form.description}
                onChangeText={t => setForm(p => ({ ...p, description: t }))}
                placeholder="- Added feature flags management&#10;- Added audit analytics dashboard&#10;- Fixed password expiry check"
                placeholderTextColor={colors.textDisabled}
                multiline
                numberOfLines={6}
                style={[styles.textarea, { color: colors.text, borderColor: colors.border, backgroundColor: colors.bg }]}
              />

              <Text style={[typography.label, { color: colors.textTertiary, marginTop: 12 }]}>TÁC GIẢ</Text>
              <TextInput
                value={form.author}
                onChangeText={t => setForm(p => ({ ...p, author: t }))}
                placeholder="Admin"
                placeholderTextColor={colors.textDisabled}
                style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.bg }]}
              />

              <SGButton
                title="Tạo Changelog"
                onPress={handleCreate}
                loading={createMut.isPending}
                style={{ marginTop: 20, marginBottom: 20 }}
              />
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      <SGConfirmDialog
        visible={!!deleteTarget}
        title="Xóa Changelog"
        message={`Bạn có chắc muốn xóa changelog v${deleteTarget?.version} "${deleteTarget?.title}"?`}
        confirmLabel="Xóa"
        variant="danger"
        loading={deleteMut.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerPadding: { padding: spacing['2xl'] - 4, gap: spacing.lg, paddingBottom: 120 },
  timeline: { gap: 0, paddingLeft: 4 },
  timelineItem: { flexDirection: 'row', gap: 16, position: 'relative', marginBottom: 16 },
  timelineLine: {
    position: 'absolute', left: 12, top: 28, bottom: -16, width: 2,
  },
  timelineDot: {
    width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center',
    marginTop: 16, zIndex: 1,
  },
  entryCard: { padding: 16 },
  entryHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  versionBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  deleteBtn: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' },
  entryMeta: { flexDirection: 'row', gap: 12, marginTop: 8 },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', maxWidth: 560, maxHeight: '90%', borderRadius: 20, overflow: 'hidden' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  closeBtn: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  modalBody: { paddingHorizontal: 20 },
  input: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 14, marginTop: 6 },
  textarea: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 13, marginTop: 6, textAlignVertical: 'top', minHeight: 100 },
  typeChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
});
