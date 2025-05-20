import { PartialType } from '@nestjs/swagger';
import { CreateRequisitosInhumacionDto } from './create-requisitos-inhumacion.dto';

export class UpdateRequisitosInhumacionDto extends PartialType(CreateRequisitosInhumacionDto) {}
