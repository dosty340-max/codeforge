-- Projects can be any kind of software and choose teams from the agent catalog.

alter table public.projects
  add column kind text not null default 'anything'
    check (kind in ('website','app','game','startup','anything')),
  add column divisions text[] not null default '{}';

-- Agent roles now come from the catalog, so they are no longer a fixed list.
alter table public.agents
  drop constraint agents_role_check,
  add column division text;
