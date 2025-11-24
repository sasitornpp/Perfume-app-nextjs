# ระบบแนะนำน้ำหอม (Perfume Recommendation System)

## ภาพรวม (Overview)

ระบบแนะนำน้ำหอมเป็นระบบที่ช่วยผู้ใช้ค้นหาน้ำหอมที่เหมาะสมกับความต้องการโดยผ่านแบบฟอร์ม Quiz ที่มี 7 ขั้นตอน ระบบจะคำนวณคะแนนความเหมาะสม (match score) จากข้อมูลที่ผู้ใช้กรอก และแสดงผลน้ำหอมที่เหมาะสมที่สุด

## Data Flow Diagram (แผนภาพการไหลของข้อมูล)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER (ผู้ใช้)                                 │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 │ เข้าหน้า Quiz
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│              /components/perfume-quiz.tsx                               │
│                    (QUIZ COMPONENT)                                     │
├─────────────────────────────────────────────────────────────────────────┤
│  Step 1: Welcome                                                        │
│  Step 2: Gender (for men / for women / No Preference)                  │
│  Step 3: Situation (daily / formal / date / party / exercise)          │
│  Step 4: Accords (เลือกสูงสุด 5 รายการ)                                │
│  Step 5: Notes (top / middle / base)                                    │
│  Step 6: Birthday (Monday-Sunday → accord mapping)                      │
│  Step 7: Brand (เลือก 1 แบรนด์ หรือไม่เลือก)                           │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 │ กด "Find My Fragrances"
                                 │ 
                                 │ formData = {
                                 │   gender_filter: "for men",
                                 │   accords_filter: ["woody", "fresh"],
                                 │   top_notes_filter: ["bergamot"],
                                 │   middle_notes_filter: ["lavender"],
                                 │   base_notes_filter: ["cedar"],
                                 │   brand_filter: "Dior"
                                 │ }
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│           /redux/user/userReducer.ts                                    │
│              fetchSuggestedPerfumes                                     │
├─────────────────────────────────────────────────────────────────────────┤
│  1. รับ filters จาก Quiz                                               │
│  2. เรียก Supabase RPC function                                         │
│     supabaseClient.rpc("filter_perfumes", filters)                      │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 │ HTTP Request
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│         /backend/function/filter_perfumes.sql                           │
│              (DATABASE FUNCTION)                                        │
├─────────────────────────────────────────────────────────────────────────┤
│  FOR EACH perfume IN database:                                          │
│                                                                         │
│    match_score = (                                                      │
│      accords_match * 25% +                                              │
│      top_notes_match * 25% +                                            │
│      middle_notes_match * 25% +                                         │
│      base_notes_match * 25%                                             │
│    )                                                                    │
│                                                                         │
│  Filter:                                                                │
│    - match_score > 0                                                    │
│    - gender_filter (if selected)                                        │
│    - brand_filter (if selected)                                         │
│                                                                         │
│  Sort by: match_score DESC, name ASC                                    │
│  Limit: items_per_page                                                  │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 │ คืนค่า JSONB Array
                                 │ [
                                 │   {
                                 │     id: "...",
                                 │     name: "Sauvage",
                                 │     brand: "Dior",
                                 │     match_score: 85.5,
                                 │     ...
                                 │   },
                                 │   ...
                                 │ ]
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│           /redux/user/userReducer.ts                                    │
│              fetchSuggestedPerfumes (Response)                          │
├─────────────────────────────────────────────────────────────────────────┤
│  1. รับผลลัพธ์จาก database                                             │
│  2. อัพเดท Redux state:                                                 │
│     state.user.profile.suggestions_perfumes = results                   │
│  3. Navigate to /profile?q=recommendations                              │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│           /app/(Main)/profile/page.tsx                                  │
│              (PROFILE PAGE - RECOMMENDATIONS TAB)                       │
├─────────────────────────────────────────────────────────────────────────┤
│  1. อ่าน suggestions_perfumes จาก Redux state                          │
│  2. แสดงผล PerfumeCard สำหรับแต่ละน้ำหอม                               │
│  3. แสดง match_score เป็นเปอร์เซ็นต์                                   │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 │ แสดงผลให้ผู้ใช้เห็น
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER (ผู้ใช้)                                   │
│                 ได้เห็นน้ำหอมที่แนะนำพร้อมคะแนน                        │
└─────────────────────────────────────────────────────────────────────────┘
```

## ไฟล์ที่เกี่ยวข้อง (Related Files)

### 1. Frontend Components

#### `/components/perfume-quiz.tsx` (หน้า Quiz หลัก)
**บทบาท**: เป็น UI Component สำหรับแสดงแบบฟอร์มถามผู้ใช้ 7 ขั้นตอน

**ขั้นตอนการทำงาน**:
1. **Welcome**: หน้าแรกต้อนรับผู้ใช้
2. **Gender Preference**: เลือกเพศที่ต้องการ (Male/Female/No Preference)
3. **Situation**: เลือกโอกาสที่จะใช้น้ำหอม (Daily/Formal/Date/Party/Exercise)
4. **Accords**: เลือก fragrance accords ที่ชอบ (สูงสุด 5 รายการ)
5. **Notes**: เลือก Top/Middle/Base notes ที่ชอบ
6. **Birthday**: เลือกวันเกิด (จะแปลงเป็น accords ที่เหมาะสม)
7. **Brand**: เลือกแบรนด์ที่ชอบ (ถ้ามี)

**State Management**:
```typescript
const [formData, setFormData] = useState<Filters>({
  search_query: null,
  brand_filter: null,
  page: 1,
  gender_filter: null,
  accords_filter: [],
  top_notes_filter: [],
  middle_notes_filter: [],
  base_notes_filter: [],
  items_per_page: 10,
});
```

**การส่งข้อมูล**:
```typescript
const handleSubmit = () => {
  dispatch(fetchSuggestedPerfumes({ filters: formData }));
  router.push("/profile?q=recommendations");
};
```

### 2. Redux State Management

#### `/redux/user/userReducer.ts`
**Function**: `fetchSuggestedPerfumes` (บรรทัด 419-447)

**บทบาท**: รับข้อมูลจากฟอร์มและเรียก Database Function เพื่อค้นหาน้ำหอมที่เหมาะสม

**การทำงาน**:
1. รับ `filters` object จาก Quiz
2. เรียก Supabase RPC function `filter_perfumes` พร้อมส่ง filters
3. รับผลลัพธ์เป็น array ของน้ำหอมพร้อม match_score
4. บันทึกผลลัพธ์ลง user profile (`suggestions_perfumes`)
5. Update Redux state

**โค้ด**:
```typescript
export const fetchSuggestedPerfumes = createAsyncThunk(
  "perfume/fetchSuggestedPerfumes",
  async (
    { filters }: { filters: Filters },
    { rejectWithValue, dispatch },
  ) => {
    try {
      console.log("Fetching suggested perfumes with filters:", filters);
      const { data, error } = await supabaseClient
        .rpc("filter_perfumes", filters)
        .select();
      if (error) throw error;

      const perfumes = data as suggestedPerfume[];

      dispatch(
        updateProfile({
          formData: {
            suggestions_perfumes: perfumes,
          } as ProfileSettingsProps,
        }),
      );
      console.log("Suggested perfumes fetched:", perfumes);
      return perfumes;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);
```

### 4. Viewing Recommendations (การดูผลลัพธ์)

#### `/app/(Main)/profile/page.tsx`
**Component**: ProfilePage (Recommendations Tab)

**บทบาท**: แสดงผลน้ำหอมที่แนะนำจากการทำ Quiz

**การทำงาน**:
1. อ่านข้อมูล `suggestions_perfumes` จาก Redux state
2. แสดงผลโดยใช้ `PerfumeCard` component สำหรับแต่ละน้ำหอม
3. แต่ละการ์ดจะแสดง:
   - รูปภาพน้ำหอม
   - ชื่อน้ำหอม
   - แบรนด์
   - คะแนนความเหมาะสม (match_score)
   - ข้อมูลอื่นๆ (ราคา, accords, notes)

**โค้ด**:
```typescript
const selectMySuggestedPerfumes = (state: RootState) =>
  state.user.profile?.suggestions_perfumes;

const suggestionsPerfumes = useSelector(selectMySuggestedPerfumes);

// ในส่วน JSX
<TabsContent value="recommendations">
  <div className="flex flex-wrap gap-4 justify-center">
    {suggestionsPerfumes && suggestionsPerfumes.length > 0 ? (
      suggestionsPerfumes.map((perfume, index) => (
        <PerfumeCard
          key={perfume.id}
          perfume={perfume}
          index={index}
        />
      ))
    ) : (
      <div className="col-span-full p-8 text-center">
        <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">
          No Recommendations Yet
        </h3>
        <p className="text-muted-foreground mb-4">
          Take the perfume quiz to get personalized recommendations
        </p>
      </div>
    )}
  </div>
</TabsContent>
```

**การเข้าถึง**:
- URL: `/profile?q=recommendations`
- Tab: "Recommendations" ในหน้า Profile
- ผู้ใช้สามารถ:
  - ดูน้ำหอมที่แนะนำพร้อมคะแนนความเหมาะสม
  - คลิกดูรายละเอียดของแต่ละน้ำหอม
  - กดถูกใจหรือเพิ่มลงตะกร้า
  - ทำ Quiz ใหม่เพื่ออัพเดท recommendations

### 6. Backend Database Function

#### `/backend/function/filter_perfumes.sql`
**Function**: `filter_perfumes` (PostgreSQL Function)

**บทบาท**: คำนวณคะแนนความเหมาะสม (match score) ระหว่างน้ำหอมกับความต้องการของผู้ใช้

**Parameters**:
- `search_query`: ข้อความค้นหา (optional)
- `gender_filter`: เพศที่ต้องการ (optional)
- `brand_filter`: แบรนด์ที่ต้องการ (optional)
- `accords_filter`: array ของ accords ที่ต้องการ
- `top_notes_filter`: array ของ top notes ที่ต้องการ
- `middle_notes_filter`: array ของ middle notes ที่ต้องการ
- `base_notes_filter`: array ของ base notes ที่ต้องการ
- `page`: หน้าที่ต้องการ (pagination)
- `items_per_page`: จำนวนรายการต่อหน้า

**วิธีการคำนวณ Match Score** (คะแนนเต็ม 100%):

1. **Accords Match** (25% สูงสุด)
   - นับจำนวน accords ที่ตรงกับที่ผู้ใช้เลือก
   - หารด้วยจำนวน accords ทั้งหมด (ใช้ค่าที่มากกว่า)
   - คูณด้วย 25

2. **Top Notes Match** (25% สูงสุด)
   - นับจำนวน top notes ที่ตรงกับที่ผู้ใช้เลือก
   - หารด้วยจำนวน top notes ทั้งหมด
   - คูณด้วย 25

3. **Middle Notes Match** (25% สูงสุด)
   - นับจำนวน middle notes ที่ตรงกับที่ผู้ใช้เลือก
   - หารด้วยจำนวน middle notes ทั้งหมด
   - คูณด้วย 25

4. **Base Notes Match** (25% สูงสุด)
   - นับจำนวน base notes ที่ตรงกับที่ผู้ใช้เลือก
   - หารด้วยจำนวน base notes ทั้งหมด
   - คูณด้วย 25

**สูตรคำนวณ**:
```sql
match_score = (
  (matching_accords / max(user_accords, perfume_accords)) * 25 +
  (matching_top_notes / max(user_top_notes, perfume_top_notes)) * 25 +
  (matching_middle_notes / max(user_middle_notes, perfume_middle_notes)) * 25 +
  (matching_base_notes / max(user_base_notes, perfume_base_notes)) * 25
)
```

**การกรองข้อมูล**:
- กรองตาม search_query (ชื่อ, แบรนด์, เพศ, descriptions, notes)
- กรองตาม gender_filter
- กรองตาม brand_filter
- เฉพาะน้ำหอมที่มี match_score > 0 เท่านั้น
- เรียงตาม match_score จากมากไปน้อย
- รองลงมาเรียงตามชื่อน้ำหอม (alphabetically)

**Output**:
```json
[
  {
    "id": "...",
    "name": "Perfume Name",
    "brand": "Brand Name",
    "gender": "for men",
    "accords": ["woody", "fresh"],
    "top_notes": ["bergamot", "lemon"],
    "middle_notes": ["lavender", "rosemary"],
    "base_notes": ["cedar", "vetiver"],
    "match_score": 75.5,
    ... (ข้อมูลน้ำหอมอื่นๆ)
  }
]
```

### 7. Type Definitions (การกำหนดประเภทข้อมูล)

#### `/types/perfume.ts`

**Filters Interface** (บรรทัด 69-79):
```typescript
export interface Filters {
  search_query: string | null;
  brand_filter: string | null;
  page: number;
  gender_filter: string | null;
  accords_filter: string[];
  top_notes_filter: string[];
  middle_notes_filter: string[];
  base_notes_filter: string[];
  items_per_page: number;
}
```

**suggestedPerfume Interface** (บรรทัด 60-62):
```typescript
export interface suggestedPerfume extends Perfume {
  match_score?: number;
}
```

**Situation Mapping** (บรรทัด 128-280):
แมป situation ต่างๆ กับ accords ที่เหมาะสม:
- `daily`: Woody, Powdery, Fresh Spicy, Soft Spicy, Sweet, Vanilla, Citrus, etc.
- `formal`: Oud, Woody, Amber, Rose, Powdery, Patchouli, Warm Spicy, etc.
- `date`: Rose, Amber, Vanilla, Powdery, Musky, Caramel, etc.
- `party`: Oud, Woody, Amber, Patchouli, Warm Spicy, Balsamic, etc.
- `exercise`: Citrus, Fresh Spicy, Ozonic, Lactonic, etc.

**Birthday-Accord Mapping** (ในไฟล์ perfume-quiz.tsx บรรทัด 44-52):
```typescript
const birthdateAccords = {
  monday: ["fresh"],
  tuesday: ["spicy"],
  wednesday: ["floral"],
  thursday: ["oriental"],
  friday: ["fruity"],
  saturday: ["woody"],
  sunday: ["powdery"],
};
```

## Data Flow (ขั้นตอนการทำงานทั้งหมด)

```
1. ผู้ใช้เข้าหน้า Quiz (/components/perfume-quiz.tsx)
   ↓
2. ผู้ใช้ตอบคำถาม 7 ขั้นตอน
   - เลือก gender, situation, accords, notes, birthday, brand
   - ข้อมูลถูกเก็บใน formData state
   ↓
3. ผู้ใช้กดปุ่ม "Find My Fragrances"
   - เรียก handleSubmit()
   ↓
4. Dispatch fetchSuggestedPerfumes({ filters: formData })
   - ส่งข้อมูล filters ไปยัง Redux thunk
   ↓
5. Redux Thunk เรียก Supabase RPC
   - supabaseClient.rpc("filter_perfumes", filters)
   ↓
6. Database Function (filter_perfumes.sql) ทำงาน
   - คำนวณ match_score สำหรับทุกน้ำหอม
   - กรองและเรียงลำดับตาม match_score
   - คืนค่า array ของน้ำหอมพร้อม match_score
   ↓
7. Redux State อัพเดท
   - บันทึกผลลัพธ์ใน profile.suggestions_perfumes
   ↓
8. Navigate ไปหน้าโปรไฟล์
   - router.push("/profile?q=recommendations")
   ↓
9. หน้า Profile Page แสดงผล (app/(Main)/profile/page.tsx)
   - อ่านจาก state.user.profile.suggestions_perfumes
   - ใช้ PerfumeCard component แสดงแต่ละน้ำหอม
   - แสดง match_score เป็นเปอร์เซ็นต์
   ↓
10. ผู้ใช้เห็นผลลัพธ์
   - สามารถดูรายละเอียดน้ำหอม
   - กดถูกใจหรือเพิ่มลงตะกร้า
   - ทำ Quiz ใหม่ได้ตลอดเวลา
```

## ตัวอย่างการใช้งาน (Example Usage)

### ตัวอย่างที่ 1: ผู้ใช้ต้องการน้ำหอมสำหรับเดท

**Input**:
```typescript
{
  gender_filter: "for men",
  accords_filter: ["Rose", "Amber", "Vanilla", "Musky"],
  top_notes_filter: ["Bergamot", "Lemon"],
  middle_notes_filter: ["Rose", "Jasmine"],
  base_notes_filter: ["Amber", "Vanilla"],
  brand_filter: null,
  search_query: null
}
```

**Output** (ตัวอย่าง):
```json
[
  {
    "name": "Dior Sauvage Elixir",
    "brand": "Dior",
    "gender": "for men",
    "accords": ["Amber", "Spicy", "Woody"],
    "match_score": 68.5
  },
  {
    "name": "Bleu de Chanel",
    "brand": "Chanel",
    "gender": "for men",
    "accords": ["Woody", "Aromatic"],
    "match_score": 45.2
  }
]
```

### ตัวอย่างที่ 2: ผู้ใช้เลือก Situation

เมื่อผู้ใช้เลือก "Party":
```typescript
handleSituationChange("party")
// จะ set accords_filter เป็น:
// ["Oud", "Woody", "Amber", "Patchouli", "Warm Spicy", ...]
```

### ตัวอย่างที่ 3: ผู้ใช้เลือก Birthday

เมื่อผู้ใช้เลือก "Monday":
```typescript
// จะ set accords_filter เป็น: ["fresh"]
setFormData({
  ...formData,
  accords_filter: ["fresh"]
});
```

## Features พิเศษ

### 1. Situation-Based Recommendation
แทนที่จะให้ผู้ใช้เลือก accords เอง ระบบมี pre-defined sets สำหรับแต่ละสถานการณ์:
- Daily: เหมาะสำหรับใช้ประจำวัน
- Formal: เหมาะสำหรับงานทางการ
- Date: เหมาะสำหรับเดท
- Party: เหมาะสำหรับงานปาร์ตี้
- Exercise: เหมาะสำหรับออกกำลังกาย

### 2. Birthday-Based Recommendation
ระบบแปลงวันเกิดเป็น accord ที่แนะนำ:
- Monday → Fresh
- Tuesday → Spicy
- Wednesday → Floral
- Thursday → Oriental
- Friday → Fruity
- Saturday → Woody
- Sunday → Powdery

### 3. Progressive Disclosure
Quiz แบ่งเป็น 7 ขั้นตอน พร้อม Progress Bar แสดงความคืบหน้า:
```typescript
const progress = ((currentStep + 1) / totalSteps) * 100;
```

### 4. Search & Filter in Quiz
ในแต่ละขั้นตอน ผู้ใช้สามารถค้นหาได้:
- Search accords, notes, brands
- แสดงผลสูงสุด 50 รายการต่อครั้ง
- เรียงตาม alphabetical order

### 5. Multi-Select with Limits
- Accords: เลือกได้สูงสุด 5 รายการ
- Notes: ไม่จำกัดจำนวน
- Brand: เลือกได้ 1 รายการ

## การปรับปรุงในอนาคต (Future Improvements)

1. **Machine Learning Integration**
   - ใช้ history การชอบ/ไม่ชอบของผู้ใช้มา improve recommendations
   - Collaborative filtering จากผู้ใช้คนอื่นที่มีความชอบคล้ายกัน

2. **Advanced Scoring**
   - Weight แต่ละ category ตามความสำคัญ
   - พิจารณาปัจจัยอื่นๆ เช่น price range, season, occasion

3. **A/B Testing**
   - ทดสอบ Quiz flow ต่างๆ เพื่อหา conversion rate ที่ดีที่สุด

4. **Personalization**
   - จดจำ preferences ของผู้ใช้
   - Quick retry กับ filters เดิม

5. **Social Features**
   - แชร์ผลลัพธ์ Quiz
   - ดูผลลัพธ์ของเพื่อน

## Quick Reference (คู่มืออ้างอิงอย่างรวดเร็ว)

### ไฟล์สำคัญและบรรทัดที่ควรรู้จัก

| ไฟล์ | บรรทัด | รายละเอียด |
|------|--------|-----------|
| `/components/perfume-quiz.tsx` | 44-52 | Birthday-Accord mapping |
| `/components/perfume-quiz.tsx` | 119-153 | State management (formData) |
| `/components/perfume-quiz.tsx` | 350-353 | handleSubmit - ส่งข้อมูลไปคำนวณ |
| `/redux/user/userReducer.ts` | 419-447 | fetchSuggestedPerfumes - Redux action |
| `/backend/function/filter_perfumes.sql` | 16-57 | Match score calculation algorithm |
| `/app/(Main)/profile/page.tsx` | 72-77 | อ่านและแสดงผล suggestions_perfumes |
| `/types/perfume.ts` | 69-79 | Filters interface |
| `/types/perfume.ts` | 60-62 | suggestedPerfume interface |
| `/types/perfume.ts` | 130-280 | Situation-Accord mappings |

### คำสั่งสำคัญ

**ทดสอบระบบ**:
```bash
# 1. เริ่ม development server
npm run dev

# 2. เปิดเบราว์เซอร์ไปที่
# http://localhost:3000/perfumes/quiz

# 3. กรอกข้อมูล Quiz

# 4. ดูผลลัพธ์ที่
# http://localhost:3000/profile?q=recommendations
```

**ตรวจสอบ Database Function**:
```sql
-- ทดสอบ filter_perfumes function
SELECT * FROM filter_perfumes(
  search_query := null,
  gender_filter := 'for men',
  brand_filter := null,
  accords_filter := ARRAY['woody', 'fresh'],
  top_notes_filter := ARRAY['bergamot'],
  middle_notes_filter := ARRAY['lavender'],
  base_notes_filter := ARRAY['cedar'],
  page := 1,
  items_per_page := 10
);
```

**ดู Redux State**:
```javascript
// ใน Browser Console
// ดู state ทั้งหมด
window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__

// หรือใช้ Redux DevTools Extension
// เปิด tab "State" -> "user" -> "profile" -> "suggestions_perfumes"
```

### Flow การแก้ไข

**เพิ่ม/แก้ไข Situation**:
1. แก้ไขใน `/types/perfume.ts` (บรรทัด 130-280)
2. ไม่ต้องแก้อะไรเพิ่มที่อื่น (ระบบจะอ่านจาก `situation` object อัตโนมัติ)

**เพิ่ม/แก้ไข Birthday Mapping**:
1. แก้ไขใน `/components/perfume-quiz.tsx` (บรรทัด 44-52)
2. เพิ่มวันในสัปดาห์และ accord ที่เหมาะสม

**ปรับ Match Score Algorithm**:
1. แก้ไขใน `/backend/function/filter_perfumes.sql` (บรรทัด 16-57)
2. ปรับเปอร์เซ็นต์ของแต่ละ category (ปัจจุบันอยู่ที่ 25% แต่ละส่วน)
3. Run migration หรือ update function ใน Supabase Dashboard

**เพิ่มขั้นตอนใหม่ใน Quiz**:
1. เพิ่มใน `steps` array (บรรทัด 55-92)
2. เพิ่ม case ใหม่ใน `renderStepContent()` function
3. เพิ่ม handler function สำหรับ step ใหม่
4. อัพเดท `Filters` interface ใน `/types/perfume.ts` ถ้าจำเป็น

### คำถามที่พบบ่อย (FAQ)

**Q: ทำไม match_score ของผู้ใช้บางคนต่ำ?**  
A: เพราะน้ำหอมในระบบมี accords/notes ที่ไม่ตรงกับที่ผู้ใช้เลือก แนะนำให้ผู้ใช้เลือก accords/notes ที่หลากหลายมากขึ้น หรือใช้ Situation-based selection

**Q: ผู้ใช้ทำ Quiz ใหม่ recommendations เดิมจะหายไหม?**  
A: ใช่ จะ replace ด้วยผลลัพธ์ใหม่ (อาจพิจารณาเก็บ history ในอนาคต)

**Q: สามารถกรองผลลัพธ์ต่อหลังจากได้ recommendations แล้วได้ไหม?**  
A: ตอนนี้ยังไม่ได้ แต่สามารถเพิ่ม client-side filtering ในหน้า profile ได้

**Q: Match score คำนวณอย่างไร?**  
A: รวม 4 ส่วน: accords (25%), top notes (25%), middle notes (25%), base notes (25%) โดยนับจำนวนที่ตรงกันหารด้วยจำนวนทั้งหมด

**Q: ทำไมต้องใช้ GREATEST ใน SQL?**  
A: เพื่อป้องกันการหารด้วย 0 และให้ผลลัพธ์ที่เป็นธรรมเมื่อผู้ใช้เลือกน้อยกว่าหรือมากกว่าน้ำหอม

## สรุป (Summary)

ระบบแนะนำน้ำหอมทำงานโดย:

1. **รับข้อมูล**: จาก Quiz 7 ขั้นตอน (gender, situation, accords, notes, birthday, brand)
2. **คำนวณคะแนน**: ใช้ database function คำนวณ match score จาก 4 categories (accords, top/middle/base notes)
3. **กรองและเรียง**: กรองน้ำหอมที่ match > 0 และเรียงตามคะแนนจากมากไปน้อย
4. **แสดงผล**: นำไปแสดงในหน้าโปรไฟล์พร้อมคะแนนความเหมาะสม

ระบบนี้ช่วยให้ผู้ใช้ค้นหาน้ำหอมที่เหมาะสมได้อย่างรวดเร็วและแม่นยำ โดยไม่ต้องค้นหาเองทีละรายการ
