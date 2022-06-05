import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RegisterUserDTO } from './user.interface';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private users: Repository<User>) {}

  find(name: string) {
    return this.users.findOne({ where: { name } });
  }

  register(registerDTO: RegisterUserDTO, ip: string) {
    const user = this.users.create();
    user.name = registerDTO.name;
    user.ip = ip;
    return this.users.save(user);
  }
}
