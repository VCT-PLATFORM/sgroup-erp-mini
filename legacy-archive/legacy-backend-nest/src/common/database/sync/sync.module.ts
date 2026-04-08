/**
 * SyncModule — Provides DataSyncService and SyncController.
 * Requires both PrismaModule and SheetsClient to be available.
 */
import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../prisma/prisma.module';
import { SheetsClient } from '../adapters/sheets/sheets-client';
import { DataSyncService } from './data-sync.service';
import { SyncController } from './sync.controller';

@Module({
  imports: [PrismaModule],
  controllers: [SyncController],
  providers: [
    SheetsClient,
    DataSyncService,
  ],
  exports: [DataSyncService],
})
export class SyncModule {}
