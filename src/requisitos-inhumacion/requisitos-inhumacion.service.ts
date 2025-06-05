import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
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
      // Validación de datos antes de crear la entidad
      if (
        !dto.id_cementerio ||
        !dto.id_solicitante ||
        !dto.id_hueco_nicho ||
        !dto.id_fallecido
      ) {
        throw new BadRequestException(
          'Faltan datos obligatorios para crear el requisito',
        );
      }
      const huecoNicho = await this.huecosNichoRepo.findOne({where: { id_detalle_hueco: dto.id_hueco_nicho.id_detalle_hueco}})
      if (!huecoNicho) {
        throw new NotFoundException('Hueco de nicho no encontrado');
      }
      // Verificar si el nicho está disponible
      if (huecoNicho.estado !== 'Disponible') {
        throw new ConflictException(
          'El hueco del nicho seleccionado no está disponible',
        );
      }
      const entity = this.repo.create(dto);
      const savedEntity = await this.repo.save(entity);

      if (
        savedEntity.copiaCedula == false ||
        savedEntity.copiaCertificadoDefuncion == false ||
        savedEntity.informeEstadisticoINEC == false ||
        savedEntity.pagoTasaInhumacion == false ||
        savedEntity.copiaTituloPropiedadNicho == false
      ) {
        throw new BadRequestException(
          'Faltan requisitos obligatorios para completar la solicitud de inhumación',
        );
      }

      // Obtener año actual
      const year = new Date().getFullYear();
      // Contar cuántas inhumaciones existen este año
      const count = await this.inhumacionRepo
        .createQueryBuilder('inhumacion')
        .where('EXTRACT(YEAR FROM inhumacion.fecha_inhumacion) = :year', {
          year,
        })
        .getCount();
      // Formatear el código correlativo
      const secuencial = String(count + 1).padStart(3, '0');
      const codigo_inhumacion = `${secuencial}-${year}`;

      const inhumacion = this.inhumacionRepo.create({
        id_nicho: savedEntity.id_hueco_nicho.id_nicho,
        id_fallecido: savedEntity.id_fallecido,
        fecha_inhumacion: savedEntity.fechaInhumacion,
        hora_inhumacion: savedEntity.horaInhumacion,
        solicitante:
          savedEntity.id_solicitante.nombres +
          ' ' +
          savedEntity.id_solicitante.apellidos,
        responsable_inhumacion: savedEntity.pantoneroACargo,
        observaciones: savedEntity.observacionSolicitante,
        estado: 'Pendiente',
        codigo_inhumacion: codigo_inhumacion,
        id_requisitos_inhumacion: savedEntity,
      });
      const savedInhumacion = await this.inhumacionRepo.save(inhumacion);
      
      return savedEntity;
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
      const updateResult = await this.repo.update(id, dto);
      if (!updateResult.affected) {
        throw new NotFoundException(`Requisito ${id} no encontrado`);
      }
      return this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Error al actualizar el requisito',
      );
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

  async attachPdfUrls(id: string, urls: string[]) {
    try {
      const requisito = await this.repo.findOne({ where: { id_requsitoInhumacion: id } });
      if (!requisito) {
        throw new NotFoundException(`Requisito ${id} no encontrado`);
      }
      requisito.pdfUrls = [...(requisito.pdfUrls || []), ...urls];
      await this.repo.save(requisito);
      return requisito;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al asociar los PDFs al requisito');
    }
  }
} 
