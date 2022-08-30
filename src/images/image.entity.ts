import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from 'src/BaseEntity';

import { Users } from 'src/users/users.entity';
import { Events } from 'src/events/events.entity';

@Entity({ name: 'images' })
export class Image extends BaseEntity {
  @Column({ name: 'url' })
  url: string;

  @Column()
  public key: string;

  @ManyToOne(() => Users, (user) => user.image, {
    onDelete: 'CASCADE',
  })
  user: Users;

  @ManyToOne(() => Events, (event) => event.image, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  event: Events;
}
