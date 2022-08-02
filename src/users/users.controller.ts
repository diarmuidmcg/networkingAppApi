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

  // Blogs GET

  @Get('numberOfBlogs')
  // @UseGuards(AuthGuard('jwt'))
  async numberOfBlogs(@Req() request, @Res() response) {
    return await this.appService.getNumberOfUsers(request, response);
  }

  @Get('blogs')
  // @UseGuards(AuthGuard('jwt'))
  async getBlogs(@Req() request, @Res() response) {
    return await this.appService.getUsers(request, response);
  }

  @Post('blogs')
  // @UseGuards(AuthGuard('jwt'))
  // @UseInterceptors(FilesInterceptor('file'))
  async createBlog(@Req() request, @Res() response) {
    return await this.appService.createUser(request, response);
  }
}
