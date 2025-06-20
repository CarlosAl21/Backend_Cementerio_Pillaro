import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Cementerio } from 'src/cementerio/entities/cementerio.entity';
import { Persona } from 'src/personas/entities/persona.entity';
import { HuecosNicho } from 'src/huecos-nichos/entities/huecos-nicho.entity';
import { DeepPartial } from 'typeorm';

export enum MetodoSolicitud {
  ESCRITA = 'escrita',
}

export class CreateRequisitosInhumacionDto {
  @ApiProperty({
    description: 'Cementerio donde se realiza la inhumación',
    example: { id_cementerio: 'uuid-cementerio'},
  })
  @IsNotEmpty()
  id_cementerio: DeepPartial<Cementerio>;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del pantonero a cargo' })
  @IsString()
  pantoneroACargo: string;

  @ApiPropertyOptional({ enum: MetodoSolicitud, default: MetodoSolicitud.ESCRITA })
  @IsEnum(MetodoSolicitud)
  @IsOptional()
  metodoSolicitud?: MetodoSolicitud;

  @ApiProperty({
    description: 'ID de la persona solicitante',
    example: { id_persona: 'uuid-solicitante' },
  })
  @IsNotEmpty()
  id_solicitante: DeepPartial<Persona>;

  @ApiPropertyOptional({ example: 'Observaciones sobre el solicitante' })
  @IsString()
  @IsOptional()
  observacionSolicitante?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  copiaCertificadoDefuncion: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  informeEstadisticoINEC: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  copiaCedula: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  pagoTasaInhumacion: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  copiaTituloPropiedadNicho: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  autorizacionDeMovilizacionDelCadaver?: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  OficioDeSolicitud?: boolean;

  @ApiProperty({
    description: 'ID del hueco o nicho',
    example: { id_detalle_hueco: 'uuid-hueco-nicho' },
  })
  @IsNotEmpty()
  id_hueco_nicho: DeepPartial<HuecosNicho>;

  @ApiProperty({ example: 'Firma digitalizada o nombre completo' })
  @IsString()
  firmaAceptacionSepulcro: string;

  @ApiProperty({
    description: 'ID de la persona fallecida',
    example: { id_persona: 'uuid-fallecido'},
  })
  @IsNotEmpty()
  id_fallecido: DeepPartial<Persona>;

  @ApiProperty({ example: '2024-06-01', description: 'Fecha de la inhumación' })
  @IsDateString()
  fechaInhumacion: Date;

  @ApiProperty({ example: '14:30', description: 'Hora de la inhumación (formato 24h)' })
  @IsString()
  horaInhumacion: string;
}
