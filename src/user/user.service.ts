import { Inject, Injectable } from '@nestjs/common';
import { InMemoryUserRepository } from './user.in-memory.repository';
import { USER_REPOSITORY } from './user.constants';
import { UserEntity } from './user.repository';
import { PaymentCustomerService } from '../payment-customer/payment-customer.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PaymentCustomerStatus } from '../payment-customer/payment-customer.repository';
import { UserResult } from './result/user.result';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: InMemoryUserRepository,
    private readonly paymentCustomer: PaymentCustomerService,
  ) {}

  async createUser(user: CreateUserDto): Promise<UserEntity> {
    const userExists = this.getUser(user.email);

    if (!userExists) {
      const userEntity: UserEntity = {
        id: (await this.getUsersTotalCount()) + 1,
        email: user.email,
        paymentCustomer: await this.paymentCustomer.createCustomer(user.email),
      };

      return this.userRepository.createUser(userEntity);
    }
  }

  async updateUser(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.updateUser(user);
  }

  async getUser(email: string): Promise<UserEntity> {
    return this.userRepository.getUser(email);
  }

  async getUsers(): Promise<UserResult[]> {
    return (await this.userRepository.getUsers()).map((userItem) => ({
      email: userItem.email,
      paymentStatus: userItem.paymentCustomer.status,
    }));
  }

  async getUsersTotalCount(): Promise<number> {
    return this.userRepository.getUsersTotalCount();
  }

  async setUserPaymentStatus(
    customerId: string,
    status: PaymentCustomerStatus,
  ): Promise<UserEntity> {
    const user = await this.getUserByCustomerId(customerId);

    if (user) {
      const result: UserEntity = {
        ...user,
        paymentCustomer: { ...user.paymentCustomer, status },
      };

      return this.userRepository.updateUser(result);
    }
  }

  async getUserByCustomerId(customerId: string): Promise<UserEntity | null> {
    return await this.userRepository.getUserByCustomerId(customerId);
  }
}
