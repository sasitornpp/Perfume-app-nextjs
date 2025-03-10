# คู่มือการทำงานของ `lib/utils.ts`

## 1. บทนำ

ไฟล์ `lib/utils.ts` เป็นไฟล์ utility functions ในระบบ, มีหน้าที่รวบรวมฟังก์ชันที่เป็นประโยชน์และถูกใช้งานบ่อยในหลายส่วนของแอปพลิเคชัน Next.js นี้ ฟังก์ชันเหล่านี้ช่วยให้โค้ดมีความกระชับ, อ่านง่าย, และลดความซ้ำซ้อน

## 2. โครงสร้างข้อมูลหลัก (State Structure)

*ไม่มีส่วนนี้ เนื่องจากไฟล์นี้ไม่ได้จัดการ state.*

## 3. ฟังก์ชันหลักในระบบ

ฟังก์ชันหลักในระบบคือ:

-   **`cn`**: รวม class names สำหรับ Tailwind CSS

## 4. อธิบายการทำงานของแต่ละฟังก์ชัน

### 4.1 `cn`

1.  รับ `...inputs` เป็น array ของ class names ที่ต้องการรวม. `inputs` สามารถเป็น string, array ของ strings, หรือ object ที่มี class names เป็น keys และ boolean เป็น values (ใช้ `clsx` library).
2.  ใช้ `clsx(inputs)` เพื่อรวม class names เหล่านั้น. `clsx` จะจัดการกับ conditional class names (เช่น `{'class-name': condition}`) และ array ของ class names.
3.  ใช้ `twMerge()` เพื่อ resolve class name conflicts ที่เกิดจาก Tailwind CSS. `twMerge` จะตรวจสอบว่า class names ที่รวมกันมี conflicts กันหรือไม่ และจะเลือก class name ที่ถูกต้องตามลำดับความสำคัญของ Tailwind CSS.
4.  คืนค่า string ที่เป็นผลลัพธ์ของการรวม class names และการ resolve conflicts.

**ตัวอย่าง:**

```typescript
cn("bg-red-500", "text-white", { "font-bold": true });
// ผลลัพธ์: "bg-red-500 text-white font-bold"

cn("bg-red-500", "bg-blue-500", "text-white");
// ผลลัพธ์: "bg-blue-500 text-white" (bg-blue-500 จะ override bg-red-500)
```

## 5. การจัดการสถานะ (State Management)

*ไม่มีส่วนนี้ เนื่องจากไฟล์นี้ไม่ได้จัดการ state.*

โดยรวมแล้ว, `lib/utils.ts` มีฟังก์ชัน `cn` ที่ช่วยให้การจัดการ class names ใน Tailwind CSS เป็นเรื่องง่ายและมีประสิทธิภาพ, ลดความซับซ้อนในการเขียนโค้ดและเพิ่มความสามารถในการ maintain โค้ด