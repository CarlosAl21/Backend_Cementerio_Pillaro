import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonaDto } from './create-persona.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePersonaDto extends PartialType(CreatePersonaDto) {
    @IsString()
    @IsNotEmpty()
    id_persona: string;
}
