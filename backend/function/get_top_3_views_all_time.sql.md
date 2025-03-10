### คำอธิบายฟังก์ชัน `get_top_3_views_all_time`

ฟังก์ชัน `get_top_3_views_all_time` มีหน้าที่ดึงข้อมูลน้ำหอม 3 อันดับแรกที่มีจำนวนการเข้าชม (views) สูงสุดตลอดกาล และคืนค่าเป็น table ที่มีข้อมูลน้ำหอมและจำนวนการเข้าชมรวม

**โครงสร้างฟังก์ชัน:**

```tsql
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
```

**ขั้นตอนการทำงาน:**

1. **สร้างฟังก์ชัน:**
    * `CREATE OR REPLACE FUNCTION get_top_3_views_all_time() RETURNS TABLE (perfume_data JSONB, total_views_count BIGINT) AS $$ ... $$ LANGUAGE plpgsql`: สร้างหรือแทนที่ฟังก์ชันชื่อ `get_top_3_views_all_time` ที่ไม่มี input และคืนค่าเป็น `TABLE` ที่มี column `perfume_data` (JSONB) และ `total_views_count` (BIGINT)
2. **กำหนด search path:**
    * `SET search_path = public;`: กำหนด search path เป็น `public` เพื่อให้ฟังก์ชันสามารถเข้าถึงตาราง `perfume_views` และ `perfumes` ได้
3. **เริ่มต้นการทำงาน:**
    * `BEGIN ... END;`: กำหนดขอบเขตการทำงานของฟังก์ชัน
4. **คำนวณจำนวนการเข้าชมรวมของน้ำหอมแต่ละขวด:**
    * `WITH aggregated_views AS (SELECT pv.perfume_id, SUM(pv.views_count) AS total_views FROM public.perfume_views pv GROUP BY pv.perfume_id)`: สร้าง CTE ชื่อ `aggregated_views` เพื่อคำนวณจำนวนการเข้าชมรวมของน้ำหอมแต่ละขวด
        * `SELECT pv.perfume_id, SUM(pv.views_count) AS total_views FROM public.perfume_views pv`: เลือก `perfume_id` และคำนวณผลรวมของ `views_count`
        * `GROUP BY pv.perfume_id`: จัดกลุ่มผลลัพธ์ตาม `perfume_id` เพื่อให้ได้จำนวนการเข้าชมรวมของแต่ละขวด
5. **ดึงข้อมูลน้ำหอมและจำนวนการเข้าชมรวม:**
    * `SELECT to_jsonb(p) AS perfume_data, av.total_views AS total_views_count FROM aggregated_views av LEFT JOIN public.perfumes p ON av.perfume_id = p.id ORDER BY av.total_views DESC LIMIT 3;`: ดึงข้อมูลน้ำหอมและจำนวนการเข้าชมรวมจาก CTE `aggregated_views` และตาราง `perfumes`
        * `SELECT to_jsonb(p) AS perfume_data, av.total_views AS total_views_count`: เลือกข้อมูลน้ำหอม (แปลงเป็น JSONB) และจำนวนการเข้าชมรวม
        * `FROM aggregated_views av LEFT JOIN public.perfumes p ON av.perfume_id = p.id`: JOIN ตาราง `aggregated_views` (`av`) และ `perfumes` (`p`) โดยใช้ `perfume_id`
        * `ORDER BY av.total_views DESC`: เรียงลำดับผลลัพธ์ตามจำนวนการเข้าชมรวมจากมากไปน้อย
        * `LIMIT 3`: จำกัดจำนวน record ที่ดึงเป็น 3
6. **คืนค่าผลลัพธ์:**
    * `RETURN QUERY ...`: คืนค่าผลลัพธ์ที่ได้จากการ query

**คำสั่ง SQL ที่ใช้:**

* `CREATE OR REPLACE FUNCTION`: สร้างหรือแทนที่ฟังก์ชัน
* `RETURNS TABLE`: กำหนดชนิดข้อมูลที่ฟังก์ชันคืนค่า (table)
* `WITH`: สร้าง Common Table Expression (CTE)
* `SELECT`: ดึงข้อมูลจากตาราง
* `FROM`: ระบุตารางที่ต้องการดึงข้อมูล
* `SUM`: คำนวณผลรวม
* `GROUP BY`: จัดกลุ่มผลลัพธ์
* `LEFT JOIN`: JOIN ตารางโดยเก็บ record ทั้งหมดจากตารางซ้าย และ record ที่ตรงกันจากตารางขวา
* `ON`: กำหนดเงื่อนไขในการ JOIN
* `ORDER BY`: เรียงลำดับผลลัพธ์
* `DESC`: เรียงลำดับจากมากไปน้อย (descending)
* `LIMIT`: จำกัดจำนวน record ที่ดึง
* `to_jsonb`: แปลง record เป็น JSON object

โดยรวมแล้ว ฟังก์ชันนี้มีหน้าที่ดึงข้อมูลน้ำหอม 3 อันดับแรกที่มีจำนวนการเข้าชมสูงสุดตลอดกาล และคืนค่าเป็น table ที่มีข้อมูลน้ำหอมและจำนวนการเข้าชมรวม
