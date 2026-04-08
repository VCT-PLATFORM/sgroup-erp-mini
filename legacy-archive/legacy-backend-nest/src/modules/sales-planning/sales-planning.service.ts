import { Injectable, Inject } from '@nestjs/common';
import { SALE_PLAN_REPOSITORY } from '../../common/database/repository-tokens';
import { ISalePlanRepository } from '../../common/database/entity-repositories';

@Injectable()
export class SalesPlanningService {
  constructor(
    @Inject(SALE_PLAN_REPOSITORY) private repo: ISalePlanRepository,
  ) {}

  async getLatest(year: number, scenarioKey: string) {
    return this.repo.getLatest(year, scenarioKey);
  }

  async getHeader(planId: string) {
    return this.repo.getHeader(planId);
  }

  async getMonths(planId: string) {
    return this.repo.getMonths(planId);
  }

  async getTeams(planId: string) {
    return this.repo.getTeams(planId);
  }

  async getStaff(planId: string) {
    return this.repo.getStaff(planId);
  }
}
