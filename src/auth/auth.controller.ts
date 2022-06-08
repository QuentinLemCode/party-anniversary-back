import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LocalGuard } from './local.guard';

@Controller()
export class AuthController {
  constructor(private auth: AuthService) {}

  @UseGuards(LocalGuard)
  @Post('auth/login')
  async login(@Req() req: Request) {
    return this.auth.login(req.user);
  }
}
