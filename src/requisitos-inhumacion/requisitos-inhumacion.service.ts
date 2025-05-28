import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequisitosInhumacion } from './entities/requisitos-inhumacion.entity';
import { CreateRequisitosInhumacionDto } from './dto/create-requisitos-inhumacion.dto';
import { UpdateRequisitosInhumacionDto } from './dto/update-requisitos-inhumacion.dto';

@Injectable()
export class RequisitosInhumacionService {
  constructor(
    @InjectRepository(RequisitosInhumacion)
    private repo: Repository<RequisitosInhumacion>,
  ) {}

  create(dto: CreateRequisitosInhumacionDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ relations: ['solicitante', 'fosa', 'fallecido'] });
  }

  async findOne(id: string) {
    const record = await this.repo.findOne({
      where: { id_requsitoInhumacion: id },
      relations: ['solicitante', 'fosa', 'fallecido'],
    });
    if (!record)
      throw new NotFoundException(`Requisito ${id} no encontrado`);
    return record;
  }

  async update(id: string, dto: UpdateRequisitosInhumacionDto) {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const res = await this.repo.delete(id);
    if (!res.affected)
      throw new NotFoundException(`Requisito ${id} no encontrado`);
    return { deleted: true };
  }
}
