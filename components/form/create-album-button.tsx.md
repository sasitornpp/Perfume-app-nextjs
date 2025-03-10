# คู่มือการทำงานของ `components/form/create-album-button.tsx`

## 1. บทนำ

ไฟล์ `components/form/create-album-button.tsx` เป็น React component ที่สร้าง button สำหรับเปิด dialog เพื่อสร้าง album ใหม่ Component นี้ใช้ `react-hook-form` และ `zod` สำหรับจัดการ form และ validation และใช้ Redux เพื่อ dispatch action สำหรับสร้าง album ใหม่

## 2. โครงสร้างข้อมูลหลัก (State Structure)

Component นี้มีการจัดการ state ดังนี้:

*   **Component State:**
    *   `imagePreview`: URL ของรูปภาพที่ถูกเลือก (ใช้สำหรับ preview) (string | null)
    *   `imageFile`: File object ของรูปภาพที่ถูกเลือก (File | null)
    *   `isDialogOpen`: สถานะที่บ่งบอกว่า dialog เปิดอยู่หรือไม่ (boolean)
*   **Redux State:** ไม่มีการใช้ Redux state โดยตรงใน component นี้

## 3. ฟังก์ชันหลักในระบบ

ฟังก์ชันหลักในระบบคือ:

*   **แสดง button สำหรับเปิด dialog:** แสดง button ที่เมื่อคลิกแล้วจะเปิด dialog สำหรับสร้าง album ใหม่
*   **แสดง form สำหรับกรอกข้อมูล album:** แสดง input fields สำหรับ title, description, isPrivate, และ image
*   **จัดการการ upload รูปภาพ:** แสดง preview ของรูปภาพที่ถูกเลือก และเก็บ File object ไว้ใน state
*   **Validate ข้อมูล form:** ใช้ `zod` ในการ validate ข้อมูล form
*   **สร้าง album ใหม่:** Dispatch action `addNewAlbum` เพื่อสร้าง album ใหม่ใน Redux store

## 4. อธิบายการทำงานของแต่ละฟังก์ชัน

1.  **กำหนด form schema:** ใช้ `zod` ในการกำหนด schema สำหรับ validate ข้อมูล form
2.  **สร้าง form:** ใช้ `useForm` hook จาก `react-hook-form` เพื่อสร้าง form object และจัดการ state ของ form
3.  **จัดการ state:** ใช้ `useState` hook เพื่อจัดการ state ต่างๆ เช่น `imagePreview`, `imageFile`, `isDialogOpen`
4.  **จัดการการ upload รูปภาพ:**
    *   `handleImageChange`: ฟังก์ชันนี้จะถูกเรียกใช้เมื่อผู้ใช้เลือกรูปภาพ
    *   ฟังก์ชันนี้จะอ่าน File object ของรูปภาพ และสร้าง preview URL
    *   ฟังก์ชันนี้จะอัปเดต `imagePreview` ด้วย preview URL และ `imageFile` ด้วย File object
5.  **จัดการการ submit form:**
    *   `onSubmit`: ฟังก์ชันนี้จะถูกเรียกใช้เมื่อผู้ใช้กดปุ่ม "Create Album"
    *   ฟังก์ชันนี้จะเตรียมข้อมูลสำหรับส่งไปยัง Redux store
    *   ฟังก์ชันนี้จะ dispatch action `addNewAlbum` เพื่อสร้าง album ใหม่
    *   ฟังก์ชันนี้จะ reset form และ state ต่างๆ
6.  **แสดง UI:** Component แสดง UI สำหรับสร้าง album ใหม่ โดยใช้ component ต่างๆ จาก "@/components/ui/\*"` เช่น `Dialog`, `Form`, `Input`, `Textarea`, `Switch`, `Button`

## 5. การจัดการสถานะ (State Management)

Component `CreateAlbumButton` มีการจัดการ state ดังนี้:

*   **Local State:** ใช้ `useState` hook เพื่อจัดการ state ที่เกี่ยวข้องกับ UI ของ form เช่น `imagePreview`, `imageFile`, `isDialogOpen`
*   **Redux Dispatch:** ใช้ `useDispatch` hook เพื่อ dispatch action `addNewAlbum` ไปยัง Redux store

**การโหลดข้อมูล:** ไม่มีการโหลดข้อมูลโดยตรงใน component นี้

**การอัปเดตข้อมูล:** เมื่อผู้ใช้กรอกข้อมูลใน form ข้อมูลจะถูกอัปเดตใน form state ผ่าน `react-hook-form` เมื่อผู้ใช้กด submit ข้อมูลใน form state และ `imageFile` จะถูกส่งไปยัง Redux store ผ่าน action `addNewAlbum`

**การจัดการข้อผิดพลาด:** `react-hook-form` และ `zod` จะจัดการ validation ของ form และแสดงข้อผิดพลาด (ถ้ามี)

โดยรวมแล้ว, `components/form/create-album-button.tsx` เป็น component ที่ใช้สร้าง button สำหรับเปิด dialog เพื่อสร้าง album ใหม่ มีการจัดการ state ทั้งใน local state และ Redux dispatch