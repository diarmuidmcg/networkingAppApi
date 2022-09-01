import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { time } from 'console';
import { title } from 'process';
// import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';
import { Events } from './events.entity';

import { ImagesService } from 'src/images/images.service';

const validateDate = (date) => {
  // return date.match(
  //   /^\d{4}\/\d{1,2}\/\d{1,2}$/,
  // );
  if (
    !date.match(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/)
  )
    return false;
  console.log('got past regex');
  var parts = date.split('/');
  var day = parseInt(parts[0], 10);
  var month = parseInt(parts[1], 10);
  var year = parseInt(parts[2], 10);

  // Check the ranges of month and year
  if (year < 1000 || year > 3000 || month == 0 || month > 12) return false;
  console.log('got past year');
  var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Adjust for leap years
  if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
    monthLength[1] = 29;
  console.log('got past month');
  console.log('day', day);
  console.log('month', month);
  console.log('year', year);
  // Check the range of the day
  return day > 0 && day <= monthLength[month - 1];
  console.log('got past day');
  return true;
};
const validateTime = (time) => {
  if (!time.match(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)) return false;
  return true;
};
@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Events) private eventsRepository: Repository<Events>,
    private readonly imageService: ImagesService,
  ) {}

  async getEvents(request, response): Promise<Events[]> {
    globalThis.Logger.log({ level: 'info', message: 'Get events ' });
    const events = await this.eventsRepository
      .createQueryBuilder('events')
      .getMany();
    globalThis.Logger.log({
      level: 'info',
      message: 'Get Events Response ' + JSON.stringify(events),
    });
    return response.status(200).json(events);
  }

  async getSingleEvent(request, response): Promise<Events[]> {
    const { id } = request.params;
    globalThis.Logger.log({ level: 'info', message: 'Get event ' + id });
    const event = await this.eventsRepository
      .createQueryBuilder('events')
      .where('events.id = :id', { id })
      .getOne();
    globalThis.Logger.log({
      level: 'info',
      message: 'Get Event Response ' + JSON.stringify(event),
    });
    return response.status(200).json(event);
  }

  public async createEvent(files, request, response): Promise<Events[]> {
    const { title, location, date, time, price, description } = request.body;

    // type check all NOT Nullable
    let mustInclude = [];
    if (!title) mustInclude.push('title');
    if (!location) mustInclude.push('location');
    if (!date) mustInclude.push('date');
    // only run the validate functions if date exists
    else {
      // type check date and time
      if (!validateDate(date))
        mustInclude.push('date must be proper format: DD/MM/YYYY');
    }
    if (!time) mustInclude.push('time');
    // only run the validate functions if date exists
    else {
      // type check date and time
      if (!validateTime(time))
        mustInclude.push('time must be proper format: HH:MM');
    }

    if (mustInclude.length > 0)
      return response.status(400).json({
        error:
          'You must include these BODY parameters: ' +
          JSON.stringify(mustInclude),
      });

    const newEvent = new Events();

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
      newEvent.image = uploadImages;
    }

    newEvent.title = title !== null ? title : '';
    newEvent.location = location !== null ? location : '';
    newEvent.date = date !== null ? date : '';
    newEvent.time = time !== null ? time : '';
    newEvent.price = price !== null ? price : '';
    newEvent.description = description !== null ? description : '';

    globalThis.Logger.log({ level: 'info', message: 'New Event' });
    globalThis.Logger.log({ level: 'info', message: JSON.stringify(newEvent) });

    // try {
    const data = await this.eventsRepository.save(newEvent);
    globalThis.Logger.log({
      level: 'info',
      message: 'New Event Response ' + JSON.stringify(data),
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

  public async updateEvent(files, request, response): Promise<Events[]> {
    const { title, location, date, time, price, description } = request.body;
    const { id } = request.params;
    const updatedEvent = new Events();

    // type check all NOT Nullable
    let mustInclude = [];
    if (title != undefined) updatedEvent.title = title;
    if (location != undefined) updatedEvent.location = location;
    if (date != undefined) {
      // type check date
      if (!validateDate(date))
        mustInclude.push('date must be proper format: DD/MM/YYYY');
      updatedEvent.date = date;
    }
    if (time != undefined) {
      //type check time
      if (!validateTime(time))
        mustInclude.push('time must be proper format: HH:MM');
      updatedEvent.time = time;
    }

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
      updatedEvent.image = uploadImages;
    }

    if (price != undefined) updatedEvent.price = price;
    if (description != undefined) updatedEvent.description = description;

    if (mustInclude.length > 0)
      return response.status(400).json({
        error:
          'These were the issues with your BODY parameters: ' +
          JSON.stringify(mustInclude),
      });

    globalThis.Logger.log({ level: 'info', message: 'Update Event' });
    globalThis.Logger.log({
      level: 'info',
      message: JSON.stringify(updatedEvent),
    });

    const data = await this.eventsRepository.update({ id }, updatedEvent);
    const event = await this.eventsRepository
      .createQueryBuilder('events')
      .where('events.id = :id', { id })
      .getOne();
    globalThis.Logger.log({
      level: 'info',
      message: 'Updated Event Response ' + JSON.stringify(data),
    });
    return response.status(200).json(event);
  }

  async deleteEvent(request, response): Promise<Events[]> {
    const { id } = request.params;
    globalThis.Logger.log({ level: 'info', message: 'Remove event ' + id });
    const event = await this.eventsRepository.delete({ id });
    globalThis.Logger.log({
      level: 'info',
      message: 'Remove Event Response ' + JSON.stringify(event),
    });
    return response.status(200).json(event);
  }
}
