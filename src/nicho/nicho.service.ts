import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nicho } from './entities/nicho.entity';
import { CreateNichoDto } from './dto/create-nicho.dto';
import { UpdateNichoDto } from './dto/update-nicho.dto';
import { HuecosNicho } from 'src/huecos-nichos/entities/huecos-nicho.entity';
import { Persona } from 'src/personas/entities/persona.entity';

@Injectable()
export class NichoService {
  constructor(
    @InjectRepository(Nicho)
    private readonly nichoRepository: Repository<Nicho>,
    @InjectRepository(HuecosNicho)
    private readonly huecosNichoRepository: Repository<HuecosNicho>,
    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,
  ) {}

  /**
   * Crea un nuevo nicho y sus huecos asociados
   */
  async create(createNichoDto: CreateNichoDto) {
    try {
      // Crear el nicho
      const nicho = this.nichoRepository.create(createNichoDto);
      const nichoGuardado = await this.nichoRepository.save(nicho);

      // Crear los huecos asociados al nicho
      const huecos: HuecosNicho[] = [];
      for (let i = 1; i <= nichoGuardado.num_huecos; i++) {
        const hueco = this.huecosNichoRepository.create({
          num_hueco: i,
          estado: 'Disponible',
          id_nicho: nichoGuardado,
        });
        huecos.push(hueco);
      }
      const huecosGuardados = await this.huecosNichoRepository.save(huecos);
      return {
        ...nichoGuardado,
        huecos: huecosGuardados,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el nicho: ' + (error.message || error));
    }
  }

  /**
   * Obtiene todos los nichos activos con sus relaciones principales
   */
  async findAll() {
    try {
      const nichos = await this.nichoRepository.find({
        where: { estado: 'Activo' },
        relations: [
          'id_cementerio',
          'inhumaciones',
          'propietarios_nicho',
          'huecos',
          'inhumaciones.id_fallecido',
          'huecos.id_fallecido',
        ],
      });
      // Mapeo para devolver relaciones con nombres más claros
      return nichos.map((nicho) => ({
        ...nicho,
        cementerio: nicho.id_cementerio,
        inhumaciones: nicho.inhumaciones,
        propietarios: nicho.propietarios_nicho,
        huecos: nicho.huecos,
      }));
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los nichos: ' + (error.message || error));
    }
  }

  /**
   * Obtiene todos los nichos con solo los huecos disponibles
   */
  async findAllWithHuecosDisponibles() {
    try {
      const nichos = await this.nichoRepository.find({
        relations: ['huecos', 'id_cementerio'],
      });
      // Filtra solo los huecos disponibles
      return nichos.map((nicho) => ({
        ...nicho,
        huecos: nicho.huecos.filter((hueco) => hueco.estado === 'Disponible'),
      }));
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los nichos: ' + (error.message || error));
    }
  }

  /**
   * Busca un nicho por su ID y retorna sus relaciones principales
   */
  async findOne(id: string) {
    try {
      const nicho = await this.nichoRepository.findOne({
        where: { id_nicho: id },
        relations: [
          'id_cementerio',
          'inhumaciones',
          'propietarios_nicho',
          'huecos',
          'inhumaciones.id_fallecido',
          'huecos.id_fallecido',
        ],
      });
      if (!nicho) {
        throw new NotFoundException(`Nicho con ID ${id} no encontrado`);
      }
      return {
        ...nicho,
        cementerio: nicho.id_cementerio,
        inhumaciones: nicho.inhumaciones,
        propietarios: nicho.propietarios_nicho,
        huecos: nicho.huecos,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al buscar el nicho: ' + (error.message || error));
    }
  }

  /**
   * Actualiza los datos de un nicho por su ID
   */
  async update(id: string, updateDto: UpdateNichoDto) {
    try {
      const nicho = await this.findOne(id);
      Object.assign(nicho, updateDto);
      const nichoActualizado = await this.nichoRepository.save(nicho);
      return {
        nicho: nichoActualizado,
        cementerio: nicho.cementerio,
        inhumaciones: nicho.inhumaciones,
        propietarios: nicho.propietarios,
        huecos: nicho.huecos,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al actualizar el nicho: ' + (error.message || error));
    }
  }

  /**
   * Marca un nicho como inactivo (eliminación lógica)
   */
  async remove(id: string) {
    try {
      const nicho = await this.nichoRepository.findOne({ where: { id_nicho: id } });
      if (!nicho) {
        throw new NotFoundException(`Nicho con ID ${id} no encontrado`);
      }
      nicho.estado = 'Inactivo';
      await this.nichoRepository.save(nicho);
      return { deleted: true, id };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al eliminar el nicho: ' + (error.message || error));
    }
  }

  /**
   * Obtiene los propietarios de un nicho por su ID
   */
  async findPropietariosNicho(id: string) {
    try {
      const nicho = await this.nichoRepository.findOne({
        where: { id_nicho: id },
        relations: ['propietarios_nicho'],
      });
      if (!nicho) {
        throw new NotFoundException(`Nicho con ID ${id} no encontrado`);
      }
      return {
        nicho: { ...nicho, propietarios_nicho: undefined },
        propietarios: nicho.propietarios_nicho,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al buscar los propietarios del nicho: ' + (error.message || error));
    }
  }

  /**
   * Busca nichos y huecos por la cédula del fallecido
   */
  async findByCedulaFallecido(cedula: string) {
    try {
      const persona = await this.personaRepository.findOne({
        where: { cedula: cedula, fallecido: true },
      });
      if (!persona) {
        throw new NotFoundException(
          `Persona con cédula ${cedula} no encontrada o no es un fallecido`,
        );
      }

      const hueco = await this.huecosNichoRepository.find({
        where: { id_fallecido: { id_persona: persona.id_persona } },
        relations: ['id_nicho', 'id_nicho.id_cementerio'],
      });

      return {
        fallecido: persona,
        huecos: hueco,
        nichos: hueco.map((h) => h.id_nicho),
        cementerios: hueco.map((h) => h.id_nicho?.id_cementerio),
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al buscar los nichos por cédula del fallecido: ' + (error.message || error));
    }
  }

  /**
   * Normaliza texto para búsqueda: convierte a minúsculas y remueve acentos
   */
  private normalizarTexto(texto: string): string {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remueve acentos/tildes
      .trim();
  }
}
