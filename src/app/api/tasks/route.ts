import { createClient } from "@/lib/supabase/server";
import { ok, err, withBody } from "@/lib/api-utils";
import { createTaskSchema } from "@/lib/schemas";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return err("Unauthorized", 401);

  const projectId = request.nextUrl.searchParams.get("projectId");
  if (!projectId) return err("projectId query param required", 400);

  // Verify user owns the project
  const { error: projectErr } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single();
  if (projectErr) return err("Project not found", 404);

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) return err(error.message, 500);
  return ok(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return err("Unauthorized", 401);

  const parsed = await withBody(request, createTaskSchema);
  if ("error" in parsed) return parsed.error;

  // Verify user owns the project
  const { error: projectErr } = await supabase
    .from("projects")
    .select("id")
    .eq("id", parsed.data.projectId)
    .eq("user_id", user.id)
    .single();
  if (projectErr) return err("Project not found", 404);

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      project_id: parsed.data.projectId,
      agent_id: parsed.data.agentId,
      title: parsed.data.title,
      description: parsed.data.description,
      status: parsed.data.status,
    })
    .select()
    .single();

  if (error) return err(error.message, 500);
  return ok(data, 201);
}
