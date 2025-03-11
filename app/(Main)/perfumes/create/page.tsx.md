# คู่มือการทำงานของ `app/perfumes/create/page.tsx`

## 1. บทนำ

ไฟล์ `app/perfumes/create/page.tsx` เป็น React component ที่ใช้แสดงฟอร์มสำหรับสร้าง (create) รายการน้ำหอม (perfume listing) ใหม่ในแอปพลิเคชัน Next.js Component นี้ใช้ Redux เพื่อเข้าถึงข้อมูลผู้ใช้ และใช้ฟังก์ชันต่างๆ เพื่อจัดการการสร้างรายการน้ำหอมใหม่

## 2. โครงสร้างข้อมูลหลัก (State Structure)

Component นี้มีการจัดการ state ดังนี้:

* **Redux State:**
  * `user.profile`: ข้อมูลโปรไฟล์ของผู้ใช้ที่ login (ประเภท `Profile | null`)
* **Component State:**
  * `loading`: สถานะ loading ของการ submit ฟอร์ม (boolean)
  * `activeTab`: tab ที่ active ใน Tabs component ("details", "images", "contact") (string)
  * `progress`: ค่า progress สำหรับ ProgressCircle component (number)
  * `formData`: ข้อมูลฟอร์มทั้งหมด (ประเภท `PerfumeForInsert`). มีโครงสร้างดังนี้:

        ```typescript
        interface PerfumeForInsert {
            name: string;
            brand: string;
            descriptions: string;
            price: number | null;
            volume: number | null;
            gender: string | null;
            concentration: string | null;
            scentType: string | null;
            perfumer: string;
            top_notes: string[];
            middle_notes: string[];
            base_notes: string[];
            images: string[];
            imagesFiles?: File[];
            imagePreviews?: string[];
            is_tradable: boolean;
            facebook: string;
            line: string;
            phone_number: string;
            user_id?: string | null;
            user?: {
                id: string;
                username: string;
                avatar: string | null;
            } | null;
            logo?: string | null;
        }
        ```

        *Note: `PerfumeInitialState` is used as the initial value for the `formData` state.*

## 3. ฟังก์ชันหลักในระบบ

ฟังก์ชันหลักในระบบคือ:

* **แสดงฟอร์มสร้างน้ำหอม:** แสดง Tabs component ที่มี tabs ต่างๆ สำหรับกรอกรายละเอียด, รูปภาพ, และข้อมูลติดต่อ
* **จัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม:** อัปเดต state `formData` เมื่อผู้ใช้แก้ไขข้อมูลใน input fields
* **Submit ฟอร์ม:** ส่งข้อมูลที่กรอกไปยัง Redux store เพื่อสร้างรายการน้ำหอมใหม่
* **คำนวณ Progress:** คำนวณ progress ของการกรอกข้อมูลในฟอร์ม

## 4. อธิบายการทำงานของแต่ละฟังก์ชัน

1. **เข้าถึงข้อมูลโปรไฟล์จาก Redux:** ใช้ `useSelector` hook เพื่อเข้าถึงข้อมูลโปรไฟล์ของผู้ใช้จาก Redux store (`user.profile`)
2. **จัดการ state:** ใช้ `useState` hook เพื่อจัดการ state ต่างๆ เช่น `loading`, `activeTab`, `progress`, `formData`
3. **จัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม:**
    * `handleChange`: ฟังก์ชันนี้จะถูกเรียกใช้เมื่อผู้ใช้แก้ไขข้อมูลใน input field
    * ฟังก์ชันนี้จะอัปเดต state `formData` ด้วยข้อมูลที่ถูกแก้ไข
4. **จัดการการ submit ฟอร์ม:**
    * `handleSubmit`: ฟังก์ชันนี้จะถูกเรียกใช้เมื่อผู้ใช้กดปุ่ม "Submit"
    * ฟังก์ชันนี้จะป้องกันการ refresh หน้า
    * ฟังก์ชันนี้จะตั้งค่า `loading` เป็น true
    * ฟังก์ชันนี้จะตรวจสอบว่ามีข้อมูลโปรไฟล์หรือไม่ ถ้าไม่มีจะ throw error
    * ฟังก์ชันนี้จะ dispatch action `addMyPerfume` เพื่อส่งข้อมูลที่กรอกไปยัง Redux store
    * ฟังก์ชันนี้จะ redirect ไปยังหน้า profile
    * ฟังก์ชันนี้จะตั้งค่า `loading` เป็น false เมื่อการ submit เสร็จสิ้น (ไม่ว่าจะสำเร็จหรือไม่)
5. **คำนวณ Progress:**
    * ใช้ `useEffect` hook เพื่อคำนวณ progress ของการกรอกข้อมูลในฟอร์ม
    * คำนวณจากจำนวน fields ที่ถูกกรอกข้อมูล (ทั้ง required fields และ bonus fields) และสถานะของ Notes และ Images
    * อัปเดต state `progress` ด้วยค่าที่คำนวณได้
6. **แสดง UI:** Component แสดง UI สำหรับสร้างรายการน้ำหอมใหม่ โดยใช้ component ต่างๆ จาก "@/components/ui/\*"` และ component ที่สร้างขึ้นเอง เช่น `ProgressCircle`,`TabContact`,`TabNotes`,`TabImage`
    * แสดง Tabs component ที่มี tabs ต่างๆ สำหรับกรอกรายละเอียด, รูปภาพ, และข้อมูลติดต่อ
    * แสดง ProgressCircle component เพื่อแสดง progress ของการกรอกข้อมูล

## 5. การจัดการสถานะ (State Management)

Component `Trade` มีการจัดการ state ดังนี้:

* **Redux State:** ใช้ `useSelector` hook เพื่อเข้าถึงข้อมูลโปรไฟล์ของผู้ใช้จาก Redux store
* **Local State:** ใช้ `useState` hook เพื่อจัดการ state ที่เกี่ยวข้องกับ UI ของ form เช่น `loading`, `activeTab`, `progress`, `formData`

**การโหลดข้อมูล:** ไม่มีการโหลดข้อมูลโดยตรงใน component นี้

**การอัปเดตข้อมูล:** เมื่อผู้ใช้กรอกข้อมูลใน input field ข้อมูลจะถูกอัปเดตใน local state (`formData`) เมื่อผู้ใช้กด submit ข้อมูลใน `formData` จะถูกส่งไปยัง Redux store ผ่าน action `addMyPerfume`

**การจัดการข้อผิดพลาด:** ถ้าไม่มีข้อมูลโปรไฟล์ จะแสดงข้อผิดพลาด

โดยรวมแล้ว, `app/perfumes/create/page.tsx` เป็น component ที่ใช้สร้างฟอร์มสำหรับสร้างรายการน้ำหอมใหม่ มีการจัดการ state ทั้งใน local state และ Redux state มีการใช้ hooks ต่างๆ เพื่อเข้าถึงและอัปเดต state และมีการจัดการ logic ที่เกี่ยวข้องกับการสร้างรายการน้ำหอม
