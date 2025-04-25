import { Module } from '@nestjs/common';
import { PropietariosNichosService } from './propietarios-nichos.service';
import { PropietariosNichosController } from './propietarios-nichos.controller';

@Module({
  controllers: [PropietariosNichosController],
  providers: [PropietariosNichosService],
})
export class PropietariosNichosModule {}
