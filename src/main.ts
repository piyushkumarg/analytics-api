import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
const Package = require('../package.json');
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: console,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Removes unexpected properties
      forbidNonWhitelisted: true, // Throws error if extra properties exist
      transform: true, // Auto-transforms query params into correct types
      validationError: { target: false }, // Prevents returning full input
    }),
  );

  const port = Number(process.env.PORT) || 3006;
  const host = '0.0.0.0';

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Analytics API')
    .setDescription('Event analytics collection and reporting API')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'X-API-KEY', in: 'header' })
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
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
