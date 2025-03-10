# คู่มือการทำงานของ `components/form/trade-form/brands-input.tsx`

## 1. บทนำ

ไฟล์ `components/form/trade-form/brands-input.tsx` เป็น React component ที่ใช้แสดง input สำหรับเลือกหรือเพิ่มแบรนด์น้ำหอม Component นี้ใช้ Redux เพื่อเข้าถึงข้อมูลแบรนด์ และจัดการ state ของ input field

## 2. โครงสร้างข้อมูลหลัก (State Structure)

Component นี้มีการจัดการ state ดังนี้:

* **Redux State:**
  * `perfumes.perfume_unique_data.brand`: ข้อมูลแบรนด์ทั้งหมดของน้ำหอม (ประเภท `{ name: string; logo: string | null }[]`)
* **Component State:**
  * `open`: สถานะของ Popover (ใช้สำหรับเลือกแบรนด์)
  * `brandValue`: ชื่อของแบรนด์ที่ถูกเลือก (string)
  * `isAddingNewBrand`: สถานะที่บ่งบอกว่ากำลังเพิ่มแบรนด์ใหม่หรือไม่ (boolean)
  * `newBrandName`: ชื่อของแบรนด์ใหม่ที่กำลังเพิ่ม (string)
  * `visibleBrandsCount`: จำนวนแบรนด์ที่แสดงในรายการ (ใช้สำหรับ pagination) (number)
* **Props State:**
  * `formData`: ข้อมูลฟอร์มทั้งหมด (ประเภท `PerfumeForInsert` หรือ `PerfumeForUpdate`)
  * `setFormData`: ฟังก์ชันสำหรับอัปเดตข้อมูลฟอร์ม (จาก parent component)

## 3. ฟังก์ชันหลักในระบบ

ฟังก์ชันหลักในระบบคือ:

* **แสดง UI สำหรับเลือกหรือเพิ่มแบรนด์:** แสดง input field ที่เป็น Popover สำหรับเลือกแบรนด์จากรายการ หรือเพิ่มแบรนด์ใหม่
* **กรองรายการแบรนด์:** กรองรายการแบรนด์ตามข้อความที่ผู้ใช้พิมพ์
* **จัดการการเลือกแบรนด์:** อัปเดต `brandValue` และ `formData` เมื่อผู้ใช้เลือกแบรนด์
* **จัดการการเพิ่มแบรนด์ใหม่:** สร้างแบรนด์ใหม่และอัปเดต `brandValue` และ `formData`
* **จัดการ Pagination:** แสดงแบรนด์เพิ่มเติมในรายการ (ถ้ามี)

## 4. อธิบายการทำงานของแต่ละฟังก์ชัน

1. **รับ props:** Component รับ props `formData` และ `setFormData` จาก parent component
2. **เข้าถึงข้อมูลแบรนด์จาก Redux:** ใช้ `useSelector` hook เพื่อเข้าถึงข้อมูลแบรนด์จาก Redux store
3. **จัดการ state:** ใช้ `useState` hook เพื่อจัดการ state ต่างๆ เช่น `open`, `brandValue`, `isAddingNewBrand`, `newBrandName`, `visibleBrandsCount`
4. **กรองรายการแบรนด์:** ใช้ `useMemo` hook เพื่อสร้าง `filteredBrands` โดยกรองรายการแบรนด์ตามข้อความที่ผู้ใช้พิมพ์
5. **จัดการการเลือกแบรนด์:**
    * `handleBrandChange`: ฟังก์ชันนี้จะถูกเรียกใช้เมื่อผู้ใช้เลือกแบรนด์จากรายการ
    * ฟังก์ชันนี้จะอัปเดต `brandValue` ด้วยชื่อแบรนด์ที่ถูกเลือก
    * ฟังก์ชันนี้จะอัปเดต `formData.brand` ด้วยชื่อแบรนด์ที่ถูกเลือก และ `formData.logo` ด้วย logo ของแบรนด์ที่ถูกเลือก (ถ้ามี)
6. **จัดการการเพิ่มแบรนด์ใหม่:**
    * `handleAddNewBrand`: ฟังก์ชันนี้จะถูกเรียกใช้เมื่อผู้ใช้กดปุ่ม "Add" เพื่อเพิ่มแบรนด์ใหม่
    * ฟังก์ชันนี้จะตรวจสอบว่า `newBrandName` ไม่เป็นค่าว่าง
    * ฟังก์ชันนี้จะอัปเดต `brandValue` ด้วยชื่อแบรนด์ใหม่
    * ฟังก์ชันนี้จะอัปเดต `formData.brand` ด้วยชื่อแบรนด์ใหม่ และ `formData.logo` เป็น null
    * ฟังก์ชันนี้จะ reset `isAddingNewBrand` และ `newBrandName`
7. **จัดการ Pagination:**
    * `handleShowMoreBrands`: ฟังก์ชันนี้จะถูกเรียกใช้เมื่อผู้ใช้กดปุ่ม "Show more brands"
    * ฟังก์ชันนี้จะเพิ่มค่า `visibleBrandsCount` ขึ้น 10 (หรือไม่เกินจำนวนแบรนด์ทั้งหมด)
8. **แสดง UI:** Component แสดง UI สำหรับเลือกหรือเพิ่มแบรนด์ โดยใช้ component ต่างๆ จาก "@/components/ui/\*"` เช่น `Popover`,`Button`,`Command`,`Input`,`ScrollArea`,`Badge`

## 5. การจัดการสถานะ (State Management)

Component `BrandsInput` มีการจัดการ state ดังนี้:

* **Local State:** ใช้ `useState` hook เพื่อจัดการ state ที่เกี่ยวข้องกับ UI ของ input เช่น `open`, `brandValue`, `isAddingNewBrand`, `newBrandName`, `visibleBrandsCount`
* **Props State:** รับ `formData` และ `setFormData` เป็น props จาก parent component เพื่อจัดการ state ของฟอร์ม
* **Redux State:** ใช้ `useSelector` hook เพื่อเข้าถึงข้อมูลแบรนด์จาก Redux store

**การโหลดข้อมูล:** ข้อมูลแบรนด์ถูกโหลดเมื่อแอปพลิเคชันเริ่มต้น และถูกเก็บไว้ใน Redux store Component `BrandsInput` เข้าถึงข้อมูลเหล่านี้ผ่าน `useSelector` hook

**การอัปเดตข้อมูล:** เมื่อผู้ใช้เลือกแบรนด์หรือเพิ่มแบรนด์ใหม่ ข้อมูลจะถูกอัปเดตใน `formData` ผ่านฟังก์ชัน `setFormData` ฟังก์ชันนี้ถูกส่งมาจาก parent component ดังนั้นการเปลี่ยนแปลงใน `formData` จะ trigger re-render ของ component ที่ใช้ `formData`

**การจัดการข้อผิดพลาด:** ไม่มีการจัดการข้อผิดพลาดโดยตรงใน component นี้ แต่การดึงข้อมูลจาก Redux store อาจเกิดข้อผิดพลาดได้ ซึ่งจะถูกจัดการใน Redux reducer

โดยรวมแล้ว, `components/form/trade-form/brands-input.tsx` เป็น component ที่ใช้แสดง input สำหรับเลือกหรือเพิ่มแบรนด์น้ำหอม มีการจัดการ state ทั้งใน local state และ Redux state
