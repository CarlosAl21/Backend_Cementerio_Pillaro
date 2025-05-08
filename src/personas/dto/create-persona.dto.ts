import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreatePersonaDto {
    @IsString()
    @IsNotEmpty()
    cedula: string;

    @IsString()
    @IsNotEmpty()
    nombres: string;
    @IsString()
    @IsNotEmpty()
    apellidos: string;
    
    @IsDate()
    @IsNotEmpty()
    fecha_nacimiento: Date;
    
    @IsDate()
    @IsNotEmpty()
    fecha_defuncion?: Date;

    @IsString()
    @IsNotEmpty()
    lugar_defuncion?: string;

    @IsString()
    @IsNotEmpty()
    causa_defuncion?: string;

    @IsString()
    @IsNotEmpty()
    direccion: string;

    @IsString()
    @IsNotEmpty()
    telefono: string;

    @IsString()
    @IsNotEmpty()
    correo: string;

    @IsString()
    @IsNotEmpty()
    tipo: string;
  }
  