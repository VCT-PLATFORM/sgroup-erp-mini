import { Module } from '@nestjs/common';
import { BizflySyncController } from './bizfly-sync.controller';
import { BizflySyncService } from './bizfly-sync.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BizflySyncController],
  providers: [BizflySyncService],
  exports: [BizflySyncService],
})
export class BizflySyncModule {}
