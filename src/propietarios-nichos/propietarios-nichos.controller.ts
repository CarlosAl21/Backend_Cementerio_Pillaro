import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PropietariosNichosService } from './propietarios-nichos.service';
import { CreatePropietarioNichoDto } from './dto/create-propietarios-nicho.dto';
import { UpdatePropietarioNichoDto } from './dto/update-propietarios-nicho.dto';


@Controller('propietarios-nichos')
export class PropietariosNichosController {
  constructor(private readonly propietariosService: PropietariosNichosService) {}

  @Post()
  create(@Body() dto: CreatePropietarioNichoDto) {
    return this.propietariosService.create(dto);
  }

  @Get()
  findAll() {
    return this.propietariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propietariosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePropietarioNichoDto) {
    return this.propietariosService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propietariosService.remove(+id);
  }
}
