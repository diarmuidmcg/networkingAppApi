import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { time } from 'console';
import { title } from 'process';
// import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';
import { Events } from './events.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Events) private eventsRepository: Repository<Events>,
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

  public async createEvent(request, response): Promise<Events[]> {
    const {
      title,
      location,
      date,
      time,
      price,
      description,  
    } = request.body;
    const newEvent = new Events();
    newEvent.title = title !== null ? title : '';
    newEvent.location = location !== null ? location : '';
    newEvent.date = date !== null ? date : '';
    newEvent.time = time !== null ? time : '';
    newEvent.price = price !== null ? price : '';
    newEvent.description =
      description !== null ? description : '';
    

    globalThis.Logger.log({ level: 'info', message: 'New Event' });
    globalThis.Logger.log({ level: 'info', message: JSON.stringify(newEvent) });

    const data = await this.eventsRepository.save(newEvent);
    globalThis.Logger.log({
      level: 'info',
      message: 'New Event Response ' + JSON.stringify(data),
    });
    return response.status(200).json(data);
  }

  public async updateEvent(request, response): Promise<Events[]> {
    const {
        title,
        location,
        date,
        time,
        price,
        description,
    } = request.body;
    const { id } = request.params;
    const updatedEvent = new Events();
    updatedEvent.title = title !== null ? title : '';
    updatedEvent.location = location !== null ? location : '';
    updatedEvent.date = date !== null ? date : '';
    updatedEvent.time = time !== null ? time : '';
    updatedEvent.price = price !== null ? price : '';
    updatedEvent.description = description !== null ? description : '';


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
