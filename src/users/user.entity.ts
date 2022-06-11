import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 1,
  USER = 0,
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  name: string;

  @Column({ nullable: true })
  @Index({ unique: true })
  ip: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({
    type: 'bool',
    default: false,
  })
  noIPverification: boolean;
}
