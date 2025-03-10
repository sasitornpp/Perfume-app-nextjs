# คู่มือการทำงานของ `components/sidebar/search-sidebar.tsx`

## 1. บทนำ

ไฟล์ `components/sidebar/search-sidebar.tsx` เป็น component ที่สร้าง sidebar สำหรับการค้นหาและกรองน้ำหอมในแอปพลิเคชัน Next.js Component นี้ใช้ Redux เพื่อเข้าถึงข้อมูลน้ำหอม (brands, accords, notes) และจัดการ state ของ filters ต่างๆ

## 2. โครงสร้างข้อมูลหลัก (State Structure)

โครงสร้างข้อมูลหลักที่ใช้ใน component นี้ประกอบด้วย:

- **Redux State:**
  - `filters.Filters`: ข้อมูล filters ที่ถูกเลือก (ประเภท `Filters`). มีโครงสร้างดังนี้

        ```typescript
        interface Filters {
            search_query: string | null;
            brand_filter: string[];
            gender_filter: string | null;
            accords_filter: string[];
            top_notes_filter: string[];
            middle_notes_filter: string[];
            base_notes_filter: string[];
            is_tradable_filter: boolean;
        }
        ```

  - `perfumes.perfume_unique_data.brand`: ข้อมูลแบรนด์ทั้งหมดของน้ำหอม
  - `perfumes.perfume_unique_data.top_notes`: ข้อมูล top notes ทั้งหมดของน้ำหอม
  - `perfumes.perfume_unique_data.middle_notes`: ข้อมูล middle notes ทั้งหมดของน้ำหอม
  - `perfumes.perfume_unique_data.base_notes`: ข้อมูล base notes ทั้งหมดของน้ำหอม
  - `perfumes.perfume_unique_data.accords`: ข้อมูล accords ทั้งหมดของน้ำหอม
- **Component State:**
  - `open`: สถานะของ Popover (ใช้สำหรับเลือกแบรนด์)
  - `isAddingNewBrand`: สถานะที่บ่งบอกว่ากำลังเพิ่มแบรนด์ใหม่หรือไม่
  - `newBrandName`: ชื่อของแบรนด์ใหม่ที่กำลังเพิ่ม
  - `brandsValue`: array ของแบรนด์ที่ผู้ใช้เลือก
  - `visibleBrandsCount`: จำนวนแบรนด์ที่แสดงในรายการ (ใช้สำหรับ pagination)

## 3. ฟังก์ชันหลักในระบบ

ฟังก์ชันหลักในระบบแบ่งออกเป็นหมวดหมู่ต่างๆ ดังนี้:

- **การจัดการ State ของ Sidebar:**
  - `setShowFilters`: เปลี่ยนสถานะการแสดงผลของ sidebar (props จาก parent component)
  - `setFormFilters`: อัปเดตข้อมูล filters (props จาก parent component)
  - `setOpen`: เปลี่ยนสถานะของ Popover
  - `setIsAddingNewBrand`: เปลี่ยนสถานะการเพิ่มแบรนด์ใหม่
  - `setNewBrandName`: อัปเดตชื่อของแบรนด์ใหม่
  - `setBrandsValue`: อัปเดตแบรนด์ที่เลือก
  - `setVisibleBrandsCount`: อัปเดตจำนวนแบรนด์ที่แสดง
- **การจัดการข้อมูลที่ผู้ใช้เลือก:**
  - `handleChange`: เปลี่ยนค่าของ filter ทั่วไป (gender, tradable)
  - `handleArrayFilter`: เพิ่มค่าใน array filter (accords, notes)
  - `handleBrandChange`: เลือก/ยกเลิกการเลือกแบรนด์
  - `handleShowMoreBrands`: แสดงแบรนด์เพิ่มเติมในรายการ
  - `handleArrayChange`: เปลี่ยนค่าใน array filter (accords, notes)
  - `addArrayItem`: เพิ่ม item ใน array filter (accords, notes)
  - `removeArrayItem`: ลบ item ใน array filter (accords, notes)
- **การจัดการแบรนด์ใหม่:**
  - `handleAddNewBrand`: เพิ่มแบรนด์ใหม่
- **การล้าง Filters:**
  - `clearFilters`: ล้าง filters ทั้งหมด

## 4. อธิบายการทำงานของแต่ละฟังก์ชัน

### 4.1 การจัดการ State ของ Sidebar

- `setShowFilters`: ฟังก์ชันนี้ถูกส่งมาจาก parent component เพื่อควบคุมการแสดงผลของ sidebar
- `setFormFilters`: ฟังก์ชันนี้ถูกส่งมาจาก parent component เพื่ออัปเดตข้อมูล filters
- `setOpen`: ฟังก์ชันนี้ใช้เพื่อเปิด/ปิด Popover ที่ใช้ในการเลือกแบรนด์
- `setIsAddingNewBrand`: ฟังก์ชันนี้ใช้เพื่อเปลี่ยนสถานะว่ากำลังเพิ่มแบรนด์ใหม่หรือไม่
- `setNewBrandName`: ฟังก์ชันนี้ใช้เพื่ออัปเดตชื่อของแบรนด์ใหม่ที่กำลังเพิ่ม
- `setBrandsValue`: ฟังก์ชันนี้ใช้เพื่ออัปเดต array ของแบรนด์ที่ผู้ใช้เลือก
- `setVisibleBrandsCount`: ฟังก์ชันนี้ใช้เพื่ออัปเดตจำนวนแบรนด์ที่แสดงในรายการ (ใช้สำหรับ pagination)

