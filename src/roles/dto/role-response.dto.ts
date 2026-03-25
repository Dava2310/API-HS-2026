import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../entities/role.entity';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class RoleResponseDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  roleCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

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

  constructor(role: Role) {
    this.id = role.id;
    this.roleCode = role.roleCode;
    this.name = role.name;
    this.description = role.description;
    this.createdAt = role.createdAt;
    this.deletedAt = role.deletedAt;
  }
}
