import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PersonasService } from './personas.service';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { Persona } from './entities/persona.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiBearerAuth
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiBearerAuth()
@ApiTags('Personas')
@Controller('personas')
export class PersonasController {
  constructor(private readonly personasService: PersonasService) {}

  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Crear nueva persona', description: 'Registra una nueva persona en el sistema' })
  @ApiBody({ type: CreatePersonaDto })
  @ApiCreatedResponse({ 
    description: 'Persona creada exitosamente',
    type: Persona
  })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos' })
  create(@Body() createPersonaDto: CreatePersonaDto) {
    return this.personasService.create(createPersonaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las personas', description: 'Devuelve una lista de todas las personas registradas' })
  @ApiOkResponse({ 
    description: 'Lista de personas obtenida exitosamente',
    type: [Persona]
  })
  findAll() {
    return this.personasService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar personas', description: 'Busca personas por cédula, nombres o apellidos. Si no se proporciona query, devuelve todas las personas.' })
  @ApiQuery({ name: 'query', required: false, description: 'Término de búsqueda (cédula, nombres o apellidos)' })
  @ApiOkResponse({ 
    description: 'Resultados de la búsqueda',
    type: [Persona]
  })
  async search(@Query('query') query?: string): Promise<Persona[]> {
    return this.personasService.findBy(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener persona por ID', description: 'Obtiene los detalles de una persona específica' })
  @ApiParam({ name: 'id', description: 'ID de la persona', type: String })
  @ApiOkResponse({ 
    description: 'Persona encontrada',
    type: Persona
  })
  @ApiNotFoundResponse({ description: 'Persona no encontrada' })
  findOne(@Param('id') id: string) {
    return this.personasService.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Actualizar persona', description: 'Actualiza la información de una persona existente' })
  @ApiParam({ name: 'id', description: 'ID de la persona a actualizar', type: String })
  @ApiBody({ type: UpdatePersonaDto })
  @ApiOkResponse({ 
    description: 'Persona actualizada exitosamente',
    type: Persona
  })
  @ApiNotFoundResponse({ description: 'Persona no encontrada' })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos' })
  update(@Param('id') id: string, @Body() updatePersonaDto: UpdatePersonaDto) {
    return this.personasService.update(id, updatePersonaDto);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Eliminar persona', description: 'Elimina una persona del sistema' })
  @ApiParam({ name: 'id', description: 'ID de la persona a eliminar', type: String })
  @ApiOkResponse({ description: 'Persona eliminada exitosamente' })
  @ApiNotFoundResponse({ description: 'Persona no encontrada' })
  remove(@Param('id') id: string) {
    return this.personasService.remove(id);
  }
}