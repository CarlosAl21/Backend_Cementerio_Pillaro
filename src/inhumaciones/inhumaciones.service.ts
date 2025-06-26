import { CreateInhumacionDto } from './dto/create-inhumaciones.dto';
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inhumacion } from './entities/inhumacion.entity';
import { UpdateInhumacionDto } from './dto/update-inhumacione.dto';
import { HuecosNicho } from 'src/huecos-nichos/entities/huecos-nicho.entity';
import { Persona } from 'src/personas/entities/persona.entity';

@Injectable()
export class InhumacionesService {
  constructor(
    @InjectRepository(Inhumacion) private readonly repo: Repository<Inhumacion>,
    @InjectRepository(HuecosNicho) private readonly huecosNichoRepo: Repository<HuecosNicho>,
    @InjectRepository(Persona) private readonly personaRepo: Repository<Persona>,
  ) {}

  // Crear inhumación
  async create(CreateInhumacionDto: CreateInhumacionDto) {
    try {
      // Verificar si ya existe una inhumación para el fallecido
      const existeInhumacion = await this.repo.findOne({
        where: { id_fallecido: { id_persona: CreateInhumacionDto.id_fallecido.id_persona } },
      });
      if (existeInhumacion) {
        throw new InternalServerErrorException(
          `Ya existe una inhumación para el fallecido con ID ${CreateInhumacionDto.id_fallecido.id_persona}`,
        );
      }

      // Verificar si el fallecido ya está enterrado en algún hueco
      const huecoOcupado = await this.huecosNichoRepo.findOne({
        where: { id_fallecido: { id_persona: CreateInhumacionDto.id_fallecido.id_persona } },
      });
      if (huecoOcupado) {
        throw new InternalServerErrorException(
          `El fallecido con ID ${CreateInhumacionDto.id_fallecido.id_persona} ya está enterrado en un nicho`,
        );
      }

      // Antes de crear la inhumación, buscar huecos disponibles en el nicho
      const huecosDisponibles = await this.huecosNichoRepo.find({
        where: {
          id_nicho: { id_nicho: CreateInhumacionDto.id_nicho.id_nicho },
          estado: 'Disponible',
        },
      });

      if (!huecosDisponibles.length) {
        throw new InternalServerErrorException('No hay huecos disponibles en el nicho');
      }

      // Selecciona el primer hueco disponible
      const huecoAsignado = huecosDisponibles[0];

      const inhumacion = this.repo.create(CreateInhumacionDto);

      const personaFallecido = await this.personaRepo.findOne({
        where: { id_persona: CreateInhumacionDto.id_fallecido.id_persona },
      });
      if (!personaFallecido) {
        throw new NotFoundException(
          `Fallecido con ID ${CreateInhumacionDto.id_fallecido.id_persona} no encontrado`,
        );
      }
      const saveInhumacion = await this.repo.save(inhumacion);

      if (saveInhumacion.estado == 'Realizado') {
        personaFallecido.fecha_inhumacion = new Date(CreateInhumacionDto.fecha_inhumacion);
        await this.personaRepo.save(personaFallecido);
      }
      if (saveInhumacion.estado === 'Realizado') {
        const huecoNichoActualizado = this.huecosNichoRepo.merge(huecoAsignado, {
          estado: 'Ocupado',
          id_fallecido: saveInhumacion.id_fallecido,
        });
        const savedHuecoNicho = await this.huecosNichoRepo.save(huecoNichoActualizado);

        // Mapeo explícito de la respuesta
        return {
          inhumacion: saveInhumacion,
          huecoNicho: savedHuecoNicho,
          fallecido: personaFallecido,
        };
      }
      // Mapeo explícito de la respuesta
      return {
        inhumacion: saveInhumacion,
        fallecido: personaFallecido,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'No se pudo crear la inhumación');
    }
  }

