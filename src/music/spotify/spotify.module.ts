import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpotifyAccount } from './spotify-account.entity';
import { SpotifyApiService } from './spotify-api.service';

@Module({
  providers: [SpotifyApiService],
  imports: [TypeOrmModule.forFeature([SpotifyAccount]), HttpModule],
  exports: [SpotifyApiService],
})
export class SpotifyModule {}
