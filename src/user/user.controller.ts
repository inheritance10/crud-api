// user.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { Users } from './users.model';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() user: Users): Promise<Users> {
    return this.userService.register(user);
  }

  @Post('login')
  async login(@Body() user: Users): Promise<{ accessToken: string, refreshtoken: string }> {
    return this.userService.login(user);
  }
}
