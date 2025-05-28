import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { Persona } from './entities/persona.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class PersonasService {
  constructor(
    @InjectRepository(Persona)
    private personaRepo: Repository<Persona>,
  ) {}

  async create(createPersonaDto: CreatePersonaDto) {
    try {
      const persona = this.personaRepo.create(createPersonaDto);
      return await this.personaRepo.save(persona);
    } catch (error) {
      throw new InternalServerErrorException('Error creating persona');
    }
  }

  findAll(): Promise<Persona[]> {
    return this.personaRepo.find();
  }

  async findOne(id: string){
    try {
      const persona = await this.personaRepo.findOne({ where: { id_persona: id } });
      if (!persona) {
        throw new NotFoundException('Persona not found');
      }
      return persona;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error finding persona');
    }
  }

  // METODO DE BUSQUEDA POR CEDULA O NOMBRES
  async findBy(cedula?: string, nombres?: string): Promise<Persona[]> {
    try {
      const query = this.personaRepo.createQueryBuilder('persona');
      if (!cedula && !nombres) {
        return this.personaRepo.find();
      }
      if (cedula) {
        query.andWhere('persona.cedula = :cedula', { cedula });
      }
      if (nombres) {
        query.andWhere('persona.nombres LIKE :nombres', { nombres: `%${nombres}%` });
      }
      return query.getMany();
    } catch (error) {
      throw new InternalServerErrorException('Error finding persona by cedula or nombres');
    }
  }

  async update(id: string, dto: UpdatePersonaDto) {
    try {
      const persona = await this.personaRepo.findOne({ where: { id_persona: id } });
      if (!persona) {
        throw new NotFoundException('Persona not found');
      }
      this.personaRepo.merge(persona, dto);
      return await this.personaRepo.save(persona);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error updating persona');
    }
  }

  async remove(id: string){
    try {
      const persona = await this.personaRepo.findOne({ where: { id_persona: id } });
      if (!persona) {
        throw new NotFoundException('Persona not found');
      }
      return await this.personaRepo.remove(persona);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error removing persona');
    }
  }
}

