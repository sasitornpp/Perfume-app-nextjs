# คู่มือการทำงานของ `app/perfumes/[perfumeId]/page.tsx`

## 1. บทนำ

ไฟล์ `app/perfumes/[perfumeId]/page.tsx` เป็น React component ที่ใช้แสดงรายละเอียดของน้ำหอม (perfume) แต่ละรายการในแอปพลิเคชัน Next.js โดย `[perfumeId]` เป็น dynamic route segment ที่ระบุ ID ของน้ำหอม Component นี้ใช้ Redux เพื่อเข้าถึงข้อมูลน้ำหอมและข้อมูลผู้ใช้ และใช้ฟังก์ชันต่างๆ เพื่อจัดการ likes, เพิ่มสินค้าลงตะกร้า, และแชร์

## 2. โครงสร้างข้อมูลหลัก (State Structure)

Component นี้มีการจัดการ state ดังนี้:

*   **Redux State:**
    *   `perfumes.selectedPerfume`: ข้อมูลของน้ำหอมที่ถูกเลือก (ประเภท `{ data: Perfume | null; errorMessages: string | null }`)
    *   `user.user`: ข้อมูลของผู้ใช้ที่ login (ประเภท `User | null`)
    *   `user.basket`: ข้อมูลตะกร้าสินค้าของผู้ใช้ (ประเภท `Basket[] | null`)
    *   `perfumes.loading`: สถานะ loading ของข้อมูลน้ำหอม (boolean)
*   **Component State:**
    *   `activeImage`: index ของรูปภาพที่กำลังแสดง (number)
    *   `showMore`: สถานะที่บ่งบอกว่าต้องการแสดงรายละเอียดทั้งหมดหรือไม่ (boolean)

## 3. ฟังก์ชันหลักในระบบ

ฟังก์ชันหลักในระบบคือ:

*   **ดึงข้อมูลน้ำหอม:** ดึงข้อมูลน้ำหอมจาก Redux store หรือ dispatch action เพื่อดึงข้อมูลจาก API
*   **แสดงรายละเอียดน้ำหอม:** แสดงข้อมูลน้ำหอม (รูปภาพ, ชื่อ, แบรนด์, รายละเอียด, notes, accords, etc.)
*   **จัดการ likes:** เพิ่ม/ลบ like ให้กับน้ำหอม
*   **เพิ่มน้ำหอมลงตะกร้า:** เพิ่มน้ำหอมลงในตะกร้าสินค้าของผู้ใช้
*   **แชร์น้ำหอม:** คัดลอก link ของหน้าน้ำหอมไปยัง clipboard
*    **จัดการอัลบั้ม:** เพิ่มน้ำหอมลงในอัลบั้ม
*   **แก้ไข/ลบน้ำหอม:** อนุญาตให้ผู้ใช้ที่เป็นเจ้าของน้ำหอมแก้ไขหรือลบน้ำหอม

## 4. อธิบายการทำงานของแต่ละฟังก์ชัน

1.  **รับ params:** Component รับ `params` จาก Next.js route (มี `perfumeId` เป็น property)
2.  **ดึงข้อมูลน้ำหอม:**
    *   ใช้ `useSelector` hook เพื่อเข้าถึงข้อมูลน้ำหอมจาก Redux store (`perfumes.selectedPerfume`)
    *   ใช้ `useEffect` hook เพื่อตรวจสอบว่าข้อมูลน้ำหอมใน Redux store ถูกต้องหรือไม่
    *   ถ้าข้อมูลไม่ถูกต้อง (เช่น `perfumeId` ไม่ตรงกัน) จะ dispatch action `fetchPerfumeById` เพื่อดึงข้อมูลจาก API
