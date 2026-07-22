import { asaasRequest } from "./client";

import type {
  AsaasBillingType,
  AsaasCustomer,
  AsaasSubscription,
  AsaasSubscriptionCycle,
} from "./types";

type CreateCustomerInput = {
  name: string;
  email: string;
  cpfCnpj: string;
  mobilePhone?: string;
  externalReference: string;
};

type CreateSubscriptionInput = {
  customerId: string;
  billingType: AsaasBillingType;
  value: number;
  cycle: AsaasSubscriptionCycle;
  nextDueDate: string;
  description: string;
  externalReference: string;
};

export async function createAsaasCustomer(
  input: CreateCustomerInput,
): Promise<AsaasCustomer> {
  return asaasRequest<AsaasCustomer>("/customers", {
    method: "POST",

    body: {
      name: input.name,
      email: input.email,
      cpfCnpj: input.cpfCnpj,
      mobilePhone: input.mobilePhone,
      externalReference: input.externalReference,
      notificationDisabled: false,
    },
  });
}

export async function createAsaasSubscription(
  input: CreateSubscriptionInput,
): Promise<AsaasSubscription> {
  return asaasRequest<AsaasSubscription>(
    "/subscriptions",
    {
      method: "POST",

      body: {
        customer: input.customerId,
        billingType: input.billingType,
        value: input.value,
        cycle: input.cycle,
        nextDueDate: input.nextDueDate,
        description: input.description,
        externalReference: input.externalReference,
      },
    },
  );
}