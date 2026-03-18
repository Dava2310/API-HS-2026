import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Asset } from '../../assets/entities/asset.entity';

@Entity()
export class Employee {
  @ApiProperty({
    description: 'Unique employee identifier',
    example: 1,
    readOnly: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Employee full name',
    example: 'John Doe',
    maxLength: 100,
  })
  @Column({ length: 100, name: 'full_name' })
  fullName: string;

  @ApiProperty({
    description: 'Unique employee code',
    example: 'EMP0012345',
    minLength: 10,
    maxLength: 10,
  })
  @Column({ unique: true, length: 10, name: 'employee_code' })
  employeeCode: string;

  @ApiProperty({
    description: 'Employee email address',
    example: 'john.doe@company.com',
    maxLength: 100,
    format: 'email',
  })
  @Column({ unique: true, length: 100 })
  email: string;

  @ApiHideProperty()
  @Column({ select: false, length: 100 })
  password: string;

  @ApiProperty({
    description: 'Assets assigned to this employee (custodian)',
    type: () => Asset,
    isArray: true,
    required: false,
  })
  @OneToMany(() => Asset, (asset) => asset.employee)
  assets: Asset[];

  @DeleteDateColumn()
  deletedAt: Date;
}
