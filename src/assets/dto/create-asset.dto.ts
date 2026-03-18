import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, Length, MaxLength, MinLength } from 'class-validator';

export class CreateAssetDto {
  @ApiProperty({
    description: 'Name of the asset',
    example: 'MacBook Pro 14"',
    minLength: 1,
    maxLength: 100,
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(1, { message: 'Name must not be empty' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name: string;

  @ApiProperty({
    description: 'Unique stock keeping unit (SKU) code for the asset',
    example: 'MBP-2024-001',
    minLength: 3,
    maxLength: 20,
  })
  @IsString({ message: 'SKU must be a string' })
  @IsNotEmpty({ message: 'SKU is required' })
  @Length(3, 20, { message: 'SKU must be between 3 and 20 characters' })
  sku: string;

  @ApiProperty({
    description: 'Description of the asset',
    example: 'Company laptop for development',
    maxLength: 500,
  })
  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description: string;

  @ApiProperty({
    description: 'Model of the asset',
    example: 'MacBook Pro',
    minLength: 1,
    maxLength: 100,
  })
  @IsString({ message: 'Model must be a string' })
  @IsNotEmpty({ message: 'Model is required' })
  @MinLength(1, { message: 'Model must not be empty' })
  @MaxLength(100, { message: 'Model must not exceed 100 characters' })
  model: string;

  @ApiProperty({
    description: 'Brand of the asset',
    example: 'Apple',
    minLength: 1,
    maxLength: 100,
  })
  @IsString({ message: 'Brand must be a string' })
  @IsNotEmpty({ message: 'Brand is required' })
  @MinLength(1, { message: 'Brand must not be empty' })
  @MaxLength(100, { message: 'Brand must not exceed 100 characters' })
  brand: string;

  @ApiProperty({
    description: 'ID of the category this asset belongs to',
    example: 1,
  })
  @IsNumber()
  @IsInt()
  @IsPositive({ message: 'Category ID must be a positive integer' })
  categoryId: number;

  @ApiProperty({
    description: 'ID of the employee assigned as custodian of this asset',
    example: 1,
  })
  @IsNumber()
  @IsInt()
  @IsPositive({ message: 'Employee ID must be a positive integer' })
  employeeId: number;
}
