/**
 * Google Sheets Adapters — Planning repositories (Exec, Sales, Marketing).
 * These have different interfaces from standard CRUD repos.
 */
import { Injectable } from '@nestjs/common';
import { SheetsClient } from './sheets-client';
import { BaseSheetsRepository } from './base-sheets.repository';
import {
  IExecPlanRepository, ISalePlanRepository, IMktPlanRepository,
  ExecPlanLatestEntity, ExecKpiLatestEntity,
  SalePlanLatestEntity, SalePlanHeaderEntity, MktPlanHeaderEntity,
} from '../../entity-repositories';
import { ColumnMapping, rowToEntity } from './column-mappings';
import { SHEET_NAMES } from './column-mappings';

const EXEC_PLAN_COLUMNS: ColumnMapping[] = [
  { sheetHeader: 'id', entityField: 'id', type: 'string', required: true },
  { sheetHeader: 'year', entityField: 'year', type: 'number' },
  { sheetHeader: 'scenarioKey', entityField: 'scenarioKey', type: 'string' },
  { sheetHeader: 'tabKey', entityField: 'tabKey', type: 'string' },
  { sheetHeader: 'latestPlanId', entityField: 'latestPlanId', type: 'string' },
  { sheetHeader: 'latestBundleId', entityField: 'latestBundleId', type: 'string' },
  { sheetHeader: 'updatedAt', entityField: 'updatedAt', type: 'date' },
  { sheetHeader: 'updatedBy', entityField: 'updatedBy', type: 'string' },
  { sheetHeader: 'schemaVersion', entityField: 'schemaVersion', type: 'string' },
  { sheetHeader: 'rawJson', entityField: 'rawJson', type: 'string' },
  { sheetHeader: 'note', entityField: 'note', type: 'string' },
];

const EXEC_KPI_COLUMNS: ColumnMapping[] = [
  { sheetHeader: 'id', entityField: 'id', type: 'string', required: true },
  { sheetHeader: 'year', entityField: 'year', type: 'number' },
  { sheetHeader: 'scenarioKey', entityField: 'scenarioKey', type: 'string' },
  { sheetHeader: 'tabKey', entityField: 'tabKey', type: 'string' },
  { sheetHeader: 'kpiKey', entityField: 'kpiKey', type: 'string' },
  { sheetHeader: 'value', entityField: 'value', type: 'float' },
  { sheetHeader: 'unit', entityField: 'unit', type: 'string' },
  { sheetHeader: 'sourcePlanId', entityField: 'sourcePlanId', type: 'string' },
  { sheetHeader: 'calcVersion', entityField: 'calcVersion', type: 'string' },
  { sheetHeader: 'updatedAt', entityField: 'updatedAt', type: 'date' },
  { sheetHeader: 'updatedBy', entityField: 'updatedBy', type: 'string' },
  { sheetHeader: 'note', entityField: 'note', type: 'string' },
];

// ── EXEC PLAN ──
@Injectable()
export class SheetsExecPlanRepository
  extends BaseSheetsRepository<ExecPlanLatestEntity>
  implements IExecPlanRepository
{
  constructor(client: SheetsClient) {
    super(client, SHEET_NAMES.ExecPlanLatest, EXEC_PLAN_COLUMNS);
  }

  async findByCompositeKey(year: number, scenarioKey: string, tabKey: string): Promise<ExecPlanLatestEntity | null> {
    const all = await this.findAll({ year, scenarioKey, tabKey } as any);
    return all[0] || null;
  }

  async upsert(
    where: Record<string, any>,
    create: Partial<ExecPlanLatestEntity>,
    updateData: Partial<ExecPlanLatestEntity>,
  ): Promise<ExecPlanLatestEntity> {
    const existing = await this.findByCompositeKey(where.year, where.scenarioKey, where.tabKey);
    if (existing) {
      return this.update(existing.id, updateData);
    }
    return this.create(create);
  }

  async getKpis(year: number, scenarioKey: string, tabKey: string): Promise<ExecKpiLatestEntity[]> {
    const rows = await this.client.readSheet(SHEET_NAMES.ExecKpiLatest);
    return rows
      .filter(r => r.id && String(r.year) === String(year) &&
        r.scenarioKey === scenarioKey && r.tabKey === tabKey)
      .map(r => rowToEntity<ExecKpiLatestEntity>(r, EXEC_KPI_COLUMNS));
  }
}

// ── SALE PLAN ──

const SALE_PLAN_LATEST_COLUMNS: ColumnMapping[] = [
  { sheetHeader: 'id', entityField: 'id', type: 'string', required: true },
  { sheetHeader: 'year', entityField: 'year', type: 'number' },
  { sheetHeader: 'scenarioKey', entityField: 'scenarioKey', type: 'string' },
  { sheetHeader: 'planId', entityField: 'planId', type: 'string' },
  { sheetHeader: 'updatedAt', entityField: 'updatedAt', type: 'date' },
  { sheetHeader: 'updatedBy', entityField: 'updatedBy', type: 'string' },
  { sheetHeader: 'version', entityField: 'version', type: 'string' },
  { sheetHeader: 'rawJson', entityField: 'rawJson', type: 'string' },
  { sheetHeader: 'note', entityField: 'note', type: 'string' },
];

