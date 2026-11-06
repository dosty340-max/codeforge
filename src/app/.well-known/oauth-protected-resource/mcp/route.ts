export function GET(request: Request) {
  const { origin } = new URL(request.url);
  return Response.json({
    resource: `${origin}/mcp`,
    authorization_servers: [`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1`],
    bearer_methods_supported: ["header"],
  });
}
