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
import { getClientIp } from '@supercharge/request-ip';
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

  async validate(request: Request, name: string, challenge: string) {
    const ip = getClientIp(request);
    this.logger.log(ip);
    this.logger.log(
      Object.entries(request.headers)
        .map((head) => head.join('-'))
        .join(' / '),
    );
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
