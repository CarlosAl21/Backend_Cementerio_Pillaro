import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsDateString,
  IsInt,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Cementerio } from 'src/cementerio/entities/cementerio.entity';
import { Persona } from 'src/personas/entities/persona.entity';
import { HuecosNicho } from 'src/huecos-nichos/entities/huecos-nicho.entity';

export enum MetodoSolicitud {
  ESCRITA = 'escrita',
  VERBAL = 'verbal',
}

export class CreateRequisitosInhumacionDto {
  /* A) Datos institucionales */
  @ApiProperty({
    description: 'Cementerio donde se realiza la inhumación',
    example: { id_cementerio: 'uuid-cementerio', nombre: 'Cementerio Central' },
  })
  @IsNotEmpty()
  cementerio: Cementerio;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del pantonero a cargo' })
  @IsString()
  pantoneroACargo: string;

  /* B) Método de solicitud */
  @ApiPropertyOptional({ enum: MetodoSolicitud, default: MetodoSolicitud.ESCRITA })
  @IsEnum(MetodoSolicitud)
  @IsOptional()
  metodoSolicitud: MetodoSolicitud = MetodoSolicitud.ESCRITA;

  /* C) Solicitante (FK -> persona.id) */
  @ApiProperty({
    description: 'ID de la persona solicitante',
    example: { id_persona: 'uuid-solicitante', nombres: 'Carlos Solicitante' },
  })
  @IsNotEmpty()
  solicitanteId: Persona;

  @ApiPropertyOptional({ example: 'Observaciones sobre el solicitante' })
  @IsString()
  @IsOptional()
  observacionSolicitante?: string;

  /* D) Checklist de requisitos */
  @ApiProperty({ example: true })
  @IsBoolean() copiaCertificadoDefuncion: boolean;

  @ApiProperty({ example: true })
  @IsBoolean() informeEstadisticoINEC: boolean;

  @ApiProperty({ example: true })
  @IsBoolean() copiaCedula: boolean;

  @ApiProperty({ example: true })
  @IsBoolean() pagoTasaInhumacion: boolean;

  @ApiProperty({ example: true })
  @IsBoolean() copiaTituloPropiedadNicho: boolean;

  /* E) Datos de la fosa/nicho/sillio (FK -> fosa.id) */
  @ApiProperty({
    description: 'ID del hueco o nicho',
    example: { id_detalle_hueco: 'uuid-hueco-nicho' },
  })
  @IsNotEmpty()
  id_hueco_nicho: HuecosNicho;

  @ApiProperty({ example: 'Firma digitalizada o nombre completo' })
  @IsString() firmaAceptacionSepulcro: string;

  /* F) Fallecido (FK -> persona.id con estado=fallecido) */
  @ApiProperty({
    description: 'ID de la persona fallecida',
    example: { id_persona: 'uuid-fallecido', nombres: 'Pedro Fallecido' },
  })
  @IsNotEmpty()
  id_fallecido: Persona;

  @ApiProperty({ example: '2024-06-01', description: 'Fecha de la inhumación' })
  @IsDateString() fechaInhumacion: Date;

  /** HH:MM en formato 24 h */
  @ApiProperty({ example: '14:30', description: 'Hora de la inhumación (formato 24h)' })
  @IsString() horaInhumacion: string;
}
