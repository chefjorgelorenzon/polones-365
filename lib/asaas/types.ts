export type AsaasBillingType =
  | "CREDIT_CARD"
  | "PIX"
  | "BOLETO";

export type AsaasSubscriptionCycle =
  | "WEEKLY"
  | "BIWEEKLY"
  | "MONTHLY"
  | "BIMONTHLY"
  | "QUARTERLY"
  | "SEMIANNUALLY"
  | "YEARLY";

export type AsaasCustomer = {
  id: string;
  name: string;
  email?: string;
  cpfCnpj?: string;
  mobilePhone?: string;
};

export type AsaasSubscription = {
  id: string;
  customer: string;
  billingType: AsaasBillingType;
  cycle: AsaasSubscriptionCycle;
  value: number;
  nextDueDate: string;
  status?: string;
};

export type AsaasPaymentStatus =
  | "PENDING"
  | "RECEIVED"
  | "CONFIRMED"
  | "OVERDUE"
  | "REFUNDED"
  | "RECEIVED_IN_CASH"
  | "REFUND_REQUESTED"
  | "CHARGEBACK_REQUESTED"
  | "CHARGEBACK_DISPUTE"
  | "AWAITING_CHARGEBACK_REVERSAL"
  | "DUNNING_REQUESTED"
  | "DUNNING_RECEIVED"
  | "AWAITING_RISK_ANALYSIS";

export type AsaasPayment = {
  id: string;
  customer: string;
  subscription?: string;
  billingType: AsaasBillingType;
  value: number;
  netValue?: number;
  status: AsaasPaymentStatus;
  dueDate: string;
  paymentDate?: string;
  confirmedDate?: string;
  invoiceUrl?: string;
};

export type AsaasWebhookPayload = {
  id: string;
  event: string;
  payment?: AsaasPayment;
  subscription?: AsaasSubscription;
};