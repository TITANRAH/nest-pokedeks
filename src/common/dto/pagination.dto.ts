import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @Min(1)
  @IsNumber()
  offset?: number;

  @IsOptional()
  @IsPositive()
  @IsNumber()
  limit?: number;
}
