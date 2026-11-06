import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { createClient } from "@supabase/supabase-js";
import { createMcpServer } from "@/lib/mcp/server";
import { isOAuthClientToken } from "@/lib/mcp/token";

function unauthorized(request: Request) {
  const { origin } = new URL(request.url);
  return Response.json(
    { error: "unauthorized" },
    {
      status: 401,
      headers: {
        "WWW-Authenticate": `Bearer resource_metadata="${origin}/.well-known/oauth-protected-resource/mcp"`,
      },
    }
  );
}

async function handle(request: Request) {
  const token = request.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return unauthorized(request);

  // The user's token goes to every query, so row level security applies to all tools.
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return unauthorized(request);

  if (isOAuthClientToken(token)) {
    const { error } = await supabase
      .from("mcp_connections")
      .upsert({ user_id: user.id, last_seen_at: new Date().toISOString() });
    // The dashboard status must never block Claude's work.
    if (error) console.error("Could not record MCP connection:", error.message);
  }

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  await createMcpServer(supabase, user.id).connect(transport);
  return transport.handleRequest(request);
}

export { handle as GET, handle as POST, handle as DELETE };
