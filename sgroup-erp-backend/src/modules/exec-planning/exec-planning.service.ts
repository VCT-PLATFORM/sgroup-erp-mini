import { Injectable, Inject } from '@nestjs/common';
import { EXEC_PLAN_REPOSITORY } from '../../common/database/repository-tokens';
import { IExecPlanRepository } from '../../common/database/entity-repositories';

@Injectable()
export class ExecPlanningService {
  constructor(
    @Inject(EXEC_PLAN_REPOSITORY) private repo: IExecPlanRepository,
  ) {}

  async getLatestPlan(year: number, scenarioKey: string, tabKey: string) {
    return this.repo.findByCompositeKey(year, scenarioKey, tabKey);
  }

  async upsertPlan(year: number, scenarioKey: string, tabKey: string, data: any, userId: string) {
    return this.repo.upsert(
      { year, scenarioKey, tabKey },
      { year, scenarioKey, tabKey, rawJson: JSON.stringify(data), updatedBy: userId } as any,
      { rawJson: JSON.stringify(data), updatedBy: userId, updatedAt: new Date() } as any,
    );
  }

  async getKpis(year: number, scenarioKey: string, tabKey: string) {
    return this.repo.getKpis(year, scenarioKey, tabKey);
  }
}
