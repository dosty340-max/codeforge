import { createClient } from "@/lib/supabase/server";
import { ok, err, withBody } from "@/lib/api-utils";
import { updateProjectSchema } from "@/lib/schemas";

async function getProject(supabase: Awaited<ReturnType<typeof createClient>>, userId: string, projectId: string) {
  const { data, error } = await supabase
    .from("projects")
    .select("*, agents(*), budget:budgets(*), events(*, order:created_at.desc)")
    .eq("id", projectId)
    .eq("user_id", userId)
    .single();
  return { data, error };
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return err("Unauthorized", 401);

  const { data, error } = await getProject(supabase, user.id, id);
  if (error) return err("Project not found", 404);
  return ok(data);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return err("Unauthorized", 401);

  const parsed = await withBody(request, updateProjectSchema);
  if ("error" in parsed) return parsed.error;

  const { data, error } = await supabase
    .from("projects")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return err("Project not found", 404);
  return ok(data);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return err("Unauthorized", 401);

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return err("Failed to delete", 500);
  return ok({ deleted: true });
}
