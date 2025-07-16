import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() { //inicia a conexao com o banco de dados
    await this.$connect();
  }

  async onModuleDestroy() { //interrompe a conexao com o banco de dados
    await this.$disconnect();
  }
}