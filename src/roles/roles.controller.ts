import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

import { CreateRoleDto, RoleResponseDto, UpdateRoleDto } from './dto';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({ summary: 'Creates a new role in the database.' })
  @ApiBody({
    type: CreateRoleDto,
    description: 'The data for the new role',
  })
  @ApiCreatedResponse({
    type: RoleResponseDto,
    description: 'Role created successfully.',
  })
  @ApiBadRequestResponse({ description: 'Data invalid (e.g. roleCode duplicated)' })
  async create(@Body() createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Finds all the valid roles in the database.' })
  @ApiOkResponse({
    type: [RoleResponseDto],
    description: 'The list of roles in DTO response format',
  })
  async findAll(): Promise<RoleResponseDto[]> {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Finds a single instance of valid role by the ID.' })
  @ApiParam({
    type: Number,
    description: 'The unique identifier of the role in the database.',
    name: 'id',
  })
  @ApiOkResponse({
    type: RoleResponseDto,
    description: 'The data of the role found in DTO response format.',
  })
  @ApiNotFoundResponse({ description: 'Role not found or not valid.' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<RoleResponseDto> {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Updates an already existing role in the database.' })
  @ApiBody({
    type: UpdateRoleDto,
    description: 'The new data for the role.',
  })
  @ApiParam({
    type: Number,
    description: 'The unique identifier of the role in the database.',
    name: 'id',
  })
  @ApiOkResponse({
    type: RoleResponseDto,
    description: 'Role updated succesfully.',
  })
  @ApiBadRequestResponse({ description: 'Data invalid (e.g. roleCode duplicated)' })
  @ApiNotFoundResponse({ description: 'Role not found or not valid.' })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }
}
