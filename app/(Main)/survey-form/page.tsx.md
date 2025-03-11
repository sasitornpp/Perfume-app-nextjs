# คู่มือการทำงานของ `app/survey-form/page.tsx`

## 1. บทนำ

ไฟล์ `app/survey-form/page.tsx` เป็น React component ที่ใช้สร้างฟอร์มสำหรับสร้างหรือแก้ไขโปรไฟล์ผู้ใช้ (user profile) ในแอปพลิเคชัน Next.js ฟอร์มนี้จะประกอบไปด้วย fields สำหรับ username, bio, gender, และ avatar

**หมายเหตุ:** คู่มือนี้ปรับแต่งสำหรับผู้ใช้ `Shinon2023`

## 2. โครงสร้างข้อมูลหลัก (State Structure)

Component นี้มีการจัดการ state ดังนี้:

* **Redux State:**
  * `user.user`: ข้อมูลของผู้ใช้ที่ login (ประเภท `User | null`). ในฐานะ `Shinon2023`, ข้อมูลนี้จะประกอบไปด้วย ID ผู้ใช้ซึ่งจะถูกใช้ในการสร้างโปรไฟล์
* **Component State:**
  * `formData`: ข้อมูลฟอร์ม (ประเภท `object`). มี fields ดังนี้:
    * `username`: ชื่อผู้ใช้ (string)
    * `bio`: ข้อมูลส่วนตัว (string)
    * `gender`: เพศ (string)
    * `image`: ไฟล์รูปภาพ (File | null)
    * `userId`: ID ผู้ใช้ (string)
  * `completionPercentage`: เปอร์เซ็นต์ความสมบูรณ์ของฟอร์ม (number)
  * `activeField`: field ที่กำลัง focus (string | null). ใช้สำหรับ animation
  * `isSubmitting`: สถานะที่บ่งบอกว่ากำลัง submit ฟอร์มหรือไม่ (boolean)
  * `success`: สถานะที่บ่งบอกว่า submit ฟอร์มสำเร็จหรือไม่ (boolean)
  * `imagePreview`: URL สำหรับแสดงตัวอย่างรูปภาพ (string | null)

## 3. ฟังก์ชันหลักในระบบ

ฟังก์ชันหลักในระบบคือ:

* **แสดงฟอร์มสร้าง/แก้ไขโปรไฟล์:** แสดง input fields สำหรับ username, bio, gender, และ avatar
* **จัดการการเปลี่ยนแปลงข้อมูลใน input fields:** อัปเดต state `formData` เมื่อผู้ใช้แก้ไขข้อมูลใน input fields
* **จัดการการเลือกรูปภาพ:** แสดงตัวอย่างรูปภาพที่ถูกเลือก
* **Submit ฟอร์ม:** ส่งข้อมูลฟอร์มไปยัง Redux store เพื่อสร้างหรือแก้ไขโปรไฟล์
* **คำนวณ Progress:** คำนวณ progress ของการกรอกข้อมูลในฟอร์ม

## 4. อธิบายการทำงานของแต่ละฟังก์ชัน

1. **เข้าถึงข้อมูลผู้ใช้จาก Redux:** ใช้ `useSelector` hook เพื่อเข้าถึงข้อมูลผู้ใช้จาก Redux store (`user.user`)
2. **จัดการ state:** ใช้ `useState` hook เพื่อจัดการ state ต่างๆ เช่น `formData`, `completionPercentage`, `activeField`, `isSubmitting`, `success`, `imagePreview`
3. **กำหนด userId:**
    * ใช้ `useEffect` hook เพื่อกำหนด `userId` ใน `formData` เมื่อ component mount และเมื่อ `user` เปลี่ยนแปลง
4. **คำนวณ Progress:**
    * ใช้ `useEffect` hook เพื่อคำนวณ progress ของการกรอกข้อมูลในฟอร์ม
    * คำนวณจากจำนวน fields ที่ถูกกรอกข้อมูล
    * อัปเดต state `completionPercentage` ด้วยค่าที่คำนวณได้
5. **จัดการการเปลี่ยนแปลงข้อมูลใน input fields:**
    * `handleChange`: ฟังก์ชันนี้จะถูกเรียกใช้เมื่อผู้ใช้แก้ไขข้อมูลใน input fields
    * ฟังก์ชันนี้จะอัปเดต state `formData` ด้วยข้อมูลที่ถูกแก้ไข
6. **จัดการการ focus:**
    * `handleFocus`: ฟังก์ชันนี้จะถูกเรียกใช้เมื่อ input field ถูก focus
    * ฟังก์ชันนี้จะอัปเดต state `activeField`
