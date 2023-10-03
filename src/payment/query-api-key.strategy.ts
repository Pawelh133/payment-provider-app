import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-custom';
import { STRIPE_QUERY_API_KEY } from './payment.constants';

//TODO: connect add to stripe qpi key and verify in webhook endpoint.
@Injectable()
export class QueryApiKeyStrategy extends PassportStrategy(
  Strategy,
  'query-api-key',
) {
  constructor(
    private readonly configService: ConfigService,
    @Inject(STRIPE_QUERY_API_KEY) private readonly stripeQueryApiKey: string,
  ) {
    super();
  }

  async validate(
    request: Request,
    done: (
      err: Error | undefined,
      user: Record<string, unknown> | undefined,
    ) => void,
  ): Promise<void> {
    const queries = request.query;

    if (!queries.hasOwnProperty(this.stripeQueryApiKey)) {
      done(new UnauthorizedException(), undefined);
    }

    const apiKeyAccessConfig =
      this.configService.get<{ key: string; service: string }[]>(
        'apiKeyAccess',
      );

    if (Array.isArray(apiKeyAccessConfig)) {
      const validApiKey = apiKeyAccessConfig.find(
        (value) => value.key === queries[this.stripeQueryApiKey],
      );

      if (validApiKey) {
        done(undefined, { service: validApiKey.service });
      }
    }
  }
}
