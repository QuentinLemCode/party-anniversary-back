import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from '../core/core.module';
import { MusicController } from './music.controller';
import { Music } from './music.entity';
import { QueueController } from './queue/queue.controller';
import { Queue } from './queue/queue.entity';
import { QueueService } from './queue/queue.service';
import { SpotifyModule } from './spotify/spotify.module';
import { VoteSettings } from './vote-settings/vote-settings.entity';
import { VoteSettingsService } from './vote-settings/vote-settings.service';
import { VoteSettingsController } from './vote-settings/vote-settings.controller';

@Module({
  imports: [
    SpotifyModule,
    TypeOrmModule.forFeature([Music, Queue, VoteSettings]),
    CoreModule,
  ],
  controllers: [MusicController, QueueController, VoteSettingsController],
  providers: [QueueService, VoteSettingsService],
})
export class MusicModule {}
