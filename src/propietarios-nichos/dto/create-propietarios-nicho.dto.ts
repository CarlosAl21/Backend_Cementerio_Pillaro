import { IsDate, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Nicho } from "src/nicho/entities/nicho.entity";
import { Persona } from "src/personas/entities/persona.entity";

export class CreatePropietarioNichoDto {
    @ApiProperty({
        description: 'ID de la persona propietaria',
        type: 'string',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: true
    })
    @IsNotEmpty()
    id_persona: Persona;

    @ApiProperty({
        description: 'ID del nicho asociado',
        type: 'string',
        example: '123e4567-e89b-12d3-a456-426614174001',
        required: true
    })
    @IsNotEmpty()
    id_nicho: Nicho;

    @ApiProperty({
        description: 'Fecha de adquisición del nicho',
        type: 'string',
        format: 'date-time',
        example: '2023-01-15T00:00:00.000Z',
        required: true
    })
    @IsDate()
    @IsNotEmpty()
    fecha_adquisicion: Date;

    @ApiProperty({
        description: 'Tipo de documento de adquisición',
        enum: ['Escritura', 'Contrato', 'Factura', 'Otro'],
        example: 'Escritura',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    tipo_documento: string;

    @ApiProperty({
        description: 'Número del documento de adquisición',
        example: 'DOC-2023-001',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    numero_documento: string;
    
    @ApiProperty({
        description: 'Estado actual de la propiedad',
        enum: ['Activo', 'Inactivo', 'En proceso', 'Vendido', 'Heredado'],
        example: 'Activo',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    estado: string;

    @ApiProperty({
        description: 'Observaciones adicionales sobre la propiedad',
        example: 'Nicho familiar con capacidad para 4 urnas',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    observaciones: string;
}