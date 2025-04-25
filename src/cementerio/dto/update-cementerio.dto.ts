import { PartialType } from '@nestjs/swagger';
import { CreateCementerioDto } from './create-cementerio.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCementerioDto extends PartialType(CreateCementerioDto) {
    @IsString()
    @IsNotEmpty()
    id_cementerio: string;
}
