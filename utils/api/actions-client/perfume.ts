"use client";
// บอกว่าโค้ดนี้ทำงานฝั่ง Client (หน้าเว็บ) แทนที่จะเป็น Server (หลังบ้าน)

import { FetchPerfumeResult } from "@/types/perfume";
import { supabaseClient } from "@/utils/supabase/client";
// นำเข้าคลาส supabaseClient สำหรับเชื่อมต่อกับ Supabase เพื่อเรียกใช้ฐานข้อมูลและฟังก์ชันต่าง ๆ
// ฟังก์ชันสำหรับแนะนำ (สุ่ม) น้ำหอม

export const RecommendPerfume = async () => {
  // ใช้ฟังก์ชัน `rpc` ของ Supabase เพื่อเรียก Stored Procedure ชื่อ `random_perfumes`
  const { data, error } = await supabaseClient.rpc("random_perfumes", {
    num_limit: 5,
  });
  // 'random_perfumes' คือชื่อฟังก์ชันที่เก็บในฐานข้อมูล (Stored Procedure)
  // `{ num_limit: 5 }` คือพารามิเตอร์ที่ส่งไปยังฟังก์ชันในฐานข้อมูล (สุ่มน้ำหอม 5 รายการ)

  if (error) {
    // ตรวจสอบว่ามีข้อผิดพลาดหรือไม่
    throw new Error(`Error fetching perfume data: ${error.message}`);
    // ถ้ามีข้อผิดพลาด ให้ขว้างข้อผิดพลาดพร้อมข้อความแจ้งเตือน
  }

  if (!data || data.length === 0) {
    // ถ้าข้อมูลที่ได้จากฐานข้อมูลว่างหรือไม่มีน้ำหอม
    throw new Error("No perfumes found");
    // ขว้างข้อผิดพลาดพร้อมข้อความ "ไม่มีน้ำหอมที่พบ"
  }

  return data;
  // คืนค่าข้อมูลน้ำหอม (ในรูปแบบ Array) ที่ได้จากฐานข้อมูล
};

export const FetchPerfume = async (
  perfumeName?: string,
  page: number = 1,
  limit: number = 20
): Promise<FetchPerfumeResult> => {
  const offset = (page - 1) * limit; // คำนวณ offset จากหน้าปัจจุบัน

  try {
    const query = supabaseClient.from("perfumes").select("*");

    // หากไม่มี perfumeName ดึงข้อมูลทั้งหมด
    if (!perfumeName) {
      query.order("name", { ascending: true });
    } else {
      query.ilike("name", `%${perfumeName}%`);
    }

    // จำกัดจำนวนรายการและกำหนด offset
    const { data, error } = await query.range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching perfumes:", error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { data: null, error: "An unexpected error occurred." };
  }
};


export const FetchPerfumeWithFilters = async (
  searchQuery?: string,
  page: number = 1,
  gender?: string,
  accords?: string[],
  top_notes?: string[],
  middle_notes?: string[],
  base_notes?: string[],

): Promise<FetchPerfumeResult> => {
  try {
    // ฟังก์ชันช่วย: ตรวจสอบ array ว่างและแปลงเป็น null
    const toNullIfEmpty = (array?: string[]) => (array && array.length > 0 ? array : null);

    // สร้าง payload ที่จะส่งเข้า RPC
    const payload = {
      search_query: searchQuery || null,
      gender_filter: gender || null,
      accords_filter: toNullIfEmpty(accords),
      top_notes_filter: toNullIfEmpty(top_notes),
      middle_notes_filter: toNullIfEmpty(middle_notes),
      base_notes_filter: toNullIfEmpty(base_notes),
      page: page,
      result_limit: 20,
    };
    // console.log("Payload:", payload)

    // เรียก RPC ฟังก์ชัน
    const { data, error } = await supabaseClient.rpc("filter_perfumes", payload);

    if (error) {
      console.error("Error calling RPC filter_perfumes:", error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { data: null, error: "An unexpected error occurred." };
  }
};