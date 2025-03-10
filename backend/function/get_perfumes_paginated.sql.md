### คำอธิบายฟังก์ชัน `get_perfumes_paginated`

ฟังก์ชัน `get_perfumes_paginated` มีหน้าที่ดึงข้อมูลน้ำหอมจากตาราง `perfumes` โดยมีการแบ่งหน้า (pagination) เพื่อให้สามารถแสดงผลลัพธ์ทีละหน้าได้ ฟังก์ชันนี้รับหมายเลขหน้า (page number) และจำนวนรายการต่อหน้า (items per page) เป็น input และคืนค่าเป็น table ที่มีข้อมูลน้ำหอม

**โครงสร้างฟังก์ชัน:**

```tsql
create or replace function get_perfumes_paginated (page_number INTEGER, items_per_page INTEGER) RETURNS table (
  id uuid,
  name text,
  brand text,
  gender text,
  accords text[],
  descriptions text,
  perfumer text,
  top_notes text[],
  middle_notes text[],
  base_notes text[],
  images text[],
  logo text,
  created_at timestamp with time zone,
  liked integer
) as $$
BEGIN
  RETURN QUERY
    SELECT *
    FROM public.perfumes
    ORDER BY name ASC
    LIMIT items_per_page
    OFFSET (page_number - 1) * items_per_page;
END;
$$ LANGUAGE plpgsql
set
  search_path = public;
```

**ขั้นตอนการทำงาน:**

1. **สร้างฟังก์ชัน:**
    * `create or replace function get_perfumes_paginated (page_number INTEGER, items_per_page INTEGER) RETURNS table (...) as $$ ... $$ LANGUAGE plpgsql`: สร้างหรือแทนที่ฟังก์ชันชื่อ `get_perfumes_paginated` ที่รับ input เป็น `page_number` (INTEGER) และ `items_per_page` (INTEGER) และคืนค่าเป็น `table` ที่มี column ต่างๆ (id, name, brand, gender, accords, descriptions, perfumer, top_notes, middle_notes, base_notes, images, logo, created_at, liked)
2. **กำหนด search path:**
    * `set search_path = public;`: กำหนด search path เป็น `public` เพื่อให้ฟังก์ชันสามารถเข้าถึงตาราง `perfumes` ได้
3. **เริ่มต้นการทำงาน:**
    * `BEGIN ... END;`: กำหนดขอบเขตการทำงานของฟังก์ชัน
4. **ดึงข้อมูลน้ำหอม:**
    * `RETURN QUERY SELECT * FROM public.perfumes ORDER BY name ASC LIMIT items_per_page OFFSET (page_number - 1) * items_per_page;`: ดึงข้อมูลน้ำหอมจากตาราง `perfumes`
        * `SELECT * FROM public.perfumes`: เลือก column ทั้งหมดจากตาราง `perfumes`
        * `ORDER BY name ASC`: เรียงลำดับผลลัพธ์ตามชื่อน้ำหอม (name) จาก A-Z
        * `LIMIT items_per_page`: จำกัดจำนวน record ที่ดึงตาม `items_per_page` (จำนวนรายการต่อหน้า)
        * `OFFSET (page_number - 1) * items_per_page`: กำหนด offset ในการดึงข้อมูล เพื่อแบ่งหน้า (pagination) โดย offset จะคำนวณจาก `(page_number - 1) * items_per_page`
5. **คืนค่าผลลัพธ์:**
    * `RETURN QUERY ...`: คืนค่าผลลัพธ์ที่ได้จากการ query

**คำสั่ง SQL ที่ใช้:**

* `CREATE OR REPLACE FUNCTION`: สร้างหรือแทนที่ฟังก์ชัน
* `RETURNS table`: กำหนดชนิดข้อมูลที่ฟังก์ชันคืนค่า (table)
* `SELECT`: ดึงข้อมูลจากตาราง
* `FROM`: ระบุตารางที่ต้องการดึงข้อมูล
* `ORDER BY`: เรียงลำดับผลลัพธ์
* `ASC`: เรียงลำดับจากน้อยไปมาก (ascending)
* `LIMIT`: จำกัดจำนวน record ที่ดึง
* `OFFSET`: กำหนด offset ในการดึงข้อมูล

โดยรวมแล้ว ฟังก์ชันนี้มีหน้าที่ดึงข้อมูลน้ำหอมจากตาราง `perfumes` โดยมีการแบ่งหน้า (pagination) และเรียงลำดับตามชื่อน้ำหอม
