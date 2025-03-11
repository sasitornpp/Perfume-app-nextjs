# คำอธิบายฟังก์ชัน `fetch_user`

ฟังก์ชัน `fetch_user` มีหน้าที่ดึงข้อมูลผู้ใช้ทั้งหมดจากฐานข้อมูล โดยประกอบไปด้วยข้อมูลโปรไฟล์, อัลบั้ม, ตะกร้าสินค้า (baskets) และน้ำหอมของผู้ใช้แต่ละคน ฟังก์ชันนี้รับ `user_id` เป็น input และคืนค่าเป็น JSONB object ที่มีโครงสร้างข้อมูลตามที่ระบุไว้

**โครงสร้างฟังก์ชัน:**

```tsql
create or replace function public.fetch_user (user_id UUID) RETURNS JSONB as $$
BEGIN
  RETURN (
    SELECT jsonb_build_object(
      'profile', (
        SELECT jsonb_build_object(
          'id', p.id,
          'created_at', p.created_at,
          'name', p.name,
          'images', p.images,
          'bio', p.bio,
          'gender', p.gender,
          'suggestions_perfumes', p.suggestions_perfumes
        )
        FROM public.profiles p
        WHERE p.id = fetch_user.user_id
        LIMIT 1
      ),
      'albums', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', a.id,
            'user_id', a.user_id,
            'title', a.title,
            'descriptions', a.descriptions,
            'private', a.private,
            'likes', a.likes,
            'images', a.images,
            'created_at', a.created_at,
            'perfumes_id', a.perfumes_id,
            'perfumes', (
              SELECT jsonb_agg(to_jsonb(pf))
              FROM public.perfumes pf
              WHERE pf.id = ANY(a.perfumes_id)
            )
          )
        )
        FROM public.albums a
        WHERE a.user_id = fetch_user.user_id
      ),
      'baskets', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', b.id,
            'amount', b.amount,
            'user_id', b.user_id,
            'perfume_id', b.perfume_id,
            'created_at', b.created_at
          )
        )
        FROM public.baskets b
        WHERE b.user_id = fetch_user.user_id
      ),
      'perfumes', (
        SELECT jsonb_agg(
          to_jsonb(pf)
        )
        FROM public.perfumes pf
        WHERE pf.user_id = fetch_user.user_id
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
    * `create or replace function public.fetch_user (user_id UUID) RETURNS JSONB as $$ ... $$ LANGUAGE plpgsql`: สร้างหรือแทนที่ฟังก์ชันชื่อ `fetch_user` ที่รับ `user_id` เป็น UUID และคืนค่าเป็น JSONB
2. **เริ่มต้นการทำงาน:**
    * `BEGIN ... END;`: กำหนดขอบเขตการทำงานของฟังก์ชัน
3. **สร้าง JSON object หลัก:**
    * `SELECT jsonb_build_object(...)`: สร้าง JSON object ที่มี key ต่างๆ ได้แก่ `profile`, `albums`, `baskets` และ `perfumes`
4. **ดึงข้อมูลโปรไฟล์:**
    * `(SELECT jsonb_build_object(...) FROM public.profiles p WHERE p.id = fetch_user.user_id LIMIT 1)`: ดึงข้อมูลโปรไฟล์จากตาราง `profiles` โดยใช้ `user_id` ที่ส่งเข้ามา และสร้างเป็น JSON object
5. **ดึงข้อมูลอัลบั้ม:**
    * `(SELECT jsonb_agg(jsonb_build_object(...)) FROM public.albums a WHERE a.user_id = fetch_user.user_id)`: ดึงข้อมูลอัลบั้มทั้งหมดของผู้ใช้จากตาราง `albums` โดยใช้ `user_id` ที่ส่งเข้ามา และสร้างเป็น JSON array โดยแต่ละ element ใน array คือข้อมูลของแต่ละอัลบั้ม
    * `(SELECT jsonb_agg(to_jsonb(pf)) FROM public.perfumes pf WHERE pf.id = ANY(a.perfumes_id))`: สำหรับแต่ละอัลบั้ม จะดึงข้อมูลน้ำหอมที่เกี่ยวข้องจากตาราง `perfumes` โดยใช้ `perfumes_id` ที่อยู่ในอัลบั้ม และสร้างเป็น JSON array
6. **ดึงข้อมูลตะกร้าสินค้า (baskets):**
    * `(SELECT jsonb_agg(jsonb_build_object(...)) FROM public.baskets b WHERE b.user_id = fetch_user.user_id)`: ดึงข้อมูลตะกร้าสินค้าทั้งหมดของผู้ใช้จากตาราง `baskets` โดยใช้ `user_id` ที่ส่งเข้ามา และสร้างเป็น JSON array โดยแต่ละ element ใน array คือข้อมูลของแต่ละรายการในตะกร้าสินค้า
7. **ดึงข้อมูลน้ำหอม:**
    * `(SELECT jsonb_agg(to_jsonb(pf)) FROM public.perfumes pf WHERE pf.user_id = fetch_user.user_id)`: ดึงข้อมูลน้ำหอมทั้งหมดของผู้ใช้จากตาราง `perfumes` โดยใช้ `user_id` ที่ส่งเข้ามา และสร้างเป็น JSON array โดยแต่ละ element ใน array คือข้อมูลของน้ำหอมแต่ละขวด
8. **คืนค่า JSON object:**
    * `RETURN (...)`: คืนค่า JSON object ที่สร้างขึ้น

**คำสั่ง SQL ที่ใช้:**

* `CREATE OR REPLACE FUNCTION`: สร้างหรือแทนที่ฟังก์ชัน
* `RETURNS JSONB`: กำหนดชนิดข้อมูลที่ฟังก์ชันคืนค่า (JSONB คือ JSON binary)
* `SELECT`: ดึงข้อมูลจากตาราง
* `FROM`: ระบุตารางที่ต้องการดึงข้อมูล
* `WHERE`: กำหนดเงื่อนไขในการดึงข้อมูล
* `LIMIT`: จำกัดจำนวน record ที่ดึง
* `jsonb_build_object`: สร้าง JSON object
* `jsonb_agg`: สร้าง JSON array จากหลาย record
* `to_jsonb`: แปลง record เป็น JSON object
* `ANY`: ใช้ตรวจสอบว่าค่าอยู่ใน array หรือไม่

โดยรวมแล้ว ฟังก์ชันนี้มีหน้าที่รวบรวมข้อมูลทั้งหมดที่เกี่ยวข้องกับผู้ใช้คนหนึ่งจากหลายตารางในฐานข้อมูล และจัดรูปแบบข้อมูลให้อยู่ในรูปของ JSON object ที่สามารถนำไปใช้ใน application ได้ง่าย
