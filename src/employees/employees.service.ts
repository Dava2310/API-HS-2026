import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { MessageResponseDto } from 'src/common';
import { CrudRepository } from 'src/common/use-case';

import { Employee } from './entities';
import { AssetsService } from 'src/assets/assets.service';
import { RolesService } from 'src/roles/roles.service';
import { CreateEmployeeDto, EmployeeResponseDto, UpdateEmployeeDto } from './dto';

@Injectable()
export class EmployeesService implements CrudRepository<Employee> {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @Inject(forwardRef(() => AssetsService))
    private assetsService: AssetsService,
    private rolesService: RolesService,
  ) {}

  /**
   * Searchs a single row of Employee instance.
   * @param id The ID of Employee to search.
   * @returns The data of the Employee.
   * @throws NotFoundException If Employee is not found in the database.
   */
  async findValid(id: string | number): Promise<Employee> {
    // Parsing the ID a number in case it's a string
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

    // Verifying if the parsing was valid or not.
    if (isNaN(numericId)) {
      throw new NotFoundException(`Invalid Employee ID: ${id}`);
    }

    // Searching the employee with the numeric ID
    const employee = await this.employeeRepository.findOne({
      where: { id: numericId },
    });

    // If the employee is not created or deleted logically, we send an error message
    if (!employee) {
      throw new NotFoundException(`Employee with ID: ${numericId} not found or not valid.`);
    }

    return employee;
  }

  /**
   * Finds an Employee by code.
   * @param employeeCode Unique code of employee.
   * @returns A promise containing the data of Employee or null if not found.
   */
  async findByCode(employeeCode: string): Promise<Employee | null> {
    return await this.employeeRepository.findOne({
      where: { employeeCode },
      withDeleted: true,
    });
  }

  /**
   * Finds an Employee by email.
   * @param email The unique emamil of the employee.
   * @returns A promise containing the data of the Employee or null if not found.
   */
  async findByEmail(email: string): Promise<Employee | null> {
    return await this.employeeRepository.findOne({
      where: { email },
      withDeleted: true,
    });
  }

  /**
   * Finds an Employee by the email, excluding an specific one by the ID.
   * @param id The ID to exclude that one from the query.
   * @param email The email to search duplicity.
   * @returns The data of the Employee found or null if not found.
   */
  async findByEmailExcludingId(id: number, email: string): Promise<Employee | null> {
    return await this.employeeRepository.findOne({
      where: {
        email,
        id: Not(id),
      },
      withDeleted: true,
    });
  }

  /**
   * Finds an Employee by the code, excluding an specific one by the ID.
   * @param id The ID to exclude that one from the query.
   * @param code The code to search duplicity.
   * @returns The data of the Employee found or null if not found.
   */
  async findByCodeExcludingId(id: number, code: string): Promise<Employee | null> {
    return await this.employeeRepository.findOne({
      where: {
        employeeCode: code,
        id: Not(id),
      },
      withDeleted: true,
    });
  }

  /**
   * Creates a new Employee into the Database.
   * @param createEmployeeDto The data for the new Employee.
   * @returns The data of the Employee created.
   */
  async create(createEmployeeDto: CreateEmployeeDto): Promise<EmployeeResponseDto> {
    const { employeeCode, email, roleId, password, fullName } = createEmployeeDto;

    await this.rolesService.findValid(roleId);

    // 1. Finding an Employee by the unique code or email.
    let duplicatedEmployee = await this.findByCode(employeeCode);

    if (duplicatedEmployee) {
      throw new BadRequestException('This code is already used in another Employee.');
    }

    duplicatedEmployee = await this.findByEmail(email);

    if (duplicatedEmployee) {
      throw new BadRequestException('This email is already being used by another Employee.');
    }

    // 2. Hashing the password
    const newPassword = await bcrypt.hash(password, 10);

    // 3. Creating the Employee and saving into DB
    const employee = this.employeeRepository.create({
      employeeCode,
      email,
      fullName,
      password: newPassword,
      role: { id: roleId },
    });

    await this.employeeRepository.save(employee);

    // 4. Returning response
    return new EmployeeResponseDto(employee);
  }

  /**
   * Gets a list of all employees in the form of EmployeeResponseDto.
   * @returns The array of EmployeeResponseDto objects.
   */
  async findAll(): Promise<EmployeeResponseDto[]> {
    // 1. Getting all employees from the database
    const employees = await this.employeeRepository.find();

    // 2. Parsing to DTOs
    const mappedEmployees = employees.map((e) => new EmployeeResponseDto(e));

    // 3. Returning the response.
    return mappedEmployees;
  }

  /**
   * Finds a single instance of Employee in the Database by the ID.
   * @param id The numeric ID of the Employee.
   * @returns The data of the Employee found.
   */
  async findOne(id: number): Promise<EmployeeResponseDto> {
    // 1. Finding the employee by the ID
    const employee = await this.findValid(id);

    // 2. Mapping the object to the DTO and returning
    return new EmployeeResponseDto(employee);
  }

  /**
   * Updates an existing employee in the database.
   * @param id The ID of the existing employee.
   * @param updateEmployeeDto The new attributes for the employee.
   * @returns A promise with a DTO response of Employee data.
   */
  async update(id: number, updateEmployeeDto: UpdateEmployeeDto): Promise<EmployeeResponseDto> {
    // 1. Getting the employee to update.
    const employee = await this.findValid(id);

    // 2. Verifying the code of the employee
    const { employeeCode, email, roleId, ...updateFields } = updateEmployeeDto;

    if (roleId !== undefined) {
      await this.rolesService.findValid(roleId);
      Object.assign(employee, { role: { id: roleId } });
    }

    let duplicatedEmployee: Employee;

    if (employeeCode) {
      duplicatedEmployee = await this.findByCodeExcludingId(id, employeeCode);

      if (duplicatedEmployee) {
        throw new BadRequestException('This code has already been used in another Employee.');
      }
    }

    if (email) {
      duplicatedEmployee = await this.findByEmailExcludingId(id, email);

      if (duplicatedEmployee) {
        throw new BadRequestException('This email has already been used in another Employee.');
      }
    }

    // 3. Modifying the data.
    Object.assign(employee, updateFields);

    // 4. Saving the changes in the database.
    const updatedEmployee = await this.employeeRepository.save(employee);

    // 5. Returning the response.
    return new EmployeeResponseDto(updatedEmployee);
  }

  /**
   * Removes logically an Employee from the Database.
   * @param id The ID of the Employee.
   * @returns A DTO message.
   */
  async remove(id: number): Promise<MessageResponseDto> {
    // 1. Verifying the existence of the Employee.
    const employee = await this.findValid(id);

    // 2. TODO: Deassigned all the items of this Employee.
    await this.assetsService.cleanEmployeeAssets(employee.id);

    // 3. Soft deleting the employee.
    await this.employeeRepository.softDelete(id);

    // 4. Returning a message.
    return new MessageResponseDto('Employee deleted successfully.');
  }
}
