# คำอธิบายฟังก์ชัน `toggle_perfume_like`

ฟังก์ชัน `toggle_perfume_like` มีหน้าที่สลับสถานะ "ถูกใจ" (like) ของน้ำหอม (perfume) ที่ระบุ โดยผู้ใช้ (user) ที่ระบุ ฟังก์ชันนี้จะตรวจสอบว่า user_id อยู่ใน array ของ likes หรือไม่ ถ้ามีอยู่แล้ว จะลบออก ถ้ายังไม่มี จะเพิ่มเข้าไป และคืนค่าสถานะว่าตอนนี้กลายเป็น liked (true) หรือ unliked (false)

**โครงสร้างฟังก์ชัน:**

```tsql
CREATE or replace function toggle_perfume_like (p_user_id uuid, p_perfume_id uuid) RETURNS boolean AS $$
DECLARE
  current_likes uuid[];
  like_exists boolean;
BEGIN
  -- ดึง array ของ likes ปัจจุบัน
  SELECT
    likes INTO current_likes
  FROM
    public.perfumes
  WHERE
    id = p_perfume_id FOR UPDATE;

  -- ตรวจสอบว่า user_id อยู่ใน likes หรือไม่
  like_exists := array_position(current_likes, p_user_id) IS NOT NULL;
  IF like_exists THEN
    -- ถ้ามีอยู่แล้ว ให้ลบออก
    UPDATE public.perfumes
    SET
      likes = array_remove(current_likes, p_user_id),
      updated_at = now()
    WHERE
      id = p_perfume_id;
  ELSE
    -- ถ้ายังไม่มี ให้เพิ่มเข้าไป
    UPDATE public.perfumes
    SET
      likes = array_append(current_likes, p_user_id),
      updated_at = now()
    WHERE
      id = p_perfume_id;
  END IF;
  -- คืนค่าสถานะว่าตอนนี้กลายเป็น liked (true) หรือ unliked (false)
  RETURN NOT like_exists;
END;
$$ LANGUAGE plpgsql SET search_path = public;
```

**ขั้นตอนการทำงาน:**

1. **สร้างฟังก์ชัน:**
    * `CREATE or replace function toggle_perfume_like (p_user_id uuid, p_perfume_id uuid) RETURNS boolean AS $$ ... $$ LANGUAGE plpgsql`: สร้างหรือแทนที่ฟังก์ชันชื่อ `toggle_perfume_like` ที่รับ input เป็น `p_user_id` (UUID ของผู้ใช้) และ `p_perfume_id` (UUID ของน้ำหอม) และคืนค่าเป็น boolean
2. **ประกาศตัวแปร:**
    * `DECLARE current_likes uuid[];`: ประกาศตัวแปร `current_likes` เพื่อเก็บ array ของ UUID ที่ represent ผู้ใช้ที่กด like น้ำหอม
    * `DECLARE like_exists boolean;`: ประกาศตัวแปร `like_exists` เพื่อเก็บสถานะว่าผู้ใช้คนปัจจุบันได้กด like น้ำหอมไปแล้วหรือไม่
3. **เริ่มต้นการทำงาน:**
    * `BEGIN ... END;`: กำหนดขอบเขตการทำงานของฟังก์ชัน
4. **ดึง array ของ likes ปัจจุบัน:**
    * `SELECT likes INTO current_likes FROM public.perfumes WHERE id = p_perfume_id FOR UPDATE;`: ดึงข้อมูล `likes` จากตาราง `perfumes` โดยใช้ `p_perfume_id` เป็นเงื่อนไข และใช้ `FOR UPDATE` เพื่อ lock row ที่กำลังแก้ไข เพื่อป้องกัน race condition
