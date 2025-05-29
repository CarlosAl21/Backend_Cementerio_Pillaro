import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RequisitosInhumacionService } from './requisitos-inhumacion.service';
import { CreateRequisitosInhumacionDto } from './dto/create-requisitos-inhumacion.dto';
import { UpdateRequisitosInhumacionDto } from './dto/update-requisitos-inhumacion.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('Requisitos Inhumacion')
@Controller('requisitos-inhumacion')
export class RequisitosInhumacionController {
  constructor(private readonly requisitosInhumacionService: RequisitosInhumacionService) {}

  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Crear un nuevo requisito de inhumación' })
  @ApiBody({
    type: CreateRequisitosInhumacionDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de creación',
        value: {
          // Ajusta los campos según tu DTO real
          fecha: '2024-06-01',
          solicitante: 'uuid-solicitante',
          fosa: 'uuid-fosa',
          fallecido: 'uuid-fallecido',
          observaciones: 'Observaciones de ejemplo'
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Requisito creado correctamente.' })
  create(@Body() createRequisitosInhumacionDto: CreateRequisitosInhumacionDto) {
    return this.requisitosInhumacionService.create(createRequisitosInhumacionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los requisitos de inhumación' })
  @ApiResponse({ status: 200, description: 'Lista de requisitos de inhumación.' })
  findAll() {
    return this.requisitosInhumacionService.findAll();  
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un requisito de inhumación por ID' })
  @ApiParam({ name: 'id', description: 'ID del requisito de inhumación' })
  @ApiResponse({ status: 200, description: 'Requisito encontrado.' })
  @ApiResponse({ status: 404, description: 'Requisito no encontrado.' })
  findOne(@Param('id') id: string) {
    return this.requisitosInhumacionService.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Actualizar un requisito de inhumación' })
  @ApiParam({ name: 'id', description: 'ID del requisito de inhumación' })
  @ApiBody({
    type: UpdateRequisitosInhumacionDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de actualización',
        value: {
          // Ajusta los campos según tu DTO real
          observaciones: 'Observaciones actualizadas'
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Requisito actualizado correctamente.' })
  @ApiResponse({ status: 404, description: 'Requisito no encontrado.' })
  update(@Param('id') id: string, @Body() updateRequisitosInhumacionDto: UpdateRequisitosInhumacionDto) {
    return this.requisitosInhumacionService.update(id, updateRequisitosInhumacionDto);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Eliminar un requisito de inhumación' })
  @ApiParam({ name: 'id', description: 'ID del requisito de inhumación' })
  @ApiResponse({ status: 200, description: 'Requisito eliminado correctamente.' })
  @ApiResponse({ status: 404, description: 'Requisito no encontrado.' })
  remove(@Param('id') id: string) {
    return this.requisitosInhumacionService.remove(id);
  }
}
