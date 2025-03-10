# คู่มือการทำงานของ `components/form/trade-form/tab-content/contact.tsx`

## 1. บทนำ

ไฟล์ `components/form/trade-form/tab-content/contact.tsx` เป็น React component ที่ใช้แสดง tab content สำหรับการกรอกข้อมูลติดต่อ (contact information) ในฟอร์ม trade (แลกเปลี่ยน) น้ำหอม Component นี้เป็นส่วนหนึ่งของระบบสร้างรายการน้ำหอม (perfume listing) ในแอปพลิเคชัน Next.js

## 2. โครงสร้างข้อมูลหลัก (State Structure)

Component นี้รับข้อมูลและฟังก์ชันต่างๆ ผ่าน props ไม่ได้จัดการ state ภายในตัวเองโดยตรง ข้อมูลที่เกี่ยวข้องประกอบด้วย:

*   **`formData`**: ข้อมูลฟอร์มทั้งหมด (ประเภท `PerfumeForInsert` หรือ `PerfumeForUpdate`). มีโครงสร้างดังนี้ (ตัวอย่าง):

    ```typescript
    interface PerfumeForInsert {
        name: string;
        brand: string;
        // ... ข้อมูลอื่นๆ
        phone_number: string;
        facebook: string;
        line: string;
    }

    interface PerfumeForUpdate {
        id: string;
        name: string;
        brand: string;
        // ... ข้อมูลอื่นๆ
        phone_number: string;
        facebook: string;
        line: string;
    }
    ```

*   **`containerVariants`**: variants สำหรับ animation ของ container (จาก Framer Motion)
*   **`itemVariants`**: variants สำหรับ animation ของแต่ละ item (จาก Framer Motion)

## 3. ฟังก์ชันหลักในระบบ

ฟังก์ชันหลักในระบบคือ:

*   **แสดง UI สำหรับกรอกข้อมูลติดต่อ:** แสดง input fields สำหรับ phone number, Facebook, และ Line ID
*   **คำนวณสถานะความสมบูรณ์ของข้อมูลติดต่อ:** คำนวณว่าผู้ใช้กรอกข้อมูลติดต่อครบถ้วนหรือไม่
*   **แสดงสถานะความสมบูรณ์ของข้อมูลติดต่อ:** แสดง icon และ text ที่บ่งบอกสถานะความสมบูรณ์ของข้อมูลติดต่อ

## 4. อธิบายการทำงานของแต่ละฟังก์ชัน

1.  **รับ props:** Component รับ props ต่างๆ เช่น `containerVariants`, `itemVariants`, `formData`, `handleChange`, `loading`
2.  **คำนวณ `contactMethodsCount`:** คำนวณจำนวน contact methods ที่ถูกกรอกข้อมูล โดย filter ข้อมูล `formData.phone_number`, `formData.facebook`, `formData.line` และนับจำนวนที่ไม่เป็นค่าว่าง
3.  **กำหนด `getCompletionStatus`:** ฟังก์ชันนี้จะคืนค่า object ที่มีข้อมูลเกี่ยวกับสถานะความสมบูรณ์ของข้อมูลติดต่อ (icon, color, text) โดยพิจารณาจากค่า `contactMethodsCount`:
    *   ถ้า `contactMethodsCount` เป็น 0: คืนค่า `AlertCircle` icon, color เป็น "text-destructive", และ text เป็น "Missing contact info"
    *   ถ้า `contactMethodsCount` เป็น 1: คืนค่า `CheckCircle2` icon, color เป็น "text-amber-500", และ text เป็น "Basic contact info"
    *   ถ้า `contactMethodsCount` มากกว่า 1: คืนค่า `CheckCircle2` icon, color เป็น "text-green-500", และ text เป็น "Complete contact info"
4.  **แสดง UI:** Component แสดง UI สำหรับกรอกข้อมูลติดต่อ โดยใช้ component ต่างๆ จาก "@/components/ui/\*"` เช่น `TabsContent`, `Label`, `Input`, `Button`, `Card`, `Badge`, `TooltipProvider`
    *   แสดง input fields สำหรับ `phone_number`, `facebook`, และ `line`
    *   แสดงสถานะความสมบูรณ์ของข้อมูลติดต่อ โดยใช้ icon และ text ที่ได้จาก `getCompletionStatus`
    *   แสดงปุ่ม "Create Perfume Listing" ที่จะทำการ submit ฟอร์ม

## 5. การจัดการสถานะ (State Management)

Component นี้ไม่ได้จัดการ state ภายในตัวเองโดยตรง ข้อมูลและฟังก์ชันต่างๆ ถูกส่งมาจาก parent component ผ่าน props

*   **การโหลดข้อมูล:** ไม่มีการโหลดข้อมูลโดยตรงใน component นี้
*   **การอัปเดตข้อมูล:** เมื่อผู้ใช้ทำการแก้ไขข้อมูลใน input field, event `onChange` จะถูกเรียกใช้และส่งไปยังฟังก์ชัน `handleChange` ที่ถูกส่งมาจาก parent component
*   **การจัดการข้อผิดพลาด:** ไม่มีการจัดการข้อผิดพลาดโดยตรงใน component นี้

โดยรวมแล้ว, `components/form/trade-form/tab-content/contact.tsx` เป็น component ที่ใช้แสดง UI สำหรับกรอกข้อมูลติดต่อในฟอร์ม trade น้ำหอม ข้อมูลและฟังก์ชันต่างๆ ถูกส่งมาจาก parent component ผ่าน props