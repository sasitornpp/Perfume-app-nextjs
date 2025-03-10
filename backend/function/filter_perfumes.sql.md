### คำอธิบายฟังก์ชัน `filter_perfumes`

ฟังก์ชัน `filter_perfumes` มีหน้าที่กรอง (filter) น้ำหอมจากตาราง `perfumes` โดยใช้เงื่อนไขต่างๆ ที่ผู้ใช้กำหนด เช่น ข้อความค้นหา (search query), เพศ (gender), แบรนด์ (brand), accords, top notes, middle notes และ base notes ฟังก์ชันนี้ยังรองรับการแบ่งหน้า (pagination) เพื่อให้สามารถแสดงผลลัพธ์ทีละหน้าได้

**โครงสร้างฟังก์ชัน:**

```tsql
create or replace function public.filter_perfumes (
  search_query TEXT default null,
  gender_filter TEXT default null,
  brand_filter TEXT default null,
  accords_filter text[] default null,
  top_notes_filter text[] default null,
  middle_notes_filter text[] default null,
  base_notes_filter text[] default null,
  page INTEGER default 1,
  items_per_page INTEGER default 20
) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER
set
  search_path = public as $$
BEGIN
  RETURN (
    WITH perfume_scores AS (
      SELECT
        to_jsonb(p) AS perfume_data,
        -- คำนวณคะแนนความเหมือนเป็นเปอร์เซ็นต์ (สูงสุด 100%)
        ((
          -- คะแนนจาก accords (25% สูงสุด)
          CASE WHEN accords_filter IS NULL OR cardinality(accords_filter) = 0 THEN 0
               ELSE (SELECT COUNT(*)::REAL
                     FROM unnest(p.accords) AS a
                     WHERE EXISTS (
                       SELECT 1 FROM unnest(accords_filter) AS af
                       WHERE a ILIKE '%' || af || '%'
                     )) * 25.0 / GREATEST(cardinality(accords_filter), cardinality(COALESCE(p.accords, ARRAY[]::TEXT[])))
          END +
          -- คะแนนจาก top notes (25% สูงสุด)
          CASE WHEN top_notes_filter IS NULL OR cardinality(top_notes_filter) = 0 THEN 0
               ELSE (SELECT COUNT(*)::REAL
                     FROM unnest(p.top_notes) AS t
                     WHERE EXISTS (
                       SELECT 1 FROM unnest(top_notes_filter) AS tf
                       WHERE t ILIKE '%' || tf || '%'
                     )) * 25.0 / GREATEST(cardinality(top_notes_filter), cardinality(COALESCE(p.top_notes, ARRAY[]::TEXT[])))
          END +
          -- คะแนนจาก middle notes (25% สูงสุด)
          CASE WHEN middle_notes_filter IS NULL OR cardinality(middle_notes_filter) = 0 THEN 0
               ELSE (SELECT COUNT(*)::REAL
                     FROM unnest(p.middle_notes) AS m
                     WHERE EXISTS (
                       SELECT 1 FROM unnest(middle_notes_filter) AS mf
                       WHERE m ILIKE '%' || mf || '%'
                     )) * 25.0 / GREATEST(cardinality(middle_notes_filter), cardinality(COALESCE(p.middle_notes, ARRAY[]::TEXT[])))
          END +
          -- คะแนนจาก base notes (25% สูงสุด)
          CASE WHEN base_notes_filter IS NULL OR cardinality(base_notes_filter) = 0 THEN 0
               ELSE (SELECT COUNT(*)::REAL
                     FROM unnest(p.base_notes) AS b
                     WHERE EXISTS (
                       SELECT 1 FROM unnest(base_notes_filter) AS bf
                       WHERE b ILIKE '%' || bf || '%'
                     )) * 25.0 / GREATEST(cardinality(base_notes_filter), cardinality(COALESCE(p.base_notes, ARRAY[]::TEXT[])))
          END
        )::REAL) AS match_score
      FROM public.perfumes p
      WHERE
        (
          search_query IS NULL OR
          p.name ILIKE '%' || TRIM(search_query) || '%' OR
          p.brand ILIKE '%' || TRIM(search_query) || '%' OR
          p.gender ILIKE '%' || TRIM(search_query) || '%' OR
          p.descriptions ILIKE '%' || TRIM(search_query) || '%' OR
          EXISTS (
            SELECT 1 FROM unnest(p.accords) AS accord
            WHERE accord ILIKE '%' || search_query || '%'
          ) OR
          EXISTS (
            SELECT 1 FROM unnest(p.top_notes) AS top_note
            WHERE top_note ILIKE '%' || search_query || '%'
          ) OR
          EXISTS (
            SELECT 1 FROM unnest(p.middle_notes) AS middle_note
            WHERE middle_note ILIKE '%' || search_query || '%'
          ) OR
          EXISTS (
            SELECT 1 FROM unnest(p.base_notes) AS base_note
            WHERE base_note ILIKE '%' || search_query || '%'
          )
        )
        AND (gender_filter IS NULL OR p.gender ILIKE '%' || gender_filter || '%')
        AND (brand_filter IS NULL OR p.brand ILIKE '%' || brand_filter || '%')
    ),
    filtered_results AS (
      SELECT
        perfume_data,
        match_score
      FROM perfume_scores ps
      WHERE ps.match_score > 0 OR (
        (accords_filter IS NULL OR cardinality(accords_filter) = 0) AND
        (top_notes_filter IS NULL OR cardinality(top_notes_filter) = 0) AND
        (middle_notes_filter IS NULL OR cardinality(middle_notes_filter) = 0) AND
        (base_notes_filter IS NULL OR cardinality(base_notes_filter) = 0)
      )
      ORDER BY ps.match_score DESC, (ps.perfume_data ->> 'name')::TEXT
      LIMIT items_per_page OFFSET (page - 1) * items_per_page
    )
    SELECT COALESCE(
      jsonb_agg(
        perfume_data || jsonb_build_object('match_score', match_score)
      ),
      '[]'::jsonb
    )
    FROM filtered_results
  );
END;
$$;
```

