-- Ekpad schema v2 — social, messaging, verification, and safety primitives
set check_function_bodies = off;

create table if not exists public.follows (
  follower_id uuid not null references public.profiles (id) on delete cascade,
  followee_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, followee_id),
  constraint follows_no_self check (follower_id <> followee_id)
);

create table if not exists public.threads (
  id uuid primary key default gen_random_uuid(),
  is_group boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.threads (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  attachments jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  edited_at timestamptz null,
  updated_at timestamptz not null default now()
);

create table if not exists public.thread_participants (
  thread_id uuid not null references public.threads (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  last_read_msg_id uuid null references public.messages (id),
  joined_at timestamptz not null default now(),
  primary key (thread_id, user_id)
);

create table if not exists public.blocks (
  user_id uuid not null references public.profiles (id) on delete cascade,
  blocked_user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, blocked_user_id)
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  target_user_id uuid references public.profiles (id) on delete set null,
  message_id uuid references public.messages (id) on delete set null,
  reason text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.game_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  platform text not null,
  external_username text not null,
  external_id text null,
  visibility text not null default 'public',
  verified boolean not null default false,
  verify_code text null,
  updated_at timestamptz not null default now()
);

create index if not exists idx_follows_follower on public.follows (follower_id);
create index if not exists idx_follows_followee on public.follows (followee_id);
create index if not exists idx_messages_thread_created on public.messages (thread_id, created_at desc);
create index if not exists idx_activities_user_created on public.activities (user_id, created_at desc);
create index if not exists idx_game_profiles_user_platform on public.game_profiles (user_id, platform);

create index if not exists profiles_search_idx on public.profiles using gin (
  to_tsvector(
    'simple',
    coalesce(handle, '') || ' ' || coalesce(display_name, '') || ' ' || coalesce(bio, '')
  )
);

alter table public.follows enable row level security;
alter table public.threads enable row level security;
alter table public.thread_participants enable row level security;
alter table public.messages enable row level security;
alter table public.blocks enable row level security;
alter table public.reports enable row level security;
alter table public.game_profiles enable row level security;
alter table if exists public.profiles enable row level security;

create policy "Public read follows" on public.follows for select using (true);
create policy "Users manage own follows" on public.follows
  for insert with check (auth.uid() = follower_id)
  using (auth.uid() = follower_id);
create policy "Users delete own follows" on public.follows
  for delete using (auth.uid() = follower_id);

create policy "Participants can read threads" on public.threads
  for select using (
    exists (
      select 1 from public.thread_participants tp
      where tp.thread_id = threads.id and tp.user_id = auth.uid()
    )
  );
create policy "Authenticated can insert threads" on public.threads
  for insert with check (auth.uid() is not null);

create policy "Participants manage membership" on public.thread_participants
  for insert with check (auth.uid() = user_id);
create policy "Participants read membership" on public.thread_participants
  for select using (auth.uid() = user_id);
create policy "Participants update membership" on public.thread_participants
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Participants can leave threads" on public.thread_participants
  for delete using (auth.uid() = user_id);

create policy "Participants read messages" on public.messages
  for select using (
    exists (
      select 1 from public.thread_participants tp
      where tp.thread_id = messages.thread_id and tp.user_id = auth.uid()
    )
  );
create policy "Senders post messages" on public.messages
  for insert with check (
    auth.uid() = sender_id and
    exists (
      select 1 from public.thread_participants tp
      where tp.thread_id = messages.thread_id and tp.user_id = auth.uid()
    )
  );
create policy "Senders edit own messages" on public.messages
  for update using (auth.uid() = sender_id) with check (auth.uid() = sender_id);

create policy "Owners read blocks" on public.blocks
  for select using (auth.uid() = user_id);
create policy "Owners insert blocks" on public.blocks
  for insert with check (auth.uid() = user_id);
create policy "Owners update blocks" on public.blocks
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Owners delete blocks" on public.blocks
  for delete using (auth.uid() = user_id);

create policy "Signed-in users report" on public.reports
  for insert with check (auth.uid() = reporter_id);
create policy "Mods view reports" on public.reports
  for select using (auth.role() = 'service_role');

create policy "Owners read game profiles" on public.game_profiles
  for select using (auth.uid() = user_id);
create policy "Owners upsert game profiles" on public.game_profiles
  for insert with check (auth.uid() = user_id);
create policy "Owners update game profiles" on public.game_profiles
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Service role verifies game profiles" on public.game_profiles
  for update using (auth.role() = 'service_role');

create policy "Profiles are public" on public.profiles
  for select using (true);

create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger messages_updated_at
  before update on public.messages
  for each row execute procedure public.touch_updated_at();

create trigger game_profiles_updated_at
  before update on public.game_profiles
  for each row execute procedure public.touch_updated_at();

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.touch_updated_at();

create or replace function public.search_profiles(q text)
returns table (
  handle text,
  display_name text,
  bio text,
  rank real
) language sql stable as $$
  select
    p.handle,
    p.display_name,
    p.bio,
    ts_rank(
      to_tsvector('simple', coalesce(p.handle, '') || ' ' || coalesce(p.display_name, '') || ' ' || coalesce(p.bio, '')),
      plainto_tsquery('simple', q)
    ) as rank
  from public.profiles p
  where q <> '' and
    to_tsvector('simple', coalesce(p.handle, '') || ' ' || coalesce(p.display_name, '') || ' ' || coalesce(p.bio, ''))
      @@ plainto_tsquery('simple', q)
  order by rank desc
  limit 20
$$;
