import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class AssetCreationTimeSeriesPointDto {
  @ApiProperty({
    description: 'English name of the calendar month',
    example: 'January',
  })
  @IsString()
  @IsNotEmpty()
  month: string;

  @ApiProperty({
    description: 'Number of (non-deleted) assets created in that month for the requested year',
    example: 7,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  total: number;

  constructor(month: string, total: number) {
    this.month = month;
    this.total = total;
  }
}
