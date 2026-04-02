import { MigrationInterface, QueryRunner } from 'typeorm';

export class CleanData1743552001000 implements MigrationInterface {
  name = 'CleanData1743552001000';

  async up(queryRunner: QueryRunner): Promise<void> {
    // Delete in FK-dependency order (most dependent first)
    await queryRunner.query(`TRUNCATE TABLE asset RESTART IDENTITY CASCADE`);
    await queryRunner.query(`TRUNCATE TABLE employee RESTART IDENTITY CASCADE`);
    await queryRunner.query(`TRUNCATE TABLE category RESTART IDENTITY CASCADE`);
    await queryRunner.query(`TRUNCATE TABLE role RESTART IDENTITY CASCADE`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryRunner: QueryRunner): Promise<void> {
    // Truncated data cannot be restored
  }
}
