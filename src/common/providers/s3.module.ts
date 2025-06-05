import { Module } from '@nestjs/common';
import { S3ClientProvider } from './s3.provider';

@Module({
  providers: [S3ClientProvider],
  exports: [S3ClientProvider],
})
export class S3Module {}