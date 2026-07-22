const ASAAS_API_URL =
  process.env.ASAAS_API_URL ??
  "https://api-sandbox.asaas.com/v3";

const ASAAS_API_KEY = process.env.ASAAS_API_KEY;

type AsaasRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
};

type AsaasErrorResponse = {
  errors?: Array<{
    code?: string;
    description?: string;
  }>;
};

export class AsaasApiError extends Error {
  status: number;
  details: AsaasErrorResponse | null;

  constructor(
    message: string,
    status: number,
    details: AsaasErrorResponse | null,
  ) {
    super(message);

    this.name = "AsaasApiError";
    this.status = status;
    this.details = details;
  }
}

export async function asaasRequest<T>(
  endpoint: string,
  options: AsaasRequestOptions = {},
): Promise<T> {
  if (!ASAAS_API_KEY) {
    throw new Error(
      "A variável ASAAS_API_KEY não foi configurada.",
    );
  }

  const response = await fetch(`${ASAAS_API_URL}${endpoint}`, {
    method: options.method ?? "GET",

    headers: {
      accept: "application/json",
      "content-type": "application/json",
      access_token: ASAAS_API_KEY,
    },

    body:
      options.body !== undefined
        ? JSON.stringify(options.body)
        : undefined,

    cache: "no-store",
  });

  const data = (await response.json().catch(() => null)) as
    | T
    | AsaasErrorResponse
    | null;

  if (!response.ok) {
    const errorData = data as AsaasErrorResponse | null;

    const description =
      errorData?.errors?.[0]?.description ??
      "Não foi possível concluir a operação no Asaas.";

    throw new AsaasApiError(
      description,
      response.status,
      errorData,
    );
  }

  return data as T;
}