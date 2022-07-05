import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from '../core/core.module';
import { MusicController } from './music.controller';
import { Music } from './music.entity';
import { QueueController } from './queue/queue.controller';
import { Queue } from './queue/queue.entity';
import { SpotifyModule } from './spotify/spotify.module';
import { VoteSettings } from './vote-settings/vote-settings.entity';
import { VoteSettingsService } from './vote-settings/vote-settings.service';
import { VoteSettingsController } from './vote-settings/vote-settings.controller';
import { QueueEngineService } from './queue/queue-engine/queue-engine.service';
import { QueueService } from './queue/queue.service';

@Module({
  imports: [
    SpotifyModule,
    TypeOrmModule.forFeature([Music, Queue, VoteSettings]),
    CoreModule,
  ],
  controllers: [MusicController, QueueController, VoteSettingsController],
  providers: [QueueService, VoteSettingsService, QueueEngineService],
})
export class MusicModule {}
