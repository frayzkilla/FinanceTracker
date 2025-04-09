import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Post('adduser')
  async createUser(@Body() addUserDto: { email: string; password: string }) {
    try {
      const newUser = new User();
      newUser.email = addUserDto.email;
      newUser.password = addUserDto.password;

      const createdUser = await this.userService.create(newUser);
      return {
        status: 'success',
        data: {
          id: createdUser.id,
          email: createdUser.email,
        },
      };
    } catch (error) {
      if (error.code === '23505') {
        return {
          status: 'error',
          message: 'User with this email already exists',
        };
      }
      return {
        status: 'error',
        message: 'Internal server error' + error,
      };
    }
  }
}
