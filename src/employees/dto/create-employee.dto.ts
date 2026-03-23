import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsInt, IsNotEmpty, IsPositive, IsString, Length, MaxLength, MinLength } from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty({
    description: 'Employee full name',
    example: 'John Doe',
    minLength: 3,
    maxLength: 100,
  })
  @IsString({ message: 'Full name must be a string' })
  @IsNotEmpty({ message: 'Full name is required' })
  @MinLength(3, { message: 'Full name must be at least 3 characters' })
  @MaxLength(100, { message: 'Full name must not exceed 100 characters' })
  fullName: string;

  @ApiProperty({
    description: 'Unique employee code (exactly 10 characters)',
    example: 'EMP0012345',
    minLength: 10,
    maxLength: 10,
  })
  @IsString({ message: 'Employee code must be a string' })
  @IsNotEmpty({ message: 'Employee code is required' })
  @Length(10, 10, { message: 'Employee code must be exactly 10 characters' })
  employeeCode: string;

  @ApiProperty({
    description: 'Employee email address',
    example: 'john.doe@company.com',
    maxLength: 100,
    format: 'email',
  })
  @IsEmail({}, { message: 'Must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @MaxLength(100, { message: 'Email must not exceed 100 characters' })
  email: string;

  @ApiProperty({
    description: 'Employee password',
    example: 'SecurePassword123',
    minLength: 8,
    maxLength: 100,
    format: 'password',
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(100, { message: 'Password must not exceed 100 characters' })
  password: string;

  @ApiProperty({
    description: 'Role identifier (foreign key)',
    example: 1,
  })
  @Type(() => Number)
  @IsInt({ message: 'Role ID must be an integer' })
  @IsPositive({ message: 'Role ID must be a positive number' })
  @IsNotEmpty({ message: 'Role ID is required' })
  roleId: number;
}
