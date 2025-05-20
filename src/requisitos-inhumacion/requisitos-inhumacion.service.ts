import { Injectable } from '@nestjs/common';
import { CreateRequisitosInhumacionDto } from './dto/create-requisitos-inhumacion.dto';
import { UpdateRequisitosInhumacionDto } from './dto/update-requisitos-inhumacion.dto';

@Injectable()
export class RequisitosInhumacionService {
  create(createRequisitosInhumacionDto: CreateRequisitosInhumacionDto) {
    return 'This action adds a new requisitosInhumacion';
  }

  findAll() {
    return `This action returns all requisitosInhumacion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} requisitosInhumacion`;
  }

  update(id: number, updateRequisitosInhumacionDto: UpdateRequisitosInhumacionDto) {
    return `This action updates a #${id} requisitosInhumacion`;
  }

  remove(id: number) {
    return `This action removes a #${id} requisitosInhumacion`;
  }
}
