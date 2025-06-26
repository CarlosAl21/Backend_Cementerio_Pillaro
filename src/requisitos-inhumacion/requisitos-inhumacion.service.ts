import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { RequisitosInhumacion } from './entities/requisitos-inhumacion.entity';
import { CreateRequisitosInhumacionDto } from './dto/create-requisitos-inhumacion.dto';
import { UpdateRequisitosInhumacionDto } from './dto/update-requisitos-inhumacion.dto';
import { Inhumacion } from 'src/inhumaciones/entities/inhumacion.entity';
import { HuecosNicho } from 'src/huecos-nichos/entities/huecos-nicho.entity';
import { Persona } from 'src/personas/entities/persona.entity';
import { Nicho } from 'src/nicho/entities/nicho.entity';
import { Cementerio } from 'src/cementerio/entities/cementerio.entity';

@Injectable()
export class RequisitosInhumacionService {
  constructor(
    @InjectRepository(RequisitosInhumacion)
    private repo: Repository<RequisitosInhumacion>,
    @InjectRepository(Inhumacion)
    private inhumacionRepo: Repository<Inhumacion>,
    @InjectRepository(HuecosNicho)
    private huecosNichoRepo: Repository<HuecosNicho>,
    @InjectRepository(Persona)
    private personaRepo: Repository<Persona>,
    @InjectRepository(Nicho)
    private nichoRepo: Repository<Nicho>,
    @InjectRepository(Cementerio)
    private cementerioRepo: Repository<Cementerio>,
  ) {}

