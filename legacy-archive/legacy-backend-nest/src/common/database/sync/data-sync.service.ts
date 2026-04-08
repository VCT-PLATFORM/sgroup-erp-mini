/**
 * DataSyncService — Bidirectional sync engine between Google Sheets and Prisma DB.
 * 
 * Usage:
 *   POST /admin/sync/sheets-to-db   → Migrate all data from Sheets → DB
 *   POST /admin/sync/db-to-sheets   → Export all data from DB → Sheets
 *   GET  /admin/sync/status         → Last sync status
 */
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { SheetsClient } from '../adapters/sheets/sheets-client';
import {
  SHEET_NAMES,
  CUSTOMER_COLUMNS, ACTIVITY_COLUMNS, APPOINTMENT_COLUMNS,
  PRODUCT_COLUMNS, TEAM_COLUMNS, STAFF_COLUMNS,
  DEAL_COLUMNS, PROJECT_COLUMNS, TARGET_COLUMNS,
  COMMISSION_COLUMNS, USER_COLUMNS,
  ColumnMapping, rowToEntity, entityToRow, getHeaders,
} from '../adapters/sheets/column-mappings';

interface SyncResult {
  entity: string;
  direction: 'sheets-to-db' | 'db-to-sheets';
  total: number;
  synced: number;
  errors: number;
  errorDetails: string[];
}

interface SyncStatus {
  lastSyncAt: Date | null;
  direction: string | null;
  results: SyncResult[];
  isRunning: boolean;
}

// Map entity → { sheetName, prismaModel, columns }
interface EntityMapping {
  sheetName: string;
  prismaModel: string;
  columns: ColumnMapping[];
}

const ENTITY_MAPPINGS: Record<string, EntityMapping> = {
  Customer:   { sheetName: SHEET_NAMES.Customer,   prismaModel: 'customer',          columns: CUSTOMER_COLUMNS },
  Activity:   { sheetName: SHEET_NAMES.Activity,   prismaModel: 'salesActivity',     columns: ACTIVITY_COLUMNS },
  Appointment:{ sheetName: SHEET_NAMES.Appointment, prismaModel: 'appointment',      columns: APPOINTMENT_COLUMNS },
  Product:    { sheetName: SHEET_NAMES.Product,    prismaModel: 'propertyProduct',   columns: PRODUCT_COLUMNS },
  Team:       { sheetName: SHEET_NAMES.Team,       prismaModel: 'salesTeam',         columns: TEAM_COLUMNS },
  Staff:      { sheetName: SHEET_NAMES.Staff,      prismaModel: 'salesStaff',        columns: STAFF_COLUMNS },
  Project:    { sheetName: SHEET_NAMES.Project,    prismaModel: 'dimProject',        columns: PROJECT_COLUMNS },
  Deal:       { sheetName: SHEET_NAMES.Deal,       prismaModel: 'factDeal',          columns: DEAL_COLUMNS },
  Target:     { sheetName: SHEET_NAMES.Target,     prismaModel: 'salesTargetMonthly',columns: TARGET_COLUMNS },
  Commission: { sheetName: SHEET_NAMES.Commission, prismaModel: 'commissionRecord',  columns: COMMISSION_COLUMNS },
  User:       { sheetName: SHEET_NAMES.User,       prismaModel: 'user',             columns: USER_COLUMNS },
};

@Injectable()
export class DataSyncService {
  private readonly logger = new Logger(DataSyncService.name);
  private lastStatus: SyncStatus = {
    lastSyncAt: null, direction: null, results: [], isRunning: false,
  };

  constructor(
    private prisma: PrismaService,
    private sheetsClient: SheetsClient,
  ) {}

  /** Get current sync status */
  getStatus(): SyncStatus {
    return this.lastStatus;
  }

