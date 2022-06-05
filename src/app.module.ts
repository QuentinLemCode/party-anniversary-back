import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SpotifyApiService } from './external/spotify-api/spotify-api.service';
import { MusicController } from './music/music.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { User } from './user/user.entity';
import { env } from 'process';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: './database/db.sql',
      entities: [User],
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [MusicController, UserController],
  providers: [SpotifyApiService, UserService],
})
export class AppModule {}
