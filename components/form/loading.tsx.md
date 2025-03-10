# คู่มือการทำงานของ `components/form/loading.tsx`

## 1. บทนำ

ไฟล์ `components/form/loading.tsx` เป็น React component ที่ใช้แสดง loading indicator ทั่วทั้งแอปพลิเคชัน Next.js Component นี้ใช้ Redux เพื่อตรวจสอบสถานะ loading จากส่วนต่างๆ ของแอปพลิเคชัน

## 2. โครงสร้างข้อมูลหลัก (State Structure)

Component นี้มีการจัดการ state ดังนี้:

*   **Redux State:**
    *   `perfumes.loading`: สถานะ loading ของข้อมูลน้ำหอม (boolean)
    *   `user.loading`: สถานะ loading ของข้อมูลผู้ใช้ (boolean)

## 3. ฟังก์ชันหลักในระบบ

ฟังก์ชันหลักในระบบคือ:

*   **ตรวจสอบสถานะ loading:** ตรวจสอบสถานะ loading จาก Redux store (ทั้ง `perfumes.loading` และ `user.loading`)
*   **แสดง loading indicator:** ถ้ามีสถานะ loading เป็น true จะแสดง loading indicator
*   **แสดง content หลัก:** ถ้าไม่มีสถานะ loading เป็น true จะแสดง content หลัก (children)

## 4. อธิบายการทำงานของแต่ละฟังก์ชัน

1.  **เข้าถึงข้อมูล loading จาก Redux:** ใช้ `useSelector` hook เพื่อเข้าถึงสถานะ loading จาก Redux store (ทั้ง `perfumes.loading` และ `user.loading`)
2.  **ตรวจสอบสถานะ loading:** ตรวจสอบว่า `perfumesLoading` หรือ `userLoading` เป็น true หรือไม่
3.  **แสดง UI:**
    *   ถ้ามีสถานะ loading เป็น true: จะแสดง loading indicator ที่มี animation ต่างๆ
    *   ถ้าไม่มีสถานะ loading เป็น true: จะแสดง content หลัก (children)

## 5. การจัดการสถานะ (State Management)

Component `Loading` มีการจัดการ state ดังนี้:

*   **Redux State:** ใช้ `useSelector` hook เพื่อเข้าถึงสถานะ loading จาก Redux store

**การโหลดข้อมูล:** ไม่มีการโหลดข้อมูลโดยตรงใน component นี้

**การอัปเดตข้อมูล:** สถานะ loading ถูกอัปเดตใน Redux store โดย reducers ต่างๆ เมื่อมีการ dispatch action ที่เกี่ยวข้องกับการโหลดข้อมูล

**การจัดการข้อผิดพลาด:** ไม่มีการจัดการข้อผิดพลาดโดยตรงใน component นี้ ข้อผิดพลาดที่เกิดขึ้นระหว่างการโหลดข้อมูลจะถูกจัดการใน reducers ที่เกี่ยวข้อง

โดยรวมแล้ว, `components/form/loading.tsx` เป็น component ที่ใช้แสดง loading indicator ทั่วทั้งแอปพลิเคชัน มีการใช้ Redux state เพื่อตรวจสอบสถานะ loading