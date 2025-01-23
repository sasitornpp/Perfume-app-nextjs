"use server";
// กำหนดให้โค้ดนี้ทำงานฝั่ง Server (หลังบ้าน)

import { encodedRedirect } from "@/utils/functions/utils";
// นำเข้าฟังก์ชันที่ใช้สำหรับ redirect พร้อมกับส่งข้อความ (utility function)

import { createServer } from "@/utils/supabase/server";
// นำเข้าฟังก์ชันสำหรับสร้างการเชื่อมต่อกับ Supabase

import { headers } from "next/headers";
// นำเข้าเครื่องมือที่ใช้ดึง header จากคำขอ HTTP เช่น URL ของหน้าเว็บ

import { redirect } from "next/navigation";
// ฟังก์ชันสำหรับย้ายผู้ใช้ไปยังหน้าอื่น (redirect)

// ฟังก์ชันสำหรับสมัครสมาชิก
export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  // ดึงค่า email จากแบบฟอร์มและแปลงเป็น string
  const password1 = formData.get("password1")?.toString();
  // ดึงค่า password1 จากแบบฟอร์มและแปลงเป็น string
  const password2 = formData.get("password2")?.toString();
  // ดึงค่า password2 จากแบบฟอร์มและแปลงเป็น string

  if (password1 !== password2) {
    // ถ้า password1 และ password2 ไม่เท่ากัน
    return encodedRedirect("error", "/sign-up", "Passwords do not match");
    // ส่งข้อความแจ้งเตือนข้อผิดพลาด
  }

  const password = password1;

  const supabase = await createServer();
  // สร้างการเชื่อมต่อกับ Supabase
  const origin = (await headers()).get("origin");
  // ดึงค่า origin (URL ของเว็บ) จาก header

  if (!email || !password) {
    // ถ้า email หรือ password ไม่มีค่า
    return { error: "Email and password are required" };
    // ส่งข้อความแจ้งเตือนข้อผิดพลาด
  }

  const { error } = await supabase.auth.signUp({
    // เรียก API ของ Supabase เพื่อสมัครสมาชิก
    email,
    // ส่งอีเมลไปยัง API
    password,
    // ส่งรหัสผ่านไปยัง API
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      // ระบุ URL ที่จะ redirect หลังจากยืนยันอีเมลสำเร็จ
    },
  });

  if (error) {
    // ถ้ามีข้อผิดพลาด
    console.error(error.code + " " + error.message);
    // แสดงข้อความข้อผิดพลาดใน console
    return encodedRedirect("error", "/sign-up", error.message);
    // ย้ายผู้ใช้ไปหน้าสมัครสมาชิกพร้อมแสดงข้อความข้อผิดพลาด
  } else {
    // ถ้าสมัครสมาชิกสำเร็จ
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link."
      // แจ้งข้อความสำเร็จ
    );
  }
};

// ฟังก์ชันสำหรับเข้าสู่ระบบ
export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  // ดึง email จากแบบฟอร์ม
  const password = formData.get("password") as string;
  // ดึง password จากแบบฟอร์ม
  const supabase = await createServer();
  // สร้างการเชื่อมต่อกับ Supabase

  const { error } = await supabase.auth.signInWithPassword({
    // ใช้ API ของ Supabase เพื่อเข้าสู่ระบบด้วย email และ password
    email,
    password,
  });

  if (error) {
    // ถ้าเข้าสู่ระบบล้มเหลว
    return encodedRedirect("error", "/sign-in", error.message);
    // ย้ายไปหน้าล็อกอินพร้อมข้อความข้อผิดพลาด
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", (await supabase.auth.getUser()).data.user?.id)
    .single();
  // ดึงข้อมูลผู้ใช้จากตาราง `profiles` โดยใช้ `id` ของผู้ใช้ที่เข้าสู่ระบบ
  console.log(profile)

  if (profileError) {
    console.error(profileError);
    // ถ้ามีข้อผิดพลาดในการดึงข้อมูลผู้ใช้
    return redirect("/survey-form");
    // ย้ายไปหน้าหลัก
  }

  return redirect("/");
  // ถ้ายังไม่มีชื่อ ให้ย้ายไปหน้ากรอกข้อมูลส่วนตัว
};


// ฟังก์ชันสำหรับออกจากระบบ
export const signOutAction = async () => {
  // สร้างการเชื่อมต่อกับ Supabase
  const supabase = await createServer();

  // ออกจากระบบ
  const { error } = await supabase.auth.signOut();

  // ตรวจสอบข้อผิดพลาด
  if (error) {
    console.error("Error signing out:", error);
    throw new Error("Sign out failed.");
  }

  // ย้ายไปหน้าล็อกอิน
  return redirect("/sign-in");
};