**ขั้นตอนการทำงาน:**

1.  **สร้างฟังก์ชัน:**
    *   `create or replace function public.filter_perfumes (...) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER`: สร้างหรือแทนที่ฟังก์ชันชื่อ `filter_perfumes` ที่รับ input เป็นเงื่อนไขต่างๆ ในการกรอง, หมายเลขหน้า (page) และจำนวนรายการต่อหน้า (items_per_page) และคืนค่าเป็น JSONB
2.  **กำหนด search path:**
    *   `set search_path = public as $$`: กำหนด search path เป็น `public` เพื่อให้ฟังก์ชันสามารถเข้าถึงตาราง `perfumes` ได้
3.  **เริ่มต้นการทำงาน:**
    *   `BEGIN ... END;`: กำหนดขอบเขตการทำงานของฟังก์ชัน
4.  **สร้าง Common Table Expression (CTE) `perfume_scores`:**
    *   `WITH perfume_scores AS (...)`: สร้าง CTE ชื่อ `perfume_scores` เพื่อคำนวณคะแนนความเหมือน (match score) ของน้ำหอมแต่ละขวดกับเงื่อนไขที่ผู้ใช้กำหนด
    *   `SELECT to_jsonb(p) AS perfume_data`: เลือกข้อมูลน้ำหอมทั้งหมดจากตาราง `perfumes` และแปลงเป็น JSONB
    *   **คำนวณคะแนนความเหมือน:**
        *   ส่วนนี้จะคำนวณคะแนนความเหมือนโดยพิจารณาจาก accords, top notes, middle notes และ base notes โดยแต่ละส่วนมีคะแนนสูงสุด 25% รวมเป็น 100%
        *   `CASE WHEN ... THEN ... ELSE ... END`: ใช้ `CASE` statement เพื่อตรวจสอบว่ามีการกำหนด filter สำหรับส่วนนั้นๆ หรือไม่ ถ้าไม่มี จะให้คะแนนเป็น 0
        *   `unnest(p.accords) AS a`: ใช้ `unnest` เพื่อแปลง array ของ accords ในแต่ละ record ให้เป็นหลาย record
        *   `EXISTS (SELECT 1 FROM unnest(accords_filter) AS af WHERE a ILIKE '%' || af || '%')`: ตรวจสอบว่ามี accord ในน้ำหอมที่ตรงกับ accord ใน filter หรือไม่
        *   `cardinality(accords_filter)`: หาจำนวน elements ใน array ของ accords filter
        *   `GREATEST(cardinality(accords_filter), cardinality(COALESCE(p.accords, ARRAY[]::TEXT[])))`: หาค่าที่มากกว่าระหว่างจำนวน accords ใน filter และจำนวน accords ในน้ำหอม
    *   **WHERE clause:**
        *   `(search_query IS NULL OR ...)`: ตรวจสอบว่ามีการกำหนด search query หรือไม่ ถ้าไม่มี จะไม่กรองด้วย search query
        *   `p.name ILIKE '%' || TRIM(search_query) || '%')`: ตรวจสอบว่าชื่อน้ำหอม, แบรนด์, เพศ หรือคำอธิบาย มีข้อความที่ตรงกับ search query หรือไม่
        *   `EXISTS (SELECT 1 FROM unnest(p.accords) AS accord WHERE accord ILIKE '%' || search_query || '%')`: ตรวจสอบว่ามี accord, top note, middle note หรือ base note ในน้ำหอมที่ตรงกับ search query หรือไม่
        *   `(gender_filter IS NULL OR p.gender ILIKE '%' || gender_filter || '%')`: ตรวจสอบว่ามีการกำหนด gender filter หรือไม่ ถ้าไม่มี จะไม่กรองด้วย gender filter
        *   `(brand_filter IS NULL OR p.brand ILIKE '%' || brand_filter || '%')`: ตรวจสอบว่ามีการกำหนด brand filter หรือไม่ ถ้าไม่มี จะไม่กรองด้วย brand filter
