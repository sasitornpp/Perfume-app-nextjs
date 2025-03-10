# คู่มือการทำงานของ `app/page.tsx` และ `app/loading.tsx`

## 1. บทนำ

* `app/loading.tsx`: เป็น React Client Component ที่ใช้เป็น loading screen ของทั้งแอปพลิเคชัน Next.js มีหน้าที่หลักในการดึงข้อมูลเริ่มต้นที่จำเป็นสำหรับการทำงานของแอปพลิเคชัน เช่น ข้อมูลผู้ใช้, ข้อมูลน้ำหอม, และข้อมูลอื่นๆ ที่เกี่ยวข้อง
* `app/page.tsx`: เป็น React Client Component ที่ใช้สร้างหน้า home page หลักของแอปพลิเคชัน Next.js หน้านี้แสดง hero section, featured perfumes carousel, trending perfumes, และ call to action

**หมายเหตุ:** คู่มือนี้ปรับแต่งสำหรับผู้ใช้ `Shinon2023`

## 2. โครงสร้างข้อมูลหลัก (State Structure)

### 2.1 `app/loading.tsx`

Component นี้มีการจัดการ state ดังนี้:

* **Redux State:**
  * `user.loading`: สถานะ loading ของข้อมูลผู้ใช้ (boolean)
  * `perfumes.loading`: สถานะ loading ของข้อมูลน้ำหอม (boolean)
  * `pagination.perfumesPage`: หน้าปัจจุบันสำหรับ pagination (number)

### 2.2 `app/page.tsx`

Component นี้มีการจัดการ state ดังนี้:

* **Redux State:**
  * `perfumes.most_views_by_date`: รายการน้ำหอมที่มีจำนวน view สูงสุดในวันนี้ (ประเภท `Perfume[]`). ข้อมูลนี้ถูกใช้ใน featured perfumes carousel
  * `perfumes.most_views_all_time`: รายการน้ำหอมที่มีจำนวน view สูงสุดตลอดกาล (ประเภท `Perfume[]`). ข้อมูลนี้ถูกใช้ใน trending perfumes section
* **Component State:**
  * `isLoaded`: สถานะที่บ่งบอกว่า component โหลดเสร็จแล้วหรือไม่ (boolean). ใช้สำหรับ animation
  * `activeIndex`: index ของ carousel item ที่กำลังแสดง (number). ใช้สำหรับ carousel control

## 3. ฟังก์ชันหลักในระบบ

### 3.1 `app/loading.tsx`

ฟังก์ชันหลักในระบบคือ:

* **ดึงข้อมูลเริ่มต้น:** ดึงข้อมูลผู้ใช้, ข้อมูลน้ำหอม, และข้อมูลอื่นๆ ที่เกี่ยวข้อง
* **แสดง Loading Screen:** แสดง UI loading screen ในระหว่างที่กำลังดึงข้อมูล

### 3.2 `app/page.tsx`

ฟังก์ชันหลักในระบบคือ:

* **แสดง Hero Section:** แสดง hero section ที่มีข้อมูลเกี่ยวกับแอปพลิเคชันและปุ่มสำหรับทำ survey หรือค้นหาน้ำหอม
* **แสดง Featured Perfumes Carousel:** แสดง carousel ที่มีรายการน้ำหอมที่มีจำนวน view สูงสุดในวันนี้
* **แสดง Trending Perfumes:** แสดงรายการน้ำหอมที่มีจำนวน view สูงสุดตลอดกาล

## 4. อธิบายการทำงานของแต่ละฟังก์ชัน

### 4.1 `app/loading.tsx`

1. **เข้าถึงข้อมูลจาก Redux:** ใช้ `useSelector` hook เพื่อเข้าถึงข้อมูล loading และ pagination จาก Redux store
2. **Dispatch actions:** ใช้ `useDispatch` hook เพื่อ dispatch actions สำหรับดึงข้อมูล:
    * `fetchUserData`: ดึงข้อมูลผู้ใช้
    * `fetchPerfumes`: ดึงข้อมูลน้ำหอม
    * `fetchUniqueData`: ดึงข้อมูล unique (เช่น แบรนด์)
    * `fetchTop5ViewsByDate`: ดึงข้อมูลน้ำหอมที่มี view สูงสุดในวันนี้
    * `fetchTop3ViewsAllTime`: ดึงข้อมูลน้ำหอมที่มี view สูงสุดตลอดกาล
    * `fetchTotalCount`: ดึงจำนวนน้ำหอมทั้งหมด
3. **แสดง Loading Screen:** ในระหว่างที่ `userLoading` เป็น true จะแสดง component `LoadingComponents`

### 4.2 `app/page.tsx`

1. **เข้าถึงข้อมูลจาก Redux:** ใช้ `useSelector` hook เพื่อเข้าถึงข้อมูลน้ำหอมจาก Redux store
2. **จัดการ state:** ใช้ `useState` hook เพื่อจัดการ state `isLoaded` และ `activeIndex`
3. **สร้าง carousel items:** ใช้ `createSelector` เพื่อสร้าง carousel items โดยการรวมข้อมูลน้ำหอมและข้อมูล accords
4. **แสดง UI:** Component แสดง UI สำหรับ home page
    * แสดง Hero Section
    * แสดง Featured Perfumes Carousel
    * แสดง Trending Perfumes
    * แสดง Call to Action

## 5. การจัดการสถานะ (State Management)

### 5.1 `app/loading.tsx`

Component `LoadingPage` มีการจัดการ state ดังนี้:

* **Redux State:** ใช้ `useSelector` hook เพื่อเข้าถึงข้อมูล loading และ pagination จาก Redux store

**การโหลดข้อมูล:** ข้อมูลผู้ใช้, ข้อมูลน้ำหอม, และข้อมูลอื่นๆ ถูกโหลดเมื่อแอปพลิเคชันเริ่มต้น และถูกเก็บไว้ใน Redux store

**การอัปเดตข้อมูล:** ไม่มีการอัปเดตข้อมูลโดยตรงใน component นี้

### 5.2 `app/page.tsx`

Component `Home` มีการจัดการ state ดังนี้:

* **Redux State:** ใช้ `useSelector` hook เพื่อเข้าถึงข้อมูลน้ำหอมจาก Redux store
* **Local State:** ใช้ `useState` hook เพื่อจัดการ state `isLoaded` และ `activeIndex`

**การโหลดข้อมูล:** ข้อมูลน้ำหอมถูกโหลดโดย `app/loading.tsx` และถูกเก็บไว้ใน Redux store Component `Home` เข้าถึงข้อมูลนี้ผ่าน `useSelector` hook

**การอัปเดตข้อมูล:** ไม่มีการอัปเดตข้อมูลโดยตรงใน component นี้

โดยรวมแล้ว, `app/loading.tsx` และ `app/page.tsx` ทำงานร่วมกันเพื่อสร้างหน้า home page ที่สวยงามและน่าสนใจ `app/loading.tsx` มีหน้าที่ในการดึงข้อมูลเริ่มต้น และ `app/page.tsx` มีหน้าที่ในการแสดงผลข้อมูล

สำหรับผู้ใช้ `Shinon2023`, ข้อมูลโปรไฟล์ของคุณจะถูกดึงมาใน `app/loading.tsx` และข้อมูลนี้จะถูกใช้ในการปรับแต่งประสบการณ์การใช้งานของคุณในหน้า home page
