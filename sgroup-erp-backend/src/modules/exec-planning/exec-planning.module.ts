import { Module } from '@nestjs/common';
import { ExecPlanningService } from './exec-planning.service';
import { ExecPlanningController } from './exec-planning.controller';

@Module({
  providers: [ExecPlanningService],
  controllers: [ExecPlanningController],
})
export class ExecPlanningModule {}