5.  **สร้าง CTE `filtered_results`:**
    *   `WITH filtered_results AS (...)`: สร้าง CTE ชื่อ `filtered_results` เพื่อเลือกน้ำหอมที่มีคะแนนความเหมือนมากกว่า 0 หรือไม่มีการกำหนด filter ใดๆ
    *   `WHERE ps.match_score > 0 OR (...)`: เลือกน้ำหอมที่มีคะแนนความเหมือนมากกว่า 0 หรือไม่มีการกำหนด filter สำหรับ accords, top notes, middle notes และ base notes
    *   `ORDER BY ps.match_score DESC, (ps.perfume_data ->> 'name')::TEXT`: เรียงลำดับผลลัพธ์ตามคะแนนความเหมือนจากมากไปน้อย และตามชื่อน้ำหอม
    *   `LIMIT items_per_page OFFSET (page - 1) * items_per_page`: จำกัดจำนวนผลลัพธ์ต่อหน้า และกำหนด offset เพื่อแบ่งหน้า
6.  **สร้าง JSON array ของผลลัพธ์:**
    *   `SELECT COALESCE(jsonb_agg(perfume_data || jsonb_build_object('match_score', match_score)), '[]'::jsonb)`: สร้าง JSON array ของผลลัพธ์ โดยแต่ละ element ใน array คือข้อมูลน้ำหอม (perfume_data) รวมกับคะแนนความเหมือน (match_score)
    *   `COALESCE(..., '[]'::jsonb)`: ถ้าไม่มีผลลัพธ์ จะคืนค่าเป็น JSON array ว่างเปล่า (`[]`)
7.  **คืนค่า JSONB:**
    *   `RETURN (...)`: คืนค่า JSONB ที่สร้างขึ้น

**คำสั่ง SQL ที่ใช้:**

*   `CREATE OR REPLACE FUNCTION`: สร้างหรือแทนที่ฟังก์ชัน
*   `RETURNS JSONB`: กำหนดชนิดข้อมูลที่ฟังก์ชันคืนค่า (JSONB คือ JSON binary)
*   `WITH`: สร้าง Common Table Expression (CTE)
*   `SELECT`: ดึงข้อมูลจากตาราง
*   `FROM`: ระบุตารางที่ต้องการดึงข้อมูล
*   `WHERE`: กำหนดเงื่อนไขในการดึงข้อมูล
*   `ILIKE`: เปรียบเทียบข้อความโดยไม่สนใจตัวพิมพ์เล็ก-ใหญ่
*   `TRIM`: ลบช่องว่างด้านหน้าและด้านหลังข้อความ
*   `unnest`: แปลง array เป็นหลาย record
*   `EXISTS`: ตรวจสอบว่ามี record ที่ตรงกับเงื่อนไขหรือไม่
*   `cardinality`: หาจำนวน elements ใน array
*   `COALESCE`: คืนค่าแรกที่ไม่เป็น NULL
*   `jsonb_agg`: สร้าง JSON array จากหลาย record
*   `jsonb_build_object`: สร้าง JSON object
*   `LIMIT`: จำกัดจำนวน record ที่ดึง
*   `OFFSET`: กำหนด offset ในการดึงข้อมูล

โดยรวมแล้ว ฟังก์ชันนี้มีหน้าที่กรองน้ำหอมตามเงื่อนไขต่างๆ ที่ผู้ใช้กำหนด และคืนค่าผลลัพธ์เป็น JSON array ที่มีข้อมูลน้ำหอมและคะแนนความเหมือน