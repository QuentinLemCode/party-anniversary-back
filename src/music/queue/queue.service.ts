import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { User } from '../../users/user.entity';
import { Music } from '../music.entity';
import { Queue, Status } from './queue.entity';

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(Queue) private readonly queue: Repository<Queue>,
  ) {}

  private readonly logger = new Logger('Queue');

  async push(music: Music, userId: number) {
    const alreadyInQueue = await this.findInQueue(music.uri);
    if (alreadyInQueue) {
      throw new BadRequestException({ cause: 'queue' });
    }
    let queue = new Queue();
    queue.music = music;
    queue.userId = userId;
    queue = await this.queue.save(queue);
    return queue;
  }

  findInQueue(uri: string) {
    return this.queue
      .createQueryBuilder('queue')
      .leftJoinAndSelect('queue.music', 'music')
      .where('music.uri = :uri', { uri })
      .getOne();
  }

  get() {
    return this.queue
      .createQueryBuilder('queue')
      .leftJoinAndSelect('queue.music', 'music')
      .leftJoinAndSelect('queue.user', 'user')
      .loadRelationCountAndMap(
        'queue.forward_votes',
        'queue.forward_vote_users',
      )
      .select(['queue.status', 'music', 'user.name', 'queue.id'])
      .where('queue.status = "0"')
      .orWhere('queue.status = "1"')
      .orderBy('queue.status', 'DESC')
      .addOrderBy('queue.updated_at', 'ASC')
      .getMany();
  }

  async delete(queueOrId: Queue | string | number) {
    if (typeof queueOrId === 'string' || typeof queueOrId === 'number') {
      const queue = await this.queue.findOneBy({ id: +queueOrId });
      if (!queue) {
        throw new NotFoundException('Queue not found');
      }
      queueOrId = queue;
    }
    queueOrId.status = Status.CANCELLED;
    await this.queue.save(queueOrId);
    return this.queue.softRemove(queueOrId);
  }

  async vote(queueOrId: Queue | string | number, user: User) {
    let queue: Queue;
    if (typeof queueOrId === 'string' || typeof queueOrId === 'number') {
      [queue] = await this.queue.find({
        where: { id: +queueOrId },
        relations: ['forward_vote_users'],
      });
    } else {
      queue = queueOrId;
    }
    if (queue.forward_vote_users?.find((u) => u.id === user.id)) {
      throw new BadRequestException('You already voted for this music');
    }
    queue.forward_vote_users = [...(queue.forward_vote_users ?? []), user];
    await this.queue.save(queue);
    return queue;
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
        updated_at: 'DESC',
      },
      take,
      where: { status: Raw("'0'") },
      relations: ['music'],
    });
  }

  public async getPlayingQueue(): Promise<Queue | null> {
    const [queue, ...anothers] = await this.queue.find({
      where: { status: Raw("'1'") },
      relations: ['music'],
    });
    if (anothers.length > 0) {
      this.queue.remove(anothers);
    }
    return queue || null;
  }

  private async isQueueEmpty() {
    const queue = await this.getPendingQueue(1);
    return queue.length === 0;
  }

  public async setPlaying(queue: Queue) {
    queue.status = Status.FINISHED;
    await this.queue.save(queue);
  }
}
