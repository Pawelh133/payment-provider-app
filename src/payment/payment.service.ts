import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { STRIPE_ENDPOINT_SECRET, STRIPE_CLIENT } from './payment.constants';
import Stripe from 'stripe';
import { UserService } from '../user/user.service';
import { EventDataObject } from './interfaces/event-data-boject.interface';
import { PaymentCustomerStatus } from 'src/payment-customer/payment-customer.repository';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(STRIPE_CLIENT)
    private readonly stripeProvider: Stripe,
    @Inject(STRIPE_ENDPOINT_SECRET)
    private readonly stripeEndpointSecret: string,
    private readonly userService: UserService,
  ) {}

  async servicePaymentEvents(body: any, signature: string) {
    let event: Stripe.Event;

    try {
      event = this.stripeProvider.webhooks.constructEvent(
        body,
        signature,
        this.stripeEndpointSecret,
      );
    } catch (err) {
      throw new BadRequestException('Webhook Error');
    }

    await this.resolvePaymentEvent(event);
  }

  private async resolvePaymentEvent(event: Stripe.Event) {
    switch (event.type) {
      case 'customer.subscription.created':
        const customerSubscriptionCreated = event.data
          .object as EventDataObject;

        this.userService.setUserPaymentStatus(
          customerSubscriptionCreated.customer,
          PaymentCustomerStatus.ACTIVATED,
        );
        break;

      case 'customer.subscription.paused':
        const customerSubscriptionPaused = event.data.object as EventDataObject;

        this.userService.setUserPaymentStatus(
          customerSubscriptionPaused.customer,
          PaymentCustomerStatus.PAUSED,
        );
        break;

      case 'customer.subscription.resumed':
        const customerSubscriptionResumed = event.data
          .object as EventDataObject;

        this.userService.setUserPaymentStatus(
          customerSubscriptionResumed.customer,
          PaymentCustomerStatus.ACTIVATED,
        );
        break;

      case 'customer.subscription.deleted':
        const customerSubscriptionDeleted = event.data
          .object as EventDataObject;

        this.userService.setUserPaymentStatus(
          customerSubscriptionDeleted.customer,
          PaymentCustomerStatus.INACTIVATED,
        );
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }
}
