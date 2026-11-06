import { createClient } from "@/lib/supabase/server";
import { ok, err, withBody } from "@/lib/api-utils";
import { createProjectSchema } from "@/lib/schemas";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return err("Unauthorized", 401);

  const { data, error } = await supabase
    .from("projects")
    .select("*, agents(*), budget:budgets(*)")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) return err(error.message, 500);
  return ok(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return err("Unauthorized", 401);

  const parsed = await withBody(request, createProjectSchema);
  if ("error" in parsed) return parsed.error;

  const { data, error } = await supabase
    .from("projects")
    .insert({ ...parsed.data, user_id: user.id })
    .select()
    .single();

  if (error) return err(error.message, 500);

  // Create default budget
  await supabase.from("budgets").insert({
    project_id: data.id,
    tokens_limit: 1000000,
    steps_limit: 200,
  });

  return ok(data, 201);
}
