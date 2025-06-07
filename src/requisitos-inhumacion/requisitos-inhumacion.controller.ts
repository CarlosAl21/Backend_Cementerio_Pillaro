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
  HttpException,
  HttpStatus,
  Query,
  Res,
  NotFoundException,
  InternalServerErrorException,
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
  ApiQuery,
  ApiProduces,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import { Response } from 'express';

@ApiTags('Requisitos Inhumacion')
@Controller('requisitos-inhumacion')
export class RequisitosInhumacionController {
  constructor(
    private readonly requisitosInhumacionService: RequisitosInhumacionService,
    @Inject('S3_CLIENT') private readonly s3Client: S3Client,
  ) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'pdfs', maxCount: 10 }]))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Crear un nuevo requisito de inhumación' })
  @ApiResponse({ status: 201, description: 'Requisito creado correctamente.' })
  @ApiBadRequestResponse({
    description: 'Error al crear el requisito de inhumación.',
  })
  @ApiResponse({
    status: 400,
    description: 'Petición inválida. Ej: falta al menos un PDF.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Debe subir al menos un PDF',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({ status: 409, description: 'Hueco no disponible.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @ApiBody({
    description:
      'Datos del requisito (como JSON string) y archivos PDF (opcionales)',
    schema: {
      type: 'object',
      properties: {
        requisito: {
          type: 'string',
          example: JSON.stringify({
            id_cementerio: 'uuid-cementerio',
            pantoneroACargo: 'Juan Pérez',
            metodoSolicitud: 'escrita',
            id_solicitante: 'uuid-solicitante',
            observacionSolicitante: 'Observaciones sobre el solicitante',
            copiaCertificadoDefuncion: true,
            informeEstadisticoINEC: true,
            copiaCedula: true,
            pagoTasaInhumacion: true,
            copiaTituloPropiedadNicho: true,
            id_hueco_nicho: 'uuid-hueco-nicho',
            firmaAceptacionSepulcro: 'Firma digitalizada o nombre completo',
            id_fallecido: 'uuid-fallecido',
            fechaInhumacion: '2024-06-01',
            horaInhumacion: '14:30',
          }),
        },
        pdfs: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
      required: ['requisito'],
    },
  })
  create(
    @Body('requisito') requisitoStr: string,
    @UploadedFiles() files: { pdfs?: Express.Multer.File[] },
  ) {
    const dto: CreateRequisitosInhumacionDto = JSON.parse(requisitoStr);
    return this.requisitosInhumacionService.create(dto, files.pdfs ?? []);
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

  @Get('/requisito/:id')
  @ApiOperation({ summary: 'Obtener un requisito de inhumación por ID' })
  @ApiParam({ name: 'id', description: 'ID del requisito de inhumación' })
  @ApiResponse({ status: 200, description: 'Requisito encontrado.' })
  @ApiResponse({ status: 404, description: 'Requisito no encontrado.' })
  findOne(@Param('id') id: string) {
    return this.requisitosInhumacionService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'pdfs', maxCount: 10 }]))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Actualizar un requisito de inhumación' })
  @ApiParam({ name: 'id', description: 'ID del requisito de inhumación' })
  @ApiBody({
    description:
      'Datos del requisito (como JSON string) y archivos PDF (opcionales)',
    schema: {
      type: 'object',
      properties: {
        value: {
          type: 'string',
          format: 'textarea',
          example: `{
  "copiaCertificadoDefuncion": true,
  "informeEstadisticoINEC": false,
  "copiaCedula": true,
  "pagoTasaInhumacion": true,
  "copiaTituloPropiedadNicho": false
}`,
        },
        pdfs: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
      required: ['value'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Requisito actualizado correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Petición inválida. Ej: falta al menos un PDF.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Debe subir al menos un PDF',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({ status: 409, description: 'Hueco no disponible.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @ApiResponse({ status: 404, description: 'Requisito no encontrado.' })
  update(
    @Param('id') id: string,
    @Body('value') valueStr: string,
    @UploadedFiles() files: { pdfs?: Express.Multer.File[] },
  ) {
    const dto: UpdateRequisitosInhumacionDto = JSON.parse(valueStr);
    return this.requisitosInhumacionService.update(id, dto, files.pdfs ?? []);
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
    description: 'ID del requisito de inhumación (UUID)',
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

    const bucket = process.env.AWS_BUCKET_NAME;
    const region = process.env.AWS_REGION;

    if (!bucket || !region) {
      throw new HttpException(
        'Variables de entorno AWS_BUCKET_NAME o AWS_REGION no están definidas.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    for (const file of files.pdfs) {
      if (file.mimetype !== 'application/pdf') {
        throw new BadRequestException(
          `Archivo ${file.originalname} no es un PDF.`,
        );
      }

      const key = `requisitos/${id}/${uuid()}-${file.originalname}`;

      try {
        const command = new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        });

        await this.s3Client.send(command);

        const url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
        uploadedUrls.push(url);
      } catch (error) {
        console.error('Error al subir a S3:', error);
        throw new HttpException(
          'Error al subir archivo a S3',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    await this.requisitosInhumacionService.attachPdfUrls(id, uploadedUrls);

    return {
      message: 'PDFs subidos exitosamente',
      urls: uploadedUrls,
    };
  }

  @Get('descargar-pdf')
  @ApiOperation({ summary: 'Descargar un PDF desde S3 por URL' })
  @ApiQuery({
    name: 'url',
    description:
      'URL completa del archivo PDF en S3 (codificada con encodeURIComponent)',
    required: true,
    example: encodeURIComponent(
      'https://cementerio-archivos.s3.us-east-2.amazonaws.com/requisitos/uuid/uuid-file.pdf',
    ),
    type: String,
  })
  @ApiProduces('application/pdf')
  @ApiResponse({
    status: 200,
    description: 'PDF descargado exitosamente.',
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  @ApiBadRequestResponse({
    description: 'La URL del PDF es requerida.',
  })
  @ApiResponse({
    status: 404,
    description: 'No se pudo descargar el PDF desde S3.',
  })
  async descargarPdf(@Query('url') url: string, @Res() res: Response) {
    if (!url) {
      throw new BadRequestException('La URL del PDF es requerida.');
    }

    const bucket = process.env.AWS_BUCKET_NAME;
    if (!bucket) {
      throw new InternalServerErrorException(
        'Configuración del bucket AWS no encontrada.',
      );
    }

    try {
      // Decodifica la URL recibida
      const decodedUrl = decodeURIComponent(url);

      // Parsear la URL para obtener solo el path, que es la key de S3
      const urlObject = new URL(decodedUrl);

      // El key en S3 es el path sin la primera barra '/'
      const key = urlObject.pathname.startsWith('/')
        ? urlObject.pathname.slice(1)
        : urlObject.pathname;

      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      const data = await this.s3Client.send(command);

      // Extraer nombre de archivo desde el key
      const filename = key.split('/').pop();

      res.setHeader('Content-Type', data.ContentType as string);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`,
      );

      (data.Body as NodeJS.ReadableStream).pipe(res);
    } catch (error) {
      console.error('Error real:', error);
      throw new NotFoundException('No se pudo descargar el PDF desde S3.');
    }
  }
}
