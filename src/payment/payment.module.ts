import { DynamicModule, Module, Provider } from '@nestjs/common';
import { PaymentWebhookController } from './payment-webhook.controller';
import { PaymentService } from './payment.service';
import Stripe from 'stripe';
import {
  STRIPE_ENDPOINT_SECRET,
  STRIPE_CLIENT,
  STRIPE_QUERY_API_KEY,
} from './payment.constants';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [PaymentWebhookController],
  providers: [PaymentService],
  imports: [UserModule],
})
export class PaymentModule {
  static forRoot(apiKey: string, config: Stripe.StripeConfig): DynamicModule {
    const stripe = new Stripe(apiKey, config);

    const stripeProvider: Provider = {
      provide: STRIPE_CLIENT,
      useValue: stripe,
    };

    const stripeApiKeyProvider: Provider = {
      provide: STRIPE_ENDPOINT_SECRET,
      useValue: process.env.STRIPE_ENDPOINT_SECRET,
    };

    const queryAPiKeyProvider: Provider = {
      provide: STRIPE_QUERY_API_KEY,
      useValue: process.env.STRIPE_QUERY_API_KEY,
    };

    return {
      module: PaymentModule,
      providers: [stripeProvider, stripeApiKeyProvider, queryAPiKeyProvider],
      exports: [stripeProvider, stripeApiKeyProvider, queryAPiKeyProvider],
      global: true,
    };
  }
}
