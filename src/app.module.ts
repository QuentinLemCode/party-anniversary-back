import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { CoreModule } from './core/core.module';
import { MusicModule } from './music/music.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, UsersModule, MusicModule, CoreModule],
  controllers: [],
  providers: [AuthService],
})
export class AppModule {}
