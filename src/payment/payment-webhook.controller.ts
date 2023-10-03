import { Controller, Headers, Post, RawBodyRequest, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request } from 'express';

@Controller('webhook')
export class PaymentWebhookController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  servicePaymentEvents(
    @Headers() headers,
    @Req() req: RawBodyRequest<Request>,
  ) {
    const signature = headers['stripe-signature'];
    const body = req.rawBody;

    this.paymentService.servicePaymentEvents(body, signature);
  }
}
