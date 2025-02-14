import { createBrowserClient } from "@supabase/ssr";
// นำเข้า `createBrowserClient` จาก Supabase SDK
// ใช้สำหรับสร้าง Supabase client สำหรับทำงานในฝั่ง Browser (Client-side)

// สร้างฟังก์ชัน `createClient` สำหรับสร้าง Supabase client
const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, 
    // รับ URL ของ Supabase จาก environment variable `NEXT_PUBLIC_SUPABASE_URL`
    // เครื่องหมาย `!` บอก TypeScript ว่าค่านี้จะไม่เป็น `null` หรือ `undefined`

    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! 
    // รับ Anonymous Key ของ Supabase จาก environment variable `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    // เครื่องหมาย `!` บอก TypeScript ว่าค่านี้จะไม่เป็น `null` หรือ `undefined`
  );

// ส่งออก Supabase client ที่สร้างจาก `createClient`
export const supabaseClient = createClient();
// - เรียกฟังก์ชัน `createClient` เพื่อสร้าง Supabase client
// - `supabaseClient` สามารถนำไปใช้งานในส่วนต่าง ๆ ของโปรเจกต์
