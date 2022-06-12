import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hashPassword } from '../utils/hash';
import { User } from './user.entity';
import { RegisterUserDTO } from './users.interface';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private users: Repository<User>) {}

  find(name: string) {
    return this.users.findOne({ where: { name } });
  }

  findById(id: number) {
    return this.users.findOneBy({ id });
  }

  // TODO return a token when registered
  register(registerDTO: RegisterUserDTO, ip: string) {
    const user = this.users.create();
    user.name = registerDTO.name;
    user.ip = ip;
    user.challenge = hashPassword(registerDTO.challenge, user.salt);
    return this.users.save(user);
  }
}
