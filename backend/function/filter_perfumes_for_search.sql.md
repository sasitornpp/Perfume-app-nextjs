# คำอธิบายฟังก์ชัน `filter_perfumes_for_search`

ฟังก์ชัน `filter_perfumes_for_search` มีหน้าที่กรองน้ำหอมจากตาราง `perfumes` โดยใช้เงื่อนไขการค้นหาที่ซับซ้อนกว่าฟังก์ชัน `filter_perfumes` ฟังก์ชันนี้มีการให้คะแนนความเกี่ยวข้อง (match score) ที่แตกต่างกันสำหรับแต่ละเงื่อนไข เช่น search query, brand, gender, accords, top notes, middle notes และ base notes นอกจากนี้ ฟังก์ชันนี้ยังมีการคำนวณจำนวนหน้ารวม (total pages) สำหรับการแบ่งหน้า (pagination) และคืนค่าผลลัพธ์เป็น JSON object ที่มีข้อมูลน้ำหอมและจำนวนหน้ารวม

**โครงสร้างฟังก์ชัน:**

```tsql
CREATE OR REPLACE FUNCTION public.filter_perfumes_for_search (
  search_query TEXT DEFAULT NULL,
  gender_filter TEXT DEFAULT NULL,
  brand_filter TEXT[] DEFAULT NULL,
  accords_filter TEXT[] DEFAULT NULL,
  top_notes_filter TEXT[] DEFAULT NULL,
  middle_notes_filter TEXT[] DEFAULT NULL,
  base_notes_filter TEXT[] DEFAULT NULL,
  page INTEGER DEFAULT 1,
  items_per_page INTEGER DEFAULT 20,
  is_tradable_filter BOOLEAN DEFAULT NULL
) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  total_items INTEGER;
  total_pages INTEGER;
  result JSONB;
BEGIN
  -- Calculate total items matching the conditions
  WITH perfume_scores AS (
    SELECT
      ((
        -- คะแนนจาก search_query (40% สูงสุด)
        CASE WHEN search_query IS NULL THEN 40.0
             ELSE (
               CASE WHEN p.name ILIKE '%' || TRIM(search_query) || '%' THEN 40.0
                    WHEN p.brand ILIKE '%' || TRIM(search_query) || '%' THEN 20.0
                    WHEN p.descriptions ILIKE '%' || TRIM(search_query) || '%' THEN 10.0
                    ELSE 0 END
             )::REAL
        END +
        -- คะแนนจาก brand_filter (30% สูงสุด)
        CASE WHEN brand_filter IS NULL OR cardinality(brand_filter) = 0 THEN 30.0
             ELSE CASE WHEN EXISTS (
                     SELECT 1 FROM unnest(brand_filter) AS bf
                     WHERE p.brand ILIKE '%' || TRIM(bf) || '%'
                   ) THEN 30.0 ELSE 0 END::REAL
        END +
        -- คะแนนจาก gender_filter (20% สูงสุด)
        CASE WHEN gender_filter IS NULL THEN 20.0
             ELSE CASE WHEN p.gender ILIKE '%' || gender_filter || '%' THEN 20.0 ELSE 0 END::REAL
        END +
        -- คะแนนจาก accords (2.5% สูงสุด)
        CASE WHEN accords_filter IS NULL OR cardinality(accords_filter) = 0 THEN 2.5
             ELSE (SELECT COUNT(*)::REAL
                   FROM unnest(p.accords) AS a
                   WHERE EXISTS (
                     SELECT 1 FROM unnest(accords_filter) AS af
                     WHERE a ILIKE '%' || af || '%'
                   )) * 2.5 / GREATEST(cardinality(accords_filter), 1)
        END +
        -- คะแนนจาก top notes (2.5% สูงสุด)
        CASE WHEN top_notes_filter IS NULL OR cardinality(top_notes_filter) = 0 THEN 2.5
             ELSE (SELECT COUNT(*)::REAL
                   FROM unnest(p.top_notes) AS t
                   WHERE EXISTS (
                     SELECT 1 FROM unnest(top_notes_filter) AS tf
                     WHERE t ILIKE '%' || tf || '%'
                   )) * 2.5 / GREATEST(cardinality(top_notes_filter), 1)
        END +
        -- คะแนนจาก middle notes (2.5% สูงสุด)
        CASE WHEN middle_notes_filter IS NULL OR cardinality(middle_notes_filter) = 0 THEN 2.5
             ELSE (SELECT COUNT(*)::REAL
                   FROM unnest(p.middle_notes) AS m
                   WHERE EXISTS (
                     SELECT 1 FROM unnest(middle_notes_filter) AS mf
                     WHERE m ILIKE '%' || mf || '%'
                   )) * 2.5 / GREATEST(cardinality(middle_notes_filter), 1)
        END +
        -- คะแนนจาก base notes (2.5% สูงสุด)
        CASE WHEN base_notes_filter IS NULL OR cardinality(base_notes_filter) = 0 THEN 2.5
             ELSE (SELECT COUNT(*)::REAL
                   FROM unnest(p.base_notes) AS b
                   WHERE EXISTS (
                     SELECT 1 FROM unnest(base_notes_filter) AS bf
                     WHERE b ILIKE '%' || bf || '%'
                   )) * 2.5 / GREATEST(cardinality(base_notes_filter), 1)
        END
      )::REAL) AS match_score
    FROM public.perfumes p
    WHERE
      -- กรอง is_tradable_filter เป็นอันดับแรก
      (is_tradable_filter IS NULL OR p.is_tradable = is_tradable_filter)
      AND (
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
      AND (brand_filter IS NULL OR cardinality(brand_filter) = 0 OR EXISTS (
             SELECT 1 FROM unnest(brand_filter) AS bf
             WHERE p.brand ILIKE '%' || TRIM(bf) || '%'
           ))
      AND (accords_filter IS NULL OR cardinality(accords_filter) = 0 OR EXISTS (
             SELECT 1 FROM unnest(p.accords) AS a
             WHERE EXISTS (
               SELECT 1 FROM unnest(accords_filter) AS af
               WHERE a ILIKE '%' || af || '%'
             )
           ))
      AND (top_notes_filter IS NULL OR cardinality(top_notes_filter) = 0 OR EXISTS (
             SELECT 1 FROM unnest(p.top_notes) AS t
             WHERE EXISTS (
               SELECT 1 FROM unnest(top_notes_filter) AS tf
               WHERE t ILIKE '%' || tf || '%'
             )
           ))
      AND (middle_notes_filter IS NULL OR cardinality(middle_notes_filter) = 0 OR EXISTS (
             SELECT 1 FROM unnest(p.middle_notes) AS m
             WHERE EXISTS (
               SELECT 1 FROM unnest(middle_notes_filter) AS mf
               WHERE m ILIKE '%' || mf || '%'
             )
           ))
      AND (base_notes_filter IS NULL OR cardinality(base_notes_filter) = 0 OR EXISTS (
             SELECT 1 FROM unnest(p.base_notes) AS b
             WHERE EXISTS (
               SELECT 1 FROM unnest(base_notes_filter) AS bf
               WHERE b ILIKE '%' || bf || '%'
             )
           ))
  )
  SELECT COUNT(*)
  INTO total_items
  FROM perfume_scores ps
  WHERE ps.match_score > 0;

  -- Calculate total pages, ensure minimum value is 1
  total_pages := GREATEST(CEIL(total_items::FLOAT / items_per_page)::INTEGER, 1);

  -- Fetch paginated data and build JSONB result
  WITH perfume_scores AS (
    SELECT
      to_jsonb(p) AS perfume_data,
      ((
        -- คะแนนจาก search_query (40% สูงสุด)
        CASE WHEN search_query IS NULL THEN 40.0
             ELSE (
               CASE WHEN p.name ILIKE '%' || TRIM(search_query) || '%' THEN 40.0
                    WHEN p.brand ILIKE '%' || TRIM(search_query) || '%' THEN 20.0
                    WHEN p.descriptions ILIKE '%' || TRIM(search_query) || '%' THEN 10.0
                    ELSE 0 END
             )::REAL
        END +
        -- คะแนนจาก brand_filter (30% สูงสุด)
        CASE WHEN brand_filter IS NULL OR cardinality(brand_filter) = 0 THEN 30.0
             ELSE CASE WHEN EXISTS (
                     SELECT 1 FROM unnest(brand_filter) AS bf
                     WHERE p.brand ILIKE '%' || TRIM(bf) || '%'
                   ) THEN 30.0 ELSE 0 END::REAL
        END +
        -- คะแนนจาก gender_filter (20% สูงสุด)
        CASE WHEN gender_filter IS NULL THEN 20.0
             ELSE CASE WHEN p.gender ILIKE '%' || gender_filter || '%' THEN 20.0 ELSE 0 END::REAL
        END +
        -- คะแนนจาก accords (2.5% สูงสุด)
        CASE WHEN accords_filter IS NULL OR cardinality(accords_filter) = 0 THEN 2.5
             ELSE (SELECT COUNT(*)::REAL
                   FROM unnest(p.accords) AS a
                   WHERE EXISTS (
                     SELECT 1 FROM unnest(accords_filter) AS af
                     WHERE a ILIKE '%' || af || '%'
                   )) * 2.5 / GREATEST(cardinality(accords_filter), 1)
        END +
        -- คะแนนจาก top notes (2.5% สูงสุด)
        CASE WHEN top_notes_filter IS NULL OR cardinality(top_notes_filter) = 0 THEN 2.5
             ELSE (SELECT COUNT(*)::REAL
                   FROM unnest(p.top_notes) AS t
                   WHERE EXISTS (
                     SELECT 1 FROM unnest(top_notes_filter) AS tf
                     WHERE t ILIKE '%' || tf || '%'
                   )) * 2.5 / GREATEST(cardinality(top_notes_filter), 1)
        END +
        -- คะแนนจาก middle notes (2.5% สูงสุด)
        CASE WHEN middle_notes_filter IS NULL OR cardinality(middle_notes_filter) = 0 THEN 2.5
             ELSE (SELECT COUNT(*)::REAL
                   FROM unnest(p.middle_notes) AS m
                   WHERE EXISTS (
                     SELECT 1 FROM unnest(middle_notes_filter) AS mf
                     WHERE m ILIKE '%' || mf || '%'
                   )) * 2.5 / GREATEST(cardinality(middle_notes_filter), 1)
        END +
        -- คะแนนจาก base notes (2.5% สูงสุด)
        CASE WHEN base_notes_filter IS NULL OR cardinality(base_notes_filter) = 0 THEN 2.5
             ELSE (SELECT COUNT(*)::REAL
                   FROM unnest(p.base_notes) AS b
                   WHERE EXISTS (
                     SELECT 1 FROM unnest(base_notes_filter) AS bf
                     WHERE b ILIKE '%' || bf || '%'
                   )) * 2.5 / GREATEST(cardinality(base_notes_filter), 1)
        END
      )::REAL) AS match_score
    FROM public.perfumes p
    WHERE
      -- กรอง is_tradable_filter เป็นอันดับแรก
      (is_tradable_filter IS NULL OR p.is_tradable = is_tradable_filter)
      AND (
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
      AND (brand_filter IS NULL OR cardinality(brand_filter) = 0 OR EXISTS (
             SELECT 1 FROM unnest(brand_filter) AS bf
             WHERE p.brand ILIKE '%' || TRIM(bf) || '%'
           ))
      AND (accords_filter IS NULL OR cardinality(accords_filter) = 0 OR EXISTS (
             SELECT 1 FROM unnest(p.accords) AS a
             WHERE EXISTS (
               SELECT 1 FROM unnest(accords_filter) AS af
               WHERE a ILIKE '%' || af || '%'
             )
           ))
      AND (top_notes_filter IS NULL OR cardinality(top_notes_filter) = 0 OR EXISTS (
             SELECT 1 FROM unnest(p.top_notes) AS t
             WHERE EXISTS (
               SELECT 1 FROM unnest(top_notes_filter) AS tf
               WHERE t ILIKE '%' || tf || '%'
             )
           ))
      AND (middle_notes_filter IS NULL OR cardinality(middle_notes_filter) = 0 OR EXISTS (
             SELECT 1 FROM unnest(p.middle_notes) AS m
             WHERE EXISTS (
               SELECT 1 FROM unnest(middle_notes_filter) AS mf
               WHERE m ILIKE '%' || mf || '%'
             )
           ))
      AND (base_notes_filter IS NULL OR cardinality(base_notes_filter) = 0 OR EXISTS (
             SELECT 1 FROM unnest(p.base_notes) AS b
             WHERE EXISTS (
               SELECT 1 FROM unnest(base_notes_filter) AS bf
               WHERE b ILIKE '%' || bf || '%'
             )
           ))
  ),
  filtered_results AS (
    SELECT
      perfume_data
    FROM perfume_scores ps
    WHERE ps.match_score > 0
    ORDER BY ps.match_score DESC, (ps.perfume_data ->> 'name')::TEXT
    LIMIT items_per_page OFFSET (page - 1) * items_per_page
  )
  SELECT jsonb_build_object(
    'data', COALESCE(jsonb_agg(perfume_data), '[]'::jsonb),
    'totalPage', total_pages
  )
  INTO result
  FROM filtered_results;

  RETURN result;
END;
$$;
```

