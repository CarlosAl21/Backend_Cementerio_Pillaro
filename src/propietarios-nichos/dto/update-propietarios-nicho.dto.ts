import { PartialType } from '@nestjs/mapped-types';
import { CreatePropietarioNichoDto } from './create-propietarios-nicho.dto';

export class UpdatePropietarioNichoDto extends PartialType(CreatePropietarioNichoDto) {}
