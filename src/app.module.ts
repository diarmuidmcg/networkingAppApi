import { config } from './orm.config';

// for logging
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { LoggerConfig } from 'src/LoggerConfig';
const logger: LoggerConfig = new LoggerConfig();

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { Users } from './users/users.entity';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    WinstonModule.forRoot(logger.console()),
    UsersModule,
    TypeOrmModule.forFeature([Users]),
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule {}
