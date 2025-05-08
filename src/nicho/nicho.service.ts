import { Injectable, NotFoundException } from '@nestjs/common';
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
    const nicho = this.nichoRepository.create(createNichoDto);
    return await this.nichoRepository.save(nicho);
  }

  async findAll(): Promise<Nicho[]> {
    return await this.nichoRepository.find();
  }

  async findOne(id: string): Promise<Nicho> {
    const nicho = await this.nichoRepository.findOne({ where: { idNicho: id } });
    if (!nicho) {
      throw new NotFoundException(`Nicho con ID ${id} no encontrado`);
    }
    return nicho;
  }

  async update(id: string, updateDto: UpdateNichoDto): Promise<Nicho> {
    const nicho = await this.findOne(id);
    Object.assign(nicho, updateDto);
    return await this.nichoRepository.save(nicho);
  }

  async remove(id: string): Promise<void> {
    const result = await this.nichoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Nicho con ID ${id} no encontrado`);
    }
  }
}