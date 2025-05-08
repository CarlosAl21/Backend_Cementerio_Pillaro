import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { InhumacionesService } from './inhumaciones.service';
import { Inhumacion } from './entities/inhumacion.entity';
import { UpdateInhumacionDto } from './dto/update-inhumacione.dto';
import { CreateInhumacionDto } from './dto/create-inhumaciones.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiBearerAuth
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Inhumaciones')
@Controller('inhumaciones')
export class InhumacionesController {
  constructor(private readonly service: InhumacionesService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Crear nueva inhumación', 
    description: 'Registra una nueva inhumación en el sistema' 
  })
  @ApiBody({ 
    type: CreateInhumacionDto,
    examples: {
      ejemplo1: {
        value: {
          id_nicho: "123e4567-e89b-12d3-a456-426614174000",
          id_fallecido: "123e4567-e89b-12d3-a456-426614174001",
          fecha_inhumacion: "2023-06-15",
          hora_inhumacion: "14:30",
          codigo_inhumacion: "INH-2023-001",
          estado: "Programada"
        }
      }
    }
  })
  @ApiCreatedResponse({ 
    description: 'Inhumación creada exitosamente',
    type: Inhumacion 
  })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos' })
  async crearInhumacion(@Body() datos: CreateInhumacionDto) {
    return this.service.create(datos);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener todas las inhumaciones', 
    description: 'Devuelve una lista de todas las inhumaciones registradas' 
  })
  @ApiOkResponse({ 
    description: 'Lista de inhumaciones obtenida exitosamente',
    type: [Inhumacion] 
  })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener inhumación por ID', 
    description: 'Obtiene los detalles de una inhumación específica' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID de la inhumación',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiOkResponse({ 
    description: 'Inhumación encontrada',
    type: Inhumacion 
  })
  @ApiNotFoundResponse({ description: 'Inhumación no encontrada' })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Actualizar inhumación', 
    description: 'Actualiza completamente la información de una inhumación existente' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID de la inhumación a actualizar',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBody({ 
    type: UpdateInhumacionDto,
    examples: {
      ejemplo1: {
        value: {
          estado: "Realizada",
          hora_inhumacion: "15:00",
          observaciones: "Inhumación completada satisfactoriamente"
        }
      }
    }
  })
  @ApiOkResponse({ 
    description: 'Inhumación actualizada exitosamente',
    type: Inhumacion 
  })
  @ApiNotFoundResponse({ description: 'Inhumación no encontrada' })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateInhumacionDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Eliminar inhumación', 
    description: 'Elimina permanentemente un registro de inhumación' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID de la inhumación a eliminar',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiOkResponse({ description: 'Inhumación eliminada exitosamente' })
  @ApiNotFoundResponse({ description: 'Inhumación no encontrada' })
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}