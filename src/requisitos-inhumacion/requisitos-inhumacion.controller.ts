import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
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
import { PDFGeneratorService } from 'src/shared/pdf-generator/pdf-generator.service';
import { Response } from 'express';

@ApiTags('Requisitos Inhumacion')
@Controller('requisitos-inhumacion')
export class RequisitosInhumacionController {
  constructor(
    private readonly requisitosInhumacionService: RequisitosInhumacionService,
    private readonly pdfGeneratorService: PDFGeneratorService, 
  ) {}


@Get(':id/pdf')
async generarPDF(@Param('id') id: string, @Res() res: Response) {
  const requisitos = await this.requisitosInhumacionService.findOne(id); 
  // Incluye relaciones
  const pdfPath = await this.pdfGeneratorService.generarPDF(requisitos);
  res.download(pdfPath);
}

  @Post()
  @ApiConsumes('application/json')
  @ApiOperation({ summary: 'Crear un nuevo requisito de inhumación (solo JSON), el link del documento es opcional' })
  @ApiResponse({ status: 201, description: 'Requisito creado correctamente.' })
  @ApiBadRequestResponse({
    description: 'Error al crear el requisito de inhumación.',
  })
  @ApiResponse({
    status: 400,
    description: 'Petición inválida.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Datos inválidos',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({ status: 409, description: 'Hueco no disponible.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @ApiBody({
    description: 'Datos del requisito en formato JSON',
    type: CreateRequisitosInhumacionDto,
    required: true,
  })
  create(
    @Body() dto: CreateRequisitosInhumacionDto,
  ) {
    return this.requisitosInhumacionService.create(dto);
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
  @ApiOperation({ summary: 'Actualizar un requisito de inhumación' })
  @ApiParam({ name: 'id', description: 'ID del requisito de inhumación' })
  @ApiBody({
    description: 'Datos del requisito en formato JSON',
    schema: {
      type: 'object',
      properties: {
        copiaCertificadoDefuncion: { type: 'boolean', example: true },
        informeEstadisticoINEC: { type: 'boolean', example: false },
        copiaCedula: { type: 'boolean', example: true },
        pagoTasaInhumacion: { type: 'boolean', example: true },
        copiaTituloPropiedadNicho: { type: 'boolean', example: false },
        // Agrega aquí otros campos del DTO si es necesario
      },
      required: [
        'copiaCertificadoDefuncion',
        'informeEstadisticoINEC',
        'copiaCedula',
        'pagoTasaInhumacion',
        'copiaTituloPropiedadNicho',
      ],
      example: {
        copiaCertificadoDefuncion: true,
        informeEstadisticoINEC: false,
        copiaCedula: true,
        pagoTasaInhumacion: true,
        copiaTituloPropiedadNicho: false,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Requisito actualizado correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Petición inválida.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Datos inválidos',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({ status: 409, description: 'Hueco no disponible.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @ApiResponse({ status: 404, description: 'Requisito no encontrado.' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRequisitosInhumacionDto,
  ) {
    return this.requisitosInhumacionService.update(id, dto);
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

}
