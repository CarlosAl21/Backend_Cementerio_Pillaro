// src/exhumacion/exhumacion.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExumacionService } from './exumacion.service';
import { CreateExumacionDto } from './dto/create-exumacion.dto';
import { UpdateExumacionDto } from './dto/update-exumacion.dto';

@Controller('exumaciones')
export class ExumacionController {
  constructor(private readonly exumacionService: ExumacionService) {}

  @Post()
  create(@Body() createExumacionDto: CreateExumacionDto) {
    return this.exumacionService.create(createExumacionDto);
  }

  @Get()
  findAll() {
    return this.exumacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exumacionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExumacionDto: UpdateExumacionDto) {
    return this.exumacionService.update(+id, updateExumacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exumacionService.remove(+id);
  }

  @Get(':id/formulario')
  generarFormulario(@Param('id') id: string) {
    return this.exumacionService.generarFormularioExumacion(+id);
  }
}