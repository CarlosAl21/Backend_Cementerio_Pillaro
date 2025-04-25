import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PersonasModule } from './personas/personas.module';
import { PropietariosNichosModule } from './propietarios-nichos/propietarios-nichos.module';

@Module({
  imports: [
   
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', 
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'pillaro',
      autoLoadEntities: true, 
      synchronize: true,      
    }),

    
    PersonasModule,
    PropietariosNichosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