**ขั้นตอนการทำงาน:**

1. **สร้างฟังก์ชัน:**
    * `CREATE OR REPLACE FUNCTION public.filter_perfumes_for_search (...) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER`: สร้างหรือแทนที่ฟังก์ชันชื่อ `filter_perfumes_for_search` ที่รับ input เป็นเงื่อนไขต่างๆ ในการกรอง, หมายเลขหน้า (page), จำนวนรายการต่อหน้า (items_per_page) และ flag สำหรับการกรองน้ำหอมที่สามารถแลกเปลี่ยนได้ (is_tradable_filter) และคืนค่าเป็น JSONB
2. **กำหนด search path:**
    * `SET search_path = public AS $$`: กำหนด search path เป็น `public` เพื่อให้ฟังก์ชันสามารถเข้าถึงตาราง `perfumes` ได้
3. **ประกาศตัวแปร:**
    * `DECLARE total_items INTEGER;`: ประกาศตัวแปร `total_items` เพื่อเก็บจำนวนรายการทั้งหมดที่ตรงกับเงื่อนไข
    * `DECLARE total_pages INTEGER;`: ประกาศตัวแปร `total_pages` เพื่อเก็บจำนวนหน้ารวมสำหรับการแบ่งหน้า
    * `DECLARE result JSONB;`: ประกาศตัวแปร `result` เพื่อเก็บผลลัพธ์ที่ได้จากฟังก์ชัน
