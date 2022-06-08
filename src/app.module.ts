import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from 'process';
import { SpotifyApiService } from './external/spotify-api/spotify-api.service';
import { MusicController } from './music/music.controller';
import { UserController } from './user/user.controller';
import { User } from './user/user.entity';
import { UserService } from './user/user.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: env.DATABASE_HOST || 'localhost',
      port: env.DATABASE_PORT ? Number.parseInt(env.DATABASE_PORT, 10) : 3306,
      username: env.DATABASE_USER || 'admin',
      password: env.DATABASE_PASSWORD || 'password',
      database: env.DATABASE_NAME || 'party-anniversary',
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
