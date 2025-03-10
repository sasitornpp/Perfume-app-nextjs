CREATE OR REPLACE FUNCTION public.filter_perfumes_for_search (
  search_query TEXT DEFAULT NULL,
  gender_filter TEXT DEFAULT NULL,
  brand_filter TEXT[] DEFAULT NULL,
  accords_filter TEXT[] DEFAULT NULL,
  top_notes_filter TEXT[] DEFAULT NULL,
  middle_notes_filter TEXT[] DEFAULT NULL,
  base_notes_filter TEXT[] DEFAULT NULL,
  page INTEGER DEFAULT 1,
  items_per_page INTEGER DEFAULT 20,
  is_tradable_filter BOOLEAN DEFAULT NULL
) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  total_items INTEGER;
  total_pages INTEGER;
  result JSONB;
BEGIN
  -- Calculate total items matching the conditions
  WITH perfume_scores AS (
    SELECT
      ((
        -- คะแนนจาก search_query (40% สูงสุด)
        CASE WHEN search_query IS NULL THEN 40.0
             ELSE (
               CASE WHEN p.name ILIKE '%' || TRIM(search_query) || '%' THEN 40.0
                    WHEN p.brand ILIKE '%' || TRIM(search_query) || '%' THEN 20.0
                    WHEN p.descriptions ILIKE '%' || TRIM(search_query) || '%' THEN 10.0
                    ELSE 0 END
             )::REAL
        END +
        -- คะแนนจาก brand_filter (30% สูงสุด)
        CASE WHEN brand_filter IS NULL OR cardinality(brand_filter) = 0 THEN 30.0
             ELSE CASE WHEN EXISTS (
                     SELECT 1 FROM unnest(brand_filter) AS bf
                     WHERE p.brand ILIKE '%' || TRIM(bf) || '%'
                   ) THEN 30.0 ELSE 0 END::REAL
        END +
        -- คะแนนจาก gender_filter (20% สูงสุด)
        CASE WHEN gender_filter IS NULL THEN 20.0
             ELSE CASE WHEN p.gender ILIKE '%' || gender_filter || '%' THEN 20.0 ELSE 0 END::REAL
        END +
        -- คะแนนจาก accords (2.5% สูงสุด)
        CASE WHEN accords_filter IS NULL OR cardinality(accords_filter) = 0 THEN 2.5
             ELSE (SELECT COUNT(*)::REAL
                   FROM unnest(p.accords) AS a
                   WHERE EXISTS (
                     SELECT 1 FROM unnest(accords_filter) AS af
                     WHERE a ILIKE '%' || af || '%'
                   )) * 2.5 / GREATEST(cardinality(accords_filter), 1)
        END +
        -- คะแนนจาก top notes (2.5% สูงสุด)
        CASE WHEN top_notes_filter IS NULL OR cardinality(top_notes_filter) = 0 THEN 2.5
             ELSE (SELECT COUNT(*)::REAL
                   FROM unnest(p.top_notes) AS t
                   WHERE EXISTS (
                     SELECT 1 FROM unnest(top_notes_filter) AS tf
                     WHERE t ILIKE '%' || tf || '%'
                   )) * 2.5 / GREATEST(cardinality(top_notes_filter), 1)
        END +
        -- คะแนนจาก middle notes (2.5% สูงสุด)
        CASE WHEN middle_notes_filter IS NULL OR cardinality(middle_notes_filter) = 0 THEN 2.5
             ELSE (SELECT COUNT(*)::REAL
                   FROM unnest(p.middle_notes) AS m
                   WHERE EXISTS (
                     SELECT 1 FROM unnest(middle_notes_filter) AS mf
                     WHERE m ILIKE '%' || mf || '%'
                   )) * 2.5 / GREATEST(cardinality(middle_notes_filter), 1)
        END +
        -- คะแนนจาก base notes (2.5% สูงสุด)
        CASE WHEN base_notes_filter IS NULL OR cardinality(base_notes_filter) = 0 THEN 2.5
             ELSE (SELECT COUNT(*)::REAL
                   FROM unnest(p.base_notes) AS b
                   WHERE EXISTS (
                     SELECT 1 FROM unnest(base_notes_filter) AS bf
                     WHERE b ILIKE '%' || bf || '%'
                   )) * 2.5 / GREATEST(cardinality(base_notes_filter), 1)
        END
      )::REAL) AS match_score
    FROM public.perfumes p
    WHERE
      -- กรอง is_tradable_filter เป็นอันดับแรก
      (is_tradable_filter IS NULL OR p.is_tradable = is_tradable_filter)
      AND (
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
      AND (brand_filter IS NULL OR cardinality(brand_filter) = 0 OR EXISTS (
             SELECT 1 FROM unnest(brand_filter) AS bf
             WHERE p.brand ILIKE '%' || TRIM(bf) || '%'
           ))
      AND (accords_filter IS NULL OR cardinality(accords_filter) = 0 OR EXISTS (
             SELECT 1 FROM unnest(p.accords) AS a
             WHERE EXISTS (
               SELECT 1 FROM unnest(accords_filter) AS af
               WHERE a ILIKE '%' || af || '%'
             )
           ))
      AND (top_notes_filter IS NULL OR cardinality(top_notes_filter) = 0 OR EXISTS (
             SELECT 1 FROM unnest(p.top_notes) AS t
             WHERE EXISTS (
               SELECT 1 FROM unnest(top_notes_filter) AS tf
               WHERE t ILIKE '%' || tf || '%'
             )
           ))
      AND (middle_notes_filter IS NULL OR cardinality(middle_notes_filter) = 0 OR EXISTS (
             SELECT 1 FROM unnest(p.middle_notes) AS m
             WHERE EXISTS (
               SELECT 1 FROM unnest(middle_notes_filter) AS mf
               WHERE m ILIKE '%' || mf || '%'
             )
           ))
      AND (base_notes_filter IS NULL OR cardinality(base_notes_filter) = 0 OR EXISTS (
             SELECT 1 FROM unnest(p.base_notes) AS b
             WHERE EXISTS (
               SELECT 1 FROM unnest(base_notes_filter) AS bf
               WHERE b ILIKE '%' || bf || '%'
             )
           ))
  )
  SELECT COUNT(*)
  INTO total_items
  FROM perfume_scores ps
  WHERE ps.match_score > 0;

  -- Calculate total pages, ensure minimum value is 1
  total_pages := GREATEST(CEIL(total_items::FLOAT / items_per_page)::INTEGER, 1);

  -- Fetch paginated data and build JSONB result
  WITH perfume_scores AS (
    SELECT
      to_jsonb(p) AS perfume_data,
      ((
        -- คะแนนจาก search_query (40% สูงสุด)
        CASE WHEN search_query IS NULL THEN 40.0
             ELSE (
               CASE WHEN p.name ILIKE '%' || TRIM(search_query) || '%' THEN 40.0
                    WHEN p.brand ILIKE '%' || TRIM(search_query) || '%' THEN 20.0
                    WHEN p.descriptions ILIKE '%' || TRIM(search_query) || '%' THEN 10.0
                    ELSE 0 END
             )::REAL
        END +
        -- คะแนนจาก brand_filter (30% สูงสุด)
        CASE WHEN brand_filter IS NULL OR cardinality(brand_filter) = 0 THEN 30.0
             ELSE CASE WHEN EXISTS (
                     SELECT 1 FROM unnest(brand_filter) AS bf
                     WHERE p.brand ILIKE '%' || TRIM(bf) || '%'
                   ) THEN 30.0 ELSE 0 END::REAL
        END +
        -- คะแนนจาก gender_filter (20% สูงสุด)
        CASE WHEN gender_filter IS NULL THEN 20.0
             ELSE CASE WHEN p.gender ILIKE '%' || gender_filter || '%' THEN 20.0 ELSE 0 END::REAL
        END +
        -- คะแนนจาก accords (2.5% สูงสุด)
        CASE WHEN accords_filter IS NULL OR cardinality(accords_filter) = 0 THEN 2.5
             ELSE (SELECT COUNT(*)::REAL
                   FROM unnest(p.accords) AS a
                   WHERE EXISTS (
                     SELECT 1 FROM unnest(accords_filter) AS af
                     WHERE a ILIKE '%' || af || '%'
                   )) * 2.5 / GREATEST(cardinality(accords_filter), 1)
        END +
        -- คะแนนจาก top notes (2.5% สูงสุด)
        CASE WHEN top_notes_filter IS NULL OR cardinality(top_notes_filter) = 0 THEN 2.5
             ELSE (SELECT COUNT(*)::REAL
                   FROM unnest(p.top_notes) AS t
                   WHERE EXISTS (
                     SELECT 1 FROM unnest(top_notes_filter) AS tf
                     WHERE t ILIKE '%' || tf || '%'
                   )) * 2.5 / GREATEST(cardinality(top_notes_filter), 1)
        END +
        -- คะแนนจาก middle notes (2.5% สูงสุด)
        CASE WHEN middle_notes_filter IS NULL OR cardinality(middle_notes_filter) = 0 THEN 2.5
             ELSE (SELECT COUNT(*)::REAL
                   FROM unnest(p.middle_notes) AS m
                   WHERE EXISTS (
                     SELECT 1 FROM unnest(middle_notes_filter) AS mf
                     WHERE m ILIKE '%' || mf || '%'
                   )) * 2.5 / GREATEST(cardinality(middle_notes_filter), 1)
        END +
        -- คะแนนจาก base notes (2.5% สูงสุด)
        CASE WHEN base_notes_filter IS NULL OR cardinality(base_notes_filter) = 0 THEN 2.5
             ELSE (SELECT COUNT(*)::REAL
                   FROM unnest(p.base_notes) AS b
                   WHERE EXISTS (
                     SELECT 1 FROM unnest(base_notes_filter) AS bf
                     WHERE b ILIKE '%' || bf || '%'
                   )) * 2.5 / GREATEST(cardinality(base_notes_filter), 1)
        END
      )::REAL) AS match_score
    FROM public.perfumes p
    WHERE
      -- กรอง is_tradable_filter เป็นอันดับแรก
      (is_tradable_filter IS NULL OR p.is_tradable = is_tradable_filter)
      AND (
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
      AND (brand_filter IS NULL OR cardinality(brand_filter) = 0 OR EXISTS (
             SELECT 1 FROM unnest(brand_filter) AS bf
             WHERE p.brand ILIKE '%' || TRIM(bf) || '%'
           ))
      AND (accords_filter IS NULL OR cardinality(accords_filter) = 0 OR EXISTS (
             SELECT 1 FROM unnest(p.accords) AS a
             WHERE EXISTS (
               SELECT 1 FROM unnest(accords_filter) AS af
               WHERE a ILIKE '%' || af || '%'
             )
           ))
      AND (top_notes_filter IS NULL OR cardinality(top_notes_filter) = 0 OR EXISTS (
             SELECT 1 FROM unnest(p.top_notes) AS t
             WHERE EXISTS (
               SELECT 1 FROM unnest(top_notes_filter) AS tf
               WHERE t ILIKE '%' || tf || '%'
             )
           ))
      AND (middle_notes_filter IS NULL OR cardinality(middle_notes_filter) = 0 OR EXISTS (
             SELECT 1 FROM unnest(p.middle_notes) AS m
             WHERE EXISTS (
               SELECT 1 FROM unnest(middle_notes_filter) AS mf
               WHERE m ILIKE '%' || mf || '%'
             )
           ))
      AND (base_notes_filter IS NULL OR cardinality(base_notes_filter) = 0 OR EXISTS (
             SELECT 1 FROM unnest(p.base_notes) AS b
             WHERE EXISTS (
               SELECT 1 FROM unnest(base_notes_filter) AS bf
               WHERE b ILIKE '%' || bf || '%'
             )
           ))
  ),
  filtered_results AS (
    SELECT
      perfume_data
    FROM perfume_scores ps
    WHERE ps.match_score > 0
    ORDER BY ps.match_score DESC, (ps.perfume_data ->> 'name')::TEXT
    LIMIT items_per_page OFFSET (page - 1) * items_per_page
  )
  SELECT jsonb_build_object(
    'data', COALESCE(jsonb_agg(perfume_data), '[]'::jsonb),
    'totalPage', total_pages
  )
  INTO result
  FROM filtered_results;

  RETURN result;
END;
$$;