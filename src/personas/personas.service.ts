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

  private validarCedula(cedula: string): boolean {
    if (!/^\d{10}$/.test(cedula)) return false; // Debe tener 10 dígitos
    const provincia = parseInt(cedula.substring(0, 2), 10);
    if (provincia < 1 || provincia > 24) return false; // Provincia válida (01-24)

    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let suma = 0;

    for (let i = 0; i < 9; i++) {
      let valor = parseInt(cedula[i]) * coeficientes[i];
      if (valor >= 10) valor -= 9;
      suma += valor;
    }

    const digitoVerificador = (10 - (suma % 10)) % 10;
    return digitoVerificador === parseInt(cedula[9]);
  }

  /**
   * Validar un RUC ecuatoriano
   */
  private validarRuc(ruc: string): boolean {
    if (!/^\d{13}$/.test(ruc)) return false; // Debe tener 13 dígitos
    if (!ruc.endsWith('001')) return false; // Debe terminar en 001
    return this.validarCedula(ruc.substring(0, 10)); // Los primeros 10 dígitos deben ser una cédula válida
  }

  async create(createPersonaDto: CreatePersonaDto) {
    try {
      // Validar cédula o RUC
      if (!createPersonaDto.cedula || !this.validarCedula(createPersonaDto.cedula)) {
        throw new NotFoundException('Cédula inválida');
      }
      if (createPersonaDto.tipo === 'RUC' && !this.validarRuc(createPersonaDto.cedula)) {
        throw new NotFoundException('RUC inválido');
      }
      // Verificar si ya existe una persona con la misma cédula
      const existingPersona = await this.personaRepo.findOne({ where: { cedula: createPersonaDto.cedula } });
      if (existingPersona) {
        throw new NotFoundException('Ya existe una persona con esta cédula');
      }
      // Crear y guardar la nueva persona
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
  async findBy(query?: string): Promise<Persona[]> {
    try {
      if (!query) {
        return this.personaRepo.find();
      }

      const searchTerm = `%${query}%`;
      
      return await this.personaRepo
        .createQueryBuilder('persona')
        .where(
          '(persona.cedula ILIKE :searchTerm OR persona.nombres ILIKE :searchTerm OR persona.apellidos ILIKE :searchTerm)',
          { searchTerm }
        )
        .getMany();
    } catch (error) {
      throw new InternalServerErrorException('Error al buscar personas');
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

