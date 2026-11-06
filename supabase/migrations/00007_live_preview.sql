-- Widgets that agents publish to a project's live canvas.

create table public.preview_sections (
  project_id uuid not null references public.projects(id) on delete cascade,
  section_id text not null,
  title      text not null,
  html       text not null default '',
  css        text not null default '',
  position   integer not null default 0,
  agent_name text not null,
  version    integer not null default 1,
  updated_at timestamptz not null default now(),
  primary key (project_id, section_id)
);

alter table public.preview_sections enable row level security;

create policy "Users see preview of own projects"
  on public.preview_sections for select using (
    exists (select 1 from public.projects where id = project_id and user_id = auth.uid())
  );
create policy "Users manage preview of own projects"
  on public.preview_sections for all using (
    exists (select 1 from public.projects where id = project_id and user_id = auth.uid())
  );
