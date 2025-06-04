import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequisitosInhumacionService } from './requisitos-inhumacion.service';
import { RequisitosInhumacionController } from './requisitos-inhumacion.controller';
import { RequisitosInhumacion } from './entities/requisitos-inhumacion.entity';
import { Persona } from 'src/personas/entities/persona.entity';
import { HuecosNicho } from 'src/huecos-nichos/entities/huecos-nicho.entity';
import { Cementerio } from 'src/cementerio/entities/cementerio.entity';
import { Inhumacion } from 'src/inhumaciones/entities/inhumacion.entity';
import { S3Module } from 'src/common/providers/s3.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RequisitosInhumacion, Persona, HuecosNicho, Cementerio, Inhumacion]),
    S3Module,
  ],
  controllers: [RequisitosInhumacionController],
  providers: [RequisitosInhumacionService],
  exports: [RequisitosInhumacionService],
})
export class RequisitosInhumacionModule {}
