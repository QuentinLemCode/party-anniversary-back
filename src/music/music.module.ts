import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from '../core/core.module';
import { MusicController } from './music.controller';
import { Music } from './music.entity';
import { QueueController } from './queue/queue.controller';
import { Queue } from './queue/queue.entity';
import { QueueService } from './queue/queue.service';
import { SpotifyModule } from './spotify/spotify.module';

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
