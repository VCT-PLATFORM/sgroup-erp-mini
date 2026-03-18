/**
 * ScheduledTasksScreen — Cron job management dashboard
 * View all configured tasks + manual trigger + execution log
 */
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Clock, Play, Calendar, Server, CheckCircle, Zap,
} from 'lucide-react-native';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { typography, spacing } from '../../../shared/theme/theme';
import { SGPageHeader } from '../../../shared/ui/components/SGPageHeader';
import { SGSection } from '../../../shared/ui/components/SGSection';
import { SGSkeleton } from '../../../shared/ui/components/SGSkeleton';
import { SGButton } from '../../../shared/ui/components/SGButton';
import { SGStatusBadge } from '../../../shared/ui/components/SGStatusBadge';
import { useScheduledTasks, useTriggerTask } from '../hooks/useAdmin';
import { showToast } from '../utils/adminUtils';

const TASK_COLORS: Record<string, string> = {
  cleanupOldAuditLogs: '#ef4444',
  cleanupOldNotifications: '#f59e0b',
  checkPasswordExpiry: '#3b82f6',
};

const TASK_ICONS: Record<string, any> = {
  cleanupOldAuditLogs: Server,
  cleanupOldNotifications: Calendar,
  checkPasswordExpiry: Clock,
};

export function ScheduledTasksScreen() {
  const { colors } = useAppTheme();
  const { data: tasksRaw, isLoading } = useScheduledTasks();
  const triggerMut = useTriggerTask();
  const tasks: any[] = Array.isArray(tasksRaw) ? tasksRaw : Array.isArray((tasksRaw as any)?.data) ? (tasksRaw as any).data : [];

  const handleTrigger = async (name: string) => {
    try {
      const result = await triggerMut.mutateAsync(name);
      showToast(result.message || 'Task completed', 'success');
    } catch (e: any) {
      showToast(e?.response?.data?.message || 'Error', 'error');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.innerPadding} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)}>
          <SGPageHeader
            icon={<Clock size={24} color={colors.accent} />}
            iconColor={colors.accent}
            title="Scheduled Tasks"
            subtitle="Quản lý tác vụ tự động (Cron Jobs)"
          />
        </Animated.View>

        {/* Overview */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: `${colors.success}08`, borderColor: `${colors.success}20` }]}>
              <CheckCircle size={18} color={colors.success} />
              <Text style={[typography.h3, { color: colors.success }]}>{tasks.length}</Text>
              <Text style={[typography.caption, { color: colors.success }]}>Active Tasks</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: `${colors.accent}08`, borderColor: `${colors.accent}20` }]}>
              <Zap size={18} color={colors.accent} />
              <Text style={[typography.h3, { color: colors.accent }]}>3</Text>
              <Text style={[typography.caption, { color: colors.accent }]}>Daily Runs</Text>
            </View>
          </View>
        </Animated.View>

        {/* Tasks List */}
        {isLoading ? (
          <View style={{ gap: 16 }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <SGSkeleton key={i} width="100%" height={140} borderRadius={16} />
            ))}
          </View>
        ) : (
          tasks.map((task: any, i: number) => {
            const taskColor = TASK_COLORS[task.name] || colors.accent;
            const TaskIcon = TASK_ICONS[task.name] || Clock;

            return (
              <Animated.View key={task.name} entering={FadeInDown.delay(150 + i * 80).duration(400).springify()}>
                <SGSection noPadding>
                  <View style={styles.taskCard}>
                    {/* Header */}
                    <View style={styles.taskHeader}>
                      <View style={[styles.taskIconBox, { backgroundColor: `${taskColor}12` }]}>
                        <TaskIcon size={20} color={taskColor} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={styles.taskTitleRow}>
                          <Text style={[typography.bodyBold, { color: colors.text }]}>{task.name}</Text>
                          <SGStatusBadge
                            status={task.status === 'active' ? 'success' : 'warning'}
                            text={task.status === 'active' ? 'ACTIVE' : 'PAUSED'}
                            size="sm"
                          />
                        </View>
                        <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                          {task.description}
                        </Text>
                      </View>
                    </View>

                    {/* Info Row */}
                    <View style={[styles.taskInfo, { borderTopColor: colors.border }]}>
                      <View style={styles.infoItem}>
                        <Text style={[typography.micro, { color: colors.textDisabled }]}>SCHEDULE</Text>
                        <Text style={[typography.smallBold, { color: taskColor }]}>{task.schedule}</Text>
                      </View>
                      <View style={styles.infoItem}>
                        <Text style={[typography.micro, { color: colors.textDisabled }]}>CRON</Text>
                        <Text style={[typography.smallBold, { color: colors.text, fontFamily: 'monospace' }]}>{task.cron}</Text>
                      </View>
                      <View style={styles.infoItem}>
                        <Text style={[typography.micro, { color: colors.textDisabled }]}>MODULE</Text>
                        <Text style={[typography.smallBold, { color: colors.textSecondary }]}>{task.module}</Text>
                      </View>
                      <SGButton
                        title="Trigger Now"
                        size="sm"
                        variant="secondary"
                        icon={<Play size={14} />}
                        onPress={() => handleTrigger(task.name)}
                        loading={triggerMut.isPending}
                      />
                    </View>
                  </View>
                </SGSection>
              </Animated.View>
            );
          })
        )}

        {/* Info Box */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <View style={[styles.infoBox, { backgroundColor: `${colors.info}06`, borderColor: `${colors.info}20` }]}>
            <Text style={[typography.caption, { color: colors.info }]}>
              💡 Các tác vụ chạy tự động theo lịch trình. Bạn có thể chạy thủ công bằng nút "Trigger Now".
              Kết quả sẽ được ghi vào audit log.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerPadding: { padding: spacing['2xl'] - 4, gap: spacing.lg, paddingBottom: 120 },
  statsRow: { flexDirection: 'row', gap: 14 },
  statCard: {
    flex: 1, alignItems: 'center', padding: 16, borderRadius: 14, borderWidth: 1, gap: 4,
  },
  taskCard: { padding: 0 },
  taskHeader: { flexDirection: 'row', gap: 14, padding: 16 },
  taskIconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  taskTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  taskInfo: {
    flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 16,
    padding: 16, paddingTop: 12, borderTopWidth: 1,
  },
  infoItem: { gap: 2 },
  infoBox: { padding: 14, borderRadius: 12, borderWidth: 1 },
});
