// src/exhumacion/exhumacion.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exhumacion } from './entities/exhumacion.entity';
import { ExhumacionService } from './exhumacion.service';
import { ExhumacionController } from './exhumacion.controller';
import { PersonaModule } from '../persona/persona.module';
import { NichoModule } from '../nicho/nicho.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exhumacion]),
    PersonaModule,
    NichoModule
  ],
  controllers: [ExhumacionController],
  providers: [ExhumacionService],
  exports: [ExhumacionService]
})
export class ExumacionModule {}