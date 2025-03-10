create table public.profiles (
  id uuid not null default auth.uid (),
  created_at timestamp with time zone not null default now(),
  name text not null,
  images text null,
  bio text null,
  gender text not null,
  suggestions_perfumes jsonb[] null,
  constraint profiles_pkey primary key (id)
) TABLESPACE pg_default;