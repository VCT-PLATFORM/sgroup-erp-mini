import { Module } from '@nestjs/common';
import { SalesPlanningService } from './sales-planning.service';
import { SalesPlanningController } from './sales-planning.controller';

@Module({
  providers: [SalesPlanningService],
  controllers: [SalesPlanningController],
})
export class SalesPlanningModule {}
