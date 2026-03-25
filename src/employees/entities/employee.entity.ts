import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Asset } from '../../assets/entities/asset.entity';
import { Role } from 'src/roles/entities/role.entity';

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

  @ApiProperty({
    description: 'Role identifier (foreign key)',
    example: 1,
  })
  @ManyToOne(() => Role, (role: Role) => role.employees, {
    nullable: false,
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ApiProperty({
    description: 'Timestamp when the record was created',
    example: '2024-06-15T10:30:00.000Z',
    type: String,
    format: 'date-time',
  })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the record was soft-deleted; null if still active',
    example: null,
    nullable: true,
    type: String,
    format: 'date-time',
  })
  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;
}
