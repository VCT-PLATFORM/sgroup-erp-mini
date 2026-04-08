import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { APPOINTMENT_REPOSITORY } from '../../common/database/repository-tokens';
import { IAppointmentRepository } from '../../common/database/entity-repositories';

@Injectable()
export class AppointmentsService {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY) private repo: IAppointmentRepository,
  ) {}

  async findAll(filters?: {
    staffId?: string; customerId?: string; status?: string;
    type?: string; dateFrom?: string; dateTo?: string;
    projectId?: string;
  }) {
    return this.repo.findAll(filters as any);
  }

  async findById(id: string) {
    const apt = await this.repo.findById(id);
    if (!apt) throw new NotFoundException('Appointment not found');
    return apt;
  }

  async today(staffId: string) {
    return this.repo.findToday(staffId);
  }

  async create(data: {
    staffId: string; staffName?: string;
    customerId?: string; customerName?: string; customerPhone?: string;
    projectId?: string; projectName?: string;
    type?: string; scheduledAt: string; duration?: number;
    location?: string; note?: string;
  }) {
    return this.repo.create({
      ...data,
      scheduledAt: new Date(data.scheduledAt),
    } as any);
  }

  async update(id: string, data: Partial<{
    type: string; scheduledAt: string; duration: number;
    location: string; status: string; outcome: string; note: string;
    customerName: string; customerPhone: string;
  }>) {
    const updateData: any = { ...data };
    if (data.scheduledAt) updateData.scheduledAt = new Date(data.scheduledAt);
    return this.repo.update(id, updateData);
  }

  async remove(id: string) {
    return this.repo.delete(id);
  }
}
