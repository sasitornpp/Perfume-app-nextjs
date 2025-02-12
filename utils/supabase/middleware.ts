import { createServerClient } from "@supabase/ssr";
// นำเข้า `createServerClient` จาก Supabase SDK สำหรับสร้าง Supabase client บนฝั่ง Server

import { type NextRequest, NextResponse } from "next/server";
// นำเข้า `NextRequest` และ `NextResponse` จาก Next.js เพื่อจัดการคำขอ (Request) และคำตอบ (Response)

// ฟังก์ชัน `updateSession` ใช้สำหรับอัปเดตสถานะเซสชันของผู้ใช้
export const updateSession = async (request: NextRequest) => {
  try {
    // สร้าง Response เริ่มต้น โดยใช้ข้อมูล header จากคำขอ (Request)
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    // สร้าง Supabase client สำหรับ Server
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!, // ดึง URL ของ Supabase จาก environment variable
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // ดึง Anonymous Key ของ Supabase
      {
        cookies: {
          // ฟังก์ชันสำหรับอ่าน cookies ทั้งหมด
          getAll() {
            return request.cookies.getAll();
          },
          // ฟังก์ชันสำหรับตั้งค่า cookies
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            // ตั้งค่า cookies ใหม่ใน `request`

            response = NextResponse.next({
              request,
            });
            // อัปเดต Response

            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
            // ตั้งค่า cookies ใหม่ใน `response`
          },
        },
      }
    );

    // ดึงข้อมูลผู้ใช้ปัจจุบันจาก Supabase
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // ดึงข้อมูลโปรไฟล์จากตาราง `profiles` โดยใช้ `id` ของผู้ใช้
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id)
      .single();

    // ตรวจสอบว่าผู้ใช้ไม่ได้ล็อกอิน หรือเกิดข้อผิดพลาดในโปรไฟล์
    if (!user) {
      if (
        request.nextUrl.pathname !== "/sign-in" &&
        request.nextUrl.pathname !== "/sign-up" &&
        request.nextUrl.pathname !== "/"
      ) {
        // ถ้าผู้ใช้ยังไม่ได้ล็อกอิน และหน้า URL ไม่ใช่ `/sign-in`, `/sign-up` หรือ `/`
        return NextResponse.redirect(new URL("/sign-in", request.url));
        // เปลี่ยนเส้นทางไปยังหน้าล็อกอิน `/sign-in`
      }
    } else if (
      profiles &&
      request.nextUrl.pathname === "/survey-form"
    ) {
      // ถ้าผู้ใช้ล็อกอินแล้ว แต่พยายามเข้าหน้า `/survey-form` และมีชื่อในโปรไฟล์แล้ว
      return NextResponse.redirect(new URL("/search", request.url));
      // เปลี่ยนเส้นทางกลับไปที่หน้าแรก `/`
    }

    // ส่ง Response ที่อัปเดตแล้วกลับไป
    return response;
  } catch (e) {
    // จัดการข้อผิดพลาด
    console.error(e); // แสดงข้อผิดพลาดใน console

    // ส่ง Response ที่อัปเดต header แต่ไม่ได้เปลี่ยนแปลงเพิ่มเติม
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
