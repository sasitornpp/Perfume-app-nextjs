# คู่มือการทำงานของ `app/perfumes/home/search/page.tsx`

## 1. บทนำ

ไฟล์ `app/perfumes/home/search/page.tsx` เป็น React component ที่ใช้สร้างหน้าค้นหาและแสดงผลรายการน้ำหอมในแอปพลิเคชัน Next.js หน้านี้ช่วยให้ผู้ใช้สามารถค้นหาน้ำหอมโดยใช้คำค้นหา, filter ต่างๆ และแสดงผลลัพธ์พร้อมระบบ pagination

**หมายเหตุ:** คู่มือนี้ปรับแต่งสำหรับผู้ใช้ `Shinon2023`

## 2. โครงสร้างข้อมูลหลัก (State Structure)

Component นี้มีการจัดการ state ดังนี้:

*   **Redux State:**
    *   `perfumes.loading`: สถานะ loading ของข้อมูลน้ำหอม (boolean).  สถานะนี้จะบอกว่าระบบกำลังโหลดข้อมูลน้ำหอมอยู่หรือไม่
    *   `perfumes.perfumes_by_page`: ข้อมูลน้ำหอมที่ถูกแบ่งตามหน้า (ประเภท `Record<string, Perfume[]>`).  ข้อมูลน้ำหอมจะถูกแบ่งเป็นหน้าๆ เพื่อรองรับระบบ pagination
    *   `filters.Filters`: ข้อมูล filter ที่ถูกเลือก (ประเภท `Filters`).  ข้อมูลนี้จะถูกใช้ในการกรองผลลัพธ์การค้นหาน้ำหอม
    *   `filters.perfumes`: ข้อมูลน้ำหอมที่ถูกกรองแล้ว (ประเภท `Record<number, Perfume[]>`). ข้อมูลนี้จะถูกใช้เมื่อมีการใช้ filter
    *   `pagination.perfumesTotalPage`: จำนวนหน้ารวมทั้งหมด (number).  ใช้สำหรับคำนวณจำนวนหน้าในระบบ pagination
    *   `pagination.perfumesPage`: หน้าปัจจุบันที่กำลังแสดง (number).  ใช้สำหรับควบคุม pagination

*   **Component State:**
    *   `formFilters`: ข้อมูล filter ที่ถูกกรอกในฟอร์ม (ประเภท `Filters | null`).  ข้อมูลนี้จะถูกใช้ในการส่งไปยัง Redux store เพื่อทำการกรองข้อมูล
    *   `searchQuery`: สถานะที่บ่งบอกว่ากำลังทำการค้นหาหรือไม่ (boolean).  ใช้สำหรับแสดง/ซ่อนบางส่วนของ UI
    *   `showFilters`: สถานะที่บ่งบอกว่า sidebar filter กำลังแสดงอยู่หรือไม่ (boolean).  ใช้สำหรับควบคุมการแสดงผลของ sidebar
    *   `searchFocused`: สถานะที่บ่งบอกว่า input field ค้นหา focus หรือไม่ (boolean).  ใช้สำหรับ animation
    *   `resultCount`: จำนวนผลลัพธ์ที่พบ (number). ใช้แสดงผลจำนวนน้ำหอมที่ค้นหาเจอ

## 3. ฟังก์ชันหลักในระบบ

ฟังก์ชันหลักในระบบคือ:

*   **แสดง UI สำหรับค้นหาและกรองน้ำหอม:** แสดง input field สำหรับค้นหา, ปุ่มสำหรับเปิด/ปิด sidebar filter, และรายการผลลัพธ์
*   **จัดการการเปลี่ยนแปลงข้อมูลใน input field:** อัปเดต state `formFilters` เมื่อผู้ใช้แก้ไขข้อมูลใน input field
*   **จัดการการเลือก filter:** อัปเดต state `formFilters` เมื่อผู้ใช้เลือก filter จาก sidebar
*   **ทำการค้นหา:** ส่งข้อมูล filter ไปยัง Redux store เพื่อทำการค้นหาและกรองข้อมูล
*   **แสดงผลลัพธ์:** แสดงรายการน้ำหอมที่ตรงกับเงื่อนไขการค้นหาและ filter
*   **จัดการ pagination:** แสดง pagination control และจัดการการเปลี่ยนหน้า
*   **แสดงผลข้อความเมื่อไม่พบผลลัพธ์:** แสดงข้อความเมื่อไม่พบน้ำหอมที่ตรงกับเงื่อนไข

## 4. อธิบายการทำงานของแต่ละฟังก์ชัน

