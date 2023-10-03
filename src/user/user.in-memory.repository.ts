import { PaymentCustomerStatus } from '../payment-customer/payment-customer.repository';
import { UserEntity, UserRepository } from './user.repository';

export class InMemoryUserRepository implements UserRepository {
  private users = [
    {
      id: 1,
      email: 'user@user.com',
      paymentCustomer: {
        id: 'cus_OkOL9eN0ZXSb5k',
        status: PaymentCustomerStatus.UNSET,
      },
    },
  ];

  createUser(user: UserEntity): Promise<UserEntity> {
    this.users.push(user);

    return Promise.resolve(user);
  }

  updateUser(user: UserEntity): Promise<UserEntity> {
    const result = this.users.map((userItem) =>
      userItem.id === user.id ? user : userItem,
    );

    this.users = result;

    return Promise.resolve(user);
  }

  getUsers(): Promise<UserEntity[]> {
    return Promise.resolve(this.users);
  }

  getUsersTotalCount(): Promise<number> {
    return Promise.resolve(this.users.length);
  }

  getUser(email: string): Promise<UserEntity> {
    const user = this.users.find((user) => user.email === email);

    return Promise.resolve(user ?? null);
  }

  getUserByCustomerId(id: string): Promise<UserEntity | null> {
    const user = this.users.find((user) => user.paymentCustomer.id === id);

    return Promise.resolve(user ?? null);
  }

  deleteUser(id: number): Promise<void> {
    const index = this.users.findIndex((i) => i.id === id);

    if (index > -1) {
      this.users.splice(index, 1);
    }

    return Promise.resolve();
  }
}
