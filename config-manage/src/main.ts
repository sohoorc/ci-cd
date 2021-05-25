import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
    // allowedHeaders: ['authorization']
  });
  // 设置全局api前缀
  app.setGlobalPrefix('/api')
  // 设置全局参数验证管道
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(3000);
}
bootstrap();
