import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inhumacion } from './entities/inhumacion.entity';  // Importa la entidad
import { InhumacionesService } from './inhumaciones.service';
import { InhumacionesController } from './inhumaciones.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Inhumacion])], // Registra la entidad Inhumacion aquí
  providers: [InhumacionesService],
  controllers: [InhumacionesController],
})
export class InhumacionesModule {}
