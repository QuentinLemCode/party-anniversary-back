import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SpotifyApiService } from './external/spotify-api/spotify-api.service';
import { MusicController } from './music/music.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: './database/db.sql',
    }),
  ],
  controllers: [MusicController],
  providers: [SpotifyApiService],
})
export class AppModule {}
