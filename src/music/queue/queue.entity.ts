import {
  BeforeInsert,
  BeforeSoftRemove,
  BeforeUpdate,
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Music } from '../music.entity';

export enum Status {
  PENDING,
  PLAYING,
  FINISHED,
  CANCELLED,
}

@Entity()
export class Queue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status: Status = Status.PENDING;

  @ManyToOne(() => Music, (music) => music.queue, { cascade: true })
  music: Music;

  @BeforeUpdate()
  updateDates() {
    this.updated_at = new Date();
  }

  @BeforeInsert()
  insertDates() {
    this.updated_at = new Date();
    this.created_at = new Date();
  }

  @Column({
    type: 'datetime',
  })
  public created_at: Date;

  @Column({
    type: 'datetime',
  })
  public updated_at: Date;

  @BeforeSoftRemove()
  updateStatus() {
    this.status = Status.CANCELLED;
  }

  @DeleteDateColumn({
    precision: null,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  deleted_at: Date;

  play() {
    this.status = Status.PLAYING;
  }

  finish() {
    this.status = Status.FINISHED;
  }

  isPlaying() {
    return this.status === Status.PLAYING;
  }

  isFinished() {
    return this.status === Status.FINISHED;
  }

  isCancelled() {
    return this.status === Status.CANCELLED;
  }

  isPending() {
    return this.status === Status.PENDING;
  }
}
