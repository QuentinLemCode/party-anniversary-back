import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from 'process';
import { jwtConstants } from './core.constant';

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
    }),
  ],
  exports: [JwtModule, HttpModule, ConfigModule, TypeOrmModule],
})
export class CoreModule {}
