import { BaseEntity } from 'src/BaseEntity';
import { Entity, Column, OneToMany, JoinColumn } from 'typeorm';

@Entity('users')
export class Users extends BaseEntity {
  @Column({ type: 'varchar', length: 150, nullable: false })
  title: String;

  @Column({ type: 'text', nullable: false, default: 'null' })
  content: String;
}
