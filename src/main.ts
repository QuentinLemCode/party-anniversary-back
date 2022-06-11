import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { env } from 'process';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { logger: console },
  );
  if (env.PREFIX) {
    app.setGlobalPrefix(env.PREFIX);
  }
  if (env.ORIGIN) {
    app.enableCors({
      origin: env.ORIGIN,
    });
  }
  await app.listen(env.PORT || 3000, '0.0.0.0');
}
bootstrap();