4. **เริ่มต้นการทำงาน:**
    * `BEGIN ... END;`: กำหนดขอบเขตการทำงานของฟังก์ชัน
5. **คำนวณจำนวนรายการทั้งหมดที่ตรงกับเงื่อนไข (total_items):**
    * `WITH perfume_scores AS (...) SELECT COUNT(*) INTO total_items FROM perfume_scores ps WHERE ps.match_score > 0;`: สร้าง CTE ชื่อ `perfume_scores` เพื่อคำนวณคะแนนความเหมือน (match score) ของน้ำหอมแต่ละขวดกับเงื่อนไขที่ผู้ใช้กำหนด และใช้ `SELECT COUNT(*)` เพื่อนับจำนวนรายการทั้งหมดที่มีคะแนนความเหมือนมากกว่า 0
    * **การให้คะแนนความเหมือน:**
        * มีการให้คะแนนที่แตกต่างกันสำหรับแต่ละเงื่อนไข:
            * search_query: 40% (ชื่อ 40%, แบรนด์ 20%, คำอธิบาย 10%)
            * brand_filter: 30%
            * gender_filter: 20%
            * accords, top notes, middle notes, base notes: 2.5%
        * `CASE WHEN ... THEN ... ELSE ... END`: ใช้ `CASE` statement เพื่อกำหนดคะแนนสำหรับแต่ละเงื่อนไข
        * `EXISTS (SELECT 1 FROM unnest(...) AS ... WHERE ...)`: ใช้ `EXISTS` ร่วมกับ `unnest` เพื่อตรวจสอบว่ามีข้อมูลใน array ที่ตรงกับเงื่อนไขหรือไม่
    * **WHERE clause:**
        * `(is_tradable_filter IS NULL OR p.is_tradable = is_tradable_filter)`: กรองน้ำหอมตาม `is_tradable_filter` เป็นอันดับแรก
        * มีการตรวจสอบเงื่อนไขอื่นๆ เช่นเดียวกับฟังก์ชัน `filter_perfumes`
