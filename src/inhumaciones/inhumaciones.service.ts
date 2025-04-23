import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inhumacion } from './entities/inhumacion.entity';

@Injectable()
export class InhumacionesService {
  constructor(
    @InjectRepository(Inhumacion)
    private readonly repo: Repository<Inhumacion>,
  ) {}

  // Crear inhumación
  async create(data: Partial<Inhumacion>) {
    try {
      const inhumacion = this.repo.create(data);  // Crea la instancia de la entidad con los datos
      return await this.repo.save(inhumacion);    // Guarda la entidad en la base de datos
    } catch (error) {
      console.error('Error al crear inhumación:', error);
      throw new InternalServerErrorException(error.message || 'No se pudo crear la inhumación');
    }
  }

  // Obtener todas las inhumaciones
  async findAll() {
    try {
      return await this.repo.find();
    } catch (error) {
      console.error('Error al listar inhumaciones:', error);
      throw new InternalServerErrorException(error.message || 'No se pudo obtener la lista de inhumaciones');
    }
  }

  // Obtener una inhumación por ID
  async findOne(id: number) {
    const inhumacion = await this.repo.findOne({ where: { id_inhumacion: id } });
    if (!inhumacion) {
      throw new NotFoundException(`Inhumación con ID ${id} no encontrada`);
    }
    return inhumacion;
  }

  // Actualizar una inhumación
  async update(id: number, data: Partial<Inhumacion>) {
    const inhumacion = await this.repo.findOne({ where: { id_inhumacion: id } });
    if (!inhumacion) {
      throw new NotFoundException(`Inhumación con ID ${id} no encontrada`);
    }
    try {
      // Desestructuramos el objeto de inhumacion original y los datos nuevos
      return await this.repo.save({ ...inhumacion, ...data });
    } catch (error) {
      console.error('Error al actualizar inhumación:', error);
      throw new InternalServerErrorException(error.message || 'No se pudo actualizar la inhumación');
    }
  }

  // Eliminar una inhumación
  async remove(id: number) {
    const inhumacion = await this.repo.findOne({ where: { id_inhumacion: id } });
    if (!inhumacion) {
      throw new NotFoundException(`Inhumación con ID ${id} no encontrada`);
    }
    try {
      await this.repo.remove(inhumacion);
      return { message: 'Inhumación eliminada correctamente' };
    } catch (error) {
      console.error('Error al eliminar inhumación:', error);
      throw new InternalServerErrorException(error.message || 'No se pudo eliminar la inhumación');
    }
  }
}
