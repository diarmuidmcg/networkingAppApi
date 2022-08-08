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
    globalThis.Logger.log({ level: 'info', message: 'Get users ' });
    const users = await this.usersRepository
      .createQueryBuilder('users')
      .getMany();
    globalThis.Logger.log({
      level: 'info',
      message: 'Get Users Response ' + JSON.stringify(users),
    });
    return response.status(200).json(users);
  }

  async getSingleUser(request, response): Promise<Users[]> {
    const { id } = request.params;
    globalThis.Logger.log({ level: 'info', message: 'Get user ' + id });
    const user = await this.usersRepository
      .createQueryBuilder('users')
      .where('users.id = :id', { id })
      .getOne();
    globalThis.Logger.log({
      level: 'info',
      message: 'Get User Response ' + JSON.stringify(user),
    });
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

    globalThis.Logger.log({ level: 'info', message: 'New User' });
    globalThis.Logger.log({ level: 'info', message: JSON.stringify(newUser) });

    const data = await this.usersRepository.save(newUser);
    globalThis.Logger.log({
      level: 'info',
      message: 'New User Response ' + JSON.stringify(data),
    });
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

    globalThis.Logger.log({ level: 'info', message: 'Update User' });
    globalThis.Logger.log({
      level: 'info',
      message: JSON.stringify(updatedUser),
    });

    const data = await this.usersRepository.update({ id }, updatedUser);
    const user = await this.usersRepository
      .createQueryBuilder('users')
      .where('users.id = :id', { id })
      .getOne();
    globalThis.Logger.log({
      level: 'info',
      message: 'Updated User Response ' + JSON.stringify(data),
    });
    return response.status(200).json(user);
  }

  async deleteUser(request, response): Promise<Users[]> {
    const { id } = request.params;
    globalThis.Logger.log({ level: 'info', message: 'Remove user ' + id });
    const user = await this.usersRepository.delete({ id });
    globalThis.Logger.log({
      level: 'info',
      message: 'Remove User Response ' + JSON.stringify(user),
    });
    return response.status(200).json(user);
  }
}
