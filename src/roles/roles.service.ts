import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from './entities';
import { CreateRoleDto, RoleResponseDto, UpdateRoleDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CrudRepository } from 'src/common';

@Injectable()
export class RolesService implements CrudRepository<Role> {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  /**
   * Searchs a single row of Role instance.
   * @param id The ID of Role to search.
   * @returns The data of the Role.
   * @throws NotFoundException If Role is not found in the database.
   */
  async findValid(id: string | number): Promise<Role> {
    // Parsing the ID a number in case it's a string
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

    // Verifying if the parsing was valid or not.
    if (isNaN(numericId)) {
      throw new NotFoundException(`Invalid Role ID: ${id}`);
    }

    // Searching the role with the numeric ID
    const role = await this.roleRepository.findOne({
      where: { id: numericId },
    });

    // If the role is not created or deleted logically, we send an error message
    if (!role) {
      throw new NotFoundException(`Role with ID: ${numericId} not found or not valid.`);
    }

    return role;
  }

  /**
   * Finds a single instance of Role by its code.
   * @param roleCode The code of the role.
   * @returns The data of the Role or null if not found.
   */
  async findByCode(roleCode: string): Promise<Role | null> {
    return await this.roleRepository.findOne({
      where: {
        roleCode,
      },
      withDeleted: true,
    });
  }

  /**
   * Finds a single instance of Role by its code.
   * Excludes a role of this search by the id.
   * @param id The id of the Role to exclude from the search.
   * @param roleCode The code of the role to get results.
   * @returns The role found with this condition, or null if not found any.
   */
  async findByCodeExcludingId(id: number, roleCode: string): Promise<Role | null> {
    return await this.roleRepository.findOne({
      where: {
        roleCode,
        id: Not(id),
      },
      withDeleted: true,
    });
  }

  /**
   * Creates a new role in the database.
   * Validates the duplicity of the roleCode from other roles.
   * @param createRoleDto The data for the new role.
   * @returns The data of the new role created in DTO response format.
   * @throws BadRequestException If roleCode is already found in other role.
   */
  async create(createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    const { roleCode } = createRoleDto;

    // 1. Verifying duplicity of roleCode
    const duplicatedRole = await this.findByCode(roleCode);

    if (duplicatedRole) {
      throw new BadRequestException('This code has already been used.');
    }

    // 2. Creating the role
    const role = this.roleRepository.create(createRoleDto);

    // 3. Saving it in the database
    await this.roleRepository.save(role);

    // 4. Returning the data of the role created.
    return new RoleResponseDto(role);
  }

  /**
   * Returns the list of all valid roles created in the database.
   * @returns The array containing DTO response objects of Roles
   */
  async findAll(): Promise<RoleResponseDto[]> {
    // 1. Finds all the Roles
    const roles = await this.roleRepository.find();

    // 2. Maps all the roles to DTO objects
    const mappedRoles = roles.map((r) => new RoleResponseDto(r));

    // 3. Returns the list
    return mappedRoles;
  }

  /**
   * Returns a single instance of the Role in DTO response format.
   * @param id The id of the role to search.
   * @returns The data of the role found in DTO response format.
   * @throws NotFoundException If the role is not found or not valid.
   */
  async findOne(id: number): Promise<RoleResponseDto> {
    // 1. Finding the role
    const role = await this.findValid(id);

    // 2. Returning the role in DTO response format
    return new RoleResponseDto(role);
  }

  /**
   * Updates a single instance of Role with new data.
   * Validates its existence and duplicity of roleCode.
   * @param id The ID of the role to update.
   * @param updateRoleDto The new attributes.
   * @returns The data of the role updated in DTO response format.
   * @throws NotFoundException If the role is not found or not valid.
   * @throws BadRequestException If the data is invalid, or roleCode is duplicated.
   */
  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<RoleResponseDto> {
    const { roleCode } = updateRoleDto;

    // 1. Verifying existence of the role
    const role = await this.findValid(id);

    // 2. Verifying duplicity of the roleCode
    if (roleCode) {
      const duplicatedRole = await this.findByCodeExcludingId(id, roleCode);

      if (duplicatedRole) {
        throw new BadRequestException('This code has already been used.');
      }
    }

    // 3. Updating the role
    Object.assign(role, updateRoleDto);

    // 4. Saving the data in the database.
    const updatedRole = await this.roleRepository.save(role);

    // 5. Returning the new data in response format.
    return new RoleResponseDto(updatedRole);
  }
}
