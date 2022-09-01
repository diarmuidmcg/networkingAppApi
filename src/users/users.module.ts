import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Users } from './users.entity';

import { Image } from 'src/images/image.entity';
import { ImagesService } from 'src/images/images.service';
import { ImagesModule } from 'src/images/images.module';

import { Events } from 'src/events/events.entity';

@Module({
  imports: [ImagesModule, TypeOrmModule.forFeature([Users, Image, Events])],
  controllers: [UsersController],
  providers: [UsersService, ImagesService],
  exports: [UsersService],
})
export class UsersModule {}
