import { IsDate, IsNotEmpty, IsString } from "class-validator";
import { Nicho } from "src/nicho/entities/nicho.entity";
import { Persona } from "src/personas/entities/persona.entity";
import { DeepPartial } from "typeorm";

export class CreateInhumacionDto {
    @IsString()
    @IsNotEmpty()
    id_nicho: DeepPartial <Nicho>;

    @IsNotEmpty()
    id_fallecido: DeepPartial <Persona>;

    @IsDate()
    @IsNotEmpty()
    fecha_inhumacion: string;

    @IsString()
    @IsNotEmpty()
    hora_inhumacion: string;

    @IsString()
    solicitante: string;

    @IsString()
    responsable_inhumacion: string;

    @IsString()
    observaciones: string;

    @IsString()
    codigo_inhumacion: string;

    @IsString()
    estado: string;

}
