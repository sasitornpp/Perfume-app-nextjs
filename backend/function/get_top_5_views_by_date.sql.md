# คำอธิบายฟังก์ชัน `get_top_5_views_by_date`

ฟังก์ชัน `get_top_5_views_by_date` มีหน้าที่ดึงข้อมูลน้ำหอม 5 อันดับแรกที่มีจำนวนการเข้าชม (views) สูงสุดในวันที่ระบุ (target_date) และคืนค่าเป็น JSONB

**โครงสร้างฟังก์ชัน:**

```tsql
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
```

**ขั้นตอนการทำงาน:**

1. **สร้างฟังก์ชัน:**
    * `CREATE OR REPLACE FUNCTION get_top_5_views_by_date(target_date DATE) RETURNS JSONB AS $$ ... $$ LANGUAGE plpgsql`: สร้างหรือแทนที่ฟังก์ชันชื่อ `get_top_5_views_by_date` ที่รับ input เป็น `target_date` (DATE) และคืนค่าเป็น JSONB
2. **กำหนด search path:**
    * `SET search_path = public;`: กำหนด search path เป็น `public` เพื่อให้ฟังก์ชันสามารถเข้าถึงตาราง `perfume_views` และ `perfumes` ได้
3. **เริ่มต้นการทำงาน:**
    * `BEGIN ... END;`: กำหนดขอบเขตการทำงานของฟังก์ชัน
4. **ดึงข้อมูลน้ำหอม 5 อันดับแรกที่มีจำนวนการเข้าชมสูงสุด:**
    * `SELECT jsonb_agg(to_jsonb(sub.p) || jsonb_build_object('views_count', sub.views_count)) FROM (...) sub`: ดึงข้อมูลน้ำหอมและจำนวนการเข้าชม และจัดรูปแบบเป็น JSON array
        * `(SELECT p, pv.views_count FROM public.perfume_views pv LEFT JOIN public.perfumes p ON pv.perfume_id = p.id WHERE pv.view_date = target_date ORDER BY pv.views_count DESC LIMIT 5) sub`: สร้าง subquery เพื่อดึงข้อมูลน้ำหอมและจำนวนการเข้าชมจากตาราง `perfume_views` และ `perfumes`
            * `FROM public.perfume_views pv LEFT JOIN public.perfumes p ON pv.perfume_id = p.id`: JOIN ตาราง `perfume_views` (`pv`) และ `perfumes` (`p`) โดยใช้ `perfume_id`
            * `WHERE pv.view_date = target_date`: กรองผลลัพธ์โดยใช้ `target_date`
            * `ORDER BY pv.views_count DESC`: เรียงลำดับผลลัพธ์ตามจำนวนการเข้าชมจากมากไปน้อย
            * `LIMIT 5`: จำกัดจำนวน record ที่ดึงเป็น 5
        * `to_jsonb(sub.p)`: แปลงข้อมูลน้ำหอม (จากตาราง `perfumes`) เป็น JSON object
        * `jsonb_build_object('views_count', sub.views_count)`: สร้าง JSON object ที่มี key `views_count` และ value เป็นจำนวนการเข้าชม
        * `to_jsonb(sub.p) || jsonb_build_object('views_count', sub.views_count)`: รวม JSON object ของข้อมูลน้ำหอมและ JSON object ของจำนวนการเข้าชม
        * `jsonb_agg(...)`: สร้าง JSON array จาก JSON object ที่รวมกัน
5. **คืนค่า JSONB:**
    * `RETURN COALESCE((SELECT ...), '[]'::jsonb);`: คืนค่า JSONB ที่สร้างขึ้น
        * `COALESCE(..., '[]'::jsonb)`: ถ้าไม่มีข้อมูลน้ำหอมที่มีการเข้าชมในวันที่ระบุ จะคืนค่าเป็น JSON array ว่างเปล่า

**คำสั่ง SQL ที่ใช้:**

* `CREATE OR REPLACE FUNCTION`: สร้างหรือแทนที่ฟังก์ชัน
* `RETURNS JSONB`: กำหนดชนิดข้อมูลที่ฟังก์ชันคืนค่า (JSONB คือ JSON binary)
* `SELECT`: ดึงข้อมูลจากตาราง
* `FROM`: ระบุตารางที่ต้องการดึงข้อมูล
* `LEFT JOIN`: JOIN ตารางโดยเก็บ record ทั้งหมดจากตารางซ้าย และ record ที่ตรงกันจากตารางขวา
* `ON`: กำหนดเงื่อนไขในการ JOIN
* `WHERE`: กำหนดเงื่อนไขในการกรองข้อมูล
* `ORDER BY`: เรียงลำดับผลลัพธ์
* `DESC`: เรียงลำดับจากมากไปน้อย (descending)
* `LIMIT`: จำกัดจำนวน record ที่ดึง
* `to_jsonb`: แปลง record เป็น JSON object
* `jsonb_build_object`: สร้าง JSON object
* `jsonb_agg`: สร้าง JSON array จากหลาย record
* `COALESCE`: คืนค่าแรกที่ไม่เป็น NULL

โดยรวมแล้ว ฟังก์ชันนี้มีหน้าที่ดึงข้อมูลน้ำหอม 5 อันดับแรกที่มีจำนวนการเข้าชมสูงสุดในวันที่ระบุ และจัดรูปแบบข้อมูลให้อยู่ในรูปของ JSONB
