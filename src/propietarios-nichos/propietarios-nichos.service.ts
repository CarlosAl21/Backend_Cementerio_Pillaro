import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
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

  async create(dto: CreatePropietarioNichoDto) {
    try {
      const propietario = this.propietarioRepo.create(dto);
      return await this.propietarioRepo.save(propietario);
    } catch (error) {
      throw new InternalServerErrorException(`Error creating PropietarioNicho: ${error.message}`);
    }
  }

  findAll(){
    return this.propietarioRepo.find({relations: ['id_nicho', 'id_persona']});
  }

  async findOne(id: string) {
    try {
      const propietario = await this.propietarioRepo.findOne({ where: { id_propietario_nicho: id },relations: ['id_nicho', 'id_persona'] });
      if (!propietario) {
        throw new NotFoundException(`PropietarioNicho with id ${id} not found`);
      }
      return propietario;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(`Error finding PropietarioNicho: ${error.message}`);
    }
  }

  async update(id: string, dto: UpdatePropietarioNichoDto){
    try {
      const propietario = await this.propietarioRepo.findOne({ where: { id_propietario_nicho: id } });
      if (!propietario) {
        throw new NotFoundException(`PropietarioNicho with id ${id} not found`);
      }
      this.propietarioRepo.merge(propietario, dto);
      return await this.propietarioRepo.save(propietario);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(`Error updating PropietarioNicho: ${error.message}`);
    }
  }

  async remove(id: string){
    try {
      const propietario = await this.propietarioRepo.findOne({ where: { id_propietario_nicho: id } });
      if (!propietario) {
        throw new NotFoundException(`PropietarioNicho with id ${id} not found`);
      }
      return await this.propietarioRepo.delete(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(`Error removing PropietarioNicho: ${error.message}`);
    }
  }
}
