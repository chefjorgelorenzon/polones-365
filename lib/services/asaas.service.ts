import "server-only";

const DEFAULT_ASAAS_BASE_URL = "https://api-sandbox.asaas.com/v3";

export type AsaasBillingType =
  | "UNDEFINED"
  | "BOLETO"
  | "CREDIT_CARD"
  | "PIX";

export type AsaasSubscriptionCycle =
  | "WEEKLY"
  | "BIWEEKLY"
  | "MONTHLY"
  | "QUARTERLY"
  | "SEMIANNUALLY"
  | "YEARLY";

export type AsaasSubscriptionStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "EXPIRED";

export type AsaasPaymentStatus =
  | "PENDING"
  | "RECEIVED"
  | "CONFIRMED"
  | "OVERDUE"
  | "REFUNDED"
  | "RECEIVED_IN_CASH"
  | "REFUND_REQUESTED"
  | "REFUND_IN_PROGRESS"
  | "CHARGEBACK_REQUESTED"
  | "CHARGEBACK_DISPUTE"
  | "AWAITING_CHARGEBACK_REVERSAL"
  | "DUNNING_REQUESTED"
  | "DUNNING_RECEIVED"
  | "AWAITING_RISK_ANALYSIS";

export type AsaasCustomer = {
  object: "customer";
  id: string;
  dateCreated?: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  mobilePhone?: string | null;
  cpfCnpj?: string | null;
  externalReference?: string | null;
  notificationDisabled?: boolean;
  deleted?: boolean;
};

export type AsaasSubscription = {
  object: "subscription";
  id: string;
  dateCreated?: string;
  customer: string;
  billingType: AsaasBillingType;
  cycle: AsaasSubscriptionCycle;
  value: number;
  nextDueDate: string;
  description?: string | null;
  externalReference?: string | null;
  status?: AsaasSubscriptionStatus;
  deleted?: boolean;
};

export type AsaasPayment = {
  object: "payment";
  id: string;
  dateCreated?: string;
  customer: string;
  subscription?: string | null;
  billingType: AsaasBillingType;
  value: number;
  netValue?: number;
  dueDate: string;
  status: AsaasPaymentStatus;
  description?: string | null;
  externalReference?: string | null;
  invoiceUrl?: string | null;
  bankSlipUrl?: string | null;
};

type AsaasListResponse<T> = {
  object: "list";
  hasMore: boolean;
  totalCount: number;
  limit: number;
  offset: number;
  data: T[];
};

type AsaasErrorItem = {
  code?: string;
  description?: string;
};

type AsaasErrorResponse = {
  errors?: AsaasErrorItem[];
};

export type CreateAsaasCustomerInput = {
  name: string;
  email: string;
  cpfCnpj?: string;
  phone?: string;
  mobilePhone?: string;
  externalReference: string;
  notificationDisabled?: boolean;
};

export type FindOrCreateAsaasCustomerInput = CreateAsaasCustomerInput;

export type CreateAsaasSubscriptionInput = {
  customer: string;
  billingType: AsaasBillingType;
  value: number;
  nextDueDate: string;
  cycle: AsaasSubscriptionCycle;
  description: string;
  externalReference: string;
};

export type UpdateAsaasSubscriptionInput = Partial<
  Pick<
    CreateAsaasSubscriptionInput,
    | "billingType"
    | "value"
    | "nextDueDate"
    | "cycle"
    | "description"
    | "externalReference"
  >
> & {
  updatePendingPayments?: boolean;
};

export class AsaasApiError extends Error {
  status: number;
  details: AsaasErrorItem[];

  constructor(message: string, status: number, details: AsaasErrorItem[] = []) {
    super(message);
    this.name = "AsaasApiError";
    this.status = status;
    this.details = details;
  }
}

function getAsaasConfig() {
  const apiKey = process.env.ASAAS_API_KEY;
 const baseUrl =
  process.env.ASAAS_BASE_URL?.replace(/\/$/, "") ??
  process.env.ASAAS_API_URL?.replace(/\/$/, "") ??
  DEFAULT_ASAAS_BASE_URL;

  if (!apiKey) {
    throw new Error(
      "A variável ASAAS_API_KEY não foi configurada no ambiente.",
    );
  }

  return {
    apiKey,
    baseUrl,
  };
}

async function parseAsaasResponse<T>(response: Response): Promise<T> {
  const rawText = await response.text();

  let parsedBody: unknown = null;

  if (rawText) {
    try {
      parsedBody = JSON.parse(rawText);
    } catch {
      parsedBody = rawText;
    }
  }

  if (!response.ok) {
    const errorBody =
      parsedBody && typeof parsedBody === "object"
        ? (parsedBody as AsaasErrorResponse)
        : null;

    const details = errorBody?.errors ?? [];
    const description = details
      .map((error) => error.description)
      .filter(Boolean)
      .join(" ");

    throw new AsaasApiError(
      description ||
        `O Asaas retornou o erro HTTP ${response.status}.`,
      response.status,
      details,
    );
  }

  return parsedBody as T;
}

async function asaasRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const { apiKey, baseUrl } = getAsaasConfig();

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      access_token: apiKey,
      "User-Agent": "Polones365/1.0",
      ...options.headers,
    },
    cache: "no-store",
  });

  return parseAsaasResponse<T>(response);
}