6. **คำนวณจำนวนหน้ารวม (total_pages):**
    * `total_pages := GREATEST(CEIL(total_items::FLOAT / items_per_page)::INTEGER, 1);`: คำนวณจำนวนหน้ารวมโดยใช้สูตร `CEIL(total_items / items_per_page)` และใช้ `GREATEST` เพื่อให้แน่ใจว่าจำนวนหน้ารวมมีค่าอย่างน้อย 1
7. **ดึงข้อมูลน้ำหอมและสร้าง JSONB result:**
    * `WITH perfume_scores AS (...) SELECT jsonb_build_object(...) INTO result FROM filtered_results;`: สร้าง CTE ชื่อ `perfume_scores` อีกครั้ง (เนื่องจากต้องใช้ข้อมูลในการแบ่งหน้า) และใช้ `SELECT jsonb_build_object(...)` เพื่อสร้าง JSON object ที่มีข้อมูลน้ำหอมและจำนวนหน้ารวม
    * **CTE `filtered_results`:**
        * `SELECT perfume_data FROM perfume_scores ps WHERE ps.match_score > 0 ORDER BY ps.match_score DESC, (ps.perfume_data ->> 'name')::TEXT LIMIT items_per_page OFFSET (page - 1) * items_per_page`: เลือกข้อมูลน้ำหอมที่มีคะแนนความเหมือนมากกว่า 0 และเรียงลำดับตามคะแนนความเหมือนและชื่อน้ำหอม จากนั้นจำกัดจำนวนรายการตาม `items_per_page` และ `page`
    * **สร้าง JSON object:**
        * `jsonb_build_object('data', COALESCE(jsonb_agg(perfume_data), '[]'::jsonb), 'totalPage', total_pages)`: สร้าง JSON object ที่มี key `data` ซึ่งเป็น JSON array ของข้อมูลน้ำหอม และ key `totalPage` ซึ่งเป็นจำนวนหน้ารวม
        * `COALESCE(jsonb_agg(perfume_data), '[]'::jsonb)`: ถ้าไม่มีข้อมูลน้ำหอม จะคืนค่าเป็น JSON array ว่างเปล่า (`[]`)
