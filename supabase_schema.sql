-- GREEN TRACE SUPABASE DATABASE SCHEMA MIGRATION

-- 1. Profiles Table (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  city text,
  household_size int default 1,
  main_transport_mode text,
  avg_daily_distance_km numeric default 0,
  diet_type text,
  food_delivery_frequency text,
  electricity_usage_level text,
  ac_usage_level text,
  shopping_frequency text,
  reusable_habit text,
  baseline_daily_co2e numeric default 8.0,
  green_score_goal int default 75,
  weekly_reduction_goal numeric default 10,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Daily Entries Table
create table public.daily_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  entry_date date not null,
  total_co2e numeric default 0,
  travel_co2e numeric default 0,
  food_co2e numeric default 0,
  energy_co2e numeric default 0,
  shopping_co2e numeric default 0,
  waste_co2e numeric default 0,
  carbon_saved numeric default 0,
  green_score int default 70,
  biggest_source text,
  diagnosis text,
  created_at timestamptz default now(),
  unique(user_id, entry_date)
);

-- 3. Activities Table
create table public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  daily_entry_id uuid references public.daily_entries(id) on delete cascade,
  category text not null, -- 'travel', 'food', 'energy', 'shopping', 'waste'
  activity_type text not null,
  activity_label text,
  quantity numeric default 1,
  unit text,
  emission_factor numeric,
  co2e numeric default 0,
  money_saved numeric default 0,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- 4. Eco Actions Table
create table public.eco_actions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  category text,
  difficulty text,
  estimated_carbon_saved numeric default 0,
  estimated_money_saved numeric default 0,
  completed boolean default false,
  completed_at timestamptz,
  source text default 'recommendation',
  created_at timestamptz default now()
);

-- 5. Challenges Table
create table public.challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  target_value numeric default 1,
  current_value numeric default 0,
  unit text,
  progress_percent int default 0,
  active boolean default true,
  created_at timestamptz default now()
);

-- 6. Weekly Reports Table
create table public.weekly_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  week_start date,
  week_end date,
  total_co2e numeric default 0,
  avg_daily_co2e numeric default 0,
  total_saved numeric default 0,
  best_day date,
  highest_day date,
  biggest_source text,
  actions_completed int default 0,
  green_score_change int default 0,
  summary text,
  created_at timestamptz default now()
);

-- 7. Coach Messages Table
create table public.coach_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null, -- 'user', 'assistant' (or 'coach')
  message text not null,
  created_at timestamptz default now()
);

-- 8. What-If Simulations Table
create table public.what_if_simulations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  current_choice text,
  better_choice text,
  category text,
  current_co2e numeric default 0,
  better_co2e numeric default 0,
  co2e_saved numeric default 0,
  money_saved numeric default 0,
  recommendation text,
  created_at timestamptz default now()
);

-- ENABLE ROW LEVEL SECURITY
alter table public.profiles enable row level security;
alter table public.daily_entries enable row level security;
alter table public.activities enable row level security;
alter table public.eco_actions enable row level security;
alter table public.challenges enable row level security;
alter table public.weekly_reports enable row level security;
alter table public.coach_messages enable row level security;
alter table public.what_if_simulations enable row level security;

-- ROW LEVEL SECURITY POLICIES

-- Profiles policies
create policy "Users can view own profile"
on public.profiles for select
using (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id);

create policy "Users can insert own profile"
on public.profiles for insert
with check (auth.uid() = id);

-- Daily entries policies
create policy "Users can manage own daily entries"
on public.daily_entries for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Activities policies
create policy "Users can manage own activities"
on public.activities for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Eco actions policies
create policy "Users can manage own eco actions"
on public.eco_actions for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Challenges policies
create policy "Users can manage own challenges"
on public.challenges for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Weekly reports policies
create policy "Users can manage own weekly reports"
on public.weekly_reports for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Coach messages policies
create policy "Users can manage own coach messages"
on public.coach_messages for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- What-If simulations policies
create policy "Users can manage own simulations"
on public.what_if_simulations for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
