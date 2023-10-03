import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [AuthenticationController],
  imports: [UserModule],
})
export class IamModule {}
