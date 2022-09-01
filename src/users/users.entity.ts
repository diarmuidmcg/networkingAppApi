import { BaseEntity } from 'src/BaseEntity';
import { Entity, Column, OneToMany, ManyToMany, JoinColumn } from 'typeorm';
import { Image } from 'src/images/image.entity';
import { Events } from 'src/events/events.entity';
@Entity('users')
export class Users extends BaseEntity {
  // separated these out incase we want to only diplay first name at some stage
  @Column({ type: 'varchar', length: 150, nullable: false })
  first_name: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  last_name: string;

  // dont want to set a limit in case its an apple relay thats super long
  @Column({ type: 'text', nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  phone_number: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  occupation: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  linkedin_username: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  instagram_username: string;

  @OneToMany(() => Image, (image) => image.user, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  image: Image[];

  @OneToMany(() => Events, (event) => event.host, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  hosted_events: Events[];

  @ManyToMany(() => Events, (event) => event.attendees, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  attended_events: Events[];
}
