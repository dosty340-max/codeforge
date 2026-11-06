-- Seed data for development
-- Run after creating a test user in Supabase Auth dashboard

-- To use: replace '00000000-0000-0000-0000-000000000000' with your actual user ID from auth.users

do $$
declare
  test_user_id uuid := '00000000-0000-0000-0000-000000000000';
  p1_id uuid;
  p2_id uuid;
  p3_id uuid;
begin
  -- Projects
  insert into public.projects (id, user_id, name, description, phase, phase_progress)
  values
    (uuid_generate_v4(), test_user_id, 'E-shop for Handmade Jewelry',
     'Full e-commerce platform with product catalog, shopping cart, payments, and admin panel',
     'development', 65)
  returning id into p1_id;

  insert into public.projects (id, user_id, name, description, phase, phase_progress)
  values
    (uuid_generate_v4(), test_user_id, 'Portfolio Website',
     'Minimal portfolio with project gallery, about page, and contact form',
     'complete', 100)
  returning id into p2_id;

  insert into public.projects (id, user_id, name, description, phase, phase_progress)
  values
    (uuid_generate_v4(), test_user_id, 'SaaS Dashboard',
     'Analytics dashboard with charts, user management, and billing integration',
     'planning', 15)
  returning id into p3_id;

  -- Agents for project 1
  insert into public.agents (project_id, name, role, "group", status, model, current_task, tokens_used, steps_used) values
    (p1_id, 'Brain', 'brain', 'orchestration', 'working', 'claude-opus-5-5', 'Coordinating backend API implementation', 145200, 23),
    (p1_id, 'UI/UX Agent', 'ui-ux', 'development', 'done', 'claude-sonnet-5-5', null, 89400, 18),
    (p1_id, 'Backend Agent', 'backend', 'development', 'working', 'claude-sonnet-5-5', 'Building REST API endpoints for products', 67800, 12),
    (p1_id, 'Database Agent', 'database', 'development', 'waiting', 'claude-sonnet-5-5', 'Waiting for API schema from Backend', 34500, 8),
    (p1_id, 'Auth Agent', 'auth', 'development', 'idle', 'claude-sonnet-5-5', null, 12300, 4),
    (p1_id, 'Functional Tests', 'test-func', 'testing', 'idle', 'claude-sonnet-5-5', null, 0, 0),
    (p1_id, 'Security Tests', 'test-security', 'testing', 'idle', 'claude-sonnet-5-5', null, 0, 0),
    (p1_id, 'Perf Tests', 'test-perf', 'testing', 'idle', 'claude-sonnet-5-5', null, 0, 0),
    (p1_id, 'Code Review', 'code-review', 'testing', 'idle', 'claude-sonnet-5-5', null, 0, 0);

  -- Budgets
  insert into public.budgets (project_id, tokens_used, tokens_limit, steps_used, steps_limit) values
    (p1_id, 349200, 1000000, 65, 200),
    (p2_id, 520000, 1000000, 142, 200),
    (p3_id, 12000, 1000000, 3, 200);

  -- Events for project 1
  insert into public.events (project_id, agent_name, type, message) values
    (p1_id, 'Brain', 'decision', 'Split project into 4 phases: UI, API, Database, Auth'),
    (p1_id, 'Brain', 'task_started', 'Assigned UI/UX design to UI/UX Agent'),
    (p1_id, 'UI/UX Agent', 'task_completed', 'Landing page and product listing UI complete'),
    (p1_id, 'Brain', 'task_started', 'Assigned API development to Backend Agent'),
    (p1_id, 'Backend Agent', 'memory_write', 'Wrote API contract: /api/products, /api/cart, /api/orders'),
    (p1_id, 'Brain', 'budget_warning', 'Token usage at 35% of project budget'),
    (p1_id, 'Backend Agent', 'task_started', 'Building REST API endpoints for products'),
    (p1_id, 'Database Agent', 'ask_user', 'Should I use PostgreSQL or MySQL for the database?');
end $$;
