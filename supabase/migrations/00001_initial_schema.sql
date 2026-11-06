-- Codeforge AI — initial schema

-- Extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

create table public.projects (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  description text not null default '',
  phase       text not null default 'planning'
                check (phase in ('planning','development','testing','review','complete')),
  phase_progress int not null default 0 check (phase_progress between 0 and 100),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.agents (
  id          uuid primary key default uuid_generate_v4(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  name        text not null,
  role        text not null
                check (role in ('brain','ui-ux','backend','database','auth',
                                'test-func','test-security','test-perf','code-review')),
  "group"     text not null
                check ("group" in ('orchestration','development','testing')),
  status      text not null default 'idle'
                check (status in ('idle','working','done','error','waiting')),
  model       text not null default 'claude-sonnet-5-5',
  current_task text,
  tokens_used bigint not null default 0,
  steps_used  int not null default 0,
  created_at  timestamptz not null default now()
);

create table public.tasks (
  id          uuid primary key default uuid_generate_v4(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  agent_id    uuid references public.agents(id) on delete set null,
  title       text not null,
  description text not null default '',
  status      text not null default 'pending'
                check (status in ('pending','in_progress','done','error')),
  result      text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.memory_entries (
  id          uuid primary key default uuid_generate_v4(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  key         text not null,
  category    text not null
                check (category in ('spec','contracts','decisions','tasks')),
  content     text not null,
  version     int not null default 1,
  created_at  timestamptz not null default now()
);

create table public.events (
  id          uuid primary key default uuid_generate_v4(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  agent_id    text,
  agent_name  text,
  type        text not null
                check (type in ('task_started','task_completed','error','decision',
                                'memory_write','ask_user','budget_warning')),
  message     text not null,
  created_at  timestamptz not null default now()
);

create table public.budgets (
  id           uuid primary key default uuid_generate_v4(),
  project_id   uuid not null unique references public.projects(id) on delete cascade,
  tokens_used  bigint not null default 0,
  tokens_limit bigint not null default 1000000,
  steps_used   int not null default 0,
  steps_limit  int not null default 200
);

-- ============================================================
-- INDEXES
-- ============================================================

create index idx_projects_user     on public.projects(user_id);
create index idx_agents_project    on public.agents(project_id);
create index idx_tasks_project     on public.tasks(project_id);
create index idx_events_project    on public.events(project_id, created_at desc);
create index idx_memory_project    on public.memory_entries(project_id, key, category);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.projects        enable row level security;
alter table public.agents          enable row level security;
alter table public.tasks           enable row level security;
alter table public.memory_entries  enable row level security;
alter table public.events          enable row level security;
alter table public.budgets         enable row level security;

-- Projects: user sees only their own
create policy "Users see own projects"
  on public.projects for select using (auth.uid() = user_id);
create policy "Users insert own projects"
  on public.projects for insert with check (auth.uid() = user_id);
create policy "Users update own projects"
  on public.projects for update using (auth.uid() = user_id);
create policy "Users delete own projects"
  on public.projects for delete using (auth.uid() = user_id);

-- Agents: through project ownership
create policy "Users see agents of own projects"
  on public.agents for select using (
    exists (select 1 from public.projects where id = project_id and user_id = auth.uid())
  );
create policy "Users manage agents of own projects"
  on public.agents for all using (
    exists (select 1 from public.projects where id = project_id and user_id = auth.uid())
  );

-- Tasks: through project ownership
create policy "Users see tasks of own projects"
  on public.tasks for select using (
    exists (select 1 from public.projects where id = project_id and user_id = auth.uid())
  );
create policy "Users manage tasks of own projects"
  on public.tasks for all using (
    exists (select 1 from public.projects where id = project_id and user_id = auth.uid())
  );

-- Memory: through project ownership
create policy "Users see memory of own projects"
  on public.memory_entries for select using (
    exists (select 1 from public.projects where id = project_id and user_id = auth.uid())
  );
create policy "Users manage memory of own projects"
  on public.memory_entries for all using (
    exists (select 1 from public.projects where id = project_id and user_id = auth.uid())
  );

-- Events: through project ownership
create policy "Users see events of own projects"
  on public.events for select using (
    exists (select 1 from public.projects where id = project_id and user_id = auth.uid())
  );
create policy "Users manage events of own projects"
  on public.events for all using (
    exists (select 1 from public.projects where id = project_id and user_id = auth.uid())
  );

-- Budgets: through project ownership
create policy "Users see budgets of own projects"
  on public.budgets for select using (
    exists (select 1 from public.projects where id = project_id and user_id = auth.uid())
  );
create policy "Users manage budgets of own projects"
  on public.budgets for all using (
    exists (select 1 from public.projects where id = project_id and user_id = auth.uid())
  );
