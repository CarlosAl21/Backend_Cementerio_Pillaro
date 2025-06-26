import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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

  async create(createNichoDto: CreateNichoDto) {
    try {
      const nicho = this.nichoRepository.create(createNichoDto);
      const nichoGuardado = await this.nichoRepository.save(nicho);

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
      console.log('create');
      // Mapeo explícito de la respuesta
      return {
        ...nichoGuardado,
        huecos: huecosGuardados,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el nicho');
    }
  }

  async findAll() {
    try {
      const nichos = await this.nichoRepository.find({where: {estado: 'Activo'},
        relations: [
          'id_cementerio',
          'inhumaciones',
          'propietarios_nicho',
          'huecos',
          'inhumaciones.id_fallecido',
          'huecos.id_fallecido',
        ],
      });
      // Mapeo: separa cada objeto relacionado
      return nichos.map((nicho) => ({
        ...nicho,
        cementerio: nicho.id_cementerio,
        inhumaciones: nicho.inhumaciones,
        propietarios: nicho.propietarios_nicho,
        huecos: nicho.huecos,
      }));
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los nichos');
    }
  }

  async findAllWithHuecosDisponibles() {
    try {
      const nichos = await this.nichoRepository.find({
        relations: ['huecos', 'id_cementerio'],
      });

      // Filtra los huecos disponibles en cada nicho
      return nichos.map((nicho) => ({
        ...nicho,
        huecos: nicho.huecos.filter((hueco) => hueco.estado === 'Disponible'),
      }));
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los nichos');
    }
  }

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
      // Mapeo: separa cada objeto relacionado
      return {
        ...nicho,
        cementerio: nicho.id_cementerio,
        inhumaciones: nicho.inhumaciones,
        propietarios: nicho.propietarios_nicho,
        huecos: nicho.huecos,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al buscar el nicho');
    }
  }

  async update(id: string, updateDto: UpdateNichoDto) {
    try {
      const nicho = await this.findOne(id);
      // Solo actualiza el objeto nicho, no los relacionados
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
      throw new InternalServerErrorException('Error al actualizar el nicho');
    }
  }

  async remove(id: string) {
    try {
      const nicho = await this.nichoRepository.findOne({ where: { id_nicho: id } });
      if (!nicho) {
        throw new NotFoundException(`Nicho con ID ${id} no encontrado`);
      }
      nicho.estado = 'Inactivo';
      await this.nichoRepository.save(nicho);
      // Mapeo explícito de la respuesta
      return { deleted: true, id };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al eliminar el nicho');
    }
  }

  async findPropietariosNicho(id: string) {
    try {
      const nicho = await this.nichoRepository.findOne({
        where: { id_nicho: id },
        relations: ['propietarios_nicho'],
      });
      if (!nicho) {
        throw new NotFoundException(`Nicho con ID ${id} no encontrado`);
      }
      // Mapeo explícito de la respuesta
      return {
        nicho: { ...nicho, propietarios_nicho: undefined },
        propietarios: nicho.propietarios_nicho,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Error al buscar los propietarios del nicho',
      );
    }
  }

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

      // Mapeo explícito de la respuesta
      return {
        fallecido: persona,
        huecos: hueco,
        nichos: hueco.map((h) => h.id_nicho),
        cementerios: hueco.map((h) => h.id_nicho?.id_cementerio),
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Error al buscar los nichos por cédula del fallecido',
      );
    }
  }
}
