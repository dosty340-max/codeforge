-- Shows users that Claude has really connected to Codeforge.

create table public.mcp_connections (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  last_seen_at timestamptz not null default now()
);

alter table public.mcp_connections enable row level security;

create policy "Users see own connection"
  on public.mcp_connections for select using (auth.uid() = user_id);
create policy "Users add own connection"
  on public.mcp_connections for insert with check (auth.uid() = user_id);
create policy "Users update own connection"
  on public.mcp_connections for update using (auth.uid() = user_id);
