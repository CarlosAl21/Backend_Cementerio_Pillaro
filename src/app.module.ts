import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CementerioModule } from './cementerio/cementerio.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, CementerioModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
