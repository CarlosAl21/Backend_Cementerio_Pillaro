import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CementerioService } from './cementerio.service';
import { CreateCementerioDto } from './dto/create-cementerio.dto';
import { UpdateCementerioDto } from './dto/update-cementerio.dto';

@Controller('cementerio')
export class CementerioController {
  constructor(private readonly cementerioService: CementerioService) {}

  @Post()
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCementerioDto: UpdateCementerioDto) {
    return this.cementerioService.update(id, updateCementerioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cementerioService.remove(id);
  }
}
