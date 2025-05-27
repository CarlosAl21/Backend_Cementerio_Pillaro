import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsDateString,
  IsInt,
  IsNotEmpty,
} from 'class-validator';
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
  @IsNotEmpty()
  cementerio: Cementerio;

  @IsString()
  pantoneroACargo: string;

  /* B) Método de solicitud */
  @IsEnum(MetodoSolicitud)
  @IsOptional()
  metodoSolicitud: MetodoSolicitud = MetodoSolicitud.ESCRITA;

  /* C) Solicitante (FK -> persona.id) */
  @IsNotEmpty()
  solicitanteId: Persona;

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
  @IsNotEmpty()
  id_hueco_nicho: HuecosNicho;

  @IsString() firmaAceptacionSepulcro: string;

  /* F) Fallecido (FK -> persona.id con estado=fallecido) */
  @IsNotEmpty() 
  id_fallecido: Persona;

  @IsDateString() fechaInhumacion: Date;

  /** HH:MM en formato 24 h */
  @IsString() horaInhumacion: string;
}
