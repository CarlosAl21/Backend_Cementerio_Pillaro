import { CreateInhumacionDto } from './dto/create-inhumaciones.dto';
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inhumacion } from './entities/inhumacion.entity';
import { UpdateInhumacionDto } from './dto/update-inhumacione.dto';

@Injectable()
export class InhumacionesService {
  constructor(
    @InjectRepository(Inhumacion) private readonly repo: Repository<Inhumacion>,
  ) {}

  // Crear inhumación
  async create(CreateInhumacionDto: CreateInhumacionDto) {
    try {
      const inhumacion = this.repo.create(CreateInhumacionDto);
      return await this.repo.save(inhumacion);
    } catch (error) {
      console.error('Error al crear inhumación:', error);
      throw new InternalServerErrorException(error.message || 'No se pudo crear la inhumación');
    }
  }

  // Obtener todas las inhumaciones
  async findAll() {
    return await this.repo.find();
  }

  // Obtener una inhumación por ID
  async findOne(id: string) {
    try {
      const inhumacion = await this.repo.findOne({ where: { id_inhumacion: id } });
      if (!inhumacion) {
        throw new NotFoundException(`Inhumación con ID ${id} no encontrada`);
      }
      return inhumacion;
    } catch (error) {
      console.error('Error al obtener inhumación:', error);
      throw new InternalServerErrorException(error.message || 'No se pudo obtener la inhumación');
    }
  }

  // Actualizar una inhumación
  async update(id: string, updateInhumacionDto: UpdateInhumacionDto) {
    try {
      const inhumacion = await this.repo.findOne({ where: { id_inhumacion: id } });
      if (!inhumacion) {
        throw new NotFoundException(`Inhumación con ID ${id} no encontrada`);
      }
      await this.repo.merge(inhumacion, updateInhumacionDto);
      return await this.repo.save(inhumacion);
    } catch (error) {
      console.error('Error al actualizar inhumación:', error);
      throw new InternalServerErrorException(error.message || 'No se pudo actualizar la inhumación');
    }
  }

  // Eliminar una inhumación
  async remove(id: string) {
    try {
      const inhumacion = await this.repo.findOne({ where: { id_inhumacion: id } });
      if (!inhumacion) {
        throw new NotFoundException(`Inhumación con ID ${id} no encontrada`);
      }
      return await this.repo.remove(inhumacion);
    } catch (error) {
      console.error('Error al eliminar inhumación:', error);
      throw new InternalServerErrorException(error.message || 'No se pudo eliminar la inhumación');
    }
  }
}
