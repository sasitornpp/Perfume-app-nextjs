create or replace function get_perfumes_paginated (page_number INTEGER, items_per_page INTEGER) RETURNS table (
  id uuid,
  name text,
  brand text,
  gender text,
  accords text[],
  descriptions text,
  perfumer text,
  top_notes text[],
  middle_notes text[],
  base_notes text[],
  images text[],
  logo text,
  created_at timestamp with time zone,
  liked integer
) as $$
BEGIN
  RETURN QUERY
    SELECT *
    FROM public.perfumes
    ORDER BY name ASC
    LIMIT items_per_page
    OFFSET (page_number - 1) * items_per_page;
END;
$$ LANGUAGE plpgsql
set
  search_path = public;