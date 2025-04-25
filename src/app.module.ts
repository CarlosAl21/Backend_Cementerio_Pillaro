import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonasModule } from './personas/personas.module';
import { PropietariosNichosModule } from './propietarios-nichos/propietarios-nichos.module';

@Module({
  imports: [PersonasModule, PropietariosNichosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


