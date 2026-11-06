-- Public result links. A project is public only while it has a share token.

alter table public.projects
  add column share_token uuid unique,
  add column shared_at timestamptz;

-- Runs with owner rights so visitors can read one shared project without table access.
create function public.get_shared_project(token uuid)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'name', p.name,
    'description', p.description,
    'kind', p.kind,
    'phase', p.phase,
    'progress', p.phase_progress,
    'divisions', p.divisions,
    'sharedAt', p.shared_at,
    'tasks', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object('title', t.title, 'status', t.status, 'result', t.result)
          order by t.created_at
        )
        from public.tasks t
        where t.project_id = p.id
      ),
      '[]'::jsonb
    )
  )
  from public.projects p
  where p.share_token = token
$$;

revoke execute on function public.get_shared_project(uuid) from public;
grant execute on function public.get_shared_project(uuid) to anon, authenticated;
