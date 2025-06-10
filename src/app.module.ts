import { Module } from '@nestjs/common';
import { UserModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';


@Module({
  imports: [UserModule, PrismaModule], //modules
  controllers: [],
  providers: [],
})
export class AppModule {}
