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

  async create(createPersonaDto: CreatePersonaDto) {
    try {
      const persona = this.personaRepo.create(createPersonaDto);
      return await this.personaRepo.save(persona);
    } catch (error) {
      console.error('Error creating persona:', error);
      throw new Error('Error creating persona');
      
    }
  }

  findAll(): Promise<Persona[]> {
    return this.personaRepo.find();
  }

  async findOne(id: string){
    try {
      const persona = await this.personaRepo.findOne({ where: { id_persona: id } });
      if (!persona) {
        throw new Error('Persona not found');
      }
      return persona;
    } catch (error) {
      console.error('Error finding persona:', error);
      throw new Error('Error finding persona');
    }
  }

  // METODO DE BUSQUEDA POR CEDULA O NOMBRES
  async findBy(cedula?: string, nombres?: string): Promise<Persona[]> {
    try {
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
    } catch (error) {
      console.error('Error finding persona by cedula or nombres:', error);
      throw new Error('Error finding persona by cedula or nombres');
      
    }
  }
  
  
//ACTUALIZACION DE REGISTROS
  async update(id: string, dto: UpdatePersonaDto) {
    try {
      const persona = await this.personaRepo.findOne({ where: { id_persona: id } });
      if (!persona) {
        throw new Error('Persona not found');
      }
      this.personaRepo.merge(persona, dto);
      return await this.personaRepo.save(persona);
    } catch (error) {
      console.error('Error updating persona:', error);
      throw new Error('Error updating persona');
    }
  }

  async remove(id: string){
    try {
      const persona = await this.personaRepo.findOne({ where: { id_persona: id } });
      if (!persona) {
        throw new Error('Persona not found');
      }
      return await this.personaRepo.remove(persona);
    } catch (error) {
      console.error('Error removing persona:', error);
      throw new Error('Error removing persona');
    }
  }
}

