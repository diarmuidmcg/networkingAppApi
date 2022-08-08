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

  async getUsers(request, response): Promise<Users[]> {
    const numberOfUsers = await this.usersRepository
      .createQueryBuilder('users')

      .getMany();
    return response.status(200).json(numberOfUsers);
  }

  async getSingleUser(request, response): Promise<Users[]> {
    const { id } = request.params;
    const user = await this.usersRepository
      .createQueryBuilder('users')
      .where('users.id = :id', { id })
      .getOne();
    return response.status(200).json(user);
  }

  public async createUser(request, response): Promise<Users[]> {
    const {
      first_name,
      last_name,
      email,
      phone_number,
      occupation,
      linkedin_username,
      instagram_username,
    } = request.body;

    const newUser = new Users();
    newUser.first_name = first_name !== null ? first_name : '';
    newUser.last_name = last_name !== null ? last_name : '';
    newUser.email = email !== null ? email : '';
    newUser.phone_number = phone_number !== null ? phone_number : '';
    newUser.occupation = occupation !== null ? occupation : '';
    newUser.linkedin_username =
      linkedin_username !== null ? linkedin_username : '';
    newUser.instagram_username =
      instagram_username !== null ? instagram_username : '';

    // globalThis.Logger.log({ level: 'info', message: 'New Blog' });
    // globalThis.Logger.log({ level: 'info', message: JSON.stringify(newBlog) });

    const data = await this.usersRepository.save(newUser);
    // globalThis.Logger.log({
    //   level: 'info',
    //   message: 'New Blog Response ' + JSON.stringify(data),
    // });
    return response.status(200).json(data);
  }

  public async updateUser(request, response): Promise<Users[]> {
    const {
      first_name,
      last_name,
      email,
      phone_number,
      occupation,
      linkedin_username,
      instagram_username,
    } = request.body;
    const { id } = request.params;
    const updatedUser = new Users();
    updatedUser.first_name = first_name !== null ? first_name : '';
    updatedUser.last_name = last_name !== null ? last_name : '';
    updatedUser.email = email !== null ? email : '';
    updatedUser.phone_number = phone_number !== null ? phone_number : '';
    updatedUser.occupation = occupation !== null ? occupation : '';
    updatedUser.linkedin_username =
      linkedin_username !== null ? linkedin_username : '';
    updatedUser.instagram_username =
      instagram_username !== null ? instagram_username : '';

    // globalThis.Logger.log({ level: 'info', message: 'New Blog' });
    // globalThis.Logger.log({ level: 'info', message: JSON.stringify(newBlog) });

    const data = await this.usersRepository.update({ id }, updatedUser);
    // globalThis.Logger.log({
    //   level: 'info',
    //   message: 'New Blog Response ' + JSON.stringify(data),
    // });
    return response.status(200).json(data);
  }

  async deleteUser(request, response): Promise<Users[]> {
    const { id } = request.params;
    // globalThis.Logger.log({"level": "info", "message": "Remove user " + id});
    const user = await this.usersRepository.delete({ id });
    // globalThis.Logger.log({"level": "info", "message": "Remove User Response " + JSON.stringify(item)});
    return response.status(200).json(user);
  }
}
