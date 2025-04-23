import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InhumacionesModule } from './inhumaciones/inhumaciones.module';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    InhumacionesModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // o la IP/host de tu BD
      port: 5432,
      username: 'postgres',
      password: '0000',
      database: 'DB_Cementerio',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // solo en desarrollo
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
