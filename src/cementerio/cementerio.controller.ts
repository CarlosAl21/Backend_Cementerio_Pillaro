import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CementerioService } from './cementerio.service';
import { CreateCementerioDto } from './dto/create-cementerio.dto';
import { UpdateCementerioDto } from './dto/update-cementerio.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('cementerio')
export class CementerioController {
  constructor(private readonly cementerioService: CementerioService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createCementerioDto: CreateCementerioDto) {
    return this.cementerioService.create(createCementerioDto);
  }

  @Get()
  findAll() {
    return this.cementerioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cementerioService.findOne(id);
  }

  @Get('nombre/:nombre')
  findByNombre(@Param('nombre') nombre: string) {
    return this.cementerioService.findByName(nombre);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateCementerioDto: UpdateCementerioDto) {
    return this.cementerioService.update(id, updateCementerioDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.cementerioService.remove(id);
  }
}
