// กำหนดโครงสร้างข้อมูลสำหรับน้ำหอม (Perfume)
export interface Perfume {
  name: string;
  // ชื่อน้ำหอม เช่น "Dior Sauvage" หรือ "Chanel No.5"

  brand: string;
  // แบรนด์ของน้ำหอม เช่น "Dior", "Chanel", หรือ "Gucci"

  gender: string;
  // เพศที่เหมาะสมกับน้ำหอม เช่น "Male", "Female", หรือ "Unisex"

  accords: string[];
  // กลิ่นเด่น (Accords) ของน้ำหอม เช่น ["Citrus", "Woody", "Floral"]
  // เก็บเป็น Array ของข้อความ เพื่อแสดงกลิ่นที่ผู้ใช้อาจสนใจ

  description: string;
  // คำอธิบายละเอียดเกี่ยวกับน้ำหอม เช่น "น้ำหอมที่มีส่วนผสมจากมะกรูด ผสมผสานกลิ่นดอกไม้..."

  perfumer: string;
  // ชื่อนักปรุงน้ำหอม (Perfumer) เช่น "Francis Kurkdjian" หรือ "Alberto Morillas"

  top_notes: string[];
  // กลิ่นแรก (Top Notes) ที่สัมผัสได้ทันทีเมื่อฉีดน้ำหอม
  // เช่น ["Bergamot", "Pepper"] (เก็บเป็น Array)

  middle_notes: string[];
  // กลิ่นกลาง (Middle Notes) ที่ปรากฏหลังจากกลิ่นแรกเริ่มจาง
  // เช่น ["Lavender", "Nutmeg"] (เก็บเป็น Array)

  base_notes: string[];
  // กลิ่นฐาน (Base Notes) ที่คงอยู่หลังจากกลิ่นกลางจางลง
  // เช่น ["Cedarwood", "Vanilla"] (เก็บเป็น Array)

  rating: number;
  // คะแนนเฉลี่ยของน้ำหอม (Rating) เช่น 4.5 (เต็ม 5 ดาว)

  total_votes: number;
  // จำนวนโหวตทั้งหมดที่น้ำหอมได้รับ เช่น 120 โหวต

  img: string[];
  // URL ของภาพน้ำหอม เช่น ["https://example.com/img1.jpg", "https://example.com/img2.jpg"]
  // เก็บเป็น Array เพื่อรองรับหลายภาพ

  logo: string;
  // URL ของโลโก้แบรนด์น้ำหอม เช่น "https://example.com/logo.jpg"
}


export interface FetchPerfumeResult {
  data: Perfume[] | null;
  error: string | null;
}

export interface Filters {
  searchQuery?: string;
  band?: string;
  page: number;
  gender?: string;
  accords?: string[];
  top_notes?: string[];
  middle_notes?: string[];
  base_notes?: string[];
}

export const FiltersPerfumeValues = {
  searchQuery: "",
  band: "",
  page: 1,
  gender: "",
  accords: [],
  top_notes: [],
  middle_notes: [],
  base_notes: [],
}