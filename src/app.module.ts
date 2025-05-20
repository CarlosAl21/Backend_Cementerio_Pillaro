import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequisitosInhumacionModule } from './requisitos-inhumacion/requisitos-inhumacion.module';

@Module({
  imports: [RequisitosInhumacionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}