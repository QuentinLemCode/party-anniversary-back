import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Music } from '../music.entity';
import { Queue } from './queue.entity';

@Injectable()
export class QueueService {
  constructor(@InjectRepository(Queue) private queue: Repository<Queue>) {}

  addToQueue(music: Music) {
    const queue = new Queue();
    queue.music = music;
    return this.queue.save(queue);
  }

  getQueue() {
    return this.queue.find({
      order: {
        updated_at: 'ASC',
      },
      relations: ['music'],
    });
  }
}
