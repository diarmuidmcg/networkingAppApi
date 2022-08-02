import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';
import { Users } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  //Users
  async getNumberOfUsers(request, response): Promise<Users[]> {
    const numberOfUsers = await this.usersRepository
      .createQueryBuilder('users')
      .getCount();
    return response.status(200).json(numberOfUsers);
  }

  async getUsers(request, response): Promise<Users[]> {
    const numberOfUsers = await this.usersRepository
      .createQueryBuilder('users')

      .getMany();
    return response.status(200).json(numberOfUsers);
  }

  public async createUser(request, response): Promise<Users[]> {
    const { title, content } = request.body;

    const newUser = new Users();
    newUser.title = title !== null ? title : '';
    newUser.content = content !== null ? content : '';

    // globalThis.Logger.log({ level: 'info', message: 'New Blog' });
    // globalThis.Logger.log({ level: 'info', message: JSON.stringify(newBlog) });

    const data = await this.usersRepository.save(newUser);
    // globalThis.Logger.log({
    //   level: 'info',
    //   message: 'New Blog Response ' + JSON.stringify(data),
    // });
    return response.status(200).json(data);
  }
}
