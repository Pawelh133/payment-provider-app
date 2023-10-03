import { Body, Controller, Post } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UserService } from '../user/user.service';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly userService: UserService) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.userService.createUser(signUpDto);
  }
}
