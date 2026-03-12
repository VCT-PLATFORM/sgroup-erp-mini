import { Injectable, Inject } from '@nestjs/common';
import { MKT_PLAN_REPOSITORY } from '../../common/database/repository-tokens';
import { IMktPlanRepository } from '../../common/database/entity-repositories';

@Injectable()
export class MarketingPlanningService {
  constructor(
    @Inject(MKT_PLAN_REPOSITORY) private repo: IMktPlanRepository,
  ) {}

  async getHeader(planId: string) {
    return this.repo.getHeader(planId);
  }

  async getChannelBudgets(planId: string) {
    return this.repo.getChannelBudgets(planId);
  }

  async getKpiTargets(planId: string) {
    return this.repo.getKpiTargets(planId);
  }

  async getAssumptions(planId: string) {
    return this.repo.getAssumptions(planId);
  }
}
