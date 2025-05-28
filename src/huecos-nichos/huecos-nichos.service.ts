import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateHuecosNichoDto } from './dto/create-huecos-nicho.dto';
import { UpdateHuecosNichoDto } from './dto/update-huecos-nicho.dto';
import { HuecosNicho } from './entities/huecos-nicho.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class HuecosNichosService {
  @InjectRepository(HuecosNicho)
  private readonly huecoRepository: Repository<HuecosNicho>
    constructor() {}

  async create(createHuecosNichoDto: CreateHuecosNichoDto): Promise<HuecosNicho> {
    try {
      const hueco = this.huecoRepository.create(createHuecosNichoDto);
      return await this.huecoRepository.save(hueco);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el hueco');
    }
  }

  async findAll(): Promise<HuecosNicho[]> {
    try {
      return await this.huecoRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los huecos');
    }
  }

  async findOne(id: string): Promise<HuecosNicho> {
    try {
      const hueco = await this.huecoRepository.findOne({ where: { id_detalle_hueco: id } });
      if (!hueco) {
        throw new NotFoundException(`Hueco con ID ${id} no encontrado`);
      }
      return hueco;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al buscar el hueco');
    }
  }

  async findByNicho(id_nicho: string): Promise<HuecosNicho[]> {
    try {
      return await this.huecoRepository.find({
        where: {
          id_nicho: {
            id_nicho,
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error al buscar huecos por nicho');
    }
  }

  async update(id: string, updateDto: UpdateHuecosNichoDto): Promise<HuecosNicho> {
    try {
      const hueco = await this.findOne(id);
      Object.assign(hueco, updateDto);
      return await this.huecoRepository.save(hueco);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al actualizar el hueco');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.huecoRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Hueco con ID ${id} no encontrado`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al eliminar el hueco');
    }
  }
}
