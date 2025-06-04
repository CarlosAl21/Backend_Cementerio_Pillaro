import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  ParseUUIDPipe,
  Inject,
} from '@nestjs/common';
import { RequisitosInhumacionService } from './requisitos-inhumacion.service';
import { CreateRequisitosInhumacionDto } from './dto/create-requisitos-inhumacion.dto';
import { UpdateRequisitosInhumacionDto } from './dto/update-requisitos-inhumacion.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiConsumes,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';

@ApiTags('Requisitos Inhumacion')
@Controller('requisitos-inhumacion')
export class RequisitosInhumacionController {
  constructor(
    private readonly requisitosInhumacionService: RequisitosInhumacionService,
    @Inject('S3_CLIENT') private readonly s3Client: S3Client,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo requisito de inhumación' })
  @ApiBody({
    type: CreateRequisitosInhumacionDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de creación',
        value: {
          id_cementerio: { id_cementerio: 'uuid-cementerio' },
          pantoneroACargo: 'Juan Pérez',
          metodoSolicitud: 'escrita',
          id_solicitante: { id_persona: 'uuid-solicitante' },
          observacionSolicitante: 'Observaciones sobre el solicitante',
          copiaCertificadoDefuncion: true,
          informeEstadisticoINEC: true,
          copiaCedula: true,
          pagoTasaInhumacion: true,
          copiaTituloPropiedadNicho: true,
          id_hueco_nicho: { id_detalle_hueco: 'uuid-hueco-nicho' },
          firmaAceptacionSepulcro: 'Firma digitalizada o nombre completo',
          id_fallecido: { id_persona: 'uuid-fallecido' },
          fechaInhumacion: '2024-06-01',
          horaInhumacion: '14:30',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Requisito creado correctamente.' })
  create(@Body() createRequisitosInhumacionDto: CreateRequisitosInhumacionDto) {
    return this.requisitosInhumacionService.create(
      createRequisitosInhumacionDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los requisitos de inhumación' })
  @ApiResponse({
    status: 200,
    description: 'Lista de requisitos de inhumación.',
  })
  findAll() {
    return this.requisitosInhumacionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un requisito de inhumación por ID' })
  @ApiParam({ name: 'id', description: 'ID del requisito de inhumación' })
  @ApiResponse({ status: 200, description: 'Requisito encontrado.' })
  @ApiResponse({ status: 404, description: 'Requisito no encontrado.' })
  findOne(@Param('id') id: string) {
    return this.requisitosInhumacionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un requisito de inhumación' })
  @ApiParam({ name: 'id', description: 'ID del requisito de inhumación' })
  @ApiBody({
    type: UpdateRequisitosInhumacionDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de actualización',
        value: {
          observacionSolicitante: 'Observaciones actualizadas',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Requisito actualizado correctamente.',
  })
  @ApiResponse({ status: 404, description: 'Requisito no encontrado.' })
  update(
    @Param('id') id: string,
    @Body() updateRequisitosInhumacionDto: UpdateRequisitosInhumacionDto,
  ) {
    return this.requisitosInhumacionService.update(
      id,
      updateRequisitosInhumacionDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un requisito de inhumación' })
  @ApiParam({ name: 'id', description: 'ID del requisito de inhumación' })
  @ApiResponse({
    status: 200,
    description: 'Requisito eliminado correctamente.',
  })
  @ApiResponse({ status: 404, description: 'Requisito no encontrado.' })
  remove(@Param('id') id: string) {
    return this.requisitosInhumacionService.remove(id);
  }

  @Post(':id/upload')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'pdfs', maxCount: 10 }]))
  @ApiOperation({
    summary: 'Subir archivos PDF a S3 para un requisito de inhumación',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del requisito de inhumación',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Archivos PDF a subir (máximo 10 archivos)',
    schema: {
      type: 'object',
      properties: {
        pdfs: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
      required: ['pdfs'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'PDFs subidos exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'PDFs subidos exitosamente' },
        urls: {
          type: 'array',
          items: {
            type: 'string',
            example:
              'https://bucket.s3.region.amazonaws.com/requisitos/uuid/uuid-file.pdf',
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'No se enviaron archivos PDF o el archivo no es un PDF.',
  })
  async uploadPdfs(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFiles() files: { pdfs?: Express.Multer.File[] },
  ) {
    if (!files.pdfs || files.pdfs.length === 0) {
      throw new BadRequestException('No se enviaron archivos PDF.');
    }

    const uploadedUrls: string[] = [];

    for (const file of files.pdfs) {
      if (file.mimetype !== 'application/pdf') {
        throw new BadRequestException(
          `Archivo ${file.originalname} no es un PDF.`,
        );
      }

      const key = `requisitos/${id}/${uuid()}-${file.originalname}`;

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3Client.send(command);

      const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      uploadedUrls.push(url);
    }

    await this.requisitosInhumacionService.attachPdfUrls(id, uploadedUrls);

    return {
      message: 'PDFs subidos exitosamente',
      urls: uploadedUrls,
    };
  }
}
