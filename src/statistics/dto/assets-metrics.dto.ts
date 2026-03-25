import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString, Max, Min } from 'class-validator';

export class AssetsMetricsDto {
  @ApiProperty({
    description: 'Total number of non-deleted assets in the system',
    example: 48,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  total: number;

  @ApiProperty({
    description: 'Number of assets that are not assigned to any employee',
    example: 12,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  availables: number;

  @ApiProperty({
    description: 'Number of assets currently assigned to an employee',
    example: 36,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  assigned: number;

  @ApiProperty({
    description: 'Share of assets that are unassigned, as a percentage (0–100)',
    example: 25,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  disponibility: number;

  @ApiProperty({
    description: 'Name of the category that holds the most assets; N/A when there are no categories',
    example: 'Laptops',
  })
  @IsString()
  popularCategory: string;

  constructor(data: {
    total: number;
    availables: number;
    assigned: number;
    disponibility: number;
    popularCategory: string;
  }) {
    this.total = data.total;
    this.availables = data.availables;
    this.assigned = data.assigned;
    this.disponibility = data.disponibility;
    this.popularCategory = data.popularCategory;
  }
}
