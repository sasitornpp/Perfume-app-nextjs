CREATE OR REPLACE FUNCTION get_top_3_views_all_time()
RETURNS TABLE (
  perfume_data JSONB,
  total_views_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
    WITH aggregated_views AS (
      SELECT 
        pv.perfume_id,
        SUM(pv.views_count) AS total_views
      FROM public.perfume_views pv
      GROUP BY pv.perfume_id
    )
    SELECT 
      to_jsonb(p) AS perfume_data,
      av.total_views AS total_views_count
    FROM aggregated_views av
    LEFT JOIN public.perfumes p ON av.perfume_id = p.id
    ORDER BY av.total_views DESC
    LIMIT 3;
END;
$$ LANGUAGE plpgsql SET search_path = public;