import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Nicho } from './nicho/entities/nicho.entity';
import { Exumacion } from './exumacion/entities/exumacion.entity';
import { NichoModule } from './nicho/nicho.module';
import { ExumacionModule } from './exumacion/exumacion.module';
import { Inhumacion } from './inhumaciones/entities/inhumacion.entity';
import { InhumacionesModule } from './inhumaciones/inhumaciones.module';
import { PersonasModule } from './personas/personas.module';
import { PropietariosNichosModule } from './propietarios-nichos/propietarios-nichos.module';
import { UserModule } from './user/user.module';
import { CementerioModule } from './cementerio/cementerio.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entities/user.entity';
import { Cementerio } from './cementerio/entities/cementerio.entity';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Persona } from './personas/entities/persona.entity';
import { PropietarioNicho } from './propietarios-nichos/entities/propietarios-nicho.entity';

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
        Inhumacion,
        Persona,
        PropietarioNicho,
      ],
      synchronize: true, // Solo para desarrollo, no usar en producción
    }),
    UserModule, 
    CementerioModule, 
    AuthModule,
    NichoModule,
    ExumacionModule,
    InhumacionesModule,
    PersonasModule,
    PropietariosNichosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
