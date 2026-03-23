import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CrudRepository, MessageResponseDto } from 'src/common';

import { Asset } from './entities';
import { AssetResponseDto, CreateAssetDto, UpdateAssetDto } from './dto';

import { CategoriesService } from '../categories/categories.service';
import { EmployeesService } from 'src/employees/employees.service';

@Injectable()
export class AssetsService implements CrudRepository<Asset> {
  constructor(
    @InjectRepository(Asset)
    private assetRepository: Repository<Asset>,
    private categoryService: CategoriesService,
    @Inject(forwardRef(() => EmployeesService))
    private employeeService: EmployeesService,
  ) {}

  /**
   * Finds a single valid Asset instance from the database.
   * @param id Unique identifier of Asset.
   * @returns The data of the Asset found.
   * @throws NotFoundException if the Asset is not found or not valid.
   */
  async findValid(id: string | number): Promise<Asset> {
    // Parsing the ID a number in case it's a string
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

    // Verifying if the parsing was valid or not.
    if (isNaN(numericId)) {
      throw new NotFoundException(`Invalid Asset ID: ${id}`);
    }

    // Searching the Asset with the numeric ID
    const asset = await this.assetRepository.findOne({
      where: { id: numericId },
      relations: ['employee', 'category'],
    });

    // If the Asset is not created or deleted logically, we send an error message
    if (!asset) {
      throw new NotFoundException(`Asset with ID: ${numericId} not found or not valid.`);
    }

    return asset;
  }

  /**
   * Finds a single asset with the SKU attribute.
   * @param sku Info to find the asset.
   * @returns The data of the Asset or null if not found.
   */
  async findBySku(sku: string): Promise<Asset | null> {
    return await this.assetRepository.findOne({
      where: { sku },
      withDeleted: true,
    });
  }

  /**
   * Finds a single Asset with the SKU attribute, excluding one Asset from the search.
   * @param id Unique Asset identifier.
   * @param sku Info to find the asset.
   * @returns The data of the Asset or null if not found.
   */
  async findBySkuExcludingId(id: number, sku: string): Promise<Asset | null> {
    return await this.assetRepository.findOne({
      where: {
        sku,
        id: Not(id),
      },
      withDeleted: true,
    });
  }

  /**
   * Creates a new Asset into the database.
   * Verifies the existence of the Category and Employee assigned to the Asset.
   * @param createAssetDto The data for the new asset.
   * @returns The DTO response with the data of the Asset created.
   * @throws BadRequestException If the SKU is invalid.
   * @throws NotFoundException If Category or Employee are not found or not valid.
   */
  async create(createAssetDto: CreateAssetDto): Promise<AssetResponseDto> {
    const { categoryId, employeeId, sku } = createAssetDto;

    // 1. Making sure Category and Employee exist
    const category = await this.categoryService.findValid(categoryId);
    const employee = await this.employeeService.findValid(employeeId);

    // 2. Veryfing duplicity
    const duplicatedAsset = await this.findBySku(sku);

    if (duplicatedAsset) {
      throw new BadRequestException('This SKU has already been used for other asset.');
    }

    // 3. Creating the asset
    const newAsset = this.assetRepository.create({
      ...createAssetDto,
      category,
      employee,
    });

    // 4. Saving it into the database
    await this.assetRepository.save(newAsset);

    // 5. Returning the response with the data of the new Asset.
    return new AssetResponseDto(newAsset);
  }

  /**
   * Returns a list of DTO objects with all the assets from the database.
   * @returns List of DTO response objects.
   */
  async findAll(): Promise<AssetResponseDto[]> {
    // 1. Finding all the Assets
    const assets = await this.assetRepository.find({
      relations: ['employee', 'category'],
    });

    // 2. Mapping all the assets to the DTO response format.
    const mappedAssets = assets.map((a) => new AssetResponseDto(a));

    // 3. Returning the list of DTOs
    return mappedAssets;
  }

  /**
   * Returns a single valid instance of Asset from the database.
   * @param id Unique Asset identifier.
   * @returns The data from the Asset found in DTO response format.
   * @throws NotFoundException If the Asset is not found or not valid.
   */
  async findOne(id: number): Promise<AssetResponseDto> {
    // 1. Getting the Asset.
    const asset = await this.findValid(id);

    // 2. Mapping and returning the Asset
    return new AssetResponseDto(asset);
  }

  /**
   * Update an already existing Asset from the database.
   * Only attributes present in the DTO are updated; categoryId and employeeId
   * are resolved to Category and Employee entities before saving.
   * @param id Unique Identifier of the Asset.
   * @param updateAssetDto The new attributes for the Asset (all optional).
   * @returns The data of the updated Asset in DTO response format.
   * @throws NotFoundException If the Asset is not found or not valid, also for Employee and Category in case of changing those.
   * @throws BadRequestException If the data is invalid (e.g. sku duplicated).
   */
  async update(id: number, updateAssetDto: UpdateAssetDto): Promise<AssetResponseDto> {
    const { categoryId, employeeId, sku, ...scalarFields } = updateAssetDto;

    // 1. Verifying the Asset exists and it's valid
    const asset = await this.findValid(id);

    // 2. Resolve Category and Employee to entities only when IDs are provided
    if (categoryId !== undefined) {
      asset.category = await this.categoryService.findValid(categoryId);
    }
    if (employeeId !== undefined) {
      asset.employee = await this.employeeService.findValid(employeeId);
    }

    // 3. Verifying no duplicity of SKU when it's being updated
    if (sku !== undefined) {
      const duplicated = await this.findBySkuExcludingId(id, sku);
      if (duplicated) {
        throw new BadRequestException('This SKU has already been used for another Asset.');
      }
    }

    // 4. Assign only scalar fields that are present in the DTO (no categoryId/employeeId)
    const updates: Partial<Pick<Asset, 'name' | 'description' | 'model' | 'brand' | 'sku'>> = {};
    if (scalarFields.name !== undefined) updates.name = scalarFields.name;
    if (scalarFields.description !== undefined) updates.description = scalarFields.description;
    if (scalarFields.model !== undefined) updates.model = scalarFields.model;
    if (scalarFields.brand !== undefined) updates.brand = scalarFields.brand;
    if (sku !== undefined) updates.sku = sku;

    Object.assign(asset, updates);

    // 5. Saving the changes in the database.
    const updatedAsset = await this.assetRepository.save(asset);

    // 6. Returning the response in DTO response format.
    return new AssetResponseDto(updatedAsset);
  }

  /**
   * Removes logically an asset from the database.
   * @param id The unique identifier of the Asset.
   * @returns A general message DTO response.
   */
  async remove(id: number): Promise<MessageResponseDto> {
    // 1. Verifying the existence of the Asset.
    await this.findValid(id);

    // 2. Soft deleting the Asset.
    await this.assetRepository.softDelete(id);

    // 3. Returning the message.
    return new MessageResponseDto('Asset removed succesfully.');
  }

  /**
   * This function cleans the relation of all the Assets that were assigned to this Employee.
   * Needs to be called when an Employee is going to be deleted.
   * @param employeeId The ID of the Employee.
   */
  async cleanEmployeeAssets(employeeId: number): Promise<void> {
    // It cleans all the employee relations in the assets that have that employeeId
    await this.assetRepository.update({ employee: { id: employeeId } }, { employee: null });
  }
}