### 4.2 การจัดการข้อมูลที่ผู้ใช้เลือก

- `handleChange`: ฟังก์ชันนี้ใช้เพื่อเปลี่ยนค่าของ filter ทั่วไป (gender, tradable) โดยรับค่าเป็น `key` (ชื่อ filter) และ `value` (ค่าที่ต้องการเปลี่ยน) และอัปเดต `formFilters`
- `handleArrayFilter`: ฟังก์ชันนี้ใช้เพื่อเพิ่มค่าใน array filter (accords, notes) โดยรับค่าเป็น `key` (ชื่อ filter) และ `value` (ค่าที่ต้องการเพิ่ม) และอัปเดต `formFilters`
- `handleBrandChange`: ฟังก์ชันนี้ใช้เพื่อเลือก/ยกเลิกการเลือกแบรนด์ โดยรับค่าเป็น `brandName` (ชื่อแบรนด์) และอัปเดต `formFilters.brand_filter` และ `brandsValue`
- `handleShowMoreBrands`: ฟังก์ชันนี้ใช้เพื่อแสดงแบรนด์เพิ่มเติมในรายการ โดยเพิ่มค่า `visibleBrandsCount` ขึ้น 10 (หรือไม่เกินจำนวนแบรนด์ทั้งหมด)
- `handleArrayChange`: ฟังก์ชันนี้ใช้เพื่อเปลี่ยนค่าใน array filter (accords, notes) โดยรับค่าเป็น `type` (ชื่อ filter), `index` (index ของ item ที่ต้องการเปลี่ยน) และ `value` (ค่าที่ต้องการเปลี่ยน) และอัปเดต `formFilters[type][index]`
- `addArrayItem`: ฟังก์ชันนี้ใช้เพื่อเพิ่ม item ใน array filter (accords, notes) โดยรับค่าเป็น `type` (ชื่อ filter) และเพิ่ม item ว่าง ("") ใน `formFilters[type]`
- `removeArrayItem`: ฟังก์ชันนี้ใช้เพื่อลบ item ใน array filter (accords, notes) โดยรับค่าเป็น `type` (ชื่อ filter) และ `index` (index ของ item ที่ต้องการลบ) และลบ item ที่ index นั้นออกจาก `formFilters[type]`

### 4.3 การจัดการแบรนด์ใหม่

- `handleAddNewBrand`: ฟังก์ชันนี้ใช้เพื่อเพิ่มแบรนด์ใหม่ (ยังไม่มี implementation ใน code ที่ให้มา)

### 4.4 การล้าง Filters

- `clearFilters`: ฟังก์ชันนี้ใช้เพื่อล้าง filters ทั้งหมด โดยตั้งค่า `formFilters` เป็น null, `newBrandName` เป็น null, `brandsValue` เป็น array ว่าง และ `isAddingNewBrand` เป็น false

## 5. การจัดการสถานะ (State Management)

Component `SearchSidebar` มีการจัดการ state ดังนี้:

- **Local State:** ใช้ `useState` hook เพื่อจัดการ state ที่เกี่ยวข้องกับ UI ของ sidebar เช่น `open`, `isAddingNewBrand`, `newBrandName`, `brandsValue`, `visibleBrandsCount`
- **Props State:** รับ `formFilters` และ `setFormFilters` เป็น props จาก parent component เพื่อจัดการ state ของ filters
- **Redux State:** ใช้ `useSelector` hook เพื่อเข้าถึงข้อมูลน้ำหอม (brands, accords, notes) จาก Redux store

**การโหลดข้อมูล:** ข้อมูลน้ำหอม (brands, accords, notes) ถูกโหลดเมื่อแอปพลิเคชันเริ่มต้น และถูกเก็บไว้ใน Redux store Component `SearchSidebar` เข้าถึงข้อมูลเหล่านี้ผ่าน `useSelector` hook

**การอัปเดตข้อมูล:** เมื่อผู้ใช้เลือก filters ต่างๆ ข้อมูลจะถูกอัปเดตใน `formFilters` ผ่านฟังก์ชัน `setFormFilters` ฟังก์ชันนี้ถูกส่งมาจาก parent component ดังนั้นการเปลี่ยนแปลงใน `formFilters` จะ trigger re-render ของ component ที่ใช้ `formFilters`

**การจัดการข้อผิดพลาด:** ไม่มีการจัดการข้อผิดพลาดโดยตรงใน component นี้ แต่การดึงข้อมูลจาก Redux store อาจเกิดข้อผิดพลาดได้ ซึ่งจะถูกจัดการใน Redux reducer

โดยรวมแล้ว, `components/sidebar/search-sidebar.tsx` เป็น component ที่ซับซ้อน มีการจัดการ state ทั้งใน local state, props state และ Redux state มีการใช้ utility functions เพื่อจัดการข้อมูล และมีการใช้ hooks ต่างๆ เพื่อเข้าถึงและอัปเดต state
