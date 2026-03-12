/**
 * Prisma Adapter barrel export
 */
export { PrismaCustomerRepository } from './prisma-customer.repository';
export { PrismaActivityRepository } from './prisma-activity.repository';
export { PrismaAppointmentRepository } from './prisma-appointment.repository';
export { PrismaProductRepository } from './prisma-product.repository';
export {
  PrismaTeamRepository,
  PrismaStaffRepository,
  PrismaProjectRepository,
  PrismaDealRepository,
  PrismaTargetRepository,
  PrismaCommissionRepository,
} from './prisma-sales-ops.repository';
export {
  PrismaUserRepository,
  PrismaExecPlanRepository,
  PrismaSalePlanRepository,
  PrismaMktPlanRepository,
  PrismaBizflySyncRepository,
  PrismaAuditLogRepository,
  PrismaSalesDailyRepository,
  PrismaPipelineSnapshotRepository,
} from './prisma-planning-auth.repository';
