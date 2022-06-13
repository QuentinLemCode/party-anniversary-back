import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { RealIP } from 'nestjs-real-ip';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private auth: AuthService) {
    super({
      passReqToCallback: true,
      usernameField: 'name',
      passwordField: 'name',
    });
  }

  async validate(
    request: Request,
    name: string,
    challenge: string,
    @RealIP() ip: string,
  ) {
    this.logger.log(ip);
    this.logger.log(request.ips);
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
