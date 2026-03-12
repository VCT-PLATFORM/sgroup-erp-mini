import { Module } from '@nestjs/common';
import { SalesOpsController } from './sales-ops.controller';
import { SalesOpsService } from './sales-ops.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SalesOpsController],
  providers: [SalesOpsService],
  exports: [SalesOpsService],
})
export class SalesOpsModule {}
