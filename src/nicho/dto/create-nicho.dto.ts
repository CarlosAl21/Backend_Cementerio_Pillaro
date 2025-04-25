import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsString } from 'class-validator';
import { IsInt } from 'class-validator';
import { IsDateString } from 'class-validator';
import { IsOptional } from 'class-validator';

export class CreateNichoDto {
  @ApiProperty({ example: 1, description: 'ID del cementerio al que pertenece el nicho' })
  @IsInt()
  @IsNotEmpty()
  idCementerio: number;

  @ApiProperty({ example: 'A', description: 'Sector del nicho' })
  @IsString()
  @IsNotEmpty()
  sector: string;

  @ApiProperty({ example: '1', description: 'Fila del nicho' })
  @IsString()
  @IsNotEmpty()
  fila: string;

  @ApiProperty({ example: '15', description: 'Número del nicho' })
  @IsString()
  @IsNotEmpty()
  numero: string;

  @ApiProperty({ example: 'Individual', description: 'Tipo del nicho' })
  @IsString()
  @IsNotEmpty()
  tipo: string;

  @ApiProperty({ example: '2023-01-01', description: 'Fecha de construcción' })
  @IsDateString()
  @IsNotEmpty()
  fechaConstruccion: Date;

  @ApiProperty({ example: 'Construido recientemente.', description: 'Observaciones del nicho', required: false })
  @IsString()
  @IsOptional()
  observaciones?: string;

  @ApiProperty({ example: 3, description: 'Número de pisos del nicho' })
  @IsInt()
  @IsNotEmpty()
  numeroPisos: number;
}
