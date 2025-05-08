import { IsDate, IsNotEmpty, IsString } from "class-validator";
import { Nicho } from "src/nicho/entities/nicho.entity";
import { DeepPartial } from "typeorm";

export class CreateInhumacionDto {
    @IsString()
    @IsNotEmpty()
    id_nicho: DeepPartial <Nicho>;

    @IsString()
    @IsNotEmpty()
    id_fallecido: string;

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
