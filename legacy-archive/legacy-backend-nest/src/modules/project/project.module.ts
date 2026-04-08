import { Module } from '@nestjs/common';
import { ProjectCoreController } from './presentation/controllers/project-core.controller';
import { PropertyProductController } from './presentation/controllers/property-product.controller';
import { ProjectPolicyController } from './presentation/controllers/project-policy.controller';
import { ProjectDocController } from './presentation/controllers/project-doc.controller';
import { ProjectAssignmentController } from './presentation/controllers/project-assignment.controller';
import { ProjectService } from './application/use-cases/project.service';
import { PropertyProductService } from './application/use-cases/property-product.service';
import { PrismaProjectRepository } from './infrastructure/database/prisma-project.repository';
import { PrismaPropertyProductRepository } from './infrastructure/database/prisma-property-product.repository';

@Module({
  controllers: [
    ProjectCoreController,
    PropertyProductController,
    ProjectPolicyController,
    ProjectDocController,
    ProjectAssignmentController,
  ],
  providers: [
    ProjectService,
    PropertyProductService,
    {
      provide: 'IProjectRepository',
      useClass: PrismaProjectRepository,
    },
    {
      provide: 'IPropertyProductRepository',
      useClass: PrismaPropertyProductRepository,
    },
  ],
  exports: [ProjectService, PropertyProductService],
})
export class ProjectModule {}
