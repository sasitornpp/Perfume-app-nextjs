CREATE or replace function toggle_perfume_like (p_user_id uuid, p_perfume_id uuid) RETURNS boolean AS $ $ DECLARE current_likes uuid []; like_exists boolean; BEGIN -- ดึง array ของ likes ปัจจุบัน 

SELECT  likes INTO current_likes
FROM public.perfumes
WHERE id = p_perfume_id FOR UPDATE
;

-- ตรวจสอบว่า user_id อยู่ใน likes หรือไม่ 
 like_exists := array_position(current_likes, p_user_id) IS NOT NULL; IF like_exists THEN -- ถ้ามีอยู่แล้ว ให้ลบออก 
 UPDATE public.perfumes

SET likes = array_remove(current_likes, p_user_id), updated_at = now()
WHERE id = p_perfume_id; ELSE -- ถ้ายังไม่มี ให้เพิ่มเข้าไป 
 UPDATE public.perfumes

SET likes = array_append(current_likes, p_user_id), updated_at = now()
WHERE id = p_perfume_id; END IF;
-- คืนค่าสถานะว่าตอนนี้กลายเป็น liked (true) หรือ unliked (false) 
 RETURN NOT like_exists; END; $ $ LANGUAGE plpgsql

SET search_path = public;