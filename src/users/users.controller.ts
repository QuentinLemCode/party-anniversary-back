import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { RegisterUserDTO } from './users.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Post('register')
  @HttpCode(204)
  register(@Body() registerUserDTO: RegisterUserDTO, @Req() request: Request) {
    const ip = request.clientIp;
    if (!ip) {
      throw new BadRequestException('Unable to retrieve IP adress');
    }
    return this.users.register(registerUserDTO, ip);
  }
}
