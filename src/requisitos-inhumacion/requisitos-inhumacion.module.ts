import { Module } from '@nestjs/common';
import { RequisitosInhumacionService } from './requisitos-inhumacion.service';
import { RequisitosInhumacionController } from './requisitos-inhumacion.controller';

@Module({
  controllers: [RequisitosInhumacionController],
  providers: [RequisitosInhumacionService],
})
export class RequisitosInhumacionModule {}
