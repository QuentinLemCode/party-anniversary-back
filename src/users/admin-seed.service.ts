import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';

@Injectable()
export class AdminSeedService implements OnApplicationBootstrap {
  constructor(@InjectRepository(User) private users: Repository<User>) {}
  async onApplicationBootstrap() {
    let admin = await this.users.findOneBy({ role: UserRole.ADMIN });
    if (!admin) {
      admin = this.users.create();
      admin.noIPverification = true;
      admin.password = process.env.DEFAULT_ADMIN_PASSWORD || 'admin';
      admin.name = 'admin';
      admin.role = UserRole.ADMIN;
      admin.salt = randomBytes(16).toString('base64');
      this.users.save(admin);
    }
  }
}
