# คำอธิบายฟังก์ชัน `get_comments_by_perfume_id`

ฟังก์ชัน `get_comments_by_perfume_id` มีหน้าที่ดึงข้อมูลความคิดเห็น (comments) ทั้งหมดที่เกี่ยวข้องกับน้ำหอม (perfume) ที่ระบุ โดยจะดึงข้อมูลความคิดเห็น, ข้อมูลผู้ใช้ที่เขียนความคิดเห็น, ข้อมูล reply (ความคิดเห็นย่อย) ที่เกี่ยวข้องกับแต่ละความคิดเห็น และจัดรูปแบบข้อมูลให้อยู่ในรูปของ JSONB

**โครงสร้างฟังก์ชัน:**

```tsql
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
```

**ขั้นตอนการทำงาน:**

1. **สร้างฟังก์ชัน:**
    * `CREATE OR REPLACE FUNCTION get_comments_by_perfume_id(p_perfume_id uuid) RETURNS jsonb AS $$ ... $$ LANGUAGE plpgsql`: สร้างหรือแทนที่ฟังก์ชันชื่อ `get_comments_by_perfume_id` ที่รับ input เป็น `p_perfume_id` (UUID ของน้ำหอม) และคืนค่าเป็น JSONB
2. **ประกาศตัวแปร:**
    * `DECLARE result jsonb;`: ประกาศตัวแปร `result` เพื่อเก็บผลลัพธ์ที่ได้จากฟังก์ชัน (JSONB)
3. **เริ่มต้นการทำงาน:**
    * `BEGIN ... END;`: กำหนดขอบเขตการทำงานของฟังก์ชัน
4. **สร้าง Common Table Expression (CTE) `comment_details`:**
    * `WITH comment_details AS (...)`: สร้าง CTE ชื่อ `comment_details` เพื่อรวบรวมข้อมูลที่จำเป็นสำหรับแต่ละความคิดเห็น
    * `SELECT c.id, ... FROM public.comments c LEFT JOIN public.profiles p ON p.id = c."user" WHERE c.perfumes_id = p_perfume_id`: เลือกข้อมูลจากตาราง `comments` (`c`) และ `profiles` (`p`) โดย JOIN กันด้วย `user` ID และกรองผลลัพธ์ด้วย `perfumes_id` ที่รับเข้ามา
    * `jsonb_build_object('id', p.id :: text, 'name', p.name, 'avatar', p.images) AS user_data`: สร้าง JSON object ที่มีข้อมูลผู้ใช้ (id, name, avatar)
    * `COALESCE((SELECT ... FROM public.reply r LEFT JOIN public.profiles pr ON pr.id = r."user" WHERE r.comments_id = c.id), '[]' :: jsonb) AS replies`: ดึงข้อมูล replies (ความคิดเห็นย่อย) ที่เกี่ยวข้องกับแต่ละความคิดเห็น
        * `SELECT jsonb_agg(jsonb_build_object(...)) FROM public.reply r LEFT JOIN public.profiles pr ON pr.id = r."user" WHERE r.comments_id = c.id`: ดึงข้อมูล replies จากตาราง `reply` (`r`) และ `profiles` (`pr`) โดย JOIN กันด้วย `user` ID และกรองผลลัพธ์ด้วย `comments_id` ที่ตรงกับ ID ของความคิดเห็นหลัก
        * `jsonb_build_object(...)`: สร้าง JSON object สำหรับแต่ละ reply
        * `jsonb_agg(...)`: สร้าง JSON array ที่มี replies ทั้งหมด
        * `COALESCE(..., '[]' :: jsonb)`: ถ้าไม่มี replies จะคืนค่าเป็น JSON array ว่างเปล่า
5. **สร้าง JSON array ของผลลัพธ์:**
    * `SELECT jsonb_agg(jsonb_build_object(...) ORDER BY cd.created_at DESC) INTO result FROM comment_details cd;`: สร้าง JSON array ที่มีข้อมูลความคิดเห็นทั้งหมดจาก CTE `comment_details`
    * `jsonb_build_object(...)`: สร้าง JSON object สำหรับแต่ละความคิดเห็น โดยรวมข้อมูลจาก CTE `comment_details` (id, user_data, text, images, likes, created_at, replies)
    * `jsonb_agg(...) ORDER BY cd.created_at DESC`: สร้าง JSON array และเรียงลำดับตาม `created_at` จากล่าสุดไปเก่าสุด
    * `INTO result`: เก็บผลลัพธ์ในตัวแปร `result`
6. **คืนค่า JSONB:**
    * `RETURN COALESCE (result, '[]' :: jsonb);`: คืนค่า JSONB ที่สร้างขึ้น
    * `COALESCE(..., '[]' :: jsonb)`: ถ้าไม่มีข้อมูลความคิดเห็น จะคืนค่าเป็น JSON array ว่างเปล่า
7. **Exception Handling:**
    * `EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'Error: %', SQLERRM; RETURN '[]' :: jsonb;`: ดักจับ exception ที่อาจเกิดขึ้นระหว่างการทำงาน และคืนค่า JSON array ว่างเปล่า พร้อมทั้งแสดงข้อความ error ใน log

**คำสั่ง SQL ที่ใช้:**

* `CREATE OR REPLACE FUNCTION`: สร้างหรือแทนที่ฟังก์ชัน
* `RETURNS jsonb`: กำหนดชนิดข้อมูลที่ฟังก์ชันคืนค่า (JSONB คือ JSON binary)
* `DECLARE`: ประกาศตัวแปร
* `WITH`: สร้าง Common Table Expression (CTE)
* `SELECT`: ดึงข้อมูลจากตาราง
* `FROM`: ระบุตารางที่ต้องการดึงข้อมูล
* `LEFT JOIN`: JOIN ตารางโดยเก็บ record ทั้งหมดจากตารางซ้าย และ record ที่ตรงกันจากตารางขวา
* `ON`: กำหนดเงื่อนไขในการ JOIN
* `WHERE`: กำหนดเงื่อนไขในการกรองข้อมูล
* `jsonb_build_object`: สร้าง JSON object
* `jsonb_agg`: สร้าง JSON array จากหลาย record
* `COALESCE`: คืนค่าแรกที่ไม่เป็น NULL
* `ORDER BY`: เรียงลำดับผลลัพธ์
* `DESC`: เรียงลำดับจากมากไปน้อย (descending)
* `EXCEPTION WHEN OTHERS THEN`: ดักจับ exception
* `RAISE NOTICE`: แสดงข้อความใน log
* `SQLERRM`: แสดงข้อความ error

โดยรวมแล้ว ฟังก์ชันนี้มีหน้าที่ดึงข้อมูลความคิดเห็นทั้งหมดที่เกี่ยวข้องกับน้ำหอมที่ระบุ และจัดรูปแบบข้อมูลให้อยู่ในรูปของ JSONB ที่มีข้อมูลความคิดเห็น, ข้อมูลผู้ใช้, และข้อมูล replies
