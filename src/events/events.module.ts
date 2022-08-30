import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Events } from './events.entity';

import { Image } from 'src/images/image.entity';
import { ImagesService } from 'src/images/images.service';
import { ImagesModule } from 'src/images/images.module';

@Module({
  imports: [ImagesModule, TypeOrmModule.forFeature([Events, Image])],
  controllers: [EventsController],
  providers: [EventsService, ImagesService],
  exports: [EventsService],
})
export class EventsModule {}
