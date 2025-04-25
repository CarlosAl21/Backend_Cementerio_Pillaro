// src/exhumacion/dto/create-exhumacion.dto.ts
import { 
  IsString, 
  IsIn, 
  IsDate, 
  IsBoolean, 
  IsOptional, 
  IsNumber,
  ValidateNested,
  IsObject
} from 'class-validator';
import { Type } from 'class-transformer';
import { Nicho } from 'src/nicho/entities/nicho.entity';

class RequisitoDto {
  @IsBoolean()
  cumple: boolean;

  @IsString()
  @IsOptional()
  observacion?: string;
}

export class CreateExumacionDto {
  @IsNumber()
  id_exumacion: number;

  @IsString()
  @IsIn(['escrito', 'verbal'])
  metodo_solicitud: 'escrito' | 'verbal';

  @IsString()
  solicitante_id: string;

  @IsString()
  parentesco: string;

  @IsString()
  fallecido_id: string;

  @IsString()
  nicho_original_id: Nicho;

  @IsString()
  @IsOptional()
  nuevo_lugar?: string;

  @IsDate()
  @Type(() => Date)
  fecha_exhumacion: Date;

  @IsString()
  hora_exhumacion: string;

  @IsObject()
  @ValidateNested()
  @Type(() => RequisitoDto)
  requisitos: {
    certificado_defuncion: RequisitoDto;
    certificado_inhumacion: RequisitoDto;
    copia_ci: RequisitoDto;
    titulo_propiedad: RequisitoDto;
    certificado_municipal: RequisitoDto;
    tiempo_minimo: RequisitoDto;
    orden_judicial: RequisitoDto;
    pago: RequisitoDto;
  };
  
  }