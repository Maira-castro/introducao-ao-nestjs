import { Module } from '@nestjs/common';
import { PlaceService } from './place.service';
import { PlaceController } from './place.controller';
import { CloudinaryService } from './types/cloudinary.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [PlaceController],
  providers: [PlaceService,CloudinaryService],
  imports:[PrismaModule]
})
export class PlaceModule {}

