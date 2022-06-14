import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { getClientIp } from '@supercharge/request-ip';
import { AuthService } from '../auth/auth.service';
import { RegisterUserDTO } from './users.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private users: UsersService, private auth: AuthService) {}

  @Post('register')
  @HttpCode(204)
  async register(
    @Body() registerUserDTO: RegisterUserDTO,
    @Req() request: Request,
  ) {
    const ip = getClientIp(request);
    if (!ip) {
      throw new BadRequestException('Unable to retrieve IP adress');
    }
    const user = await this.users.register(registerUserDTO, ip);
    return this.auth.login(user);
  }
}
