CREATE
OR REPLACE FUNCTION get_comments_by_perfume_id(p_perfume_id uuid) RETURNS jsonb AS $ $ DECLARE result jsonb;

BEGIN WITH comment_details AS (
    SELECT
        c.id,
        jsonb_build_object(
            'id',
            p.id :: text,
            'name',
            p.name,
            'avatar',
            p.images
        ) AS user_data,
        c.text,
        c.images,
        c.likes,
        c.created_at,
        COALESCE(
            (
                SELECT
                    jsonb_agg(
                        jsonb_build_object(
                            'id',
                            r.id :: text,
                            'user_data',
                            jsonb_build_object(
                                'id',
                                pr.id :: text,
                                'name',
                                pr.name,
                                'avatar',
                                pr.images
                            ),
                            'text',
                            r.text,
                            'images',
                            r.images,
                            'likes',
                            r.likes,
                            'created_at',
                            r.created_at
                        )
                    )
                FROM
                    public.reply r
                    LEFT JOIN public.profiles pr ON pr.id = r."user"
                WHERE
                    r.comments_id = c.id
            ),
            '[]' :: jsonb
        ) AS replies
    FROM
        public.comments c
        LEFT JOIN public.profiles p ON p.id = c."user"
    WHERE
        c.perfumes_id = p_perfume_id
)
SELECT
    jsonb_agg(
        jsonb_build_object(
            'id',
            cd.id,
            'user_data',
            cd.user_data,
            'text',
            cd.text,
            'images',
            cd.images,
            'likes',
            cd.likes,
            'created_at',
            cd.created_at,
            'replies',
            cd.replies
        )
        ORDER BY
            cd.created_at DESC
    ) INTO result
FROM
    comment_details cd;

RETURN COALESCE (result, '[]' :: jsonb);

EXCEPTION
WHEN OTHERS THEN RAISE NOTICE 'Error: %',
SQLERRM;

RETURN '[]' :: jsonb;

END;

$ $ LANGUAGE plpgsql;