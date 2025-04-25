import { PartialType } from '@nestjs/swagger';
import { CreateExumacionDto } from './create-exumacion.dto';

export class UpdateExumacionDto extends PartialType(CreateExumacionDto) {
    aprobado?: boolean;
  aprobadoPor?: string;
  nuevoLugar?: string;
  fechaExhumacion?: Date;
  horaExhumacion?: string;
}
