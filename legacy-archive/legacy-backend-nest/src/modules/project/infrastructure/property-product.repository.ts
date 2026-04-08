import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma, PropertyProduct } from '@prisma/client';

@Injectable()
export class PropertyProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByProject(projectId: string, skip?: number, take?: number, status?: string) {
    const where: any = { projectId };
    if (status) where.status = status;
    return this.prisma.propertyProduct.findMany({
      skip, take, where,
      orderBy: { code: 'asc' },
    });
  }

  async findById(productId: string): Promise<PropertyProduct | null> {
    return this.prisma.propertyProduct.findUnique({
      where: { id: productId },
      include: { statusLogs: { orderBy: { createdAt: 'desc' } } }
    });
  }

  async lockProduct(productId: string, staffName: string | null, lockedUntil: Date): Promise<any> {
    return this.prisma.$transaction(async (tx) => {
      const product = await tx.propertyProduct.findUnique({ where: { id: productId } });
      if (!product) throw new BadRequestException('Bất động sản không tồn tại.');

      const result = await tx.propertyProduct.updateMany({
        where: { id: productId, status: 'AVAILABLE' },
        data: {
          status: 'LOCKED',
          bookedBy: staffName,
          lockedUntil: lockedUntil,
        }
      });

      if (result.count === 0) {
        throw new BadRequestException('Căn hộ không ở trạng thái AVAILABLE hoặc đã bị lock.');
      }

      await tx.productStatusLog.create({
        data: {
          productId,
          oldStatus: 'AVAILABLE',
          newStatus: 'LOCKED',
          changedBy: staffName,
          reason: 'System Auto-Lock',
        }
      });

      return tx.propertyProduct.findUnique({ where: { id: productId } });
    });
  }

  async unlockProduct(productId: string): Promise<any> {
    return this.prisma.$transaction(async (tx) => {
      const product = await tx.propertyProduct.findUnique({ where: { id: productId } });
      if (!product) throw new BadRequestException('Bất động sản không tồn tại.');

      const result = await tx.propertyProduct.updateMany({
        where: { id: productId, status: 'LOCKED' },
        data: {
          status: 'AVAILABLE',
          bookedBy: null,
          lockedUntil: null,
        }
      });

      if (result.count === 0) {
        throw new BadRequestException('Căn hộ không ở trạng thái LOCKED, không thể unlock.');
      }

      await tx.productStatusLog.create({
        data: {
          productId,
          oldStatus: 'LOCKED',
          newStatus: 'AVAILABLE',
          changedBy: 'SYSTEM',
          reason: 'Manual Unlock / Expiration',
        }
      });

      return tx.propertyProduct.findUnique({ where: { id: productId } });
    });
  }
}
