import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Webhook Asaas funcionando.",
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  console.log("Webhook recebido:", body);

  return NextResponse.json({
    success: true,
    received: true,
  });
}