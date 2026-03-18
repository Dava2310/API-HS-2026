import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoryResponseDto, CreateCategoryDto, UpdateCategoryDto } from './dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { MessageResponseDto } from 'src/common';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiBody({
    type: CreateCategoryDto,
    description: 'The data for the new category',
  })
  @ApiCreatedResponse({
    description: 'Category created successfully.',
    type: CategoryResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid data.' })
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Gets all categories from the database.' })
  @ApiOkResponse({
    type: [CategoryResponseDto],
    description: 'List of the categories.',
  })
  async findAll() {
    return await this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Finds a single category.' })
  @ApiParam({
    type: Number,
    description: 'Unique identifier of the category.',
    name: 'id',
  })
  @ApiOkResponse({
    type: CategoryResponseDto,
    description: 'Data of the found category.',
  })
  @ApiNotFoundResponse({ description: 'Category not found or not valid.' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CategoryResponseDto> {
    return await this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Updates a single category.' })
  @ApiBody({
    type: UpdateCategoryDto,
    description: 'New data for the category.',
  })
  @ApiParam({
    type: Number,
    name: 'id',
    description: 'Unique identifier for the category.',
  })
  @ApiOkResponse({
    description: 'Category updated successfully.',
    type: CategoryResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Category not found or not valid.' })
  @ApiBadRequestResponse({ description: 'Invalid data.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return await this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Removes logically a category.' })
  @ApiOkResponse({
    type: MessageResponseDto,
    description: 'Category removed succesfully.',
  })
  @ApiNotFoundResponse({ description: 'Category not found or not valid.' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.categoriesService.remove(id);
  }
}
