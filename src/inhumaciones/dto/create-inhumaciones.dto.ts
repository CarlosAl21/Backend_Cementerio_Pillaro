import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateInhumacionDto {
    @IsString()
    @IsNotEmpty()
    id_nicho: string;

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
