import { createServerClient } from "@supabase/ssr";
// นำเข้า `createServerClient` จาก Supabase SDK เพื่อสร้าง Supabase client สำหรับการใช้งานบนฝั่ง Server

import { cookies } from "next/headers";
// นำเข้า `cookies` จาก Next.js เพื่อจัดการกับ cookies ของผู้ใช้ในฝั่ง Server

// ตรวจสอบตัวแปรแวดล้อม (Environment Variables)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
// ดึง URL ของ Supabase จาก environment variable `NEXT_PUBLIC_SUPABASE_URL`

const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// ดึง Anonymous Key ของ Supabase จาก environment variable `NEXT_PUBLIC_SUPABASE_ANON_KEY`

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // ตรวจสอบว่าตัวแปรแวดล้อมทั้งสองถูกกำหนดไว้หรือไม่
  throw new Error("Missing Supabase environment variables");
  // ถ้าขาดตัวแปรใดตัวแปรหนึ่ง ขว้างข้อผิดพลาดพร้อมข้อความแจ้งเตือน
}

// ฟังก์ชันสำหรับสร้าง Supabase client
export const createServer = async() => {
  // สร้าง `cookieStore` เพื่อจัดการ cookies โดยใช้ `cookies` จาก Next.js
  const cookieStore = await cookies();

  // เรียก `createServerClient` เพื่อสร้าง Supabase client
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    // ส่ง URL และ Anonymous Key ของ Supabase เป็นพารามิเตอร์
    cookies: {
      // กำหนดการจัดการ cookies
      getAll: () => cookieStore.getAll(),
      // ฟังก์ชัน `getAll` ดึง cookies ทั้งหมดจาก `cookieStore`

      setAll: (cookiesToSet) => {
        // ฟังก์ชัน `setAll` ใช้สำหรับตั้งค่าหรืออัปเดต cookies
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            // วนลูปผ่าน cookies ที่ต้องการตั้งค่า
            cookieStore.set(name, value, options);
            // ใช้ `cookieStore.set` เพื่อบันทึก cookies ลงใน Store
          });
        } catch (error) {
          // ถ้ามีข้อผิดพลาดขณะตั้งค่า cookies
          console.error("Error setting cookies:", error);
          // แสดงข้อผิดพลาดใน console
          throw new Error(`Error setting cookies: ${error}`);
          // ขว้างข้อผิดพลาดพร้อมข้อความแจ้งเตือน
        }
      },
    },
  });
  // คืนค่า Supabase client ที่สามารถใช้จัดการฐานข้อมูลและการยืนยันตัวตน
};