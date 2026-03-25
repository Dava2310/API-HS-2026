import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { StatisticsService } from './statistics.service';
import { AssetsMetricsDto } from './dto';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('assets-metrics')
  @ApiOperation({ summary: 'Returns aggregate metrics about assets (totals, availability, popular category).' })
  @ApiOkResponse({
    type: AssetsMetricsDto,
    description: 'Asset metrics for dashboards and reporting.',
  })
  async assetsMetrics(): Promise<AssetsMetricsDto> {
    return await this.statisticsService.assetsMetrics();
  }
}
