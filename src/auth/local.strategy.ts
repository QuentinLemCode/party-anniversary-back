import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private auth: AuthService, private moduleRef: ModuleRef) {
    super({
      passReqToCallback: true,
      usernameField: 'name',
      passwordField: 'name',
    });
  }

  async validate(request: Request, name: string) {
    const ip = request.ip;
    const user = await this.auth.validateUser(name, ip);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
