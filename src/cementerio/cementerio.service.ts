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
      const cementerio = this.cementerioRepository.create(createCementerioDto);
      return await this.cementerioRepository.save(cementerio);
    } catch (error) {
      throw new InternalServerErrorException('Error en la creacion');
    }
  }

  findAll() {
    return this.cementerioRepository.find();
  }

  async findOne(id: string) {
    try {
      const cementerio = await this.cementerioRepository.findOne({where: {id_cementerio: id}});
      if (!cementerio) {
        throw new NotFoundException('No se encontro el cementerio');
      }
      return cementerio;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error en la busqueda');
    }
  }

  async update(id: string, updateCementerioDto: UpdateCementerioDto) {
    try {
      const cementerio = await this.cementerioRepository.findOne({where: {id_cementerio: id}});
      if (!cementerio) {
        throw new NotFoundException('No se encontro el cementerio');
      }
      this.cementerioRepository.merge(cementerio, updateCementerioDto);
      return await this.cementerioRepository.save(cementerio);
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
      return await this.cementerioRepository.remove(cementerio);
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
      return cementerio;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error en la busqueda');
    }
  }
}
