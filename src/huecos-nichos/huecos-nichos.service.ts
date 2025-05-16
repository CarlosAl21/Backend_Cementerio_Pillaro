import { Injectable, NotFoundException } from '@nestjs/common';
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
    const hueco = this.huecoRepository.create(createHuecosNichoDto);
    return await this.huecoRepository.save(hueco);
  }

  async findAll(): Promise<HuecosNicho[]> {
     return await this.huecoRepository.find();
   }

  async findOne(id: string): Promise<HuecosNicho> {
    const hueco = await this.huecoRepository.findOne({ where: { idDetalleHueco: id } });
    if (!hueco) {
      throw new NotFoundException(`Hueco con ID ${id} no encontrado`);
    }
    return hueco;
  }

  async findByNicho(idNicho: string): Promise<HuecosNicho[]> {
    return await this.huecoRepository.find({
      where: {
        idNicho: {
          idNicho,
        },
      },
    });
  }

  async update(id: string, updateDto: UpdateHuecosNichoDto): Promise<HuecosNicho> {
    const hueco = await this.findOne(id);
    Object.assign(hueco, updateDto);
    return await this.huecoRepository.save(hueco);
  }

  async remove(id: string): Promise<void> {
    const result = await this.huecoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Hueco con ID ${id} no encontrado`);
    }
  }
}
