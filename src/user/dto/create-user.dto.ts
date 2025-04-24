import { IsString } from "class-validator";
import { Cementerio } from "src/cementerio/entities/cementerio.entity";
import { DeepPartial } from "typeorm";

export class CreateUserDto {
    @IsString()
    id_cementerio_pert: DeepPartial<Cementerio>;

    @IsString()
    cedula: string;

    @IsString()
    email: string;

    @IsString()
    nombre: string;

    @IsString()
    apellido: string;

    @IsString()
    password: string;

}
