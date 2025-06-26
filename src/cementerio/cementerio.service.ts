import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateCementerioDto } from './dto/create-cementerio.dto';
import { UpdateCementerioDto } from './dto/update-cementerio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cementerio } from './entities/cementerio.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class CementerioService {
  constructor(@InjectRepository (Cementerio) private readonly cementerioRepository: Repository<Cementerio>) {
    console.log('CementerioService initialized');
  }
  async create(createCementerioDto: CreateCementerioDto) {
    try {
      // Verificar si ya existe un cementerio con el mismo nombre
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
      throw new InternalServerErrorException('Error en la creacion');
    }
  }

  async findAll() {
    const cementerios = await this.cementerioRepository.find();
    // Mapeo explícito de la respuesta
    return cementerios.map(cementerio => ({ ...cementerio }));
  }

  async findOne(id: string) {
    try {
      const cementerio = await this.cementerioRepository.findOne({where: {id_cementerio: id}});
      if (!cementerio) {
        throw new NotFoundException('No se encontro el cementerio');
      }
      // Mapeo explícito de la respuesta
      return { ...cementerio };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error en la busqueda');
    }
  }

  async update(id: string, updateCementerioDto: UpdateCementerioDto) {
    try {
      // Verificar si ya existe otro cementerio con el mismo nombre
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
      throw new InternalServerErrorException('Error en la actualizacion');
    }
  }

  async remove(id: string) {
    try {
      const cementerio = await this.cementerioRepository.findOne({where: {id_cementerio: id}});
      if (!cementerio) {
        throw new NotFoundException('No se encontro el cementerio');
      }
      await this.cementerioRepository.remove(cementerio);
      // Mapeo explícito de la respuesta
      return { deleted: true, id };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error en la eliminacion');
    }
  }

  async findByName(name: string) {
    try {
      const cementerio = await this.cementerioRepository.findOne({where: {nombre: Like(`%${name}%`)} });
      if (!cementerio) {
        throw new NotFoundException('No se encontro el cementerio');
      }
      // Mapeo explícito de la respuesta
      return { cementerio };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error en la busqueda');
    }
  }
}
