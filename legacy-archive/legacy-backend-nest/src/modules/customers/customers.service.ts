import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CUSTOMER_REPOSITORY } from '../../common/database/repository-tokens';
import { ICustomerRepository } from '../../common/database/entity-repositories';
import {
  paginateResponse,
  paginationToSkipTake,
  PaginatedResponse,
} from '../../common/helpers/pagination.helper';

@Injectable()
export class CustomersService {
  constructor(
    @Inject(CUSTOMER_REPOSITORY) private repo: ICustomerRepository,
  ) {}

  /**
   * Lấy danh sách customers với pagination + filters
   * Mặc định: page=1, limit=20, max 100 records/page
   */
  async findAll(
    filters?: {
      status?: string;
      source?: string;
      assignedTo?: string;
      search?: string;
      year?: number;
      month?: number;
      isVip?: boolean;
    },
    pagination?: { page?: number; limit?: number },
  ): Promise<PaginatedResponse<any>> {
    const page = pagination?.page ?? 1;
    const limit = Math.min(pagination?.limit ?? 20, 100);
    const { skip, take } = paginationToSkipTake(page, limit);

    // Thử gọi findAllPaginated nếu repo hỗ trợ, fallback về findAll
    if (typeof (this.repo as any).findAllPaginated === 'function') {
      const [data, total] = await (this.repo as any).findAllPaginated(
        filters,
        { skip, take },
      );
      return paginateResponse(data, total, page, limit);
    }

    // Fallback: dùng findAll rồi slice (tạm thời đến khi repo được update)
    const all = await this.repo.findAll(filters as any);
    const sliced = Array.isArray(all) ? all.slice(skip, skip + take) : [];
    const total = Array.isArray(all) ? all.length : 0;
    return paginateResponse(sliced, total, page, limit);
  }

  async findById(id: string) {
    const customer = await this.repo.findById(id);
    if (!customer) throw new NotFoundException('Không tìm thấy khách hàng');
    return customer;
  }

  async create(data: {
    fullName: string;
    phone?: string;
    email?: string;
    source?: string;
    projectInterest?: string;
    budget?: string;
    status?: string;
    assignedTo?: string;
    assignedName?: string;
    isVip?: boolean;
    note?: string;
    year: number;
    month: number;
  }) {
    return this.repo.create(data as any);
  }

  async update(
    id: string,
    data: Partial<{
      fullName: string;
      phone: string;
      email: string;
      source: string;
      projectInterest: string;
      budget: string;
      status: string;
      assignedTo: string;
      assignedName: string;
      isVip: boolean;
      lastContactAt: Date;
      note: string;
    }>,
  ) {
    return this.repo.update(id, data as any);
  }

  /** Soft delete — set deletedAt thay vì xóa hẳn */
  async remove(id: string) {
    // Kiểm tra customer tồn tại trước
    const customer = await this.repo.findById(id);
    if (!customer) throw new NotFoundException('Không tìm thấy khách hàng');

    // Soft delete nếu repo hỗ trợ, hard delete nếu không
    if (typeof (this.repo as any).softDelete === 'function') {
      return (this.repo as any).softDelete(id);
    }
    return this.repo.delete(id);
  }

  async getStats(filters?: {
    assignedTo?: string;
    year?: number;
    month?: number;
  }) {
    return this.repo.getStats(filters);
  }
}
