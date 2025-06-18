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

@Injectable()
export class RequisitosInhumacionService {
  constructor(
    @InjectRepository(RequisitosInhumacion)
    private repo: Repository<RequisitosInhumacion>,
    @InjectRepository(Inhumacion)
    private inhumacionRepo: Repository<Inhumacion>,
    @InjectRepository(HuecosNicho)
    private huecosNichoRepo: Repository<HuecosNicho>,
  ) {}

  async create(dto: CreateRequisitosInhumacionDto) {
    try {
      const huecoNicho = await this.huecosNichoRepo.findOne({
        where: { id_detalle_hueco: dto.id_hueco_nicho.id_detalle_hueco },
        relations: ['id_nicho'],
      });
      if (!huecoNicho) {
        throw new NotFoundException('Hueco de nicho no encontrado');
      }
      if (huecoNicho.estado !== 'Disponible') {
        throw new ConflictException('El hueco del nicho seleccionado no está disponible');
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
        .where('EXTRACT(YEAR FROM inhumacion.fecha_inhumacion) = :year', { year })
        .getCount();
      const secuencial = String(count + 1).padStart(3, '0');
      const codigo_inhumacion = `${secuencial}-${year}`;

      const inhumacion = this.inhumacionRepo.create({
        id_nicho: huecoNicho.id_nicho,
        id_fallecido: savedEntity.id_fallecido,
        fecha_inhumacion: savedEntity.fechaInhumacion,
        hora_inhumacion: savedEntity.horaInhumacion,
        solicitante:
          savedEntity.id_solicitante.nombres +
          ' ' +
          savedEntity.id_solicitante.apellidos,
        responsable_inhumacion: savedEntity.pantoneroACargo,
        observaciones: savedEntity.observacionSolicitante,
        estado: allRequiredTrue ? 'Realizada' : 'Pendiente',
        codigo_inhumacion: codigo_inhumacion,
        id_requisitos_inhumacion: savedEntity,
      });

      const savedInhumacion = await this.inhumacionRepo.save(inhumacion);
      return { savedEntity, savedInhumacion };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al crear el requisito', error);
    }
  }

  async findAll() {
    try {
      return await this.repo.find({
        relations: [
          'id_cementerio',
          'id_solicitante',
          'id_hueco_nicho',
          'id_fallecido',
        ],
      });
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los requisitos');
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
          'id_fallecido',
          'inhumacion',
        ],
      });
      if (!record) throw new NotFoundException(`Requisito ${id} no encontrado`);
      return record;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al buscar el requisito');
    }
  }

  async update(id: string, dto: UpdateRequisitosInhumacionDto) {
    try {
      const requisito = await this.repo.findOne({
        where: { id_requsitoInhumacion: id },
        relations: ['inhumacion', 'id_hueco_nicho', 'id_solicitante', 'id_fallecido'],
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
        savedEntity.inhumacion.estado = allRequiredTrue ? 'Realizada' : 'Pendiente';
        await this.inhumacionRepo.save(savedEntity.inhumacion);
      }

      return savedEntity;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al actualizar el requisito');
    }
  }

  async remove(id: string) {
    try {
      const res = await this.repo.delete(id);
      if (!res.affected)
        throw new NotFoundException(`Requisito ${id} no encontrado`);
      return { deleted: true };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al eliminar el requisito');
    }
  }

}
