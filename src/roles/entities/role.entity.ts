import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Employee } from 'src/employees/entities/employee.entity';

@Entity()
export class Role {
  @ApiProperty({
    description: 'Unique Role identifier in database',
    example: 1,
    readOnly: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Unique role code in the application level',
    example: 'administrator',
    minLength: 3,
    maxLength: 20,
  })
  @Column({ unique: true, length: 20, name: 'role_code' })
  roleCode: string;

  @ApiProperty({
    description: 'Official name for the role in user level',
    example: 'System Administrator',
    minLength: 3,
    maxLength: 50,
  })
  @Column({ unique: false, length: 50 })
  name: string;

  @ApiProperty({
    description: 'Description for the role in user level',
    example: 'This role lets the user to perform all activities',
    minLength: 5,
    maxLength: 255,
  })
  @Column({ unique: false, length: 255 })
  description: string;

  @ApiProperty({
    description: 'Employees assigned to this role',
    type: () => Employee,
    isArray: true,
    required: false,
  })
  @OneToMany(() => Employee, (employee) => employee.role)
  employees: Employee[];
}
