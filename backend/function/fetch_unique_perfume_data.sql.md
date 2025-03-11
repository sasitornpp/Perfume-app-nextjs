# คำอธิบายฟังก์ชัน `fetch_unique_perfume_data`

ฟังก์ชัน `fetch_unique_perfume_data` มีหน้าที่ดึงข้อมูลที่เป็นเอกลักษณ์ (unique) ของน้ำหอมจากตาราง `perfumes` ในฐานข้อมูล โดยจะดึงข้อมูล brand, top notes, middle notes, base notes, accords และ perfumer ข้อมูลเหล่านี้จะถูกจัดรูปแบบเป็น JSON object เพื่อให้ง่ายต่อการนำไปใช้

**โครงสร้างฟังก์ชัน:**

```tsql
create or replace function public.fetch_unique_perfume_data () RETURNS JSON as $$
BEGIN
    RETURN (
        SELECT json_build_object(
            'brand', (
                SELECT json_agg(json_build_object(
                    'name', brand,
                    'logo', logo
                ))
                FROM (
                    SELECT DISTINCT ON (brand) brand, logo
                    FROM public.perfumes
                    WHERE brand IS NOT NULL 
                    AND logo IS NOT NULL
                    ORDER BY brand
                ) AS unique_brands
            ),
            'top_notes', (
                SELECT json_agg(DISTINCT t.note ORDER BY t.note)
                FROM public.perfumes p,
                LATERAL unnest(p.top_notes) AS t(note)
                WHERE p.top_notes IS NOT NULL 
                AND t.note IS NOT NULL
            ),
            'middle_notes', (
                SELECT json_agg(DISTINCT t.note ORDER BY t.note)
                FROM public.perfumes p,
                LATERAL unnest(p.middle_notes) AS t(note)
                WHERE p.middle_notes IS NOT NULL 
                AND t.note IS NOT NULL
            ),
            'base_notes', (
                SELECT json_agg(DISTINCT t.note ORDER BY t.note)
                FROM public.perfumes p,
                LATERAL unnest(p.base_notes) AS t(note)
                WHERE p.base_notes IS NOT NULL 
                AND t.note IS NOT NULL
            ),
            'accords', (
                SELECT json_agg(DISTINCT t.accord ORDER BY t.accord)
                FROM public.perfumes p,
                LATERAL unnest(p.accords) AS t(accord)
                WHERE p.accords IS NOT NULL 
                AND t.accord IS NOT NULL
            ),
            'perfumer', (
                SELECT json_agg(DISTINCT perfumer ORDER BY perfumer)
                FROM public.perfumes
                WHERE perfumer IS NOT NULL
            )
        )
    );
END;
$$ LANGUAGE plpgsql
set
  search_path = public;
```

**ขั้นตอนการทำงาน:**

1. **สร้างฟังก์ชัน:**
    * `create or replace function public.fetch_unique_perfume_data () RETURNS JSON as $$ ... $$ LANGUAGE plpgsql`: สร้างหรือแทนที่ฟังก์ชันชื่อ `fetch_unique_perfume_data` ที่ไม่มี input และคืนค่าเป็น JSON
2. **เริ่มต้นการทำงาน:**
    * `BEGIN ... END;`: กำหนดขอบเขตการทำงานของฟังก์ชัน
3. **สร้าง JSON object หลัก:**
    * `SELECT json_build_object(...)`: สร้าง JSON object ที่มี key ต่างๆ ได้แก่ `brand`, `top_notes`, `middle_notes`, `base_notes`, `accords` และ `perfumer`
4. **ดึงข้อมูล brand:**
    * `(SELECT json_agg(json_build_object('name', brand, 'logo', logo)) FROM (SELECT DISTINCT ON (brand) brand, logo FROM public.perfumes WHERE brand IS NOT NULL AND logo IS NOT NULL ORDER BY brand) AS unique_brands)`: ดึงข้อมูล brand และ logo ที่ไม่ซ้ำกันจากตาราง `perfumes` โดยใช้ `DISTINCT ON (brand)` เพื่อให้ได้ brand ที่ไม่ซ้ำกัน และสร้างเป็น JSON array โดยแต่ละ element ใน array คือ JSON object ที่มี `name` และ `logo` ของแต่ละ brand
5. **ดึงข้อมูล top notes, middle notes, base notes, accords:**
    * `(SELECT json_agg(DISTINCT t.note ORDER BY t.note) FROM public.perfumes p, LATERAL unnest(p.top_notes) AS t(note) WHERE p.top_notes IS NOT NULL AND t.note IS NOT NULL)`: ดึงข้อมูล top notes (และ middle notes, base notes, accords) ที่ไม่ซ้ำกันจากตาราง `perfumes` โดยใช้ `LATERAL unnest` เพื่อแปลง array ของ notes ในแต่ละ record ให้เป็นหลาย record และใช้ `DISTINCT` เพื่อให้ได้ notes ที่ไม่ซ้ำกัน และสร้างเป็น JSON array โดยแต่ละ element ใน array คือ note แต่ละตัว
6. **ดึงข้อมูล perfumer:**
    * `(SELECT json_agg(DISTINCT perfumer ORDER BY perfumer) FROM public.perfumes WHERE perfumer IS NOT NULL)`: ดึงข้อมูล perfumer ที่ไม่ซ้ำกันจากตาราง `perfumes` โดยใช้ `DISTINCT` เพื่อให้ได้ perfumer ที่ไม่ซ้ำกัน และสร้างเป็น JSON array โดยแต่ละ element ใน array คือ perfumer แต่ละคน
7. **คืนค่า JSON object:**
    * `RETURN (...)`: คืนค่า JSON object ที่สร้างขึ้น

**คำสั่ง SQL ที่ใช้:**

* `CREATE OR REPLACE FUNCTION`: สร้างหรือแทนที่ฟังก์ชัน
* `RETURNS JSON`: กำหนดชนิดข้อมูลที่ฟังก์ชันคืนค่า (JSON)
* `SELECT`: ดึงข้อมูลจากตาราง
* `FROM`: ระบุตารางที่ต้องการดึงข้อมูล
* `WHERE`: กำหนดเงื่อนไขในการดึงข้อมูล
* `DISTINCT`: เลือกค่าที่ไม่ซ้ำกัน
* `json_build_object`: สร้าง JSON object
* `json_agg`: สร้าง JSON array จากหลาย record
* `LATERAL UNNEST`: แปลง array เป็นหลาย record

โดยรวมแล้ว ฟังก์ชันนี้มีหน้าที่ดึงข้อมูลที่เป็นเอกลักษณ์ของน้ำหอมจากตาราง `perfumes` และจัดรูปแบบข้อมูลให้อยู่ในรูปของ JSON object ที่สามารถนำไปใช้ในการสร้าง dropdown หรือ autocomplete ใน application ได้ง่าย
