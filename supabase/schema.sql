-- Pomodoro SaaS Database Schema & Row-Level Security (RLS)
-- Paste into Supabase Dashboard -> SQL Editor -> New Query -> Run

create extension if not exists pgcrypto;

-- 1. User Profiles & Subscription Entitlements
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  plan text not null default 'free' check (plan in ('free', 'pro', 'lifetime')),
  plan_status text not null default 'inactive' check (plan_status in ('inactive', 'trialing', 'active', 'past_due', 'canceled')),
  billing_provider text,
  provider_customer_id text,
  provider_subscription_id text,
  current_period_end timestamptz,
  trial_used boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles add column if not exists trial_used boolean not null default false;

create index if not exists profiles_email_idx on public.profiles (email);

-- 2. Cloud Synced Workspaces (Single Snapshot per User with Optimistic Locking)
create table if not exists public.workspaces (
  user_id uuid primary key references auth.users(id) on delete cascade,
  schema_version text not null default 'pomodoro-workspace-v2',
  payload jsonb not null default '{}'::jsonb,
  revision bigint not null default 0,
  client_updated_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists workspaces_updated_at_idx on public.workspaces (updated_at desc);

-- 3. Automatic updated_at trigger
create or replace function public.set_row_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_row_updated_at();

drop trigger if exists trg_workspaces_updated_at on public.workspaces;
create trigger trg_workspaces_updated_at
  before update on public.workspaces
  for each row execute function public.set_row_updated_at();

-- 4. Security Guard: Prevent browser JWTs from modifying subscription/billing columns
create or replace function public.protect_profile_billing_columns()
returns trigger
language plpgsql
as $$
declare
  jwt_role text := coalesce(current_setting('request.jwt.claim.role', true), auth.role(), '');
begin
  if jwt_role <> 'service_role'
     and current_user not in ('postgres', 'supabase_admin') then
    if new.plan is distinct from old.plan
       or new.plan_status is distinct from old.plan_status
       or new.billing_provider is distinct from old.billing_provider
       or new.provider_customer_id is distinct from old.provider_customer_id
       or new.provider_subscription_id is distinct from old.provider_subscription_id
       or new.current_period_end is distinct from old.current_period_end
       or new.trial_used is distinct from old.trial_used then
      raise exception 'Billing and plan fields can only be modified by server webhooks';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_profiles_protect_billing on public.profiles;
create trigger trg_profiles_protect_billing
  before update on public.profiles
  for each row execute function public.protect_profile_billing_columns();

-- 5. Auto-provision Profile & Empty Workspace when a user signs up
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url, plan, plan_status, current_period_end, trial_used)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(coalesce(new.email, ''), '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url',
    'pro',
    'trialing',
    timezone('utc', now()) + interval '3 days',
    true
  )
  on conflict (id) do update
    set email = excluded.email;

  insert into public.workspaces (user_id, revision, payload)
  values (new.id, 0, '{}'::jsonb)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- 6. Row-Level Security Policies
alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "workspaces_select_own" on public.workspaces;
create policy "workspaces_select_own"
  on public.workspaces for select
  using (auth.uid() = user_id);

drop policy if exists "workspaces_insert_own" on public.workspaces;
create policy "workspaces_insert_own"
  on public.workspaces for insert
  with check (auth.uid() = user_id);

drop policy if exists "workspaces_update_own" on public.workspaces;
create policy "workspaces_update_own"
  on public.workspaces for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
