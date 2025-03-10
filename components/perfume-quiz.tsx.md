# คู่มือการทำงานของ `components/perfume-quiz.tsx`

## 1. บทนำ

ไฟล์ `components/perfume-quiz.tsx` คือ component ที่สร้างแบบสอบถาม (quiz) เพื่อแนะนำน้ำหอมที่เหมาะสมกับความชอบของผู้ใช้ในแอปพลิเคชัน Next.js Component นี้ใช้ Redux เพื่อเข้าถึงข้อมูลน้ำหอม (accords, notes, brands) และ dispatch action เพื่อดึงข้อมูลน้ำหอมที่แนะนำ

## 2. โครงสร้างข้อมูลหลัก (State Structure)

โครงสร้างข้อมูลหลักที่ใช้ใน component นี้ประกอบด้วย:

-   **Redux State:**
    -   `perfumes.perfume_unique_data.accords`: ข้อมูล accords ทั้งหมดของน้ำหอม
    -   `perfumes.perfume_unique_data.top_notes`: ข้อมูล top notes ทั้งหมดของน้ำหอม
    -   `perfumes.perfume_unique_data.middle_notes`: ข้อมูล middle notes ทั้งหมดของน้ำหอม
    -   `perfumes.perfume_unique_data.base_notes`: ข้อมูล base notes ทั้งหมดของน้ำหอม
    -   `perfumes.perfume_unique_data.brand`: ข้อมูลแบรนด์ทั้งหมดของน้ำหอม
-   **Component State:**
    -   `currentStep`: หมายเลข step ปัจจุบันของ quiz (เริ่มต้นที่ 0)
    -   `formData`: ข้อมูลที่ผู้ใช้กรอกในแบบสอบถาม (ประเภท `Filters`). มีโครงสร้างดังนี้
        ```typescript
        interface Filters {
            gender_filter: string | null;
            accords_filter: string[];
            top_notes_filter: string[];
            middle_notes_filter: string[];
            base_notes_filter: string[];
            brand_filter: string | null;
        }
        ```
        -   `accordSearch`: ข้อความที่ใช้ค้นหา accords
    -   `topNoteSearch`: ข้อความที่ใช้ค้นหา top notes
    -   `middleNoteSearch`: ข้อความที่ใช้ค้นหา middle notes
    -   `baseNoteSearch`: ข้อความที่ใช้ค้นหา base notes
    -   `brandSearch`: ข้อความที่ใช้ค้นหา brands
    -   `selectedAccords`: array ของ accords ที่ผู้ใช้เลือก
    -    `activeNotesTab`: tab notes ที่ active ("top", "middle", "base")

## 3. ฟังก์ชันหลักในระบบ

ฟังก์ชันหลักในระบบแบ่งออกเป็นหมวดหมู่ต่างๆ ดังนี้:

-   **การจัดการ State ของ Quiz:**
    -   `setCurrentStep`: เปลี่ยน step ปัจจุบันของ quiz
    -   `setFormData`: อัปเดตข้อมูลในฟอร์ม
    -   `setSelectedAccords`: อัปเดต accords ที่เลือก
    -   `setAccordSearch`, `setTopNoteSearch`, `setMiddleNoteSearch`, `setBaseNoteSearch`, `setBrandSearch`: อัปเดตข้อความที่ใช้ในการค้นหา
-   **การจัดการข้อมูลที่ผู้ใช้เลือก:**
    -   `handleGenderSelect`: เลือก gender ที่ต้องการ
    -   `handleAccordToggle`: เลือก/ยกเลิกการเลือก accord
    -   `handleNoteToggle`: เลือก/ยกเลิกการเลือก note (top, middle, base)
    -   `handleBrandSelect`: เลือกแบรนด์
    -   `clearBrandSelection`: ยกเลิกการเลือกแบรนด์
    -   `handleSituationChange`: เปลี่ยน situation (daily, formal, date, party, exercise)
-   **การนำทาง:**
    -   `handleNext`: ไปยัง step ถัดไป
    -   `handlePrevious`: กลับไปยัง step ก่อนหน้า
    -   `handleSubmit`: ส่งข้อมูลและนำทางไปยังหน้า profile
-   **การดึงข้อมูล:**
    -    `fetchSuggestedPerfumes`: ดึงข้อมูลน้ำหอมที่แนะนำ

## 4. อธิบายการทำงานของแต่ละฟังก์ชัน

### 4.1 การจัดการ State ของ Quiz

-   `setCurrentStep`: ฟังก์ชันนี้ใช้เพื่อเปลี่ยน step ปัจจุบันของแบบสอบถาม โดยรับค่าเป็นหมายเลข step ที่ต้องการเปลี่ยน
-   `setFormData`: ฟังก์ชันนี้ใช้เพื่ออัปเดตข้อมูลในฟอร์ม โดยรับค่าเป็น object ที่มี key เป็นชื่อ field และ value เป็นค่าที่ต้องการอัปเดต
-   `setSelectedAccords`: ฟังก์ชันนี้ใช้เพื่ออัปเดต array ของ accords ที่ผู้ใช้เลือก โดยรับค่าเป็น array ของ accords
-   `setAccordSearch`, `setTopNoteSearch`, `setMiddleNoteSearch`, `setBaseNoteSearch`, `setBrandSearch`: ฟังก์ชันเหล่านี้ใช้เพื่ออัปเดตข้อความที่ใช้ในการค้นหา accords, top notes, middle notes, base notes และ brands ตามลำดับ

