import { Injectable } from '@nestjs/common';
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

  create(createPersonaDto: CreatePersonaDto): Promise<Persona> {
    return this.personaRepo.save(createPersonaDto);
  }

  findAll(): Promise<Persona[]> {
    return this.personaRepo.find();
  }

  async findOne(id: number): Promise<Persona> {
    const persona = await this.personaRepo.findOneBy({ id_persona: id });
    if (!persona) {
      throw new Error(`Persona with id ${id} not found`);
    }
    return persona;
  }

  // METODO DE BUSQUEDA POR CEDULA O NOMBRES
  async findBy(cedula?: string, nombres?: string): Promise<Persona[]> {
    const query = this.personaRepo.createQueryBuilder('persona');
  
    // EN CASO QUE NO ENCUENTRE NINGUN PARAMETRO DEVUELVE TODOS LOS REGISTROS
    if (!cedula && !nombres) {
      return this.personaRepo.find();
    }
  
    // BUSQUEDA POR CEDULA
    if (cedula) {
      query.andWhere('persona.cedula = :cedula', { cedula });
    }
  
    // BUSQUEDA POR NOMBRES 
    if (nombres) {
      query.andWhere('persona.nombres LIKE :nombres', { nombres: `%${nombres}%` });
    }
  
    return query.getMany();
  }
  
  
//ACTUALIZACION DE REGISTROS
  async update(id: number, dto: UpdatePersonaDto): Promise<Persona> {
    await this.personaRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.personaRepo.delete(id);
  }
}

