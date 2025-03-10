# คู่มือการทำงานของ `components/form/image-upload.tsx`

## 1. บทนำ

ไฟล์ `components/form/image-upload.tsx` เป็น React component ที่สร้าง UI สำหรับ upload รูปภาพ Component นี้ใช้ `framer-motion` สำหรับ animation

## 2. โครงสร้างข้อมูลหลัก (State Structure)

Component นี้ไม่ได้จัดการ state ภายในตัวเองโดยตรง ข้อมูลและฟังก์ชันต่างๆ ถูกส่งมาจาก parent component ผ่าน props

## 3. ฟังก์ชันหลักในระบบ

ฟังก์ชันหลักในระบบคือ:

*   **แสดง UI สำหรับ upload รูปภาพ:** แสดง label ที่ทำหน้าที่เป็น button สำหรับ upload รูปภาพ
*   **จัดการการ upload รูปภาพ:** เรียกใช้ฟังก์ชัน `onImageUpload` ที่ถูกส่งมาจาก parent component เมื่อมีการเลือกรูปภาพ

## 4. อธิบายการทำงานของแต่ละฟังก์ชัน

1.  **รับ props:** Component รับ prop `onImageUpload` จาก parent component
2.  **แสดง UI:** Component แสดง UI สำหรับ upload รูปภาพ โดยใช้ component ต่างๆ จาก "@/components/ui/\*"` เช่น `Label`, `Input`
    *   แสดง label ที่มี icon และ text ที่บ่งบอกวิธีการ upload รูปภาพ
    *   ซ่อน input field ที่ใช้สำหรับ upload รูปภาพ (ใช้ label เป็น button แทน)
3.  **จัดการการ upload รูปภาพ:**
    *   เมื่อผู้ใช้เลือกรูปภาพ, event `onChange` ของ input field จะถูกเรียกใช้
    *   ฟังก์ชัน `onImageUpload` ที่ถูกส่งมาจาก parent component จะถูกเรียกใช้

## 5. การจัดการสถานะ (State Management)

Component นี้ไม่ได้จัดการ state ภายในตัวเองโดยตรง ฟังก์ชัน `onImageUpload` ถูกส่งมาจาก parent component และจะจัดการ state ที่เกี่ยวข้องกับการ upload รูปภาพ

โดยรวมแล้ว, `components/form/image-upload.tsx` เป็น component ที่ใช้แสดง UI สำหรับ upload รูปภาพ ฟังก์ชัน `onImageUpload` ถูกส่งมาจาก parent component เพื่อจัดการ logic ที่เกี่ยวข้องกับการ upload รูปภาพ