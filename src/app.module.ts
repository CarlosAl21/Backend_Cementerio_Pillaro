import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CementerioModule } from './cementerio/cementerio.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Cementerio } from './cementerio/entities/cementerio.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Nicho } from './nicho/entities/nicho.entity';
import { Exumacion } from './exumacion/entities/exumacion.entity';
import { NichoModule } from './nicho/nicho.module';
import { ExumacionModule } from './exumacion/exumacion.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT || 5432),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      schema: process.env.DB_SCHEMA, // Asegúrate de que esta línea esté correcta
      autoLoadEntities: true,
      entities: [
        User,
        Cementerio,
        Nicho,
        Exumacion,
      ],
      synchronize: true, // Solo para desarrollo, no usar en producción
    }),
    UserModule, 
    CementerioModule, 
    AuthModule,
    NichoModule,
    ExumacionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
