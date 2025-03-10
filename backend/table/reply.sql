create table public.reply (
  id uuid not null default gen_random_uuid (),
  "user" uuid not null,
  text text not null,
  images text[] not null default '{}'::text[],
  likes uuid[] not null default '{}'::uuid[],
  created_at timestamp with time zone not null default now(),
  comments_id uuid null,
  constraint reply_pkey primary key (id),
  constraint reply_comments_id_fkey foreign KEY (comments_id) references comments (id) on update CASCADE on delete CASCADE,
  constraint reply_user_fkey foreign KEY ("user") references profiles (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;