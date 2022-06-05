import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { RegisterUserDTO } from './user.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private users: UserService) {}

  @Post('register')
  @HttpCode(204)
  register(@Body() registerUserDTO: RegisterUserDTO, @Req() request: Request) {
    const ip = request.ip;
    return this.users.register(registerUserDTO, ip);
  }
}
