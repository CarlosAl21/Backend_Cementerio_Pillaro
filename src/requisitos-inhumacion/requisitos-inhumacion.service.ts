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
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequisitosInhumacionService {
  constructor(
    @InjectRepository(RequisitosInhumacion)
    private repo: Repository<RequisitosInhumacion>,
    @InjectRepository(Inhumacion)
    private inhumacionRepo: Repository<Inhumacion>,
    @InjectRepository(HuecosNicho)
    private huecosNichoRepo: Repository<HuecosNicho>,
    @Inject('S3_CLIENT') private readonly s3Client: S3Client,
  ) {}

  async create(dto: CreateRequisitosInhumacionDto, pdfs: Express.Multer.File[] = []) {
    try {
      const huecoNicho = await this.huecosNichoRepo.findOne({where: { id_detalle_hueco: dto.id_hueco_nicho.id_detalle_hueco}, relations: ['id_nicho']});
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
        savedEntity.copiaCedula == true &&
        savedEntity.copiaCertificadoDefuncion == true &&
        savedEntity.informeEstadisticoINEC == true &&
        savedEntity.pagoTasaInhumacion == true &&
        savedEntity.copiaTituloPropiedadNicho == true
      ) {
        if (pdfs.length < 1){
        throw new BadRequestException('Debe subir al menos un PDF');
        }
      const urls = await this.uploadPdfsToS3(savedEntity.id_requsitoInhumacion, pdfs);
      await this.attachPdfUrls(savedEntity.id_requsitoInhumacion, urls);
        
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
        estado: 'Pendiente',
        codigo_inhumacion: codigo_inhumacion,
        id_requisitos_inhumacion: savedEntity,
      });
      const savedInhumacion = await this.inhumacionRepo.save(inhumacion);
      return {savedEntity, savedInhumacion};
      }
      
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

  async update(id: string, dto: UpdateRequisitosInhumacionDto, pdfs: Express.Multer.File[] = []) {
    try {
      const requisito = await this.repo.findOne({ where: { id_requsitoInhumacion: id } });
      if (!requisito) {
        throw new NotFoundException(`Requisito ${id} no encontrado`);
      }
      const updateRequisito = this.repo.merge(requisito, dto);
      const savedEntity = await this.repo.save(updateRequisito);
      if (
        savedEntity.copiaCedula == true &&
        savedEntity.copiaCertificadoDefuncion == true &&
        savedEntity.informeEstadisticoINEC == true &&
        savedEntity.pagoTasaInhumacion == true &&
        savedEntity.copiaTituloPropiedadNicho == true
      ) {
        if (pdfs.length < 1){
        throw new BadRequestException('Debe subir al menos un PDF');
        }
      const urls = await this.uploadPdfsToS3(savedEntity.id_requsitoInhumacion, pdfs);
      await this.attachPdfUrls(savedEntity.id_requsitoInhumacion, urls);

      const huecoNicho = await this.huecosNichoRepo.findOne({
        where: { id_detalle_hueco: savedEntity.id_hueco_nicho.id_detalle_hueco },
        relations: ['id_nicho'],
      });
      if (!huecoNicho) {
        throw new NotFoundException('Hueco de nicho no encontrado');
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
        estado: 'Pendiente',
        codigo_inhumacion: codigo_inhumacion,
        id_requisitos_inhumacion: savedEntity,
      });
      const savedInhumacion = await this.inhumacionRepo.save(inhumacion);
      return {savedEntity, savedInhumacion};
      }
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

  private async uploadPdfsToS3(id: string, files: Express.Multer.File[]): Promise<string[]> {
  const bucket = process.env.AWS_BUCKET_NAME;
  const region = process.env.AWS_REGION;
  if (!bucket || !region) {
    throw new InternalServerErrorException('Variables de entorno AWS no configuradas');
  }

  const urls: string[] = [];

  for (const file of files) {
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException(`Archivo ${file.originalname} no es un PDF.`);
    }
    const key = `requisitos/${id}/${uuidv4()}-${file.originalname}`;
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);
    urls.push(`https://${bucket}.s3.${region}.amazonaws.com/${key}`);
  }

  return urls;
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
