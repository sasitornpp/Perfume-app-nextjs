### คำอธิบายฟังก์ชัน `get_perfumes_count`

ฟังก์ชัน `get_perfumes_count` มีหน้าที่นับจำนวนน้ำหอมทั้งหมดในตาราง `perfumes` และคืนค่าเป็น BIGINT

**โครงสร้างฟังก์ชัน:**

```tsql
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
```

**ขั้นตอนการทำงาน:**

1. **สร้างฟังก์ชัน:**
    * `CREATE OR REPLACE FUNCTION get_perfumes_COUNT() RETURNS BIGINT AS $$ ... $$ LANGUAGE plpgsql`: สร้างหรือแทนที่ฟังก์ชันชื่อ `get_perfumes_COUNT` ที่ไม่มี input และคืนค่าเป็น BIGINT
2. **เริ่มต้นการทำงาน:**
    * `BEGIN ... END;`: กำหนดขอบเขตการทำงานของฟังก์ชัน
3. **นับจำนวนน้ำหอม:**
    * `SELECT COUNT(*) FROM public.perfumes`: นับจำนวน record ทั้งหมดในตาราง `perfumes`
4. **คืนค่าจำนวนน้ำหอม:**
    * `RETURN (...)`: คืนค่าจำนวนน้ำหอมที่นับได้

**คำสั่ง SQL ที่ใช้:**

* `CREATE OR REPLACE FUNCTION`: สร้างหรือแทนที่ฟังก์ชัน
* `RETURNS BIGINT`: กำหนดชนิดข้อมูลที่ฟังก์ชันคืนค่า (BIGINT คือ integer ขนาดใหญ่)
* `SELECT`: ดึงข้อมูลจากตาราง
* `FROM`: ระบุตารางที่ต้องการดึงข้อมูล
* `COUNT(*)`: นับจำนวน record ทั้งหมด

โดยรวมแล้ว ฟังก์ชันนี้มีหน้าที่นับจำนวนน้ำหอมทั้งหมดในตาราง `perfumes` และคืนค่าเป็น BIGINT
