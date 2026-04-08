/**
 * Google Sheets API v4 Client — shared connection layer.
 * Handles authentication, read/write/append, caching, and row serialization.
 */
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, sheets_v4 } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

export interface SheetRow {
  _rowIndex: number; // 1-indexed position in spreadsheet (for updates)
  [key: string]: any;
}

@Injectable()
export class SheetsClient implements OnModuleInit {
  private sheets: sheets_v4.Sheets;
  private spreadsheetId: string;
  private readonly logger = new Logger(SheetsClient.name);

  // Simple TTL cache: key → { data, expiresAt }
  private cache = new Map<string, { data: any; expiresAt: number }>();
  private readonly CACHE_TTL_MS = 30_000; // 30 seconds

  constructor(private config: ConfigService) {}

  async onModuleInit() {
    const keyPath = this.config.get<string>('GOOGLE_SERVICE_ACCOUNT_KEY');
    this.spreadsheetId = this.config.get<string>('GOOGLE_SHEETS_ID', '');

    if (!keyPath || !this.spreadsheetId) {
      this.logger.warn(
        'Google Sheets config missing (GOOGLE_SERVICE_ACCOUNT_KEY / GOOGLE_SHEETS_ID). ' +
        'Sheets adapter will not work.',
      );
      return;
    }

    try {
      const resolvedPath = path.isAbsolute(keyPath) ? keyPath : path.join(process.cwd(), keyPath);
      const keyFile = JSON.parse(fs.readFileSync(resolvedPath, 'utf-8'));

      const auth = new google.auth.GoogleAuth({
        credentials: keyFile,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.sheets = google.sheets({ version: 'v4', auth });
      this.logger.log(`✅ Google Sheets client connected (spreadsheet: ${this.spreadsheetId})`);
    } catch (err: any) {
      this.logger.error(`Failed to initialize Sheets client: ${err.message}`);
    }
  }

  /** Check if the client is ready */
  isReady(): boolean {
    return !!this.sheets && !!this.spreadsheetId;
  }

  // ═════════════════════════════════════════════════════════════
  // READ OPERATIONS
  // ═════════════════════════════════════════════════════════════

  /**
   * Read all rows from a sheet tab as objects.
   * First row = headers (column names).
   */
  async readSheet(sheetName: string, useCache = true): Promise<SheetRow[]> {
    const cacheKey = `sheet:${sheetName}`;
    if (useCache) {
      const cached = this.getCache(cacheKey);
      if (cached) return cached;
    }

    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: `${sheetName}!A:ZZ`,
    });

    const rows = res.data.values;
    if (!rows || rows.length < 2) return [];

    const headers = rows[0] as string[];
    const data = rows.slice(1).map((row, idx) => {
      const obj: SheetRow = { _rowIndex: idx + 2 }; // +2 because header=1, 0-indexed
      headers.forEach((header, colIdx) => {
        obj[header] = row[colIdx] ?? null;
      });
      return obj;
    });

    this.setCache(cacheKey, data);
    return data;
  }

  /**
   * Find a single row by a column value.
   */
  async findRow(sheetName: string, column: string, value: any): Promise<SheetRow | null> {
    const rows = await this.readSheet(sheetName);
    return rows.find(r => String(r[column]) === String(value)) || null;
  }

  /**
   * Filter rows by multiple criteria.
   */
  async filterRows(sheetName: string, filters: Record<string, any>): Promise<SheetRow[]> {
    const rows = await this.readSheet(sheetName);
    return rows.filter(row => {
      return Object.entries(filters).every(([key, val]) => {
        if (val === undefined || val === null) return true;
        return String(row[key]) === String(val);
      });
    });
  }

  // ═════════════════════════════════════════════════════════════
  // WRITE OPERATIONS
  // ═════════════════════════════════════════════════════════════

