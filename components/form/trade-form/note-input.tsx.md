# คู่มือการทำงานของ `components/form/trade-form/note-input.tsx`

## 1. บทนำ

ไฟล์ `components/form/trade-form/note-input.tsx` เป็น React component ที่ใช้แสดง input สำหรับกรอก notes (top, middle, base) ในฟอร์ม trade น้ำหอม Component นี้ใช้ `framer-motion` สำหรับ animation และใช้ `react-aria` component (`useAutocomplete`) สำหรับ autocomplete

## 2. โครงสร้างข้อมูลหลัก (State Structure)

Component นี้มีการจัดการ state ดังนี้:

* **Component State:**
  * `searchValue`: ข้อความที่ผู้ใช้พิมพ์ใน input field (string)
  * `isPopoverOpen`: สถานะของ Popover (ใช้สำหรับแสดง autocomplete suggestions) (boolean)
  * `visibleSuggestionsCount`: จำนวน suggestions ที่แสดงในรายการ (ใช้สำหรับ pagination) (number)
* **Props State:**
  * `type`: ประเภทของ notes ("Top", "Middle", "Base") (string)
  * `notes`: array ของ notes ที่ถูกกรอก (string[])
  * `suggestions`: array ของ suggestions สำหรับ autocomplete (string[])
  * `onAddNote`: ฟังก์ชันสำหรับเพิ่ม note ใหม่ (function)
  * `onNotesChange`: ฟังก์ชันสำหรับอัปเดต array ของ notes (function)
  * `onRemoveNote`: ฟังก์ชันสำหรับลบ note (function)
  * `onChangeNote`: ฟังก์ชันสำหรับเปลี่ยนค่าของ note (function)

## 3. ฟังก์ชันหลักในระบบ

ฟังก์ชันหลักในระบบคือ:

* **แสดง UI สำหรับกรอก notes:** แสดง input field สำหรับกรอก note และ Popover สำหรับแสดง autocomplete suggestions
* **กรองรายการ suggestions:** กรองรายการ suggestions ตามข้อความที่ผู้ใช้พิมพ์
* **จัดการการเลือก suggestion:** อัปเดต `notes` array เมื่อผู้ใช้เลือก suggestion
* **จัดการการเพิ่ม note ใหม่:** เรียกใช้ฟังก์ชัน `onAddNote` ที่ถูกส่งมาจาก parent component
* **จัดการการลบ note:** เรียกใช้ฟังก์ชัน `onRemoveNote` ที่ถูกส่งมาจาก parent component
* **จัดการการเปลี่ยนค่า note:** เรียกใช้ฟังก์ชัน `onChangeNote` ที่ถูกส่งมาจาก parent component
* **จัดการ Pagination:** แสดง suggestions เพิ่มเติมในรายการ (ถ้ามี)

## 4. อธิบายการทำงานของแต่ละฟังก์ชัน

1. **รับ props:** Component รับ props ต่างๆ เช่น `type`, `notes`, `suggestions`, `onAddNote`, `onNotesChange`, `onRemoveNote`, `onChangeNote`
2. **จัดการ state:** ใช้ `useState` hook เพื่อจัดการ state ต่างๆ เช่น `searchValue`, `isPopoverOpen`,  `visibleSuggestionsCount`
3. **กรองรายการ suggestions:** ใช้ `useMemo` hook เพื่อสร้าง `filteredSuggestions` โดยกรองรายการ suggestions ตามข้อความที่ผู้ใช้พิมพ์
4. **จัดการการเลือก suggestion:**
    * `handleSuggestionSelect`: ฟังก์ชันนี้จะถูกเรียกใช้เมื่อผู้ใช้เลือก suggestion จากรายการ
    * ฟังก์ชันนี้จะเรียกใช้ฟังก์ชัน `onChangeNote` ที่ถูกส่งมาจาก parent component เพื่ออัปเดต `notes` array
    * ฟังก์ชันนี้จะปิด Popover
5. **จัดการการเพิ่ม note ใหม่:**
    * เมื่อผู้ใช้กดปุ่ม "Add [Type] Note", ฟังก์ชัน `onAddNote` ที่ถูกส่งมาจาก parent component จะถูกเรียกใช้
6. **จัดการการลบ note:**
    * เมื่อผู้ใช้กดปุ่ม "X" ที่ note, ฟังก์ชัน `onRemoveNote` ที่ถูกส่งมาจาก parent component จะถูกเรียกใช้
7. **จัดการการเปลี่ยนค่า note:**
    * เมื่อผู้ใช้พิมพ์ข้อความใน input field, ฟังก์ชัน `onChangeNote` ที่ถูกส่งมาจาก parent component จะถูกเรียกใช้
8. **จัดการ Pagination:**
    * `handleShowMoreSuggestions`: ฟังก์ชันนี้จะถูกเรียกใช้เมื่อผู้ใช้กดปุ่ม "Show more suggestions"
    * ฟังก์ชันนี้จะเพิ่มค่า `visibleSuggestionsCount` ขึ้น 20

## 5. การจัดการสถานะ (State Management)

Component `NoteInput` มีการจัดการ state ดังนี้:

* **Local State:** ใช้ `useState` hook เพื่อจัดการ state ที่เกี่ยวข้องกับ UI ของ input เช่น `searchValue`, `isPopoverOpen`, `visibleSuggestionsCount`
* **Props State:** รับ `notes`, `suggestions`, `onAddNote`, `onNotesChange`, `onRemoveNote`, `onChangeNote` เป็น props จาก parent component เพื่อจัดการ state ของ notes

**การโหลดข้อมูล:** ไม่มีการโหลดข้อมูลโดยตรงใน component นี้

**การอัปเดตข้อมูล:** เมื่อผู้ใช้กรอกข้อมูลใน input field หรือเลือก suggestion ข้อมูลจะถูกอัปเดตผ่านฟังก์ชัน `onChangeNote` ฟังก์ชันนี้ถูกส่งมาจาก parent component ดังนั้นการเปลี่ยนแปลงใน `notes` array จะถูกจัดการโดย parent component

**การจัดการข้อผิดพลาด:** ไม่มีการจัดการข้อผิดพลาดโดยตรงใน component นี้

โดยรวมแล้ว, `components/form/trade-form/note-input.tsx` เป็น component ที่ใช้แสดง input สำหรับกรอก notes มีการจัดการ state ทั้งใน local state และ props state
