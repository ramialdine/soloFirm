-- SoloFirm Supabase Schema
-- Run this in the Supabase SQL editor to set up the required tables.

-- Runs table: stores orchestration results
create table if not exists runs (
  id uuid primary key,
  domain text not null,
  task text not null,
  status text not null default 'pending',
  agent_outputs jsonb default '{}'::jsonb,
  final_output text,
  presentation jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

-- Enable public read access for shareable results
alter table runs enable row level security;

create policy "Public read access" on runs
  for select using (true);

create policy "Service write access" on runs
  for all using (true);

-- Waitlist table: stores email signups
create table if not exists waitlist (
  id bigint generated always as identity primary key,
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table waitlist enable row level security;

create policy "Service write access" on waitlist
  for all using (true);

-- Index for faster run lookups
create index if not exists idx_runs_created_at on runs (created_at desc);
create index if not exists idx_waitlist_email on waitlist (email);
