import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NichoModule } from './nicho/nicho.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'stacolegio5',
      database: 'cementerio',
      autoLoadEntities: true,
      synchronize: true,
    }),
    NichoModule,
  ],
})
export class AppModule {}
