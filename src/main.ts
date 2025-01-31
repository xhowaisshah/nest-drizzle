import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
    allowedHeaders: 'X-Requested-With,Content-Type,Authorization',
  });

  app.setGlobalPrefix('api')
  await app.listen(3002, '0.0.0.0');
}
bootstrap();