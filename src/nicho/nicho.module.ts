import { Module } from '@nestjs/common';
import { NichoService } from './nicho.service';
import { NichosController } from './nicho.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nicho } from './entities/nicho.entity';
import { HuecosNicho } from 'src/huecos-nichos/entities/huecos-nicho.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Nicho, HuecosNicho])],
  controllers: [NichosController],
  providers: [NichoService],
  exports: [NichoService]
})
export class NichoModule {}
