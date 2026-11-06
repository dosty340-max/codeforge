import { createClient } from "@/lib/supabase/server";
import { ok, err, withBody } from "@/lib/api-utils";
import { writeMemorySchema } from "@/lib/schemas";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return err("Unauthorized", 401);

  const projectId = request.nextUrl.searchParams.get("projectId");
  if (!projectId) return err("projectId query param required", 400);

  const category = request.nextUrl.searchParams.get("category");
  const key = request.nextUrl.searchParams.get("key");

  let query = supabase
    .from("memory_entries")
    .select("*")
    .eq("project_id", projectId)
    .order("version", { ascending: false });

  if (category) query = query.eq("category", category);
  if (key) query = query.eq("key", key);

  const { data, error } = await query;
  if (error) return err(error.message, 500);
  return ok(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return err("Unauthorized", 401);

  const parsed = await withBody(request, writeMemorySchema);
  if ("error" in parsed) return parsed.error;

  const { projectId, key, category, content } = parsed.data;

  // Get current version for this key
  const { data: existing } = await supabase
    .from("memory_entries")
    .select("version")
    .eq("project_id", projectId)
    .eq("key", key)
    .eq("category", category)
    .order("version", { ascending: false })
    .limit(1)
    .single();

  const nextVersion = (existing?.version ?? 0) + 1;

  const { data, error } = await supabase
    .from("memory_entries")
    .insert({
      project_id: projectId,
      key,
      category,
      content,
      version: nextVersion,
    })
    .select()
    .single();

  if (error) return err(error.message, 500);
  return ok(data, 201);
}
