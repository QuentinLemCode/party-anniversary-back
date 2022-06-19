import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { Music } from '../music.entity';
import { SpotifyApiService } from '../spotify/spotify-api.service';
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

  onModuleInit() {
    this.orderNext();
  }

  async push(music: Music, userId: number) {
    const isQueueEmpty = await this.isQueueEmpty();
    let queue = new Queue();
    queue.music = music;
    queue.userId = userId;
    queue = await this.queue.save(queue);
    if (isQueueEmpty) {
      await this.orderNext();
    }
    return queue;
  }

  get() {
    return this.getPendingQueue();
  }

  delete(queue: Queue) {
    return this.queue.remove([queue]);
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

  private async isQueueEmpty() {
    const queue = await this.getPendingQueue(1);
    return queue.length === 0;
  }

  private async orderNext(timeout?: number) {
    const queue = await this.pop();
    if (queue && this.spotify.isAccountRegistered()) {
      await this.spotify.addToQueue(queue.music.uri);
      this.setTimeout(queue, timeout);
    }
  }

  private async setTimeout(queue: Queue, timeout?: number) {
    if (!timeout) {
      timeout = await this.getCheckTimeFromCurentPlaybackState();
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
    currentMusic?: CurrentPlaybackResponse,
  ) {
    if (!currentMusic) {
      currentMusic = await this.spotify.getPlaybackState();
    }
    return (
      (currentMusic.item?.duration_ms ?? 0) -
      (currentMusic.progress_ms ?? 0) +
      1000
    );
  }

  private readonly checkCurrentStateAndOrderNext = async (queue: Queue) => {
    const currentMusic = await this.spotify.getPlaybackState();
    const timeout = await this.getCheckTimeFromCurentPlaybackState(
      currentMusic,
    );
    let state: string;
    if (currentMusic.item?.uri === queue.music.uri) {
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
