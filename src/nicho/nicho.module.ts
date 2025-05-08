import { Module } from '@nestjs/common';
import { NichoService } from './nicho.service';
import { NichosController } from './nicho.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nicho } from './entities/nicho.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Nicho])],
  controllers: [NichosController],
  providers: [NichoService],
  exports: [NichoService]
})
export class NichoModule {}
