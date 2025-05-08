import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { NichoService } from './nicho.service';
import { CreateNichoDto } from './dto/create-nicho.dto';
import { UpdateNichoDto } from './dto/update-nicho.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('nichos')
@Controller('nichos')
export class NichosController {
  constructor(private readonly nichosService: NichoService) {}

  @Post()
  create(@Body() createNichoDto: CreateNichoDto) {
    return this.nichosService.create(createNichoDto);
  }

  @Get()
  findAll() {
    return this.nichosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nichosService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateNichoDto) {
    return this.nichosService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nichosService.remove(id);
  }
}
