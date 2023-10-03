import { Inject, Injectable } from '@nestjs/common';
import { STRIPE_CLIENT } from '../payment/payment.constants';
import Stripe from 'stripe';
import {
  PaymentCustomer,
  PaymentCustomerStatus,
} from './payment-customer.repository';

@Injectable()
export class PaymentCustomerService {
  constructor(
    @Inject(STRIPE_CLIENT)
    private stripe: Stripe,
  ) {}

  async createCustomer(email: string): Promise<PaymentCustomer> {
    const result = await this.stripe.customers.create({ email });

    return {
      id: result.id,
      status: PaymentCustomerStatus.UNSET,
    };
  }

  getCustomers() {
    return this.stripe.customers.list();
  }
}
