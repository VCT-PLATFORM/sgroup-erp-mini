import { IsNumber, IsString, IsOptional, IsJSON } from 'class-validator';
import { Type } from 'class-transformer';

export class UpsertExecPlanDto {
  @Type(() => Number)
  @IsNumber()
  year: number;

  @IsString()
  scenario: string;

  @IsString()
  tab: string;

  data: any;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
