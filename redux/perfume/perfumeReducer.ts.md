# คู่มือการทำงานของ `perfumeReducer.ts`

## 1. บทนำ

ไฟล์ `perfumeReducer.ts` เป็นส่วนหนึ่งของระบบจัดการสถานะ (state management) ในแอปพลิเคชัน Next.js ที่เกี่ยวข้องกับข้อมูลน้ำหอม (Perfume) โดยใช้ Redux Toolkit ไฟล์นี้มีหน้าที่จัดการ state ที่เกี่ยวข้องกับน้ำหอม, การดึงข้อมูลน้ำหอมจากฐานข้อมูล (Supabase), การจัดการความคิดเห็นและการตอบกลับ, การจัดการจำนวนการเข้าชม, และการจัดการรายการโปรด (likes) ของน้ำหอม

## 2. โครงสร้างข้อมูลหลัก (State Structure)

โครงสร้างข้อมูลหลัก (state) ที่จัดการใน `perfumeReducer.ts` มีดังนี้:

```typescript
interface PerfumeState {
 perfumes_filters_by_page: {
  [page: number]: Perfume[];
 };
 perfumes_by_page: {
  [page: number]: Perfume[];
 };
 selectedPerfume: { data: Perfume | null; errorMessages: string | null };
 most_views_by_date: PerfumeMostViews[];
 most_views_all_time: PerfumeMostViews[];
 loading: boolean;
 error: string | null;
 fetchedPerfumePages: number[];
 fetchedFilteredPages: number[];
 perfume_unique_data: PerfumeUniqueData;
 currentFilters: Filters | null;
 totalFilteredCount: number;
}
```

โดยที่:

- `perfumes_filters_by_page`: ข้อมูลน้ำหอมที่ถูกกรองแล้ว, จัดเก็บตามหน้า (pagination)
- `perfumes_by_page`: ข้อมูลน้ำหอมทั้งหมด, จัดเก็บตามหน้า
- `selectedPerfume`: ข้อมูลน้ำหอมที่ถูกเลือก (เช่น ดูรายละเอียด), รวมถึงข้อความผิดพลาด (ถ้ามี)
- `most_views_by_date`: ข้อมูลน้ำหอมที่มีจำนวนการเข้าชมสูงสุดในแต่ละวัน
- `most_views_all_time`: ข้อมูลน้ำหอมที่มีจำนวนการเข้าชมสูงสุดตลอดกาล
- `loading`: สถานะการโหลดข้อมูล (กำลังโหลดหรือไม่)
- `error`: ข้อความผิดพลาด (ถ้ามี)
- `fetchedPerfumePages`: รายการของหน้าที่ได้ดึงข้อมูลน้ำหอมมาแล้ว
- `fetchedFilteredPages`: รายการของหน้าที่ได้ดึงข้อมูลน้ำหอมที่กรองแล้วมาแล้ว
- `perfume_unique_data`: ข้อมูลเฉพาะของน้ำหอม เช่น แบรนด์, นักปรุงน้ำหอม (perfumer), ส่วนประกอบ (accords, notes)
- `currentFilters`: ตัวกรองที่กำลังใช้งาน
- `totalFilteredCount`: จำนวนรายการทั้งหมดที่ตรงกับตัวกรอง

## 3. ฟังก์ชันหลักในระบบ

ฟังก์ชันหลักในระบบแบ่งออกเป็นหมวดหมู่ต่างๆ ดังนี้:

### 3.1 การจัดการความคิดเห็น (Comment Management)

- **`addComment`**: เพิ่มความคิดเห็นใหม่ในน้ำหอม
- **`addReply`**: เพิ่มการตอบกลับในความคิดเห็น
- **`deleteComment`**: ลบความคิดเห็น
- **`deleteReply`**: ลบการตอบกลับ
- **`toggleLikeComment`**: กดไลค์/ยกเลิกไลค์ความคิดเห็น
- **`toggleLikeReply`**: กดไลค์/ยกเลิกไลค์การตอบกลับ

### 3.2 การดึงข้อมูล (Data Fetching)

- **`fetchPerfumes`**: ดึงข้อมูลน้ำหอมแบบแบ่งหน้า (paginated)
- **`fetchPerfumeById`**: ดึงข้อมูลน้ำหอมด้วย ID
- **`fetchTop5ViewsByDate`**: ดึงข้อมูลน้ำหอมที่มีจำนวนการเข้าชมสูงสุดในวันที่กำหนด
- **`fetchTop3ViewsAllTime`**: ดึงข้อมูลน้ำหอมที่มีจำนวนการเข้าชมสูงสุดตลอดกาล
- **`fetchUniqueData`**: ดึงข้อมูลเฉพาะของน้ำหอม (แบรนด์, นักปรุงน้ำหอม, ส่วนประกอบ)