const SALE_PLAN_HEADER_COLUMNS: ColumnMapping[] = [
  { sheetHeader: 'id', entityField: 'id', type: 'string', required: true },
  { sheetHeader: 'planId', entityField: 'planId', type: 'string' },
  { sheetHeader: 'year', entityField: 'year', type: 'number' },
  { sheetHeader: 'scenarioKey', entityField: 'scenarioKey', type: 'string' },
  { sheetHeader: 'ownerEmail', entityField: 'ownerEmail', type: 'string' },
  { sheetHeader: 'status', entityField: 'status', type: 'string' },
  { sheetHeader: 'targetGMV', entityField: 'targetGMV', type: 'float' },
  { sheetHeader: 'avgDealValue', entityField: 'avgDealValue', type: 'float' },
  { sheetHeader: 'headcount', entityField: 'headcount', type: 'number' },
  { sheetHeader: 'marketingRate', entityField: 'marketingRate', type: 'float' },
  { sheetHeader: 'rateDeal', entityField: 'rateDeal', type: 'float' },
  { sheetHeader: 'rateBooking', entityField: 'rateBooking', type: 'float' },
  { sheetHeader: 'rateMeeting', entityField: 'rateMeeting', type: 'float' },
  { sheetHeader: 'note', entityField: 'note', type: 'string' },
  { sheetHeader: 'createdAt', entityField: 'createdAt', type: 'date' },
  { sheetHeader: 'updatedAt', entityField: 'updatedAt', type: 'date' },
];

@Injectable()
export class SheetsSalePlanRepository implements ISalePlanRepository {
  constructor(private client: SheetsClient) {}

  async getLatest(year: number, scenarioKey: string): Promise<SalePlanLatestEntity | null> {
    const rows = await this.client.readSheet(SHEET_NAMES.SalePlanLatest);
    const match = rows.find(r => String(r.year) === String(year) && r.scenarioKey === scenarioKey);
    return match ? rowToEntity<SalePlanLatestEntity>(match, SALE_PLAN_LATEST_COLUMNS) : null;
  }

  async getHeader(planId: string): Promise<SalePlanHeaderEntity | null> {
    const rows = await this.client.readSheet(SHEET_NAMES.SalePlanHeader);
    const match = rows.find(r => r.planId === planId);
    return match ? rowToEntity<SalePlanHeaderEntity>(match, SALE_PLAN_HEADER_COLUMNS) : null;
  }

  async getMonths(planId: string): Promise<any[]> {
    const rows = await this.client.filterRows(SHEET_NAMES.SalePlanMonth, { planId });
    return rows.sort((a, b) => Number(a.month) - Number(b.month));
  }

  async getTeams(planId: string): Promise<any[]> {
    const rows = await this.client.filterRows(SHEET_NAMES.SalePlanTeam, { planId });
    return rows.sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
  }

  async getStaff(planId: string): Promise<any[]> {
    return this.client.filterRows(SHEET_NAMES.SalePlanStaff, { planId });
  }
}

// ── MKT PLAN ──

const MKT_HEADER_COLUMNS: ColumnMapping[] = [
  { sheetHeader: 'id', entityField: 'id', type: 'string', required: true },
  { sheetHeader: 'planId', entityField: 'planId', type: 'string' },
  { sheetHeader: 'year', entityField: 'year', type: 'number' },
  { sheetHeader: 'scenarioKey', entityField: 'scenarioKey', type: 'string' },
  { sheetHeader: 'ownerEmail', entityField: 'ownerEmail', type: 'string' },
  { sheetHeader: 'status', entityField: 'status', type: 'string' },
  { sheetHeader: 'totalBudgetVnd', entityField: 'totalBudgetVnd', type: 'float' },
  { sheetHeader: 'currency', entityField: 'currency', type: 'string' },
  { sheetHeader: 'note', entityField: 'note', type: 'string' },
  { sheetHeader: 'createdAt', entityField: 'createdAt', type: 'date' },
  { sheetHeader: 'updatedAt', entityField: 'updatedAt', type: 'date' },
];

@Injectable()
export class SheetsMktPlanRepository implements IMktPlanRepository {
  constructor(private client: SheetsClient) {}

  async getHeader(planId: string): Promise<MktPlanHeaderEntity | null> {
    const rows = await this.client.readSheet(SHEET_NAMES.MktPlanHeader);
    const match = rows.find(r => r.planId === planId);
    return match ? rowToEntity<MktPlanHeaderEntity>(match, MKT_HEADER_COLUMNS) : null;
  }

  async getChannelBudgets(planId: string): Promise<any[]> {
    return this.client.filterRows(SHEET_NAMES.MktPlanChannelBudget, { planId });
  }

  async getKpiTargets(planId: string): Promise<any[]> {
    return this.client.filterRows(SHEET_NAMES.MktPlanKpiTarget, { planId });
  }

  async getAssumptions(planId: string): Promise<any[]> {
    return this.client.filterRows(SHEET_NAMES.MktPlanAssumption, { planId });
  }
}
