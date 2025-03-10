create or replace function public.filter_perfumes (
  search_query TEXT default null,
  gender_filter TEXT default null,
  brand_filter TEXT default null,
  accords_filter text[] default null,
  top_notes_filter text[] default null,
  middle_notes_filter text[] default null,
  base_notes_filter text[] default null,
  page INTEGER default 1,
  items_per_page INTEGER default 20
) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER
set
  search_path = public as $$
BEGIN
  RETURN (
    WITH perfume_scores AS (
      SELECT
        to_jsonb(p) AS perfume_data,
        -- คำนวณคะแนนความเหมือนเป็นเปอร์เซ็นต์ (สูงสุด 100%)
        ((
          -- คะแนนจาก accords (25% สูงสุด)
          CASE WHEN accords_filter IS NULL OR cardinality(accords_filter) = 0 THEN 0
               ELSE (SELECT COUNT(*)::REAL
                     FROM unnest(p.accords) AS a
                     WHERE EXISTS (
                       SELECT 1 FROM unnest(accords_filter) AS af
                       WHERE a ILIKE '%' || af || '%'
                     )) * 25.0 / GREATEST(cardinality(accords_filter), cardinality(COALESCE(p.accords, ARRAY[]::TEXT[])))
          END +
          -- คะแนนจาก top notes (25% สูงสุด)
          CASE WHEN top_notes_filter IS NULL OR cardinality(top_notes_filter) = 0 THEN 0
               ELSE (SELECT COUNT(*)::REAL
                     FROM unnest(p.top_notes) AS t
                     WHERE EXISTS (
                       SELECT 1 FROM unnest(top_notes_filter) AS tf
                       WHERE t ILIKE '%' || tf || '%'
                     )) * 25.0 / GREATEST(cardinality(top_notes_filter), cardinality(COALESCE(p.top_notes, ARRAY[]::TEXT[])))
          END +
          -- คะแนนจาก middle notes (25% สูงสุด)
          CASE WHEN middle_notes_filter IS NULL OR cardinality(middle_notes_filter) = 0 THEN 0
               ELSE (SELECT COUNT(*)::REAL
                     FROM unnest(p.middle_notes) AS m
                     WHERE EXISTS (
                       SELECT 1 FROM unnest(middle_notes_filter) AS mf
                       WHERE m ILIKE '%' || mf || '%'
                     )) * 25.0 / GREATEST(cardinality(middle_notes_filter), cardinality(COALESCE(p.middle_notes, ARRAY[]::TEXT[])))
          END +
          -- คะแนนจาก base notes (25% สูงสุด)
          CASE WHEN base_notes_filter IS NULL OR cardinality(base_notes_filter) = 0 THEN 0
               ELSE (SELECT COUNT(*)::REAL
                     FROM unnest(p.base_notes) AS b
                     WHERE EXISTS (
                       SELECT 1 FROM unnest(base_notes_filter) AS bf
                       WHERE b ILIKE '%' || bf || '%'
                     )) * 25.0 / GREATEST(cardinality(base_notes_filter), cardinality(COALESCE(p.base_notes, ARRAY[]::TEXT[])))
          END
        )::REAL) AS match_score
      FROM public.perfumes p
      WHERE
        (
          search_query IS NULL OR
          p.name ILIKE '%' || TRIM(search_query) || '%' OR
          p.brand ILIKE '%' || TRIM(search_query) || '%' OR
          p.gender ILIKE '%' || TRIM(search_query) || '%' OR
          p.descriptions ILIKE '%' || TRIM(search_query) || '%' OR
          EXISTS (
            SELECT 1 FROM unnest(p.accords) AS accord
            WHERE accord ILIKE '%' || search_query || '%'
          ) OR
          EXISTS (
            SELECT 1 FROM unnest(p.top_notes) AS top_note
            WHERE top_note ILIKE '%' || search_query || '%'
          ) OR
          EXISTS (
            SELECT 1 FROM unnest(p.middle_notes) AS middle_note
            WHERE middle_note ILIKE '%' || search_query || '%'
          ) OR
          EXISTS (
            SELECT 1 FROM unnest(p.base_notes) AS base_note
            WHERE base_note ILIKE '%' || search_query || '%'
          )
        )
        AND (gender_filter IS NULL OR p.gender ILIKE '%' || gender_filter || '%')
        AND (brand_filter IS NULL OR p.brand ILIKE '%' || brand_filter || '%')
    ),
    filtered_results AS (
      SELECT
        perfume_data,
        match_score
      FROM perfume_scores ps
      WHERE ps.match_score > 0 OR (
        (accords_filter IS NULL OR cardinality(accords_filter) = 0) AND
        (top_notes_filter IS NULL OR cardinality(top_notes_filter) = 0) AND
        (middle_notes_filter IS NULL OR cardinality(middle_notes_filter) = 0) AND
        (base_notes_filter IS NULL OR cardinality(base_notes_filter) = 0)
      )
      ORDER BY ps.match_score DESC, (ps.perfume_data ->> 'name')::TEXT
      LIMIT items_per_page OFFSET (page - 1) * items_per_page
    )
    SELECT COALESCE(
      jsonb_agg(
        perfume_data || jsonb_build_object('match_score', match_score)
      ),
      '[]'::jsonb
    )
    FROM filtered_results
  );
END;
$$;