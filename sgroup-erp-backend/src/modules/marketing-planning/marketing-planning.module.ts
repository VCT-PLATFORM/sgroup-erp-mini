import { Module } from '@nestjs/common';
import { MarketingPlanningService } from './marketing-planning.service';
import { MarketingPlanningController } from './marketing-planning.controller';

@Module({
  providers: [MarketingPlanningService],
  controllers: [MarketingPlanningController],
})
export class MarketingPlanningModule {}
