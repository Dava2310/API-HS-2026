import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Employee } from '../../employees/entities/employee.entity';

@Entity()
export class Asset {
  @ApiProperty({
    description: 'Unique asset identifier',
    example: 1,
    readOnly: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Unique stock keeping unit (SKU) code for the asset',
    example: 'MBP-2024-001',
    minLength: 3,
    maxLength: 20,
  })
  @Column({ unique: true, length: 20 })
  sku: string;

  @ApiProperty({
    description: 'Name of the asset',
    example: 'MacBook Pro 14"',
    maxLength: 100,
  })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({
    description: 'Description of the asset',
    example: 'Company laptop for development',
    maxLength: 500,
  })
  @Column({ length: 500 })
  description: string;

  @ApiProperty({
    description: 'Model of the asset',
    example: 'MacBook Pro',
    maxLength: 100,
  })
  @Column({ length: 100 })
  model: string;

  @ApiProperty({
    description: 'Brand of the asset',
    example: 'Apple',
    maxLength: 100,
  })
  @Column({ length: 100 })
  brand: string;

  @ApiProperty({
    description: 'Category identifier (foreign key)',
    example: 1,
  })
  @ManyToOne(() => Category, (category: Category) => category.assets, { nullable: false })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ApiProperty({
    description: 'Employee identifier (foreign key) - assigned custodian',
    example: 1,
  })
  @ManyToOne(() => Employee, (employee: Employee) => employee.assets, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}
