/**
 * Prisma Adapters — Auth, Planning, Sync entities
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import {
  IUserRepository, IExecPlanRepository, ISalePlanRepository,
  IMktPlanRepository, IBizflySyncRepository, IAuditLogRepository,
  ISalesDailyRepository, IPipelineSnapshotRepository,
  UserEntity, ExecPlanLatestEntity, ExecKpiLatestEntity,
  SalePlanLatestEntity, SalePlanHeaderEntity,
  MktPlanHeaderEntity, BizflySyncLogEntity, AuditLogEntity,
  SalesDailyEntity, PipelineSnapshotEntity,
} from '../../entity-repositories';

// ── USER (Auth) ──
@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: Record<string, any>): Promise<UserEntity[]> {
    const where: any = {};
    if (filters?.role) where.role = filters.role;
    if (filters?.department) where.department = filters.department;
    return this.prisma.user.findMany({ where }) as any;
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.prisma.user.findUnique({ where: { id } }) as any;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.prisma.user.findUnique({ where: { email } }) as any;
  }

  async create(data: Partial<UserEntity>): Promise<UserEntity> {
    return this.prisma.user.create({ data: data as any }) as any;
  }

  async update(id: string, data: Partial<UserEntity>): Promise<UserEntity> {
    return this.prisma.user.update({ where: { id }, data: data as any }) as any;
  }

  async delete(id: string): Promise<UserEntity> {
    return this.prisma.user.delete({ where: { id } }) as any;
  }

  async count(filters?: Record<string, any>): Promise<number> {
    return this.prisma.user.count({ where: filters || {} });
  }
}

// ── EXEC PLANNING ──
@Injectable()
export class PrismaExecPlanRepository implements IExecPlanRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: Record<string, any>): Promise<ExecPlanLatestEntity[]> {
    const where: any = {};
    if (filters?.year) where.year = filters.year;
    if (filters?.scenarioKey) where.scenarioKey = filters.scenarioKey;
    return this.prisma.execPlanLatest.findMany({ where }) as any;
  }

  async findById(id: string): Promise<ExecPlanLatestEntity | null> {
    return this.prisma.execPlanLatest.findUnique({ where: { id } }) as any;
  }

  async findByCompositeKey(year: number, scenarioKey: string, tabKey: string): Promise<ExecPlanLatestEntity | null> {
    return this.prisma.execPlanLatest.findUnique({
      where: { year_scenarioKey_tabKey: { year, scenarioKey, tabKey } },
    }) as any;
  }

  async create(data: Partial<ExecPlanLatestEntity>): Promise<ExecPlanLatestEntity> {
    return this.prisma.execPlanLatest.create({ data: data as any }) as any;
  }

  async update(id: string, data: Partial<ExecPlanLatestEntity>): Promise<ExecPlanLatestEntity> {
    return this.prisma.execPlanLatest.update({ where: { id }, data: data as any }) as any;
  }

  async upsert(
    where: Record<string, any>,
    create: Partial<ExecPlanLatestEntity>,
    updateData: Partial<ExecPlanLatestEntity>,
  ): Promise<ExecPlanLatestEntity> {
    return this.prisma.execPlanLatest.upsert({
      where: { year_scenarioKey_tabKey: where as any },
      create: create as any,
      update: updateData as any,
    }) as any;
  }

  async delete(id: string): Promise<ExecPlanLatestEntity> {
    return this.prisma.execPlanLatest.delete({ where: { id } }) as any;
  }

  async count(filters?: Record<string, any>): Promise<number> {
    return this.prisma.execPlanLatest.count({ where: filters || {} });
  }

  async getKpis(year: number, scenarioKey: string, tabKey: string): Promise<ExecKpiLatestEntity[]> {
    return this.prisma.execKpiLatest.findMany({
      where: { year, scenarioKey, tabKey },
    }) as any;
  }
}

// ── SALE PLANNING ──
@Injectable()
export class PrismaSalePlanRepository implements ISalePlanRepository {
  constructor(private prisma: PrismaService) {}

  async getLatest(year: number, scenarioKey: string): Promise<SalePlanLatestEntity | null> {
    return this.prisma.salePlanLatest.findUnique({
      where: { year_scenarioKey: { year, scenarioKey } },
    }) as any;
  }

  async getHeader(planId: string): Promise<SalePlanHeaderEntity | null> {
    return this.prisma.salePlanHeader.findFirst({ where: { planId } }) as any;
  }

  async getMonths(planId: string): Promise<any[]> {
    return this.prisma.salePlanMonth.findMany({ where: { planId }, orderBy: { month: 'asc' } });
  }

  async getTeams(planId: string): Promise<any[]> {
    return this.prisma.salePlanTeam.findMany({ where: { planId }, orderBy: { sortOrder: 'asc' } });
  }

  async getStaff(planId: string): Promise<any[]> {
    return this.prisma.salePlanStaff.findMany({ where: { planId } });
  }
}

// ── MARKETING PLANNING ──
@Injectable()
export class PrismaMktPlanRepository implements IMktPlanRepository {
  constructor(private prisma: PrismaService) {}

  async getHeader(planId: string): Promise<MktPlanHeaderEntity | null> {
    return this.prisma.mktPlanHeader.findUnique({ where: { planId } }) as any;
  }

  async getChannelBudgets(planId: string): Promise<any[]> {
    return this.prisma.mktPlanChannelBudget.findMany({ where: { planId } });
  }

  async getKpiTargets(planId: string): Promise<any[]> {
    return this.prisma.mktPlanKpiTarget.findMany({ where: { planId } });
  }

  async getAssumptions(planId: string): Promise<any[]> {
    return this.prisma.mktPlanAssumption.findMany({ where: { planId } });
  }
}

// ── BIZFLY SYNC ──
@Injectable()
export class PrismaBizflySyncRepository implements IBizflySyncRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: Record<string, any>): Promise<BizflySyncLogEntity[]> {
    return this.prisma.bizflySyncLog.findMany({
      orderBy: { startedAt: 'desc' },
      take: filters?.limit || 20,
    }) as any;
  }

  async findById(id: string): Promise<BizflySyncLogEntity | null> {
    return this.prisma.bizflySyncLog.findUnique({ where: { id } }) as any;
  }

  async findLatest(): Promise<BizflySyncLogEntity | null> {
    return this.prisma.bizflySyncLog.findFirst({ orderBy: { startedAt: 'desc' } }) as any;
  }

  async create(data: Partial<BizflySyncLogEntity>): Promise<BizflySyncLogEntity> {
    return this.prisma.bizflySyncLog.create({ data: data as any }) as any;
  }

  async update(id: string, data: Partial<BizflySyncLogEntity>): Promise<BizflySyncLogEntity> {
    return this.prisma.bizflySyncLog.update({ where: { id }, data: data as any }) as any;
  }

  async delete(id: string): Promise<BizflySyncLogEntity> {
    return this.prisma.bizflySyncLog.delete({ where: { id } }) as any;
  }

  async count(filters?: Record<string, any>): Promise<number> {
    return this.prisma.bizflySyncLog.count({ where: filters || {} });
  }

  async countByStatus(status: string): Promise<number> {
    return this.prisma.bizflySyncLog.count({ where: { status } });
  }
}

// ── AUDIT LOG ──
@Injectable()
export class PrismaAuditLogRepository implements IAuditLogRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: Record<string, any>): Promise<AuditLogEntity[]> {
    const where: any = {};
    if (filters?.entity) where.entity = filters.entity;
    if (filters?.action) where.action = filters.action;
    return this.prisma.auditLog.findMany({ where, orderBy: { createdAt: 'desc' } }) as any;
  }

  async findById(id: string): Promise<AuditLogEntity | null> {
    return this.prisma.auditLog.findUnique({ where: { id } }) as any;
  }

  async create(data: Partial<AuditLogEntity>): Promise<AuditLogEntity> {
    return this.prisma.auditLog.create({ data: data as any }) as any;
  }

  async update(id: string, data: Partial<AuditLogEntity>): Promise<AuditLogEntity> {
    return this.prisma.auditLog.update({ where: { id }, data: data as any }) as any;
  }

  async delete(id: string): Promise<AuditLogEntity> {
    return this.prisma.auditLog.delete({ where: { id } }) as any;
  }

  async count(filters?: Record<string, any>): Promise<number> {
    return this.prisma.auditLog.count({ where: filters || {} });
  }
}

// ── SALES DAILY ──
@Injectable()
export class PrismaSalesDailyRepository implements ISalesDailyRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: Record<string, any>): Promise<SalesDailyEntity[]> {
    const where: any = {};
    if (filters?.year) where.year = filters.year;
    if (filters?.month) where.month = filters.month;
    if (filters?.teamId) where.teamId = filters.teamId;
    if (filters?.staffId) where.staffId = filters.staffId;
    return this.prisma.factSalesDaily.findMany({ where, orderBy: { date: 'desc' } }) as any;
  }

  async findById(id: string): Promise<SalesDailyEntity | null> {
    return this.prisma.factSalesDaily.findUnique({ where: { id } }) as any;
  }

  async create(data: Partial<SalesDailyEntity>): Promise<SalesDailyEntity> {
    return this.prisma.factSalesDaily.create({ data: data as any }) as any;
  }

  async update(id: string, data: Partial<SalesDailyEntity>): Promise<SalesDailyEntity> {
    return this.prisma.factSalesDaily.update({ where: { id }, data: data as any }) as any;
  }

  async delete(id: string): Promise<SalesDailyEntity> {
    return this.prisma.factSalesDaily.delete({ where: { id } }) as any;
  }

  async count(filters?: Record<string, any>): Promise<number> {
    return this.prisma.factSalesDaily.count({ where: filters || {} });
  }
}

// ── PIPELINE SNAPSHOT ──
@Injectable()
export class PrismaPipelineSnapshotRepository implements IPipelineSnapshotRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: Record<string, any>): Promise<PipelineSnapshotEntity[]> {
    const where: any = {};
    if (filters?.year) where.year = filters.year;
    if (filters?.month) where.month = filters.month;
    if (filters?.teamId) where.teamId = filters.teamId;
    return this.prisma.factPipelineSnapshot.findMany({ where, orderBy: { snapshotDate: 'desc' } }) as any;
  }

  async findById(id: string): Promise<PipelineSnapshotEntity | null> {
    return this.prisma.factPipelineSnapshot.findUnique({ where: { id } }) as any;
  }

  async create(data: Partial<PipelineSnapshotEntity>): Promise<PipelineSnapshotEntity> {
    return this.prisma.factPipelineSnapshot.create({ data: data as any }) as any;
  }

  async update(id: string, data: Partial<PipelineSnapshotEntity>): Promise<PipelineSnapshotEntity> {
    return this.prisma.factPipelineSnapshot.update({ where: { id }, data: data as any }) as any;
  }

  async delete(id: string): Promise<PipelineSnapshotEntity> {
    return this.prisma.factPipelineSnapshot.delete({ where: { id } }) as any;
  }

  async count(filters?: Record<string, any>): Promise<number> {
    return this.prisma.factPipelineSnapshot.count({ where: filters || {} });
  }
}
