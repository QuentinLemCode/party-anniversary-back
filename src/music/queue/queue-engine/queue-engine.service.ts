import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { setTimeout } from 'timers';
import { User, UserRole } from '../../../users/user.entity';
import { SpotifyApiService } from '../../spotify/spotify-api/spotify-api.service';
import { CurrentPlaybackResponse } from '../../spotify/types/spotify-interfaces';
import { VoteSettingsService } from '../../vote-settings/vote-settings.service';
import { Queue } from '../queue.entity';
import { QueueService } from '../queue.service';

@Injectable()
export class QueueEngineService {
  private _isRunning = false;
  get isRunning() {
    return this._isRunning;
  }

  private set isRunning(value: boolean) {
    this._isRunning = value;
  }

  constructor(
    private readonly spotify: SpotifyApiService,
    private readonly queues: QueueService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly voteSettings: VoteSettingsService,
  ) {}

  private readonly logger = new Logger('SpotifyQueue');
  private readonly SCHEDULER_NAME = 'music-status';

  async start() {
    const queue = await this.queues.pop();
    if (!queue || !this.spotify.isAccountRegistered()) {
      return;
    }
    await this.spotify.play(queue.music.uri);
    await this.queues.setPlaying(queue);
    // we wait a bit for the music launch
    setTimeout(() => this.setTimeout(queue), 5000);
    this.isRunning = true;
  }

  stop() {
    this.deleteCheckTimeout();
    this.isRunning = false;
  }

  async forward(queueOrId: Queue | string | number, user: User) {
    const queue = await this.queues.vote(queueOrId, user);
    const voteCount = queue.forward_vote_users.length;
    if (
      voteCount >= this.voteSettings.maxVotes ||
      user.role === UserRole.ADMIN
    ) {
      await this.next(queue);
    }
  }

  async next(queue?: Queue | null) {
    if (!queue) {
      queue = await this.queues.pop();
      if (queue === null) {
        this.stop();
        return;
      }
    }
    this.deleteCheckTimeout();
    await this.spotify.addToQueue(queue.music.uri);
    await this.spotify.skipToNext();
    await this.queues.setPlaying(queue);
    this.setTimeout(queue);
  }

  private deleteCheckTimeout() {
    if (this.schedulerRegistry.doesExist('timeout', this.SCHEDULER_NAME)) {
      this.schedulerRegistry.deleteTimeout(this.SCHEDULER_NAME);
    }
  }

  private calculateWhenNextSongBegin(currentMusic: CurrentPlaybackResponse) {
    return (
      (currentMusic.item?.duration_ms ?? 0) -
      (currentMusic.progress_ms ?? 0) +
      1000
    );
  }

  private async addNextToQueue(timeout?: number) {
    const queue = await this.queues.pop();
    if (!queue || !this.spotify.isAccountRegistered()) {
      return;
    }
    await this.spotify.addToQueue(queue.music.uri);
    return this.setTimeout(queue, timeout);
  }

  private async setTimeout(queue: Queue, timeout?: number) {
    const playState = await this.spotify.getPlaybackState();
    if (!playState.registered) return this.stop();

    if (!timeout) {
      timeout = this.calculateWhenNextSongBegin(playState.currentPlayback);
    }
    this.deleteCheckTimeout();
    const checkTimeout = setTimeout(
      () => this.checkPlaybackState(queue),
      timeout,
    );
    this.schedulerRegistry.addTimeout('music-status', checkTimeout);
    this.logger.log(
      `Added ${queue.music.toString()} to the spotify playlist. State will be checked in ${(
        timeout / 1000
      ).toFixed()} seconds`,
    );
  }

  private readonly checkPlaybackState = async (queue: Queue) => {
    const playState = await this.spotify.getPlaybackState();
    if (!playState.registered || !playState.currentPlayback.is_playing)
      return this.stop();

    const currentMusic = playState.currentPlayback;
    const timeout = this.calculateWhenNextSongBegin(currentMusic);
    let state: string;
    if (currentMusic.item?.uri === queue.music.uri) {
      await this.queues.setPlaying(queue);
      await this.addNextToQueue(timeout);
      state = `Currently playing ${queue.music.toString()} - adding next to queue : ${queue.music.toString()}`;
    } else {
      await this.spotify.addToQueue(queue.music.uri);
      await this.setTimeout(queue, timeout);
      state =
        'not playing - put the song again and waiting for the current music to finish';
    }
    this.logger.log(`State for ${queue.music.title} : ${state}`);
  };
}