8. **คืนค่า JSONB:**
    * `RETURN result;`: คืนค่า JSONB ที่สร้างขึ้น

**คำสั่ง SQL ที่ใช้:**

* `CREATE OR REPLACE FUNCTION`: สร้างหรือแทนที่ฟังก์ชัน
* `RETURNS JSONB`: กำหนดชนิดข้อมูลที่ฟังก์ชันคืนค่า (JSONB คือ JSON binary)
* `DECLARE`: ประกาศตัวแปร
* `SET search_path`: กำหนด search path
* `WITH`: สร้าง Common Table Expression (CTE)
* `SELECT`: ดึงข้อมูลจากตาราง
* `FROM`: ระบุตารางที่ต้องการดึงข้อมูล
* `WHERE`: กำหนดเงื่อนไขในการดึงข้อมูล
* `ILIKE`: เปรียบเทียบข้อความโดยไม่สนใจตัวพิมพ์เล็ก-ใหญ่
* `TRIM`: ลบช่องว่างด้านหน้าและด้านหลังข้อความ
* `unnest`: แปลง array เป็นหลาย record
* `EXISTS`: ตรวจสอบว่ามี record ที่ตรงกับเงื่อนไขหรือไม่
* `cardinality`: หาจำนวน elements ใน array
* `COALESCE`: คืนค่าแรกที่ไม่เป็น NULL
* `jsonb_agg`: สร้าง JSON array จากหลาย record
* `jsonb_build_object`: สร้าง JSON object
* `LIMIT`: จำกัดจำนวน record ที่ดึง
* `OFFSET`: กำหนด offset ในการดึงข้อมูล
* `CEIL`: ปัดเศษขึ้น
* `GREATEST`: หาค่าที่มากที่สุด

โดยรวมแล้ว ฟังก์ชันนี้มีความสามารถในการกรองน้ำหอมที่ซับซ้อนกว่าฟังก์ชัน `filter_perfumes` และมีการคำนวณจำนวนหน้ารวมสำหรับการแบ่งหน้า ทำให้เหมาะสำหรับการใช้งานในการค้นหาน้ำหอมที่มีเงื่อนไขหลากหลายและมีการแสดงผลแบบแบ่งหน้า
