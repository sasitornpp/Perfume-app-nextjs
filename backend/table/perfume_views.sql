create table public.perfume_views (
  perfume_id uuid not null,
  view_date date null,
  views_count integer null,
  id uuid not null default gen_random_uuid (),
  constraint perfume_views_pkey primary key (id),
  constraint perfume_views_perfume_id_fkey foreign KEY (perfume_id) references perfumes (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_perfume_views_date_count on public.perfume_views using btree (view_date, views_count desc) TABLESPACE pg_default;