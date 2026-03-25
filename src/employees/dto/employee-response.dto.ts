import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Employee } from '../entities/employee.entity';

export class EmployeeResponseDto {
  @ApiProperty({
    description: 'Unique employee identifier',
    example: 1,
    readOnly: true,
  })
  @IsNumber()
  @IsPositive()
  id: number;

  @ApiProperty({
    description: 'Employee full name',
    example: 'John Doe',
    maxLength: 100,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  fullName: string;

  @ApiProperty({
    description: 'Unique employee code',
    example: 'EMP0012345',
    minLength: 10,
    maxLength: 10,
  })
  @IsString()
  @Length(10, 10)
  employeeCode: string;

  @ApiProperty({
    description: 'Employee email address',
    example: 'john.doe@company.com',
    maxLength: 100,
    format: 'email',
  })
  @IsEmail()
  @MaxLength(100)
  email: string;

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

  constructor(employee: Employee) {
    this.id = employee.id;
    this.fullName = employee.fullName;
    this.employeeCode = employee.employeeCode;
    this.email = employee.email;
    this.createdAt = employee.createdAt;
    this.deletedAt = employee.deletedAt;
  }
}
