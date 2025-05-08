import { Module } from '@nestjs/common';
import { PropietariosNichosService } from './propietarios-nichos.service';
import { PropietariosNichosController } from './propietarios-nichos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Persona } from 'src/personas/entities/persona.entity';
import { PropietarioNicho } from './entities/propietarios-nicho.entity';

@Module({
  controllers: [PropietariosNichosController],
  providers: [PropietariosNichosService],
  imports: [TypeOrmModule.forFeature([PropietarioNicho])]

})
export class PropietariosNichosModule {}
