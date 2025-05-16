import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HuecosNichosService } from './huecos-nichos.service';
import { CreateHuecosNichoDto } from './dto/create-huecos-nicho.dto';
import { UpdateHuecosNichoDto } from './dto/update-huecos-nicho.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { HuecosNicho } from './entities/huecos-nicho.entity';

@Controller('huecos-nichos')
export class HuecosNichosController {
  constructor(private readonly huecosNichosService: HuecosNichosService) {}

  @Post()
    @ApiOperation({ summary: 'Crear un nuevo hueco para el nicho' })
    @ApiBody({ 
      type: CreateHuecosNichoDto,
      examples: {
        ejemplo1: {
          value: {
            idDetalleHueco: "123e4567-e89b-12d3-a456-426614174000",
            idNicho: "123e4567-e89b-12d3-a456-426614174001",
            numeroHueco: 1,
            idFallecidoInhumado: "123e4567-e89b-12d3-a456-426614174001",
          }
        }
      }
    })
    @ApiResponse({ status: 201, description: 'Hueco creado exitosamente' })
    create(@Body() createHuecosNichoDto: CreateHuecosNichoDto) {
      return this.huecosNichosService.create(createHuecosNichoDto);
    }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los huecos' })
  @ApiResponse({ status: 200, description: 'Lista de huecos' })
  findAll() {
    return this.huecosNichosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un hueco por ID' })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Detalles del hueco' })
  @ApiResponse({ status: 404, description: 'Hueco no encontrado' })
  findOne(@Param('id') id: string) {
    return this.huecosNichosService.findOne(id);
  }

    @Get('por-nicho/:idNicho')
  @ApiOperation({ summary: 'Obtener todos los huecos de un nicho por su ID' })
  @ApiParam({ name: 'idNicho', example: '456e7890-f12a-45c6-b789-123456789abc' })
  @ApiResponse({ status: 200, description: 'Lista de huecos del nicho' })
  @ApiResponse({ status: 404, description: 'No se encontraron huecos para el nicho dado' })
  findByNicho(@Param('idNicho') idNicho: string): Promise<HuecosNicho[]> {
    return this.huecosNichosService.findByNicho(idNicho);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un hueco' })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiBody({ 
    type: UpdateHuecosNichoDto,
    examples: {
      ejemplo1: {
        value: {
          idFallecidoInhumado: "123e4567-e89b-12d3-a456-426614174009",
        }
      }
    }
  })

  @ApiResponse({ status: 200, description: 'Hueco actualizado' })
  @ApiResponse({ status: 404, description: 'Hueco no encontrado' })
    update(@Param('id') id: string, @Body() updateDto: UpdateHuecosNichoDto) {
      return this.huecosNichosService.update(id, updateDto);
    }


  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un hueco' })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Hueco eliminado' })
  @ApiResponse({ status: 404, description: 'Hueco no encontrado' })
    remove(@Param('id') id: string) {
      return this.huecosNichosService.remove(id);
   }
}