export async function createAsaasCustomer(
  input: CreateAsaasCustomerInput,
): Promise<AsaasCustomer> {
  return asaasRequest<AsaasCustomer>("/customers", {
    method: "POST",
    body: JSON.stringify({
      name: input.name,
      email: input.email,
      cpfCnpj: input.cpfCnpj,
      phone: input.phone,
      mobilePhone: input.mobilePhone,
      externalReference: input.externalReference,
      notificationDisabled: input.notificationDisabled ?? false,
    }),
  });
}

export async function getAsaasCustomer(
  customerId: string,
): Promise<AsaasCustomer> {
  return asaasRequest<AsaasCustomer>(
    `/customers/${encodeURIComponent(customerId)}`,
  );
}

export async function listAsaasCustomersByEmail(
  email: string,
): Promise<AsaasCustomer[]> {
  const query = new URLSearchParams({
    email,
    limit: "100",
  });

  const response = await asaasRequest<AsaasListResponse<AsaasCustomer>>(
    `/customers?${query.toString()}`,
  );

  return response.data;
}

export async function findOrCreateAsaasCustomer(
  input: FindOrCreateAsaasCustomerInput,
): Promise<AsaasCustomer> {
  const customers = await listAsaasCustomersByEmail(input.email);

  const customerByExternalReference = customers.find(
    (customer) =>
      customer.externalReference === input.externalReference &&
      !customer.deleted,
  );

  if (customerByExternalReference) {
    return customerByExternalReference;
  }

  const activeCustomer = customers.find((customer) => !customer.deleted);

  if (activeCustomer) {
    return activeCustomer;
  }

  return createAsaasCustomer(input);
}

export async function updateAsaasCustomer(
  customerId: string,
  input: Partial<CreateAsaasCustomerInput>,
): Promise<AsaasCustomer> {
  return asaasRequest<AsaasCustomer>(
    `/customers/${encodeURIComponent(customerId)}`,
    {
      method: "PUT",
      body: JSON.stringify(input),
    },
  );
}

export async function createAsaasSubscription(
  input: CreateAsaasSubscriptionInput,
): Promise<AsaasSubscription> {
  return asaasRequest<AsaasSubscription>("/subscriptions", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getAsaasSubscription(
  subscriptionId: string,
): Promise<AsaasSubscription> {
  return asaasRequest<AsaasSubscription>(
    `/subscriptions/${encodeURIComponent(subscriptionId)}`,
  );
}

export async function updateAsaasSubscription(
  subscriptionId: string,
  input: UpdateAsaasSubscriptionInput,
): Promise<AsaasSubscription> {
  return asaasRequest<AsaasSubscription>(
    `/subscriptions/${encodeURIComponent(subscriptionId)}`,
    {
      method: "PUT",
      body: JSON.stringify(input),
    },
  );
}

export async function cancelAsaasSubscription(
  subscriptionId: string,
): Promise<void> {
  await asaasRequest<unknown>(
    `/subscriptions/${encodeURIComponent(subscriptionId)}`,
    {
      method: "DELETE",
    },
  );
}

export async function listAsaasSubscriptionPayments(
  subscriptionId: string,
): Promise<AsaasPayment[]> {
  const response = await asaasRequest<AsaasListResponse<AsaasPayment>>(
    `/subscriptions/${encodeURIComponent(subscriptionId)}/payments`,
  );

  return response.data;
}

export async function getFirstAsaasSubscriptionPayment(
  subscriptionId: string,
): Promise<AsaasPayment | null> {
  const payments = await listAsaasSubscriptionPayments(subscriptionId);

  if (payments.length === 0) {
    return null;
  }

  return [...payments].sort((a, b) =>
    a.dueDate.localeCompare(b.dueDate),
  )[0];
}

export async function getAsaasPayment(
  paymentId: string,
): Promise<AsaasPayment> {
  return asaasRequest<AsaasPayment>(
    `/payments/${encodeURIComponent(paymentId)}`,
  );
}

export type AsaasCheckoutStatus =
  | "ACTIVE"
  | "CANCELED"
  | "EXPIRED"
  | "PAID";

export type CreateAsaasCheckoutInput = {
  billingTypes: Array<"CREDIT_CARD" | "PIX">;
  chargeTypes: Array<
    "DETACHED" | "RECURRENT" | "INSTALLMENT"
  >;
  minutesToExpire: number;
  externalReference: string;

  callback: {
    successUrl: string;
    cancelUrl: string;
    expiredUrl: string;
  };

  items: Array<{
    externalReference?: string;
    name: string;
    description: string;
    quantity: number;
    value: number;
  }>;

  customerData: {
    name?: string;
    email?: string;
    cpfCnpj?: string;
    phone?: string;
    postalCode?: string;
    address?: string;
    addressNumber?: string;
    province?: string;
  };

  subscription: {
    cycle: AsaasSubscriptionCycle;
    nextDueDate: string;
    endDate?: string;
  };
};

export type AsaasCheckout = {
  id: string;
  link: string;
  status: AsaasCheckoutStatus;
  billingTypes: Array<"CREDIT_CARD" | "PIX">;
  chargeTypes: Array<
    "DETACHED" | "RECURRENT" | "INSTALLMENT"
  >;
  minutesToExpire: number;
  externalReference?: string | null;
};

export async function createAsaasCheckout(
  input: CreateAsaasCheckoutInput,
): Promise<AsaasCheckout> {
  return asaasRequest<AsaasCheckout>("/checkouts", {
    method: "POST",
    body: JSON.stringify(input),
  });
}