import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsDateString,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum MetodoSolicitud {
  ESCRITA = 'escrita',
  VERBAL = 'verbal',
}

export class CreateRequisitosInhumacionDto {
     /* A) Datos institucionales */
  @IsString()
  cementerio: string;

  @IsString()
  pantoneroACargo: string;

  /* B) Método de solicitud */
  @IsEnum(MetodoSolicitud)
  @IsOptional()
  metodoSolicitud: MetodoSolicitud = MetodoSolicitud.ESCRITA;

  /* C) Solicitante (FK -> persona.id) */
  @IsInt()
  solicitanteId: number;

  @IsString()
  @IsOptional()
  observacionSolicitante?: string;

  /* D) Checklist de requisitos */
  @IsBoolean() copiaCertificadoDefuncion: boolean;
  @IsBoolean() informeEstadisticoINEC: boolean;
  @IsBoolean() copiaCedula: boolean;
  @IsBoolean() pagoTasaInhumacion: boolean;
  @IsBoolean() copiaTituloPropiedadNicho: boolean;

  /* E) Datos de la fosa/nicho/sillio (FK -> fosa.id) */
  @IsInt()
  fosaId: number;

  @IsString() propiedad: 'propio' | 'arrendado';
  @IsString() firmaAceptacionSepulcro: string;

  /* F) Fallecido (FK -> persona.id con estado=fallecido) */
  @IsInt() fallecidoId: number;

  @IsString() causaMuerte: string;

  @IsDateString() fechaInhumacion: Date;

  /** HH:MM en formato 24 h */
  @IsString() horaInhumacion: string;
}
