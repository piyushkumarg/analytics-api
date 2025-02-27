import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
const Package = require('../package.json');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  const port = Number(process.env.PORT) || 3006;
  const host = '0.0.0.0';

  const config = new DocumentBuilder()
    .setTitle('Analytics API')
    .setDescription('The Analytics API description')
    .setVersion('1.0')
    .addTag('analytics')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port, host, async () => {
    console.info('Server Started', {
      environment: process.env.NODE_ENV,
      version: Package.version,
      port: port,
      host: host,
      process_id: process.pid,
      docs:
        process.env.NODE_ENV !== 'production'
          ? `http://localhost:${port}/api#/`
          : 'Not Available!',
    });
  });
}

bootstrap();
