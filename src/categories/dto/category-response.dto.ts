import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../entities/category.entity';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CategoryResponseDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'When the record was created',
    example: '2024-06-15T10:30:00.000Z',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Soft-delete timestamp; null while the record is active',
    nullable: true,
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsDate()
  deletedAt: Date | null;

  constructor(category: Category) {
    this.id = category.id;
    this.name = category.name;
    this.code = category.code;
    this.description = category.description;
    this.createdAt = category.createdAt;
    this.deletedAt = category.deletedAt;
  }
}
