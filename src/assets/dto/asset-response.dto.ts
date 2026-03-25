/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsPositive, IsString, Length, MaxLength, MinLength } from 'class-validator';
import { Asset } from '../entities/asset.entity';

export class AssetResponseDto {
  @ApiProperty({
    description: 'Unique asset identifier',
    example: 1,
    readOnly: true,
  })
  @IsNumber()
  @IsPositive()
  id: number;

  @ApiProperty({
    description: 'Unique stock keeping unit (SKU) code for the asset',
    example: 'MBP-2024-001',
    minLength: 3,
    maxLength: 20,
  })
  @IsString()
  @Length(3, 20)
  sku: string;

  @ApiProperty({
    description: 'Name of the asset',
    example: 'MacBook Pro 14"',
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Description of the asset',
    example: 'Company laptop for development',
    maxLength: 500,
  })
  @IsString()
  @MaxLength(500)
  description: string;

  @ApiProperty({
    description: 'Model of the asset',
    example: 'MacBook Pro',
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  model: string;

  @ApiProperty({
    description: 'Brand of the asset',
    example: 'Apple',
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  brand: string;

  @ApiProperty({
    description: 'Category identifier (foreign key)',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  categoryId: number;

  @ApiProperty({
    description: 'Employee identifier (foreign key) - assigned custodian',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  employeeId: number;

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

  @ApiProperty()
  @IsString()
  categoryName: string;

  @ApiProperty()
  @IsString()
  employeeName: string;

  constructor(asset: Asset) {
    this.id = asset.id;
    this.sku = asset.sku;
    this.name = asset.name;
    this.description = asset.description;
    this.model = asset.model;
    this.brand = asset.brand;
    this.categoryId = asset.category?.id ?? (asset as any).categoryId;
    this.employeeId = asset.employee?.id ?? (asset as any).employeeId;
    this.categoryName = asset.category.name;
    this.employeeName = asset.employee ? asset.employee.fullName : 'None';
    this.createdAt = asset.createdAt;
    this.deletedAt = asset.deletedAt;
  }
}
