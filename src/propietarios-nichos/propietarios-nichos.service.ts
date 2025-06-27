import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePropietarioNichoDto } from './dto/create-propietarios-nicho.dto';
import { UpdatePropietarioNichoDto } from './dto/update-propietarios-nicho.dto';
import { PropietarioNicho } from './entities/propietarios-nicho.entity';
import { Nicho } from 'src/nicho/entities/nicho.entity';
import { Persona } from 'src/personas/entities/persona.entity';

@Injectable()
export class PropietariosNichosService {
  constructor(
    @InjectRepository(PropietarioNicho)
    private propietarioRepo: Repository<PropietarioNicho>,
    @InjectRepository(Nicho)
    private nichoRepo: Repository<Nicho>,
    @InjectRepository(Persona)
    private personaRepo: Repository<Persona>,
  ) {}

  async create(dto: CreatePropietarioNichoDto) {
    try {
      // Normalizar si llegan como string
      if (typeof dto.id_persona === 'string') {
        dto.id_persona = { id_persona: dto.id_persona };
      }
      if (typeof dto.id_nicho === 'string') {
        dto.id_nicho = { id_nicho: dto.id_nicho };
      }

      // Validación de datos
      const nicho = await this.nichoRepo.findOne({
        where: { id_nicho: dto.id_nicho.id_nicho },
        relations: ['propietarios_nicho'],
      });
      if (!nicho) {
        throw new NotFoundException(
          `Nicho with id ${dto.id_nicho.id_nicho} not found`,
        );
      }

      const persona = await this.personaRepo.findOne({
        where: { id_persona: dto.id_persona.id_persona },
      });
      if (!persona) {
        throw new NotFoundException(
          `Persona with id ${dto.id_persona.id_persona} not found`,
        );
      }
      if (persona.fallecido == true) {
        throw new InternalServerErrorException(
          `No se puede asignar un propietario a un fallecido`,
        );
      }

      // Verificar si ya existe un propietario para el nicho
      const existingPropietario = await this.propietarioRepo
        .createQueryBuilder('propietario')
        .leftJoin('propietario.id_nicho', 'nicho')
        .where('nicho.id_nicho = :idNicho', { idNicho: nicho.id_nicho })
        .andWhere('propietario.id_persona = :idPersona', {idPersona: persona.id_persona,})
        .andWhere('propietario.activo = :activo', { activo: true })
        .getOne();

      if (existingPropietario) {
        throw new InternalServerErrorException(
          `Este usuario ya es propietario de este nicho`,
        );
      }

      if (dto.tipo == 'Heredero' || dto.tipo == 'Dueño') {
        const propietario = await this.propietarioRepo
          .createQueryBuilder('propietario')
          .leftJoin('propietario.id_nicho', 'nicho')
          .where('nicho.id_nicho = :idNicho', { idNicho: nicho.id_nicho })
          .andWhere('propietario.activo = :activo', { activo: true })
          .getOne();

        if (propietario) {
          propietario.activo = false;
          await this.propietarioRepo.save(propietario);
        }
      }
      const propietario = this.propietarioRepo.create(dto);
      return await this.propietarioRepo.save(propietario);
    } catch (error) {
      throw new InternalServerErrorException(
        `${error.message}`,
      );
    }
  }

  findAll() {
    return this.propietarioRepo.find({
      where: { activo: true },
      relations: ['id_nicho', 'id_persona'],
    });
  }

  async findOne(id: string) {
    try {
      const propietario = await this.propietarioRepo.findOne({
        where: { id_propietario_nicho: id },
        relations: ['id_nicho', 'id_persona'],
      });
      if (!propietario) {
        throw new NotFoundException(`PropietarioNicho with id ${id} not found`);
      }
      return propietario;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Error finding PropietarioNicho: ${error.message}`,
      );
    }
  }

  async findByNicho(idNicho: string) {
    try {
      return await this.propietarioRepo
        .createQueryBuilder('propietario')
        .leftJoinAndSelect('propietario.id_nicho', 'nicho')
        .leftJoinAndSelect('propietario.id_persona', 'persona')
        .where('nicho.id_nicho = :idNicho', { idNicho })
        .andWhere('propietario.activo = :activo', { activo: true })
        .getMany();
    } catch (error) {
      console.log('Error en findByNicho:', error);
      throw new InternalServerErrorException(
        'Error al buscar propietarios por nicho',
      );
    }
  }

  async historial(idNicho: string) {
    try {
      return await this.propietarioRepo
        .createQueryBuilder('propietario')
        .leftJoinAndSelect('propietario.id_nicho', 'nicho')
        .leftJoinAndSelect('propietario.id_persona', 'persona')
        .where('nicho.id_nicho = :idNicho', { idNicho })
        .getMany();
    } catch (error) {
      console.log('Error en findByNicho:', error);
      throw new InternalServerErrorException(
        'Error al buscar propietarios por nicho',
      );
    }
  }

  async findByPersona(cedula: string) {
    try {
      const persona = await this.personaRepo.findOne({
        where: { cedula },
      });
      if (!persona) {
        throw new NotFoundException(`Persona with cedula ${cedula} not found`);
      }

      const propietarios = await this.propietarioRepo
        .createQueryBuilder('propietario')
        .leftJoinAndSelect('propietario.id_nicho', 'nicho')
        .leftJoinAndSelect('propietario.id_persona', 'persona')
        .where('persona.id_persona = :idPersona', { idPersona: persona.id_persona })
        .getMany();

      if (!propietarios || propietarios.length === 0) {
        throw new NotFoundException(
          `No propietarios found for persona with cedula ${cedula}`,
        );
      }
      return propietarios;
    } catch (error) {
      console.log('Error en findByPersona:', error);
      throw new InternalServerErrorException(
        'Error al buscar propietarios por persona',
      );
    }
  }

  async update(id: string, dto: UpdatePropietarioNichoDto) {
    try {
      const propietario = await this.propietarioRepo.findOne({
        where: { id_propietario_nicho: id },
      });
      if (!propietario) {
        throw new NotFoundException(`PropietarioNicho with id ${id} not found`);
      }
      this.propietarioRepo.merge(propietario, dto);
      return await this.propietarioRepo.save(propietario);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Error updating PropietarioNicho: ${error.message}`,
      );
    }
  }

  async remove(id: string) {
    try {
      const propietario = await this.propietarioRepo.findOne({
        where: { id_propietario_nicho: id },
      });
      if (!propietario) {
        throw new NotFoundException(`PropietarioNicho with id ${id} not found`);
      }
      return await this.propietarioRepo.delete(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Error removing PropietarioNicho: ${error.message}`,
      );
    }
  }
}
