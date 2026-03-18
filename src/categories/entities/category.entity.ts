import { ApiProperty } from '@nestjs/swagger';
import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @ApiProperty({
    description: 'Unique category identifier',
    example: 1,
    readOnly: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Name of the category',
    example: 'Smartphones',
    maxLength: 100,
  })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({
    description: 'Unique code of the category',
    example: 'ABCDE12345',
    maxLength: 10,
  })
  @Column({ unique: true, length: 10 })
  code: string;

  @ApiProperty({
    description: 'Description of the category',
    example: 'This category is all about smartphones that employees use in their every day.',
    maxLength: 200,
  })
  @Column({ length: 200 })
  description: string;

  @DeleteDateColumn()
  deletedAt: Date;
}
