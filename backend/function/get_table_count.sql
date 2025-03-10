create or replace function get_table_count (table_name TEXT) RETURNS BIGINT as $$
DECLARE
  total_count BIGINT;
BEGIN
  -- ใช้ dynamic SQL เพื่อนับ rows จากตารางที่ระบุ
  EXECUTE format('SELECT COUNT(*) FROM public.%I', table_name)
  INTO total_count;
  
  RETURN total_count;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error counting rows in table %: %', table_name, SQLERRM;
    RETURN -1; -- Return -1 ถ้ามี error (เช่น ตาราง不存在)
END;
$$ LANGUAGE plpgsql
set
  search_path = public;