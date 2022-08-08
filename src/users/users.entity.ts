import { BaseEntity } from 'src/BaseEntity';
import { Entity, Column, OneToMany, JoinColumn } from 'typeorm';

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
}
