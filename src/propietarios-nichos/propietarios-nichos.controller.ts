import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PropietariosNichosService } from './propietarios-nichos.service';
import { CreatePropietariosNichoDto } from './dto/create-propietarios-nicho.dto';
import { UpdatePropietariosNichoDto } from './dto/update-propietarios-nicho.dto';

@Controller('propietarios-nichos')
export class PropietariosNichosController {
  constructor(private readonly propietariosNichosService: PropietariosNichosService) {}

  @Post()
  create(@Body() createPropietariosNichoDto: CreatePropietariosNichoDto) {
    return this.propietariosNichosService.create(createPropietariosNichoDto);
  }

  @Get()
  findAll() {
    return this.propietariosNichosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propietariosNichosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePropietariosNichoDto: UpdatePropietariosNichoDto) {
    return this.propietariosNichosService.update(+id, updatePropietariosNichoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propietariosNichosService.remove(+id);
  }
}
