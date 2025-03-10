CREATE TABLE public.baskets ( amount smallint not null default '1'::smallint, user_id uuid not null default auth.uid (), perfume_id uuid not null, created_at timestamp
WITH time zone not null default now
(
), id uuid not null default gen_random_uuid (), constraint baskets_pkey primary key (id), constraint baskets_perfume_id_fkey foreign KEY (perfume_id) references perfumes (id)
ON update CASCADE
ON
DELETE CASCADE ) TABLESPACE pg_default;