7. **จัดการการ blur:**
    * `handleBlur`: ฟังก์ชันนี้จะถูกเรียกใช้เมื่อ input field ถูก blur
    * ฟังก์ชันนี้จะตั้งค่า `activeField` เป็น null
8. **จัดการการเลือกรูปภาพ:**
    * `handleImageChange`: ฟังก์ชันนี้จะถูกเรียกใช้เมื่อผู้ใช้เลือกรูปภาพ
    * ฟังก์ชันนี้จะอัปเดต state `formData` ด้วยไฟล์รูปภาพ
    * ฟังก์ชันนี้จะสร้าง URL สำหรับแสดงตัวอย่างรูปภาพ
9. **จัดการการคลิกที่รูปภาพ:**
    * `handleImageClick`: ฟังก์ชันนี้จะถูกเรียกใช้เมื่อผู้ใช้คลิกที่รูปภาพ
    * ฟังก์ชันนี้จะเปิด file input dialog
10. **จัดการการลบรูปภาพ:**
    * `handleRemoveImage`: ฟังก์ชันนี้จะถูกเรียกใช้เมื่อผู้ใช้คลิกที่ปุ่มลบรูปภาพ
    * ฟังก์ชันนี้จะลบรูปภาพออกจาก state และ clear file input
11. **จัดการการ submit ฟอร์ม:**
    * `handleSubmit`: ฟังก์ชันนี้จะถูกเรียกใช้เมื่อผู้ใช้กดปุ่ม "Save Profile"
    * ฟังก์ชันนี้จะป้องกันการ refresh หน้า
    * ฟังก์ชันนี้จะตั้งค่า `isSubmitting` เป็น true
    * ฟังก์ชันนี้จะ dispatch action `createProfile` เพื่อส่งข้อมูลฟอร์มไปยัง Redux store
    * ถ้า submit สำเร็จ จะตั้งค่า `success` เป็น true และ reload หน้าหลังจาก 1.5 วินาที
    * ถ้า submit ไม่สำเร็จ จะแสดงข้อผิดพลาดและตั้งค่า `isSubmitting` เป็น false
12. **แสดง UI:** Component แสดง UI สำหรับสร้าง/แก้ไขโปรไฟล์ โดยใช้ component ต่างๆ จาก "@/components/ui/\*"`
    * แสดง input fields สำหรับ username, bio, gender, และ avatar
    * แสดง progress bar สำหรับแสดงความสมบูรณ์ของฟอร์ม
    * แสดงปุ่ม "Save Profile" สำหรับ submit ฟอร์ม

## 5. การจัดการสถานะ (State Management)

Component `UserProfileForm` มีการจัดการ state ดังนี้:

* **Redux State:** ใช้ `useSelector` hook เพื่อเข้าถึงข้อมูลผู้ใช้จาก Redux store. ในฐานะผู้ใช้ `Shinon2023`, ข้อมูลผู้ใช้ของคุณจะถูกใช้ในการกำหนด userId ในการสร้างโปรไฟล์
* **Local State:** ใช้ `useState` hook เพื่อจัดการ state ที่เกี่ยวข้องกับ UI ของ form เช่น `formData`, `completionPercentage`, `activeField`, `isSubmitting`, `success`, `imagePreview`

**การโหลดข้อมูล:** ข้อมูลผู้ใช้ถูกโหลดเมื่อแอปพลิเคชันเริ่มต้น และถูกเก็บไว้ใน Redux store Component `UserProfileForm` เข้าถึงข้อมูลนี้ผ่าน `useSelector` hook

**การอัปเดตข้อมูล:** เมื่อผู้ใช้แก้ไขข้อมูลใน input field หรือเลือกรูปภาพ ข้อมูลจะถูกอัปเดตใน local state (`formData`) เมื่อผู้ใช้กด submit ข้อมูลใน `formData` จะถูกส่งไปยัง Redux store ผ่าน action `createProfile`

**การจัดการข้อผิดพลาด:** ถ้าเกิดข้อผิดพลาดในการ submit ฟอร์ม จะแสดงข้อผิดพลาด

โดยรวมแล้ว, `app/survey-form/page.tsx` เป็น component ที่ซับซ้อน มีการจัดการ state ทั้งใน local state และ Redux state มีการใช้ hooks ต่างๆ เพื่อเข้าถึงและอัปเดต state และมีการจัดการ logic ที่เกี่ยวข้องกับการสร้างหรือแก้ไขโปรไฟล์
