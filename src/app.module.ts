import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequisitosInhumacionModule } from './requisitos-inhumacion/requisitos-inhumacion.module';

@Module({
  imports: [TypeOrmModule.forRoot(...), RequisitosInhumacionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}