export enum PaymentCustomerStatus {
  UNSET = 'unset',
  ACTIVATED = 'activated',
  PAUSED = 'paused',
  INACTIVATED = 'inactivated',
}

export interface PaymentCustomer {
  id: string;
  status: PaymentCustomerStatus;
}
