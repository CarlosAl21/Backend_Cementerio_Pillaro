import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ExumacionModule } from './exumacion/exumacion.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // o el tipo de DB que uses
      host: 'localhost',
      port: 5432,
      username: 'tu_usuario',
      password: 'tu_contraseña',
      database: 'cementerio_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Solo para desarrollo
    }),
    PersonaModule,
    NichoModule,
    ExumacionModule,
  ],
})
export class AppModule {}
