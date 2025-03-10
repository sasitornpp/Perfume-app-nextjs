create or replace function public.fetch_unique_perfume_data () RETURNS JSON as $$
BEGIN
    RETURN (
        SELECT json_build_object(
            'brand', (
                SELECT json_agg(json_build_object(
                    'name', brand,
                    'logo', logo
                ))
                FROM (
                    SELECT DISTINCT ON (brand) brand, logo
                    FROM public.perfumes
                    WHERE brand IS NOT NULL 
                    AND logo IS NOT NULL
                    ORDER BY brand
                ) AS unique_brands
            ),
            'top_notes', (
                SELECT json_agg(DISTINCT t.note ORDER BY t.note)
                FROM public.perfumes p,
                LATERAL unnest(p.top_notes) AS t(note)
                WHERE p.top_notes IS NOT NULL 
                AND t.note IS NOT NULL
            ),
            'middle_notes', (
                SELECT json_agg(DISTINCT t.note ORDER BY t.note)
                FROM public.perfumes p,
                LATERAL unnest(p.middle_notes) AS t(note)
                WHERE p.middle_notes IS NOT NULL 
                AND t.note IS NOT NULL
            ),
            'base_notes', (
                SELECT json_agg(DISTINCT t.note ORDER BY t.note)
                FROM public.perfumes p,
                LATERAL unnest(p.base_notes) AS t(note)
                WHERE p.base_notes IS NOT NULL 
                AND t.note IS NOT NULL
            ),
            'accords', (
                SELECT json_agg(DISTINCT t.accord ORDER BY t.accord)
                FROM public.perfumes p,
                LATERAL unnest(p.accords) AS t(accord)
                WHERE p.accords IS NOT NULL 
                AND t.accord IS NOT NULL
            ),
            'perfumer', (
                SELECT json_agg(DISTINCT perfumer ORDER BY perfumer)
                FROM public.perfumes
                WHERE perfumer IS NOT NULL
            )
        )
    );
END;
$$ LANGUAGE plpgsql
set
  search_path = public;