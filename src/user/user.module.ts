import { ClassProvider, Module } from '@nestjs/common';
import { InMemoryUserRepository } from './user.in-memory.repository';
import { USER_REPOSITORY } from './user.constants';
import { UserService } from './user.service';
import { PaymentCustomerModule } from '../payment-customer/payment-customer.module';
import { UserController } from './user.controller';

const userRepository: ClassProvider = {
  provide: USER_REPOSITORY,
  useClass: InMemoryUserRepository,
};

@Module({
  providers: [userRepository, UserService],
  imports: [PaymentCustomerModule],
  exports: [UserService, userRepository],
  controllers: [UserController],
})
export class UserModule {}
