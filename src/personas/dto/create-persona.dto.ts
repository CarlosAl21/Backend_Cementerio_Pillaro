import { IsDate, IsNotEmpty, IsString, IsOptional, IsEmail, IsPhoneNumber, Length } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreatePersonaDto {
    @ApiProperty({
        description: 'Número de cédula de identidad',
        example: '1234567890',
        minLength: 10,
        maxLength: 13,
        required: true
    })
    @IsString()
    @IsNotEmpty()
    @Length(10, 13)
    cedula: string;

    @ApiProperty({
        description: 'Nombres de la persona',
        example: 'Juan Carlos',
        minLength: 2,
        required: true
    })
    @IsString()
    @IsNotEmpty()
    @Length(2, 50)
    nombres: string;

    @ApiProperty({
        description: 'Apellidos de la persona',
        example: 'Pérez González',
        minLength: 2,
        required: true
    })
    @IsString()
    @IsNotEmpty()
    @Length(2, 50)
    apellidos: string;
    
    @ApiProperty({
        description: 'Fecha de nacimiento',
        type: 'string',
        format: 'date',
        example: '1990-05-15',
        required: true
    })
    @IsDate()
    @IsNotEmpty()
    fecha_nacimiento: Date;
    
    @ApiPropertyOptional({
        description: 'Fecha de defunción (opcional)',
        type: 'string',
        format: 'date',
        example: '2023-01-10'
    })
    @IsDate()
    @IsOptional()
    fecha_defuncion?: Date;

    @ApiPropertyOptional({
        description: 'Lugar de defunción (opcional)',
        example: 'Hospital General, Quito',
        required: false
    })
    @IsString()
    @IsOptional()
    lugar_defuncion?: string;

    @ApiPropertyOptional({
        description: 'Causa de defunción (opcional)',
        example: 'Enfermedad cardiovascular',
        required: false
    })
    @IsString()
    @IsOptional()
    causa_defuncion?: string;

    @ApiProperty({
        description: 'Dirección domiciliaria',
        example: 'Av. Amazonas N23-45 y Veintimilla',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    direccion: string;

    @ApiProperty({
        description: 'Número de teléfono',
        example: '+593987654321',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    @IsPhoneNumber() // Validate phone number format
    telefono: string;

    @ApiProperty({
        description: 'Correo electrónico',
        example: 'juan.perez@example.com',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    correo: string;

    @ApiProperty({
        description: 'Tipo de persona',
        enum: ['Familiar', 'Difunto', 'Responsable', 'Otro'],
        example: 'Familiar',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    tipo: string;
}