### 3.3 การอัปเดตข้อมูล (Data Updating)

- **`addPerfume`**: เพิ่มข้อมูลน้ำหอมใหม่
- **`toggleLikePerfume`**: กดไลค์/ยกเลิกไลค์น้ำหอม

## 4. อธิบายการทำงานของแต่ละฟังก์ชัน

### 4.1 การจัดการความคิดเห็น

#### 4.1.1 `addComment`

1. ตรวจสอบว่าผู้ใช้ได้เข้าสู่ระบบหรือไม่ หากไม่ได้เข้าสู่ระบบ จะเกิดข้อผิดพลาด ("User must be logged in to comment").
2. สร้าง comment object ประกอบด้วย `perfumes_id`, `user`, `text`, `images` (ค่าเริ่มต้นคือ `[]`), และ `likes` (ค่าเริ่มต้นคือ `[]`).
3. ส่ง comment object ไปยัง Supabase table `comments` เพื่อทำการ insert ข้อมูล.
4. หากสำเร็จ, จะทำการปรับปรุง state โดยเพิ่มความคิดเห็นใหม่เข้าไปในรายการความคิดเห็นของน้ำหอมที่ถูกเลือก (`state.selectedPerfume.data.comments`).

#### 4.1.2 `addReply`

1. ตรวจสอบว่าผู้ใช้ได้เข้าสู่ระบบหรือไม่ หากไม่ได้เข้าสู่ระบบ จะเกิดข้อผิดพลาด ("User must be logged in to reply").
2. สร้าง reply object ประกอบด้วย `comments_id`, `user`, `text`, `images` (ค่าเริ่มต้นคือ `[]`), และ `likes` (ค่าเริ่มต้นคือ `[]`).
3. ส่ง reply object ไปยัง Supabase table `reply` เพื่อทำการ insert ข้อมูล.
4. หากสำเร็จ, จะทำการปรับปรุง state โดยเพิ่มการตอบกลับใหม่เข้าไปในรายการการตอบกลับของความคิดเห็นที่เกี่ยวข้องในน้ำหอมที่ถูกเลือก (`state.selectedPerfume.data.comments[commentIndex].replies`).

#### 4.1.3 `deleteComment`

1. ตรวจสอบว่าผู้ใช้ได้เข้าสู่ระบบหรือไม่ หากไม่ได้เข้าสู่ระบบ จะเกิดข้อผิดพลาด ("User must be logged in to delete a comment").
2. ดึงข้อมูล comment จาก Supabase table `comments` เพื่อตรวจสอบ `user` (ผู้สร้าง comment).
3. ตรวจสอบว่าผู้ใช้มีสิทธิ์ในการลบความคิดเห็นหรือไม่ (เป็นเจ้าของความคิดเห็นหรือไม่) หากไม่มีสิทธิ์ จะเกิดข้อผิดพลาด ("You don't have permission to delete this comment").
4. ทำการลบความคิดเห็นจาก Supabase table `comments` โดยใช้ `commentId`.
5. หากสำเร็จ, จะทำการปรับปรุง state โดยลบความคิดเห็นออกจากรายการความคิดเห็นของน้ำหอมที่ถูกเลือก (`state.selectedPerfume.data.comments`).

#### 4.1.4 `deleteReply`

1. ตรวจสอบว่าผู้ใช้ได้เข้าสู่ระบบหรือไม่ หากไม่ได้เข้าสู่ระบบ จะเกิดข้อผิดพลาด ("User must be logged in to delete a reply").
2. ดึงข้อมูล reply จาก Supabase table `reply` เพื่อตรวจสอบ `user` (ผู้สร้าง reply).
3. ตรวจสอบว่าผู้ใช้มีสิทธิ์ในการลบการตอบกลับหรือไม่ (เป็นเจ้าของการตอบกลับหรือไม่) หากไม่มีสิทธิ์ จะเกิดข้อผิดพลาด ("You don't have permission to delete this reply").
4. ทำการลบการตอบกลับจาก Supabase table `reply` โดยใช้ `replyId`.
5. หากสำเร็จ, จะทำการปรับปรุง state โดยลบการตอบกลับออกจากรายการการตอบกลับของความคิดเห็นที่เกี่ยวข้องในน้ำหอมที่ถูกเลือก (`state.selectedPerfume.data.comments[commentIndex].replies`).