  async create(dto: CreateRequisitosInhumacionDto) {
    try {
      // Normalizar id_fallecido si llega como string
      if (typeof dto.id_fallecido === 'string') {
        dto.id_fallecido = { id_persona: dto.id_fallecido };
      }

      // Normalizar id_solicitante si llega como string
      if (typeof dto.id_solicitante === 'string') {
        dto.id_solicitante = { id_persona: dto.id_solicitante };
      }

      // Normalizar id_cementerio si llega como string
      if (typeof dto.id_cementerio === 'string') {
        dto.id_cementerio = { id_cementerio: dto.id_cementerio };
      }

      // Normalizar id_hueco_nicho si llega como string
      if (typeof dto.id_hueco_nicho === 'string') {
        dto.id_hueco_nicho = { id_detalle_hueco: dto.id_hueco_nicho };
      }

      const huecoNicho = await this.huecosNichoRepo.findOne({
        where: { id_detalle_hueco: dto.id_hueco_nicho.id_detalle_hueco },
        relations: ['id_nicho', 'id_nicho.propietarios_nicho'],
      });

      if (!huecoNicho) {
        throw new NotFoundException('Hueco de nicho no encontrado');
      }
      if (huecoNicho.estado !== 'Disponible') {
        throw new ConflictException(
          'El hueco del nicho seleccionado no está disponible',
        );
      }

      const personaFallecido = await this.personaRepo.findOne({
        where: { id_persona: dto.id_fallecido.id_persona },
      });

      if (!personaFallecido) {
        throw new NotFoundException(
          `Fallecido con ID ${dto.id_fallecido.id_persona} no encontrado`,
        );
      }
      // if (personaFallecido.fecha_inhumacion) {
      //   throw new ConflictException('El fallecido ya tiene una inhumación registrada');
      // }

      // Verifica que el solicitante sea una persona válida
      const solicitante = await this.personaRepo.findOne({
        where: { id_persona: dto.id_solicitante.id_persona },
      });

      if (!solicitante) {
        throw new NotFoundException(
          `Solicitante con ID ${dto.id_solicitante.id_persona} no encontrado`,
        );
      }
      if (solicitante.fallecido == true) {
        throw new ConflictException('El solicitante no puede ser un fallecido');
      }

      // Verificar si ya existe un requisito de inhumación para el fallecido
      const existeRequisito = await this.repo.findOne({
        where: { id_fallecido: { id_persona: dto.id_fallecido.id_persona } },
      });
      if (existeRequisito) {
        throw new ConflictException(
          `Ya existe un requisito de inhumación para el fallecido con ID ${dto.id_fallecido.id_persona}`,
        );
      }

      const entity = this.repo.create(dto);
      const savedEntity = await this.repo.save(entity);

      // Verifica todos los booleanos requeridos (excepto autorizacionDeMovilizacionDelCadaver)
      const allRequiredTrue =
        savedEntity.copiaCedula === true &&
        savedEntity.copiaCertificadoDefuncion === true &&
        savedEntity.informeEstadisticoINEC === true &&
        savedEntity.pagoTasaInhumacion === true &&
        savedEntity.copiaTituloPropiedadNicho === true &&
        savedEntity.OficioDeSolicitud === true;

      // Obtener año actual y secuencial
      const year = new Date().getFullYear();
      const count = await this.inhumacionRepo
        .createQueryBuilder('inhumacion')
        .where('EXTRACT(YEAR FROM inhumacion.fecha_inhumacion) = :year', {
          year,
        })
        .getCount();
      const secuencial = String(count + 1).padStart(3, '0');
      const codigo_inhumacion = `${secuencial}-${year}`;

      const nomSolicitante = solicitante.nombres + ' ' + solicitante.apellidos;

      const inhumacion = this.inhumacionRepo.create({
        id_nicho: huecoNicho.id_nicho,
        id_fallecido: savedEntity.id_fallecido,
        fecha_inhumacion: savedEntity.fechaInhumacion,
        hora_inhumacion: savedEntity.horaInhumacion,
        solicitante: nomSolicitante,
        responsable_inhumacion: savedEntity.pantoneroACargo,
        observaciones: savedEntity.observacionSolicitante,
        estado: allRequiredTrue ? 'Realizada' : 'Pendiente',
        codigo_inhumacion: codigo_inhumacion,
        id_requisitos_inhumacion: savedEntity,
      });

      if (allRequiredTrue) {
        const hueco = await this.huecosNichoRepo.findOne({
          where: { id_detalle_hueco: huecoNicho.id_detalle_hueco },
        });
        if (!hueco) {
          throw new NotFoundException('Hueco de nicho no encontrado');
        }
        hueco.estado = 'Ocupado';
        hueco.id_fallecido = savedEntity.id_fallecido;
        await this.huecosNichoRepo.save(hueco);
      }

      personaFallecido.fecha_inhumacion = savedEntity.fechaInhumacion;
      personaFallecido.fallecido = true; // Marcar como fallecido
      await this.personaRepo.save(personaFallecido);

      const savedInhumacion = await this.inhumacionRepo.save(inhumacion);
      // Mapeo explícito de la respuesta
      return {
        ...savedEntity,
        inhumacion: savedInhumacion,
        huecoNicho: allRequiredTrue ? huecoNicho : undefined,
        fallecido: personaFallecido,
        solicitante: solicitante,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el requisito: ' + (error.message || error));
    }
  }

  async findAll() {
    try {
      const requisitos = await this.repo.find({
        relations: [
          'id_cementerio',
          'id_solicitante',
          'id_hueco_nicho',
          'id_hueco_nicho.id_nicho',
          'id_hueco_nicho.id_nicho.propietarios_nicho',
          'id_fallecido',
        ],
      });
      // Mapeo: separa cada objeto relacionado
      return requisitos.map((req) => ({
        ...req,
        cementerio: req.id_cementerio,
        solicitante: req.id_solicitante,
        huecoNicho: req.id_hueco_nicho,
        nicho: req.id_hueco_nicho.id_nicho,
        propietarioNicho: req.id_hueco_nicho.id_nicho.propietarios_nicho,
        fallecido: req.id_fallecido,
      }));
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los requisitos: ' + (error.message || error));
    }
  }

  async findOne(id: string) {
    try {
      const record = await this.repo.findOne({
        where: { id_requsitoInhumacion: id },
        relations: [
          'id_cementerio',
          'id_solicitante',
          'id_hueco_nicho',
          'id_hueco_nicho.id_nicho',
          'id_hueco_nicho.id_nicho.propietarios_nicho',
          'id_fallecido',
          'inhumacion',
        ],
      });
      if (!record) throw new NotFoundException(`Requisito ${id} no encontrado`);
      // Mapeo: separa cada objeto relacionado
      return {
        ...record,
        cementerio: record.id_cementerio,
        solicitante: record.id_solicitante,
        huecoNicho: record.id_hueco_nicho,
        nicho: record.id_hueco_nicho.id_nicho,
        propietarioNicho: record.id_hueco_nicho.id_nicho.propietarios_nicho,
        fallecido: record.id_fallecido,
        inhumacion: record.inhumacion,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al buscar el requisito: ' + (error.message || error));
    }
  }

  async update(id: string, dto: UpdateRequisitosInhumacionDto) {
    try {
      const requisito = await this.repo.findOne({
        where: { id_requsitoInhumacion: id },
        relations: [
          'inhumacion',
          'id_hueco_nicho',
          'id_solicitante',
          'id_fallecido',
        ],
      });
      if (!requisito) {
        throw new NotFoundException(`Requisito ${id} no encontrado`);
      }
      const updatedRequisito = this.repo.merge(requisito, dto);
      const savedEntity = await this.repo.save(updatedRequisito);

      // Verifica todos los booleanos requeridos (excepto autorizacionDeMovilizacionDelCadaver)
      const allRequiredTrue =
        savedEntity.copiaCedula === true &&
        savedEntity.copiaCertificadoDefuncion === true &&
        savedEntity.informeEstadisticoINEC === true &&
        savedEntity.pagoTasaInhumacion === true &&
        savedEntity.copiaTituloPropiedadNicho === true &&
        savedEntity.OficioDeSolicitud === true;

      // Actualiza el estado de la inhumación asociada si existe
      if (savedEntity.inhumacion) {
        savedEntity.inhumacion.estado = allRequiredTrue
          ? 'Realizada'
          : 'Pendiente';
        await this.inhumacionRepo.save(savedEntity.inhumacion);

        savedEntity.id_fallecido.fecha_defuncion = savedEntity.fechaInhumacion;
        savedEntity.id_fallecido.fallecido = true; // Marcar como fallecido

        await this.personaRepo.save(savedEntity.id_fallecido);

        if (allRequiredTrue) {
          const huecoNicho = await this.huecosNichoRepo.findOne({
            where: {
              id_detalle_hueco: savedEntity.id_hueco_nicho.id_detalle_hueco,
            },
          });
          if (!huecoNicho) {
            throw new NotFoundException('Hueco de nicho no encontrado');
          }
          huecoNicho.estado = 'Ocupado';
          huecoNicho.id_fallecido = savedEntity.id_fallecido;
          await this.huecosNichoRepo.save(huecoNicho);
        }
      }

      return {
        requisito: savedEntity,
        inhumacion: savedEntity.inhumacion,
        huecoNicho: savedEntity.id_hueco_nicho,
        fallecido: savedEntity.id_fallecido,
        solicitante: savedEntity.id_solicitante,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al actualizar el requisito: ' + (error.message || error));
    }
  }

  async remove(id: string) {
    try {
      const res = await this.repo.delete(id);
      if (!res.affected)
        throw new NotFoundException(`Requisito ${id} no encontrado`);
      // Mapeo explícito de la respuesta
      return { deleted: true, id };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al eliminar el requisito: ' + (error.message || error));
    }
  }

  async findByCedulaFallecido(cedula: string) {
    try {
      const persona = await this.personaRepo
        .createQueryBuilder('persona')
        .leftJoinAndSelect('persona.huecos_nichos', 'hueco')
        .leftJoinAndSelect('hueco.id_nicho', 'nicho')
        .leftJoinAndSelect('nicho.id_cementerio', 'cementerio')
        .leftJoinAndSelect('persona.requisitos_inhumacion', 'requisito')
        .leftJoinAndSelect('requisito.id_cementerio', 'req_cementerio')
        .leftJoinAndSelect('requisito.id_solicitante', 'req_solicitante')
        .leftJoinAndSelect('requisito.id_hueco_nicho', 'req_hueco_nicho')
        .leftJoinAndSelect('requisito.id_fallecido', 'req_fallecido')
        .leftJoinAndSelect('persona.inhumaciones', 'inhumacion')
        .where('persona.cedula = :cedula', { cedula })
        .andWhere('persona.fallecido = :fallecido', { fallecido: true })
        .getOne();

      if (!persona) {
        throw new NotFoundException(
          `Fallecido con cédula ${cedula} no encontrado`,
        );
      }

      return {
        ...persona,
        huecos: persona.huecos_nichos,
        nichos: persona.huecos_nichos?.map((h) => h.id_nicho),
        cementerios: persona.huecos_nichos?.map((h) => h.id_nicho?.id_cementerio),
        requisitos_inhumacion: persona.requisitos_inhumacion?.map((req) => ({
          ...req,
          cementerio: req.id_cementerio,
          solicitante: req.id_solicitante,
          huecoNicho: req.id_hueco_nicho,
          fallecido: req.id_fallecido,
        })),
        inhumaciones: persona.inhumaciones,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al buscar por cédula de fallecido: ' + (error.message || error));
    }
  }

  async findByCedulaSolicitante(cedula: string) {
    try {
      const persona = await this.personaRepo
        .createQueryBuilder('persona')
        .leftJoinAndSelect('persona.huecos_nichos', 'hueco')
        .leftJoinAndSelect('hueco.id_nicho', 'nicho')
        .leftJoinAndSelect('nicho.id_cementerio', 'cementerio')
        .leftJoinAndSelect('persona.requisitos_inhumacion_solicitante', 'requisito')
        .leftJoinAndSelect('requisito.id_cementerio', 'req_cementerio')
        .leftJoinAndSelect('requisito.id_solicitante', 'req_solicitante')
        .leftJoinAndSelect('requisito.id_hueco_nicho', 'req_hueco_nicho')
        .leftJoinAndSelect('requisito.id_fallecido', 'req_fallecido')
        .leftJoinAndSelect('persona.inhumaciones', 'inhumacion')
        .where('persona.cedula = :cedula', { cedula })
        .andWhere('persona.fallecido = :fallecido', { fallecido: false })
        .getOne();

      if (!persona) {
        throw new NotFoundException(
          `Solicitante con cédula ${cedula} no encontrado`,
        );
      }

      // Elimina la propiedad requisitos_inhumacion si existe
      const { requisitos_inhumacion, ...rest } = persona;

      return {
        ...rest,
        huecos: persona.huecos_nichos,
        nichos: persona.huecos_nichos?.map((h) => h.id_nicho),
        cementerios: persona.huecos_nichos?.map((h) => h.id_nicho?.id_cementerio),
        requisitos_inhumacion: persona.requisitos_inhumacion_solicitante?.map((req) => ({
          ...req,
          cementerio: req.id_cementerio,
          solicitante: req.id_solicitante,
          huecoNicho: req.id_hueco_nicho,
          fallecido: req.id_fallecido,
        })),
        inhumaciones: persona.inhumaciones,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al buscar por cédula de solicitante: ' + (error.message || error));
    }
  }

  async findByCementerioSectorFila(
    id_cementerio: string,
    sector: string,
    fila: string,
  ) {
    try {
      const nicho = await this.nichoRepo
        .createQueryBuilder('nicho')
        .leftJoinAndSelect('nicho.huecos', 'hueco')
        .where('nicho.id_cementerio = :idCementerio', { idCementerio: id_cementerio })
        .andWhere('nicho.sector = :sector', { sector })
        .andWhere('nicho.fila = :fila', { fila })
        .getOne();

      if (!nicho) {
        throw new NotFoundException('Nicho no encontrado');
      }

      // Filtrar huecos disponibles
      const huecosDisponibles =
        nicho.huecos?.filter((h) => h.estado === 'Disponible') || [];

      return {
        ...nicho,
        huecos_disponibles: huecosDisponibles,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al buscar el nicho: ' + (error.message || error));
    }
  }
}
