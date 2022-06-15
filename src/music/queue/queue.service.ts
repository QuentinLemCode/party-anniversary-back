import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, Raw, Repository } from 'typeorm';
import { Music } from '../music.entity';
import { Queue, Status } from './queue.entity';

@Injectable()
export class QueueService {
  constructor(@InjectRepository(Queue) private queue: Repository<Queue>) {}

  push(music: Music) {
    const queue = new Queue();
    queue.music = music;
    return this.queue.save(queue);
  }

  get() {
    return this.getPendingQueue();
  }

  async pop() {
    const queue = await this.getPendingQueue(1);
    if (queue.length === 0) {
      return null;
    }
    const [first] = queue;
    first.status = Status.PLAYING;
    return this.queue.save(first);
  }

  private getPendingQueue(take = 50) {
    return this.queue.find({
      order: {
        updated_at: 'ASC',
      },
      take,
      where: { status: Raw("'0'") },
      relations: ['music'],
    });
  }
}
