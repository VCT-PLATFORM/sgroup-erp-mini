import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CUSTOMER_REPOSITORY } from '../../common/database/repository-tokens';
import { ICustomerRepository } from '../../common/database/entity-repositories';

@Injectable()
export class CustomersService {
  constructor(
    @Inject(CUSTOMER_REPOSITORY) private repo: ICustomerRepository,
  ) {}

  async findAll(filters?: {
    status?: string; source?: string; assignedTo?: string;
    search?: string; year?: number; month?: number;
    isVip?: boolean;
  }) {
    return this.repo.findAll(filters as any);
  }

  async findById(id: string) {
    const customer = await this.repo.findById(id);
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async create(data: {
    fullName: string; phone?: string; email?: string;
    source?: string; projectInterest?: string; budget?: string;
    status?: string; assignedTo?: string; assignedName?: string;
    isVip?: boolean; note?: string; year: number; month: number;
  }) {
    return this.repo.create(data as any);
  }

  async update(id: string, data: Partial<{
    fullName: string; phone: string; email: string;
    source: string; projectInterest: string; budget: string;
    status: string; assignedTo: string; assignedName: string;
    isVip: boolean; lastContactAt: Date; note: string;
  }>) {
    return this.repo.update(id, data as any);
  }

  async remove(id: string) {
    return this.repo.delete(id);
  }

  async getStats(filters?: { assignedTo?: string; year?: number; month?: number }) {
    return this.repo.getStats(filters);
  }
}
