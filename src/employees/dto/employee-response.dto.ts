import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsPositive, IsString, Length, MaxLength, MinLength } from 'class-validator';
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

  constructor(employee: Employee) {
    this.id = employee.id;
    this.fullName = employee.fullName;
    this.employeeCode = employee.employeeCode;
    this.email = employee.email;
  }
}
