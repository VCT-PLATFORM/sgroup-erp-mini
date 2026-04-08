/**
 * DatabaseModule — Dynamic adapter selection based on DB_ADAPTER env var.
 * Registers the correct repository implementations globally.
 *
 * Usage in .env:
 *   DB_ADAPTER=google-sheets  → Uses Google Sheets
 *   DB_ADAPTER=prisma         → Uses Prisma (PostgreSQL/Supabase/Neon)
 */
import { Module, Global, DynamicModule, Provider, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../../prisma/prisma.module';
import { PrismaService } from '../../prisma/prisma.service';

// Tokens
import {
  CUSTOMER_REPOSITORY, ACTIVITY_REPOSITORY, APPOINTMENT_REPOSITORY,
  PRODUCT_REPOSITORY, TEAM_REPOSITORY, STAFF_REPOSITORY,
  PROJECT_REPOSITORY, DEAL_REPOSITORY, TARGET_REPOSITORY,
  COMMISSION_REPOSITORY, USER_REPOSITORY, BIZFLY_SYNC_REPOSITORY,
  AUDIT_LOG_REPOSITORY, SALES_DAILY_REPOSITORY, PIPELINE_SNAPSHOT_REPOSITORY,
  EXEC_PLAN_REPOSITORY, SALE_PLAN_REPOSITORY, MKT_PLAN_REPOSITORY,
} from './repository-tokens';

// Prisma Adapters
import {
  PrismaCustomerRepository, PrismaActivityRepository,
  PrismaAppointmentRepository, PrismaProductRepository,
  PrismaTeamRepository, PrismaStaffRepository,
  PrismaProjectRepository, PrismaDealRepository,
  PrismaTargetRepository, PrismaCommissionRepository,
  PrismaUserRepository, PrismaExecPlanRepository,
  PrismaSalePlanRepository, PrismaMktPlanRepository,
  PrismaBizflySyncRepository, PrismaAuditLogRepository,
  PrismaSalesDailyRepository, PrismaPipelineSnapshotRepository,
} from './adapters/prisma';

// Sheets Adapters
import { SheetsClient } from './adapters/sheets/sheets-client';
import {
  SheetsCustomerRepository, SheetsActivityRepository,
  SheetsAppointmentRepository, SheetsProductRepository,
  SheetsTeamRepository, SheetsStaffRepository,
  SheetsProjectRepository, SheetsDealRepository,
  SheetsTargetRepository, SheetsCommissionRepository,
  SheetsUserRepository, SheetsBizflySyncRepository,
  SheetsAuditLogRepository, SheetsSalesDailyRepository,
  SheetsPipelineSnapshotRepository,
  SheetsExecPlanRepository, SheetsSalePlanRepository,
  SheetsMktPlanRepository,
} from './adapters/sheets';

type AdapterType = 'prisma' | 'google-sheets';

const logger = new Logger('DatabaseModule');

/**
 * Build provider array for Prisma adapter.
 */
function buildPrismaProviders(): Provider[] {
  return [
    { provide: CUSTOMER_REPOSITORY, useClass: PrismaCustomerRepository },
    { provide: ACTIVITY_REPOSITORY, useClass: PrismaActivityRepository },
    { provide: APPOINTMENT_REPOSITORY, useClass: PrismaAppointmentRepository },
    { provide: PRODUCT_REPOSITORY, useClass: PrismaProductRepository },
    { provide: TEAM_REPOSITORY, useClass: PrismaTeamRepository },
    { provide: STAFF_REPOSITORY, useClass: PrismaStaffRepository },
    { provide: PROJECT_REPOSITORY, useClass: PrismaProjectRepository },
    { provide: DEAL_REPOSITORY, useClass: PrismaDealRepository },
    { provide: TARGET_REPOSITORY, useClass: PrismaTargetRepository },
    { provide: COMMISSION_REPOSITORY, useClass: PrismaCommissionRepository },
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
    { provide: EXEC_PLAN_REPOSITORY, useClass: PrismaExecPlanRepository },
    { provide: SALE_PLAN_REPOSITORY, useClass: PrismaSalePlanRepository },
    { provide: MKT_PLAN_REPOSITORY, useClass: PrismaMktPlanRepository },
    { provide: BIZFLY_SYNC_REPOSITORY, useClass: PrismaBizflySyncRepository },
    { provide: AUDIT_LOG_REPOSITORY, useClass: PrismaAuditLogRepository },
    { provide: SALES_DAILY_REPOSITORY, useClass: PrismaSalesDailyRepository },
    { provide: PIPELINE_SNAPSHOT_REPOSITORY, useClass: PrismaPipelineSnapshotRepository },
  ];
}

/**
 * Build provider array for Google Sheets adapter.
 */
function buildSheetsProviders(): Provider[] {
  return [
    SheetsClient,
    { provide: CUSTOMER_REPOSITORY, useFactory: (c: SheetsClient) => new SheetsCustomerRepository(c), inject: [SheetsClient] },
    { provide: ACTIVITY_REPOSITORY, useFactory: (c: SheetsClient) => new SheetsActivityRepository(c), inject: [SheetsClient] },
    { provide: APPOINTMENT_REPOSITORY, useFactory: (c: SheetsClient) => new SheetsAppointmentRepository(c), inject: [SheetsClient] },
    { provide: PRODUCT_REPOSITORY, useFactory: (c: SheetsClient) => new SheetsProductRepository(c), inject: [SheetsClient] },
    { provide: TEAM_REPOSITORY, useFactory: (c: SheetsClient) => new SheetsTeamRepository(c), inject: [SheetsClient] },
    { provide: STAFF_REPOSITORY, useFactory: (c: SheetsClient) => new SheetsStaffRepository(c), inject: [SheetsClient] },
    { provide: PROJECT_REPOSITORY, useFactory: (c: SheetsClient) => new SheetsProjectRepository(c), inject: [SheetsClient] },
    { provide: DEAL_REPOSITORY, useFactory: (c: SheetsClient) => new SheetsDealRepository(c), inject: [SheetsClient] },
    { provide: TARGET_REPOSITORY, useFactory: (c: SheetsClient) => new SheetsTargetRepository(c), inject: [SheetsClient] },
    { provide: COMMISSION_REPOSITORY, useFactory: (c: SheetsClient) => new SheetsCommissionRepository(c), inject: [SheetsClient] },
    { provide: USER_REPOSITORY, useFactory: (c: SheetsClient) => new SheetsUserRepository(c), inject: [SheetsClient] },
    { provide: EXEC_PLAN_REPOSITORY, useFactory: (c: SheetsClient) => new SheetsExecPlanRepository(c), inject: [SheetsClient] },
    { provide: SALE_PLAN_REPOSITORY, useFactory: (c: SheetsClient) => new SheetsSalePlanRepository(c), inject: [SheetsClient] },
    { provide: MKT_PLAN_REPOSITORY, useFactory: (c: SheetsClient) => new SheetsMktPlanRepository(c), inject: [SheetsClient] },
    { provide: BIZFLY_SYNC_REPOSITORY, useFactory: (c: SheetsClient) => new SheetsBizflySyncRepository(c), inject: [SheetsClient] },
    { provide: AUDIT_LOG_REPOSITORY, useFactory: (c: SheetsClient) => new SheetsAuditLogRepository(c), inject: [SheetsClient] },
    { provide: SALES_DAILY_REPOSITORY, useFactory: (c: SheetsClient) => new SheetsSalesDailyRepository(c), inject: [SheetsClient] },
    { provide: PIPELINE_SNAPSHOT_REPOSITORY, useFactory: (c: SheetsClient) => new SheetsPipelineSnapshotRepository(c), inject: [SheetsClient] },
  ];
}

const ALL_TOKENS = [
  CUSTOMER_REPOSITORY, ACTIVITY_REPOSITORY, APPOINTMENT_REPOSITORY,
  PRODUCT_REPOSITORY, TEAM_REPOSITORY, STAFF_REPOSITORY,
  PROJECT_REPOSITORY, DEAL_REPOSITORY, TARGET_REPOSITORY,
  COMMISSION_REPOSITORY, USER_REPOSITORY, EXEC_PLAN_REPOSITORY,
  SALE_PLAN_REPOSITORY, MKT_PLAN_REPOSITORY, BIZFLY_SYNC_REPOSITORY,
  AUDIT_LOG_REPOSITORY, SALES_DAILY_REPOSITORY, PIPELINE_SNAPSHOT_REPOSITORY,
];

@Global()
@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    const adapter = (process.env.DB_ADAPTER || 'prisma') as AdapterType;
    logger.log(`🗄️  Database adapter: ${adapter.toUpperCase()}`);

    const isSheets = adapter === 'google-sheets';
    const providers = isSheets ? buildSheetsProviders() : buildPrismaProviders();
    const imports = isSheets ? [ConfigModule] : [PrismaModule, ConfigModule];

    return {
      module: DatabaseModule,
      imports,
      providers: [
        ...providers,
        // Also export PrismaService for sync & legacy use
        ...(isSheets ? [] : []),
      ],
      exports: [
        ...ALL_TOKENS,
        ...(isSheets ? [SheetsClient] : []),
      ],
    };
  }
}
