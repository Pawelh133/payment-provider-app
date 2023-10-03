import { Module } from '@nestjs/common';
import { PaymentCustomerService } from './payment-customer.service';

@Module({
  providers: [PaymentCustomerService],
  exports: [PaymentCustomerService],
})
export class PaymentCustomerModule {}
