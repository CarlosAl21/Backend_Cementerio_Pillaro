import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RequisitosInhumacionService } from './requisitos-inhumacion.service';
import { CreateRequisitosInhumacionDto } from './dto/create-requisitos-inhumacion.dto';
import { UpdateRequisitosInhumacionDto } from './dto/update-requisitos-inhumacion.dto';

@Controller('requisitos-inhumacion')
export class RequisitosInhumacionController {
  constructor(private readonly requisitosInhumacionService: RequisitosInhumacionService) {}

  @Post()
  create(@Body() createRequisitosInhumacionDto: CreateRequisitosInhumacionDto) {
    return this.requisitosInhumacionService.create(createRequisitosInhumacionDto);
  }

  @Get()
  findAll() {
    return this.requisitosInhumacionService.findAll();  
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requisitosInhumacionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRequisitosInhumacionDto: UpdateRequisitosInhumacionDto) {
    return this.requisitosInhumacionService.update(+id, updateRequisitosInhumacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requisitosInhumacionService.remove(+id);
  }
}
