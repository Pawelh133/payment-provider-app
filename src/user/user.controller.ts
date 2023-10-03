import { Controller, Get } from '@nestjs/common';
import { UserResult } from './result/user.result';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  async listCustomers(): Promise<UserResult[]> {
    return await this.userService.getUsers();
  }
}