3.  **แสดง UI:** Component แสดง UI สำหรับรายละเอียดน้ำหอม โดยใช้ component ต่างๆ จาก "@/components/ui/\*"` เช่น `Card`, `Badge`, `Button`, `Separator`, `Tabs`, `Image`
    *   แสดงรูปภาพ, ชื่อ, แบรนด์, รายละเอียด, notes, accords, และข้อมูลอื่นๆ ของน้ำหอม
    *   แสดงปุ่มสำหรับ like, เพิ่มลงตะกร้า, แชร์, แก้ไข, และลบ
4.  **จัดการ likes:**
    *   `handleLikes`: ฟังก์ชันนี้จะถูกเรียกใช้เมื่อผู้ใช้กดปุ่ม "Like"
    *   ฟังก์ชันนี้จะตรวจสอบว่าผู้ใช้ login หรือไม่
    *   ถ้า login จะ dispatch action `toggleLikePerfume` เพื่อเพิ่ม/ลบ like ให้กับน้ำหอม
    *   ถ้าไม่ได้ login จะ redirect ไปยังหน้า login
5.  **จัดการการเพิ่มน้ำหอมลงตะกร้า:**
    *   `handleAddPerfumeToBasket`: ฟังก์ชันนี้จะถูกเรียกใช้เมื่อผู้ใช้กดปุ่ม "Add to Cart"
    *   ฟังก์ชันนี้จะตรวจสอบว่าผู้ใช้ login หรือไม่
    *   ถ้า login จะ dispatch action `addPerfumeToBasket` เพื่อเพิ่มน้ำหอมลงในตะกร้า
    *   ถ้าไม่ได้ login จะ redirect ไปยังหน้า login
6.  **จัดการการแชร์น้ำหอม:**
    *   เมื่อผู้ใช้กดปุ่ม "Share", link ของหน้าน้ำหอมจะถูกคัดลอกไปยัง clipboard
7.   **จัดการการแก้ไข/ลบน้ำหอม:**
    *   ถ้าผู้ใช้ login และเป็นเจ้าของน้ำหอม จะแสดงปุ่ม "Edit" และ "Delete"
    *   เมื่อผู้ใช้กดปุ่ม "Edit" จะ redirect ไปยังหน้าแก้ไขน้ำหอม
    *   เมื่อผู้ใช้กดปุ่ม "Delete" จะแสดง confirm dialog และถ้าผู้ใช้ยืนยัน จะ dispatch action `removePerfume` เพื่อลบน้ำหอม

## 5. การจัดการสถานะ (State Management)

Component `PerfumePage` มีการจัดการ state ดังนี้:

*   **Redux State:** ใช้ `useSelector` hook เพื่อเข้าถึงข้อมูลน้ำหอม, ข้อมูลผู้ใช้, และข้อมูลตะกร้าสินค้าจาก Redux store
*   **Local State:** ใช้ `useState` hook เพื่อจัดการ state ที่เกี่ยวข้องกับ UI ของหน้า เช่น `activeImage`, `showMore`

**การโหลดข้อมูล:** ข้อมูลน้ำหอมถูกโหลดจาก Redux store หรือจาก API (ถ้าไม่มีใน Redux store)

**การอัปเดตข้อมูล:** เมื่อผู้ใช้กด like หรือเพิ่มน้ำหอมลงตะกร้า ข้อมูลจะถูกอัปเดตใน Redux store ผ่าน dispatch actions

**การจัดการข้อผิดพลาด:** ถ้าไม่พบน้ำหอม หรือเกิดข้อผิดพลาดในการดึงข้อมูล จะแสดง error message

โดยรวมแล้ว, `app/perfumes/[perfumeId]/page.tsx` เป็น component ที่ซับซ้อน มีการจัดการ state ทั้งใน local state และ Redux state มีการใช้ hooks ต่างๆ เพื่อเข้าถึงและอัปเดต state และมีการจัดการ logic ที่เกี่ยวข้องกับการแสดงรายละเอียดน้ำหอม, การจัดการ likes, การเพิ่มลงตะกร้า, และการแชร์