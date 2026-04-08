import { IsOptional, IsNumber, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

export class YearScenarioDto {
  @Type(() => Number)
  @IsNumber()
  year: number;

  @IsString()
  scenario: string;
}

export class PlanIdDto {
  @IsString()
  planId: string;
}