  /**
   * Sync all data from Google Sheets → Prisma DB.
   * Uses upsert to avoid duplicates.
   */
  async syncSheetsToDB(entities?: string[]): Promise<SyncResult[]> {
    this.lastStatus.isRunning = true;
    const results: SyncResult[] = [];
    const entitiesToSync = entities || Object.keys(ENTITY_MAPPINGS);

    for (const entityName of entitiesToSync) {
      const mapping = ENTITY_MAPPINGS[entityName];
      if (!mapping) {
        this.logger.warn(`Unknown entity: ${entityName}`);
        continue;
      }

      const result: SyncResult = {
        entity: entityName,
        direction: 'sheets-to-db',
        total: 0, synced: 0, errors: 0, errorDetails: [],
      };

      try {
        const rows = await this.sheetsClient.readSheet(mapping.sheetName, false);
        const validRows = rows.filter(r => r.id); // Skip empty rows
        result.total = validRows.length;

        for (const row of validRows) {
          try {
            const entity = rowToEntity<any>(row, mapping.columns);
            const prismaModel = (this.prisma as any)[mapping.prismaModel];

            // Prepare data: remove null/undefined fields, handle dates
            const data = this.cleanDataForPrisma(entity, mapping.columns);
            const { id, ...dataWithoutId } = data;

            await prismaModel.upsert({
              where: { id },
              create: { id, ...dataWithoutId },
              update: dataWithoutId,
            });
            result.synced++;
          } catch (err: any) {
            result.errors++;
            result.errorDetails.push(`Row ${row._rowIndex}: ${err.message}`);
            this.logger.warn(`Sync error for ${entityName} row ${row._rowIndex}: ${err.message}`);
          }
        }
      } catch (err: any) {
        result.errors++;
        result.errorDetails.push(`Sheet read error: ${err.message}`);
        this.logger.error(`Failed to read sheet ${mapping.sheetName}: ${err.message}`);
      }

      results.push(result);
      this.logger.log(`${entityName}: ${result.synced}/${result.total} synced, ${result.errors} errors`);
    }

    this.lastStatus = {
      lastSyncAt: new Date(),
      direction: 'sheets-to-db',
      results,
      isRunning: false,
    };

    return results;
  }

  /**
   * Sync all data from Prisma DB → Google Sheets.
   * Replaces entire sheet content.
   */
  async syncDBToSheets(entities?: string[]): Promise<SyncResult[]> {
    this.lastStatus.isRunning = true;
    const results: SyncResult[] = [];
    const entitiesToSync = entities || Object.keys(ENTITY_MAPPINGS);

    for (const entityName of entitiesToSync) {
      const mapping = ENTITY_MAPPINGS[entityName];
      if (!mapping) continue;

      const result: SyncResult = {
        entity: entityName,
        direction: 'db-to-sheets',
        total: 0, synced: 0, errors: 0, errorDetails: [],
      };

      try {
        const prismaModel = (this.prisma as any)[mapping.prismaModel];
        const dbRecords = await prismaModel.findMany();
        result.total = dbRecords.length;

        // Ensure sheet tab exists
        const headers = getHeaders(mapping.columns);
        await this.sheetsClient.ensureSheet(mapping.sheetName, headers);

        // Convert to rows
        const rows = dbRecords.map((record: any) =>
          entityToRow(record, mapping.columns),
        );

        // Write all at once
        await this.sheetsClient.writeSheet(mapping.sheetName, headers, rows);
        result.synced = rows.length;
      } catch (err: any) {
        result.errors++;
        result.errorDetails.push(`Export error: ${err.message}`);
        this.logger.error(`Failed to export ${entityName}: ${err.message}`);
      }

      results.push(result);
      this.logger.log(`${entityName}: ${result.synced}/${result.total} exported, ${result.errors} errors`);
    }

    this.lastStatus = {
      lastSyncAt: new Date(),
      direction: 'db-to-sheets',
      results,
      isRunning: false,
    };

    return results;
  }

  /**
   * Initialize sheet tabs with correct headers (for new spreadsheets).
   */
  async initializeSheets(): Promise<string[]> {
    const created: string[] = [];
    for (const [name, mapping] of Object.entries(ENTITY_MAPPINGS)) {
      try {
        await this.sheetsClient.ensureSheet(
          mapping.sheetName,
          getHeaders(mapping.columns),
        );
        created.push(mapping.sheetName);
      } catch (err: any) {
        this.logger.warn(`Failed to create sheet ${mapping.sheetName}: ${err.message}`);
      }
    }
    return created;
  }

  /**
   * Clean entity data for Prisma upsert (handle types, remove invalid fields).
   */
  private cleanDataForPrisma(entity: any, columns: ColumnMapping[]): any {
    const cleaned: any = {};
    for (const col of columns) {
      let val = entity[col.entityField];
      if (val === null || val === undefined) continue;

      switch (col.type) {
        case 'date':
          val = val instanceof Date ? val : new Date(val);
          if (isNaN(val.getTime())) continue; // Skip invalid dates
          break;
        case 'number':
          val = parseInt(val, 10);
          if (isNaN(val)) val = 0;
          break;
        case 'float':
          val = parseFloat(val);
          if (isNaN(val)) val = 0;
          break;
        case 'boolean':
          val = val === true || val === 'TRUE' || val === '1';
          break;
      }
      cleaned[col.entityField] = val;
    }
    return cleaned;
  }
}
