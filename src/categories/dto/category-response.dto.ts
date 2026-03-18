import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../entities/category.entity';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

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

  @ApiProperty()
  deletedAt: Date;

  constructor(category: Category) {
    this.id = category.id;
    this.name = category.name;
    this.code = category.code;
    this.description = category.description;
    this.deletedAt = category.deletedAt;
  }
}
