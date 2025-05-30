import { Controller, Get, Post, Body, Param, Delete, Put, Patch, UseGuards } from '@nestjs/common';
import { NichoService } from './nicho.service';
import { CreateNichoDto } from './dto/create-nicho.dto';
import { UpdateNichoDto } from './dto/update-nicho.dto';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('nichos')
@Controller('nichos')
export class NichosController {
  constructor(private readonly nichosService: NichoService) {}

  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Crear un nuevo nicho' })
  @ApiBody({ 
    type: CreateNichoDto,
    examples: {
      ejemplo1: {
        value: {
          id_cementerio: "123e4567-e89b-12d3-a456-426614174000",
          sector: "A",
          fila: "1",
          numero: "15",
          tipo: "Fosa",
          fecha_construccion: "2023-01-01",
          num_huecos: 2
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Nicho creado exitosamente' })
  create(@Body() createNichoDto: CreateNichoDto) {
    return this.nichosService.create(createNichoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los nichos' })
  @ApiResponse({ status: 200, description: 'Lista de nichos' })
  findAll() {
    return this.nichosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un nicho por ID' })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Detalles del nicho' })
  @ApiResponse({ status: 404, description: 'Nicho no encontrado' })
  findOne(@Param('id') id: string) {
    return this.nichosService.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Actualizar un nicho' })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiBody({ 
    type: UpdateNichoDto,
    examples: {
      ejemplo1: {
        value: {
          sector: "B",
          fila: "2",
          numero: "20"
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Nicho actualizado' })
  @ApiResponse({ status: 404, description: 'Nicho no encontrado' })
  update(@Param('id') id: string, @Body() updateDto: UpdateNichoDto) {
    return this.nichosService.update(id, updateDto);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Eliminar un nicho' })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Nicho eliminado' })
  @ApiResponse({ status: 404, description: 'Nicho no encontrado' })
  remove(@Param('id') id: string) {
    return this.nichosService.remove(id);
  }
}