/**
 * NestJS Injection Tokens for Repository interfaces.
 * Used with @Inject(TOKEN) in services to decouple from specific adapters.
 */

// ── Core CRM ──
export const CUSTOMER_REPOSITORY = Symbol('CUSTOMER_REPOSITORY');
export const ACTIVITY_REPOSITORY = Symbol('ACTIVITY_REPOSITORY');
export const APPOINTMENT_REPOSITORY = Symbol('APPOINTMENT_REPOSITORY');
export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

// ── Sales Ops ──
export const TEAM_REPOSITORY = Symbol('TEAM_REPOSITORY');
export const STAFF_REPOSITORY = Symbol('STAFF_REPOSITORY');
export const PROJECT_REPOSITORY = Symbol('PROJECT_REPOSITORY');
export const DEAL_REPOSITORY = Symbol('DEAL_REPOSITORY');
export const TARGET_REPOSITORY = Symbol('TARGET_REPOSITORY');
export const COMMISSION_REPOSITORY = Symbol('COMMISSION_REPOSITORY');

// ── Planning ──
export const EXEC_PLAN_REPOSITORY = Symbol('EXEC_PLAN_REPOSITORY');
export const EXEC_KPI_REPOSITORY = Symbol('EXEC_KPI_REPOSITORY');
export const SALE_PLAN_REPOSITORY = Symbol('SALE_PLAN_REPOSITORY');
export const MKT_PLAN_REPOSITORY = Symbol('MKT_PLAN_REPOSITORY');

// ── Sync & Audit ──
export const BIZFLY_SYNC_REPOSITORY = Symbol('BIZFLY_SYNC_REPOSITORY');
export const AUDIT_LOG_REPOSITORY = Symbol('AUDIT_LOG_REPOSITORY');

// ── Auth ──
export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

// ── Daily Metrics ──
export const SALES_DAILY_REPOSITORY = Symbol('SALES_DAILY_REPOSITORY');
export const PIPELINE_SNAPSHOT_REPOSITORY = Symbol('PIPELINE_SNAPSHOT_REPOSITORY');
