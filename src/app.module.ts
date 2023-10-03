import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentCustomerModule } from './payment-customer/payment-customer.module';
import { PaymentModule } from './payment/payment.module';
import { IamModule } from './iam/iam.module';
import { AuthenticationController } from './iam/authentication.controller';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PaymentCustomerModule,
    PaymentModule.forRoot(process.env.STRIPE_API_KEY, {
      apiVersion: '2023-08-16',
    }),
    UserModule,
    IamModule,
  ],
  controllers: [AuthenticationController],
})
export class AppModule {}
