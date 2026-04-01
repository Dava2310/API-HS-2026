import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto, CategoryResponseDto, UpdateCategoryDto } from './dto';
import { CrudRepository, MessageResponseDto } from 'src/common';
import { Category } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

@Injectable()
export class CategoriesService implements CrudRepository<Category> {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  /**
   * Searchs a single row of Category instance.
   * @param id The ID of Category to search.
   * @returns The data of the Category.
   * @throws NotFoundException If Category is not found in the database.
   */
  async findValid(id: string | number): Promise<Category> {
    // Parsing the ID a number in case it's a string
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

    // Verifying if the parsing was valid or not.
    if (isNaN(numericId)) {
      throw new NotFoundException(`Invalid Category ID: ${id}`);
    }

    // Searching the category with the numeric ID
    const category = await this.categoryRepository.findOne({
      where: { id: numericId },
    });

    // If the category is not created or deleted logically, we send an error message
    if (!category) {
      throw new NotFoundException(`Category with ID: ${numericId} not found or not valid.`);
    }

    return category;
  }

  /**
   * Finds a category by the code attribute.
   * @param code The code to search the category.
   * @returns The data of the Category found or null if not found.
   */
  async findByCode(code: string): Promise<Category | null> {
    return await this.categoryRepository.findOne({
      where: { code },
      withDeleted: true,
    });
  }

  /**
   * Finds a category by the code attribute, excluding one by the ID.
   * @param id Identifier of the category to exclude
   * @param code The code to look for the category
   * @returns The data of the category found or null if not found.
   */
  async findByCodeExcludingId(id: number, code: string): Promise<Category | null> {
    return await this.categoryRepository.findOne({
      where: {
        code,
        id: Not(id),
      },
      withDeleted: true,
    });
  }

  /**
   * Returns the category with the highest number of (non-deleted) assets.
   * Ties are broken by ascending category id.
   * @returns The category as a response DTO, or `null` if there are no categories.
   */
  async findMostPopularByAssetCount(): Promise<CategoryResponseDto | null> {
    const row = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoin('category.assets', 'asset', 'asset.deletedAt IS NULL')
      .select('category.id', 'id')
      .addSelect('COUNT(asset.id)', 'assetCount')
      .groupBy('category.id')
      .orderBy('COUNT(asset.id)', 'DESC')
      .addOrderBy('category.id', 'ASC')
      .limit(1)
      .getRawOne<{ id: string; assetCount: string }>();

    if (!row) {
      return null;
    }

    const category = await this.findValid(Number(row.id));
    return new CategoryResponseDto(category);
  }

  /**
   * Creates a new category in the database.
   * @param createCategoryDto The data for the new category.
   * @returns When created, returns a DTO response object.
   */
  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const { code } = createCategoryDto;

    // 1. Finding a duplicated category by the code.
    const duplicatedCategory = await this.findByCode(code);

    if (duplicatedCategory) {
      throw new BadRequestException('This code has already been used.');
    }

    // 2. Creating the category
    const category = this.categoryRepository.create(createCategoryDto);

    // 3. Saving the category in the database
    await this.categoryRepository.save(category);

    // 4. Returning response
    return new CategoryResponseDto(category);
  }

  /**
   * Finds all the categories created and valid in the database.
   * @returns An array containing DTO response objects.
   */
  async findAll(): Promise<CategoryResponseDto[]> {
    // 1. Getting the list of all categories
    const categories = await this.categoryRepository.find();

    // 2. Mapping the categories into DTO response objects
    const mappedCategories = categories.map((c) => new CategoryResponseDto(c));

    // 3. Returning the list
    return mappedCategories;
  }

  /**
   * Finds a single instance of a Category.
   * @param id Unique Category identifier.
   * @returns The data of the category found in DTO response format.
   */
  async findOne(id: number): Promise<CategoryResponseDto> {
    // 1. Finding the category
    const category = await this.findValid(id);

    // 2. Returning the data of the category
    return new CategoryResponseDto(category);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<CategoryResponseDto> {
    const { code } = updateCategoryDto;

    // 1. Finding the category
    const category = await this.findValid(id);

    // 2. Making sure the category doesn't duplicate the code
    if (code) {
      const duplicated = await this.findByCodeExcludingId(id, code);

      if (duplicated) {
        throw new BadRequestException('This code has already been used by another category.');
      }
    }

    // 3. Making the update.
    Object.assign(category, updateCategoryDto);

    // 4. Saving the updated category in the database
    const updatedCategory = await this.categoryRepository.save(category);

    // 5. Returning the response
    return new CategoryResponseDto(updatedCategory);
  }

  /**
   * Removes logically a Category from the database.
   * @param id The ID of the Category.
   * @returns A DTO general message.
   */
  async remove(id: number): Promise<MessageResponseDto> {
    // 1. Verifying the existence of the Category
    await this.findValid(id);

    // 2. Soft deleting the category
    await this.categoryRepository.softDelete(id);

    // 3. Returning a message
    return new MessageResponseDto('Category deleted successfully.');
  }
}