1.  **เข้าถึงข้อมูลจาก Redux:** ใช้ `useSelector` hook เพื่อเข้าถึงข้อมูลต่างๆ จาก Redux store (เช่น `loading`, `perfumes`, `filters`, `pagination`)
2.  **จัดการ state:** ใช้ `useState` hook เพื่อจัดการ state ต่างๆ เช่น `formFilters`, `searchQuery`, `showFilters`, `searchFocused`, `resultCount`
3.  **จัดการการเปลี่ยนแปลงข้อมูลใน input field:**
    *   `handleChange`: ฟังก์ชันนี้จะถูกเรียกใช้เมื่อผู้ใช้แก้ไขข้อมูลใน input field ค้นหา
    *   ฟังก์ชันนี้จะอัปเดต state `formFilters` ด้วยข้อมูลที่ถูกแก้ไข
4.  **จัดการการเลือก filter:**
    *   `handleArrayFilter`: ฟังก์ชันนี้จะถูกเรียกใช้เมื่อผู้ใช้เลือก filter จาก sidebar (เช่น notes, accords)
    *   ฟังก์ชันนี้จะอัปเดต state `formFilters` โดยเพิ่ม/ลบ filter ที่ถูกเลือก
5.  **ทำการค้นหา:**
    *   `handleSearch`: ฟังก์ชันนี้จะถูกเรียกใช้เมื่อผู้ใช้กดปุ่ม "Search" หรือกด Enter ใน input field ค้นหา
    *   ฟังก์ชันนี้จะ dispatch action `setFiltersAndFetch` เพื่อส่งข้อมูล filter ไปยัง Redux store เพื่อทำการค้นหาและกรองข้อมูล
6.  **แสดงผลลัพธ์:**
    *   Component จะแสดงรายการน้ำหอมที่ตรงกับเงื่อนไขการค้นหาและ filter โดยใช้ component `PerfumeCard`
    *   ถ้าไม่พบผลลัพธ์ จะแสดงข้อความ "No perfumes found"
7.  **จัดการ pagination:**
    *   Component จะแสดง pagination control ที่ประกอบไปด้วยปุ่มสำหรับเปลี่ยนหน้า (Previous, Next, หมายเลขหน้า)
    *   เมื่อผู้ใช้คลิกที่ปุ่ม pagination, จะ dispatch action `setPerfumesPage` เพื่อเปลี่ยนหน้า
8.  **clearSearchInput:** ฟังก์ชันนี้จะถูกเรียกใช้เมื่อผู้ใช้กดปุ่ม clear ในช่องค้นหา จะทำการล้างข้อมูลในช่องค้นหา
9.  **clearFilters:** ฟังก์ชันนี้จะถูกเรียกใช้เมื่อผู้ใช้กดปุ่ม clear filter ทั้งหมด จะทำการล้าง filter ทั้งหมด

## 5. การจัดการสถานะ (State Management)

Component `Search` มีการจัดการ state ดังนี้:

*   **Redux State:** ใช้ `useSelector` hook เพื่อเข้าถึงข้อมูลจาก Redux store (เช่น `loading`, `perfumes`, `filters`, `pagination`). ข้อมูลเหล่านี้จะถูกใช้ในการแสดงผลรายการน้ำหอม, แสดง pagination control, และจัดการการค้นหาและกรองข้อมูล
*   **Local State:** ใช้ `useState` hook เพื่อจัดการ state ที่เกี่ยวข้องกับ UI ของหน้า เช่น `formFilters`, `searchQuery`, `showFilters`, `searchFocused`, `resultCount`

**การโหลดข้อมูล:** ข้อมูลน้ำหอม, ข้อมูล filter, และข้อมูล pagination ถูกโหลดจาก Redux store เมื่อ component mount และเมื่อมีการเปลี่ยนแปลงข้อมูล

**การอัปเดตข้อมูล:** เมื่อผู้ใช้ทำการค้นหา, เลือก filter, หรือเปลี่ยนหน้า ข้อมูลจะถูกอัปเดตใน Redux store ผ่าน dispatch actions

**การจัดการข้อผิดพลาด:** ถ้าเกิดข้อผิดพลาดในการโหลดข้อมูล จะแสดงข้อความ error

โดยรวมแล้ว, `app/perfumes/home/search/page.tsx` เป็น component ที่ซับซ้อน มีการจัดการ state ทั้งใน local state และ Redux state มีการใช้ hooks ต่างๆ เพื่อเข้าถึงและอัปเดต state และมีการจัดการ logic ที่เกี่ยวข้องกับการค้นหา, กรอง, และแสดงผลรายการน้ำหอม