5. **ตรวจสอบว่า user_id อยู่ใน likes หรือไม่:**
    * `like_exists := array_position(current_likes, p_user_id) IS NOT NULL;`: ตรวจสอบว่า `p_user_id` อยู่ใน array `current_likes` หรือไม่ โดยใช้ฟังก์ชัน `array_position`
        * `array_position(current_likes, p_user_id)`: คืนค่า index ของ `p_user_id` ใน array `current_likes` ถ้าไม่พบ จะคืนค่า NULL
        * `IS NOT NULL`: ตรวจสอบว่าค่าที่ได้จาก `array_position` ไม่เป็น NULL (แสดงว่า `p_user_id` อยู่ใน array)
6. **ถ้ามีอยู่แล้ว ให้ลบออก / ถ้ายังไม่มี ให้เพิ่มเข้าไป:**
    * `IF like_exists THEN ... ELSE ... END IF;`: ใช้ `IF` statement เพื่อตรวจสอบว่า `like_exists` เป็น true หรือ false
        * **ถ้า `like_exists` เป็น true (ผู้ใช้เคยกด like แล้ว):**
            * `UPDATE public.perfumes SET likes = array_remove(current_likes, p_user_id), updated_at = now() WHERE id = p_perfume_id;`: ลบ `p_user_id` ออกจาก array `likes` และ update `updated_at`
                * `array_remove(current_likes, p_user_id)`: สร้าง array ใหม่ โดยลบ `p_user_id` ออกจาก `current_likes`
                * `updated_at = now()`: update `updated_at` เป็นเวลาปัจจุบัน
        * **ถ้า `like_exists` เป็น false (ผู้ใช้ยังไม่เคยกด like):**
            * `UPDATE public.perfumes SET likes = array_append(current_likes, p_user_id), updated_at = now() WHERE id = p_perfume_id;`: เพิ่ม `p_user_id` เข้าไปใน array `likes` และ update `updated_at`
                * `array_append(current_likes, p_user_id)`: สร้าง array ใหม่ โดยเพิ่ม `p_user_id` เข้าไปใน `current_likes`
                * `updated_at = now()`: update `updated_at` เป็นเวลาปัจจุบัน
7. **คืนค่าสถานะว่าตอนนี้กลายเป็น liked (true) หรือ unliked (false):**
    * `RETURN NOT like_exists;`: คืนค่า `NOT like_exists`
        * ถ้า `like_exists` เป็น true (ผู้ใช้เคยกด like แล้ว และถูกลบออก) จะคืนค่า false (ตอนนี้คือ unliked)
        * ถ้า `like_exists` เป็น false (ผู้ใช้ยังไม่เคยกด like และถูกเพิ่มเข้าไป) จะคืนค่า true (ตอนนี้คือ liked)

**คำสั่ง SQL ที่ใช้:**

* `CREATE or replace function`: สร้างหรือแทนที่ฟังก์ชัน
* `RETURNS boolean`: กำหนดชนิดข้อมูลที่ฟังก์ชันคืนค่า (boolean)
* `DECLARE`: ประกาศตัวแปร
* `SELECT`: ดึงข้อมูลจากตาราง
* `FROM`: ระบุตารางที่ต้องการดึงข้อมูล
* `WHERE`: กำหนดเงื่อนไขในการดึงข้อมูล
* `FOR UPDATE`: lock row ที่กำลังแก้ไข
* `array_position`: หา index ของ element ใน array
* `IS NOT NULL`: ตรวจสอบว่าค่าไม่เป็น NULL
* `IF ... THEN ... ELSE ... END IF`: สร้าง conditional statement
* `UPDATE`: แก้ไขข้อมูลในตาราง
* `SET`: กำหนดค่าใหม่ให้กับ column
* `array_remove`: สร้าง array ใหม่ โดยลบ element ที่ระบุออก
* `array_append`: สร้าง array ใหม่ โดยเพิ่ม element ที่ระบุเข้าไป
* `now()`: คืนค่าเวลาปัจจุบัน
* `RETURN`: คืนค่าจากฟังก์ชัน

โดยรวมแล้ว ฟังก์ชันนี้มีหน้าที่สลับสถานะ "ถูกใจ" (like) ของน้ำหอมที่ระบุ โดยผู้ใช้ที่ระบุ และคืนค่าสถานะใหม่
