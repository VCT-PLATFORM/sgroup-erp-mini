import { Injectable, Inject, ForbiddenException, NotFoundException } from '@nestjs/common';
import {
  TEAM_REPOSITORY, STAFF_REPOSITORY, PROJECT_REPOSITORY,
  DEAL_REPOSITORY, TARGET_REPOSITORY,
} from '../../common/database/repository-tokens';
import {
  ITeamRepository, IStaffRepository, IProjectRepository,
  IDealRepository, ITargetRepository,
} from '../../common/database/entity-repositories';

@Injectable()
export class SalesOpsService {
  constructor(
    @Inject(TEAM_REPOSITORY) private teamRepo: ITeamRepository,
    @Inject(STAFF_REPOSITORY) private staffRepo: IStaffRepository,
    @Inject(PROJECT_REPOSITORY) private projectRepo: IProjectRepository,
    @Inject(DEAL_REPOSITORY) private dealRepo: IDealRepository,
    @Inject(TARGET_REPOSITORY) private targetRepo: ITargetRepository,
  ) {}

  // ──────────────────────────── TEAMS ────────────────────────────

  async getTeams(filters?: { status?: string }) {
    return this.teamRepo.findAll(filters as any);
  }

  async getTeamById(id: string) {
    const team = await this.teamRepo.findById(id);
    if (!team) throw new NotFoundException('Team not found');
    return team;
  }

  async createTeam(data: {
    code: string; name: string; leaderId?: string;
    leaderName?: string; region?: string;
  }) {
    return this.teamRepo.create(data as any);
  }

  async updateTeam(id: string, data: Partial<{
    name: string; leaderId: string; leaderName: string;
    region: string; status: string; sortOrder: number;
  }>) {
    return this.teamRepo.update(id, data as any);
  }

  async deleteTeam(id: string) {
    return this.teamRepo.update(id, { status: 'DELETED' } as any);
  }

  // ──────────────────────────── STAFF ────────────────────────────

  async getStaff(filters?: { teamId?: string; status?: string; role?: string }) {
    return this.staffRepo.findAll(filters as any);
  }

  async getStaffById(id: string) {
    const staff = await this.staffRepo.findById(id);
    if (!staff) throw new NotFoundException('Staff not found');
    return staff;
  }

  async createStaff(data: {
    fullName: string; employeeCode?: string; phone?: string;
    email?: string; teamId?: string; role?: string;
    leadsCapacity?: number; personalTarget?: number;
  }) {
    return this.staffRepo.create(data as any);
  }

  async updateStaff(id: string, data: Partial<{
    fullName: string; phone: string; email: string;
    teamId: string; role: string; status: string;
    leadsCapacity: number; personalTarget: number;
  }>) {
    return this.staffRepo.update(id, data as any);
  }

  // ──────────────────────────── PROJECTS ─────────────────────────

  async getProjects(filters?: { status?: string; type?: string }) {
    return this.projectRepo.findAll(filters as any);
  }

  async getProjectById(id: string) {
    const project = await this.projectRepo.findById(id);
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async createProject(data: {
    projectCode: string; name: string; developer?: string;
    location?: string; type?: string; feeRate?: number;
    avgPrice?: number; totalUnits?: number;
  }) {
    return this.projectRepo.create(data as any);
  }

  async updateProject(id: string, data: Partial<{
    name: string; developer: string; location: string;
    type: string; feeRate: number; avgPrice: number;
    totalUnits: number; soldUnits: number; status: string;
  }>) {
    return this.projectRepo.update(id, data as any);
  }

  // ──────────────────────────── DEALS ────────────────────────────

  async getDeals(filters?: {
    year?: number; month?: number; teamId?: string;
    staffId?: string; stage?: string; projectId?: string;
    status?: string;
  }) {
    return this.dealRepo.findAll(filters as any);
  }

  async getDealById(id: string) {
    const deal = await this.dealRepo.findById(id);
    if (!deal) throw new NotFoundException('Deal not found');
    return deal;
  }

  async createDeal(data: {
    projectId?: string; projectName?: string;
    staffId?: string; staffName?: string;
    teamId?: string; teamName?: string;
    customerName?: string; customerPhone?: string;
    productCode?: string; productType?: string;
    dealValue: number; feeRate: number;
    source?: string; year: number; month: number;
    stage?: string; note?: string;
  }) {
    const commission = data.dealValue * (data.feeRate / 100);
    const dealCode = `GD-${data.year}${String(data.month).padStart(2, '0')}-${Date.now().toString(36).toUpperCase()}`;
    return this.dealRepo.create({ ...data, commission, dealCode } as any);
  }

  async updateDeal(id: string, data: Partial<{
    stage: string; dealValue: number; feeRate: number;
    customerName: string; customerPhone: string;
    productCode: string; dealDate: Date;
    bookingDate: Date; contractDate: Date;
    note: string; status: string;
  }>) {
    const updateData: any = { ...data };
    if (data.dealValue !== undefined && data.feeRate !== undefined) {
      updateData.commission = data.dealValue * (data.feeRate / 100);
    }
    return this.dealRepo.update(id, updateData);
  }

  async getDealStats(filters: { year: number; month?: number; teamId?: string }) {
    return this.dealRepo.getStats(filters);
  }

  // ──────────────────────────── TARGETS ──────────────────────────

  async getTargets(filters: {
    year: number; month?: number; teamId?: string;
    staffId?: string; scenarioKey?: string;
  }) {
    return this.targetRepo.findAll(filters as any);
  }

  async distributeTargets(data: {
    year: number; scenarioKey: string;
    targets: Array<{
      month: number; teamId?: string; staffId?: string;
      targetGMV: number; targetDeals: number;
      targetLeads: number; targetMeetings: number;
      targetBookings: number;
    }>;
  }) {
    const results = [];
    for (const t of data.targets) {
      const result = await this.targetRepo.upsertTarget(
        {
          year: data.year,
          month: t.month,
          teamId: t.teamId || '',
          staffId: t.staffId || '',
          scenarioKey: data.scenarioKey,
        },
        { ...t, year: data.year, scenarioKey: data.scenarioKey } as any,
      );
      results.push(result);
    }
    return results;
  }
}
