import { CreateInhumacionDto } from './dto/create-inhumaciones.dto';
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inhumacion } from './entities/inhumacion.entity';
import { UpdateInhumacionDto } from './dto/update-inhumacione.dto';
import { HuecosNicho } from 'src/huecos-nichos/entities/huecos-nicho.entity';

@Injectable()
export class InhumacionesService {
  constructor(
    @InjectRepository(Inhumacion) private readonly repo: Repository<Inhumacion>,
    @InjectRepository(HuecosNicho) private readonly huecosNichoRepo: Repository<HuecosNicho>,
  ) {}

  // Crear inhumación
  async create(CreateInhumacionDto: CreateInhumacionDto) {
    try {
      const inhumacion = this.repo.create(CreateInhumacionDto);
      return await this.repo.save(inhumacion);
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'No se pudo crear la inhumación');
    }
  }

  // Obtener todas las inhumaciones
  async findAll() {
    try {
      return await this.repo.find({
        relations: ['id_nicho', 'id_fallecido'],});
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'No se pudieron obtener las inhumaciones');
    }
  }

  // Obtener una inhumación por ID
  async findOne(id: string) {
    try {
      const inhumacion = await this.repo.findOne({ where: { id_inhumacion: id }, relations: ['id_nicho', 'id_fallecido'] });
      if (!inhumacion) {
        throw new NotFoundException(`Inhumación con ID ${id} no encontrada`);
      }
      return inhumacion;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
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
      this.repo.merge(inhumacion, updateInhumacionDto);
      const saveInhumacion = await this.repo.save(inhumacion);
      
      if(saveInhumacion.estado === 'completado') {
        const huecoNicho = await this.huecosNichoRepo.findOne({ where: { id_detalle_hueco: saveInhumacion.id_requisitos_inhumacion.id_hueco_nicho.id_detalle_hueco} });
        if (!huecoNicho) {
          throw new NotFoundException('Hueco Nicho no encontrado');
        }
        const huecoNichoActualizado = this.huecosNichoRepo.merge(huecoNicho, { estado: 'ocupado' });
        const savedHuecoNicho = await this.huecosNichoRepo.save(huecoNichoActualizado);

        return { saveInhumacion, savedHuecoNicho };
      }
      return saveInhumacion;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
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
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message || 'No se pudo eliminar la inhumación');
    }
  }
}
