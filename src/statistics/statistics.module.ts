import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { AssetsModule } from 'src/assets/assets.module';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [AssetsModule, CategoriesModule],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
