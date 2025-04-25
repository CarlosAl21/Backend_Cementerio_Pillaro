import { PartialType } from '@nestjs/swagger';
import { CreateExumacionDto } from './create-exumacion.dto';
import { IsString } from 'class-validator';

export class UpdateExumacionDto extends PartialType(CreateExumacionDto) {
  @IsString()
  id_exumacion?: number | undefined;
}
