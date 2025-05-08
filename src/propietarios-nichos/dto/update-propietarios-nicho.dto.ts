import { PartialType } from '@nestjs/mapped-types';
import { CreatePropietarioNichoDto } from './create-propietarios-nicho.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePropietarioNichoDto extends PartialType(CreatePropietarioNichoDto) {
    @IsString()
    @IsNotEmpty()
    id_propietario_nicho: string;
}
