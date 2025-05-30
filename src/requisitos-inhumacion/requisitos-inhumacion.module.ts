import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequisitosInhumacionService } from './requisitos-inhumacion.service';
import { RequisitosInhumacionController } from './requisitos-inhumacion.controller';
import { RequisitosInhumacion } from './entities/requisitos-inhumacion.entity';
import { Persona } from 'src/personas/entities/persona.entity';
import { HuecosNicho } from 'src/huecos-nichos/entities/huecos-nicho.entity';
import { Cementerio } from 'src/cementerio/entities/cementerio.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RequisitosInhumacion, Persona, HuecosNicho, Cementerio]),
  ],
  controllers: [RequisitosInhumacionController],
  providers: [RequisitosInhumacionService],
  exports: [RequisitosInhumacionService],
})
export class RequisitosInhumacionModule {}
