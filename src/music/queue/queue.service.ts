import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { User } from '../../users/user.entity';
import { Music } from '../music.entity';
import { SpotifyApiService } from '../spotify/spotify-api/spotify-api.service';
import { CurrentPlaybackResponse } from '../spotify/types/spotify-interfaces';
import { Queue, Status } from './queue.entity';

@Injectable()
export class QueueService implements OnModuleInit {
  constructor(
    @InjectRepository(Queue) private readonly queue: Repository<Queue>,
    private readonly spotify: SpotifyApiService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  private readonly logger = new Logger('Queue');
  private readonly SCHEDULER_NAME = 'music-status';

  private waitingForNext = false;

  async onModuleInit() {
    const isQueueEmpty = await this.isQueueEmpty();
    const playingQueue = await this.getPlayingQueue();
    if ((!isQueueEmpty || playingQueue) && this.spotify.isAccountRegistered()) {
      await this.orderNext();
    }
  }

  async push(music: Music, userId: number) {
    const isQueueEmpty = await this.isQueueEmpty();
    let queue = new Queue();
    queue.music = music;
    queue.userId = userId;
    queue = await this.queue.save(queue);
    if (isQueueEmpty && !this.waitingForNext) {
      await this.orderNext();
    }
    return queue;
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

  delete(queueOrId: Queue | string | number) {
    if (typeof queueOrId === 'string' || typeof queueOrId === 'number') {
      return this.queue.softRemove([{ id: +queueOrId }]);
    } else {
      return this.queue.softRemove([queueOrId]);
    }
  }

  async forward(queueOrId: Queue | string | number, user: User) {
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
  }

  private async pop() {
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

  private async getPlayingQueue(): Promise<Queue | null> {
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

  private async orderNext(timeout?: number) {
    const playingQueue = await this.getPlayingQueue();
    if (playingQueue) {
      return this.checkCurrentStateAndOrderNext(playingQueue);
    }
    const queue = await this.pop();
    if (queue && this.spotify.isAccountRegistered()) {
      await this.spotify.addToQueue(queue.music.uri);
      return this.setTimeout(queue, timeout);
    }
  }

  private async setTimeout(queue: Queue, timeout?: number) {
    const playState = await this.spotify.getPlaybackState();
    if (!playState.registered) {
      return;
    }
    if (!timeout) {
      timeout = await this.getCheckTimeFromCurentPlaybackState(
        playState.currentPlayback,
      );
    }
    if (this.schedulerRegistry.doesExist('timeout', this.SCHEDULER_NAME)) {
      this.schedulerRegistry.deleteTimeout(this.SCHEDULER_NAME);
    }
    const checkTimeout = setTimeout(
      () => this.checkCurrentStateAndOrderNext(queue),
      timeout,
    );
    this.schedulerRegistry.addTimeout('music-status', checkTimeout);
    this.logger.log(
      `Added ${queue.music.toString()} to the spotify playlist. State will be checked in ${(
        timeout / 1000
      ).toFixed()} seconds`,
    );
  }

  private async getCheckTimeFromCurentPlaybackState(
    currentMusic: CurrentPlaybackResponse,
  ) {
    return (
      (currentMusic.item?.duration_ms ?? 0) -
      (currentMusic.progress_ms ?? 0) +
      1000
    );
  }

  private readonly checkCurrentStateAndOrderNext = async (queue: Queue) => {
    const playState = await this.spotify.getPlaybackState();
    if (!playState.registered) {
      return;
    }
    const currentMusic = playState.currentPlayback;
    const timeout = await this.getCheckTimeFromCurentPlaybackState(
      currentMusic,
    );
    let state: string;
    if (currentMusic.item?.uri === queue.music.uri) {
      queue.status = Status.FINISHED;
      this.queue.save(queue);
      await this.orderNext(timeout);
      state = 'playing - next music will be put if queue not empty';
    } else {
      await this.spotify.addToQueue(queue.music.uri);
      await this.setTimeout(queue, timeout);
      state =
        'not playing - put the song again and waiting for the current music to finish';
    }
    this.logger.log(`State for ${queue.music.title} : ${state}`);
  };
}
