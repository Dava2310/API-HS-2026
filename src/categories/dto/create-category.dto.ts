import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Name of the category',
    example: 'Smartphones',
    maxLength: 100,
    minLength: 5,
  })
  @IsString({ message: 'Name of the category must be a string.' })
  @IsNotEmpty({ message: 'Name of the category is required.' })
  @MinLength(5, { message: 'Name of the category must be at least 5 characters.' })
  @MaxLength(100, { message: 'Name of the category must not exceed 100 characters.' })
  name: string;

  @ApiProperty({
    description: 'Unique category code.',
    example: 'ABCDE12345',
    minLength: 10,
    maxLength: 10,
  })
  @IsString({ message: 'Category code must be a string.' })
  @IsNotEmpty({ message: 'Category code is required.' })
  @Length(10, 10, { message: 'Category code must be exactly 10 characters.' })
  code: string;

  @ApiProperty({
    description: 'Description of the category.',
    example: 'This category is about smartphones.',
    maxLength: 200,
    minLength: 5,
  })
  @IsString({ message: 'Description must be a string.' })
  @IsNotEmpty({ message: 'Description is required.' })
  @MaxLength(200, { message: 'Description maximum length is 200 characters.' })
  @MinLength(5, { message: 'Description minimum length is 5 characters.' })
  description: string;
}
