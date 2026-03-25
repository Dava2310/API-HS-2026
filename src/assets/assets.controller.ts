import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

import { AssetsService } from './assets.service';
import { AssetCreationTimeSeriesPointDto, AssetResponseDto, CreateAssetDto, UpdateAssetDto } from './dto';
import { MessageResponseDto } from 'src/common';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  @ApiOperation({ summary: 'Creates a new asset in the database.' })
  @ApiBody({
    type: CreateAssetDto,
    description: 'Data for the new asset.',
  })
  @ApiCreatedResponse({
    type: AssetResponseDto,
    description: 'Asset created successfully.',
  })
  @ApiBadRequestResponse({ description: 'Invalid data - SKU duplicated.' })
  @ApiNotFoundResponse({ description: 'If Category or Employee assigned are not valid or not found.' })
  async create(@Body() createAssetDto: CreateAssetDto): Promise<AssetResponseDto> {
    return await this.assetsService.create(createAssetDto);
  }

  @Get()
  @ApiOperation({ summary: 'Returns a list of all assets in the database.' })
  @ApiOkResponse({
    type: [AssetResponseDto],
    description: 'List of all assets in DTO response format.',
  })
  async findAll(): Promise<AssetResponseDto[]> {
    return await this.assetsService.findAll();
  }

  @Get('creation-timeseries/:year')
  @ApiOperation({
    summary: 'Returns monthly counts of assets created in the given calendar year.',
  })
  @ApiParam({
    name: 'year',
    type: Number,
    description: 'Calendar year to aggregate (e.g. 2024).',
    example: 2024,
  })
  @ApiOkResponse({
    type: [AssetCreationTimeSeriesPointDto],
    description: 'Twelve entries, January through December, with creation totals per month.',
  })
  @ApiBadRequestResponse({ description: 'Invalid year.' })
  async getAssetCreationTimeSeriesByYear(
    @Param('year', ParseIntPipe) year: number,
  ): Promise<AssetCreationTimeSeriesPointDto[]> {
    return await this.assetsService.getAssetCreationTimeSeriesByYear(year);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Returns a single instance of an Asset.' })
  @ApiParam({
    type: Number,
    name: 'id',
    description: 'Unique asset identifier in the database.',
  })
  @ApiOkResponse({
    type: AssetResponseDto,
    description: 'Data of the asset found.',
  })
  @ApiNotFoundResponse({ description: 'Asset not found or not valid.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.assetsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Updates an already existing Asset.' })
  @ApiBody({
    type: UpdateAssetDto,
    description: 'New data for the Asset.',
  })
  @ApiParam({
    type: Number,
    description: 'Unique asset identifier in the database.',
    name: 'id',
  })
  @ApiOkResponse({
    type: AssetResponseDto,
    description: 'Asset updated successfully.',
  })
  @ApiNotFoundResponse({ description: 'Asset/Category/Employee not found or not valid.' })
  @ApiBadRequestResponse({ description: 'Invalid data - SKU duplicated.' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateAssetDto: UpdateAssetDto) {
    return await this.assetsService.update(id, updateAssetDto);
  }

  @Patch(':id/free')
  @ApiOperation({ summary: 'Frees an asset from the employee assigned.' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Unique asset identifier in the database.',
  })
  @ApiOkResponse({
    type: MessageResponseDto,
    description: 'Asset freed successfully.',
  })
  @ApiNotFoundResponse({ description: 'Asset not found or not valid.' })
  @ApiBadRequestResponse({ description: 'Asset has no employee assigned.' })
  async freeAsset(@Param('id', ParseIntPipe) id: number): Promise<MessageResponseDto> {
    return await this.assetsService.freeAsset(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft deletes the asset from the database.' })
  @ApiParam({
    type: Number,
    description: 'Unique asset identifier in the database.',
    name: 'id',
  })
  @ApiOkResponse({
    type: MessageResponseDto,
    description: 'Asset soft deleted succesfully.',
  })
  @ApiNotFoundResponse({ description: 'Asset/Category/Employee not found or not valid.' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.assetsService.remove(id);
  }
}
