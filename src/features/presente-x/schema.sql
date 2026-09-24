-- Run this in your Supabase SQL Editor

create table if not exists presente_days (
  id bigint primary key generated always as identity,
  day_number int not null unique,
  title text default 'Surpresa!',
  description text,
  video_url text, -- Full YouTube URL
  youtube_id text, -- ID extracted for embedding
  quiz_data jsonb, -- { "question": "...", "options": ["A", "B"], "correct": 0 }
  custom_content text, -- Markdown or extra text
  unlock_date timestamptz not null, -- When this day becomes available
  points_reward int default 100,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Enable RLS
alter table presente_days enable row level security;

-- Policies
drop policy if exists "Public read access" on presente_days;
drop policy if exists "Authenticated admin access" on presente_days;
create policy "Public read access" on presente_days for select using (true);
create policy "Authenticated admin access" on presente_days for all using (auth.role() = 'authenticated');

-- ========================================
-- USERS & PROGRESS TABLES
-- ========================================

create table if not exists presente_users (
  id bigint primary key generated always as identity,
  full_name text not null unique,
  name_normalized text not null unique,
  total_points int default 0,
  coins_balance int default 0,
  current_streak int default 0,
  longest_streak int default 0,
  last_visit_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists presente_user_progress (
  id bigint primary key generated always as identity,
  user_id bigint not null references presente_users(id) on delete cascade,
  day_number int not null,
  points_earned int default 0,
  completed_at timestamptz default now(),
  unique(user_id, day_number)
);

create table if not exists presente_user_rewards (
  id bigint primary key generated always as identity,
  user_id bigint not null references presente_users(id) on delete cascade,
  reward_id bigint,
  reward_name text not null,
  reward_description text,
  points_cost int not null,
  coins_spent int default 0,
  is_redeemed boolean default false,
  redeemed_at timestamptz default now()
);

create table if not exists presente_rewards (
  id bigint primary key generated always as identity,
  title text not null,
  description text,
  cost_coins int not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table presente_users enable row level security;
alter table presente_user_progress enable row level security;
alter table presente_user_rewards enable row level security;
alter table presente_rewards enable row level security;
drop policy if exists "Public read users" on presente_users;
drop policy if exists "Public insert users" on presente_users;
drop policy if exists "Public update users" on presente_users;
create policy "Public read users" on presente_users for select using (true);
create policy "Public insert users" on presente_users for insert with check (true);
create policy "Public update users" on presente_users for update using (true);

drop policy if exists "Public read progress" on presente_user_progress;
drop policy if exists "Public insert progress" on presente_user_progress;
drop policy if exists "Public update progress" on presente_user_progress;
create policy "Public read progress" on presente_user_progress for select using (true);
create policy "Public insert progress" on presente_user_progress for insert with check (true);
create policy "Public update progress" on presente_user_progress for update using (true);

drop policy if exists "Public read rewards" on presente_user_rewards;
drop policy if exists "Public insert rewards" on presente_user_rewards;
create policy "Public read rewards" on presente_user_rewards for select using (true);
create policy "Public insert rewards" on presente_user_rewards for insert with check (true);

drop policy if exists "Public read store" on presente_rewards;
drop policy if exists "Public write store" on presente_rewards;
create policy "Public read store" on presente_rewards for select using (true);
create policy "Public write store" on presente_rewards for all using (auth.role() = 'authenticated');

create index if not exists idx_users_name_normalized on presente_users(name_normalized);
create index if not exists idx_user_progress_user_id on presente_user_progress(user_id);
create index if not exists idx_user_rewards_user_id on presente_user_rewards(user_id);
create index if not exists idx_rewards_active on presente_rewards(is_active);

insert into presente_users (full_name, name_normalized, total_points, coins_balance, current_streak, longest_streak, last_visit_date)
values
  ('Sthefany Nayure Campos Vieira', 'sthefany nayure campos vieira', 350, 0, 5, 10, now()::date),
  ('Hugo Viegas', 'hugo viegas', 200, 0, 3, 8, now()::date)
on conflict do nothing;
