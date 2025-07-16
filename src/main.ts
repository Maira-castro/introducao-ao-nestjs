import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    
    // Configurações da documentação Swagger
    const config = new DocumentBuilder()
        .setTitle('API de Usuários') //titulo da documentação
        .setDescription('Documentação da API de usuários com NestJS + Prisma + Swagger')
        .setVersion('1.0')
        .addBearerAuth({//esquema JWT Bearer
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'Authorization',
            in: 'header'
        })
        .build(); //construir a configuração

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document); // Acessível em http://localhost:3000/api

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, //Remova propriedades não decoradas no DTO
            forbidNonWhitelisted: true, //retorna erro se enviar propriedades não permitidas
            transform: true, //transforma os tipos automaticamente. EX(string -> number)

        })
    )

    await app.listen(process.env.API_PORT ?? 3000);
}
bootstrap();