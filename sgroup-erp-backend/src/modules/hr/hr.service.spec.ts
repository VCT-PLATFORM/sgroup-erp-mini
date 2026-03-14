import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HrService } from './hr.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockPrismaService = {
  hrEmployee: {
    count: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
  },
  hrSalaryRecord: {
    findFirst: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    updateMany: jest.fn(),
  },
  commissionRecord: {
    groupBy: jest.fn(),
  },
  salesStaff: {
    findUnique: jest.fn(),
  },
  financeAccount: {
    findFirst: jest.fn(),
  },
  financeCategory: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  financeTransaction: {
    count: jest.fn(),
    create: jest.fn(),
  },
};

const mockEventEmitter = {
  emit: jest.fn(),
};

describe('HrService', () => {
  let service: HrService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HrService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    service = module.get<HrService>(HrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
