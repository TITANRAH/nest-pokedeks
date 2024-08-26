import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // asi agrego el prefio api para que sea ..3000/api/..
  app.setGlobalPrefix('api/v2/');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // esto es que si espero 2 propiedades definidasa por un dto y me mandan mas , las filtray toma las
        // que corresponden y ya
      forbidNonWhitelisted: true, // pero al poner esto si me mandan mas propiedades de las que espero devuelve un error
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  )
  await app.listen(process.env.PORT);

  console.log(`Application is running on PORT: ${process.env.PORT}`);
  
}
bootstrap();
