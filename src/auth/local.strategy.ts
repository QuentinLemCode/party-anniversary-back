import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import * as requestIp from 'request-ip';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private auth: AuthService) {
    super({
      passReqToCallback: true,
      usernameField: 'name',
      passwordField: 'name',
    });
  }

  async validate(request: Request, name: string, challenge: string) {
    const ip = requestIp.getClientIp(request) || request.ip;
    if (!ip) {
      throw new BadRequestException('No adress ip received');
    }
    const password = request.body.password;
    const user = await this.auth.validateUser(name, ip, password, challenge);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
}
