CREATE OR REPLACE FUNCTION get_top_5_views_by_date(target_date DATE) RETURNS JSONB AS $$ BEGIN RETURN COALESCE( (
SELECT  jsonb_agg( to_jsonb(sub.p) || jsonb_build_object('views_count',sub.views_count) )
FROM
(
	SELECT  p
	       ,pv.views_count
	FROM public.perfume_views pv
	LEFT JOIN public.perfumes p
	ON pv.perfume_id = p.id
	WHERE pv.view_date = target_date
	ORDER BY pv.views_count DESC
	LIMIT 5
) sub), '[]'::jsonb ); END; $$ LANGUAGE plpgsql

SET search_path = public;