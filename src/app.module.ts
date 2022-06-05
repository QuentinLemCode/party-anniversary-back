import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SpotifyApiService } from './external/spotify-api/spotify-api.service';
import { MusicController } from './music/music.controller';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  controllers: [MusicController],
  providers: [SpotifyApiService],
})
export class AppModule {}
