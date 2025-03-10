create table public.albums (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null default auth.uid (),
  title text not null,
  descriptions text not null default ''::text,
  private boolean not null default false,
  likes uuid[] not null default '{}'::uuid[],
  images text null,
  created_at timestamp with time zone not null default now(),
  perfumes_id uuid[] not null default '{}'::uuid[],
  constraint album_pkey primary key (id),
  constraint album_user_id_fkey foreign KEY (user_id) references profiles (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;