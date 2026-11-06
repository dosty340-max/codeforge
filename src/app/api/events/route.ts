import { createClient } from "@/lib/supabase/server";
import { ok, err, withBody } from "@/lib/api-utils";
import { createEventSchema } from "@/lib/schemas";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return err("Unauthorized", 401);

  const projectId = request.nextUrl.searchParams.get("projectId");
  if (!projectId) return err("projectId query param required", 400);

  const limit = parseInt(request.nextUrl.searchParams.get("limit") ?? "50");

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return err(error.message, 500);
  return ok(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return err("Unauthorized", 401);

  const parsed = await withBody(request, createEventSchema);
  if ("error" in parsed) return parsed.error;

  const { data, error } = await supabase
    .from("events")
    .insert({
      project_id: parsed.data.projectId,
      agent_id: parsed.data.agentId,
      agent_name: parsed.data.agentName,
      type: parsed.data.type,
      message: parsed.data.message,
    })
    .select()
    .single();

  if (error) return err(error.message, 500);
  return ok(data, 201);
}
