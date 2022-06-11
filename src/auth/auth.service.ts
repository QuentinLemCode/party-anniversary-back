import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User, UserRole } from '../users/user.entity';
import { hashPassword } from '../utils/hash';
import { UserLogin } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async validateUser(
    name: string,
    ip: string,
    password?: string,
    challenge?: string,
  ) {
    const user = await this.users.find(name);
    if (user?.role === UserRole.ADMIN) {
      if (!password) {
        throw new ForbiddenException({ cause: 'password' });
      }
      if (password && hashPassword(password, user?.salt) === user?.password) {
        return user;
      } else {
        throw new ForbiddenException({ cause: 'password' });
      }
    }
    if (user?.noIPverification && !challenge) {
      throw new ForbiddenException({ cause: 'challenge' });
    }
    if (user?.ip === ip) {
      return user;
    }
    return null;
  }

  async login(user: User): Promise<UserLogin> {
    const payload = { username: user.name, sub: user.id };
    const token = this.jwt.sign(payload);
    const expirationTimestamp = (
      this.jwt.decode(token, { complete: true }) as any
    )?.payload?.exp;
    return {
      access_token: token,
      id: user.id,
      expires_at: expirationTimestamp,
      username: user.name,
      role: user.role === UserRole.ADMIN ? 'admin' : 'user',
    };
  }
}
