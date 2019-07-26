import { json } from 'body-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(json({ limit: '50mb' }));
  app.enableCors();
  const options = new DocumentBuilder()
    .setTitle('Event API')
    .setDescription('Event API')
    .setVersion('1.0')
    .addTag('events')
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    include: [AppModule]
  });

  SwaggerModule.setup('/docs', app, document);
  await app.listen(5000);
}
bootstrap();