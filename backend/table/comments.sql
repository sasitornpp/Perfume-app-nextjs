create table public.comments (
  "user" uuid not null,
  text text not null,
  created_at timestamp with time zone not null default now(),
  likes uuid[] not null,
  images text[] not null default '{}'::text[],
  id uuid not null default gen_random_uuid (),
  perfumes_id uuid not null,
  constraint comments_pkey primary key (id),
  constraint comments_id_key unique (id),
  constraint comments_user_fkey foreign KEY ("user") references profiles (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;