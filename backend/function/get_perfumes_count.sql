CREATE
OR REPLACE FUNCTION get_perfumes_COUNT() RETURNS BIGINT AS $ $ BEGIN RETURN (
    SELECT
        COUNT(*)
    FROM
        public.perfumes
);

END;

$ $ LANGUAGE plpgsql
SET
    search_path = public;