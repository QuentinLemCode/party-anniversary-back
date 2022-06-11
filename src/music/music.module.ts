import { Module } from '@nestjs/common';
import { MusicController } from './music.controller';
import { SpotifyModule } from './spotify/spotify.module';

@Module({
  imports: [SpotifyModule],
  controllers: [MusicController],
})
export class MusicModule {}
