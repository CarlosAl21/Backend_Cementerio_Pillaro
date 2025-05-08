import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePropietarioNichoDto } from './dto/create-propietarios-nicho.dto';
import { UpdatePropietarioNichoDto } from './dto/update-propietarios-nicho.dto';
import { PropietarioNicho } from './entities/propietarios-nicho.entity';


@Injectable()
export class PropietariosNichosService {
  constructor(
    @InjectRepository(PropietarioNicho)
    private propietarioRepo: Repository<PropietarioNicho>,
  ) {}

  create(dto: CreatePropietarioNichoDto): Promise<PropietarioNicho> {
    return this.propietarioRepo.save(dto);
  }

  findAll(): Promise<PropietarioNicho[]> {
    return this.propietarioRepo.find();
  }

  async findOne(id: number): Promise<PropietarioNicho> {
    const propietario = await this.propietarioRepo.findOneBy({ id_propietario_nicho: id });
    if (!propietario) {
      throw new Error(`PropietarioNicho with id ${id} not found`);
    }
    return propietario;
  }

  async update(id: number, dto: UpdatePropietarioNichoDto): Promise<PropietarioNicho> {
    await this.propietarioRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.propietarioRepo.delete(id);
  }
}
