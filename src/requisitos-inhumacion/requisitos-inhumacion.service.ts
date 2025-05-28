import { Injectable, NotFoundException, BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';
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

  async create(dto: CreateRequisitosInhumacionDto) {
    try {
      const entity = this.repo.create(dto);
      return await this.repo.save(entity);
    } catch (error) {
      // Puedes personalizar el control de errores según la lógica de negocio
      throw new InternalServerErrorException('Error al crear el requisito');
    }
  }

  async findAll() {
    try {
      return await this.repo.find({ relations: ['id_cementerio', 'id_solicitante', 'id_hueco_nicho', 'id_fallecido'] });
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los requisitos');
    }
  }

  async findOne(id: string) {
    try {
      const record = await this.repo.findOne({
        where: { id_requsitoInhumacion: id },
        relations: ['id_cementerio', 'id_solicitante', 'id_hueco_nicho', 'id_fallecido'],
      });
      if (!record)
        throw new NotFoundException(`Requisito ${id} no encontrado`);
      return record;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al buscar el requisito');
    }
  }

  async update(id: string, dto: UpdateRequisitosInhumacionDto) {
    try {
      const updateResult = await this.repo.update(id, dto);
      if (!updateResult.affected) {
        throw new NotFoundException(`Requisito ${id} no encontrado`);
      }
      return this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al actualizar el requisito');
    }
  }

  async remove(id: string) {
    try {
      const res = await this.repo.delete(id);
      if (!res.affected)
        throw new NotFoundException(`Requisito ${id} no encontrado`);
      return { deleted: true };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al eliminar el requisito');
    }
  }
}
