import { Nicho } from './../nicho/entities/nicho.entity';
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
    @InjectRepository(Nicho) private readonly nichoRepository: Repository<Nicho>,
  ) {}

  /**
   * Crea una nueva inhumación
   */
  async create(CreateInhumacionDto: CreateInhumacionDto) {
    try {

      // Normalizar id_fallecido si llega como string
      if (typeof CreateInhumacionDto.id_fallecido === 'string') {
        CreateInhumacionDto.id_fallecido = { id_persona: CreateInhumacionDto.id_fallecido };
      }

      // Normalizar id_nicho si llega como string
      if (typeof CreateInhumacionDto.id_nicho === 'string') {
        CreateInhumacionDto.id_nicho = { id_nicho: CreateInhumacionDto.id_nicho };
      }

      // Buscar la persona fallecida
      const personaFallecido = await this.personaRepo
        .createQueryBuilder('persona')
        .where('persona.id_persona = :id', { id: CreateInhumacionDto.id_fallecido.id_persona })
        .getOne();
      if (!personaFallecido) {
        throw new NotFoundException(
          `Fallecido con ID ${CreateInhumacionDto.id_fallecido.id_persona} no encontrado`,
        );
      }

      // Buscar el nicho
      const nicho = await this.nichoRepository
        .createQueryBuilder('nicho')
        .where('nicho.id_nicho = :id', { id: CreateInhumacionDto.id_nicho.id_nicho })
        .getOne();
      if (!nicho) {
        throw new NotFoundException(
          `Nicho con ID ${CreateInhumacionDto.id_nicho.id_nicho} no encontrado`,
        );
      }

      // Verificar si ya existe una inhumación para el fallecido
      const existeInhumacion = await this.repo
        .createQueryBuilder('inhumacion')
        .where('inhumacion.id_fallecido = :idFallecido', { idFallecido: personaFallecido.id_persona })
        .getOne();
      if (existeInhumacion) {
        throw new InternalServerErrorException(
          `Ya existe una inhumación para el fallecido con ID ${CreateInhumacionDto.id_fallecido.id_persona}`,
        );
      }

      // Verificar si el fallecido ya está enterrado en algún hueco
      const huecoOcupado = await this.huecosNichoRepo
        .createQueryBuilder('hueco')
        .where('hueco.id_fallecido = :idFallecido', { idFallecido: CreateInhumacionDto.id_fallecido.id_persona })
        .getOne();
      if (huecoOcupado) {
        throw new InternalServerErrorException(
          `El fallecido con ID ${CreateInhumacionDto.id_fallecido.id_persona} ya está enterrado en un nicho`,
        );
      }

      // Buscar huecos disponibles en el nicho
      const huecosDisponibles = await this.huecosNichoRepo
        .createQueryBuilder('hueco')
        .where('hueco.id_nicho = :idNicho', { idNicho: CreateInhumacionDto.id_nicho.id_nicho })
        .andWhere('hueco.estado = :estado', { estado: 'Disponible' })
        .getMany();

      if (!huecosDisponibles.length) {
        throw new InternalServerErrorException('No hay huecos disponibles en el nicho');
      }

      // Selecciona el primer hueco disponible
      const huecoAsignado = huecosDisponibles[0];

      // Crear la entidad de inhumación
      const inhumacion = this.repo.create(CreateInhumacionDto);

      
      // Guardar la inhumación
      const saveInhumacion = await this.repo.save(inhumacion);

      // Si la inhumación fue realizada, actualizar datos del fallecido y hueco
      if (saveInhumacion.estado == 'Realizado') {
        personaFallecido.fecha_inhumacion = new Date(CreateInhumacionDto.fecha_inhumacion);
        await this.personaRepo.save(personaFallecido);
      }
      if (saveInhumacion.estado === 'Realizado') {
        // Marcar hueco como ocupado y asignar fallecido
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
      // Si no fue realizada, solo retorna la inhumación y fallecido
      return {
        inhumacion: saveInhumacion,
        fallecido: personaFallecido,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al crear la inhumación: ' + (error.message || error));
    }
  }

  /**
   * Obtiene todas las inhumaciones
   */
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
      throw new InternalServerErrorException('Error al obtener las inhumaciones: ' + (error.message || error));
    }
  }

  /**
   * Obtiene una inhumación por su ID
   */
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
      throw new InternalServerErrorException('Error al buscar la inhumación: ' + (error.message || error));
    }
  }

  /**
   * Actualiza una inhumación por su ID
   */
  async update(id: string, updateInhumacionDto: UpdateInhumacionDto) {
    try {
      const inhumacion = await this.repo.findOne({ where: { id_inhumacion: id }, relations: ['id_requisitos_inhumacion', 'id_requisitos_inhumacion.id_hueco_nicho'] });
      if (!inhumacion) {
        throw new NotFoundException(`Inhumación con ID ${id} no encontrada`);
      }
      this.repo.merge(inhumacion, updateInhumacionDto);
      const saveInhumacion = await this.repo.save(inhumacion);
      
      if(saveInhumacion.estado === 'Realizado') {
        // Marcar hueco como ocupado y asignar fallecido
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
      // Si no fue realizada, solo retorna la inhumación
      return {
        inhumacion: saveInhumacion,
        huecoNicho: saveInhumacion.id_requisitos_inhumacion?.id_hueco_nicho,
        fallecido: saveInhumacion.id_fallecido,
        solicitante: saveInhumacion.solicitante,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al actualizar la inhumación: ' + (error.message || error));
    }
  }

  /**
   * Elimina una inhumación por su ID
   */
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
      throw new InternalServerErrorException('Error al eliminar la inhumación: ' + (error.message || error));
    }
  }

  /**
   * Busca inhumaciones por la cédula del fallecido
   */
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
      throw new InternalServerErrorException('Error al buscar por cédula de fallecido: ' + (error.message || error));
    }
  }
}
