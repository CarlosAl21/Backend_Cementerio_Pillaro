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

  async create(createHuecosNichoDto: CreateHuecosNichoDto) {
    try {
      const hueco = this.huecoRepository.create(createHuecosNichoDto);
      const savedHueco = await this.huecoRepository.save(hueco);
      // Mapeo explícito de la respuesta
      return {
        hueco: savedHueco,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el hueco');
    }
  }

  findAll() {
    try {
      return this.huecoRepository.find({
        relations: ['id_nicho', 'id_fallecido'],
      }).then(huecos =>
        huecos.map(h => ({
          hueco: {
            ...h,
            id_nicho: undefined,
            id_fallecido: undefined,
          },
          nicho: h.id_nicho,
          fallecido: h.id_fallecido,
        }))
      );
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los huecos');
    }
  }

  async findOne(id: string) {
    try {
      const hueco = await this.huecoRepository.findOne({ where: { id_detalle_hueco: id }, relations: ['id_nicho', 'id_fallecido'] });
      if (!hueco) {
        throw new NotFoundException(`Hueco con ID ${id} no encontrado`);
      }
      // Mapeo explícito de la respuesta
      return {
        hueco: {
          ...hueco,
          id_nicho: undefined,
          id_fallecido: undefined,
        },
        nicho: hueco.id_nicho,
        fallecido: hueco.id_fallecido,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al buscar el hueco');
    }
  }

  async findByNicho(id_nicho: string) {
    try {
      const huecos = await this.huecoRepository
        .createQueryBuilder('hueco')
        .leftJoinAndSelect('hueco.id_nicho', 'nicho')
        .leftJoinAndSelect('hueco.id_fallecido', 'fallecido')
        .where('nicho.id_nicho = :id_nicho', { id_nicho })
        .getMany();
      // Mapeo explícito de la respuesta
      return huecos.map(h => ({
        hueco: {
          ...h,
          id_nicho: undefined,
          id_fallecido: undefined,
        },
        nicho: h.id_nicho,
        fallecido: h.id_fallecido,
      }));
    } catch (error) {
      console.log('Error en findByNicho:', error);
      throw new InternalServerErrorException('Error al buscar huecos por nicho');
    }
  }

  async update(id: string, updateDto: UpdateHuecosNichoDto) {
    try {
      const hueco = await this.findOne(id);
      Object.assign(hueco.hueco, updateDto);
      const savedHueco = await this.huecoRepository.save(hueco.hueco);
      // Mapeo explícito de la respuesta
      return {
        hueco: savedHueco,
        nicho: hueco.nicho,
        fallecido: hueco.fallecido,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al actualizar el hueco');
    }
  }

  async remove(id: string) {
    try {
      const result = await this.huecoRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Hueco con ID ${id} no encontrado`);
      }
      // Mapeo explícito de la respuesta
      return { deleted: true, id };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al eliminar el hueco');
    }
  }
}
