import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { IdentityGuard } from './config/identity.guard';
import { AllExceptionsFilter } from './config/identity.exception';
import { ResponseInterceptor } from './config/identity.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(process.env.PORT ?? 4000);
  
}
bootstrap();
