import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { InhumacionesService } from './inhumaciones.service';
import { Inhumacion } from './entities/inhumacion.entity';
import { UpdateInhumacionDto } from './dto/update-inhumacione.dto';

@Controller('inhumaciones')
export class InhumacionesController {
  constructor(private readonly service: InhumacionesService) {}

  @Post()
  async crearInhumacion(@Body() datos: Inhumacion) {
    return this.service.create(datos);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() UpdateInhumacionDto: UpdateInhumacionDto) {
    return this.service.update(id, UpdateInhumacionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
