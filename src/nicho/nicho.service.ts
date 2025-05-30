import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nicho } from './entities/nicho.entity';
import { CreateNichoDto } from './dto/create-nicho.dto';
import { UpdateNichoDto } from './dto/update-nicho.dto';
@Injectable()
export class NichoService {

@InjectRepository(Nicho)
private readonly nichoRepository: Repository<Nicho>
  constructor() {}

  async create(createNichoDto: CreateNichoDto): Promise<Nicho> {
    try {
      const nicho = this.nichoRepository.create(createNichoDto);
      return await this.nichoRepository.save(nicho);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el nicho');
    }
  }

  async findAll(): Promise<Nicho[]> {
    try {
      return await this.nichoRepository.find({relations: ['id_cementerio', 'inhumaciones', 'propietarios_nicho', 'huecos', 'inhumaciones.id_fallecido']});
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los nichos');
    }
  }

  async findOne(id: string): Promise<Nicho> {
    try {
      const nicho = await this.nichoRepository.findOne({ where: { id_nicho: id }, relations: ['id_cementerio', 'inhumaciones', 'propietarios_nicho', 'huecos','inhumaciones.id_fallecido'] });
      if (!nicho) {
        throw new NotFoundException(`Nicho con ID ${id} no encontrado`);
      }
      return nicho;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al buscar el nicho');
    }
  }

  async update(id: string, updateDto: UpdateNichoDto): Promise<Nicho> {
    try {
      const nicho = await this.findOne(id);
      Object.assign(nicho, updateDto);
      return await this.nichoRepository.save(nicho);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al actualizar el nicho');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.nichoRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Nicho con ID ${id} no encontrado`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al eliminar el nicho');
    }
  }
}