import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateCementerioDto } from './dto/create-cementerio.dto';
import { UpdateCementerioDto } from './dto/update-cementerio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cementerio } from './entities/cementerio.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class CementerioService {
  constructor(@InjectRepository(Cementerio) private readonly cementerioRepository: Repository<Cementerio>) {
    console.log('CementerioService initialized');
  }

  async create(createCementerioDto: CreateCementerioDto) {
    try {
      const existente = await this.cementerioRepository.findOne({
        where: { nombre: createCementerioDto.nombre },
      });
      if (existente) {
        throw new InternalServerErrorException('Ya existe un cementerio con ese nombre');
      }
      const cementerio = this.cementerioRepository.create(createCementerioDto);
      const savedCementerio = await this.cementerioRepository.save(cementerio);
      return { cementerio: savedCementerio };
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el cementerio: ' + (error.message || error));
    }
  }

  async findAll() {
    try {
      const cementerios = await this.cementerioRepository.find();
      return cementerios.map(cementerio => ({ ...cementerio }));
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los cementerios: ' + (error.message || error));
    }
  }

  async findOne(id: string) {
    try {
      const cementerio = await this.cementerioRepository.findOne({ where: { id_cementerio: id } });
      if (!cementerio) {
        throw new NotFoundException('No se encontro el cementerio');
      }
      return { ...cementerio };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al buscar el cementerio: ' + (error.message || error));
    }
  }

  async update(id: string, updateCementerioDto: UpdateCementerioDto) {
    try {
      const existente = await this.cementerioRepository.findOne({
        where: { nombre: updateCementerioDto.nombre },
      });
      if (existente && existente.id_cementerio !== id) {
        throw new InternalServerErrorException('Ya existe un cementerio con ese nombre');
      }
      const cementerio = await this.cementerioRepository.findOne({ where: { id_cementerio: id } });
      if (!cementerio) {
        throw new NotFoundException('No se encontro el cementerio');
      }
      this.cementerioRepository.merge(cementerio, updateCementerioDto);
      const savedCementerio = await this.cementerioRepository.save(cementerio);
      return { cementerio: savedCementerio };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al actualizar el cementerio: ' + (error.message || error));
    }
  }

  async remove(id: string) {
    try {
      const cementerio = await this.cementerioRepository.findOne({ where: { id_cementerio: id } });
      if (!cementerio) {
        throw new NotFoundException('No se encontro el cementerio');
      }
      await this.cementerioRepository.remove(cementerio);
      return { deleted: true, id };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al eliminar el cementerio: ' + (error.message || error));
    }
  }

  async findByName(name: string) {
    try {
      const cementerio = await this.cementerioRepository.findOne({ where: { nombre: Like(`%${name}%`) } });
      if (!cementerio) {
        throw new NotFoundException('No se encontro el cementerio');
      }
      return { cementerio };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al buscar el cementerio: ' + (error.message || error));
    }
  }
}
