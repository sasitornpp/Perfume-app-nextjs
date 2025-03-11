# คู่มือการทำงานของ `utils/functions/image_process.ts`

## 1. บทนำ

ไฟล์ `utils/functions/image_process.ts` เป็นไฟล์ utility functions ในระบบ, มีหน้าที่จัดการเกี่ยวกับการอัปโหลดและลบรูปภาพใน Supabase Storage ฟังก์ชันเหล่านี้ช่วยให้การจัดการรูปภาพในแอปพลิเคชัน Next.js เป็นไปอย่างมีระบบและมีประสิทธิภาพ

## 2. โครงสร้างข้อมูลหลัก (State Structure)

*ไม่มีส่วนนี้ เนื่องจากไฟล์นี้ไม่ได้จัดการ state.*

## 3. ฟังก์ชันหลักในระบบ

ฟังก์ชันหลักในระบบคือ:

- **`uploadImagesToSupabase`**: อัปโหลดรูปภาพหลายรูปไปยัง Supabase Storage
- **`rollbackUploadedFiles`**: ลบรูปภาพที่อัปโหลดไปแล้วออกจาก Supabase Storage (ใช้ในกรณีเกิดข้อผิดพลาด)

## 4. อธิบายการทำงานของแต่ละฟังก์ชัน

### 4.1 `uploadImagesToSupabase`

1. รับ `folder_name` (ชื่อโฟลเดอร์ที่จะเก็บรูปภาพ) และ `images` (array ของ File objects) เป็น input.
2. สร้าง array ชื่อ `uploadedFiles` เพื่อเก็บข้อมูลของไฟล์ที่อัปโหลดสำเร็จ (filePath และ publicUrl).
3. ใช้ `Promise.all` เพื่ออัปโหลดรูปภาพแต่ละรูปใน array `images` แบบ asynchronous:
    - สร้าง `fileName` โดยใช้ `uuidv4()` เพื่อให้ชื่อไฟล์ไม่ซ้ำกัน และเพิ่มนามสกุลไฟล์.
    - สร้าง `filePath` โดยรวม `folder_name` และ `fileName`.
    - ใช้ `supabaseClient.storage.from("IMAGES").upload(filePath, file)` เพื่ออัปโหลดรูปภาพไปยัง Supabase Storage.
    - ถ้าอัปโหลดไม่สำเร็จ, return `null`.
    - ถ้าอัปโหลดสำเร็จ, ใช้ `supabaseClient.storage.from("IMAGES").getPublicUrl(filePath)` เพื่อดึง public URL ของรูปภาพ.
    - ถ้าดึง public URL ไม่สำเร็จ, return `null`.
    - ถ้าดึง public URL สำเร็จ, เพิ่มข้อมูล `filePath` และ `publicUrl` ลงใน array `uploadedFiles` และ return object ที่มี `filePath` และ `publicUrl`.
4. หลังจากอัปโหลดรูปภาพทั้งหมด (หรือเกิดข้อผิดพลาด), return object ที่มี:
    - `uploadedFiles`: array ของไฟล์ที่อัปโหลดสำเร็จ (มี `filePath` และ `publicUrl`).
    - `results`: array ของผลลัพธ์การอัปโหลด (เฉพาะไฟล์ที่อัปโหลดสำเร็จ).
5. ถ้าเกิดข้อผิดพลาดระหว่างการอัปโหลด, จะเรียกใช้ `rollbackUploadedFiles` เพื่อลบไฟล์ที่อัปโหลดไปแล้วออกจาก Supabase Storage และ return object ที่มี `uploadedFiles` และ `results` เป็น array ว่าง.

**ตัวอย่าง:**

```typescript
const { uploadedFiles, results } = await uploadImagesToSupabase("perfumes/my_perfume", [file1, file2]);

if (results.length === images.length) {
  console.log("อัปโหลดรูปภาพสำเร็จ!");
} else {
  console.log("มีรูปภาพบางส่วนอัปโหลดไม่สำเร็จ");
}
```

### 4.2 `rollbackUploadedFiles`

1. รับ `filePaths` (array ของ file paths ที่ต้องการลบ) เป็น input.
2. ถ้า `filePaths` เป็น array ว่าง, จะ return ทันที.
3. ใช้ `supabaseClient.storage.from("IMAGES").remove(filePaths)` เพื่อลบไฟล์ออกจาก Supabase Storage.
4. ถ้าเกิดข้อผิดพลาดในการลบไฟล์, จะ log ข้อผิดพลาดใน console.

**ตัวอย่าง:**

```typescript
await rollbackUploadedFiles(["perfumes/my_perfume/file1.jpg", "perfumes/my_perfume/file2.jpg"]);
console.log("ลบไฟล์ที่อัปโหลดไปแล้วสำเร็จ");
```

โดยรวมแล้ว, `utils/functions/image_process.ts` มีฟังก์ชันที่ช่วยให้การจัดการรูปภาพใน Supabase Storage เป็นไปอย่างมีระบบ, มีการจัดการข้อผิดพลาด, และมีฟังก์ชัน rollback เพื่อให้มั่นใจได้ว่าข้อมูลใน Supabase Storage จะถูกต้องเสมอ
