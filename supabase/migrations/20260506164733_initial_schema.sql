-- KOSA initial schema
-- Tables: profiles, events, event_rsvps, notices, notice_reads, feedback
-- Storage: avatars bucket
-- Conventions: RLS on every public table; security-definer functions live in `private` schema.

create schema if not exists private;

-- ----------------------------------------------------------------------------
-- Helper: updated_at touch trigger
-- ----------------------------------------------------------------------------
create or replace function private.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- profiles
-- ----------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  display_name text,
  phone text,
  residence text,
  workplace text,
  focus text,
  details text,
  avatar_url text,

  -- Member identity
  member_id text unique,
  year_joined int,

  -- Status
  is_admin boolean not null default false,
  is_active boolean not null default true,
  membership_starts_at date,
  membership_ends_at date,

  -- Legacy archive (carried over from the 2022 CSV when applicable)
  legacy_address text,
  legacy_business_details text,
  legacy_timestamp text,
  source text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_full_name_idx on public.profiles using gin (to_tsvector('simple', coalesce(full_name, '')));
create index profiles_workplace_idx on public.profiles (workplace);

alter table public.profiles enable row level security;

create policy "Authenticated users can read all profiles"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Admins can update any profile"
  on public.profiles for update
  to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true))
  with check (true);

create policy "Admins can delete any profile"
  on public.profiles for delete
  to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true));

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function private.set_updated_at();

-- New auth user → profile row
create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, private
as $$
begin
  insert into public.profiles (id, email, full_name, source)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    'self-signup'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

-- ----------------------------------------------------------------------------
-- events
-- ----------------------------------------------------------------------------
create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  venue text,
  city text,
  capacity int,
  cover_image_url text,
  is_published boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index events_starts_at_idx on public.events (starts_at desc);

alter table public.events enable row level security;

create policy "Authenticated users read published events"
  on public.events for select
  to authenticated
  using (is_published = true);

create policy "Admins read all events"
  on public.events for select
  to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true));

create policy "Admins manage events"
  on public.events for all
  to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true));

create trigger events_set_updated_at
  before update on public.events
  for each row execute function private.set_updated_at();

-- ----------------------------------------------------------------------------
-- event_rsvps
-- ----------------------------------------------------------------------------
create type public.rsvp_status as enum ('going', 'maybe', 'not_going');

create table public.event_rsvps (
  event_id uuid not null references public.events(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  status public.rsvp_status not null default 'going',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (event_id, profile_id)
);

create index event_rsvps_event_idx on public.event_rsvps (event_id);

alter table public.event_rsvps enable row level security;

create policy "Authenticated users read all RSVPs"
  on public.event_rsvps for select
  to authenticated
  using (true);

create policy "Users insert own RSVPs"
  on public.event_rsvps for insert
  to authenticated
  with check (auth.uid() = profile_id);

create policy "Users update own RSVPs"
  on public.event_rsvps for update
  to authenticated
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

create policy "Users delete own RSVPs"
  on public.event_rsvps for delete
  to authenticated
  using (auth.uid() = profile_id);

create trigger event_rsvps_set_updated_at
  before update on public.event_rsvps
  for each row execute function private.set_updated_at();

-- ----------------------------------------------------------------------------
-- notices
-- ----------------------------------------------------------------------------
create table public.notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  pinned boolean not null default false,
  is_published boolean not null default true,
  published_at timestamptz not null default now(),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index notices_published_at_idx on public.notices (published_at desc);

alter table public.notices enable row level security;

create policy "Authenticated users read published notices"
  on public.notices for select
  to authenticated
  using (is_published = true);

create policy "Admins manage notices"
  on public.notices for all
  to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true));

create trigger notices_set_updated_at
  before update on public.notices
  for each row execute function private.set_updated_at();

-- ----------------------------------------------------------------------------
-- notice_reads
-- ----------------------------------------------------------------------------
create table public.notice_reads (
  notice_id uuid not null references public.notices(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (notice_id, profile_id)
);

alter table public.notice_reads enable row level security;

create policy "Users manage own notice reads"
  on public.notice_reads for all
  to authenticated
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

-- ----------------------------------------------------------------------------
-- feedback
-- ----------------------------------------------------------------------------
create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  category text not null default 'general',
  message text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

alter table public.feedback enable row level security;

create policy "Users insert own feedback"
  on public.feedback for insert
  to authenticated
  with check (auth.uid() = profile_id or profile_id is null);

create policy "Users read own feedback"
  on public.feedback for select
  to authenticated
  using (auth.uid() = profile_id);

create policy "Admins read all feedback"
  on public.feedback for select
  to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true));

create policy "Admins update feedback"
  on public.feedback for update
  to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true));

-- ----------------------------------------------------------------------------
-- Storage: avatars bucket
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Anyone can read avatars"
  on storage.objects for select
  to public
  using (bucket_id = 'avatars');

create policy "Users upload own avatar"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users update own avatar"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users delete own avatar"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
