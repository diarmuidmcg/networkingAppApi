import { BaseEntity } from 'src/BaseEntity';
import { Entity, Column, OneToMany, JoinColumn } from 'typeorm';

@Entity('events')
export class Events extends BaseEntity {
  @Column({ type: 'varchar', length: 150, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  location: string;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @Column({ type: 'timestamptz', nullable: false })
  time: Date;

  @Column({ type: 'varchar', length: 150, nullable: true })
  price: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
