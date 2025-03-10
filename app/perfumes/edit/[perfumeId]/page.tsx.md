# คู่มือการทำงานของ `app/perfumes/edit/[perfumeId]/page.tsx`

## 1. บทนำ

ไฟล์ `app/perfumes/edit/[perfumeId]/page.tsx` เป็น React component ที่ใช้แสดงฟอร์มสำหรับแก้ไข (edit) ข้อมูลน้ำหอม (perfume) แต่ละรายการในแอปพลิเคชัน Next.js โดย `[perfumeId]` เป็น dynamic route segment ที่ระบุ ID ของน้ำหอม Component นี้ใช้ Redux เพื่อเข้าถึงข้อมูลผู้ใช้ และใช้ฟังก์ชันต่างๆ เพื่อจัดการการแก้ไขข้อมูลน้ำหอม

**หมายเหตุ:** คู่มือนี้ปรับแต่งสำหรับผู้ใช้ `Shinon2023`

## 2. โครงสร้างข้อมูลหลัก (State Structure)

Component นี้มีการจัดการ state ดังนี้:

*   **Redux State:**
    *   `user.profile`: ข้อมูลโปรไฟล์ของผู้ใช้ที่ login (ประเภท `Profile | null`).  ในบริบทของผู้ใช้ `Shinon2023`, ข้อมูลนี้จะประกอบไปด้วยข้อมูลส่วนตัวที่เกี่ยวข้องกับบัญชีของคุณ.
*   **Component State:**
    *   `loading`: สถานะ loading ของการ submit ฟอร์ม (boolean)
    *   `activeTab`: tab ที่ active ใน Tabs component ("details", "notes", "images", "contact") (string)
    *   `progress`: ค่า progress สำหรับ ProgressCircle component (number)
    *   `perfume`: ข้อมูลน้ำหอมที่กำลังแก้ไข (ประเภท `PerfumeForUpdate | null`). ข้อมูลนี้จะถูกดึงมาจากฐานข้อมูลและใช้เป็นค่าเริ่มต้นในฟอร์มแก้ไข

## 3. ฟังก์ชันหลักในระบบ

ฟังก์ชันหลักในระบบคือ:

*   **ดึงข้อมูลน้ำหอม:** ดึงข้อมูลน้ำหอมจาก Supabase โดยใช้ `perfumeId`
*   **ตรวจสอบสิทธิ์:** ตรวจสอบว่าผู้ใช้ที่ login (ในที่นี้คือ `Shinon2023`) เป็นเจ้าของน้ำหอมหรือไม่
*   **แสดงฟอร์มแก้ไขน้ำหอม:** แสดง Tabs component ที่มี tabs ต่างๆ สำหรับแก้ไขรายละเอียด, notes, รูปภาพ, และข้อมูลติดต่อ
*   **จัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม:** อัปเดต state `perfume` เมื่อผู้ใช้แก้ไขข้อมูลใน input fields
*   **Submit ฟอร์ม:** ส่งข้อมูลที่แก้ไขไปยัง Redux store เพื่ออัปเดตข้อมูลน้ำหอม
*   **คำนวณ Progress:** คำนวณ progress ของการกรอกข้อมูลในฟอร์ม

## 4. อธิบายการทำงานของแต่ละฟังก์ชัน

1.  **รับ params:** Component รับ `params` จาก Next.js route (มี `perfumeId` เป็น property).  `perfumeId` นี้จะถูกใช้เพื่อดึงข้อมูลน้ำหอมที่คุณต้องการแก้ไข
2.  **ดึงข้อมูลน้ำหอม:**
    *   ใช้ `useEffect` hook เพื่อดึงข้อมูลน้ำหอมจาก Supabase โดยใช้ `perfumeId`
    *   ถ้าดึงข้อมูลสำเร็จ จะอัปเดต state `perfume` ด้วยข้อมูลที่ได้
    *   ถ้าดึงข้อมูลไม่สำเร็จ จะตั้งค่า `perfume` เป็น null
