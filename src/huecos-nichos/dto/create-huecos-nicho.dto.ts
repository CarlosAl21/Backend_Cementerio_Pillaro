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
    minimum: 1,
    maximum: 2,
    required: true
  })
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(2)
  numero_hueco: number;
}