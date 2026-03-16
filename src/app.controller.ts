import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';

import { AppService } from './app.service';
import { MessageResponseDto } from './common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  @ApiOkResponse({ type: MessageResponseDto, description: 'Server is running' })
  health(): MessageResponseDto {
    return this.appService.health();
  }
}