3.  **ตรวจสอบสิทธิ์:** ตรวจสอบว่าผู้ใช้ที่ login (ในที่นี้คือ `Shinon2023`) เป็นเจ้าของน้ำหอมหรือไม่ (โดยเปรียบเทียบ `perfume.user_id` กับ `profile.id`).  หากคุณไม่ใช่เจ้าของ จะไม่สามารถแก้ไขได้
4.  **จัดการ state:** ใช้ `useState` hook เพื่อจัดการ state ต่างๆ เช่น `loading`, `activeTab`, `progress`, `perfume`
5.  **จัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม:**
    *   `handleChange`: ฟังก์ชันนี้จะถูกเรียกใช้เมื่อคุณแก้ไขข้อมูลใน input field
    *   ฟังก์ชันนี้จะอัปเดต state `perfume` ด้วยข้อมูลที่ถูกแก้ไข
6.  **จัดการการ submit ฟอร์ม:**
    *   `handleSubmit`: ฟังก์ชันนี้จะถูกเรียกใช้เมื่อคุณกดปุ่ม "Submit"
    *   ฟังก์ชันนี้จะป้องกันการ refresh หน้า
    *   ฟังก์ชันนี้จะตั้งค่า `loading` เป็น true
    *   ฟังก์ชันนี้จะ dispatch action `editPerfume` เพื่อส่งข้อมูลที่แก้ไขไปยัง Redux store
    *   ฟังก์ชันนี้จะ redirect ไปยังหน้า profile
    *   ฟังก์ชันนี้จะตั้งค่า `loading` เป็น false เมื่อการ submit เสร็จสิ้น (ไม่ว่าจะสำเร็จหรือไม่)
7.  **คำนวณ Progress:**
    *   ใช้ `useEffect` hook เพื่อคำนวณ progress ของการกรอกข้อมูลในฟอร์ม
    *   คำนวณจากจำนวน fields ที่ถูกกรอกข้อมูล (ทั้ง required fields และ bonus fields) และจำนวน notes ที่ถูกเพิ่ม
    *   อัปเดต state `progress` ด้วยค่าที่คำนวณได้
8.  **แสดง UI:** Component แสดง UI สำหรับแก้ไขน้ำหอม โดยใช้ component ต่างๆ จาก "@/components/ui/\*"` และ component ที่สร้างขึ้นเอง เช่น `ProgressCircle`, `TabContact`, `TabNotes`, `TabImage`
    *   แสดง Tabs component ที่มี tabs ต่างๆ สำหรับแก้ไขรายละเอียด, notes, รูปภาพ, และข้อมูลติดต่อ
    *   แสดง ProgressCircle component เพื่อแสดง progress ของการกรอกข้อมูล

## 5. การจัดการสถานะ (State Management)

Component `Trade` มีการจัดการ state ดังนี้:

*   **Redux State:** ใช้ `useSelector` hook เพื่อเข้าถึงข้อมูลโปรไฟล์ของผู้ใช้จาก Redux store. ในฐานะผู้ใช้ `Shinon2023`, ข้อมูลโปรไฟล์ของคุณจะถูกใช้เพื่อตรวจสอบสิทธิ์ในการแก้ไขน้ำหอม
*   **Local State:** ใช้ `useState` hook เพื่อจัดการ state ที่เกี่ยวข้องกับ UI ของ form เช่น `loading`, `activeTab`, `progress`, `perfume`

**การโหลดข้อมูล:** ข้อมูลน้ำหอมถูกโหลดจาก Supabase เมื่อ component mount และเมื่อ `perfumeId` เปลี่ยนแปลง

**การอัปเดตข้อมูล:** เมื่อคุณแก้ไขข้อมูลใน input field ข้อมูลจะถูกอัปเดตใน local state (`perfume`). เมื่อคุณกด submit ข้อมูลใน `perfume` จะถูกส่งไปยัง Redux store ผ่าน action `editPerfume`

**การจัดการข้อผิดพลาด:** ถ้าไม่พบน้ำหอม หรือคุณ (ในฐานะ `Shinon2023`) ไม่มีสิทธิ์ในการแก้ไข จะแสดงข้อความ "Perfume not found"

โดยรวมแล้ว, `app/perfumes/edit/[perfumeId]/page.tsx` เป็น component ที่ใช้สร้างฟอร์มสำหรับแก้ไขข้อมูลน้ำหอม มีการจัดการ state ทั้งใน local state และ Redux state มีการใช้ hooks ต่างๆ เพื่อเข้าถึงและอัปเดต state และมีการจัดการ logic ที่เกี่ยวข้องกับการแก้ไขข้อมูลน้ำหอม โดยคำนึงถึงสิทธิ์ของผู้ใช้ `Shinon2023`