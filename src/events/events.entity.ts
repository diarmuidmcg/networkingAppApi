import { BaseEntity } from 'src/BaseEntity';
import { Entity, Column, OneToMany, JoinColumn } from 'typeorm';
import { Image } from 'src/images/image.entity';
@Entity('events')
export class Events extends BaseEntity {
  @Column({ type: 'bytea',  nullable: true })
  image: Uint8Array;

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
}
