-- State the MCP server needs to enforce repair limits and report agents.

alter table public.tasks
  add column assigned_to text,
  add column attempts int not null default 0,
  add column last_error text;

alter table public.agents
  add constraint agents_project_name_unique unique (project_id, name);

alter table public.budgets
  add column warned_at timestamptz;
