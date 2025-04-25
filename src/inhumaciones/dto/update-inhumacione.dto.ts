import { IsNotEmpty, IsString } from "class-validator";
import { CreateInhumacionDto } from "./create-inhumaciones.dto";
import { PartialType } from "@nestjs/swagger";

export class UpdateInhumacionDto extends PartialType(CreateInhumacionDto) {
    @IsString()
    @IsNotEmpty()
    id_inhumacion: string;
}