import { Module } from '@nestjs/common';
import { CementerioService } from './cementerio.service';
import { CementerioController } from './cementerio.controller';

@Module({
  controllers: [CementerioController],
  providers: [CementerioService],
})
export class CementerioModule {}
