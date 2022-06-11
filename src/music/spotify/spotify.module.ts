import { Module } from '@nestjs/common';
import { SpotifyApiService } from './spotify-api.service';

@Module({
  providers: [SpotifyApiService],
})
export class SpotifyModule {}
