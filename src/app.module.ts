import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MusicController } from './music/music.controller';
import { SpotifyApiService } from './external/spotify-api/spotify-api.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  controllers: [AppController, MusicController],
  providers: [AppService, SpotifyApiService],
})
export class AppModule {}
