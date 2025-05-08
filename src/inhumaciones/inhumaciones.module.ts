import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inhumacion } from './entities/inhumacion.entity';  // Importa la entidad
import { InhumacionesService } from './inhumaciones.service';
import { InhumacionesController } from './inhumaciones.controller';
import { Persona } from '../personas/entities/persona.entity'; // Importa la entidad Persona si es necesario
import { Nicho } from '../nicho/entities/nicho.entity'; // Importa la entidad Nicho si es necesario

@Module({
  imports: [TypeOrmModule.forFeature([Inhumacion, Persona, Nicho])], // Registra la entidad Inhumacion aquí
  providers: [InhumacionesService],
  controllers: [InhumacionesController],
  exports: [InhumacionesService], // Exporta el servicio si es necesario en otros módulos
})
export class InhumacionesModule {}
