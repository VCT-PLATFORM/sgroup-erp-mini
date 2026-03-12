/**
 * Prisma Adapter — Appointment Repository
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { IAppointmentRepository, AppointmentEntity } from '../../entity-repositories';

@Injectable()
export class PrismaAppointmentRepository implements IAppointmentRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: Record<string, any>): Promise<AppointmentEntity[]> {
    const where: any = {};
    if (filters?.staffId) where.staffId = filters.staffId;
    if (filters?.customerId) where.customerId = filters.customerId;
    if (filters?.status) where.status = filters.status;
    if (filters?.type) where.type = filters.type;
    if (filters?.projectId) where.projectId = filters.projectId;
    if (filters?.dateFrom || filters?.dateTo) {
      where.scheduledAt = {};
      if (filters?.dateFrom) where.scheduledAt.gte = new Date(filters.dateFrom);
      if (filters?.dateTo) where.scheduledAt.lte = new Date(filters.dateTo);
    }
    return this.prisma.appointment.findMany({ where, orderBy: { scheduledAt: 'asc' } }) as any;
  }

  async findById(id: string): Promise<AppointmentEntity | null> {
    return this.prisma.appointment.findUnique({ where: { id } }) as any;
  }

  async create(data: Partial<AppointmentEntity>): Promise<AppointmentEntity> {
    return this.prisma.appointment.create({
      data: {
        ...data as any,
        scheduledAt: new Date(data.scheduledAt as any),
      },
    }) as any;
  }

  async update(id: string, data: Partial<AppointmentEntity>): Promise<AppointmentEntity> {
    const updateData: any = { ...data };
    if (data.scheduledAt) updateData.scheduledAt = new Date(data.scheduledAt as any);
    return this.prisma.appointment.update({ where: { id }, data: updateData }) as any;
  }

  async delete(id: string): Promise<AppointmentEntity> {
    return this.prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' },
    }) as any;
  }

  async count(filters?: Record<string, any>): Promise<number> {
    const where: any = {};
    if (filters?.staffId) where.staffId = filters.staffId;
    if (filters?.status) where.status = filters.status;
    return this.prisma.appointment.count({ where });
  }

  async findToday(staffId: string): Promise<AppointmentEntity[]> {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const end = new Date(); end.setHours(23, 59, 59, 999);
    return this.prisma.appointment.findMany({
      where: {
        staffId,
        scheduledAt: { gte: start, lte: end },
        status: { not: 'CANCELLED' },
      },
      orderBy: { scheduledAt: 'asc' },
    }) as any;
  }
}
