import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';


@Injectable()
export class UsersService {
  //   private readonly users = [
  //     {
  //       userId: 1,
  //       username: 'john',
  //       password: 'changeme',
  //     },
  //     {
  //       userId: 2,
  //       username: 'maria',
  //       password: 'guess',
  //     },
  //   ];

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async create(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }
}
