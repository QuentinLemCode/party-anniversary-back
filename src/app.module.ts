import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from 'process';
import { AuthModule } from './auth/auth.module';
import { MusicModule } from './music/music.module';
import { UsersModule } from './users/users.module';

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
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    MusicModule,
  ],
  controllers: [],
})
export class AppModule {}
