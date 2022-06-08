import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UserLogin } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async validateUser(name: string, ip: string) {
    const user = await this.users.find(name);
    if (user && user.ip === ip) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { ip, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any): Promise<UserLogin> {
    const payload = { username: user.name, sub: user.id };
    return { access_token: this.jwt.sign(payload) };
  }
}
