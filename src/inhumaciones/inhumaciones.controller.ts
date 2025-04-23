import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { InhumacionesService } from './inhumaciones.service';
import { Inhumacion } from './entities/inhumacion.entity';

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
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: Partial<Inhumacion>) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
