import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedRoles1743552002000 implements MigrationInterface {
  name = 'SeedRoles1743552002000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO role (role_code, name, description) VALUES
      ('admin',    'System Administrator', 'Full access to all system features, administrative controls and configurations.'),
      ('manager',  'Manager',              'Manages teams, approves requests and oversees asset allocation and reporting.'),
      ('employee', 'Employee',             'Standard employee with access to assigned assets and personal profile information.'),
      ('it_staff', 'IT Staff',             'Responsible for IT infrastructure, hardware provisioning and software management.'),
      ('finance',  'Finance',              'Handles financial records, budgets and cost tracking for organizational assets.')
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM role
      WHERE role_code IN ('admin', 'manager', 'employee', 'it_staff', 'finance')
    `);
  }
}
