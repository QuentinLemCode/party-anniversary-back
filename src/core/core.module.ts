import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from 'process';
import { jwtConstants } from './core.constant';
import DatabaseLogger from './database.logger';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '180m' },
    }),
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
      logger: new DatabaseLogger(),
    }),
    ScheduleModule.forRoot(),
  ],
  exports: [JwtModule, HttpModule, ConfigModule, TypeOrmModule, ScheduleModule],
})
export class CoreModule {}
