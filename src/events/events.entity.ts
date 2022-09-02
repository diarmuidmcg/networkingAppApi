import { BaseEntity } from 'src/BaseEntity';
import {
  Entity,
  Column,
  OneToMany,
  ManyToMany,
  ManyToOne,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { Image } from 'src/images/image.entity';
import { Users } from 'src/users/users.entity';
@Entity('events')
export class Events extends BaseEntity {
  @Column({ type: 'varchar', length: 150, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  location: string;

  @Column({ type: 'varchar', nullable: true })
  date: string;

  @Column({ type: 'varchar', nullable: true })
  time: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  price: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Image, (image) => image.event, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  image: Image[];

  @ManyToOne(() => Users, (user) => user.hosted_events, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  host: Users;

  @ManyToMany(() => Users, (user) => user.attended_events, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'event_attendees', // table name for the junction table of this relation
    joinColumn: {
      name: 'event',
      referencedColumnName: 'id',
    },
  })
  attendees: Users[];
}
