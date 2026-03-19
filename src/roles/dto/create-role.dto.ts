import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Unique role code in the application level',
    example: 'administrator',
    minLength: 3,
    maxLength: 20,
  })
  @IsString({ message: 'Role code must be a string.' })
  @IsNotEmpty({ message: 'Role code is required.' })
  @MinLength(3, { message: 'Role code must be at least 3 characters.' })
  @MaxLength(20, { message: 'Role code must not exceed 20 characters.' })
  roleCode: string;

  @ApiProperty({
    description: 'Official name for the role in user level',
    example: 'System Administrator',
    minLength: 3,
    maxLength: 50,
  })
  @IsString({ message: 'Name must be a string.' })
  @IsNotEmpty({ message: 'Name is required.' })
  @MinLength(3, { message: 'Name must be at least 3 characters.' })
  @MaxLength(50, { message: 'Name must not exceed 50 characters.' })
  name: string;

  @ApiProperty({
    description: 'Description for the role in user level',
    example: 'This role lets the user to perform all activities',
    minLength: 5,
    maxLength: 255,
  })
  @IsString({ message: 'Description must be a string.' })
  @IsNotEmpty({ message: 'Description is required.' })
  @MinLength(5, { message: 'Description must be at least 5 characters.' })
  @MaxLength(255, { message: 'Description must not exceed 255 characters.' })
  description: string;
}
