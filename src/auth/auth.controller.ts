import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../users/user.entity';
import { UserLogin } from './auth.interface';
import { AuthService } from './auth.service';
import { LocalGuard } from './local.guard';

@Controller()
export class AuthController {
  constructor(private auth: AuthService) {}

  @UseGuards(LocalGuard)
  @Post('auth/login')
  async login(@Req() req: Request): Promise<UserLogin> {
    return this.auth.login(req.user as unknown as User);
  }
}
