import { NextResponse } from "next/server";
import { ZodError, ZodSchema } from "zod";

export type ApiError = {
  error: string;
  details?: unknown;
};

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function err(message: string, status = 400, details?: unknown): NextResponse<ApiError> {
  return NextResponse.json({ error: message, ...(details ? { details } : {}) }, { status });
}

export function parseBody<T>(schema: ZodSchema<T>, data: unknown): { data: T } | { error: NextResponse<ApiError> } {
  try {
    return { data: schema.parse(data) };
  } catch (e) {
    if (e instanceof ZodError) {
      return { error: err("Validation failed", 422, e.flatten().fieldErrors) };
    }
    return { error: err("Invalid request body", 400) };
  }
}

export async function withBody<T>(request: Request, schema: ZodSchema<T>): Promise<{ data: T } | { error: NextResponse<ApiError> }> {
  try {
    const body = await request.json();
    return parseBody(schema, body);
  } catch {
    return { error: err("Invalid JSON", 400) };
  }
}
