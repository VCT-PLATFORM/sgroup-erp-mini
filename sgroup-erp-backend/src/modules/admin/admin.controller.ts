import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards, HttpCode, HttpStatus,
  Req, Res, Header,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateUserDto, UpdateUserDto } from './admin.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'ceo')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ═══════════════════════════════════════════
  // DASHBOARD & HEALTH
  // ═══════════════════════════════════════════
  @Get('stats')
  @ApiOperation({ summary: 'Dashboard statistics with activity trend' })
  getStats() {
    return this.adminService.getStats();
  }

  @Get('health')
  @ApiOperation({ summary: 'System health check' })
  getHealth() {
    return this.adminService.getHealthCheck();
  }

  // ═══════════════════════════════════════════
  // USER MANAGEMENT
  // ═══════════════════════════════════════════
  @Get('users')
  @ApiOperation({ summary: 'List all users with search, filter, pagination' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'role', required: false })
  @ApiQuery({ name: 'status', required: false, description: 'active | inactive | locked' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getUsers(
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.findAllUsers({
      search,
      role,
      status,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
  }

  @Post('users')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user with password strength check' })
  createUser(@Body() data: CreateUserDto) {
    return this.adminService.createUser(data);
  }

  @Patch('users/:id')
  @ApiOperation({ summary: 'Update user name, role, department, salesRole' })
  updateUser(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.adminService.updateUser(id, data);
  }

  @Patch('users/:id/email')
  @Roles('admin')
  @ApiOperation({ summary: 'Change user email address' })
  updateUserEmail(@Param('id') id: string, @Body() data: { email: string }) {
    return this.adminService.updateUserEmail(id, data.email);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Toggle user active/inactive (with self-protection)' })
  deactivateUser(@Param('id') id: string, @Req() req: any) {
    return this.adminService.deactivateUser(id, req.user?.sub);
  }

  @Post('users/:id/reset-password')
  @Roles('admin') // Only admin, not CEO
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // Rate limit: 5 resets per minute
  @ApiOperation({ summary: 'Reset user password (rate limited)' })
  resetPassword(@Param('id') id: string, @Body() data: { newPassword: string }) {
    return this.adminService.resetPassword(id, data.newPassword);
  }

  @Post('users/:id/unlock')
  @Roles('admin')
  @ApiOperation({ summary: 'Unlock a locked user account' })
  unlockUser(@Param('id') id: string) {
    return this.adminService.unlockUser(id);
  }

  @Post('users/batch-toggle')
  @Roles('admin')
  @ApiOperation({ summary: 'Batch activate/deactivate multiple users' })
  batchToggleUsers(@Body() data: { ids: string[]; activate: boolean }, @Req() req: any) {
    return this.adminService.batchToggleUsers(data.ids, data.activate, req.user?.sub);
  }

  @Get('users/export')
  @Roles('admin')
  @ApiOperation({ summary: 'Export users as CSV file' })
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename=users_export.csv')
  async exportUsers(
    @Query('role') role?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.exportUsersCSV({ role, status });
  }

  // ═══════════════════════════════════════════
  // AUDIT LOGS
  // ═══════════════════════════════════════════
  @Get('audit-logs')
  @ApiOperation({ summary: 'Query audit logs with date range and filters' })
  @ApiQuery({ name: 'action', required: false })
  @ApiQuery({ name: 'resource', required: false })
  @ApiQuery({ name: 'userName', required: false })
  @ApiQuery({ name: 'method', required: false })
  @ApiQuery({ name: 'dateFrom', required: false, description: 'ISO date string YYYY-MM-DD' })
  @ApiQuery({ name: 'dateTo', required: false, description: 'ISO date string YYYY-MM-DD' })
  getAuditLogs(
    @Query('action') action?: string,
    @Query('resource') resource?: string,
    @Query('userName') userName?: string,
    @Query('method') method?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getAuditLogs({
      action,
      resource,
      userName,
      method,
      dateFrom,
      dateTo,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
  }

  @Get('audit-logs/:id')
  @ApiOperation({ summary: 'Get single audit log detail' })
  getAuditLogDetail(@Param('id') id: string) {
    return this.adminService.getAuditLogDetail(id);
  }

  // ═══════════════════════════════════════════
  // SYSTEM SETTINGS
  // ═══════════════════════════════════════════
  @Get('settings')
  @ApiOperation({ summary: 'Get system settings, optionally filtered by group' })
  getSettings(@Query('group') group?: string) {
    return this.adminService.getSettings(group);
  }

  @Patch('settings/:key')
  @ApiOperation({ summary: 'Update a setting value (with audit trail)' })
  updateSetting(@Param('key') key: string, @Body() data: { value: string }, @Req() req: any) {
    return this.adminService.updateSetting(key, data.value, req.user?.name || req.user?.email);
  }

  @Post('settings')
  @Roles('admin')
  @ApiOperation({ summary: 'Upsert a system setting' })
  upsertSetting(@Body() data: { key: string; value: string; group?: string; label?: string; description?: string; valueType?: string }) {
    return this.adminService.upsertSetting(data.key, data);
  }

  @Post('settings/seed')
  @Roles('admin')
  @ApiOperation({ summary: 'Seed default system settings' })
  seedSettings() {
    return this.adminService.seedDefaultSettings();
  }

  // ═══════════════════════════════════════════
  // ROLE PERMISSIONS
  // ═══════════════════════════════════════════
  @Get('permissions')
  @ApiOperation({ summary: 'Get all role permissions as matrix' })
  getPermissions() {
    return this.adminService.getPermissions();
  }

  @Patch('permissions')
  @Roles('admin')
  @ApiOperation({ summary: 'Update a single role-module permission' })
  updatePermission(@Body() data: { role: string; module: string; permission: string }) {
    return this.adminService.updatePermission(data.role, data.module, data.permission);
  }

  @Post('permissions/bulk')
  @Roles('admin')
  @ApiOperation({ summary: 'Bulk update multiple permissions' })
  bulkUpdatePermissions(@Body() data: { updates: { role: string; module: string; permission: string }[] }) {
    return this.adminService.bulkUpdatePermissions(data.updates);
  }

  @Post('permissions/reset')
  @Roles('admin')
  @ApiOperation({ summary: 'Reset all permissions to defaults' })
  resetPermissions() {
    return this.adminService.resetPermissionsToDefault();
  }

  // ═══════════════════════════════════════════
  // USER DETAIL & SESSIONS
  // ═══════════════════════════════════════════
  @Get('users/:id/detail')
  @ApiOperation({ summary: 'Get user detail with login history, sessions, password expiry' })
  getUserDetail(@Param('id') id: string) {
    return this.adminService.getUserDetail(id);
  }

  @Get('users/:id/sessions')
  @ApiOperation({ summary: 'List active sessions for a user' })
  getUserSessions(@Param('id') id: string) {
    return this.adminService.getUserSessions(id);
  }

  @Delete('sessions/:sessionId')
  @Roles('admin')
  @ApiOperation({ summary: 'Revoke a single active session' })
  revokeSession(@Param('sessionId') sessionId: string) {
    return this.adminService.revokeSession(sessionId);
  }

  @Delete('users/:id/sessions')
  @Roles('admin')
  @ApiOperation({ summary: 'Revoke all sessions for a user (force logout)' })
  revokeAllSessions(@Param('id') id: string) {
    return this.adminService.revokeAllSessions(id);
  }

  // ═══════════════════════════════════════════
  // PASSWORD EXPIRY
  // ═══════════════════════════════════════════
  @Get('password-expiry')
  @ApiOperation({ summary: 'Get password expiry status for all users' })
  getPasswordExpiry() {
    return this.adminService.getPasswordExpiryStatus();
  }

  // ═══════════════════════════════════════════
  // AUDIT ANALYTICS
  // ═══════════════════════════════════════════
  @Get('audit-analytics')
  @ApiOperation({ summary: 'Audit log analytics (top users, resources, error rate, heatmap)' })
  @ApiQuery({ name: 'days', required: false, description: 'Number of days for analysis (default: 30)' })
  getAuditAnalytics(@Query('days') days?: string) {
    return this.adminService.getAuditAnalytics(days ? parseInt(days) : 30);
  }

  // ═══════════════════════════════════════════
  // SUSPICIOUS ACTIVITY
  // ═══════════════════════════════════════════
  @Get('suspicious-activity')
  @ApiOperation({ summary: 'Detect suspicious activity (failed logins by IP, locked accounts, high activity)' })
  getSuspiciousActivity() {
    return this.adminService.getSuspiciousActivity();
  }

  // ═══════════════════════════════════════════
  // SETTING CHANGE HISTORY
  // ═══════════════════════════════════════════
  @Get('settings/history')
  @ApiOperation({ summary: 'Get setting change history from audit logs' })
  getSettingHistory() {
    return this.adminService.getSettingChangeHistory();
  }

  // ═══════════════════════════════════════════
  // FEATURE FLAGS
  // ═══════════════════════════════════════════
  @Get('feature-flags')
  @ApiOperation({ summary: 'List all feature flags' })
  @ApiQuery({ name: 'module', required: false })
  getFeatureFlags(@Query('module') module?: string) {
    return this.adminService.getFeatureFlags(module);
  }

  @Patch('feature-flags/:id')
  @Roles('admin')
  @ApiOperation({ summary: 'Toggle a feature flag on/off' })
  toggleFeatureFlag(@Param('id') id: string, @Body() data: { enabled: boolean }, @Req() req: any) {
    return this.adminService.toggleFeatureFlag(id, data.enabled, req.user?.name || req.user?.email);
  }

  @Post('feature-flags')
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new feature flag' })
  createFeatureFlag(@Body() data: { key: string; description?: string; module?: string; enabled?: boolean }) {
    return this.adminService.createFeatureFlag(data);
  }

  @Delete('feature-flags/:id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a feature flag' })
  deleteFeatureFlag(@Param('id') id: string) {
    return this.adminService.deleteFeatureFlag(id);
  }

  @Post('feature-flags/seed')
  @Roles('admin')
  @ApiOperation({ summary: 'Seed default feature flags' })
  seedFeatureFlags() {
    return this.adminService.seedDefaultFeatureFlags();
  }

  // ═══════════════════════════════════════════
  // BACKUP & RESTORE
  // ═══════════════════════════════════════════
  @Get('backup')
  @Roles('admin')
  @ApiOperation({ summary: 'Export all settings, feature flags, and permissions as JSON' })
  exportBackup() {
    return this.adminService.exportSettingsBackup();
  }

  @Post('restore')
  @Roles('admin')
  @ApiOperation({ summary: 'Import settings, flags, and permissions from JSON backup' })
  importBackup(@Body() data: { settings?: any[]; featureFlags?: any[]; rolePermissions?: any[] }) {
    return this.adminService.importSettingsBackup(data);
  }

  // ═══════════════════════════════════════════
  // BATCH IMPORT USERS
  // ═══════════════════════════════════════════
  @Post('users/import')
  @Roles('admin')
  @ApiOperation({ summary: 'Batch import users from CSV content' })
  batchImportUsers(@Body() data: { csvContent: string }) {
    return this.adminService.batchImportUsers(data.csvContent);
  }

  // ═══════════════════════════════════════════
  // NOTIFICATION CENTER
  // ═══════════════════════════════════════════
  @Get('notifications')
  @ApiOperation({ summary: 'Get admin notifications with unread count' })
  getNotifications(@Req() req: any) {
    return this.adminService.getNotifications(req.user?.sub);
  }

  @Patch('notifications/:id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  markNotificationRead(@Param('id') id: string) {
    return this.adminService.markNotificationRead(id);
  }

  @Post('notifications/read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllRead(@Req() req: any) {
    return this.adminService.markAllNotificationsRead(req.user?.sub);
  }

  // ═══════════════════════════════════════════
  // USER ACTIVITY TIMELINE
  // ═══════════════════════════════════════════
  @Get('users/:id/timeline')
  @ApiOperation({ summary: 'Get user activity timeline grouped by date' })
  @ApiQuery({ name: 'days', required: false, description: 'Number of days (default: 30)' })
  getUserTimeline(@Param('id') id: string, @Query('days') days?: string) {
    return this.adminService.getUserActivityTimeline(id, days ? parseInt(days) : 30);
  }

  // ═══════════════════════════════════════════
  // SCHEDULED TASKS
  // ═══════════════════════════════════════════
  @Get('scheduled-tasks')
  @ApiOperation({ summary: 'List all configured cron jobs' })
  getScheduledTasks() {
    return this.adminService.getScheduledTasks();
  }

  @Post('scheduled-tasks/:name/trigger')
  @Roles('admin')
  @ApiOperation({ summary: 'Manually trigger a scheduled task' })
  triggerTask(@Param('name') name: string) {
    return this.adminService.triggerTask(name);
  }

  // ═══════════════════════════════════════════
  // CHANGELOG
  // ═══════════════════════════════════════════
  @Get('changelogs')
  @ApiOperation({ summary: 'List version changelogs / release notes' })
  getChangelogs() {
    return this.adminService.getChangelogs();
  }

  @Post('changelogs')
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new changelog entry' })
  createChangelog(@Body() data: { version: string; title: string; description: string; type?: string; author?: string }) {
    return this.adminService.createChangelog(data);
  }

  @Delete('changelogs/:id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a changelog entry' })
  deleteChangelog(@Param('id') id: string) {
    return this.adminService.deleteChangelog(id);
  }

  // ═══════════════════════════════════════════
  // COMMAND PALETTE
  // ═══════════════════════════════════════════
  @Get('search')
  @ApiOperation({ summary: 'Unified search across users, settings, flags, audit' })
  @ApiQuery({ name: 'q', description: 'Search query (min 2 chars)' })
  commandSearch(@Query('q') q: string) {
    return this.adminService.commandPaletteSearch(q);
  }

  // ═══════════════════════════════════════════
  // USER GROWTH
  // ═══════════════════════════════════════════
  @Get('user-growth')
  @ApiOperation({ summary: 'Get user growth statistics (daily/weekly/monthly)' })
  @ApiQuery({ name: 'days', required: false, description: 'Period in days (default: 90)' })
  getUserGrowth(@Query('days') days?: string) {
    return this.adminService.getUserGrowthStats(days ? parseInt(days) : 90);
  }

  // ═══════════════════════════════════════════
  // SECURITY SCORE
  // ═══════════════════════════════════════════
  @Get('security-score')
  @ApiOperation({ summary: 'Get overall security health score (A-F grading)' })
  getSecurityScore() {
    return this.adminService.getSecurityScore();
  }

  // ═══════════════════════════════════════════
  // LOGIN CALENDAR
  // ═══════════════════════════════════════════
  @Get('login-calendar')
  @ApiOperation({ summary: 'Get 365-day login activity calendar heatmap data' })
  getLoginCalendar() {
    return this.adminService.getLoginCalendar();
  }
}
