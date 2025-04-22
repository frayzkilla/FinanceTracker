import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(
    email: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    try {
          const newUser = new User();
          newUser.email = email;
          newUser.password = pass;
    
          const createdUser = await this.usersService.create(newUser);
          const payload = { sub: createdUser.id, username: createdUser.email };
          return {
            access_token: await this.jwtService.signAsync(payload),
          };
        } catch (error) {
          if (error.code === '23505') {
            throw new UnauthorizedException('User already exists');
          } 
          throw new UnauthorizedException('Internal server error' + error);
        }
  }
}