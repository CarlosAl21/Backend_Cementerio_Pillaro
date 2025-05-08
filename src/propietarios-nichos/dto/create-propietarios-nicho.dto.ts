import { IsDate, IsNotEmpty, IsString } from "class-validator";
import { Nicho } from "src/nicho/entities/nicho.entity";
import { Persona } from "src/personas/entities/persona.entity";

export class CreatePropietarioNichoDto {

    @IsNotEmpty()
    id_persona: Persona;

    @IsNotEmpty()
    id_nicho: Nicho;

    @IsDate()
    @IsNotEmpty()
    fecha_adquisicion: Date;

    @IsString()
    @IsNotEmpty()
    tipo_documento: string;

    @IsString()
    @IsNotEmpty()
    numero_documento: string;
    
    @IsString()
    @IsNotEmpty()
    estado: string;

    @IsString()
    @IsNotEmpty()
    observaciones: string;
  }
  