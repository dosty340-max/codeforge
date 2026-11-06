import { createClient } from "@/lib/supabase/server";
import { ok, err, withBody } from "@/lib/api-utils";
import { updateTaskSchema } from "@/lib/schemas";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return err("Unauthorized", 401);

  const parsed = await withBody(request, updateTaskSchema);
  if ("error" in parsed) return parsed.error;

  // Join through project to verify ownership
  const { data, error } = await supabase
    .from("tasks")
    .update(parsed.data)
    .eq("id", id)
    .select("*, project:projects!inner(user_id)")
    .single();

  if (error || !data) return err("Task not found", 404);
  const { project } = data as unknown as { project: { user_id: string } };
  if (project.user_id !== user.id) return err("Forbidden", 403);

  return ok(data);
}
