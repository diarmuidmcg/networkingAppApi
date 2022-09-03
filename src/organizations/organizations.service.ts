import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { time } from 'console';
import { title } from 'process';
// import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';
import { Organizations } from './organizations.entity';

import { ImagesService } from 'src/images/images.service';
import { Users } from 'src/users/users.entity';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organizations)
    private organizationsRepository: Repository<Organizations>,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private readonly imageService: ImagesService,
  ) {}

  async getOrganizations(request, response): Promise<Organizations[]> {
    // if query param 'hostId' or 'orgId' is passed in, just get related ones
    const { offset, limit, hostId, orgId } = request.query;
    globalThis.Logger.log({ level: 'info', message: 'Get organizations ' });

    let organizations;

    if (offset != undefined && limit != undefined) {
      if (hostId != undefined) {
        organizations = await this.organizationsRepository
          .createQueryBuilder('organizations')
          .leftJoinAndSelect('organizations.image', 'image')
          .leftJoin('organizations.host', 'host')
          .leftJoin('organizations.attendees', 'attendees')
          .select([
            'organizations',
            'host.id',
            'host.first_name',
            'host.linkedin_username',
            'host.occupation',
            'attendees.id',
            'attendees.first_name',
            'attendees.linkedin_username',
            'attendees.occupation',
          ])
          .take(limit)
          .skip(offset)
          .where('organizations.host.id = :id', { id: hostId })
          .getMany();
      }
      // else if (orgId != undefined) {
      //   organizations = await this.organizationsRepository
      //     .createQueryBuilder('organizations')
      //     .leftJoinAndSelect('organizations.image', 'image')
      //     .leftJoin('organizations.host', 'host')
      //     .leftJoin('organizations.attendees', 'attendees')
      //     .select([
      //       'organizations',
      //       'host.id',
      //       'host.first_name',
      //       'host.linkedin_username',
      //       'host.occupation',
      //       'attendees.id',
      //       'attendees.first_name',
      //       'attendees.linkedin_username',
      //       'attendees.occupation',
      //     ])
      //     .take(limit)
      //     .skip(offset)
      //     .where('organizations.organization.id = :id', { id: orgId })
      //     .getMany();
      // }
      else {
        organizations = await this.organizationsRepository
          .createQueryBuilder('organizations')
          .leftJoinAndSelect('organizations.image', 'image')
          .leftJoin('organizations.host', 'host')
          .leftJoin('organizations.attendees', 'attendees')
          .select([
            'organizations',
            'host.id',
            'host.first_name',
            'host.linkedin_username',
            'host.occupation',
            'attendees.id',
            'attendees.first_name',
            'attendees.linkedin_username',
            'attendees.occupation',
          ])
          .take(limit)
          .skip(offset)
          .getMany();
      }
    } else {
      organizations = await this.organizationsRepository
        .createQueryBuilder('organizations')
        .leftJoinAndSelect('organizations.image', 'image')
        .leftJoin('organizations.host', 'host')
        .leftJoin('organizations.attendees', 'attendees')
        .select([
          'organizations',
          'host.id',
          'host.first_name',
          'host.linkedin_username',
          'host.occupation',
          'attendees.id',
          'attendees.first_name',
          'attendees.linkedin_username',
          'attendees.occupation',
        ])
        .getMany();
    }
    globalThis.Logger.log({
      level: 'info',
      message: 'Get Organizations Response ' + JSON.stringify(organizations),
    });
    return response.status(200).json(organizations);
  }

  async getSingleOrganization(request, response): Promise<Organizations[]> {
    const { id } = request.params;
    globalThis.Logger.log({ level: 'info', message: 'Get organization ' + id });
    const organization = await this.organizationsRepository
      .createQueryBuilder('organizations')
      .leftJoinAndSelect('organizations.image', 'image')
      .leftJoin('organizations.host', 'host')
      .leftJoin('organizations.attendees', 'attendees')
      .select([
        'organizations',
        'host.id',
        'host.first_name',
        'host.linkedin_username',
        'host.occupation',
        'attendees.id',
        'attendees.first_name',
        'attendees.linkedin_username',
        'attendees.occupation',
      ])
      .where('organizations.id = :id', { id })
      .getOne();
    globalThis.Logger.log({
      level: 'info',
      message: 'Get Organization Response ' + JSON.stringify(organization),
    });
    return response.status(200).json(organization);
  }

  public async createOrganization(
    files,
    request,
    response,
  ): Promise<Organizations[]> {
    const { name, location, description, initialAdmin } = request.body;

    // type check all NOT Nullable
    let mustInclude = [];
    if (!name) mustInclude.push('title');
    if (!location) mustInclude.push('location');

    if (!initialAdmin) mustInclude.push('hostId');

    if (mustInclude.length > 0)
      return response.status(400).json({
        error:
          'You must include these BODY parameters: ' +
          JSON.stringify(mustInclude),
      });

    const newOrganization = new Organizations();

    // image upload
    const uploadImages = [];
    if (files) {
      for (let x = 0; x < files.length; x++) {
        const blob = files[x];
        await this.imageService
          .uploadImageAsBlob(blob.buffer, blob.mimetype)
          .then((result) => {
            uploadImages.push(result);
          });
      }
      newOrganization.image = uploadImages;
    }

    newOrganization.name = name !== null ? name : '';
    newOrganization.location = location !== null ? location : '';
    // newOrganization.admins.push(admins);
    newOrganization.description = description !== null ? description : '';

    globalThis.Logger.log({ level: 'info', message: 'New Organization' });
    globalThis.Logger.log({
      level: 'info',
      message: JSON.stringify(newOrganization),
    });

    // try {
    const data = await this.organizationsRepository.save(newOrganization);
    globalThis.Logger.log({
      level: 'info',
      message: 'New Organization Response ' + JSON.stringify(data),
    });
    return response.status(200).json(data);
    // // } catch (e) {
    //   globalThis.Logger.log({
    //     level: 'info',
    //     message: 'New User Response Error' + JSON.stringify(e),
    //   });
    //   return response.status(400).json({ error: e });
    // // }
  }

  public async updateOrganization(files, request, response) {
    const { name, location, description, new_admin } = request.body;
    const { id } = request.params;

    // fetch current profile from db
    let currentOrganization = await this.organizationsRepository
      .createQueryBuilder('organizations')
      .leftJoinAndSelect('organizations.image', 'image')
      .leftJoin('organizations.host', 'host')
      .leftJoin('organizations.attendees', 'attendees')
      .select([
        'organizations',
        'host.id',
        'host.first_name',
        'host.linkedin_username',
        'host.occupation',
        'attendees.id',
        'attendees.first_name',
        'attendees.linkedin_username',
        'attendees.occupation',
      ])
      .where('organizations.id = :id', { id })
      .getOne();
    // make sure upcycler exists
    if (currentOrganization == undefined)
      return response
        .status(400)
        .json({ error: 'this organizationId does not exist' });

    const updatedOrganization = new Organizations();

    // type check all NOT Nullable
    if (name != undefined) updatedOrganization.name = name;
    if (location != undefined) updatedOrganization.location = location;

    // image upload
    const uploadImages = [];
    if (files) {
      for (let x = 0; x < files.length; x++) {
        const blob = files[x];
        await this.imageService
          .uploadImageAsBlob(blob.buffer, blob.mimetype)
          .then((result) => {
            uploadImages.push(result);
          });
      }
      updatedOrganization.image = uploadImages;
    }

    if (description != undefined) updatedOrganization.description = description;

    const newAdmin = [];
    // attendees must be an array
    if (new_admin != undefined) {
      const user = await this.usersRepository
        .createQueryBuilder('users')
        .where('users.id = :new_admin', { new_admin })
        .getOne();

      // make sure user exists
      if (user == undefined || user == null)
        return response.status(400).json({
          error: `this admin (user id ${new_admin}) does not exist`,
        });

      newAdmin.push(user);
      console.log('new attendee is ' + user);
      updatedOrganization.admins = newAdmin;
    }

    globalThis.Logger.log({ level: 'info', message: 'Update Organization' });
    globalThis.Logger.log({
      level: 'info',
      message: JSON.stringify(updatedOrganization),
    });

    // merge new info into existing hire
    // ** we need to merge instead of usual keyword 'update'
    // because of images (oneToMany external relationship)
    // this case is not supported by the keyword 'update'
    this.organizationsRepository.merge(
      currentOrganization,
      updatedOrganization,
    );
    // save it
    const data = await this.organizationsRepository.save(currentOrganization);

    globalThis.Logger.log({
      level: 'info',
      message: 'Updated Organization Response ' + JSON.stringify(data),
    });
    return response.status(200).json(currentOrganization);
  }

  async deleteOrganization(request, response): Promise<Organizations[]> {
    const { id } = request.params;
    globalThis.Logger.log({
      level: 'info',
      message: 'Remove organization ' + id,
    });
    const organization = await this.organizationsRepository.delete({ id });
    globalThis.Logger.log({
      level: 'info',
      message: 'Remove Organization Response ' + JSON.stringify(organization),
    });
    return response.status(200).json(organization);
  }
}
