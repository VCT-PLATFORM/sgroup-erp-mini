import { Controller, Get, Put, Body, Query, UseGuards } from '@nestjs/common';
import { ExecPlanningService } from './exec-planning.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('exec-planning')
@UseGuards(RolesGuard)
@Roles('admin', 'exec')
export class ExecPlanningController {
  constructor(private readonly service: ExecPlanningService) {}

  @Get('latest')
  async getLatest(
    @Query('year') year: string,
    @Query('scenario') scenario: string,
    @Query('tab') tab: string,
  ) {
    return this.service.getLatestPlan(Number(year), scenario, tab);
  }

  @Put('save')
  async save(@Body() body: { year: number; scenario: string; tab: string; data: any; userId: string }) {
    return this.service.upsertPlan(body.year, body.scenario, body.tab, body.data, body.userId);
  }

  @Get('kpis')
  async getKpis(
    @Query('year') year: string,
    @Query('scenario') scenario: string,
    @Query('tab') tab: string,
  ) {
    return this.service.getKpis(Number(year), scenario, tab);
  }
}
