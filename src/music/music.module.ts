import { Module } from '@nestjs/common';
import { MusicController } from './music.controller';
import { SpotifyModule } from './spotify/spotify.module';
import { QueueService } from './queue/queue.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Music } from './music.entity';
import { Queue } from './queue/queue.entity';
import { QueueController } from './queue/queue.controller';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [
    SpotifyModule,
    TypeOrmModule.forFeature([Music, Queue]),
    CoreModule,
  ],
  controllers: [MusicController, QueueController],
  providers: [QueueService],
})
export class MusicModule {}
