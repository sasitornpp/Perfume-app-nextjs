# คู่มือการทำงานของ `app/perfumes/home/page.tsx`

## 1. บทนำ

ไฟล์ `app/perfumes/home/page.tsx` เป็น React component ที่ใช้สร้างหน้า landing page หลักสำหรับส่วนของน้ำหอม (perfumes) ในแอปพลิเคชัน Next.js Component นี้แสดง hero section ที่สวยงาม, benefits bar, personalized recommendations (ถ้ามี), perfume showcase, และ brand showcase

**หมายเหตุ:** คู่มือนี้ปรับแต่งสำหรับผู้ใช้ `Shinon2023`

## 2. โครงสร้างข้อมูลหลัก (State Structure)

Component นี้มีการจัดการ state ดังนี้:

*   **Redux State:**
    *   `user.profile`: ข้อมูลโปรไฟล์ของผู้ใช้ที่ login (ประเภท `Profile | null`). ในฐานะ `Shinon2023`, ข้อมูลนี้จะประกอบไปด้วยข้อมูลส่วนตัวของคุณ, รวมถึง `suggestions_perfumes` ซึ่งเป็นรายการน้ำหอมที่แนะนำสำหรับคุณ
    *   `perfumes.perfume_unique_data.brand`: ข้อมูลแบรนด์ทั้งหมดของน้ำหอม (ประเภท `{ name: string; logo: string | null }[]`)
    *   `perfumes.perfumes_by_page[1]`: ข้อมูลน้ำหอมในหน้าแรก (ประเภท `Perfume[]`).  รายการน้ำหอมเหล่านี้จะถูกใช้ในการแสดง perfume showcase
*   **Component State:**
    *   `featuredPerfume`: น้ำหอมที่ถูกเลือกให้เป็น featured perfume (ประเภท `Perfume | null`).  น้ำหอมนี้จะถูกสุ่มเลือกจาก `suggestions_perfumes` ของคุณ (ถ้ามี)
    *   `isVisible`: สถานะที่บ่งบอกว่า component visible หรือไม่ (boolean).  ใช้สำหรับ animation
    *   `hoveredBrandIndex`: index ของแบรนด์ที่ถูก hover (ประเภท `number | null`).  ใช้สำหรับ animation

## 3. ฟังก์ชันหลักในระบบ

ฟังก์ชันหลักในระบบคือ:

*   **ดึงข้อมูล:** ดึงข้อมูลโปรไฟล์ของผู้ใช้, ข้อมูลแบรนด์, และข้อมูลน้ำหอม
*   **แสดง Hero Section:** แสดง hero section ที่มีข้อมูลเกี่ยวกับ personalized fragrance และปุ่มสำหรับทำ quiz
*   **แสดง Benefits Bar:** แสดง benefits bar ที่มี icon และ text ที่อธิบายถึง benefits ของแอปพลิเคชัน
*   **แสดง Personalized Recommendations:** แสดงรายการน้ำหอมที่แนะนำสำหรับผู้ใช้ (ถ้ามี)
*   **แสดง Perfume Showcase:** แสดงรายการน้ำหอมยอดนิยม
*   **แสดง Brand Showcase:** แสดงรายการแบรนด์ยอดนิยม

## 4. อธิบายการทำงานของแต่ละฟังก์ชัน

1.  **เข้าถึงข้อมูลจาก Redux:** ใช้ `useSelector` hook เพื่อเข้าถึงข้อมูลโปรไฟล์, ข้อมูลแบรนด์, และข้อมูลน้ำหอมจาก Redux store
2.  **จัดการ state:** ใช้ `useState` hook เพื่อจัดการ state ต่างๆ เช่น `featuredPerfume`, `isVisible`, `hoveredBrandIndex`
3.  **กำหนด featured perfume:**
    *   ใช้ `useEffect` hook เพื่อกำหนด `featuredPerfume` เมื่อ component mount และเมื่อ `suggestionsPerfumes` เปลี่ยนแปลง
    *   ถ้ามี `suggestionsPerfumes`, จะสุ่มเลือกน้ำหอมจาก `suggestionsPerfumes`
4.  **แสดง UI:** Component แสดง UI สำหรับหน้า landing page โดยใช้ component ต่างๆ จาก "@/components/ui/\*"` และ component ที่สร้างขึ้นเอง เช่น `PerfumeCard`
    *   แสดง Hero Section ที่มีปุ่มสำหรับทำ quiz หรือดู recommendations
    *   แสดง Benefits Bar ที่มี icon และ text ที่อธิบายถึง benefits ของแอปพลิเคชัน
    *   แสดง Personalized Recommendations (ถ้ามี `suggestionsPerfumes`)
    *   แสดง Perfume Showcase ที่มีรายการน้ำหอมยอดนิยม
    *   แสดง Brand Showcase ที่มีรายการแบรนด์ยอดนิยม

## 5. การจัดการสถานะ (State Management)

Component `PerfumeLandingPage` มีการจัดการ state ดังนี้:

*   **Redux State:** ใช้ `useSelector` hook เพื่อเข้าถึงข้อมูลโปรไฟล์, ข้อมูลแบรนด์, และข้อมูลน้ำหอมจาก Redux store. ในฐานะผู้ใช้ `Shinon2023`, ข้อมูลโปรไฟล์ของคุณ (โดยเฉพาะ `suggestions_perfumes`) จะมีผลต่อการแสดงผลของ Personalized Recommendations
*   **Local State:** ใช้ `useState` hook เพื่อจัดการ state ที่เกี่ยวข้องกับ UI ของหน้า เช่น `featuredPerfume`, `isVisible`, `hoveredBrandIndex`

**การโหลดข้อมูล:** ข้อมูลโปรไฟล์, ข้อมูลแบรนด์, และข้อมูลน้ำหอมถูกโหลดเมื่อแอปพลิเคชันเริ่มต้น และถูกเก็บไว้ใน Redux store Component `PerfumeLandingPage` เข้าถึงข้อมูลเหล่านี้ผ่าน `useSelector` hook

**การอัปเดตข้อมูล:** ไม่มีการอัปเดตข้อมูลโดยตรงใน component นี้ การเปลี่ยนแปลงข้อมูลจะเกิดจากการ dispatch actions ไปยัง Redux store

**การจัดการข้อผิดพลาด:** ไม่มีการจัดการข้อผิดพลาดโดยตรงใน component นี้

โดยรวมแล้ว, `app/perfumes/home/page.tsx` เป็น component ที่ใช้สร้างหน้า landing page หลักสำหรับส่วนของน้ำหอม มีการจัดการ state ทั้งใน local state และ Redux state มีการใช้ hooks ต่างๆ เพื่อเข้าถึงและอัปเดต state และมีการจัดการ logic ที่เกี่ยวข้องกับการแสดงข้อมูลต่างๆ ในหน้า landing page อย่างสวยงามและน่าสนใจ