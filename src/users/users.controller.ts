import { UsersService } from './users.service';
import { Users } from './users.entity';
// import { AuthGuard } from '@nestjs/passport';
import {
  Controller,
  Get,
  Post,
  Delete,
  Req,
  Res,
  Body,
  UseInterceptors,
  UploadedFiles,
  Put,
  UseGuards,
} from '@nestjs/common';
import { request, response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(public appService: UsersService) {}

  @Get('')
  // @UseGuards(AuthGuard('jwt'))
  async getUsers(@Req() request, @Res() response) {
    return await this.appService.getUsers(request, response);
  }

  @Get(':id')
  // @UseGuards(AuthGuard('jwt'))
  async getSingleUser(@Req() request, @Res() response) {
    return await this.appService.getSingleUser(request, response);
  }

  @Post('')
  // @UseGuards(AuthGuard('jwt'))
  // @UseInterceptors(FilesInterceptor('file'))
  async createUser(@Req() request, @Res() response) {
    return await this.appService.createUser(request, response);
  }

  @Put(':id')
  // @UseGuards(AuthGuard('jwt'))
  // @UseInterceptors(FilesInterceptor('file'))
  async updateUser(@Req() request, @Res() response) {
    return await this.appService.updateUser(request, response);
  }

  @Delete(':id')
  // @UseGuards(AuthGuard('jwt'))
  async deleteUser(@Req() request, @Res() response) {
    return await this.appService.deleteUser(request, response);
  }
}
