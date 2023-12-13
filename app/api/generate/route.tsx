import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // Parse the request body
  const requestBody = await req.json();
  const email = requestBody.email;
}
