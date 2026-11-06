import { ok, err } from "@/lib/api-utils";
import { createClient } from "@/lib/supabase/server";

type Context = { params: Promise<{ id: string }> };

async function setShareToken(request: Context, token: string | null) {
  const { id } = await request.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return err("Unauthorized", 401);

  const { data, error } = await supabase
    .from("projects")
    .update({ share_token: token, shared_at: token ? new Date().toISOString() : null })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("share_token")
    .single();

  if (error) return err("Project not found", 404);
  return ok({ token: data.share_token });
}

export function POST(_request: Request, context: Context) {
  return setShareToken(context, crypto.randomUUID());
}

export function DELETE(_request: Request, context: Context) {
  return setShareToken(context, null);
}
