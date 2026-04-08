import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { BizflySyncService } from './bizfly-sync.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('bizfly-sync')
@UseGuards(RolesGuard)
@Roles('admin', 'sales_admin')
export class BizflySyncController {
  constructor(private readonly service: BizflySyncService) {}

  @Post('trigger')
  async triggerSync(@Body() body: { syncType: string; initiatedBy: string }) {
    return this.service.triggerSync(body);
  }

  @Get('status')
  async getSyncStatus() {
    return this.service.getSyncStatus();
  }

  @Get('history')
  async getSyncHistory(@Query('limit') limit?: string) {
    return this.service.getSyncHistory(limit ? Number(limit) : 20);
  }

  @Post('reconcile')
  @Roles('admin', 'sales_admin', 'sales_director')
  async reconcile(@Body() body: { year: number; month?: number }) {
    return this.service.reconcile(body);
  }
}
