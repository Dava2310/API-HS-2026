import { Injectable } from '@nestjs/common';
import { AssetsService } from 'src/assets/assets.service';
import { CategoriesService } from 'src/categories/categories.service';
import { AssetsMetricsDto } from './dto';

@Injectable()
export class StatisticsService {
  constructor(
    private assetsService: AssetsService,
    private categoriesService: CategoriesService,
  ) {}

  /**
   * It counts how many assets are free (does not have an employee assigned)
   * @returns The number of free assets.
   */
  async assetsMetrics(): Promise<AssetsMetricsDto> {
    let availables = 0;
    let assigned = 0;
    const assets = await this.assetsService.findAll();
    const total = assets.length;

    // Counting which assets have no Employee and which do have Employees.
    for (const asset of assets) {
      if (asset.employeeName === 'None') {
        availables++;
      } else {
        assigned++;
      }
    }

    // Calculating the disponibility
    const disponibility = total === 0 ? 0 : (availables / total) * 100;

    // Getting the most popular category
    const mostPopularCategory = await this.categoriesService.findMostPopularByAssetCount();

    return new AssetsMetricsDto({
      total,
      assigned,
      availables,
      disponibility,
      popularCategory: mostPopularCategory?.name ?? 'N/A',
    });
  }
}
