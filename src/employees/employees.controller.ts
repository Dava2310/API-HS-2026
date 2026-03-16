import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { EmployeeResponseDto } from './dto/employee-response.dto';
import { MessageResponseDto } from 'src/common';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @ApiOperation({ summary: 'Creates a new Employee.' })
  @ApiBody({
    type: CreateEmployeeDto,
    description: 'Data for the new Employee.',
  })
  @ApiCreatedResponse({
    type: EmployeeResponseDto,
    description: 'Employee created successfully.',
  })
  @ApiBadRequestResponse({ description: 'Invalid data for the new Employee.' })
  async create(@Body() createEmployeeDto: CreateEmployeeDto): Promise<EmployeeResponseDto> {
    return await this.employeesService.create(createEmployeeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Gets all the Employee from the database.' })
  @ApiOkResponse({
    type: [EmployeeResponseDto],
    description: 'The list of Employees.',
  })
  async findAll(): Promise<EmployeeResponseDto[]> {
    return this.employeesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a single Employee from the database.' })
  @ApiParam({
    type: Number,
    name: 'id',
    description: 'ID of the Employee.',
  })
  @ApiOkResponse({ type: EmployeeResponseDto, description: 'Data of the found Employee.' })
  @ApiNotFoundResponse({ description: 'Employee not found.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Updates an existing Employee.' })
  @ApiBody({
    type: UpdateEmployeeDto,
    description: 'The new attributes for the Employee.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the Employee.',
  })
  @ApiOkResponse({ type: EmployeeResponseDto, description: 'Employee updated successfully.' })
  @ApiNotFoundResponse({ description: 'Employee not found.' })
  @ApiBadRequestResponse({ description: 'Invalid data for the Employee.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<EmployeeResponseDto> {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft deletes an Employee from the database.' })
  @ApiOkResponse({
    type: MessageResponseDto,
    description: 'Employee deleted succesfully.',
  })
  @ApiNotFoundResponse({ description: 'Employee not found.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<MessageResponseDto> {
    return this.employeesService.remove(id);
  }
}
