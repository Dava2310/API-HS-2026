import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';
import { Asset } from './entities/asset.entity';
import { EmployeesModule } from 'src/employees/employees.module';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [TypeOrmModule.forFeature([Asset]), EmployeesModule, CategoriesModule],
  controllers: [AssetsController],
  providers: [AssetsService],
})
export class AssetsModule {}