  // Obtener todas las inhumaciones
  async findAll() {
    try {
      const inhumaciones = await this.repo.find({
        relations: ['id_nicho', 'id_fallecido', 'id_nicho.huecos'],
      });
      // Mapeo: separa cada objeto relacionado
      return inhumaciones.map(inh => ({
      
        ...inh,
        nicho: inh.id_nicho,
        fallecido: inh.id_fallecido,
        huecos: inh.id_nicho?.huecos,
      }));
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'No se pudieron obtener las inhumaciones');
    }
  }

  // Obtener una inhumación por ID
  async findOne(id: string) {
    try {
      const inhumacion = await this.repo.findOne({ where: { id_inhumacion: id }, relations: ['id_nicho', 'id_fallecido','id_nicho.huecos'] });
      if (!inhumacion) {
        throw new NotFoundException(`Inhumación con ID ${id} no encontrada`);
      }
      // Mapeo: separa cada objeto relacionado
      return {
          ...inhumacion,
        nicho: inhumacion.id_nicho,
        fallecido: inhumacion.id_fallecido,
        huecos: inhumacion.id_nicho?.huecos,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message || 'No se pudo obtener la inhumación');
    }
  }

  // Actualizar una inhumación
  async update(id: string, updateInhumacionDto: UpdateInhumacionDto) {
    try {
      const inhumacion = await this.repo.findOne({ where: { id_inhumacion: id }, relations: ['id_requisitos_inhumacion', 'id_requisitos_inhumacion.id_hueco_nicho'] });
      if (!inhumacion) {
        throw new NotFoundException(`Inhumación con ID ${id} no encontrada`);
      }
      this.repo.merge(inhumacion, updateInhumacionDto);
      const saveInhumacion = await this.repo.save(inhumacion);
      
      if(saveInhumacion.estado === 'Realizado') {
        const huecoNicho = await this.huecosNichoRepo.findOne({ where: { id_detalle_hueco: saveInhumacion.id_requisitos_inhumacion.id_hueco_nicho.id_detalle_hueco} });
        if (!huecoNicho) {
          throw new NotFoundException('Hueco Nicho no encontrado');
        }
        const huecoNichoActualizado = this.huecosNichoRepo.merge(huecoNicho, { estado: 'Ocupado', id_fallecido: saveInhumacion.id_fallecido });
        const savedHuecoNicho = await this.huecosNichoRepo.save(huecoNichoActualizado);

        // Mapeo explícito de la respuesta
        return {
          inhumacion: saveInhumacion,
          huecoNicho: savedHuecoNicho,
        };
      }
      // Mapeo explícito de la respuesta
      return {
        inhumacion: saveInhumacion,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message || 'No se pudo actualizar la inhumación');
    }
  }

  // Eliminar una inhumación
  async remove(id: string) {
    try {
      const inhumacion = await this.repo.findOne({ where: { id_inhumacion: id } });
      if (!inhumacion) {
        throw new NotFoundException(`Inhumación con ID ${id} no encontrada`);
      }
      await this.repo.remove(inhumacion);
      // Mapeo explícito de la respuesta
      return { deleted: true, id };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message || 'No se pudo eliminar la inhumación');
    }
  }

  async findByCedulaFallecido(cedula: string) {
  try {
    const persona = await this.personaRepo.findOne({
      where: { cedula: cedula, fallecido: true },
      relations: ['id_hueco_nicho', 'id_hueco_nicho.id_nicho', 'id_hueco_nicho.id_nicho.id_cementerio'],
    });
    if (!persona) {
      throw new NotFoundException(`Fallecido con cédula ${cedula} no encontrado`);
    }
    // Mapeo explícito de la respuesta
    return {
      ...persona,
      huecos: persona.huecos_nichos,
      nichos: persona.huecos_nichos?.map(h => h.id_nicho),
      cementerios: persona.huecos_nichos?.map(h => h.id_nicho?.id_cementerio),
    };
  } catch (error) {
    if (error instanceof NotFoundException) throw error;
    throw new InternalServerErrorException('Error al buscar por cédula');
  }
  }
}
