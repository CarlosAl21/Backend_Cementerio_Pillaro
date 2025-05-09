import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',  // Permite todas las peticiones (puedes cambiarlo a un dominio específico)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  const config = new DocumentBuilder()
    .setTitle('Cementerios API')
    .setDescription('Documentacion de la API del Sistema de control de Cementerios en Pillaro\n\nDesarrollado por estudiantes de Software de Septimo Semestre\n\n**NOTA: Para poder realizar peticiones a la API, es necesario estar autenticado en algunos modulos de momento.**')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
