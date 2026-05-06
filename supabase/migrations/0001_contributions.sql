-- e/MOTION generative-art landing — contribution storage.
-- Run on a fresh Supabase project before deploying /wait-for-me.

create table if not exists contributions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  text_excerpt text not null check (length(text_excerpt) <= 200),
  vector jsonb not null,
  stage text not null default 'denial',
  client_hash text,
  user_agent text
);

create index if not exists contributions_stage_created_idx
  on contributions (stage, created_at desc);

create index if not exists contributions_client_hash_stage_idx
  on contributions (client_hash, stage, created_at desc);

alter table contributions enable row level security;

-- Anonymous reads only. Writes happen through the service-role key
-- inside the Netlify Function, which bypasses RLS.
drop policy if exists "anon read" on contributions;
create policy "anon read" on contributions
  for select using (true);