#### 4.1.5 `toggleLikeComment`

1. ตรวจสอบว่าผู้ใช้ได้เข้าสู่ระบบหรือไม่ หากไม่ได้เข้าสู่ระบบ จะเกิดข้อผิดพลาด ("User must be logged in to like a comment").
2. ดึงข้อมูล `likes` จาก comment ใน Supabase table `comments`.
3. ตรวจสอบว่าผู้ใช้เคยกดไลค์ความคิดเห็นนี้หรือไม่.
4. หากเคยกดไลค์, จะทำการยกเลิกไลค์ (ลบ `userId` ออกจาก `likes`).
5. หากยังไม่เคยกดไลค์, จะทำการกดไลค์ (เพิ่ม `userId` เข้าไปใน `likes`).
6. ปรับปรุงข้อมูล `likes` ใน Supabase table `comments`.
7. หากสำเร็จ, จะทำการปรับปรุง state โดยปรับปรุงรายการ `likes` ของความคิดเห็นที่เกี่ยวข้องในน้ำหอมที่ถูกเลือก (`state.selectedPerfume.data.comments`).

#### 4.1.6 `toggleLikeReply`

1. ตรวจสอบว่าผู้ใช้ได้เข้าสู่ระบบหรือไม่ หากไม่ได้เข้าสู่ระบบ จะเกิดข้อผิดพลาด ("User must be logged in to like a reply").
2. ดึงข้อมูล `likes` จาก reply ใน Supabase table `reply`.
3. ตรวจสอบว่าผู้ใช้เคยกดไลค์การตอบกลับนี้หรือไม่.
4. หากเคยกดไลค์, จะทำการยกเลิกไลค์ (ลบ `userId` ออกจาก `likes`).
5. หากยังไม่เคยกดไลค์, จะทำการกดไลค์ (เพิ่ม `userId` เข้าไปใน `likes`).
6. ปรับปรุงข้อมูล `likes` ใน Supabase table `reply`.
7. หากสำเร็จ, จะทำการปรับปรุง state โดยปรับปรุงรายการ `likes` ของการตอบกลับที่เกี่ยวข้องในความคิดเห็นที่เกี่ยวข้องในน้ำหอมที่ถูกเลือก (`state.selectedPerfume.data.comments[commentIndex].replies`).

### 4.2 การดึงข้อมูล

#### 4.2.1 `fetchPerfumes`

1. ตรวจสอบว่าหน้านี้เคยถูกดึงข้อมูลมาแล้วหรือไม่ (`state.perfumes.fetchedPerfumePages`). หากเคยดึงมาแล้ว, จะไม่ทำการดึงข้อมูลซ้ำเพื่อประสิทธิภาพ.
2. ส่งคำขอไปยัง Supabase RPC function `get_perfumes_paginated` เพื่อดึงข้อมูลน้ำหอมแบบแบ่งหน้า.
3. หากสำเร็จ, จะทำการปรับปรุง state โดยเพิ่มข้อมูลน้ำหอมในหน้านั้นๆ เข้าไปใน `state.perfumes_by_page` และเพิ่มหมายเลขหน้าเข้าไปใน `state.fetchedPerfumePages`.

#### 4.2.2 `fetchPerfumeById`

1. ตรวจสอบว่าข้อมูลน้ำหอมนี้มีอยู่ใน cache หรือไม่ (`state.perfumes.perfumes_by_page`). หากมี, จะใช้ข้อมูลจาก cache เพื่อประสิทธิภาพ.
2. หากไม่มีใน cache, จะส่งคำขอไปยัง Supabase table `perfumes` เพื่อดึงข้อมูลน้ำหอมด้วย `perfumeId`.
3. ดึงข้อมูลความคิดเห็นที่เกี่ยวข้องกับน้ำหอมจาก Supabase RPC function `get_comments_by_perfume_id`.
4. ปรับปรุงจำนวนการเข้าชม (view count) ใน Supabase table `perfume_views`.
5. หากสำเร็จ, จะทำการปรับปรุง state โดยกำหนดข้อมูลน้ำหอมที่ดึงมาให้กับ `state.selectedPerfume`.

#### 4.2.3 `fetchTop5ViewsByDate`

1. ส่งคำขอไปยัง Supabase RPC function `get_top_5_views_by_date` เพื่อดึงข้อมูลน้ำหอมที่มีจำนวนการเข้าชมสูงสุดในวันที่กำหนด.
2. หากสำเร็จ, จะทำการปรับปรุง state โดยกำหนดข้อมูลน้ำหอมที่ดึงมาให้กับ `state.most_views_by_date`.

