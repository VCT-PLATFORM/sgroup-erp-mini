import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ACTIVITY_REPOSITORY } from '../../common/database/repository-tokens';
import { IActivityRepository } from '../../common/database/entity-repositories';

@Injectable()
export class ActivitiesService {
  constructor(
    @Inject(ACTIVITY_REPOSITORY) private repo: IActivityRepository,
  ) {}

  async findAll(filters?: {
    staffId?: string; year?: number; month?: number;
    dateFrom?: string; dateTo?: string;
  }) {
    return this.repo.findAll(filters as any);
  }

  async findById(id: string) {
    const activity = await this.repo.findById(id);
    if (!activity) throw new NotFoundException('Activity not found');
    return activity;
  }

  async create(data: {
    staffId: string; staffName?: string;
    postsCount?: number; callsCount?: number;
    newLeads?: number; meetingsMade?: number;
    note?: string; year: number; month: number;
    date?: string;
  }) {
    return this.repo.create({
      ...data,
      date: data.date ? new Date(data.date) : new Date(),
    } as any);
  }

  async update(id: string, data: Partial<{
    postsCount: number; callsCount: number;
    newLeads: number; meetingsMade: number;
    note: string;
  }>) {
    return this.repo.update(id, data as any);
  }

  async remove(id: string) {
    return this.repo.delete(id);
  }

  async getSummary(filters: {
    staffId?: string; year: number; month?: number;
    period?: 'day' | 'week' | 'month' | 'quarter' | 'year';
  }) {
    return this.repo.getSummary(filters);
  }
}
