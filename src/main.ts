import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // elimina campos extra
      forbidNonWhitelisted: true,
      transform: true,          // convierte tipos
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
