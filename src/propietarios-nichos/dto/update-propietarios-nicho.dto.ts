import { PartialType } from '@nestjs/mapped-types';
import { CreatePropietarioNichoDto } from './create-propietario-nicho.dto';

export class UpdatePropietarioNichoDto extends PartialType(CreatePropietarioNichoDto) {}
