import { PaymentCustomer } from '../payment-customer/payment-customer.repository';

export interface UserEntity {
  id: number;
  email: string;
  paymentCustomer: PaymentCustomer;
}

export interface UserRepository {
  createUser(user: UserEntity): Promise<UserEntity>;
  getUsers(): Promise<UserEntity[]>;
  getUser(email: string): Promise<UserEntity | null>;
  deleteUser(id: number): Promise<void>;
}