  /**
   * Append a new row at the bottom of the sheet.
   */
  async appendRow(sheetName: string, data: Record<string, any>): Promise<SheetRow> {
    // First, read headers to determine column order
    const headerRes = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: `${sheetName}!1:1`,
    });

    const headers = (headerRes.data.values?.[0] as string[]) || [];
    const values = headers.map(h => this.serializeValue(data[h]));

    const appendRes = await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: `${sheetName}!A:A`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [values] },
    });

    // Invalidate cache
    this.invalidateCache(`sheet:${sheetName}`);

    // Determine the new row index from the updated range
    const updatedRange = appendRes.data.updates?.updatedRange || '';
    const rowMatch = updatedRange.match(/(\d+)$/);
    const newRowIndex = rowMatch ? parseInt(rowMatch[1], 10) : -1;

    const result: SheetRow = { _rowIndex: newRowIndex };
    headers.forEach((h, i) => { result[h] = values[i]; });
    return result;
  }

  /**
   * Update a specific row (by row index) in the sheet.
   */
  async updateRow(sheetName: string, rowIndex: number, data: Record<string, any>): Promise<void> {
    // Read headers
    const headerRes = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: `${sheetName}!1:1`,
    });

    const headers = (headerRes.data.values?.[0] as string[]) || [];

    // Read current row
    const currentRes = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: `${sheetName}!A${rowIndex}:ZZ${rowIndex}`,
    });
    const currentValues = currentRes.data.values?.[0] || [];

    // Merge: only update provided fields
    const newValues = headers.map((h, i) => {
      if (data[h] !== undefined) return this.serializeValue(data[h]);
      return currentValues[i] ?? '';
    });

    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `${sheetName}!A${rowIndex}:${this.colLetter(headers.length - 1)}${rowIndex}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [newValues] },
    });

    this.invalidateCache(`sheet:${sheetName}`);
  }

  /**
   * Delete a row by clearing it (or shifting up).
   * We use "clear" approach to avoid shifting row indices.
   */
  async clearRow(sheetName: string, rowIndex: number): Promise<void> {
    const headerRes = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: `${sheetName}!1:1`,
    });
    const numCols = headerRes.data.values?.[0]?.length || 26;

    await this.sheets.spreadsheets.values.clear({
      spreadsheetId: this.spreadsheetId,
      range: `${sheetName}!A${rowIndex}:${this.colLetter(numCols - 1)}${rowIndex}`,
    });

    this.invalidateCache(`sheet:${sheetName}`);
  }

  // ═════════════════════════════════════════════════════════════
  // BULK OPERATIONS (for sync)
  // ═════════════════════════════════════════════════════════════

  /**
   * Write headers and all rows (replaces entire sheet content).
   */
  async writeSheet(sheetName: string, headers: string[], rows: Record<string, any>[]): Promise<void> {
    const values = [
      headers,
      ...rows.map(row => headers.map(h => this.serializeValue(row[h]))),
    ];

    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });

    this.invalidateCache(`sheet:${sheetName}`);
  }

  /**
   * Get all sheet tab names in the spreadsheet.
   */
  async getSheetNames(): Promise<string[]> {
    const res = await this.sheets.spreadsheets.get({
      spreadsheetId: this.spreadsheetId,
      fields: 'sheets.properties.title',
    });
    return res.data.sheets?.map(s => s.properties?.title || '') || [];
  }

  /**
   * Create a new sheet tab if it doesn't exist.
   */
  async ensureSheet(sheetName: string, headers: string[]): Promise<void> {
    const existing = await this.getSheetNames();
    if (!existing.includes(sheetName)) {
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        requestBody: {
          requests: [{ addSheet: { properties: { title: sheetName } } }],
        },
      });
      // Write headers
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A1`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [headers] },
      });
      this.logger.log(`Created sheet tab: ${sheetName}`);
    }
  }

  // ═════════════════════════════════════════════════════════════
  // HELPERS
  // ═════════════════════════════════════════════════════════════

  private serializeValue(val: any): string {
    if (val === null || val === undefined) return '';
    if (val instanceof Date) return val.toISOString();
    if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
  }

  private colLetter(colIndex: number): string {
    let letter = '';
    let temp = colIndex;
    while (temp >= 0) {
      letter = String.fromCharCode(65 + (temp % 26)) + letter;
      temp = Math.floor(temp / 26) - 1;
    }
    return letter;
  }

  private getCache(key: string): any | null {
    const entry = this.cache.get(key);
    if (entry && Date.now() < entry.expiresAt) return entry.data;
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, expiresAt: Date.now() + this.CACHE_TTL_MS });
  }

  private invalidateCache(key: string): void {
    this.cache.delete(key);
  }

  /** Invalidate all cached data */
  invalidateAll(): void {
    this.cache.clear();
  }
}