### 4.2 การจัดการข้อมูลที่ผู้ใช้เลือก

-   `handleGenderSelect`: ฟังก์ชันนี้ใช้เพื่อเลือก gender ที่ต้องการ โดยรับค่าเป็น string ("for men", "for women" หรือ null) และอัปเดต `formData.gender_filter`
-   `handleAccordToggle`: ฟังก์ชันนี้ใช้เพื่อเลือก/ยกเลิกการเลือก accord โดยรับค่าเป็น accord ที่ต้องการ toggle และอัปเดต `formData.accords_filter` และ `selectedAccords`
-   `handleNoteToggle`: ฟังก์ชันนี้ใช้เพื่อเลือก/ยกเลิกการเลือก note (top, middle, base) โดยรับค่าเป็น `noteType` ("top_notes_filter", "middle_notes_filter", "base_notes_filter") และ note ที่ต้องการ toggle และอัปเดต `formData[noteType]`
-   `handleBrandSelect`: ฟังก์ชันนี้ใช้เพื่อเลือกแบรนด์ โดยรับค่าเป็นแบรนด์ที่ต้องการเลือก และอัปเดต `formData.brand_filter`
-   `clearBrandSelection`: ฟังก์ชันนี้ใช้เพื่อยกเลิกการเลือกแบรนด์ โดยตั้งค่า `formData.brand_filter` เป็น null
-   `handleSituationChange`: ฟังก์ชันนี้ใช้เพื่อเปลี่ยน situation (daily, formal, date, party, exercise) โดยรับค่าเป็น `SituationType` และอัปเดต `formData.accords_filter` ด้วย accords ที่เกี่ยวข้องกับ situation นั้นๆ

### 4.3 การนำทาง

-   `handleNext`: ฟังก์ชันนี้ใช้เพื่อไปยัง step ถัดไป โดยเพิ่มค่า `currentStep` ขึ้น 1 และ scroll ไปยังด้านบนของหน้า
-   `handlePrevious`: ฟังก์ชันนี้ใช้เพื่อกลับไปยัง step ก่อนหน้า โดยลดค่า `currentStep` ลง 1 และ scroll ไปยังด้านบนของหน้า
-   `handleSubmit`: ฟังก์ชันนี้ใช้เพื่อส่งข้อมูล โดย dispatch action `fetchSuggestedPerfumes` เพื่อดึงข้อมูลน้ำหอมที่แนะนำ และนำทางไปยังหน้า `/profile?q=recommendations`

### 4.4 การดึงข้อมูล
- `fetchSuggestedPerfumes`: ฟังก์ชันนี้ใช้ dispatch action `fetchSuggestedPerfumes` จาก redux เพื่อดึงข้อมูลน้ำหอมที่แนะนำ

## 5. การจัดการสถานะ (State Management)

Component `PerfumeQuiz` มีการจัดการ state ดังนี้:

-   **Local State:** ใช้ `useState` hook เพื่อจัดการ state ที่เกี่ยวข้องกับ UI ของ quiz เช่น `currentStep`, `formData`, `accordSearch`, `selectedAccords`
-   **Redux State:** ใช้ `useSelector` hook เพื่อเข้าถึงข้อมูลน้ำหอม (accords, notes, brands) จาก Redux store และใช้ `useDispatch` hook เพื่อ dispatch action `fetchSuggestedPerfumes` ไปยัง Redux store

**การโหลดข้อมูล:** ข้อมูลน้ำหอม (accords, notes, brands) ถูกโหลดเมื่อแอปพลิเคชันเริ่มต้น และถูกเก็บไว้ใน Redux store Component `PerfumeQuiz` เข้าถึงข้อมูลเหล่านี้ผ่าน `useSelector` hook

**การอัปเดตข้อมูล:** เมื่อผู้ใช้กรอกข้อมูลในแบบสอบถาม ข้อมูลจะถูกเก็บไว้ใน local state (`formData`) เมื่อผู้ใช้กด submit ข้อมูลใน `formData` จะถูกส่งไปยัง Redux store ผ่าน action `fetchSuggestedPerfumes` เพื่อดึงข้อมูลน้ำหอมที่แนะนำ

**การจัดการข้อผิดพลาด:** ไม่มีการจัดการข้อผิดพลาดโดยตรงใน component นี้ แต่การดึงข้อมูลจาก Redux store และการ dispatch action อาจเกิดข้อผิดพลาดได้ ซึ่งจะถูกจัดการใน Redux reducer

โดยรวมแล้ว, `components/perfume-quiz.tsx` เป็น component ที่ซับซ้อน มีการจัดการ state ทั้งใน local state และ Redux state มีการใช้ utility functions เพื่อจัดการข้อมูล และมีการใช้ hooks ต่างๆ เพื่อเข้าถึงและอัปเดต state