import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Set globally validation type for useage in the dto's
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Whitelist allows only key/values in request which where predefined in dto's. Protection against incorrect entries and prevents vulnerabilities.
    }),
  );

  //Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Stock API')
    .setDescription('The stock API description')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
