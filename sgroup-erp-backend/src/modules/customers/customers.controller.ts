import {
  Controller, Get, Post, Patch, Delete, Body, Param,
  Query, UseGuards,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('customers')
@UseGuards(RolesGuard)
export class CustomersController {
  constructor(private readonly service: CustomersService) {}

  @Get()
  @Roles('admin', 'sales', 'sales_manager', 'sales_director', 'ceo', 'sales_admin')
  async findAll(
    @Query('status') status?: string,
    @Query('source') source?: string,
    @Query('assignedTo') assignedTo?: string,
    @Query('search') search?: string,
    @Query('year') year?: string,
    @Query('month') month?: string,
    @Query('isVip') isVip?: string,
  ) {
    return this.service.findAll({
      status, source, assignedTo, search,
      year: year ? Number(year) : undefined,
      month: month ? Number(month) : undefined,
      isVip: isVip !== undefined ? isVip === 'true' : undefined,
    });
  }

  @Get('stats')
  @Roles('admin', 'sales', 'sales_manager', 'sales_director', 'ceo', 'sales_admin')
  async getStats(
    @Query('assignedTo') assignedTo?: string,
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    return this.service.getStats({
      assignedTo,
      year: year ? Number(year) : undefined,
      month: month ? Number(month) : undefined,
    });
  }

  @Get(':id')
  @Roles('admin', 'sales', 'sales_manager', 'sales_director', 'ceo', 'sales_admin')
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  @Roles('admin', 'sales', 'sales_manager', 'sales_admin')
  async create(@Body() body: {
    fullName: string; phone?: string; email?: string;
    source?: string; projectInterest?: string; budget?: string;
    status?: string; assignedTo?: string; assignedName?: string;
    isVip?: boolean; note?: string; year: number; month: number;
  }) {
    return this.service.create(body);
  }

  @Patch(':id')
  @Roles('admin', 'sales', 'sales_manager', 'sales_director', 'sales_admin')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @Roles('admin', 'sales_manager', 'sales_admin')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