#### 4.2.4 `fetchTop3ViewsAllTime`

1. ส่งคำขอไปยัง Supabase RPC function `get_top_3_views_all_time` เพื่อดึงข้อมูลน้ำหอมที่มีจำนวนการเข้าชมสูงสุดตลอดกาล.
2. หากสำเร็จ, จะทำการปรับปรุง state โดยกำหนดข้อมูลน้ำหอมที่ดึงมาให้กับ `state.most_views_all_time`.

#### 4.2.5 `fetchUniqueData`

1. ส่งคำขอไปยัง Supabase RPC function `fetch_unique_perfume_data` เพื่อดึงข้อมูลเฉพาะของน้ำหอม (แบรนด์, นักปรุงน้ำหอม, ส่วนประกอบ).
2. หากสำเร็จ, จะทำการปรับปรุง state โดยกำหนดข้อมูลที่ดึงมาให้กับ `state.perfume_unique_data`.

### 4.3 การอัปเดตข้อมูล

#### 4.3.1 `addPerfume`

1. ตรวจสอบว่ามี `userProfile` หรือไม่.
2. อัปโหลดรูปภาพไปยัง Supabase Storage โดยใช้ function `uploadImagesToSupabase`.
3. หากอัปโหลดสำเร็จ, จะทำการสร้างข้อมูลน้ำหอมใหม่ใน Supabase table `perfumes`.
4. หากเกิดข้อผิดพลาด, จะทำการ rollback การอัปโหลดรูปภาพ (ลบรูปภาพที่อัปโหลดไปแล้ว) โดยใช้ function `rollbackUploadedFiles`.
5. หากสำเร็จ, จะทำการปรับปรุง state (ในกรณีนี้ไม่มีการปรับปรุง state โดยตรง, แต่ข้อมูลจะถูกดึงมาใหม่ในการเรียก `fetchPerfumes` ครั้งถัดไป).

#### 4.3.2 `toggleLikePerfume`

1. ส่งคำขอไปยัง Supabase RPC function `toggle_perfume_like` เพื่อทำการกดไลค์/ยกเลิกไลค์น้ำหอม.
2. หากสำเร็จ, จะทำการปรับปรุง state โดยปรับปรุงรายการ `likes` ของน้ำหอมที่ถูกเลือก (`state.selectedPerfume.data`) และใน `state.perfumes_by_page`.

## 5. การจัดการสถานะ (State Management)

ระบบจัดการสถานะ (state) ใน `perfumeReducer.ts` มีลักษณะดังนี้:

- **Loading State**: เมื่อมีการเริ่มต้นการดึงข้อมูลหรืออัปเดตข้อมูล, `state.loading` จะถูกตั้งค่าเป็น `true` เพื่อแสดงสถานะการโหลด.
- **Error Handling**: หากเกิดข้อผิดพลาดในการดึงข้อมูลหรืออัปเดตข้อมูล, `state.error` จะถูกตั้งค่าเป็นข้อความผิดพลาด.
- **Data Caching**: ข้อมูลน้ำหอมที่ถูกดึงมาแล้วจะถูกเก็บไว้ใน `state.perfumes_by_page` และ `state.selectedPerfume` เพื่อลดการดึงข้อมูลซ้ำและเพิ่มประสิทธิภาพ.
- **Optimistic Updates**: ฟังก์ชัน `toggleLikePerfume` ทำการปรับปรุง `state` ทันทีหลังจากการกดไลค์/ยกเลิกไลค์ โดยไม่ต้องรอการยืนยันจากฐานข้อมูล (Supabase) เพื่อให้ผู้ใช้ได้รับประสบการณ์ที่รวดเร็ว (แต่มีการจัดการข้อผิดพลาดในกรณีที่การอัปเดตในฐานข้อมูลล้มเหลว).
- **Immutability**: Redux Toolkit และ `createSlice` ช่วยให้มั่นใจได้ว่า state จะถูกจัดการแบบ immutable ซึ่งช่วยป้องกันข้อผิดพลาดที่อาจเกิดขึ้นจากการเปลี่ยนแปลง state โดยตรง.

โดยรวมแล้ว, `perfumeReducer.ts` เป็นส่วนสำคัญในการจัดการข้อมูลน้ำหอมในแอปพลิเคชัน, โดยมีการจัดการ state อย่างมีประสิทธิภาพ, มีการจัดการข้อผิดพลาด, และมีการใช้ cache เพื่อปรับปรุงประสิทธิภาพของแอปพลิเคชัน และใช้ Supabase เป็น backend ในการจัดการข้อมูล.
