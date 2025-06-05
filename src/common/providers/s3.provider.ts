import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

export const S3_CLIENT = 'S3_CLIENT';

export const S3ClientProvider = {
  provide: S3_CLIENT,
  useFactory: (configService: ConfigService) => {
    const region = configService.get<string>('AWS_REGION');
    const accessKeyId = configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = configService.get<string>('AWS_SECRET_ACCESS_KEY');

    if (!region || !accessKeyId || !secretAccessKey) {
      throw new Error('Missing AWS S3 configuration');
    }

    return new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  },
  inject: [ConfigService],
};