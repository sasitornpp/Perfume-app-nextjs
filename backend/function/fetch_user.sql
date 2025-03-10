create or replace function public.fetch_user (user_id UUID) RETURNS JSONB as $$
BEGIN
  RETURN (
    SELECT jsonb_build_object(
      'profile', (
        SELECT jsonb_build_object(
          'id', p.id,
          'created_at', p.created_at,
          'name', p.name,
          'images', p.images,
          'bio', p.bio,
          'gender', p.gender,
          'suggestions_perfumes', p.suggestions_perfumes
        )
        FROM public.profiles p
        WHERE p.id = fetch_user.user_id
        LIMIT 1
      ),
      'albums', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', a.id,
            'user_id', a.user_id,
            'title', a.title,
            'descriptions', a.descriptions,
            'private', a.private,
            'likes', a.likes,
            'images', a.images,
            'created_at', a.created_at,
            'perfumes_id', a.perfumes_id,
            'perfumes', (
              SELECT jsonb_agg(to_jsonb(pf))
              FROM public.perfumes pf
              WHERE pf.id = ANY(a.perfumes_id)
            )
          )
        )
        FROM public.albums a
        WHERE a.user_id = fetch_user.user_id
      ),
      'baskets', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', b.id,
            'amount', b.amount,
            'user_id', b.user_id,
            'perfume_id', b.perfume_id,
            'created_at', b.created_at
          )
        )
        FROM public.baskets b
        WHERE b.user_id = fetch_user.user_id
      ),
      'perfumes', (
        SELECT jsonb_agg(
          to_jsonb(pf)
        )
        FROM public.perfumes pf
        WHERE pf.user_id = fetch_user.user_id
      )
    )
  );
END;
$$ LANGUAGE plpgsql
set
  search_path = public;