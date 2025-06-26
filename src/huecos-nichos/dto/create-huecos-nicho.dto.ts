import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsDateString, IsOptional, IsUUID, MaxLength, Min, Max, Length } from 'class-validator';
import { Nicho } from 'src/nicho/entities/nicho.entity';
import { Persona } from 'src/personas/entities/persona.entity';
import { DeepPartial } from 'typeorm';

export class CreateHuecosNichoDto {
  @ApiProperty({
    description: 'ID del nichos al que pertenece el hueco',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
    required: true
  })
  @IsNotEmpty()
  @IsUUID()
  id_nicho: DeepPartial<Nicho>;

  @ApiProperty({
    description: 'Número de hueco del nicho',
    example: 2,
    required: true
  })
  @IsInt()
  @IsNotEmpty()
  num_hueco: number;

  @ApiProperty({
    description: 'Estado del hueco (Disponible, Ocupado, Reservado)',
    example: 'Disponible',
    required: true
  })
  @IsString()
  @MaxLength(20)
  estado: string;

  @ApiPropertyOptional({
    description: 'ID del fallecido asociada al hueco (opcional)',
    example: '123e4567-e89b-12d3-a456-426614174001',
    format: 'uuid',
    required: false
  })
  @IsOptional()
  @IsUUID()
  id_fallecido?: DeepPartial<Persona>;

}