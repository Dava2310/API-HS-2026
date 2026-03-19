import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../entities/role.entity';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

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

  constructor(role: Role) {
    this.id = role.id;
    this.roleCode = role.roleCode;
    this.name = role.name;
    this.description = role.description;
  }
}
