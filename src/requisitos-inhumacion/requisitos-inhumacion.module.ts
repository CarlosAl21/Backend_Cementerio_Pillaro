import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequisitosInhumacion } from '../entities/requisito-inhumacion.entity';
import { Persona } from '../entities/persona.entity';
import { Fosa } from '../entities/fosa.entity';
import { RequisitosInhumacionService } from './requisitos-inhumacion.service';
import { RequisitosInhumacionController } from './requisitos-inhumacion.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([RequisitoInhumacion, Persona, Fosa]),
  ],
  controllers: [RequisitosInhumacionController],
  providers: [RequisitosInhumacionService],
  exports: [RequisitoInhumacionService],
})
export class RequisitosInhumacionModule {}
