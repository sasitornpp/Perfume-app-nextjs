# คำอธิบายฟังก์ชัน `get_table_count`

ฟังก์ชัน `get_table_count` มีหน้าที่นับจำนวนแถว (rows) ในตารางที่ระบุ (table_name) และคืนค่าเป็น BIGINT ฟังก์ชันนี้ใช้ dynamic SQL เพื่อให้สามารถนับจำนวนแถวจากตารางใดก็ได้ที่ระบุเป็น input

**โครงสร้างฟังก์ชัน:**

```tsql
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
```

**ขั้นตอนการทำงาน:**

1. **สร้างฟังก์ชัน:**
    * `create or replace function get_table_count (table_name TEXT) RETURNS BIGINT as $$ ... $$ LANGUAGE plpgsql`: สร้างหรือแทนที่ฟังก์ชันชื่อ `get_table_count` ที่รับ input เป็น `table_name` (TEXT) และคืนค่าเป็น BIGINT
2. **ประกาศตัวแปร:**
    * `DECLARE total_count BIGINT;`: ประกาศตัวแปร `total_count` เพื่อเก็บจำนวนแถวที่นับได้
3. **เริ่มต้นการทำงาน:**
    * `BEGIN ... END;`: กำหนดขอบเขตการทำงานของฟังก์ชัน
4. **ใช้ dynamic SQL เพื่อนับจำนวนแถว:**
    * `EXECUTE format('SELECT COUNT(*) FROM public.%I', table_name) INTO total_count;`: ใช้ `EXECUTE` ร่วมกับ `format` เพื่อสร้าง SQL statement แบบ dynamic และนับจำนวนแถวจากตารางที่ระบุ
        * `format('SELECT COUNT(*) FROM public.%I', table_name)`: สร้าง SQL statement โดยใช้ `format`
            * `%I`: เป็น placeholder สำหรับ identifier (ชื่อตาราง) และจะถูกแทนที่ด้วย `table_name` โดยที่ `format` จะทำการ escape identifier เพื่อป้องกัน SQL injection
        * `EXECUTE ... INTO total_count`: execute SQL statement ที่สร้างขึ้น และเก็บผลลัพธ์ (จำนวนแถว) ในตัวแปร `total_count`
5. **คืนค่าจำนวนแถว:**
    * `RETURN total_count;`: คืนค่าจำนวนแถวที่นับได้
6. **Exception Handling:**
    * `EXCEPTION WHEN OTHERS THEN ...`: ดักจับ exception ที่อาจเกิดขึ้นระหว่างการทำงาน (เช่น ตารางที่ระบุไม่มีอยู่)
    * `RAISE NOTICE 'Error counting rows in table %: %', table_name, SQLERRM;`: แสดงข้อความ error ใน log โดยระบุชื่อตารางและข้อความ error
    * `RETURN -1;`: คืนค่า -1 เพื่อบ่งบอกว่าเกิด error

**คำสั่ง SQL ที่ใช้:**

* `CREATE OR REPLACE FUNCTION`: สร้างหรือแทนที่ฟังก์ชัน
* `RETURNS BIGINT`: กำหนดชนิดข้อมูลที่ฟังก์ชันคืนค่า (BIGINT คือ integer ขนาดใหญ่)
* `DECLARE`: ประกาศตัวแปร
* `EXECUTE`: execute SQL statement แบบ dynamic
* `format`: สร้าง SQL statement แบบ dynamic และทำการ escape identifier
* `SELECT`: ดึงข้อมูลจากตาราง
* `FROM`: ระบุตารางที่ต้องการดึงข้อมูล
* `COUNT(*)`: นับจำนวน record ทั้งหมด
* `INTO`: เก็บผลลัพธ์จากการ query ในตัวแปร
* `EXCEPTION WHEN OTHERS THEN`: ดักจับ exception
* `RAISE NOTICE`: แสดงข้อความใน log
* `SQLERRM`: แสดงข้อความ error

โดยรวมแล้ว ฟังก์ชันนี้มีหน้าที่นับจำนวนแถวในตารางที่ระบุ โดยใช้ dynamic SQL และมีการจัดการ exception เพื่อให้สามารถใช้งานได้อย่างปลอดภัย
